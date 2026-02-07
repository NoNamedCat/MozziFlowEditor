// Mozzi Node Definitions - ENVELOPE (v7.3 Advanced Templates)
// Generadores de control temporal y suavizado

var createEnvInput = function(label, node, key, defaultValue, container) {
    var row = document.createElement('div');
    row.style.display = "flex"; row.style.justifyContent = "space-between"; row.style.fontSize = "8px"; row.style.marginBottom = "2px";
    var lbl = document.createElement('span'); lbl.innerText = label + ":"; row.appendChild(lbl);
    var inp = document.createElement('input');
    inp.type = "text"; inp.style.width = "35px";
    inp.className = 'mozzi-inlet-val-input';
    inp.style.background = "#000"; inp.style.color = "#0f9"; inp.style.fontSize = "8px"; inp.style.border = "1px solid #333";
    var realKey = "cfg_" + key;
    var alias = key.replace("cfg_", "");
    inp.setAttribute('data-alias', alias);
    var val = (node.data && node.data[realKey] !== undefined) ? node.data[realKey] : defaultValue;
    inp.value = val;
    if (node.data) node.data[realKey] = val; 
    inp.oninput = function() { node.data[realKey] = this.value; };
    row.appendChild(inp);
    container.appendChild(row);
};

var createEnvSelector = function(node, container, label, key, options) {
    var row = document.createElement('div');
    row.style.display = "flex"; row.style.flexDirection = "column"; row.style.marginBottom = "4px";
    var lbl = document.createElement('div'); lbl.innerText = label; lbl.style.fontSize = "7px"; lbl.style.color = "#0f9";
    var sel = document.createElement('select');
    sel.style.width = "100%"; sel.style.fontSize = "9px"; sel.style.background = "#222"; sel.style.color = "#0ff";
    // FIX: Binding
    sel.className = 'mozzi-inlet-val-input';
    sel.setAttribute('data-alias', key);

    var realKey = "cfg_" + key;
    options.forEach(function(o){ 
        var opt = document.createElement('option'); opt.value = o[0]; opt.innerText = o[1];
        if(node.data[realKey] === o[0]) opt.selected = true;
        sel.appendChild(opt); 
    });
    sel.onchange = function() { node.data[realKey] = this.value; if (node._onDataUpdate) node._onDataUpdate(); };
    if(!node.data[realKey]) node.data[realKey] = options[0][0];
    row.appendChild(lbl);
    row.appendChild(sel);
    container.appendChild(row);
};

