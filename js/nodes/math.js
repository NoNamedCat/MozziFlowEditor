// Mozzi Node Definitions - MATH (v7.1 Clean)
// Operaciones numéricas puras y escalado de señales

var createMathInput = function(label, node, key, defaultValue, container) {
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

var createDomainSelector = function(node, container) {
    var row = document.createElement('div');
    row.style.display = "flex"; row.style.justifyContent = "space-between"; row.style.marginBottom = "4px";
    var sel = document.createElement('select');
    sel.style.width = "100%"; sel.style.fontSize = "9px"; sel.style.background = "#222"; sel.style.color = "#0ff";
    // FIX: Binding
    sel.className = 'mozzi-inlet-val-input';
    sel.setAttribute('data-alias', 'domain');

    var opts = [["int", "Int (Fast)"], ["sfix", "FixMath (Safe)"], ["float", "Float (Precise)"]];
    opts.forEach(function(o){ 
        var opt = document.createElement('option'); opt.value = o[0]; opt.innerText = o[1];
        if(node.data.cfg_domain === o[0]) opt.selected = true;
        sel.appendChild(opt); 
    });
    sel.onchange = function() { node.data.cfg_domain = this.value; };
    if(!node.data.cfg_domain) node.data.cfg_domain = "int";
    row.appendChild(sel);
    container.appendChild(row);
};

var genMathCode = function(node, i, op) {
    var d = node.data.cfg_domain || "int";
    if (d === "sfix") return "node_" + node.id + "_out = (SFix<15,0>(" + i.a + ") " + op + " SFix<15,0>(" + i.b + ")).asInt();";
    if (d === "float") return "node_" + node.id + "_out = (int32_t)((float)" + i.a + " " + op + " (float)" + i.b + ");";
    return "node_" + node.id + "_out = (" + i.a + " " + op + " " + i.b + ");";
};

NodeLibrary.push({
    nodetype: 'mozziflow/add',
    category: "math",
    nodeclass: "MathAdd",
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px"; container.style.background = "rgba(0,255,153,0.05)";
            container.style.border = "1px solid #0f9"; container.style.marginBottom = "5px";
            createDomainSelector(node, container);
            createMathInput("VAL B", node, "b", "0", container);
            bodyElm.appendChild(container);
        }
    },
    mozzi: { 
        rate: "audio", is_inline: true, 
        audio: function(n,v,i) { return genMathCode(n, i, "+"); } 
    },
    help: {
        summary: "Arithmetic addition of two signals.",
        usage: "Adds signal A and B. Select 'FixMath' domain if mixing different signal types to avoid errors.",
        inlets: { "a": "Input A.", "b": "Input B." },
        outlets: { "out": "Summed signal." }
    },
    rpdnode: { "title": "Add", "inlets": { "a": { "type": "mozziflow/any" }, "b": { "type": "mozziflow/any", "no_text": true } }, "outlets": { "out": { "type": "mozziflow/int32_t" } } }
});

NodeLibrary.push({
    nodetype: 'mozziflow/sub',
    category: "math",
    nodeclass: "MathSub",
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px"; container.style.background = "rgba(0,255,153,0.05)";
            container.style.border = "1px solid #0f9"; container.style.marginBottom = "5px";
            createDomainSelector(node, container);
            createMathInput("VAL B", node, "b", "0", container);
            bodyElm.appendChild(container);
        }
    },
    mozzi: { 
        rate: "audio", is_inline: true, 
        audio: function(n,v,i) { return genMathCode(n, i, "-"); } 
    },
    help: {
        summary: "Arithmetic subtraction.",
        usage: "Subtracts B from A.",
        inlets: { "a": "Input A.", "b": "Input B." },
        outlets: { "out": "Resulting signal." }
    },
    rpdnode: { "title": "Subtract", "inlets": { "a": { "type": "mozziflow/any" }, "b": { "type": "mozziflow/any", "no_text": true } }, "outlets": { "out": { "type": "mozziflow/int32_t" } } }
});

NodeLibrary.push({
    nodetype: 'mozziflow/mul',
    category: "math",
    nodeclass: "MathMul",
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px"; container.style.background = "rgba(0,255,153,0.05)";
            container.style.border = "1px solid #0f9"; container.style.marginBottom = "5px";
            createDomainSelector(node, container);
            createMathInput("VAL B", node, "b", "1", container);
            bodyElm.appendChild(container);
        }
    },
    mozzi: { 
        rate: "audio", is_inline: true, 
        audio: function(n,v,i) { return genMathCode(n, i, "*"); } 
    },
    help: {
        summary: "Arithmetic multiplication.",
        usage: "Multiplies A by B. 'FixMath' domain recommended for scaling (e.g. A * 0.5).",
        inlets: { "a": "Input A.", "b": "Multiplier." },
        outlets: { "out": "Product." }
    },
    rpdnode: { "title": "Multiply", "inlets": { "a": { "type": "mozziflow/any" }, "b": { "type": "mozziflow/any", "no_text": true } }, "outlets": { "out": { "type": "mozziflow/int32_t" } } }
});

