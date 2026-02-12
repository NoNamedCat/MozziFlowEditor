// Mozzi Node Definitions - MIXER & MODIFIER (v8.0 Gold)
// Gestión de amplitud, mezcla y saturación de señales con precisión variable

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
            createPrecisionSelector(node, container);
            createMixerInput("CTRL (0-255)", node, "cv", "255", container);
            bodyElm.appendChild(container);
        }
    },
    mozzi: {
        rate: "audio", is_inline: true, defaults: { "cv": "255" },
        inputs: {
            "in": { type: function(n) { 
                var d = n.data.cfg_domain || "int";
                if (d === "float") return "float";
                if (d === "sfix") return "SFix<15,16>";
                return n.data.cfg_precision || "int32_t"; 
            } },
            "cv": { type: "uint8_t" }
        },
        output_type: function(n) { 
            var d = n.data.cfg_domain || "int";
            if (d === "float") return "float";
            if (d === "sfix") return "SFix<15,16>"; 
            return n.data.cfg_precision || "int32_t";
        },
        audio: function(n,v,i){
            var d = n.data.cfg_domain || "int";
            if (d === "sfix") return "node_" + n.id + "_out = (" + i.in + " * UFix<0,8>::fromRaw(" + i.cv + "));";
            if (d === "float") return "node_" + n.id + "_out = " + i.in + " * (" + i.cv + " / 255.0f);";
            return "node_" + n.id + "_out = (" + i.cv + " == 0) ? 0 : ((" + i.in + " * " + i.cv + ") >> 8);"; 
        }
    },
    help: {
        summary: "Voltage Controlled Amplifier.",
        usage: "Int mode supports variable bit-depth output (8/16/32-bit).",
        inlets: { "in": "Audio signal.", "cv": "Amplitud control (0-255)." },
        outlets: { "out": "Amplified signal." }
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
            createPrecisionSelector(node, container);
            if(!node.data.cfg_domain_set) { node.data.cfg_domain = "sfix"; node.data.cfg_domain_set = true; }
            var sel = container.querySelector('select'); if(sel) sel.value = node.data.cfg_domain;
            createMixerInput("MUL (x.x)", node, "gain", "1.0", container);
            bodyElm.appendChild(container);
        }
    },
    mozzi: {
        rate: "audio", is_inline: true, defaults: { "gain": "1.0" },
        inputs: {
            "in": { type: function(n) { 
                if (n.data.cfg_domain === "float") return "float";
                if (n.data.cfg_domain === "sfix") return "SFix<15,16>";
                return "int32_t"; 
            } },
            "gain": { type: "float" }
        },
        output_type: function(n) { 
            var d = n.data.cfg_domain || "sfix";
            if (d === "float") return "float";
            if (d === "sfix") return "SFix<15,16>"; 
            return n.data.cfg_precision || "int32_t";
        },
        audio: function(n,v,i){ 
            var d = n.data.cfg_domain || "sfix";
            if (d === "sfix") return "node_" + n.id + "_out = (" + i.in + " * SFix<8,8>(" + i.gain + "));";
            if (d === "float") return "node_" + n.id + "_out = " + i.in + " * " + i.gain + ";";
            return "node_" + n.id + "_out = " + i.in + " * " + i.gain + ";";
        }
    },
    help: {
        summary: "High-precision gain stage.",
        usage: "Use lower precision (e.g. 8-bit) for creative digital distortion.",
        inlets: { "in": "Any signal.", "gain": "Multiplier factor." },
        outlets: { "out": "Scaled signal." }
    },
    rpdnode: { "title": "Gain Stage", "inlets": { "in": { "type": "mozziflow/any" }, "gain": { "type": "mozziflow/any", "label": "mul", "no_text": true } }, "outlets": { "out": { "type": "mozziflow/int32_t" } } }
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
            createPrecisionSelector(node, container);
            createMixerInput("MIX", node, "mix", "128", container);
            bodyElm.appendChild(container);
        }
    },
    mozzi: { 
        rate: "audio", is_inline: true, defaults: { "mix": "128" },
        inputs: {
            "a": { type: function(n) { return (n.data.cfg_domain === "float") ? "float" : "int32_t"; } },
            "b": { type: function(n) { return (n.data.cfg_domain === "float") ? "float" : "int32_t"; } },
            "mix": { type: "uint8_t" }
        },
        output_type: function(n) { 
            var d = n.data.cfg_domain || "int";
            if (d === "float") return "float";
            if (d === "sfix") return "int32_t"; 
            return n.data.cfg_precision || "int32_t";
        },
        audio: function(n,v,i) { 
            var d = n.data.cfg_domain || "int";
            if (d === "sfix") return "node_" + n.id + "_out = ((SFix<15,0>(" + i.a + ") * UFix<0,8>::fromRaw(255 - " + i.mix + ")) + (SFix<15,0>(" + i.b + ") * UFix<0,8>::fromRaw(" + i.mix + "))).asInt();";
            if (d === "float") return "node_" + n.id + "_out = (" + i.a + " * (1.0f - (" + i.mix + "/255.0f))) + (" + i.b + " * (" + i.mix + "/255.0f));";
            return "node_" + n.id + "_out = ((" + i.a + " * (255 - " + i.mix + ")) + (" + i.b + " * " + i.mix + ")) >> 8;"; 
        }
    },
    help: {
        summary: "Linear crossfader between two signals.",
        usage: "Blends signal A and B.",
        inlets: { "a": "Input A.", "b": "Input B.", "mix": "Balance control (0-255)." },
        outlets: { "out": "Blended signal." }
    },
    rpdnode: { "title": "Crossfader", "inlets": { "a": { "type": "mozziflow/any" }, "b": { "type": "mozziflow/any" }, "mix": { "type": "mozziflow/uint8_t", "label": "mix", "no_text": true } }, "outlets": { "out": { "type": "mozziflow/int32_t" } } }
});

