// Mozzi Node Definitions - FILTER
// Filtros y efectos que alteran el espectro sonoro

var createFilterInput = function(label, node, key, defaultValue, container) {
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

var createFilterPrecisionSelector = function(node, container) {
    var row = document.createElement('div');
    row.style.display = "flex"; row.style.justifyContent = "space-between"; row.style.marginBottom = "4px";
    var sel = document.createElement('select');
    sel.style.width = "100%"; sel.style.fontSize = "9px"; sel.style.background = "#222"; sel.style.color = "#0ff";
    // FIX: Binding
    sel.className = 'mozzi-inlet-val-input';
    sel.setAttribute('data-alias', 'precision');

    var opts = [["uint8_t", "8-bit (Fast)"], ["uint16_t", "16-bit (Hifi)"]];
    opts.forEach(function(o){ 
        var opt = document.createElement('option'); opt.value = o[0]; opt.innerText = o[1];
        if(node.data.cfg_precision === o[0]) opt.selected = true;
        sel.appendChild(opt); 
    });
    sel.onchange = function() { 
        node.data.cfg_precision = this.value;
        // Adjust defaults if changed
        if (this.value === "uint8_t") {
            if (parseInt(node.data.cfg_cutoff) > 255) node.data.cfg_cutoff = "200";
        } else {
            if (parseInt(node.data.cfg_cutoff) <= 255) node.data.cfg_cutoff = "12000";
        }
        if (node._onDataUpdate) node._onDataUpdate();
    };
    if(!node.data.cfg_precision) node.data.cfg_precision = "uint16_t";
    row.appendChild(sel);
    container.appendChild(row);
};

// --- GENERIC FILTERS ---
var _filterConfigs = [["lpf", "LOWPASS", "LowPass"], ["hpf", "HIGHPASS", "HighPass"], ["bpf", "BANDPASS", "BandPass"], ["nf", "NOTCH", "Notch"]];
_filterConfigs.forEach(function(cfg) {
    NodeLibrary.push({
        nodetype: 'mozziflow/' + cfg[0],
        category: "filter",
        nodeclass: "Mozzi" + cfg[2],
        renderer: {
            'html': function(bodyElm, node) {
                if (!node.data) node.data = {};
                var container = document.createElement('div');
                container.style.padding = "5px"; container.style.background = "rgba(0,255,153,0.05)";
                container.style.border = "1px solid #0f9"; container.style.marginBottom = "5px";
                createFilterPrecisionSelector(node, container);
                createFilterInput("CUTOFF", node, "cutoff", (node.data.cfg_precision === "uint8_t" ? "200" : "12000"), container);
                createFilterInput("RES", node, "res", "0", container);
                bodyElm.appendChild(container);
            }
        },
        mozzi: {
            rate: "audio", includes: ["#include <ResonantFilter.h>"],
            defaults: { "cutoff": "12000", "res": "0" },
            global: function(n,v){ 
                var p = n.data.cfg_precision || "uint16_t";
                return "ResonantFilter<" + cfg[1] + ", " + p + "> " + v + "; " + p + " " + v + "_f_l=0, " + v + "_r_l=0;"; 
            },
            control: function(n,v,i){
                var p = n.data.cfg_precision || "uint16_t";
                return "if(" + v + "_f_l != (" + p + ")" + i.cutoff + " || " + v + "_r_l != (" + p + ")" + i.res + "){\n" + 
                       "    " + v + ".setCutoffFreqAndResonance((" + p + ")" + i.cutoff + ", (" + p + ")" + i.res + ");\n" + 
                       "    " + v + "_f_l=(" + p + ")" + i.cutoff + "; " + v + "_r_l=(" + p + ")" + i.res + ";\n}";
            },
            audio: function(n,v,i){ return "node_" + n.id + "_out = " + v + ".next(" + i.in + ");"; }
        },
        help: {
            summary: "High-quality " + cfg[2] + " resonant filter.",
            usage: "8-bit mode is faster (Cutoff 0-255). 16-bit mode is smoother (Cutoff 0-65535).",
            inlets: { "in": "Audio signal.", "cutoff": "Filter cutoff frequency.", "res": "Resonance level." },
            outlets: { "out": "Filtered signal." }
        },
        rpdnode: { "title": cfg[2], "inlets": { "in": { "type": "mozziflow/int16_t" }, "cutoff": { "type": "mozziflow/any", "is_control": true, "label": "cutoff" }, "res": { "type": "mozziflow/any", "is_control": true, "label": "res" } }, "outlets": { "out": { "type": "mozziflow/int16_t" } } }
    });
});

NodeLibrary.push({
    nodetype: 'mozziflow/svf',
    category: "filter",
    nodeclass: "MozziSVF",
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px"; container.style.background = "rgba(0,255,153,0.05)";
            container.style.border = "1px solid #0f9"; container.style.marginBottom = "5px";
            var sel = document.createElement('select'); sel.style.fontSize = '9px'; sel.style.width = '100%';
            sel.style.background = "#111"; sel.style.color = "#0f9";
            // FIX: Binding
            sel.className = 'mozzi-inlet-val-input';
            sel.setAttribute('data-alias', 'mode');

            ["LOWPASS", "BANDPASS", "HIGHPASS", "NOTCH"].forEach(function(m) {
                var opt = document.createElement('option'); opt.value = m; opt.innerText = m;
                if (node.data.mode === m) opt.selected = true; sel.appendChild(opt);
            });
            sel.onchange = function() { node.data.mode = this.value; };
            container.appendChild(sel);
            var sep = document.createElement('div'); sep.style.height = "5px"; container.appendChild(sep);
            createFilterInput("CUTOFF", node, "cutoff", "1200", container);
            createFilterInput("RES", node, "res", "128", container);
            bodyElm.appendChild(container);
            node.on_refresh = function() { sel.value = node.data.mode || "LOWPASS"; };
        }
    },
    mozzi: {
        rate: 'audio', includes: ["#include <StateVariable.h>"],
        defaults: { "cutoff": "1200", "res": "128" },
        global: function(n,v){
            var mode = (n.data && n.data.mode) ? n.data.mode : "LOWPASS";
            return "StateVariable<" + mode + "> " + v + "; uint16_t " + v + "_f_l=0; uint8_t " + v + "_r_l=0;"; 
        },
        control: function(n,v,i){
            return "if(" + v + "_f_l != " + i.cutoff + "){ " + v + ".setCentreFreq(" + i.cutoff + "); " + v + "_f_l=" + i.cutoff + "; }\n" + 
                   "if(" + v + "_r_l != " + i.res + "){ " + v + ".setResonance(" + i.res + "); " + v + "_r_l=" + i.res + "; }";
        },
        audio: function(n,v,i){ return "node_" + n.id + "_out = " + v + ".next(" + i.in + ");"; }
    },
    help: {
        summary: "Versatile State Variable Filter with multiple selectable modes.",
        usage: "Select the filter mode (LP, BP, HP, Notch) from the dropdown. Musical response.",
        inlets: { "in": "Audio input.", "cutoff": "Center/Cutoff frequency (0-65535).", "res": "Resonance (0-255)." },
        outlets: { "out": "16-bit processed signal." }
    },
    rpdnode: { "title": "SVF Filter", "inlets": { "in": { "type": "mozziflow/int16_t" }, "cutoff": { "type": "mozziflow/uint16_t", "is_control": true, "label": "cutoff" }, "res": { "type": "mozziflow/uint8_t", "is_control": true, "label": "res" } }, "outlets": { "out": { "type": "mozziflow/int16_t" } } }
});

