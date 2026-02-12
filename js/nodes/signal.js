// Mozzi Node Definitions - SIGNAL (v7.1 Clean & Documented)
var createSignalInput = function(label, node, key, defaultValue, container) {
    var row = document.createElement('div');
    row.style.display = "flex"; row.style.justifyContent = "space-between"; row.style.fontSize = "8px"; row.style.marginBottom = "2px";
    var lbl = document.createElement('span'); lbl.innerText = label + ":"; row.appendChild(lbl);
    var inp = document.createElement('input');
    inp.type = "text"; inp.style.width = "40px";
    inp.className = 'mozzi-inlet-val-input';
    inp.style.background = "#000"; inp.style.color = "#0f9"; inp.style.fontSize = "8px"; inp.style.border = "1px solid #333";
    var realKey = "cfg_" + key;
    var val = (node.data && node.data[realKey] !== undefined) ? node.data[realKey] : defaultValue;
    inp.value = val;
    if (node.data) node.data[realKey] = val; 
    inp.oninput = function() { node.data[realKey] = this.value; };
    row.appendChild(inp);
    container.appendChild(row);
};

var createSignalDomainSelector = function(node, container) {
    var row = document.createElement('div');
    row.style.display = "flex"; row.style.flexDirection = "column"; row.style.marginBottom = "4px";
    var lbl = document.createElement('div'); lbl.innerText = "DOMAIN"; lbl.style.fontSize = "7px"; lbl.style.color = "#0f9";
    var sel = document.createElement('select');
    sel.style.width = "100%"; sel.style.fontSize = "9px"; sel.style.background = "#222"; sel.style.color = "#0ff";
    sel.className = 'mozzi-inlet-val-input'; sel.setAttribute('data-alias', 'domain');
    var opts = [["int", "Integer"], ["sfix", "FixMath (SFix)"]];
    opts.forEach(function(o){ var opt = document.createElement('option'); opt.value = o[0]; opt.innerText = o[1]; if(node.data.cfg_domain === o[0]) opt.selected = true; sel.appendChild(opt); });
    sel.onchange = function() { node.data.cfg_domain = this.value; if (node._onDataUpdate) node._onDataUpdate(); };
    if(!node.data.cfg_domain) node.data.cfg_domain = "int";
    row.appendChild(lbl); row.appendChild(sel); container.appendChild(row);
};

NodeLibrary.push({
    nodetype: 'mozziflow/hard_clipper',
    category: "signal",
    nodeclass: "HardClipper",
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px"; container.style.background = "rgba(0,255,153,0.05)";
            container.style.border = "1px solid #0f9"; container.style.marginBottom = "5px";
            createSignalDomainSelector(node, container);
            createSignalInput("THR", node, "thr", "127", container);
            bodyElm.appendChild(container);
        }
    },
    mozzi: {
        rate: "audio", is_inline: true, includes: ["#include <FixMath.h>"],
        inputs: { 
            "in": { type: function(n) { return (n.data.cfg_domain === "sfix") ? "SFix<15,16>" : "int16_t"; } }, 
            "thr": { type: function(n) { return (n.data.cfg_domain === "sfix") ? "float" : "int16_t"; } } 
        },
        output_type: function(n) { return (n.data.cfg_domain === "sfix") ? "SFix<15,16>" : "int16_t"; },
        audio: function(n,v,i){ 
            if (n.data.cfg_domain === "sfix") {
                return "SFix<15,16> _t = SFix<15,16>(" + i.thr + ");\n" +
                       "node_" + n.id + "_out = (" + i.in + " > _t) ? _t : ((" + i.in + " < -_t) ? -_t : " + i.in + ");";
            }
            return "node_" + n.id + "_out = (" + i.in + " > " + i.thr + ") ? " + i.thr + " : ((" + i.in + " < -" + i.thr + ") ? -" + i.thr + " : " + i.in + ");"; 
        }
    },
    help: { summary: "Hard saturation/clipping effect. Supports SFix high-precision mode." },
    rpdnode: { "title": "Hard Clipper", "inlets": { "in": { "type": "mozziflow/any" }, "thr": { "type": "mozziflow/any", "no_text": true } }, "outlets": { "out": { "type": "mozziflow/any" } } }
});

