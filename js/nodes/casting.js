// Mozzi Node Definitions - CASTING (v6.6 Advanced Types)
// Conversión de tipos y precisión para Mozzi & FixMath

var createCastInput = function(label, node, key, defaultValue, container) {
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

var createCastSelector = function(node, container, label, key, options) {
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

// --- TO FLOAT ---
NodeLibrary.push({
    nodetype: 'mozziflow/to_float',
    category: "casting",
    nodeclass: null,
    mozzi: {
        rate: "audio",
        audio: function(n,v,i){ return "node_" + n.id + "_out = (float)" + i.in + ";"; }
    },
    help: {
        summary: "Casts signal to float.",
        inlets: { "in": "Any signal." },
        outlets: { "out": "float signal." }
    },
    rpdnode: { "title": "To Float", "inlets": { "in": { "type": "mozziflow/any" } }, "outlets": { "out": { "type": "mozziflow/float" } } }
});

// --- TO INT ---
NodeLibrary.push({
    nodetype: 'mozziflow/to_int',
    category: "casting",
    nodeclass: null,
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px";
            createCastSelector(node, container, "TARGET INT", "type", [["int16_t", "int16 (Std)"], ["int8_t", "int8 (Lofi)"], ["int32_t", "int32 (Safe)"], ["uint16_t", "uint16"], ["uint8_t", "uint8"]]);
            bodyElm.appendChild(container);
        }
    },
    mozzi: {
        rate: "audio",
        audio: function(n,v,i){ 
            var type = n.data.cfg_type || "int16_t";
            return "node_" + n.id + "_out = (" + type + ")" + i.in + ";"; 
        }
    },
    help: {
        summary: "Universal Integer Cast.",
        usage: "Convert any signal to standard integer types. 8-bit is fast, 32-bit prevents overflow.",
        inlets: { "in": "Any signal." },
        outlets: { "out": "Integer signal." }
    },
    rpdnode: { "title": "To Integer", "inlets": { "in": { "type": "mozziflow/any" } }, "outlets": { "out": { "type": "mozziflow/any" } } }
});

// --- TO FIXMATH ---
NodeLibrary.push({
    nodetype: 'mozziflow/to_fix',
    category: "casting",
    nodeclass: null,
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px";
            createCastSelector(node, container, "FIXED TYPE", "type", [
                ["SFix<15,16>", "Q15.16 (Mozzi)"], 
                ["SFix<15,0>", "SFix16 (Integer)"], 
                ["SFix<7,8>", "Q7.8 (Legacy)"],
                ["UFix<16,16>", "UFix32 (Unsigned)"],
                ["UFix<0,8>", "Fraction (0..1)"]
            ]);
            bodyElm.appendChild(container);
        }
    },
    mozzi: {
        rate: "audio",
        includes: ["#include <FixMath.h>"],
        audio: function(n,v,i){ 
            var type = n.data.cfg_type || "SFix<15,16>";
            return "node_" + n.id + "_out = " + type + "(" + i.in + ");"; 
        }
    },
    help: {
        summary: "Fixed Point Cast.",
        usage: "Ideal for fast precise math. Q15.16 is standard. 'Fraction' treats 0-255 as 0.0-1.0.",
        inlets: { "in": "Any signal." },
        outlets: { "out": "FixMath signal." }
    },
    rpdnode: { "title": "To FixMath", "inlets": { "in": { "type": "mozziflow/any" } }, "outlets": { "out": { "type": "mozziflow/any" } } }
});

// --- FROM FIXMATH ---
NodeLibrary.push({
    nodetype: 'mozziflow/from_fix',
    category: "casting",
    nodeclass: null,
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px";
            createCastSelector(node, container, "OUT DOMAIN", "mode", [["asInt", "Integer"], ["asFloat", "Float"], ["asRaw", "Raw Bits"]]);
            bodyElm.appendChild(container);
        }
    },
    mozzi: {
        rate: "audio",
        audio: function(n,v,i){ 
            var mode = n.data.cfg_mode || "asInt";
            // i.in is expected to be an SFix/UFix object
            return "node_" + n.id + "_out = " + i.in + "." + mode + "();"; 
        }
    },
    help: {
        summary: "Back to Native conversion.",
        usage: "Use .asInt() to get a standard number for Audio Out or Filters.",
        inlets: { "in": "FixMath signal." },
        outlets: { "out": "Native signal." }
    },
    rpdnode: { "title": "From FixMath", "inlets": { "in": { "type": "mozziflow/any" } }, "outlets": { "out": { "type": "mozziflow/any" } } }
});

// --- TO BOOL (Threshold) ---
NodeLibrary.push({
    nodetype: 'mozziflow/to_bool',
    category: "casting",
    nodeclass: null,
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px";
            createCastInput("THR", node, "thr", "0", container);
            bodyElm.appendChild(container);
        }
    },
    mozzi: {
        rate: "audio",
        audio: function(n,v,i){ return "node_" + n.id + "_out = (" + i.in + " > " + i.thr + ");"; }
    },
    help: {
        summary: "Numeric to Boolean.",
        inlets: { "in": "Signal.", "thr": "Threshold." },
        outlets: { "out": "Boolean signal." }
    },
    rpdnode: { "title": "To Bool", "inlets": { "in": { "type": "mozziflow/any" } }, "outlets": { "out": { "type": "mozziflow/bool" } } }
});