// Mozzi Node Definitions - SOURCE (v6.0 Absolute Fix)
var createSourceInput = function(label, node, key, defaultValue, container) {
    var row = document.createElement('div');
    row.style.display = "flex"; row.style.justifyContent = "space-between"; row.style.fontSize = "8px"; row.style.marginBottom = "2px";
    var lbl = document.createElement('span'); lbl.innerText = label + ":"; row.appendChild(lbl);
    var inp = document.createElement('input');
    inp.type = "text"; inp.style.width = "40px";
    inp.className = 'mozzi-inlet-val-input';
    inp.style.background = "#000"; inp.style.color = "#0f9"; inp.style.fontSize = "8px"; inp.style.border = "1px solid #333";
    var realKey = key.indexOf("cfg_") === 0 ? key : "cfg_" + key;
    var alias = key.replace("cfg_", "");
    inp.setAttribute('data-alias', alias);
    var val = (node.data && node.data[realKey] !== undefined) ? node.data[realKey] : defaultValue;
    inp.value = val;
    if (node.data) node.data[realKey] = val; 
    inp.oninput = function() { node.data[realKey] = this.value; };
    row.appendChild(inp);
    container.appendChild(row);
};

var createSourceFreqSelector = function(node, container) {
    var row = document.createElement('div');
    row.style.display = "flex"; row.style.flexDirection = "column"; row.style.marginBottom = "4px";
    var lbl = document.createElement('div'); lbl.innerText = "FREQ MODE"; lbl.style.fontSize = "7px"; lbl.style.color = "#0f9";
    var sel = document.createElement('select');
    sel.style.width = "100%"; sel.style.fontSize = "9px"; sel.style.background = "#222"; sel.style.color = "#0ff";
    sel.className = 'mozzi-inlet-val-input'; sel.setAttribute('data-alias', 'freq_mode');
    var opts = [["float", "Float Freq"], ["fixed", "FixMath Freq"]];
    opts.forEach(function(o){ 
        var opt = document.createElement('option'); opt.value = o[0]; opt.innerText = o[1];
        if(node.data.cfg_freq_mode === o[0]) opt.selected = true;
        sel.appendChild(opt); 
    });
    sel.onchange = function() { node.data.cfg_freq_mode = this.value; };
    if(!node.data.cfg_freq_mode) node.data.cfg_freq_mode = "float";
    row.appendChild(lbl); row.appendChild(sel); container.appendChild(row);
};

var createSourceOutSelector = function(node, container) {
    var row = document.createElement('div');
    row.style.display = "flex"; row.style.flexDirection = "column"; row.style.marginBottom = "4px";
    var lbl = document.createElement('div'); lbl.innerText = "OUT DOMAIN"; lbl.style.fontSize = "7px"; lbl.style.color = "#0f9";
    var sel = document.createElement('select');
    sel.style.width = "100%"; sel.style.fontSize = "9px"; sel.style.background = "#222"; sel.style.color = "#0ff";
    sel.className = 'mozzi-inlet-val-input'; sel.setAttribute('data-alias', 'out_domain');
    var opts = [["int8", "int8 (-128,127)"], ["sfix", "FixMath (-1,1)"]];
    opts.forEach(function(o){ 
        var opt = document.createElement('option'); opt.value = o[0]; opt.innerText = o[1];
        if(node.data.cfg_out_domain === o[0]) opt.selected = true;
        sel.appendChild(opt); 
    });
    sel.onchange = function() { node.data.cfg_out_domain = this.value; if (node._onDataUpdate) node._onDataUpdate(); };
    if(!node.data.cfg_out_domain) node.data.cfg_out_domain = "int8";
    row.appendChild(lbl); row.appendChild(sel); container.appendChild(row);
};

