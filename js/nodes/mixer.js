// Mozzi Node Definitions - MIXER & MODIFIER (v6.6 Clean)
// Gestión de amplitud, mezcla y saturación de señales

var createMixerInput = function(label, node, key, defaultValue, container) {
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

var createMixerDomainSelector = function(node, container) {
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
    if(!node.data.cfg_domain) node.data.cfg_domain = "int"; // Default to int for speed
    // Special default for Gain handled in its renderer
    row.appendChild(sel);
    container.appendChild(row);
};

NodeLibrary.push({
    nodetype: 'mozziflow/vca',
    category: "mixer",
    nodeclass: "MozziVCA",
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px"; container.style.background = "rgba(0,255,153,0.05)";
            container.style.border = "1px solid #0f9"; container.style.marginBottom = "5px";
            createMixerDomainSelector(node, container);
            createMixerInput("CTRL (0-255)", node, "cv", "255", container);
            bodyElm.appendChild(container);
        }
    },
    mozzi: {
        rate: "audio", is_inline: true, defaults: { "cv": "255" },
        audio: function(n,v,i){
            var d = n.data.cfg_domain || "int";
            // sfix: In * (CV/256) -> Fractional multiplication
            if (d === "sfix") return "node_" + n.id + "_out = (SFix<15,0>(" + i.in + ") * UFix<0,8>::fromRaw(" + i.cv + ")).asInt();";
            if (d === "float") return "node_" + n.id + "_out = (int32_t)((float)" + i.in + " * ((float)" + i.cv + " / 255.0f));";
            // int: (In * CV) >> 8
            return "node_" + n.id + "_out = ((int32_t)" + i.in + " * " + i.cv + ") >> 8;"; 
        }
    },
    help: {
        summary: "Voltage Controlled Amplifier. Multiplies audio signal by a control value.",
        usage: "Connect audio to 'in' and an envelope or LFO to 'cv'. Int mode uses bit-shift (fastest). FixMath is safer.",
        inlets: { "in": "Audio signal.", "cv": "Amplitud control (0-255)." },
        outlets: { "out": "32-bit amplified signal." }
    },
    rpdnode: { "title": "VCA", "inlets": { "in": { "type": "mozziflow/any" }, "cv": { "type": "mozziflow/any", "label": "cv", "no_text": true } }, "outlets": { "out": { "type": "mozziflow/int32_t" } } }
});

NodeLibrary.push({
    nodetype: 'mozziflow/gain',
    category: "mixer",
    nodeclass: "MozziGain",
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px"; container.style.background = "rgba(0,255,153,0.05)";
            container.style.border = "1px solid #0f9"; container.style.marginBottom = "5px";
            createMixerDomainSelector(node, container);
            if(!node.data.cfg_domain_set) { node.data.cfg_domain = "sfix"; node.data.cfg_domain_set = true; }
            var sel = container.querySelector('select'); if(sel) sel.value = node.data.cfg_domain;
            createMixerInput("MUL (x.x)", node, "gain", "1.0", container);
            bodyElm.appendChild(container);
        }
    },
    mozzi: {
        rate: "audio", is_inline: true, defaults: { "gain": "1.0" },
        audio: function(n,v,i){ 
            var d = n.data.cfg_domain || "sfix";
            if (d === "sfix") return "node_" + n.id + "_out = (SFix<15,0>(" + i.in + ") * SFix<8,8>(" + i.gain + "f)).asInt();";
            if (d === "float") return "node_" + n.id + "_out = (int32_t)((float)" + i.in + " * " + i.gain + "f);";
            return "node_" + n.id + "_out = (int32_t)(" + i.in + " * (int)" + i.gain + ");";
        }
    },
    help: {
        summary: "High-precision gain stage.",
        usage: "FixMath domain handles decimal gains (e.g. 0.5) safely. Int domain truncates decimals!",
        inlets: { "in": "Any signal.", "gain": "Multiplier factor (float-like)." },
        outlets: { "out": "32-bit scaled signal." }
    },
    rpdnode: { "title": "Gain Stage", "inlets": { "in": { "type": "mozziflow/any" }, "gain": { "type": "mozziflow/any", "label": "mul", "no_text": true } }, "outlets": { "out": { "type": "mozziflow/int32_t" } } }
});

