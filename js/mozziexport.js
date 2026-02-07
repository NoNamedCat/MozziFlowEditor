/**
 * MOZZIFLOW EXPORT ENGINE - PURE AGNOSTIC ASSEMBLER (v19.0 Master Hardware)
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

    // Determine Audio Mode
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
        if (def && def.mozzi && (def.mozzi.is_sink || node.type === "mozziflow/out")) visit(id); 
    });

    var variableTypes = {}; 
    var activeNodesSet = new Set(sorted);

    Object.values(links).forEach(lk => {
        var prevId = lk.prev_node;
        if (!activeNodesSet.has(prevId)) return;
        var node = nodes[prevId];
        var def = node._def || (typeof NodeLibrary !== 'undefined' ? NodeLibrary.find(n => n.nodetype === node.type) : null);
        if (!def) return;
        var varName = "node_" + prevId + "_" + lk.prev_outlet;
        if (!variableTypes[varName]) {
            variableTypes[varName] = (node.data && node.data.out_type) || (def.rpdnode.outlets && def.rpdnode.outlets[lk.prev_outlet] ? def.rpdnode.outlets[lk.prev_outlet].type : 'mozziflow/int32_t');
        }
    });

    Object.keys(variableTypes).forEach(varName => {
        var typeKey = variableTypes[varName];
        var cppType = (typeof window !== 'undefined' && window.MOZZI_TYPES && window.MOZZI_TYPES[typeKey]) ? window.MOZZI_TYPES[typeKey].cpp : "int32_t";
        codeParts.globals.push(cppType + " " + varName + " = 0;");
    });

    sorted.forEach(id => {
        var node = nodes[id]; var def = node._def || (typeof NodeLibrary !== 'undefined' ? NodeLibrary.find(n => n.nodetype === node.type) : null);
        if (!def || node.type === "mozziflow/out") return;
        var prefix = (def.nodeclass ? def.nodeclass.toLowerCase() : "node") + "_";
        var inst = prefix + id;
        var mode = parseInt(node.data.rate_mode) || 0;
        var rateName = mode === 2 ? "AUDIO" : (mode === 1 ? "CONTROL" : (def.mozzi && def.mozzi.rate ? def.mozzi.rate.toUpperCase() : "CONTROL"));
        var rate = "MOZZI_" + rateName + "_RATE";
        if (def.mozzi && def.mozzi.global) codeParts.globals.push(def.mozzi.global(node, inst, rate));
        else if (!def.mozzi.is_inline && def.nodeclass) codeParts.globals.push(def.nodeclass + " " + inst + ";");
    });

    var globalObj = (typeof window !== 'undefined') ? window : (typeof global !== 'undefined' ? global : {});
    globalObj.isWired = function(nodeId, outletName) { return variableTypes["node_" + nodeId + "_" + outletName] !== undefined; };

    sorted.forEach(id => {
        var node = nodes[id]; 
        var def = node._def || (typeof NodeLibrary !== 'undefined' ? NodeLibrary.find(n => n.nodetype === node.type) : null);
        if (!def || !def.mozzi || node.type === "mozziflow/out") return;
        var prefix = (def.nodeclass ? def.nodeclass.toLowerCase() : "node") + "_";
        var inst = prefix + id;
        var inputs = {};
        if (node.data) { for (var k in node.data) { if (k.indexOf("cfg_") === 0) inputs[k.replace("cfg_", "")] = node.data[k]; else inputs[k] = node.data[k]; } } // Fixed: Added missing else condition for inputs
        Object.values(links).forEach(lk => {
            if (lk.next_node == id) {
                var inName = lk.next_inlet || lk.alias || lk.inlet_alias;
                if (activeNodesSet.has(lk.prev_node)) inputs[inName] = "node_" + lk.prev_node + "_" + lk.prev_outlet;
            }
        });
        var actualInlets = (node.rpdNode && node.rpdNode.inlets) ? node.rpdNode.inlets : (def.rpdnode.inlets || {});
        Object.keys(actualInlets).forEach(inName => { if (inputs[inName] === undefined) inputs[inName] = (def.mozzi.defaults && def.mozzi.defaults[inName]) || "0"; });

        if (def.mozzi.includes) def.mozzi.includes.forEach(inc => codeParts.includes.add(inc));
        if (def.mozzi.definitions) def.mozzi.definitions.forEach(d => codeParts.definitions.add(d));

        function process(code) {
            if (!code) return null;
            var lines = code.split('\n').map(l => l.trim()).filter(l => l.length > 0);
            return lines.map(l => l + (l.endsWith(';') || l.endsWith('}') || l.endsWith('{') || l.includes('if(') || l.endsWith(':') ? "" : ";")).join('\n    ');
        }

        if (def.mozzi.setup) codeParts.setup.push(process(def.mozzi.setup(node, inst, inputs)));
        if (def.mozzi.hooks) { Object.keys(def.mozzi.hooks).forEach(hName => { if (!codeParts.hooks[hName]) codeParts.hooks[hName] = []; codeParts.hooks[hName].push(def.mozzi.hooks[hName](node, inst, inputs)); }); }

        var isAudio = parseInt(node.data.rate_mode) === 2 || (parseInt(node.data.rate_mode) === 0 && def.mozzi && def.mozzi.rate === "audio");
        if (isAudio) {
            if (def.mozzi.audio) codeParts.audio.push(process(def.mozzi.audio(node, inst, inputs)));
            if (def.mozzi.control && def.mozzi.control !== def.mozzi.audio) codeParts.control.push(process(def.mozzi.control(node, inst, inputs)));
        } else {
            var cCode = def.mozzi.control ? def.mozzi.control(node, inst, inputs) : (def.mozzi.audio ? def.mozzi.audio(node, inst, inputs) : null);
            if (cCode) codeParts.control.push(process(cCode));
        }
    });

    var output = [];
    output.push("#define MOZZI_AUDIO_MODE " + finalMode);
    output.push("#define MOZZI_AUDIO_CHANNELS " + (outData.cfg_channels || "MOZZI_MONO"));
    output.push("#define CONTROL_RATE " + (outData.cfg_control_rate || "64"));
    
    // Pin Definitions
    if (finalMode === "MOZZI_OUTPUT_PWM" || finalMode === "MOZZI_OUTPUT_2PIN_PWM") {
        if (outData.cfg_pin_1) {
            output.push("#define MOZZI_AUDIO_PIN_1 " + outData.cfg_pin_1);
            if (outData.cfg_arch === "avr") {
                if (outData.cfg_pin_1 === "9") output.push("#define MOZZI_AUDIO_PIN_1_REGISTER OCR1A");
                else if (outData.cfg_pin_1 === "10") output.push("#define MOZZI_AUDIO_PIN_1_REGISTER OCR1B");
            }
        }
        if (outData.cfg_pin_2) {
            if (finalMode === "MOZZI_OUTPUT_2PIN_PWM") {
                output.push("#define MOZZI_AUDIO_PIN_1_LOW " + outData.cfg_pin_2);
                if (outData.cfg_arch === "avr") {
                    if (outData.cfg_pin_2 === "9") output.push("#define MOZZI_AUDIO_PIN_1_LOW_REGISTER OCR1A");
                    else if (outData.cfg_pin_2 === "10") output.push("#define MOZZI_AUDIO_PIN_1_LOW_REGISTER OCR1B");
                }
            } else {
                output.push("#define MOZZI_AUDIO_PIN_2 " + outData.cfg_pin_2);
                if (outData.cfg_arch === "avr") {
                    if (outData.cfg_pin_2 === "9") output.push("#define MOZZI_AUDIO_PIN_2_REGISTER OCR1A");
                    else if (outData.cfg_pin_2 === "10") output.push("#define MOZZI_AUDIO_PIN_2_REGISTER OCR1B");
                }
            }
        }
    } else if (finalMode === "MOZZI_OUTPUT_I2S_DAC" || finalMode === "MOZZI_OUTPUT_PDM_VIA_I2S") {
        output.push("#define MOZZI_I2S_FORMAT " + (outData.cfg_i2s_format || "MOZZI_I2S_FORMAT_PLAIN"));
        if (outData.cfg_pin_bck) output.push("#define MOZZI_I2S_PIN_BCK " + outData.cfg_pin_bck);
        if (outData.cfg_pin_ws) {
            var wsPin = outData.cfg_pin_ws;
            if (outData.cfg_arch === "rp2040") wsPin = "(MOZZI_I2S_PIN_BCK + 1)"; 
            output.push("#define MOZZI_I2S_PIN_WS " + wsPin);
        }
        if (outData.cfg_pin_data) output.push("#define MOZZI_I2S_PIN_DATA " + outData.cfg_pin_data);
    }

    // Explicit Bits for External/Manual modes
    if (finalMode === "MOZZI_OUTPUT_EXTERNAL_TIMED" || finalMode === "MOZZI_OUTPUT_EXTERNAL_CUSTOM") {
        output.push("#define MOZZI_AUDIO_BITS 16");
    }

    output.push("\n#include <Mozzi.h>\n#include <FixMath.h>");
    if (rawMode === "EXTERNAL_PT8211_SPI") output.push("#include <SPI.h>");
    Array.from(codeParts.includes).forEach(inc => { if (inc !== "#include <Mozzi.h>" && inc !== "#include <FixMath.h>") output.push(inc); });
    
    output.push("\n// GLOBALS\n" + (codeParts.globals.length > 0 ? codeParts.globals.join('\n') : "// No globals"));

    // Custom audioOutput for PT8211/SPI
    if (rawMode === "EXTERNAL_PT8211_SPI") {
        var ws_pin = outData.cfg_pin_ws || "5";
        var isStereo = (outData.cfg_channels === "MOZZI_STEREO");
        var customOut = "void audioOutput(const AudioOutput f) {\n";
        customOut += "    digitalWrite(" + ws_pin + ", LOW);\n";
        customOut += "    SPI.transfer16(" + (isStereo ? "f.r()" : "f.l()") + ");\n";
        customOut += "    digitalWrite(" + ws_pin + ", HIGH);\n";
        customOut += "    SPI.transfer16(f.l());\n";
        customOut += "}";
        output.push("\n" + customOut);
    }

    var finalDefinitions = Array.from(codeParts.definitions).map(function(defLine) {
        var nl = defLine; 
        var hooksMap = {
            "midi_on": "/*HOOK:midi_on*/", "midi_off": "/*HOOK:midi_off*/",
            "midi_pb": "/*HOOK:midi_pb*/", "midi_rt": "/*HOOK:midi_rt*/",
            "midi_pc": "/*HOOK:midi_pc*/", "midi_at": "/*HOOK:midi_at*/", "midi_pp": "/*HOOK:midi_pp*/",
            "midi_cc": "/*HOOK:midi_cc*/"
        };
        Object.keys(hooksMap).forEach(function(h) { 
            var p = hooksMap[h]; 
            if (nl.indexOf(p) !== -1) nl = nl.replace(p, (codeParts.hooks[h] ? codeParts.hooks[h].join('\n    ') : "")); 
        });
        return nl;
    });

    // Add Master Callbacks for CH32 MIDI if needed
    if (Object.keys(codeParts.hooks).length > 0) {
        var masterCallbacks = [
            "void handlePitchBend(uint8_t channel, int value) {\n    /*HOOK:midi_pb*/\n}",
            "void handleRealTime(uint8_t rt) {\n    /*HOOK:midi_rt*/\n}",
            "void handleProgramChange(uint8_t channel, uint8_t program) {\n    /*HOOK:midi_pc*/\n}",
            "void handleAfterTouch(uint8_t channel, uint8_t pressure) {\n    /*HOOK:midi_at*/\n}",
            "void handlePolyPressure(uint8_t channel, uint8_t note, uint8_t pressure) {\n    /*HOOK:midi_pp*/\n}"
        ];
        masterCallbacks.forEach(function(cb) {
            var exists = false;
            finalDefinitions.forEach(function(d) { if (d.indexOf(cb.split('{')[0]) !== -1) exists = true; });
            if (!exists) {
                var nl = cb;
                Object.keys(hooksMap).forEach(function(h) { 
                    var p = hooksMap[h]; if (nl.indexOf(p) !== -1) nl = nl.replace(p, (codeParts.hooks[h] ? codeParts.hooks[h].join('\n    ') : "")); 
                });
                finalDefinitions.push(nl);
            }
        });
    }
    if (finalDefinitions.length > 0) output.push("\n" + finalDefinitions.join('\n'));
    
    output.push("\nvoid setup() {\n    " + (rawMode === "EXTERNAL_PT8211_SPI" ? "pinMode(" + (outData.cfg_pin_ws || "5") + ", OUTPUT); SPI.begin(); SPI.beginTransaction(SPISettings(20000000, MSBFIRST, SPI_MODE0));" : "") + "\n    startMozzi();\n    " + codeParts.setup.filter(s => s !== null).join('\n    ') + "\n}");
    output.push("\nvoid updateControl() {\n    " + codeParts.control.filter(c => c !== null).join('\n    ') + "\n}");
    
    // Build updateAudio Return
    var inL = "0", inR = "0";
    Object.values(links).forEach(lk => {
        if (lk.next_node === audioOutNodeId) {
            if (lk.next_inlet === "in") inL = "node_" + lk.prev_node + "_" + lk.prev_outlet;
            if (lk.next_inlet === "in_r") inR = "node_" + lk.prev_node + "_" + lk.prev_outlet;
        }
    });
    var isStereo = (outData.cfg_channels === "MOZZI_STEREO");
    var useGain = (outData.cfg_use_gain === "true");
    var gainVal = (outData.cfg_post_gain || "1.0") + "f";
    
    var finalL = useGain ? "(" + inL + " * " + gainVal + ")" : inL;
    var finalR = useGain ? "(" + inR + " * " + gainVal + ")" : inR;

    var audioRet = isStereo ? "return StereoOutput(" + finalL + ", " + finalR + ").clip();" : "return MonoOutput(" + finalL + ").clip();";
    output.push("\nAudioOutput updateAudio() {\n    " + (codeParts.audio.length > 0 ? codeParts.audio.join('\n    ') : "") + "\n    " + audioRet + "\n}");
    
    var finalLoop = ["audioHook();"];
    if (codeParts.hooks["midi_on"] || codeParts.hooks["midi_cc"]) finalLoop.unshift("USBMIDI.poll();");
    output.push("\nvoid loop() {\n    " + finalLoop.join('\n    ') + "\n}");
    
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