var _oscConfigs = [["sin", "SIN2048", "Sine"], ["saw", "SAW2048", "Saw"], ["tri", "TRIANGLE2048", "Triangle"], ["square", "SQUARE_NO_ALIAS_2048", "Square"]];
_oscConfigs.forEach(function(cfg) {
    NodeLibrary.push({
        nodetype: 'mozziflow/' + cfg[0],
        category: "wave",
        nodeclass: "Oscil",
        renderer: {
            'html': function(bodyElm, node) {
                if (!node.data) node.data = {};
                var container = document.createElement('div');
                container.style.padding = "5px"; container.style.background = "rgba(0,255,153,0.05)";
                container.style.border = "1px solid #0f9"; container.style.marginBottom = "5px";
                createSourceFreqSelector(node, container);
                createSourceOutSelector(node, container);
                createSourceInput("FREQ", node, "freq", "440.0f", container);
                if (cfg[0] === "sin") createSourceInput("PHASE", node, "phase", "0", container);
                bodyElm.appendChild(container);
            }
        },
        mozzi: {
            rate: "audio",
            includes: ["#include <Oscil.h>", "#include <tables/" + cfg[1].toLowerCase() + "_int8.h>", "#include <FixMath.h>"],
            defaults: { "freq": "440.0f", "phase": "0" },
            inputs: {
                "freq": {
                    type: function(n) { return (n.data.cfg_freq_mode === "fixed") ? "Q16n16" : "float"; },
                    literal_macro: function(n) { return (n.data.cfg_freq_mode === "fixed") ? "float_to_Q16n16" : null; }
                },
                "phase": { type: function(n) { return (n.data.cfg_freq_mode === "fixed") ? "SFix<15,16>" : "int"; } }
            },
            output_type: function(n) { return (n.data.cfg_out_domain === "sfix") ? "SFix<15,16>" : "int8_t"; },
            global: function(n, v, r) { 
                var type = (n.data.cfg_freq_mode === "fixed") ? "Q16n16" : "float";
                // Ensure proper C++ syntax: closing parenthesis for constructor and semicolon.
                return "Oscil<" + cfg[1] + "_NUM_CELLS, " + r + "> " + v + "(" + cfg[1] + "_DATA); " + type + " last_f_" + n.id + " = 0;"; 
            },
            control: function(n,v,i){
                var method = (n.data.cfg_freq_mode === "fixed") ? "setFreq_Q16n16" : "setFreq";
                return "if(last_f_" + n.id + " != " + i.freq + "){ " + v + "." + method + "(" + i.freq + "); last_f_" + n.id + " = " + i.freq + "; }"; 
            },
            audio: function(n, v, i) { 
                var call = (cfg[0] === "sin" && i.phase && i.phase != "0") ? v + ".phMod(" + i.phase + ")" : v + ".next()";
                if (n.data.cfg_out_domain === "sfix") return "node_" + n.id + "_out = SFix<0,8>::fromRaw(" + call + ");";
                return "node_" + n.id + "_out = " + call + ";"; 
            }
        },
        help: { summary: "Standard oscillator. Supports SFix output domain." },
        rpdnode: { "title": cfg[2], "inlets": (cfg[0] === "sin") ? { "freq": { "type": "mozziflow/any", "is_control": true, "label": "freq" }, "phase": { "type": "mozziflow/any", "label": "phase" } } : { "freq": { "type": "mozziflow/any", "is_control": true, "label": "freq" } }, "outlets": { "out": { "type": "mozziflow/any" } } }
    });
});

NodeLibrary.push({
    nodetype: 'mozziflow/pulse',
    category: "wave",
    nodeclass: "Phasor",
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px"; container.style.background = "rgba(0,255,153,0.05)";
            container.style.border = "1px solid #0f9"; container.style.marginBottom = "5px";
            createSourceOutSelector(node, container);
            createSourceInput("FREQ", node, "freq", "110.0f", container);
            createSourceInput("WIDTH%", node, "width", "50", container);
            bodyElm.appendChild(container);
        }
    },
    mozzi: {
        rate: "audio",
        includes: ["#include <Phasor.h>", "#include <FixMath.h>"], defaults: { "freq": "110.0f", "width": "50" },
        inputs: { "freq": { type: "float" }, "width": { type: "uint8_t" } },
        output_type: function(n) { return (n.data.cfg_out_domain === "sfix") ? "SFix<15,16>" : "int8_t"; },
        global: function(n,v,r){ return "Phasor<" + r + "> " + v + "; float last_f_" + n.id + " = 0.0f; uint32_t " + v + "_thr = 2147483648UL; uint8_t " + v + "_last_w = 0;"; },
        control: function(n,v,i){ 
            var code = "if(last_f_" + n.id + " != " + i.freq + "){ " + v + ".setFreq(" + i.freq + "); last_f_" + n.id + " = " + i.freq + "; }\n";
            code += "if(" + v + "_last_w != " + i.width + "){ " + v + "_thr = (uint32_t)((uint64_t)" + i.width + " * 4294967295ULL / 100); " + v + "_last_w = " + i.width + "; }";
            return code;
        },
        audio: function(n,v,i){ 
            var sig = "(" + v + ".next() < " + v + "_thr) ? 127 : -128";
            if (n.data.cfg_out_domain === "sfix") return "node_" + n.id + "_out = SFix<0,8>::fromRaw(" + sig + ");";
            return "node_" + n.id + "_out = " + sig + ";"; 
        }
    },
    rpdnode: { "title": "Pulse Osc", "inlets": { "freq": { "type": "mozziflow/float", "is_control": true, "label": "freq" }, "width": { "type": "mozziflow/uint8_t", "label": "width" } }, "outlets": { "out": { "type": "mozziflow/any" } } }
});