NodeLibrary.push({
    nodetype: 'mozziflow/add3',
    category: "mixer",
    nodeclass: "MathAdd3",
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px"; container.style.background = "rgba(0,255,153,0.05)";
            container.style.border = "1px solid #0f9"; container.style.marginBottom = "5px";
            createMixerDomainSelector(node, container);
            createMixerInput("VAL B", node, "b", "0", container);
            createMixerInput("VAL C", node, "c", "0", container);
            bodyElm.appendChild(container);
        }
    },
    mozzi: { 
        rate: "audio", is_inline: true, 
        audio: function(n,v,i) { 
            var d = n.data.cfg_domain || "int";
            if (d === "sfix") return "node_" + n.id + "_out = (SFix<15,0>(" + i.a + ") + SFix<15,0>(" + i.b + ") + SFix<15,0>(" + i.c + ")).asInt();";
            if (d === "float") return "node_" + n.id + "_out = (int32_t)((float)" + i.a + " + (float)" + i.b + " + (float)" + i.c + ");";
            return "node_" + n.id + "_out = (" + i.a + " + " + i.b + " + " + i.c + ");"; 
        } 
    },
    help: {
        summary: "Simple 3-channel signal summer.",
        usage: "Mix three signals together. Beware of clipping if the sum exceeds bit-depth limits.",
        inlets: { "a": "Input A.", "b": "Input B.", "c": "Input C." },
        outlets: { "out": "32-bit mixed signal." }
    },
    rpdnode: { "title": "Mixer 3", "inlets": { "a": { "type": "mozziflow/any" }, "b": { "type": "mozziflow/any", "no_text": true }, "c": { "type": "mozziflow/any", "no_text": true } }, "outlets": { "out": { "type": "mozziflow/int32_t" } } }
});

NodeLibrary.push({
    nodetype: 'mozziflow/xfade',
    category: "mixer",
    nodeclass: "MathXFade",
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px"; container.style.background = "rgba(0,255,153,0.05)";
            container.style.border = "1px solid #0f9"; container.style.marginBottom = "5px";
            createMixerDomainSelector(node, container);
            createMixerInput("MIX", node, "mix", "128", container);
            bodyElm.appendChild(container);
        }
    },
    mozzi: { 
        rate: "audio", is_inline: true, defaults: { "mix": "128" },
        audio: function(n,v,i) { 
            var d = n.data.cfg_domain || "int";
            // Mix is 0-255. FixMath uses UFix fractions for exact scaling.
            if (d === "sfix") return "node_" + n.id + "_out = ((SFix<15,0>(" + i.a + ") * UFix<0,8>::fromRaw(255 - " + i.mix + ")) + (SFix<15,0>(" + i.b + ") * UFix<0,8>::fromRaw(" + i.mix + "))).asInt();";
            if (d === "float") return "node_" + n.id + "_out = (int32_t)(((float)" + i.a + " * (1.0f - ((float)" + i.mix + "/255.0f))) + ((float)" + i.b + " * ((float)" + i.mix + "/255.0f)));";
            // Integer fast version
            return "node_" + n.id + "_out = (((" + i.a + " * (255 - " + i.mix + ")) + (" + i.b + " * " + i.mix + "))) >> 8;"; 
        }
    },
    help: {
        summary: "Linear crossfader between two signals.",
        usage: "Blends signal A and B. When 'mix' is 0, only A is heard. At 255, only B is heard.",
        inlets: { "a": "Input A.", "b": "Input B.", "mix": "Balance control (0-255)." },
        outlets: { "out": "32-bit blended signal." }
    },
    rpdnode: { "title": "Crossfader", "inlets": { "a": { "type": "mozziflow/any" }, "b": { "type": "mozziflow/any" }, "mix": { "type": "mozziflow/uint8_t", "label": "mix", "no_text": true } }, "outlets": { "out": { "type": "mozziflow/int32_t" } } }
});