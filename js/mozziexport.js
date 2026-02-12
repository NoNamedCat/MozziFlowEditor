/**
 * MOZZIFLOW EXPORT ENGINE - PURE ATOMIC ASSEMBLY (v21.3 Global Uniqueness)
 */

function exportToMozzi(project, canvas) {
    var nodes = project.nodes; var links = project.links;
    var codeParts = { 
        includes: new Set(["#include <Mozzi.h>", "#include <FixMath.h>"]), 
        definitions: new Set(), globals: [], setup: [], control: [], audio: [],
        hooks: {} 
    };
    
    var audioOutNodeId = Object.keys(nodes).find(id => nodes[id].type === "mozziflow/out");
    var mainOutNode = audioOutNodeId ? nodes[audioOutNodeId] : null;
    var outData = (mainOutNode && mainOutNode.data) ? mainOutNode.data : {};

    var rawMode = outData.cfg_mode || "MOZZI_OUTPUT_PWM";
    var finalMode = (rawMode === "EXTERNAL_PT8211_SPI") ? "MOZZI_OUTPUT_EXTERNAL_TIMED" : rawMode;

    var sorted = []; var visited = new Set(); var stack = new Set();
    function visit(id) {
        if (stack.has(id)) return; if (visited.has(id)) return;
        stack.add(id); 
        Object.values(links).forEach(lk => { if (lk.next_node === id) visit(lk.prev_node); });
        stack.delete(id); visited.add(id); sorted.push(id);
    }
    Object.keys(nodes).forEach(id => { 
        var node = nodes[id];
        var def = node._def || (typeof NodeLibrary !== 'undefined' ? NodeLibrary.find(n => n.nodetype === node.type) : null);
        if (node.type === "mozziflow/out" || (def && def.mozzi && def.mozzi.is_sink)) visit(id); 
    });

    var variableTypes = {}; 
    var activeNodesSet = new Set(sorted);

    // PHASE 1: COLLECT ALL STATIC ASSETS (Includes, Types, Globals)
    sorted.forEach(id => {
        var node = nodes[id]; 
        var def = node._def || (typeof NodeLibrary !== 'undefined' ? NodeLibrary.find(n => n.nodetype === node.type) : null);
        if (!def || !def.mozzi) return;

        if (def.mozzi.includes) def.mozzi.includes.forEach(inc => codeParts.includes.add(inc));
        if (def.mozzi.definitions) def.mozzi.definitions.forEach(d => codeParts.definitions.add(d));

        var varNameBase = "node_" + id + "_";
        var defOutlets = (node.rpdNode && node.rpdNode.outlets) ? node.rpdNode.outlets : (def.rpdnode.outlets || {});
        Object.keys(defOutlets).forEach(oName => {
            var varName = varNameBase + oName;
            var type = null;
            if (def.mozzi && typeof def.mozzi.output_type === 'function') { type = def.mozzi.output_type(node); }
            if (!type) type = (node.data && node.data.out_type) || (def.rpdnode.outlets && def.rpdnode.outlets[oName] ? def.rpdnode.outlets[oName].type : 'mozziflow/int32_t');
            variableTypes[varName] = type;
        });
    });

    // Populate GLOBALS from collected types (Ensure Uniqueness)
    var declaredGlobals = new Set();
    Object.keys(variableTypes).forEach(varName => {
        if (declaredGlobals.has(varName)) return;
        var typeKey = variableTypes[varName];
        var cppType = "int32_t";
        if (typeof window !== 'undefined' && window.MOZZI_TYPES && window.MOZZI_TYPES[typeKey]) cppType = window.MOZZI_TYPES[typeKey].cpp;
        else if (typeKey && typeKey.indexOf('/') === -1) cppType = typeKey;
        codeParts.globals.push(cppType + " " + varName + " = 0;");
        declaredGlobals.add(varName);
    });

    // Node instance globals (Ensure Uniqueness)
    var declaredInstances = new Set();
    sorted.forEach(id => {
        var node = nodes[id]; var def = node._def || (typeof NodeLibrary !== 'undefined' ? NodeLibrary.find(n => n.nodetype === node.type) : null);
        if (!def || node.type === "mozziflow/out") return;
        var prefix = (def.nodeclass ? def.nodeclass.toLowerCase() : "node") + "_";
        var inst = prefix + id;
        if (declaredInstances.has(inst)) return;
        
        var mode = parseInt(node.data.rate_mode) || 0;
        var rateName = mode === 2 ? "AUDIO" : (mode === 1 ? "CONTROL" : (def.mozzi && def.mozzi.rate ? def.mozzi.rate.toUpperCase() : "CONTROL"));
        var rate = "MOZZI_" + rateName + "_RATE";
        if (def.mozzi && def.mozzi.global) codeParts.globals.push(def.mozzi.global(node, inst, rate));
        else if (def.mozzi && !def.mozzi.is_inline && def.nodeclass) codeParts.globals.push(def.nodeclass + " " + inst + ";");
        declaredInstances.add(inst);
    });

    var globalObj = (typeof window !== 'undefined') ? window : (typeof global !== 'undefined' ? global : {});
    globalObj.isWired = function(nodeId, outletName) { return variableTypes["node_" + nodeId + "_" + outletName] !== undefined; };

    // PHASE 2: LOGIC
    sorted.forEach(id => {
        var node = nodes[id]; 
        var def = node._def || (typeof NodeLibrary !== 'undefined' ? NodeLibrary.find(n => n.nodetype === node.type) : null);
        if (!def || !def.mozzi || node.type === "mozziflow/out") return;
        var inst = (def.nodeclass ? def.nodeclass.toLowerCase() : "node") + "_" + id;
        var inputs = {};
        if (node.data) { for (var k in node.data) { if (k.indexOf("cfg_") === 0) inputs[k.replace("cfg_", "")] = node.data[k]; else inputs[k] = node.data[k]; } } 
        Object.values(links).forEach(lk => {
            if (lk.next_node == id) {
                var inName = lk.next_inlet || lk.alias || lk.inlet_alias;
                if (activeNodesSet.has(lk.prev_node)) inputs[inName] = "node_" + lk.prev_node + "_" + lk.prev_outlet;
            }
        });
        var actualInlets = (node.rpdNode && node.rpdNode.inlets) ? node.rpdNode.inlets : (def.rpdnode.inlets || {});
        Object.keys(actualInlets).forEach(inName => { if (inputs[inName] === undefined) inputs[inName] = (def.mozzi.defaults && def.mozzi.defaults[inName]) || "0"; });

        var localDecls = [];
        if (def.mozzi.inputs) {
            Object.keys(def.mozzi.inputs).forEach(key => {
                if (inputs[key] !== undefined) {
                    var contract = def.mozzi.inputs[key];
                    var type = (typeof contract.type === 'function') ? contract.type(node) : contract.type;
                    var rawVal = inputs[key];
                    var cleanVal = rawVal;
                    var isVariable = (typeof rawVal === 'string' && rawVal.indexOf("node_") !== -1);
                    
                    if (isVariable) {
                        var sourceVar = rawVal;
                        var srcTypeKey = variableTypes[sourceVar]; 
                        var srcCppType = "int32_t";
                        if (typeof window !== 'undefined' && window.MOZZI_TYPES && window.MOZZI_TYPES[srcTypeKey]) srcCppType = window.MOZZI_TYPES[srcTypeKey].cpp;
                        else if (srcTypeKey && srcTypeKey.indexOf('/') === -1) srcCppType = srcTypeKey;

                        var isSourceFix = (srcCppType.indexOf("SFix") !== -1 || srcCppType.indexOf("UFix") !== -1 || srcCppType === "Q16n16");
                        var isSourceInt = (srcCppType.indexOf("int") !== -1 || srcCppType === "long" || srcCppType === "short" || srcCppType === "char" || srcCppType === "byte" || srcCppType === "uint8_t" || srcCppType === "uint16_t" || srcCppType === "uint32_t" || srcCppType === "bool");
                        var isDestInt = (type.indexOf("int") !== -1 || type === "long" || type === "short" || type === "char" || type === "byte" || type === "uint8_t" || type === "uint16_t" || type === "uint32_t" || type === "bool");
                        var isDestFloat = (type === "float" || type === "double");
                        var isDestFix = (type.indexOf("SFix") !== -1 || type.indexOf("UFix") !== -1);

                        var normSrc = srcCppType.replace("_t", "").replace("long", "int32").replace("int", "int32").replace("double", "float").replace("3232", "32");
                        var normDest = type.replace("_t", "").replace("long", "int32").replace("int", "int32").replace("double", "float").replace("3232", "32");
                        
                        if (srcCppType === type || normSrc === normDest) { cleanVal = rawVal; }
                        else if (isDestFix) { cleanVal = type + "(" + rawVal + ")"; } 
                        else if (isSourceFix && isDestInt) {
                            if (normDest === "int32") cleanVal = rawVal + ".asInt()";
                            else cleanVal = "(" + type + ")" + rawVal + ".asInt()";
                        } else if (isSourceFix && isDestFloat) { cleanVal = rawVal + ".asFloat()"; }
                        else if (isSourceInt && isDestInt) { cleanVal = rawVal; }
                        else if (srcCppType === "float" && type === "Q16n16") { cleanVal = "float_to_Q16n16(" + rawVal + ")"; }
                        else { cleanVal = "(" + type + ")" + rawVal; }
                    } else {
                        var macro = (typeof contract.literal_macro === 'function') ? contract.literal_macro(node) : contract.literal_macro;
                        if (macro) cleanVal = macro + "(" + rawVal + ")";
                        else { if (type.indexOf('<') !== -1) cleanVal = type + "(" + rawVal + ")"; else cleanVal = rawVal; }
                    }
                    var localName = "_in_" + id + "_" + key;
                    localDecls.push({ name: localName, decl: type + " " + localName + " = " + cleanVal + ";" });
                    inputs[key] = localName;
                }
            });
        }

        function process(code) {
            if (!code) return null;
            var lines = code.split('\n').map(l => l.trim()).filter(l => l.length > 0);
            return lines.map(l => {
                if (l.startsWith('#')) return l; 
                return l + (l.endsWith(';') || l.endsWith('}') || l.endsWith('{') || l.includes('if(') || l.endsWith(':') ? "" : ";");
            }).join('\n    ');
        }

        function injectLocals(blockCode, decls) {
            if (!blockCode) return null;
            var needed = [];
            decls.forEach(d => { if (blockCode.indexOf(d.name) !== -1) { if (blockCode.indexOf(d.decl) === -1) needed.push(d.decl); } });
            if (needed.length > 0) return needed.join('\n    ') + "\n    " + blockCode;
            return blockCode;
        }

        if (def.mozzi.setup) codeParts.setup.push(injectLocals(process(def.mozzi.setup(node, inst, inputs)), localDecls));
        if (def.mozzi.hooks) { 
            Object.keys(def.mozzi.hooks).forEach(hName => { 
                if (!codeParts.hooks[hName]) codeParts.hooks[hName] = []; 
                var hCode = process(def.mozzi.hooks[hName](node, inst, inputs));
                codeParts.hooks[hName].push(injectLocals(hCode, localDecls)); 
            }); 
        }

        var isAudio = parseInt(node.data.rate_mode) === 2 || (parseInt(node.data.rate_mode) === 0 && def.mozzi && def.mozzi.rate === "audio");
        if (isAudio) {
            if (def.mozzi.audio) codeParts.audio.push(injectLocals(process(def.mozzi.audio(node, inst, inputs)), localDecls));
            if (def.mozzi.control && def.mozzi.control !== def.mozzi.audio) codeParts.control.push(injectLocals(process(def.mozzi.control(node, inst, inputs)), localDecls));
        } else {
            var cCode = def.mozzi.control ? def.mozzi.control(node, inst, inputs) : (def.mozzi.audio ? def.mozzi.audio(node, inst, inputs) : null);
            if (cCode) codeParts.control.push(injectLocals(process(cCode), localDecls));
        }
    });

    var output = [];
    output.push("#define MOZZI_AUDIO_MODE " + finalMode);
    output.push("#define MOZZI_AUDIO_CHANNELS " + (outData.cfg_channels || "MOZZI_MONO"));
    output.push("#define MOZZI_CONTROL_RATE " + (outData.cfg_control_rate || "64"));
    if (finalMode === "MOZZI_OUTPUT_PWM" || finalMode === "MOZZI_OUTPUT_2PIN_PWM") {
        if (outData.cfg_pin_1) { output.push("#define MOZZI_AUDIO_PIN_1 " + outData.cfg_pin_1);
            if (outData.cfg_arch === "avr") { if (outData.cfg_pin_1 === "9") output.push("#define MOZZI_AUDIO_PIN_1_REGISTER OCR1A"); else if (outData.cfg_pin_1 === "10") output.push("#define MOZZI_AUDIO_PIN_1_REGISTER OCR1B"); } }
        if (outData.cfg_pin_2) {
            if (finalMode === "MOZZI_OUTPUT_2PIN_PWM") { output.push("#define MOZZI_AUDIO_PIN_1_LOW " + outData.cfg_pin_2);
                if (outData.cfg_arch === "avr") { if (outData.cfg_pin_2 === "9") output.push("#define MOZZI_AUDIO_PIN_1_LOW_REGISTER OCR1A"); else if (outData.cfg_pin_2 === "10") output.push("#define MOZZI_AUDIO_PIN_1_LOW_REGISTER OCR1B"); }
            } else { output.push("#define MOZZI_AUDIO_PIN_2 " + outData.cfg_pin_2);
                if (outData.cfg_arch === "avr") { if (outData.cfg_pin_2 === "9") output.push("#define MOZZI_AUDIO_PIN_2_REGISTER OCR1A"); else if (outData.cfg_pin_2 === "10") output.push("#define MOZZI_AUDIO_PIN_2_REGISTER OCR1B"); } } }
    } else if (finalMode === "MOZZI_OUTPUT_I2S_DAC" || finalMode === "MOZZI_OUTPUT_PDM_VIA_I2S") {
        output.push("#define MOZZI_I2S_FORMAT " + (outData.cfg_i2s_format || "MOZZI_I2S_FORMAT_PLAIN"));
        if (outData.cfg_pin_bck) output.push("#define MOZZI_I2S_PIN_BCK " + outData.cfg_pin_bck);
        if (outData.cfg_pin_ws) output.push("#define MOZZI_I2S_PIN_WS " + (outData.cfg_arch === "rp2040" ? "(MOZZI_I2S_PIN_BCK + 1)" : outData.cfg_pin_ws));
        if (outData.cfg_pin_data) output.push("#define MOZZI_I2S_PIN_DATA " + outData.cfg_pin_data);
    }
    if (finalMode === "MOZZI_OUTPUT_EXTERNAL_TIMED" || finalMode === "MOZZI_OUTPUT_EXTERNAL_CUSTOM") output.push("#define MOZZI_AUDIO_BITS 16");
    output.push("\n#include <Mozzi.h>\n#include <FixMath.h>");
    if (rawMode === "EXTERNAL_PT8211_SPI") output.push("#include <SPI.h>");
    Array.from(codeParts.includes).forEach(inc => { if (inc !== "#include <Mozzi.h>" && inc !== "#include <FixMath.h>") output.push(inc); });
    output.push("\n// GLOBALS\n" + (codeParts.globals.length > 0 ? codeParts.globals.join('\n') : "// No globals"));
    if (rawMode === "EXTERNAL_PT8211_SPI") { var ws = outData.cfg_pin_ws || "5"; output.push("\nvoid audioOutput(const AudioOutput f) {\n    digitalWrite(" + ws + ", LOW);\n    SPI.transfer16(" + (outData.cfg_channels === "MOZZI_STEREO" ? "f.r()" : "f.l()") + ");\n    digitalWrite(" + ws + ", HIGH);\n    SPI.transfer16(f.l());\n}"); }
    var finalDefinitions = Array.from(codeParts.definitions).map(function(defLine) {
        var nl = defLine; var hooksMap = { "midi_on": "/*HOOK:midi_on*/", "midi_off": "/*HOOK:midi_off*/", "midi_pb": "/*HOOK:midi_pb*/", "midi_rt": "/*HOOK:midi_rt*/", "midi_pc": "/*HOOK:midi_pc*/", "midi_at": "/*HOOK:midi_at*/", "midi_pp": "/*HOOK:midi_pp*/", "midi_cc": "/*HOOK:midi_cc*/" };
        Object.keys(hooksMap).forEach(function(h) { var p = hooksMap[h]; if (nl.indexOf(p) !== -1) nl = nl.replace(p, (codeParts.hooks[h] ? codeParts.hooks[h].join('\n    ') : "")); });
        return nl;
    });
    if (Object.keys(codeParts.hooks).length > 0) {
        var masterCallbacks = ["void handlePitchBend(uint8_t channel, int value) {\n    /*HOOK:midi_pb*/\n}", "void handleRealTime(uint8_t rt) {\n    /*HOOK:midi_rt*/\n}", "void handleProgramChange(uint8_t channel, uint8_t program) {\n    /*HOOK:midi_pc*/\n}", "void handleAfterTouch(uint8_t channel, uint8_t pressure) {\n    /*HOOK:midi_at*/\n}", "void handlePolyPressure(uint8_t channel, uint8_t note, uint8_t pressure) {\n    /*HOOK:midi_pp*/\n}"];
        masterCallbacks.forEach(function(cb) {
            var exists = false; finalDefinitions.forEach(function(d) { if (d.indexOf(cb.split('{')[0]) !== -1) exists = true; });
            if (!exists) {
                var nl = cb; var hMap = { "midi_on": "/*HOOK:midi_on*/", "midi_off": "/*HOOK:midi_off*/", "midi_pb": "/*HOOK:midi_pb*/", "midi_rt": "/*HOOK:midi_rt*/", "midi_pc": "/*HOOK:midi_pc*/", "midi_at": "/*HOOK:midi_at*/", "midi_pp": "/*HOOK:midi_pp*/", "midi_cc": "/*HOOK:midi_cc*/" };
                Object.keys(hMap).forEach(function(h) { var p = hMap[h]; if (nl.indexOf(p) !== -1) nl = nl.replace(p, (codeParts.hooks[h] ? codeParts.hooks[h].join('\n    ') : "")); });
                finalDefinitions.push(nl);
            }
        });
    }
    if (finalDefinitions.length > 0) output.push("\n" + finalDefinitions.join('\n'));
    output.push("\nvoid setup() {\n    " + (rawMode === "EXTERNAL_PT8211_SPI" ? "pinMode(" + (outData.cfg_pin_ws || "5") + ", OUTPUT); SPI.begin(); SPI.beginTransaction(SPISettings(20000000, MSBFIRST, SPI_MODE0));" : "") + "\n    startMozzi();\n    " + codeParts.setup.filter(s => s !== null).join('\n    ') + "\n}");
    output.push("\nvoid updateControl() {\n    " + codeParts.control.filter(c => c !== null).join('\n    ') + "\n}");
    var inL = "0", inR = "0"; 
    Object.values(links).forEach(lk => { 
        if (lk.next_node === audioOutNodeId) { 
            var varName = "node_" + lk.prev_node + "_" + lk.prev_outlet;
            var typeKey = variableTypes[varName];
            var cleanVar = varName;
            
            var isFix = (typeKey && (typeKey.indexOf("SFix") !== -1 || typeKey.indexOf("UFix") !== -1 || typeKey === "Q16n16"));
            cleanVar = isFix ? varName + ".asInt()" : varName;

            if (lk.next_inlet === "in") inL = cleanVar; 
            if (lk.next_inlet === "in_r") inR = cleanVar; 
        } 
    });
    var gV = (outData.cfg_post_gain || "1.0") + "f"; var fL = (outData.cfg_use_gain === "true") ? "(" + inL + " * " + gV + ")" : inL; var fR = (outData.cfg_use_gain === "true") ? "(" + inR + " * " + gV + ")" : inR;
    output.push("\nAudioOutput updateAudio() {\n    " + (codeParts.audio.length > 0 ? codeParts.audio.join('\n    ') : "") + "\n    " + ((outData.cfg_channels === "MOZZI_STEREO") ? "return StereoOutput(" + fL + ", " + fR + ").clip();" : "return MonoOutput(" + fL + ").clip();") + "\n}");
    var fLoop = ["audioHook();"]; if (codeParts.hooks["midi_on"] || codeParts.hooks["midi_cc"]) fLoop.unshift("USBMIDI.poll();");
    output.push("\nvoid loop() {\n    " + fLoop.join('\n    ') + "\n}");
    return output.join('\n');
}

function NodeToMozziCppInternal() {
    var project = { nodes: {}, links: [] };
    if (typeof mozziFlowContainer !== 'undefined') {
        mozziFlowContainer.forEach(function(node) {
            var realData = (node.rpdNode && node.rpdNode.data) ? node.rpdNode.data : (node.data || {});
            project.nodes[node.nodeid] = { id: node.nodeid, nodeid: node.nodeid, type: node.nodetype, nodetype: node.nodetype, data: realData, _def: null };
        });
    }
    if (typeof mozziFlowClassConnection !== 'undefined') {
        mozziFlowClassConnection.forEach(function(link) {
            project.links.push({ prev_node: link.node_out_id, prev_outlet: link.outlet_alias, next_node: link.node_in_id, next_inlet: link.inlet_alias, alias: link.inlet_alias });
        });
    }
    return exportToMozzi(project, null);
}
