// Mozzi Node Definitions - MATH (v8.0 Gold)
// Operaciones numéricas puras y escalado de señales con precisión variable

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

var createMathDomainSelector = function(node, container) {
    var row = document.createElement('div');
    row.style.display = "flex"; row.style.justifyContent = "space-between"; row.style.marginBottom = "4px";
    var sel = document.createElement('select');
    sel.style.width = "100%"; sel.style.fontSize = "9px"; sel.style.background = "#222"; sel.style.color = "#0ff";
    sel.className = 'mozzi-inlet-val-input';
    sel.setAttribute('data-alias', 'domain');
    var opts = [["int", "Int (Fast)"], ["sfix", "FixMath (Safe)"], ["float", "Float (Precise)"]];
    opts.forEach(function(o){ 
        var opt = document.createElement('option'); opt.value = o[0]; opt.innerText = o[1];
        if(node.data.cfg_domain === o[0]) opt.selected = true;
        sel.appendChild(opt); 
    });
    sel.onchange = function() { node.data.cfg_domain = this.value; if (node._onDataUpdate) node._onDataUpdate(); };
    if(!node.data.cfg_domain) node.data.cfg_domain = "int";
    row.appendChild(sel);
    container.appendChild(row);
};

var createPrecisionSelector = function(node, container) {
    var row = document.createElement('div');
    row.style.display = "flex"; row.style.justifyContent = "space-between"; row.style.marginBottom = "4px";
    var lbl = document.createElement('span'); lbl.innerText = "BITS:"; lbl.style.fontSize = "8px"; row.appendChild(lbl);
    var sel = document.createElement('select');
    sel.style.width = "60%"; sel.style.fontSize = "9px"; sel.style.background = "#222"; sel.style.color = "#fc0";
    sel.className = 'mozzi-inlet-val-input';
    sel.setAttribute('data-alias', 'precision');
    var opts = [["int32_t", "32-bit (Safe)"], ["int16_t", "16-bit (Std)"], ["int8_t", "8-bit (Lofi)"], ["uint8_t", "u8 (Raw)"]];
    opts.forEach(function(o){ 
        var opt = document.createElement('option'); opt.value = o[0]; opt.innerText = o[1];
        if(node.data.cfg_precision === o[0]) opt.selected = true;
        sel.appendChild(opt); 
    });
    sel.onchange = function() { node.data.cfg_precision = this.value; };
    if(!node.data.cfg_precision) node.data.cfg_precision = "int32_t";
    
    if (node.data.cfg_domain === 'int' || !node.data.cfg_domain) {
        row.appendChild(sel);
        container.appendChild(row);
    }
};

NodeLibrary.push({
    nodetype: 'mozziflow/add',
    category: "math",
    nodeclass: "MathAdd",
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px"; container.style.background = "rgba(100,100,255,0.05)";
            container.style.border = "1px solid #66f"; container.style.marginBottom = "5px";
            createMathDomainSelector(node, container);
            createPrecisionSelector(node, container);
            createMathInput("VAL B", node, "b", "0", container);
            bodyElm.appendChild(container);
        }
    },
    mozzi: {
        rate: "audio", is_inline: true,
        inputs: {
            "a": { type: function(n) { return (n.data.cfg_domain === "float") ? "float" : ((n.data.cfg_domain === "sfix") ? "SFix<15,16>" : (n.data.cfg_precision || "int32_t")); } },
            "b": { type: function(n) { return (n.data.cfg_domain === "float") ? "float" : ((n.data.cfg_domain === "sfix") ? "SFix<15,16>" : (n.data.cfg_precision || "int32_t")); } }
        },
        output_type: function(n) { 
            var d = n.data.cfg_domain || "int";
            if (d === "float") return "float";
            if (d === "sfix") return "SFix<15,16>";
            return n.data.cfg_precision || "int32_t";
        },
        audio: function(n,v,i){
            var d = n.data.cfg_domain || "int";
            if (d === "sfix") return "node_" + n.id + "_out = (SFix<15,16>(" + i.a + ") + SFix<15,16>(" + i.b + "));";
            return "node_" + n.id + "_out = " + i.a + " + " + i.b + ";";
        }
    },
    help: { summary: "Arithmetic addition (A + B).", usage: "Supports Int/Fix/Float. Lower precision allows for intentional overflow." },
    rpdnode: { "title": "Add", "inlets": { "a": { "type": "mozziflow/any" }, "b": { "type": "mozziflow/any", "label": "b", "no_text": true } }, "outlets": { "out": { "type": "mozziflow/int32_t" } } }
});