NodeLibrary.push({
    nodetype: 'mozziflow/line_ramp',
    category: "signal",
    nodeclass: "Line",
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px"; container.style.background = "rgba(0,255,153,0.05)";
            container.style.border = "1px solid #0f9"; container.style.marginBottom = "5px";
            createSignalDomainSelector(node, container);
            createSignalInput("DUR (ms)", node, "dur", "500", container);
            bodyElm.appendChild(container);
        }
    },
    mozzi: {
        rate: "control", includes: ["#include <Line.h>", "#include <FixMath.h>"], defaults: { "dur": "500", "target": "0" },
        inputs: { 
            "target": { type: function(n) { return (n.data.cfg_domain === "sfix") ? "float" : "int32_t"; } },
            "dur": { type: "uint16_t" }
        },
        output_type: function(n) { return (n.data.cfg_domain === "sfix") ? "SFix<15,16>" : "int32_t"; },
        global: function(n,v,r){ 
            var type = (n.data.cfg_domain === "sfix") ? "SFix<15,16>" : "long";
            return "Line<" + type + "> " + v + "; " + type + " " + v + "_last_t = 0;"; 
        },
        control: function(n,v,i){ 
            var type = (n.data.cfg_domain === "sfix") ? "SFix<15,16>" : "long";
            var target = (n.data.cfg_domain === "sfix") ? "SFix<15,16>(" + i.target + ")" : i.target;
            return "if(" + target + " != " + v + "_last_t){ " + v + ".set(" + target + ", " + i.dur + ", MOZZI_CONTROL_RATE); " + v + "_last_t = " + target + "; }\n" +
                   "node_" + n.id + "_out = " + v + ".next();";
        }
    },
    help: { summary: "Generates smooth linear ramps. Supports high-precision SFix mode." },
    rpdnode: { "title": "Line Ramp", "inlets": { "target": { "type": "mozziflow/any" }, "dur": { "type": "mozziflow/uint16_t", "no_text": true } }, "outlets": { "out": { "type": "mozziflow/any" } } }
});