NodeLibrary.push({
    nodetype: 'mozziflow/phasor',
    category: "wave",
    nodeclass: "Phasor",
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px"; container.style.background = "rgba(0,255,153,0.05)";
            container.style.border = "1px solid #0f9"; container.style.marginBottom = "5px";
            createSourceInput("FREQ", node, "freq", "440.0f", container);
            bodyElm.appendChild(container);
        }
    },
    mozzi: {
        rate: "audio",
        includes: ["#include <Phasor.h>"], defaults: { "freq": "440.0f" },
        global: function(n,v,r){ return "Phasor<" + r + "> " + v + "; float last_f_" + n.id + " = 0.0f;"; },
        control: function(n,v,i){ return "if(last_f_" + n.id + " != " + i.freq + "){ " + v + ".setFreq(" + i.freq + "); last_f_" + n.id + " = " + i.freq + "; }"; },
        audio: function(n,v,i){ return "node_" + n.id + "_out = " + v + ".next();"; }
    },
    help: {
        summary: "High-precision phase accumulator. Loops from 0 to 4,294,967,295.",
        usage: "Use it to drive custom oscillators, waveshapers, or as a raw sawtooth-like control source.",
        inlets: { "freq": "Frequency of the cycle in Hz." },
        outlets: { "out": "32-bit unsigned phase value." }
    },
    rpdnode: { "title": "Phasor", "inlets": { "freq": { "type": "mozziflow/float", "is_control": true, "label": "freq" } }, "outlets": { "out": { "type": "mozziflow/uint32_t" } } }
});

NodeLibrary.push({
    nodetype: 'mozziflow/noise',
    category: "wave",
    nodeclass: "Noise",
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px";
            createSourceOutSelector(node, container);
            bodyElm.appendChild(container);
        }
    },
    mozzi: {
        rate: "audio", is_inline: true,
        includes: ["#include <mozzi_rand.h>", "#include <FixMath.h>"], 
        output_type: function(n) { return (n.data.cfg_out_domain === "sfix") ? "SFix<15,16>" : "int8_t"; },
        audio: function(n,v,i){ 
            var sig = "(rand(256) - 128)";
            if (n.data.cfg_out_domain === "sfix") return "node_" + n.id + "_out = SFix<0,8>::fromRaw(" + sig + ");";
            return "node_" + n.id + "_out = " + sig + ";"; 
        } 
    },
    rpdnode: { "title": "Noise", "inlets": {}, "outlets": { "out": { "type": "mozziflow/any" } } }
});

NodeLibrary.push({
    nodetype: 'mozziflow/wavepacket',
    category: "wave",
    nodeclass: "WavePacket",
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px"; container.style.background = "rgba(0,255,153,0.05)";
            container.style.border = "1px solid #0f9"; container.style.marginBottom = "5px";
            createSourceOutSelector(node, container);
            createSourceInput("FUND", node, "fund", "100", container);
            createSourceInput("BW", node, "bw", "50", container);
            createSourceInput("RES", node, "res", "100", container);
            bodyElm.appendChild(container);
        }
    },
    mozzi: {
        rate: "audio", includes: ["#include <WavePacket.h>", "#include <FixMath.h>"],
        global: function(n,v){ return "WavePacket<DOUBLE> " + v + ";"; },
        setup: function(n,v,i){ return v + ".set(100, 50, 100);"; },
        control: function(n,v,i){ return v + ".set(" + i.fund + ", " + i.bw + ", " + i.res + ");"; },
        output_type: function(n) { return (n.data.cfg_out_domain === "sfix") ? "SFix<15,16>" : "int16_t"; },
        audio: function(n,v,i){ 
            var call = v + ".next()";
            if (n.data.cfg_out_domain === "sfix") return "node_" + n.id + "_out = SFix<15,0>(" + call + ");";
            return "node_" + n.id + "_out = " + call + ";"; 
        }
    },
    rpdnode: { "title": "WavePacket", "inlets": { "fund": { "type": "mozziflow/uint16_t", "label": "fund" }, "bw": { "type": "mozziflow/uint8_t", "label": "bw" }, "res": { "type": "mozziflow/uint8_t", "label": "res" } }, "outlets": { "out": { "type": "mozziflow/any" } } }
});

