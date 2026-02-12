// Mozzi Node Definitions - LOGIC & COMPARISON (v5.9 Safe Logic)
// Pure C++ Assembler - Boolean operations and value comparisons

var createLogicInput = function(label, node, key, defaultValue, container) {
    var row = document.createElement('div');
    row.style.display = "flex"; row.style.justifyContent = "space-between"; row.style.fontSize = "8px"; row.style.marginBottom = "2px";
    var lbl = document.createElement('span'); lbl.innerText = label + ":"; row.appendChild(lbl);
    var inp = document.createElement('input');
    inp.type = "text"; inp.style.width = "40px";
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

var createLogicDomainSelector = function(node, container) {
    var row = document.createElement('div');
    row.style.display = "flex"; row.style.justifyContent = "space-between"; row.style.marginBottom = "4px";
    var sel = document.createElement('select');
    sel.style.width = "100%"; sel.style.fontSize = "9px"; sel.style.background = "#222"; sel.style.color = "#0ff";
    // FIX: Binding
    sel.className = 'mozzi-inlet-val-input';
    sel.setAttribute('data-alias', 'domain');

    var opts = [["int", "Int Logic"], ["sfix", "FixMath Logic"]];
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

var genLogicCode = function(node, i, op) {
    var d = node.data.cfg_domain || "int";
    if (d === "sfix") return "node_" + node.id + "_out = (SFix<15,0>(" + i.a + ") " + op + " SFix<15,0>(" + i.b + "));";
    return "node_" + node.id + "_out = (" + i.a + " " + op + " " + i.b + ");";
};

var logicInputs = {
    "a": { type: "int32_t" },
    "b": { type: "int32_t" }
};

NodeLibrary.push({
    nodetype: 'mozziflow/gt',
    category: "logic",
    nodeclass: "MathGT",
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px"; container.style.background = "rgba(0,255,153,0.05)";
            container.style.border = "1px solid #0f9"; container.style.marginBottom = "5px";
            createLogicDomainSelector(node, container);
            createLogicInput("VAL B", node, "b", "0", container);
            bodyElm.appendChild(container);
        }
    },
    mozzi: { 
        rate: "audio", is_inline: true, inputs: logicInputs,
        audio: function(n,v,i) { return genLogicCode(n, i, ">"); }
    },
    help: {
        summary: "Greater Than.",
        usage: "True if A > B. Use FixMath logic if comparing mixed signal types.",
        inlets: { "a": "Input A.", "b": "Input B." },
        outlets: { "out": "Boolean result." }
    },
    rpdnode: { "title": "Greater Than", "inlets": { "a": { "type": "mozziflow/any" }, "b": { "type": "mozziflow/any", "no_text": true } }, "outlets": { "out": { "type": "mozziflow/bool" } } }
});

NodeLibrary.push({
    nodetype: 'mozziflow/lt',
    category: "logic",
    nodeclass: "MathLT",
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px"; container.style.background = "rgba(0,255,153,0.05)";
            container.style.border = "1px solid #0f9"; container.style.marginBottom = "5px";
            createLogicDomainSelector(node, container);
            createLogicInput("VAL B", node, "b", "0", container);
            bodyElm.appendChild(container);
        }
    },
    mozzi: { 
        rate: "audio", is_inline: true, inputs: logicInputs,
        audio: function(n,v,i) { return genLogicCode(n, i, "<"); }
    },
    help: {
        summary: "Less Than.",
        inlets: { "a": "Input A.", "b": "Input B." },
        outlets: { "out": "Boolean result." }
    },
    rpdnode: { "title": "Less Than", "inlets": { "a": { "type": "mozziflow/any" }, "b": { "type": "mozziflow/any", "no_text": true } }, "outlets": { "out": { "type": "mozziflow/bool" } } }
});

NodeLibrary.push({
    nodetype: 'mozziflow/eq',
    category: "logic",
    nodeclass: "MathEQ",
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px"; container.style.background = "rgba(0,255,153,0.05)";
            container.style.border = "1px solid #0f9"; container.style.marginBottom = "5px";
            createLogicDomainSelector(node, container);
            createLogicInput("VAL B", node, "b", "0", container);
            bodyElm.appendChild(container);
        }
    },
    mozzi: { 
        rate: "audio", is_inline: true, inputs: logicInputs,
        audio: function(n,v,i) { return genLogicCode(n, i, "=="); }
    },
    help: {
        summary: "Equal.",
        inlets: { "a": "Input A.", "b": "Input B." },
        outlets: { "out": "Boolean result." }
    },
    rpdnode: { "title": "Equal", "inlets": { "a": { "type": "mozziflow/any" }, "b": { "type": "mozziflow/any", "no_text": true } }, "outlets": { "out": { "type": "mozziflow/bool" } } }
});

NodeLibrary.push({
    nodetype: 'mozziflow/and',
    category: "logic",
    nodeclass: "LogicAND",
    mozzi: { 
        is_inline: true, 
        inputs: { "a": { type: "bool" }, "b": { type: "bool" } },
        audio: function(n,v,i) { return "node_" + n.id + "_out = (" + i.a + " && " + i.b + ");"; }
    },
    help: {
        summary: "Logical AND gate.",
        usage: "True only if both A and B are True.",
        inlets: { "a": "Bool A.", "b": "Bool B." },
        outlets: { "out": "Boolean result." }
    },
    rpdnode: { "title": "AND", "inlets": { "a": { "type": "mozziflow/bool", "no_text": true }, "b": { "type": "mozziflow/bool", "no_text": true } }, "outlets": { "out": { "type": "mozziflow/bool" } } }
});

NodeLibrary.push({
    nodetype: 'mozziflow/or',
    category: "logic",
    nodeclass: "LogicOR",
    mozzi: { 
        is_inline: true, 
        inputs: { "a": { type: "bool" }, "b": { type: "bool" } },
        audio: function(n,v,i) { return "node_" + n.id + "_out = (" + i.a + " || " + i.b + ");"; }
    },
    help: {
        summary: "Logical OR gate.",
        inlets: { "a": "Bool A.", "b": "Bool B." },
        outlets: { "out": "Boolean result." }
    },
    rpdnode: { "title": "OR", "inlets": { "a": { "type": "mozziflow/bool", "no_text": true }, "b": { "type": "mozziflow/bool", "no_text": true } }, "outlets": { "out": { "type": "mozziflow/bool" } } }
});

NodeLibrary.push({
    nodetype: 'mozziflow/not',
    category: "logic",
    nodeclass: "LogicNOT",
    mozzi: { 
        is_inline: true, 
        inputs: { "in": { type: "bool" } },
        audio: function(n,v,i) { return "node_" + n.id + "_out = !" + i.in + ";"; }
    },
    help: {
        summary: "Logical NOT gate.",
        inlets: { "in": "Boolean signal." },
        outlets: { "out": "Inverted boolean." }
    },
    rpdnode: { "title": "NOT", "inlets": { "in": { "type": "mozziflow/bool" } }, "outlets": { "out": { "type": "mozziflow/bool" } } }
});