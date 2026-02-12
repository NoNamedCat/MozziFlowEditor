// Mozzi Flow - ENVELOPES (v7.6 Standardized)
var createEnvInput = function(label, node, key, defaultValue, container) {
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

var createEnvDomainSelector = function(node, container) {
    var row = document.createElement('div');
    row.style.display = "flex"; row.style.flexDirection = "column"; row.style.marginBottom = "4px";
    var lbl = document.createElement('div'); lbl.innerText = "OUT DOMAIN"; lbl.style.fontSize = "7px"; lbl.style.color = "#0f9";
    var sel = document.createElement('select');
    sel.style.width = "100%"; sel.style.fontSize = "9px"; sel.style.background = "#222"; sel.style.color = "#0ff";
    sel.className = 'mozzi-inlet-val-input'; sel.setAttribute('data-alias', 'domain');
    var opts = [["int", "Integer (0-255)"], ["sfix", "FixMath (0.0-1.0)"]];
    opts.forEach(function(o){ 
        var opt = document.createElement('option'); opt.value = o[0]; opt.innerText = o[1];
        if(node.data.cfg_domain === o[0]) opt.selected = true;
        sel.appendChild(opt); 
    });
    sel.onchange = function() { node.data.cfg_domain = this.value; if (node._onDataUpdate) node._onDataUpdate(); };
    if(!node.data.cfg_domain) node.data.cfg_domain = "int";
    row.appendChild(lbl); row.appendChild(sel);
    container.appendChild(row);
};

// --- ADSR ---
NodeLibrary.push({
    nodetype: 'mozziflow/adsr',
    category: "envelope",
    nodeclass: "ADSR",
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px"; container.style.background = "rgba(255,100,0,0.05)";
            container.style.border = "1px solid #f90"; container.style.marginBottom = "5px";
            
            createEnvDomainSelector(node, container);

            var rowL = document.createElement('div');
            rowL.style.display = "flex"; rowL.style.justifyContent = "space-between"; rowL.style.marginBottom = "4px";
            var selL = document.createElement('select');
            selL.style.width = "100%"; selL.style.fontSize = "9px"; selL.style.background = "#222"; selL.style.color = "#0ff";
            selL.className = 'mozzi-inlet-val-input'; selL.setAttribute('data-alias', 'lerp');
            [["MOZZI_CONTROL_RATE", "Control Rate"], ["MOZZI_AUDIO_RATE", "Audio Rate"]].forEach(function(o){ 
                var opt = document.createElement('option'); opt.value = o[0]; opt.innerText = o[1];
                if(node.data.cfg_lerp === o[0]) opt.selected = true; selL.appendChild(opt); 
            });
            selL.onchange = function() { node.data.cfg_lerp = this.value; };
            if(!node.data.cfg_lerp) node.data.cfg_lerp = "MOZZI_CONTROL_RATE";
            container.appendChild(selL);

            var rowR = document.createElement('div');
            rowR.style.display = "flex"; rowR.style.flexDirection = "column"; rowR.style.marginBottom = "4px";
            var lblR = document.createElement('div'); lblR.innerText = "RETRIGGER"; lblR.style.fontSize = "7px"; lblR.style.color = "#f90";
            var selR = document.createElement('select');
            selR.style.width = "100%"; selR.style.fontSize = "9px"; selR.style.background = "#222"; selR.style.color = "#fff";
            selR.className = 'mozzi-inlet-val-input'; selR.setAttribute('data-alias', 'reset');
            [["false", "Soft (Keep Level)"], ["true", "Hard (Reset to 0)"]].forEach(function(o){
                var opt = document.createElement('option'); opt.value = o[0]; opt.innerText = o[1];
                if(node.data.cfg_reset === o[0]) opt.selected = true; selR.appendChild(opt);
            });
            selR.onchange = function() { node.data.cfg_reset = this.value; };
            if(!node.data.cfg_reset) node.data.cfg_reset = "false";
            rowR.appendChild(lblR); rowR.appendChild(selR); container.appendChild(rowR);

            createEnvInput("ATT (ms)", node, "at", "50", container);
            createEnvInput("A-LEV", node, "al", "255", container);
            createEnvInput("DEC (ms)", node, "dt", "100", container);
            createEnvInput("D-LEV", node, "dl", "128", container);
            createEnvInput("SUS (ms)", node, "st", "0", container);
            createEnvInput("S-LEV", node, "sl", "128", container);
            createEnvInput("REL (ms)", node, "rt", "300", container);
            createEnvInput("R-LEV", node, "rl", "0", container);
            
            bodyElm.appendChild(container);
        }
    },
    mozzi: {
        rate: "audio", includes: ["#include <ADSR.h>", "#include <FixMath.h>"], 
        defaults: { "at":"50", "dt":"100", "sl":"128", "rt":"300", "al":"255", "dl":"128", "st":"0", "rl":"0" },
        inputs: {
            "trig": { type: "bool" },
            "at": { type: "uint16_t" }, "al": { type: "uint8_t" },
            "dt": { type: "uint16_t" }, "dl": { type: "uint8_t" },
            "st": { type: "uint16_t" }, "sl": { type: "uint8_t" },
            "rt": { type: "uint16_t" }, "rl": { type: "uint8_t" }
        },
        output_type: function(n) { return (n.data.cfg_domain === "sfix") ? "SFix<15,16>" : "uint8_t"; },
        global: function(n,v,r){ 
            var lerp = n.data.cfg_lerp || "MOZZI_CONTROL_RATE";
            var id = n.id;
            return "ADSR<MOZZI_CONTROL_RATE, " + lerp + "> mozziadsr_" + id + "; bool mozziadsr_" + id + "_l = 0;\n"
                 + "uint16_t mozziadsr_" + id + "_at_l=65535, mozziadsr_" + id + "_dt_l=65535, mozziadsr_" + id + "_st_l=65535, mozziadsr_" + id + "_rt_l=65535;\n"
                 + "uint8_t mozziadsr_" + id + "_al_l=255, mozziadsr_" + id + "_dl_l=255, mozziadsr_" + id + "_sl_l=255, mozziadsr_" + id + "_rl_l=255;";
        },
        control: function(n,v,i){
            var id = n.id;
            var inst = "mozziadsr_" + id;
            var reset = n.data.cfg_reset === "true" ? "true" : "false";
            
            return "if(" + i.trig + " && !" + inst + "_l){ " + inst + ".noteOn(" + reset + "); } else if(!" + i.trig + " && " + inst + "_l){ " + inst + ".noteOff(); }\n"
                 + inst + "_l = " + i.trig + ";\n"
                 + "if(" + i.at + "!=" + inst + "_at_l || " + i.dt + "!=" + inst + "_dt_l || " + i.st + "!=" + inst + "_st_l || " + i.rt + "!=" + inst + "_rt_l){\n"
                 + "    uint16_t _st = (" + i.st + " == 0) ? 65535 : " + i.st + ";\n"
                 + "    " + inst + ".setTimes(" + i.at + ", " + i.dt + ", _st, " + i.rt + ");\n"
                 + "    " + inst + "_at_l=" + i.at + "; " + inst + "_dt_l=" + i.dt + "; " + inst + "_st_l=" + i.st + "; " + inst + "_rt_l=" + i.rt + ";\n"
                 + "}\n"
                 + "if(" + i.al + "!=" + inst + "_al_l || " + i.dl + "!=" + inst + "_dl_l || " + i.sl + "!=" + inst + "_sl_l || " + i.rl + "!=" + inst + "_rl_l){\n"
                 + "    " + inst + ".setLevels(" + i.al + ", " + i.dl + ", " + i.sl + ", " + i.rl + ");\n"
                 + "    " + inst + "_al_l=" + i.al + "; " + inst + "_dl_l=" + i.dl + "; " + inst + "_sl_l=" + i.sl + "; " + inst + "_rl_l=" + i.rl + ";\n"
                 + "}\n"
                 + inst + ".update();";
        },
        audio: function(n,v,i){ 
            var id = n.id;
            var inst = "mozziadsr_" + id;
            if (n.data.cfg_domain === "sfix") return "node_" + id + "_out = SFix<0,8>::fromRaw(" + inst + ".next());";
            return "node_" + id + "_out = " + inst + ".next();";
        }
    },
    help: { summary: "Complete Pro-spec ADSR. Levels 0-255. S-TIME 0 = gated mode. Supports hard/soft retrigger.", outlets: { "out": "Amplitude envelope." } },
    rpdnode: { "title": "ADSR", "inlets": { "trig": { "type": "mozziflow/bool" }, "at": { "type": "mozziflow/uint16_t", "no_text": true }, "al": { "type": "mozziflow/uint8_t", "no_text": true }, "dt": { "type": "mozziflow/uint16_t", "no_text": true }, "dl": { "type": "mozziflow/uint8_t", "no_text": true }, "st": { "type": "mozziflow/uint16_t", "no_text": true }, "sl": { "type": "mozziflow/uint8_t", "no_text": true }, "rt": { "type": "mozziflow/uint16_t", "no_text": true }, "rl": { "type": "mozziflow/uint8_t", "no_text": true } }, "outlets": { "out": { "type": "mozziflow/any" } } }
});