NodeLibrary.push({
    nodetype: 'mozziflow/sub',
    category: "math",
    nodeclass: "MathSub",
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px"; container.style.background = "rgba(100,100,255,0.05)";
            container.style.border = "1px solid #66f"; container.style.marginBottom = "5px";
            createMathDomainSelector(node, container);
            createPrecisionSelector(node, container);
            createMathInput("VAL B", node, "b", "0", container);
            bodyElm.appendChild(container);
        }
    },
    mozzi: {
        rate: "audio", is_inline: true,
        inputs: {
            "a": { type: function(n) { return (n.data.cfg_domain === "float") ? "float" : ((n.data.cfg_domain === "sfix") ? "SFix<15,16>" : (n.data.cfg_precision || "int32_t")); } },
            "b": { type: function(n) { return (n.data.cfg_domain === "float") ? "float" : ((n.data.cfg_domain === "sfix") ? "SFix<15,16>" : (n.data.cfg_precision || "int32_t")); } }
        },
        output_type: function(n) { 
            var d = n.data.cfg_domain || "int";
            if (d === "float") return "float";
            if (d === "sfix") return "SFix<15,16>";
            return n.data.cfg_precision || "int32_t";
        },
        audio: function(n,v,i){
            var d = n.data.cfg_domain || "int";
            if (d === "sfix") return "node_" + n.id + "_out = (SFix<15,16>(" + i.a + ") - SFix<15,16>(" + i.b + "));";
            return "node_" + n.id + "_out = " + i.a + " - " + i.b + ";";
        }
    },
    help: { summary: "Arithmetic subtraction (A - B).", usage: "A - B." },
    rpdnode: { "title": "Sub", "inlets": { "a": { "type": "mozziflow/any" }, "b": { "type": "mozziflow/any", "label": "b", "no_text": true } }, "outlets": { "out": { "type": "mozziflow/int32_t" } } }
});

NodeLibrary.push({
    nodetype: 'mozziflow/mul',
    category: "math",
    nodeclass: "MathMul",
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px"; container.style.background = "rgba(100,100,255,0.05)";
            container.style.border = "1px solid #66f"; container.style.marginBottom = "5px";
            createMathDomainSelector(node, container);
            createPrecisionSelector(node, container);
            createMathInput("VAL B", node, "b", "1", container);
            bodyElm.appendChild(container);
        }
    },
    mozzi: {
        rate: "audio", is_inline: true, defaults: { "b": "1" },
        inputs: {
            "a": { type: function(n) { return (n.data.cfg_domain === "float") ? "float" : ((n.data.cfg_domain === "sfix") ? "SFix<15,16>" : (n.data.cfg_precision || "int32_t")); } },
            "b": { type: function(n) { return (n.data.cfg_domain === "float") ? "float" : ((n.data.cfg_domain === "sfix") ? "SFix<15,16>" : (n.data.cfg_precision || "int32_t")); } }
        },
        output_type: function(n) { 
            var d = n.data.cfg_domain || "int";
            if (d === "float") return "float";
            if (d === "sfix") return "SFix<15,16>";
            return n.data.cfg_precision || "int32_t";
        },
        audio: function(n,v,i){
            var d = n.data.cfg_domain || "int";
            if (d === "sfix") return "node_" + n.id + "_out = (SFix<15,16>(" + i.a + ") * SFix<15,16>(" + i.b + "));";
            return "node_" + n.id + "_out = " + i.a + " * " + i.b + ";";
        }
    },
    help: { summary: "Arithmetic multiplication (A * B).", usage: "A * B." },
    rpdnode: { "title": "Mul", "inlets": { "a": { "type": "mozziflow/any" }, "b": { "type": "mozziflow/any", "label": "b", "no_text": true } }, "outlets": { "out": { "type": "mozziflow/int32_t" } } }
});