NodeLibrary.push({
    nodetype: 'mozziflow/audio_delay',
    category: "signal",
    nodeclass: "AudioDelay",
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px"; container.style.background = "rgba(0,255,153,0.05)";
            container.style.border = "1px solid #0f9"; container.style.marginBottom = "5px";
            
            // Storage Type
            var row1 = document.createElement('div');
            row1.style.display = "flex"; row1.style.flexDirection = "column"; row1.style.marginBottom = "4px";
            var lbl1 = document.createElement('div'); lbl1.innerText = "STORAGE TYPE"; lbl1.style.fontSize = "7px"; lbl1.style.color = "#0f9";
            var sel1 = document.createElement('select');
            sel1.style.width = "100%"; sel1.style.fontSize = "9px"; sel1.style.background = "#222"; sel1.style.color = "#0ff";
            sel1.className = 'mozzi-inlet-val-input'; sel1.setAttribute('data-alias', 'precision');
            var opts1 = [["int16_t", "int16"], ["int8_t", "int8"], ["SFix<15,16>", "FixMath (15.16)"]];
            opts1.forEach(function(o){ var opt = document.createElement('option'); opt.value = o[0]; opt.innerText = o[1]; if(node.data.cfg_precision === o[0]) opt.selected = true; sel1.appendChild(opt); });
            sel1.onchange = function() { node.data.cfg_precision = this.value; if(node._onDataUpdate) node._onDataUpdate(); };
            if(!node.data.cfg_precision) node.data.cfg_precision = "int16_t";
            row1.appendChild(lbl1); row1.appendChild(sel1); container.appendChild(row1);

            // Delay Mode
            var row2 = document.createElement('div');
            row2.style.display = "flex"; row2.style.flexDirection = "column"; row2.style.marginBottom = "4px";
            var lbl2 = document.createElement('div'); lbl2.innerText = "DELAY MODE"; lbl2.style.fontSize = "7px"; lbl2.style.color = "#fc0";
            var sel2 = document.createElement('select');
            sel2.style.width = "100%"; sel2.style.fontSize = "9px"; sel2.style.background = "#222"; sel2.style.color = "#0ff";
            sel2.className = 'mozzi-inlet-val-input'; sel2.setAttribute('data-alias', 'mode');
            var opts2 = [["std", "Standard (Integer)"], ["interp", "Interpolated (Hi-Fi)"]];
            opts2.forEach(function(o){ var opt = document.createElement('option'); opt.value = o[0]; opt.innerText = o[1]; if(node.data.cfg_mode === o[0]) opt.selected = true; sel2.appendChild(opt); });
            sel2.onchange = function() { node.data.cfg_mode = this.value; if(node._onDataUpdate) node._onDataUpdate(); };
            if(!node.data.cfg_mode) node.data.cfg_mode = "std";
            row2.appendChild(lbl2); row2.appendChild(sel2); container.appendChild(row2);

            createSignalInput("FREQ (Hz)", node, "freq", "220.0f", container);
            createSignalInput("MAX (Samps)", node, "time", "1024", container);
            bodyElm.appendChild(container);
        }
    },
    mozzi: {
        rate: "audio", includes: ["#include <AudioDelay.h>", "#include <FixMath.h>"], defaults: { "time": "1024", "freq": "220.0f" },
        inputs: { 
            "in": { type: function(n) { return n.data.cfg_precision || "int16_t"; } }, 
            "freq": { type: "float" },
            "trig": { type: "bool" }
        },
        output_type: function(n) { return n.data.cfg_precision || "int16_t"; },
        global: function(n,v,r){ 
            var samps = parseInt(n.data.cfg_time) || 1024;
            var type = n.data.cfg_precision || "int16_t";
            var g = "AudioDelay<" + samps + ", " + type + "> " + v + "; float " + v + "_last_f = 0.0f; bool " + v + "_trig_last = 0;";
            if (n.data.cfg_mode === "interp") g += "uint32_t " + v + "_idx = 0; float " + v + "_frac = 0.0f;";
            return g;
        },
        setup: function(n,v,i){
            var f = parseFloat(n.data.cfg_freq) || 220.0;
            var max_samps = n.data.cfg_time || 1024;
            var type = n.data.cfg_precision || "int16_t";
            var isFix = (type.indexOf("SFix") !== -1 || type.indexOf("UFix") !== -1);
            var zero = isFix ? type + "(0)" : "0";
            return "uint32_t d = (uint32_t)((float)MOZZI_AUDIO_RATE / " + f + "); " + v + ".set(d); for(int i=0;i<" + max_samps + ";i++) " + v + ".next(" + zero + ");";
        },
        control: function(n,v,i){
            var mode = n.data.cfg_mode || "std";
            var max_samps = n.data.cfg_time || 1024;
            var type = n.data.cfg_precision || "int16_t";
            var isFix = (type.indexOf("SFix") !== -1 || type.indexOf("UFix") !== -1);
            var zero = isFix ? type + "(0)" : "0";
            
            var code = "if(" + i.freq + " != " + v + "_last_f && " + i.freq + " > 0) {\n";
            code += "    float d = (float)MOZZI_AUDIO_RATE / " + i.freq + ";\n";
            if (mode === "interp") {
                code += "    " + v + "_idx = (uint32_t)d;\n";
                code += "    " + v + "_frac = d - (float)" + v + "_idx;\n";
            } else {
                code += "    uint32_t d_int = (uint32_t)d;\n";
                code += "    if(d_int > " + max_samps + ") d_int = " + max_samps + ";\n";
                code += "    " + v + ".set(d_int);\n";
            }
            code += "    " + v + "_last_f = " + i.freq + ";\n";
            code += "}\n";
            
            // Trigger Logic: Clear buffer
            code += "if(" + i.trig + " && !" + v + "_trig_last) {\n";
            code += "    for(int i=0; i<" + max_samps + "; i++) " + v + ".next(" + zero + ");\n";
            code += "}\n";
            code += v + "_trig_last = " + i.trig + ";";
            
            return code;
        },
        audio: function(n,v,i){ 
            var mode = n.data.cfg_mode || "std";
            var type = n.data.cfg_precision || "int16_t";
            var isFix = (type.indexOf("SFix") !== -1 || type.indexOf("UFix") !== -1);
            
            if (mode === "interp") {
                var interpCode = "";
                if (isFix) {
                    interpCode = type + " _s1 = " + v + ".read(" + v + "_idx);\n" +
                                 type + " _s2 = " + v + ".read(" + v + "_idx + 1);\n" +
                                 "node_" + n.id + "_out = _s1 + (SFix<0,16>(" + v + "_frac) * (_s2 - _s1));\n";
                } else {
                    interpCode = type + " _s1 = " + v + ".read(" + v + "_idx);\n" +
                                 type + " _s2 = " + v + ".read(" + v + "_idx + 1);\n" +
                                 "node_" + n.id + "_out = (float)_s1 + (" + v + "_frac * (float)(_s2 - _s1));\n";
                }
                return interpCode + v + ".next(" + i.in + ");";
            }
            return "node_" + n.id + "_out = " + v + ".next(" + i.in + ");"; 
        }
    },
    help: {
        summary: "Audio Delay Line with high-precision storage and interpolation options.",
        usage: "Interpolated mode allows fractional delay times for perfect tuning. Use 'trig' to clear buffer on note on."
    },
    rpdnode: { "title": "Delay", "inlets": { "in": { "type": "mozziflow/any" }, "freq": { "type": "mozziflow/float", "label": "freq", "is_control": true }, "trig": { "type": "mozziflow/bool", "label": "trig", "is_control": true } }, "outlets": { "out": { "type": "mozziflow/any" } } }
});