NodeLibrary.push({
    nodetype: 'mozziflow/div',
    category: "math",
    nodeclass: "MathDiv",
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px"; container.style.background = "rgba(0,255,153,0.05)";
            container.style.border = "1px solid #0f9"; container.style.marginBottom = "5px";
            createDomainSelector(node, container);
            createMathInput("VAL B", node, "b", "1", container);
            bodyElm.appendChild(container);
        }
    },
    mozzi: { 
        rate: "audio", is_inline: true, 
        audio: function(n,v,i) {
            var d = n.data.cfg_domain || "int";
            var check = "(" + i.b + " != 0)";
            // FixMath does not support division operator. Use inverse multiplication.
            // SFix<15,0>.inv() returns approx SFix<0,15>. Result is SFix<15,15>. .asInt() shifts >> 15.
            if (d === "sfix") return "node_" + n.id + "_out = " + check + " ? (SFix<15,0>(" + i.a + ") * SFix<15,0>(" + i.b + ").inv()).asInt() : 0;";
            if (d === "float") return "node_" + n.id + "_out = " + check + " ? (int32_t)((float)" + i.a + " / (float)" + i.b + ") : 0;";
            return "node_" + n.id + "_out = " + check + " ? (" + i.a + " / " + i.b + ") : 0;"; 
        } 
    },
    help: {
        summary: "Arithmetic division.",
        usage: "Divides A by B. Protected against division by zero.",
        inlets: { "a": "Numerator.", "b": "Denominator." },
        outlets: { "out": "Quotient." }
    },
    rpdnode: { "title": "Divide", "inlets": { "a": { "type": "mozziflow/any" }, "b": { "type": "mozziflow/any", "no_text": true } }, "outlets": { "out": { "type": "mozziflow/int32_t" } } }
});

NodeLibrary.push({
    nodetype: 'mozziflow/xor',
    category: "math",
    nodeclass: "MathXOR",
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px"; container.style.background = "rgba(0,255,153,0.05)";
            container.style.border = "1px solid #0f9"; container.style.marginBottom = "5px";
            createMathInput("VAL B", node, "b", "0", container);
            bodyElm.appendChild(container);
        }
    },
    mozzi: { 
        rate: "audio", is_inline: true, 
        audio: function(n,v,i) { return "node_" + n.id + "_out = ((int)" + i.a + " ^ (int)" + i.b + ");"; } 
    },
    help: {
        summary: "Bitwise XOR. Forces Integer math.",
        usage: "Classic Ring Mod effect.",
        inlets: { "a": "Signal A.", "b": "Signal B." },
        outlets: { "out": "XOR'ed signal." }
    },
    rpdnode: { "title": "XOR RingMod", "inlets": { "a": { "type": "mozziflow/any" }, "b": { "type": "mozziflow/any", "no_text": true } }, "outlets": { "out": { "type": "mozziflow/int32_t" } } }
});

NodeLibrary.push({
    nodetype: 'mozziflow/shl',
    category: "math",
    nodeclass: "MathSHL",
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px"; container.style.background = "rgba(0,255,153,0.05)";
            container.style.border = "1px solid #0f9"; container.style.marginBottom = "5px";
            createMathInput("BITS", node, "bits", "1", container);
            bodyElm.appendChild(container);
        }
    },
    mozzi: { 
        rate: "audio", is_inline: true, 
        audio: function(n,v,i) { return "node_" + n.id + "_out = ((int32_t)" + i.a + " << " + i.bits + ");"; } 
    },
    help: {
        summary: "Bitwise Shift Left. Forces Integer math.",
        usage: "Fast multiplication by powers of 2.",
        inlets: { "a": "Input.", "bits": "Shift amount." },
        outlets: { "out": "Shifted signal." }
    },
    rpdnode: { "title": "Shift Left", "inlets": { "a": { "type": "mozziflow/any" }, "bits": { "type": "mozziflow/uint8_t", "no_text": true } }, "outlets": { "out": { "type": "mozziflow/int32_t" } } }
});