var mixerInlets = {};
for(var i=0; i<16; i++) mixerInlets["in"+i] = { "type": "mozziflow/any", "label": "in"+(i+1) };

NodeLibrary.push({
    nodetype: 'mozziflow/mixer',
    category: "mixer",
    nodeclass: "MixerVar",
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px"; container.style.background = "rgba(100,100,255,0.05)";
            container.style.border = "1px solid #66f"; container.style.marginBottom = "5px";
            
            createMixerDomainSelector(node, container);
            createPrecisionSelector(node, container);

            var lbl = document.createElement('div'); lbl.innerText = "CHANNELS"; lbl.style.fontSize = "7px"; lbl.style.color = "#0f9";
            var inp = document.createElement('input');
            inp.type = "number"; inp.min = "2"; inp.max = "16"; inp.style.width = "100%";
            inp.className = 'mozzi-inlet-val-input'; inp.setAttribute('data-alias', 'channels');
            inp.value = node.data.cfg_channels || "4";
            inp.onchange = function() { node.data.cfg_channels = this.value; syncVisibility(); };
            
            container.appendChild(lbl);
            container.appendChild(inp);
            bodyElm.appendChild(container);

            var syncVisibility = function() {
                var ch = parseInt(node.data.cfg_channels) || 4;
                var nElm = bodyElm;
                while (nElm && !nElm.classList.contains('rpd-node')) nElm = nElm.parentElement;
                if (!nElm) return;
                nElm.querySelectorAll('.rpd-inlet').forEach(function(row) {
                    var label = row.querySelector('.rpd-name');
                    if (label && label.innerText.indexOf('in') === 0) {
                        var idx = parseInt(label.innerText.replace('in', '')) - 1;
                        row.style.display = (idx < ch) ? '' : 'none';
                    }
                });
            };
            node._syncHardwareUI = syncVisibility;
            setTimeout(syncVisibility, 50);
        }
    },
    mozzi: {
        rate: "audio", is_inline: true,
        inputs: (function(){ var p={}; for(var i=0; i<16; i++) p["in"+i] = { type: function(n) { return (n.data.cfg_domain === "float") ? "float" : ((n.data.cfg_domain === "sfix") ? "SFix<15,16>" : (n.data.cfg_precision || "int32_t")); } }; return p; })(),
        output_type: function(n) { 
            var d = n.data.cfg_domain || "int";
            if (d === "float") return "float";
            if (d === "sfix") return "SFix<15,16>"; 
            return n.data.cfg_precision || "int32_t";
        },
        audio: function(n,v,i) {
            var ch = parseInt(n.data.cfg_channels) || 4;
            var d = n.data.cfg_domain || "int";
            var sum = "";
            for(var k=0; k<ch; k++) {
                var val = i["in"+k] || ((d === "float") ? "0.0f" : ((d === "sfix") ? "SFix<15,16>(0)" : "0"));
                if (k > 0) sum += " + ";
                if (d === "sfix") sum += "SFix<15,16>(" + val + ")";
                else sum += val;
            }
            if (d === "sfix") return "node_" + n.id + "_out = (" + sum + ");"; 
            return "node_" + n.id + "_out = " + sum + ";";
        }
    },
    help: {
        summary: "Multi-channel summing mixer.",
        usage: "Sum up to 16 signals. Select number of channels and precision domain.",
        inlets: { "inX": "Input signal X." },
        outlets: { "out": "Summed signal." }
    },
    rpdnode: { "title": "Mixer", "inlets": mixerInlets, "outlets": { "out": { "type": "mozziflow/int32_t" } } }
});