NodeLibrary.push({
    nodetype: 'mozziflow/unit_delay',
    category: "signal",
    nodeclass: "UnitDelay",
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "2px";
            var sel = document.createElement('select');
            sel.style.width = "100%"; sel.style.fontSize = "9px"; sel.style.background = "#222"; sel.style.color = "#0ff";
            sel.className = 'mozzi-inlet-val-input'; sel.setAttribute('data-alias', 'precision');
            var opts = [["int32_t", "Integer"], ["SFix<15,16>", "FixMath (15.16)"]];
            opts.forEach(function(o){ var opt = document.createElement('option'); opt.value = o[0]; opt.innerText = o[1]; if(node.data.cfg_precision === o[0]) opt.selected = true; sel.appendChild(opt); });
            sel.onchange = function() { node.data.cfg_precision = this.value; if(node._onDataUpdate) node._onDataUpdate(); };
            if(!node.data.cfg_precision) node.data.cfg_precision = "int32_t";
            container.appendChild(sel);
            bodyElm.appendChild(container);
        }
    },
    mozzi: {
        rate: "audio", includes: ["#include <FixMath.h>"],
        inputs: { "in": { type: function(n) { return n.data.cfg_precision || "int32_t"; } } },
        output_type: function(n) { return n.data.cfg_precision || "int32_t"; },
        global: function(n,v){ 
            var type = n.data.cfg_precision || "int32_t";
            var isFix = (type.indexOf("SFix") !== -1 || type.indexOf("UFix") !== -1);
            var zero = isFix ? type + "(0)" : "0";
            return type + " " + v + "_mem = " + zero + ";"; 
        },
        audio: function(n,v,i){ return "node_" + n.id + "_out = " + v + "_mem;\n" + v + "_mem = " + i.in + ";"; }
    },
    help: {
        summary: "Delays the input by exactly one sample.",
        usage: "Use FixMath mode for high-precision feedback filters.",
        inlets: { "in": "Any signal." },
        outlets: { "out": "Delayed signal." }
    },
    rpdnode: { "title": "Unit Delay", "inlets": { "in": { "type": "mozziflow/any" } }, "outlets": { "out": { "type": "mozziflow/any" } } }
});