NodeLibrary.push({
    nodetype: 'mozziflow/shr',
    category: "math",
    nodeclass: "MathSHR",
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px"; container.style.background = "rgba(0,255,153,0.05)";
            container.style.border = "1px solid #0f9"; container.style.marginBottom = "5px";
            createMathInput("BITS", node, "bits", "8", container);
            bodyElm.appendChild(container);
        }
    },
    mozzi: { 
        rate: "audio", is_inline: true, 
        audio: function(n,v,i) { return "node_" + n.id + "_out = ((int32_t)" + i.a + " >> " + i.bits + ");"; } 
    },
    help: {
        summary: "Bitwise Shift Right. Forces Integer math.",
        usage: "Fast division by powers of 2.",
        inlets: { "a": "Input.", "bits": "Shift amount." },
        outlets: { "out": "Shifted signal." }
    },
    rpdnode: { "title": "Shift Right", "inlets": { "a": { "type": "mozziflow/any" }, "bits": { "type": "mozziflow/uint8_t", "no_text": true } }, "outlets": { "out": { "type": "mozziflow/int32_t" } } }
});

NodeLibrary.push({
    nodetype: 'mozziflow/mtof',
    category: "math",
    nodeclass: "MathMTOF",
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px"; container.style.background = "rgba(0,255,153,0.05)";
            container.style.border = "1px solid #0f9"; container.style.marginBottom = "5px";
            
            var sel = document.createElement('select');
            sel.style.width = "100%"; sel.style.fontSize = "9px"; sel.style.background = "#222"; sel.style.color = "#0ff";
            // FIX: Binding
            sel.className = 'mozzi-inlet-val-input';
            sel.setAttribute('data-alias', 'mode');

            var opts = [["float", "Float (Std)"], ["fixed", "FixMath (Fast)"]];
            opts.forEach(function(o){ 
                var opt = document.createElement('option'); opt.value = o[0]; opt.innerText = o[1];
                if(node.data.cfg_mode === o[0]) opt.selected = true;
                sel.appendChild(opt); 
            });
            sel.onchange = function() { node.data.cfg_mode = this.value; };
            if(!node.data.cfg_mode) node.data.cfg_mode = "float";
            container.appendChild(sel);
            
            createMathInput("NOTE", node, "note", "60", container);
            bodyElm.appendChild(container);
        }
    },
    mozzi: { 
        rate: "control", is_inline: true, includes: ["#include <mozzi_midi.h>"], 
        control: function(n,v,i) { 
            if(n.data.cfg_mode === "fixed") return "node_" + n.id + "_out = Q16n16_mtof(Q8n0_to_Q16n16(" + i.note + "));";
            return "node_" + n.id + "_out = mtof((uint8_t)" + i.note + ");"; 
        } 
    },
    help: {
        summary: "MIDI Note to Frequency converter.",
        usage: "Select 'FixMath' for high-speed conversion useful for driving Phasors or Oscils in Audio Rate.",
        inlets: { "note": "MIDI note number." },
        outlets: { "out": "Frequency (float or Q16n16)." }
    },
    rpdnode: { "title": "Midi->Freq", "inlets": { "note": { "type": "mozziflow/uint8_t", "label": "note", "no_text": true } }, "outlets": { "out": { "type": "mozziflow/any" } } }
});

NodeLibrary.push({
    nodetype: 'mozziflow/map',
    category: "math",
    nodeclass: "MathMap",
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px"; container.style.background = "rgba(0,255,153,0.05)";
            container.style.border = "1px solid #0f9"; container.style.marginBottom = "5px";
            createMathInput("IN MIN", node, "in_min", "0", container);
            createMathInput("IN MAX", node, "in_max", "127", container);
            createMathInput("OUT MIN", node, "out_min", "40", container);
            createMathInput("OUT MAX", node, "out_max", "10000", container);
            bodyElm.appendChild(container);
        }
    },
    mozzi: { 
        rate: "control", is_inline: true,
        defaults: { "in_min": "0", "in_max": "127", "out_min": "40", "out_max": "10000" },
        control: function(n,v,i) { 
            return "node_" + n.id + "_out = (long)(" + i.in + " - " + i.in_min + ") * (long)(" + i.out_max + " - " + i.out_min + ") / (long)(" + i.in_max + " - " + i.in_min + ") + " + i.out_min + ";";
        },
        audio: function(n,v,i) { 
            return "node_" + n.id + "_out = (long)(" + i.in + " - " + i.in_min + ") * (long)(" + i.out_max + " - " + i.out_min + ") / (long)(" + i.in_max + " - " + i.in_min + ") + " + i.out_min + ";";
        }
    },
    help: {
        summary: "Linear range mapper.",
        usage: "Uses 32-bit math to prevent overflow.",
        inlets: { "in": "Source signal.", "in_min/max": "Source range.", "out_min/max": "Target range." },
        outlets: { "out": "Scaled signal." }
    },
    rpdnode: { "title": "Map Range", "inlets": { "in": { "type": "mozziflow/any" }, "in_min": { "type": "mozziflow/any", "no_text": true }, "in_max": { "type": "mozziflow/any", "no_text": true }, "out_min": { "type": "mozziflow/any", "no_text": true }, "out_max": { "type": "mozziflow/any", "no_text": true } }, "outlets": { "out": { "type": "mozziflow/int32_t" } } }
});