NodeLibrary.push({
    nodetype: 'mozziflow/adsr',
    category: "envelope",
    nodeclass: "MozziADSR",
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px"; container.style.background = "rgba(0,255,153,0.05)";
            container.style.border = "1px solid #0f9"; container.style.marginBottom = "5px";
            
            createEnvSelector(node, container, "INTERPOLATION", "lerp", [["MOZZI_AUDIO_RATE", "Smooth (Audio)"], ["MOZZI_CONTROL_RATE", "Fast (Control)"]]);

            var grid = document.createElement('div');
            grid.style.display = "grid"; grid.style.gridTemplateColumns = "1fr 1fr"; grid.style.gap = "2px";
            container.appendChild(grid);
            createEnvInput("A-T", node, "at", "50", grid);    createEnvInput("A-L", node, "al", "255", grid);
            createEnvInput("D-T", node, "dt", "100", grid);   createEnvInput("D-L", node, "dl", "128", grid);
            createEnvInput("S-T", node, "st", "65535", grid); createEnvInput("S-L", node, "sl", "128", grid);
            createEnvInput("R-T", node, "rt", "200", grid);   createEnvInput("R-L", node, "rl", "0", grid);
            bodyElm.appendChild(container);
        }
    },
    mozzi: {
        rate: "audio",
        includes: ["#include <ADSR.h>"],
        defaults: { "at": "50", "al": "255", "dt": "100", "dl": "128", "st": "65535", "sl": "128", "rt": "200", "rl": "0" },
        global: function(n,v){
            // Auto-configure LERP rate based on Node Rate Mode
            var isAudio = (n.data.rate_mode == 2);
            var lerp = isAudio ? "MOZZI_AUDIO_RATE" : "MOZZI_CONTROL_RATE";
            
            // ADSR<ControlRate, LerpRate, StepType>
            var g = "ADSR<MOZZI_CONTROL_RATE, " + lerp + ", uint16_t> " + v + "; bool " + v + "_l = 0;\n";
            g += "uint16_t " + v + "_at_l=0, " + v + "_dt_l=0, " + v + "_st_l=0, " + v + "_rt_l=0;\n";
            g += "uint8_t " + v + "_al_l=0, " + v + "_dl_l=0, " + v + "_sl_l=0, " + v + "_rl_l=0;";
            return g;
        },
        control: function(n,v,i){
            var c = "// Node " + n.id + " ADSR Logic\n";
            c += "if(" + i.trig + " && (!" + v + "_l || !" + v + ".playing())){ " + v + ".noteOn(); } else if(!" + i.trig + " && " + v + "_l){ " + v + ".noteOff(); }\n";
            c += v + "_l = " + i.trig + ";\n";
            c += "if(" + i.at + "!=" + v + "_at_l || " + i.dt + "!=" + v + "_dt_l || " + i.st + "!=" + v + "_st_l || " + i.rt + "!=" + v + "_rt_l){\n";
            c += "    " + v + ".setTimes(" + i.at + ", " + i.dt + ", " + i.st + ", " + i.rt + ");\n";
            c += "    " + v + "_at_l=" + i.at + "; " + v + "_dt_l=" + i.dt + "; " + v + "_st_l=" + i.st + "; " + v + "_rt_l=" + i.rt + ";\n}";
            c += "if(" + i.al + "!=" + v + "_al_l || " + i.dl + "!=" + v + "_dl_l || " + i.sl + "!=" + v + "_sl_l || " + i.rl + "!=" + v + "_rl_l){\n";
            c += "    " + v + ".setLevels(" + i.al + ", " + i.dl + ", " + i.sl + ", " + i.rl + ");\n";
            c += "    " + v + "_al_l=" + i.al + "; " + v + "_dl_l=" + i.dl + "; " + v + "_sl_l=" + i.sl + "; " + v + "_rl_l=" + i.rl + ";\n}";
            c += v + ".update();";
            // FIX: If running in Control Rate (1), we must output the value here because 'audio' block won't run.
            if (parseInt(n.data.rate_mode) === 1) {
                c += "\nnode_" + n.id + "_out = " + v + ".next();";
            }
            return c;
        },
        audio: function(n,v,i){ return "node_" + n.id + "_out = " + v + ".next();" ; }
    },
    help: {
        summary: "ADSR envelope.",
        usage: "Interpolation: 'Smooth' calls next() in audio loop. 'Fast' can save CPU if used at control rate.",
        inlets: { "trig": "Gate.", "at/dt/st/rt": "Stage times (ms).", "al/dl/sl/rl": "Stage levels (0-255)." },
        outlets: { "out": "8-bit envelope signal." }
    },
    rpdnode: { "title": "ADSR", "inlets": { "trig": { "type": "mozziflow/bool" }, "at": { "type": "mozziflow/uint16_t", "label": "at" }, "al": { "type": "mozziflow/uint8_t", "label": "al" }, "dt": { "type": "mozziflow/uint16_t", "label": "dt" }, "dl": { "type": "mozziflow/uint8_t", "label": "dl" }, "st": { "type": "mozziflow/uint16_t", "label": "st" }, "sl": { "type": "mozziflow/uint8_t", "label": "sl" }, "rt": { "type": "mozziflow/uint16_t", "label": "rt" }, "rl": { "type": "mozziflow/uint8_t", "label": "rl" } }, "outlets": { "out": { "type": "mozziflow/uint8_t" } } }
});

NodeLibrary.push({
    nodetype: 'mozziflow/ead',
    category: "envelope",
    nodeclass: "MozziEad",
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px"; container.style.background = "rgba(0,255,153,0.05)";
            container.style.border = "1px solid #0f9"; container.style.marginBottom = "5px";
            createEnvInput("ATT", node, "att", "20", container);
            createEnvInput("DEC", node, "dec", "200", container);
            bodyElm.appendChild(container);
        }
    },
    mozzi: {
        rate: "control",
        includes: ["#include <Ead.h>"],
        defaults: { "att": "20", "dec": "200" },
        global: function(n,v,r){ return "Ead " + v + "(MOZZI_CONTROL_RATE); bool " + v + "_last = 0;"; },
        control: function(n,v,i){
            return "if(" + i.trig + " && !" + v + "_last){ " + v + ".start(" + i.att + ", " + i.dec + "); }\n" + v + "_last = " + i.trig + ";\nnode_" + n.id + "_out = " + v + ".next();";
        }
    },
    help: {
        summary: "Exponential AD envelope.",
        usage: "Best for percussion. Only works correctly at Control Rate.",
        inlets: { "trig": "Trigger pulse.", "att": "Attack ms.", "dec": "Decay ms." },
        outlets: { "out": "8-bit envelope." }
    },
    rpdnode: { "title": "Ead Env", "inlets": { "trig": { "type": "mozziflow/bool" }, "att": { "type": "mozziflow/uint16_t", "label": "att" }, "dec": { "type": "mozziflow/uint16_t", "label": "dec" } }, "outlets": { "out": { "type": "mozziflow/uint8_t" } } }
});