// --- EAD ---
NodeLibrary.push({
    nodetype: 'mozziflow/ead',
    category: "envelope",
    nodeclass: "Ead",
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px"; container.style.background = "rgba(255,100,0,0.05)";
            container.style.border = "1px solid #f90"; container.style.marginBottom = "5px";
            createEnvDomainSelector(node, container);
            createEnvInput("ATT", node, "att", "20", container);
            createEnvInput("DEC", node, "dec", "200", container);
            bodyElm.appendChild(container);
        }
    },
    mozzi: {
        rate: "audio", includes: ["#include <Ead.h>", "#include <FixMath.h>"], defaults: { "att": "20", "dec": "200" },
        inputs: { "trig": { type: "bool" }, "att": { type: "uint16_t" }, "dec": { type: "uint16_t" } },
        output_type: function(n) { return (n.data.cfg_domain === "sfix") ? "SFix<15,16>" : "uint8_t"; },
        global: function(n,v,r){ return "Ead mozziead_" + n.id + "(MOZZI_AUDIO_RATE); bool mozziead_" + n.id + "_last = 0;"; },
        control: function(n,v,i){ 
            var inst = "mozziead_" + n.id;
            return "if(" + i.trig + " && !" + inst + "_last){ " + inst + ".start(" + i.att + ", " + i.dec + "); }\n" + inst + "_last = " + i.trig + ";"; 
        },
        audio: function(n,v,i){ 
            var id = n.id;
            var inst = "mozziead_" + id;
            if (n.data.cfg_domain === "sfix") return "node_" + id + "_out = SFix<0,8>::fromRaw(" + inst + ".next());";
            return "node_" + id + "_out = " + inst + ".next();";
        }
    },
    help: { summary: "Exponential Attack Decay envelope. Supports FixMath output domain.", outlets: { "out": "Amplitud (0-255 o 0.0-1.0)." } },
    rpdnode: { "title": "Ead", "inlets": { "trig": { "type": "mozziflow/bool" }, "att": { "type": "mozziflow/uint16_t", "no_text": true }, "dec": { "type": "mozziflow/uint16_t", "no_text": true } }, "outlets": { "out": { "type": "mozziflow/any" } } }
});