NodeLibrary.push({
    nodetype: 'mozziflow/wavefolder',
    category: "filter",
    nodeclass: "MozziWaveFolder",
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px"; container.style.background = "rgba(0,255,153,0.05)";
            container.style.border = "1px solid #0f9"; container.style.marginBottom = "5px";
            createFilterInput("LOW", node, "low", "-128", container);
            createFilterInput("HIGH", node, "high", "127", container);
            bodyElm.appendChild(container);
        }
    },
    mozzi: {
        rate: "audio", includes: ["#include <WaveFolder.h>"],
        defaults: { "low": "-128", "high": "127" },
        global: function(n,v){ return "WaveFolder<int> " + v + "; int " + v + "_l_l=0, " + v + "_h_l=0;"; },
        control: function(n,v,i){
            return "if(" + v + "_l_l != " + i.low + " || " + v + "_h_l != " + i.high + "){\n" + 
                   "    " + v + ".setLimits(" + i.low + ", " + i.high + ");\n" + 
                   "    " + v + "_l_l=" + i.low + "; " + v + "_h_l=" + i.high + ";\n}";
        },
        audio: function(n,v,i){ return "node_" + n.id + "_out = " + v + ".next(" + i.in + ");"; }
    },
    help: {
        summary: "Wave folding distortion effect.",
        usage: "Adds complex harmonics. Adjust LOW and HIGH limits.",
        inlets: { "in": "Audio input.", "low": "Lower limit.", "high": "Upper limit." },
        outlets: { "out": "8-bit folded signal." }
    },
    rpdnode: { "title": "Wave Folder", "inlets": { "in": { "type": "mozziflow/int16_t" }, "low": {"type":"mozziflow/any","no_text":true}, "high": {"type":"mozziflow/any","no_text":true} }, "outlets": { "out": { "type": "mozziflow/int8_t" } } }
});

