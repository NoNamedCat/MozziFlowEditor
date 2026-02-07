// Mozzi Node Definitions - SIGNAL (v7.1 Clean & Documented)
var createSignalInput = function(label, node, key, defaultValue, container) {
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

NodeLibrary.push({
    nodetype: 'mozziflow/hard_clipper',
    category: "signal",
    nodeclass: "HardClipper",
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px"; container.style.background = "rgba(0,255,153,0.05)";
            container.style.border = "1px solid #0f9"; container.style.marginBottom = "5px";
            createSignalInput("THR", node, "thr", "127", container);
            bodyElm.appendChild(container);
        }
    },
    mozzi: {
        rate: "audio", is_inline: true, defaults: { "thr": "127" },
        audio: function(n,v,i){ return "node_" + n.id + "_out = (" + i.in + " > " + i.thr + ") ? " + i.thr + " : ((" + i.in + " < -" + i.thr + ") ? -" + i.thr + " : " + i.in + ");"; }
    },
    help: {
        summary: "Hard saturation/clipping effect.",
        usage: "Connect a signal to 'in'. Adjust THR (Threshold) to set the clipping point. Useful for distortion or limiting.",
        inlets: { "in": "Audio signal.", "thr": "Clipping threshold (absolute value)." },
        outlets: { "out": "Clipped signal." }
    },
    rpdnode: { "title": "Hard Clipper", "inlets": { "in": { "type": "mozziflow/int16_t" }, "thr": { "type": "mozziflow/int16_t", "no_text": true } }, "outlets": { "out": { "type": "mozziflow/int16_t" } } }
});

NodeLibrary.push({
    nodetype: 'mozziflow/unit_delay',
    category: "signal",
    nodeclass: "UnitDelay",
    mozzi: {
        rate: "audio",
        global: function(n,v){ return "int32_t " + v + "_mem = 0;"; },
        audio: function(n,v,i){ return "node_" + n.id + "_out = " + v + "_mem;\n" + v + "_mem = " + i.in + ";"; }
    },
    help: {
        summary: "Delays the input by exactly one sample.",
        usage: "Fundamental for building custom filters, differentiators, or feedback loops.",
        inlets: { "in": "Any signal." },
        outlets: { "out": "Delayed signal." }
    },
    rpdnode: { "title": "Unit Delay", "inlets": { "in": { "type": "mozziflow/any" } }, "outlets": { "out": { "type": "mozziflow/int32_t" } } }
});

NodeLibrary.push({
    nodetype: 'mozziflow/sh',
    category: "signal",
    nodeclass: "MozziSH",
    mozzi: {
        rate: "audio", is_inline: false,
        global: function(n,v){ return "int32_t " + v + "_val = 0; bool " + v + "_l = 0;"; },
        audio: function(n,v,i){ return "if(" + i.trig + " && !" + v + "_l){ " + v + "_val = " + i.in + "; " + v + "_l=1; } else if(!" + i.trig + "){" + v + "_l=0; }\nnode_" + n.id + "_out = " + v + "_val;"; }
    },
    help: {
        summary: "Sample and Hold. Freezes the input value on a trigger.",
        usage: "Connect a signal to 'in' and a trigger to 'trig'. When 'trig' goes HIGH, the current 'in' is sampled and held.",
        inlets: { "in": "Signal to sample.", "trig": "Trigger pulse." },
        outlets: { "out": "Sampled value." }
    },
    rpdnode: { "title": "S&H", "inlets": { "in": { "type": "mozziflow/int32_t" }, "trig": { "type": "mozziflow/bool" } }, "outlets": { "out": { "type": "mozziflow/int32_t" } } }
});

NodeLibrary.push({
    nodetype: 'mozziflow/counter',
    category: "signal",
    nodeclass: "MozziCounter",
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px"; container.style.background = "rgba(0,255,153,0.05)";
            container.style.border = "1px solid #0f9"; container.style.marginBottom = "5px";
            var inp = document.createElement('input'); inp.type = "text"; inp.style.width = "40px";
            inp.className = 'mozzi-inlet-val-input'; inp.setAttribute('data-alias', 'max');
            inp.value = node.data.cfg_max || "9";
            inp.oninput = function() { node.data.cfg_max = this.value; };
            container.appendChild(inp);
            bodyElm.appendChild(container);
        }
    },
    mozzi: {
        rate: "control", defaults: { "up":"0", "down":"0", "max":"9" },
        global: function(n,v){ return "int32_t " + v + "_c = 0; bool " + v + "_ul = 0; bool " + v + "_dl = 0;"; },
        control: function(n,v,i){
            return "if(" + i.up + " && !" + v + "_ul){ " + v + "_c++; " + v + "_ul=1; } else if(!" + i.up + "){" + v + "_ul=0; }\n"
                   + "if(" + i.down + " && !" + v + "_dl){ " + v + "_c--; " + v + "_dl=1; } else if(!" + i.down + "){" + v + "_dl=0; }\n"
                   + "if(" + v + "_c > " + i.max + ") " + v + "_c = 0; if(" + v + "_c < 0) " + v + "_c = " + i.max + ";\nnode_" + n.id + "_out = " + v + "_c;"; 
        }
    },
    help: {
        summary: "Bi-directional pulse counter.",
        usage: "Triggers on 'up' increment, 'down' decrements. Resets at MAX value. Useful for sequencers.",
        inlets: { "up": "Increment pulse.", "down": "Decrement pulse.", "max": "Counter limit." },
        outlets: { "out": "Current count value." }
    },
    rpdnode: { "title": "Counter", "inlets": { "up": { "type": "mozziflow/bool" }, "down": { "type": "mozziflow/bool" }, "max": { "type": "mozziflow/int32_t", "no_text": true } }, "outlets": { "out": { "type": "mozziflow/int32_t" } } }
});

NodeLibrary.push({
    nodetype: 'mozziflow/metronome',
    category: "signal",
    nodeclass: "Metronome",
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var inp = document.createElement('input'); inp.type = "text"; inp.style.width = "40px";
            inp.className = 'mozzi-inlet-val-input'; inp.setAttribute('data-alias', 'bpm');
            inp.value = node.data.cfg_bpm || "120";
            inp.oninput = function() { node.data.cfg_bpm = this.value; };
            bodyElm.appendChild(inp);
        }
    },
    mozzi: {
        rate: "control", includes: ["#include <Metronome.h>"], defaults: { "bpm": "120" },
        global: function(n,v){ return "Metronome " + v + "; float " + v + "_lastbpm = 0;"; },
        setup: function(n,v,i){ return v + ".start();"; },
        control: function(n,v,i){ return "if(" + v + "_lastbpm != " + i.bpm + ") { " + v + ".setBPM(" + i.bpm + "); " + v + "_lastbpm = " + i.bpm + "; }\nnode_" + n.id + "_out = " + v + ".ready();"; }
    },
    help: {
        summary: "BPM-based pulse generator.",
        usage: "Outputs a True pulse at the specified Beats Per Minute. Primary clock for rhythmic patches.",
        inlets: { "bpm": "Beats Per Minute." },
        outlets: { "out": "Pulse signal (bool)." }
    },
    rpdnode: { "title": "Metronome", "inlets": { "bpm": { "type": "mozziflow/float", "no_text": true } }, "outlets": { "out": { "type": "mozziflow/bool" } } }
});