NodeLibrary.push({
    nodetype: 'mozziflow/line_ramp',
    category: "envelope",
    nodeclass: "Line",
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px";
            createEnvSelector(node, container, "DATA TYPE", "domain", [["int32_t", "Integer"], ["SFix<15,16>", "FixMath (Freq)"], ["float", "Float"]]);
            createEnvInput("DUR(ms)", node, "dur", "1000", container);
            bodyElm.appendChild(container);
        }
    },
    mozzi: {
        rate: "control",
        includes: ["#include <Line.h>"],
        defaults: { "dur": "1000" },
        global: function(n,v){ 
            var type = n.data.cfg_domain || "int32_t";
            return "Line<" + type + "> " + v + "; " + type + " " + v + "_last = 0;"; 
        },
        control: function(n,v,i){
            var type = n.data.cfg_domain || "int32_t";
            var cast = "(" + type + ")";
            return "if(" + v + "_last != " + cast + i.target + "){ " + v + ".set(" + cast + i.target + ", (uint16_t)" + i.dur + "); " + v + "_last = " + cast + i.target + "; }\nnode_" + n.id + "_out = " + v + ".next();";
        }
    },
    help: {
        summary: "Linear ramp generator.",
        usage: "Select domain to match destination (e.g. FixMath for frequency glides).",
        inlets: { "target": "Target value.", "dur": "Ramp time ms." },
        outlets: { "out": "Interpolated signal." }
    },
    rpdnode: { "title": "Line Ramp", "inlets": { "target": { "type": "mozziflow/any" }, "dur": { "type": "mozziflow/uint16_t", "no_text": true } }, "outlets": { "out": { "type": "mozziflow/any" } } }
});

NodeLibrary.push({
    nodetype: 'mozziflow/smooth_lag',
    category: "envelope",
    nodeclass: "Smooth",
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px";
            createEnvSelector(node, container, "DOMAIN", "domain", [["int16_t", "Int16"], ["int8_t", "Int8 (Fast)"], ["SFix<15,0>", "FixMath"], ["float", "Float"]]);
            createEnvInput("COEFF", node, "coeff", "0.95", container);
            bodyElm.appendChild(container);
        }
    },
    mozzi: {
        rate: "audio",
        includes: ["#include <Smooth.h>"],
        defaults: { "coeff": "0.95" },
        global: function(n,v){ 
            var type = n.data.cfg_domain || "int16_t";
            return "Smooth<" + type + "> " + v + "(0.95f);"; 
        },
        control: function(n,v,i){ return v + ".setSmooth(" + i.coeff + "f);"; },
        audio: function(n,v,i){ return "node_" + n.id + "_out = " + v + ".next(" + i.in + ");"; }
    },
    help: {
        summary: "Smoothing filter.",
        usage: "Int8 specialization is ultra-fast. FixMath is safe for audio precision.",
        inlets: { "in": "Signal.", "coeff": "Smoothness (0-1)." },
        outlets: { "out": "Smoothed signal." }
    },
    rpdnode: { "title": "Smooth Lag", "inlets": { "in": { "type": "mozziflow/any" }, "coeff": { "type": "mozziflow/float", "no_text": true } }, "outlets": { "out": { "type": "mozziflow/any" } } }
});

NodeLibrary.push({
    nodetype: 'mozziflow/table_env',
    category: "envelope",
    nodeclass: "Oscil",
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px";
            createEnvInput("DUR(ms)", node, "dur", "500", container);
            bodyElm.appendChild(container);
        }
    },
    mozzi: {
        rate: "control",
        includes: ["#include <Oscil.h>", "#include <tables/envelop2048_uint8.h>"],
        defaults: { "dur": "500" },
        global: function(n,v){ return "Oscil<ENVELOP2048_NUM_CELLS, MOZZI_CONTROL_RATE> " + v + "(ENVELOP2048_DATA); bool " + v + "_last = 0;"; },
        control: function(n,v,i){
            var code = "if(" + i.trig + " && !" + v + "_last){ " + v + ".setFreq(1000.0f / (float)" + i.dur + "); " + v + ".setPhase(0); }\n";
            code += v + "_last = " + i.trig + ";\n";
            code += "node_" + n.id + "_out = " + v + ".next();";
            return code;
        }
    },
    help: {
        summary: "Organic envelope (one-shot).",
        usage: "Uses Gaussian wavetable.",
        inlets: { "trig": "Start.", "dur": "Duration ms." },
        outlets: { "out": "8-bit curve." }
    },
    rpdnode: { "title": "Table Env", "inlets": { "trig": { "type": "mozziflow/bool" }, "dur": { "type": "mozziflow/uint16_t", "no_text": true } }, "outlets": { "out": { "type": "mozziflow/uint8_t" } } }
});

NodeLibrary.push({
    nodetype: 'mozziflow/accent_env',
    category: "envelope",
    nodeclass: "AccentEnv",
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px"; container.style.background = "rgba(0,255,153,0.05)";
            container.style.border = "1px solid #0f9"; container.style.marginBottom = "5px";
            createEnvInput("ACC", node, "accent", "128", container);
            bodyElm.appendChild(container);
        }
    },
    mozzi: {
        rate: "audio",
        defaults: { "accent": "128" },
        audio: function(n,v,i){ return "node_" + n.id + "_out = ((int32_t)" + i.env + " * (255 + " + i.accent + ")) >> 8;"; }
    },
    help: {
        summary: "Accent multiplier.",
        inlets: { "env": "Base env.", "accent": "Accent (0-255)." },
        outlets: { "out": "32-bit amplified." }
    },
    rpdnode: { "title": "Accent Env", "inlets": { "env": { "type": "mozziflow/uint8_t" }, "accent": { "type": "mozziflow/uint8_t", "no_text": true } }, "outlets": { "out": { "type": "mozziflow/int32_t" } } }
});