NodeLibrary.push({
    nodetype: 'mozziflow/div',
    category: "math",
    nodeclass: "MathDiv",
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px"; container.style.background = "rgba(100,100,255,0.05)";
            container.style.border = "1px solid #66f"; container.style.marginBottom = "5px";
            createMathDomainSelector(node, container);
            createPrecisionSelector(node, container);
            createMathInput("VAL B", node, "b", "1", container);
            bodyElm.appendChild(container);
        }
    },
    mozzi: {
        rate: "audio", is_inline: true, defaults: { "b": "1" },
        inputs: {
            "a": { type: function(n) { return (n.data.cfg_domain === "float") ? "float" : ((n.data.cfg_domain === "sfix") ? "SFix<15,16>" : (n.data.cfg_precision || "int32_t")); } },
            "b": { type: function(n) { return (n.data.cfg_domain === "float") ? "float" : ((n.data.cfg_domain === "sfix") ? "SFix<15,16>" : (n.data.cfg_precision || "int32_t")); } }
        },
        output_type: function(n) { 
            var d = n.data.cfg_domain || "int";
            if (d === "float") return "float";
            if (d === "sfix") return "SFix<15,16>";
            return n.data.cfg_precision || "int32_t";
        },
        audio: function(n,v,i){
            var check = "(" + i.b + " != 0)";
            var d = n.data.cfg_domain || "int";
            if (d === "sfix") return "node_" + n.id + "_out = " + check + " ? (SFix<15,16>(" + i.a + ") * SFix<15,16>(" + i.b + ").inv()) : SFix<15,16>(0);";
            return "node_" + n.id + "_out = " + check + " ? (" + i.a + " / " + i.b + ") : 0;";
        }
    },
    help: { summary: "Arithmetic division (A / B).", usage: "Includes protection against division by zero." },
    rpdnode: { "title": "Div", "inlets": { "a": { "type": "mozziflow/any" }, "b": { "type": "mozziflow/any", "label": "b", "no_text": true } }, "outlets": { "out": { "type": "mozziflow/int32_t" } } }
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
        audio: function(n,v,i) { return "node_" + n.id + "_out = (" + i.a + " ^ " + i.b + ");"; } 
    },
    help: { summary: "Bitwise XOR.", usage: "Classic Ring Mod effect." },
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
        audio: function(n,v,i) { return "node_" + n.id + "_out = (" + i.a + " << " + i.bits + ");"; } 
    },
    help: { summary: "Bitwise Shift Left.", usage: "Fast multiplication by powers of 2." },
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
        audio: function(n,v,i) { return "node_" + n.id + "_out = (" + i.a + " >> " + i.bits + ");"; } 
    },
    help: { summary: "Bitwise Shift Right.", usage: "Fast division by powers of 2." },
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
            return "node_" + n.id + "_out = mtof(" + i.note + ");"; 
        } 
    },
    help: { summary: "MIDI Note to Frequency.", usage: "Select 'FixMath' for high-speed conversion." },
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
        inputs: {
            "in": { type: "long" },
            "in_min": { type: "long" }, "in_max": { type: "long" },
            "out_min": { type: "long" }, "out_max": { type: "long" }
        },
        control: function(n,v,i) { 
            return "node_" + n.id + "_out = (" + i.in + " - " + i.in_min + ") * (" + i.out_max + " - " + i.out_min + ") / (" + i.in_max + " - " + i.in_min + ") + " + i.out_min + ";";
        }
    },
    help: { summary: "Linear range mapper.", usage: "Uses 32-bit math to prevent overflow." },
    rpdnode: { "title": "Map Range", "inlets": { "in": { "type": "mozziflow/any" }, "in_min": { "type": "mozziflow/any", "no_text": true }, "in_max": { "type": "mozziflow/any", "no_text": true }, "out_min": { "type": "mozziflow/any", "no_text": true }, "out_max": { "type": "mozziflow/any", "no_text": true } }, "outlets": { "out": { "type": "mozziflow/int32_t" } } }
});