NodeLibrary.push({
    nodetype: 'mozziflow/reverb',
    category: "filter",
    nodeclass: "ReverbTank",
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px"; container.style.background = "rgba(0,255,153,0.05)";
            container.style.border = "1px solid #0f9"; container.style.marginBottom = "5px";
            createFilterInput("FB", node, "fb", "85", container);
            createFilterInput("R1", node, "r1", "37", container);
            createFilterInput("R2", node, "r2", "77", container);
            createFilterInput("R3", node, "r3", "127", container);
            createFilterInput("D1", node, "d1", "117", container);
            createFilterInput("D2", node, "d2", "255", container);
            bodyElm.appendChild(container);
        }
    },
    mozzi: {
        rate: "audio", includes: ["#include <ReverbTank.h>"],
        defaults: { "fb": "85", "r1": "37", "r2": "77", "r3": "127", "d1": "117", "d2": "255" },
        global: function(n,v){ 
            return "ReverbTank " + v + "; int8_t " + v + "_fb_l=0, " + v + "_r1_l=0, " + v + "_r2_l=0, " + v + "_r3_l=0, " + v + "_d1_l=0; uint8_t " + v + "_d2_l=0;"; 
        },
        control: function(n,v,i){
            var c = "if(" + v + "_fb_l != " + i.fb + "){ " + v + ".setFeebackLevel(" + i.fb + "); " + v + "_fb_l=" + i.fb + "; }\n";
            c += "if(" + v + "_r1_l != " + i.r1 + " || " + v + "_r2_l != " + i.r2 + " || " + v + "_r3_l != " + i.r3 + "){ " + v + ".setEarlyReflections(" + i.r1 + ", " + i.r2 + ", " + i.r3 + "); " + v + "_r1_l=" + i.r1 + "; " + v + "_r2_l=" + i.r2 + "; " + v + "_r3_l=" + i.r3 + "; }\n";
            c += "if(" + v + "_d1_l != " + i.d1 + " || " + v + "_d2_l != " + i.d2 + "){ " + v + ".setLoopDelays(" + i.d1 + ", " + i.d2 + "); " + v + "_d1_l=" + i.d1 + "; " + v + "_d2_l=" + i.d2 + "; }";
            return c;
        },
        audio: function(n,v,i){ return "node_" + n.id + "_out = " + v + ".next(" + i.in + ");"; }
    },
    help: {
        summary: "Digital reverb simulation (Reverb Tank).",
        usage: "Adds spatial depth. High CPU usage!",
        inlets: { "in": "Audio input.", "fb": "Feedback.", "r1-r3": "Reflections.", "d1-d2": "Delays." },
        outlets: { "out": "16-bit wet audio signal." }
    },
    rpdnode: { "title": "Reverb Tank", "inlets": { "in": { "type": "mozziflow/any" }, "fb": { "type": "mozziflow/int8_t", "label": "feedback", "no_text": true }, "r1": { "type": "mozziflow/int8_t", "label": "ref1", "no_text": true }, "r2": { "type": "mozziflow/int8_t", "label": "ref2", "no_text": true }, "r3": { "type": "mozziflow/int8_t", "label": "ref3", "no_text": true }, "d1": { "type": "mozziflow/int8_t", "label": "del1", "no_text": true }, "d2": { "type": "mozziflow/uint8_t", "label": "del2", "no_text": true } }, "outlets": { "out": { "type": "mozziflow/int16_t" } } }
});