NodeLibrary.push({
    nodetype: 'mozziflow/sample',
    category: "wave",
    nodeclass: "Sample",
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            if (!node.data.interp) node.data.interp = "INTERP_NONE";
            if (!node._ui_sample) {
                var fileInp = document.createElement('input'); fileInp.type = 'file'; fileInp.style.fontSize = '9px'; fileInp.style.width = '100%';
                fileInp.onchange = function(e) {
                    if (e.target.files.length > 0) {
                        MozziSampleConverter.processFile(e.target.files[0], function(res) {
                            if (res) { node.data.sample_table = res.tableString; node.data.sample_table_size = res.size; node.data.sample_name = e.target.files[0].name.replace(/[^a-z0-9]/gi, '_').toLowerCase(); bodyElm.querySelector('.sample-info').innerText = "Loaded: " + res.info; }
                        });
                    }
                };
                var selInt = document.createElement('select'); selInt.style.width = "100%"; selInt.style.fontSize = "9px"; selInt.style.background = "#111"; selInt.style.color = "#0f9";
                selInt.className = 'mozzi-inlet-val-input'; selInt.setAttribute('data-alias', 'interp');
                var _interpOpts = [["INTERP_NONE", "None"], ["INTERP_LINEAR", "Linear"]];
                _interpOpts.forEach(function(opt) { var o = document.createElement('option'); o.value = opt[0]; o.innerText = opt[1]; if (node.data.interp === opt[0]) o.selected = true; selInt.appendChild(o); });
                selInt.onchange = function() { node.data.interp = this.value; };
                
                var container = document.createElement('div'); container.style.marginTop = "5px";
                createSourceOutSelector(node, container);
                createSourceInput("RATE", node, "freq", "1.0f", container);
                
                var info = document.createElement('div'); info.className = 'sample-info'; info.style.fontSize = '8px'; info.style.color = '#0f9';
                info.innerText = (node.data && node.data.sample_name) ? "Loaded: " + node.data.sample_name : "No sample loaded";
                
                bodyElm.appendChild(fileInp); bodyElm.appendChild(selInt); bodyElm.appendChild(container); bodyElm.appendChild(info); node._ui_sample = true;
            }
        }
    },
    mozzi: {
        rate: "audio", is_inline: false, includes: ["#include <Sample.h>", "#include <FixMath.h>"],
        global: function(n,v,r){
            var data = n.data || {};
            var name = data.sample_name ? data.sample_name : "dummy_sample_" + n.id;
            var table = data.sample_table ? data.sample_table : "0";
            var size = data.sample_table_size ? data.sample_table_size : "1";
            var interp = data.interp ? data.interp : "INTERP_NONE";
            return "const int8_t " + name + "_data[] PROGMEM = {" + table + "};\nSample<" + size + ", " + r + ", " + interp + "> " + v + "(" + name + "_data); float last_f_" + n.id + " = 0.0f;";
        },
        control: function(n,v,i){ return "if(" + i.trig + "){ " + v + ".start(); }\nif(last_f_" + n.id + " != " + i.freq + "){ " + v + ".setFreq(" + i.freq + "); last_f_" + n.id + " = " + i.freq + "; }"; },
        output_type: function(n) { return (n.data.cfg_out_domain === "sfix") ? "SFix<15,16>" : "int8_t"; },
        audio: function(n,v,i){ 
            var call = v + ".next()";
            if (n.data.cfg_out_domain === "sfix") return "node_" + n.id + "_out = SFix<0,8>::fromRaw(" + call + ");";
            return "node_" + n.id + "_out = " + call + ";"; 
        } 
    },
    help: { summary: "WAV player. Supports SFix output domain." },
    rpdnode: { "title": "Sample", "inlets": { "trig": { "type": "mozziflow/bool", "label": "trig" }, "freq": { "type": "mozziflow/float", "is_control": true, "label": "freq" } }, "outlets": { "out": { "type": "mozziflow/any" } } }
});

