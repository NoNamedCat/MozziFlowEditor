// Mozzi Node Definitions - LFO
// Moduladores de baja frecuencia para control de parámetros

var createLfoInput = function(label, node, key, defaultValue, container) {
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

var createLfoDomainSelector = function(node, container) {
    var row = document.createElement('div');
    row.style.display = "flex"; row.style.justifyContent = "space-between"; row.style.marginBottom = "4px";
    var sel = document.createElement('select');
    sel.style.width = "100%"; sel.style.fontSize = "9px"; sel.style.background = "#222"; sel.style.color = "#0ff";
    // FIX: Binding
    sel.className = 'mozzi-inlet-val-input';
    sel.setAttribute('data-alias', 'out_domain');

    var opts = [["int8", "8-bit (-128,127)"], ["sfix", "FixMath (-1,1)"], ["float", "Float (-1,1)"]];
    opts.forEach(function(o){ 
        var opt = document.createElement('option'); opt.value = o[0]; opt.innerText = o[1];
        if(node.data.cfg_out_domain === o[0]) opt.selected = true;
        sel.appendChild(opt); 
    });
    sel.onchange = function() { node.data.cfg_out_domain = this.value; if (node._onDataUpdate) node._onDataUpdate(); };
    if(!node.data.cfg_out_domain) node.data.cfg_out_domain = "int8";
    row.appendChild(sel);
    container.appendChild(row);
};

NodeLibrary.push({
    nodetype: 'mozziflow/lfo_sin',
    category: "lfo",
    nodeclass: "Oscil",
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px"; container.style.background = "rgba(0,255,153,0.05)";
            container.style.border = "1px solid #0f9"; container.style.marginBottom = "5px";
            createLfoDomainSelector(node, container);
            createLfoInput("LFO FREQ", node, "freq", "1.0f", container);
            bodyElm.appendChild(container);
        }
    },
    mozzi: {
        rate: "control", includes: ["#include <Oscil.h>", "#include <tables/sin2048_int8.h>"],
        defaults: { "freq": "1.0f" },
        global: function(n, v, r) { return "Oscil<SIN2048_NUM_CELLS, " + r + "> " + v + "(SIN2048_DATA); float last_f_" + n.id + " = 0.0f;"; },
        control: function(n,v,i){
            var domain = n.data.cfg_out_domain || "int8";
            var base = "if(last_f_" + n.id + " != " + i.freq + "){ " + v + ".setFreq(" + i.freq + "); last_f_" + n.id + " = " + i.freq + "; }\n";
            if (domain === "sfix") return base + "node_" + n.id + "_out = SFix<0,8>::fromRaw(" + v + ".next());";
            if (domain === "float") return base + "node_" + n.id + "_out = (float)" + v + ".next() / 128.0f;";
            return base + "node_" + n.id + "_out = " + v + ".next();";
        }
    },
    help: {
        summary: "Sine wave LFO.",
        usage: "Select output domain. FixMath (-1,1) is ideal for modulating Gain or Filters without extra mapping.",
        inlets: { "freq": "LFO frequency in Hz." },
        outlets: { "out": "Control signal." }
    },
    rpdnode: { "title": "Sine LFO", "inlets": { "freq": { "type": "mozziflow/float", "is_control": true, "label": "freq" } }, "outlets": { "out": { "type": "mozziflow/any" } } }
});

NodeLibrary.push({
    nodetype: 'mozziflow/pulse',
    category: "lfo",
    nodeclass: "Phasor",
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px"; container.style.background = "rgba(0,255,153,0.05)";
            container.style.border = "1px solid #0f9"; container.style.marginBottom = "5px";
            createLfoInput("FREQ", node, "freq", "1.0f", container);
            createLfoInput("WIDTH%", node, "width", "50", container);
            bodyElm.appendChild(container);
        }
    },
    mozzi: {
        rate: "control",
        includes: ["#include <Phasor.h>"],
        defaults: { "freq": "1.0f", "width": "50" },
        global: function(n,v,r){ return "Phasor<" + r + "> " + v + "; float last_f_" + n.id + " = 0.0f; uint32_t " + v + "_thr = 2147483648UL; uint8_t " + v + "_last_w = 0;"; },
        control: function(n,v,i){ 
            var code = "if(last_f_" + n.id + " != " + i.freq + "){ " + v + ".setFreq(" + i.freq + "); last_f_" + n.id + " = " + i.freq + "; }\n";
            code += "if(" + v + "_last_w != " + i.width + "){ " + v + "_thr = (uint32_t)((uint64_t)" + i.width + " * 4294967295ULL / 100); " + v + "_last_w = " + i.width + "; }\n";
            code += "node_" + n.id + "_out = (" + v + ".next() < " + v + "_thr);";
            return code;
        }
    },
    help: {
        summary: "Square/Pulse wave LFO with efficient duty cycle.",
        usage: "Ideal for clocking or rhythmic gating. Computationally optimized.",
        inlets: { "freq": "LFO frequency in Hz.", "width": "Duty cycle percentage (0-100%)." },
        outlets: { "out": "Boolean pulse signal (True/False)." }
    },
    rpdnode: { "title": "Pulse LFO", "inlets": { "freq": { "type": "mozziflow/float", "is_control": true }, "width": { "type": "mozziflow/uint8_t", "label": "width%" } }, "outlets": { "out": { "type": "mozziflow/bool" } } }
});