// --- SMOOTH LAG ---
NodeLibrary.push({
    nodetype: 'mozziflow/smooth_lag',
    category: "envelope",
    nodeclass: "Smooth",
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px"; container.style.background = "rgba(255,100,0,0.05)";
            container.style.border = "1px solid #f90"; container.style.marginBottom = "5px";
            var row = document.createElement('div');
            row.style.display = "flex"; row.style.justifyContent = "space-between"; row.style.marginBottom = "4px";
            var sel = document.createElement('select');
            sel.style.width = "100%"; sel.style.fontSize = "9px"; sel.style.background = "#222"; sel.style.color = "#0ff";
            sel.className = 'mozzi-inlet-val-input'; sel.setAttribute('data-alias', 'domain');
            var opts = [["int", "Integer"], ["float", "Float"], ["sfix", "FixMath (SFix)"]];
            opts.forEach(function(o){ var opt = document.createElement('option'); opt.value = o[0]; opt.innerText = o[1]; if(node.data.cfg_domain === o[0]) opt.selected = true; sel.appendChild(opt); });
            sel.onchange = function() { node.data.cfg_domain = this.value; if(node._onDataUpdate) node._onDataUpdate(); };
            if(!node.data.cfg_domain) node.data.cfg_domain = "float";
            container.appendChild(sel);
            createEnvInput("COEFF", node, "coeff", "0.95", container);
            bodyElm.appendChild(container);
        }
    },
    mozzi: {
        rate: "control", includes: ["#include <Smooth.h>", "#include <FixMath.h>"], 
        inputs: { "in": { type: function(n) { return (n.data.cfg_domain === "float") ? "float" : ((n.data.cfg_domain === "sfix") ? "SFix<15,16>" : "int32_t"); } }, "coeff": { type: "float" } },
        output_type: function(n) { 
            if (n.data.cfg_domain === "float") return "float";
            if (n.data.cfg_domain === "sfix") return "SFix<15,16>";
            return "int32_t";
        },
        global: function(n,v,r){ 
            var type = (n.data.cfg_domain === "float") ? "float" : ((n.data.cfg_domain === "sfix") ? "SFix<15,16>" : "int32_t");
            return "Smooth<" + type + "> smooth_" + n.id + "(" + (n.data.cfg_coeff || "0.95f") + "); float last_c_" + n.id + " = 0.0f;"; 
        },
        control: function(n,v,i){ 
            var inst = "smooth_" + n.id;
            return "if(" + i.coeff + " != last_c_" + n.id + ") { " + inst + ".setSmooth(" + i.coeff + "); last_c_" + n.id + " = " + i.coeff + "; }\nnode_" + n.id + "_out = " + inst + ".next(" + i.in + ");";
        }
    },
    help: { summary: "Low-pass filter for control signals. Now supports SFix precision." },
    rpdnode: { "title": "Smooth", "inlets": { "in": { "type": "mozziflow/any" }, "coeff": { "type": "mozziflow/float", "no_text": true } }, "outlets": { "out": { "type": "mozziflow/any" } } }
});