NodeLibrary.push({
    nodetype: 'mozziflow/multi_wave',
    category: "wave",
    nodeclass: "Oscil",
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px"; container.style.background = "rgba(0,255,153,0.05)";
            container.style.border = "1px solid #0f9"; container.style.marginBottom = "5px";
            
            var info = document.createElement('div');
            info.innerText = "0:Sin 1:Tri 2:Saw 3:Sqr"; 
            info.style.fontSize = "6px"; info.style.color = "#888"; info.style.marginBottom = "2px";
            container.appendChild(info);

            createSourceFreqSelector(node, container);
            createSourceOutSelector(node, container);
            createSourceInput("FREQ", node, "freq", "440.0f", container);
            createSourceInput("TYPE", node, "type", "0", container);
            bodyElm.appendChild(container);
        }
    },
    mozzi: {
        rate: "audio",
        includes: [
            "#include <Oscil.h>", 
            "#include <tables/sin2048_int8.h>", 
            "#include <tables/triangle2048_int8.h>",
            "#include <tables/saw2048_int8.h>",
            "#include <tables/square_no_alias_2048_int8.h>",
            "#include <FixMath.h>"
        ],
        defaults: { "freq": "440.0f", "type": "0" },
        inputs: {
            "freq": {
                type: function(n) { return (n.data.cfg_freq_mode === "fixed") ? "Q16n16" : "float"; },
                literal_macro: function(n) { return (n.data.cfg_freq_mode === "fixed") ? "float_to_Q16n16" : null; }
            },
            "type": { type: "uint8_t" }
        },
        output_type: function(n) { return (n.data.cfg_out_domain === "sfix") ? "SFix<15,16>" : "int8_t"; },
        global: function(n, v, r) { 
            var type = (n.data.cfg_freq_mode === "fixed") ? "Q16n16" : "float";
            // Initialize with Sine table by default
            return "Oscil<2048, " + r + "> " + v + "(SIN2048_DATA); " + type + " last_f_" + n.id + " = 0; uint8_t last_t_" + n.id + " = 255;"; 
        },
        control: function(n,v,i){
            var freqMethod = (n.data.cfg_freq_mode === "fixed") ? "setFreq_Q16n16" : "setFreq";
            var code = "if(last_f_" + n.id + " != " + i.freq + "){ " + v + "." + freqMethod + "(" + i.freq + "); last_f_" + n.id + " = " + i.freq + "; }\n";
            
            // Table Switching Logic
            code += "if(" + i.type + " != last_t_" + n.id + ") {\n";
            code += "    uint8_t t = " + i.type + " % 4;\n"; // Safety modulo
            code += "    if(t==0) " + v + ".setTable(SIN2048_DATA);\n";
            code += "    else if(t==1) " + v + ".setTable(TRIANGLE2048_DATA);\n";
            code += "    else if(t==2) " + v + ".setTable(SAW2048_DATA);\n";
            code += "    else " + v + ".setTable(SQUARE_NO_ALIAS_2048_DATA);\n";
            code += "    last_t_" + n.id + " = " + i.type + ";\n";
            code += "}";
            return code;
        },
        audio: function(n, v, i) { 
            var call = v + ".next()";
            if (n.data.cfg_out_domain === "sfix") return "node_" + n.id + "_out = SFix<0,8>::fromRaw(" + call + ");";
            return "node_" + n.id + "_out = " + call + ";"; 
        }
    },
    help: { 
        summary: "Multi-waveform oscillator.", 
        usage: "Select waveform in real-time via TYPE input: 0=Sine, 1=Tri, 2=Saw, 3=Square.",
        inlets: { "freq": "Frequency", "type": "Waveform Selector (0-3)" }
    },
    rpdnode: { "title": "Multi Wave", "inlets": { "freq": { "type": "mozziflow/any", "is_control": true, "label": "freq" }, "type": { "type": "mozziflow/uint8_t", "label": "type" } }, "outlets": { "out": { "type": "mozziflow/any" } } }
});