NodeLibrary.push({
    nodetype: 'mozziflow/sh',
    category: "signal",
    nodeclass: "MozziSH",
    mozzi: {
        rate: "audio", is_inline: false,
        inputs: { "in": { type: "int32_t" }, "trig": { type: "bool" } },
        global: function(n,v){ return "int32_t " + v + "_val = 0; bool " + v + "_l = 0;"; },
        audio: function(n,v,i){ return "if(" + i.trig + " && !" + v + "_l){ " + v + "_val = " + i.in + "; " + v + "_l=1; } else if(!" + i.trig + "){" + v + "_l=0; }\nnode_" + n.id + "_out = " + v + "_val;"; }
    },
    help: { summary: "Sample and Hold." },
    rpdnode: { "title": "S&H", "inlets": { "in": { "type": "mozziflow/int32_t" }, "trig": { "type": "mozziflow/bool" } }, "outlets": { "out": { "type": "mozziflow/int32_t" } } }
});

NodeLibrary.push({
    nodetype: 'mozziflow/counter',
    category: "signal",
    nodeclass: "MozziCounter",
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px"; container.style.background = "rgba(0,255,153,0.05)";
            container.style.border = "1px solid #0f9"; container.style.marginBottom = "5px";
            var inp = document.createElement('input'); inp.type = "text"; inp.style.width = "40px";
            inp.className = 'mozzi-inlet-val-input'; inp.setAttribute('data-alias', 'max');
            inp.value = node.data.cfg_max || "9";
            inp.oninput = function() { node.data.cfg_max = this.value; };
            container.appendChild(inp);
            bodyElm.appendChild(container);
        }
    },
    mozzi: {
        rate: "control", defaults: { "up":"0", "down":"0", "max":"9" },
        inputs: { "up": { type: "bool" }, "down": { type: "bool" }, "max": { type: "int32_t" } },
        global: function(n,v){ return "int32_t " + v + "_c = 0; bool " + v + "_ul = 0; bool " + v + "_dl = 0;"; },
        control: function(n,v,i){
            return "if(" + i.up + " && !" + v + "_ul){ " + v + "_c++; " + v + "_ul=1; } else if(!" + i.up + "){" + v + "_ul=0; }\n"
                   + "if(" + i.down + " && !" + v + "_dl){ " + v + "_c--; " + v + "_dl=1; } else if(!" + i.down + "){" + v + "_dl=0; }\n"
                   + "if(" + v + "_c > " + i.max + ") " + v + "_c = 0; if(" + v + "_c < 0) " + v + "_c = " + i.max + ";\nnode_" + n.id + "_out = " + v + "_c;"; 
        }
    },
    help: { summary: "Bi-directional pulse counter." },
    rpdnode: { "title": "Counter", "inlets": { "up": { "type": "mozziflow/bool" }, "down": { "type": "mozziflow/bool" }, "max": { "type": "mozziflow/int32_t", "no_text": true } }, "outlets": { "out": { "type": "mozziflow/int32_t" } } }
});

NodeLibrary.push({
    nodetype: 'mozziflow/metronome',
    category: "signal",
    nodeclass: "Metronome",
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var inp = document.createElement('input'); inp.type = "text"; inp.style.width = "40px";
            inp.className = 'mozzi-inlet-val-input'; inp.setAttribute('data-alias', 'bpm');
            inp.value = node.data.cfg_bpm || "120";
            inp.oninput = function() { node.data.cfg_bpm = this.value; };
            bodyElm.appendChild(inp);
        }
    },
    mozzi: {
        rate: "control", includes: ["#include <Metronome.h>"], defaults: { "bpm": "120" },
        inputs: { "bpm": { type: "float" } },
        global: function(n,v){ return "Metronome " + v + "; float " + v + "_lastbpm = 0;"; },
        setup: function(n,v,i){ return v + ".start();"; },
        control: function(n,v,i){ return "if(" + v + "_lastbpm != " + i.bpm + ") { " + v + ".setBPM(" + i.bpm + "); " + v + "_lastbpm = " + i.bpm + "; }\nnode_" + n.id + "_out = " + v + ".ready();"; }
    },
    help: { summary: "BPM-based pulse generator." },
    rpdnode: { "title": "Metronome", "inlets": { "bpm": { "type": "mozziflow/float", "no_text": true } }, "outlets": { "out": { "type": "mozziflow/bool" } } }
});