// Mozzi Node Definitions - CH32X035 ADVANCED MIDI & HARDWARE (v7.9 Documented)
// Pro-grade MIDI control for WCH CH32X035

var createCH32Input = function(label, node, key, defaultValue, container) {
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

var createCH32TypeSelector = function(node, container, label, key, options) {
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

// --- USB MIDI NOTE INPUT ---
var midiNoteOutlets = {};
for (var i=0; i<8; i++) {
    midiNoteOutlets["n"+i] = { "type": "mozziflow/uint8_t", "label": "note"+i };
    midiNoteOutlets["f"+i] = { "type": "mozziflow/any",     "label": "freq"+i };
    midiNoteOutlets["v"+i] = { "type": "mozziflow/uint8_t", "label": "vel"+i };
    midiNoteOutlets["r"+i] = { "type": "mozziflow/uint8_t", "label": "rel"+i };
    midiNoteOutlets["g"+i] = { "type": "mozziflow/bool",    "label": "gate"+i };
    midiNoteOutlets["t"+i] = { "type": "mozziflow/bool",    "label": "trig"+i };
}

NodeLibrary.push({
    nodetype: 'mozziflow/ch32_midi_note_in',
    category: "ch32x035",
    nodeclass: null,
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px"; container.style.background = "rgba(0,255,153,0.05)";
            container.style.border = "1px solid #0f9"; container.style.marginBottom = "5px";
            
            createCH32TypeSelector(node, container, "FREQ TYPE", "freq_type", [["float", "Float"], ["Q16n16", "FixMath (Fast)"]]);
            
            var syncVisibility = function() {
                var v = parseInt(node.data.cfg_num_v) || 1;
                var nElm = bodyElm;
                while (nElm && !nElm.classList.contains('rpd-node')) nElm = nElm.parentElement;
                if (!nElm) return;
                nElm.querySelectorAll('.rpd-outlet').forEach(function(row) {
                    var label = row.querySelector('.rpd-name');
                    if (label) {
                        var txt = label.innerText;
                        var prefixes = ['note', 'freq', 'vel', 'rel', 'gate', 'trig'];
                        prefixes.forEach(function(p) { if (txt.indexOf(p) === 0) { var idx = parseInt(txt.replace(p, '')); row.style.display = (idx < v) ? '' : 'none'; } });
                    }
                });
            };
            createCH32Input("CH (0=Omni)", node, "ch", "0", container);
            var iV = document.createElement('input'); iV.type = "number"; iV.min = 1; iV.max = 8;
            iV.className = 'mozzi-inlet-val-input'; iV.setAttribute('data-alias', 'num_v');
            iV.style.width = "100%"; iV.style.background = "#000"; iV.style.color = "#fff"; iV.style.fontSize = "10px";
            iV.value = node.data.cfg_num_v || 1;
            iV.onchange = function() { node.data.cfg_num_v = parseInt(this.value); syncVisibility(); };
            container.appendChild(iV);
            bodyElm.appendChild(container);
            node._syncHardwareUI = function() { syncVisibility(); };
            setTimeout(syncVisibility, 50);
        }
    },
    mozzi: {
        rate: "control",
        includes: ["#include <USBMIDI.h>", "#include <mozzi_midi.h>"],
        definitions: ["void handleNoteOn(uint8_t channel, uint8_t note, uint8_t velocity) {\n    /*HOOK:midi_on*/\n}", "void handleNoteOff(uint8_t channel, uint8_t note, uint8_t velocity) {\n    /*HOOK:midi_off*/\n}"],
        setup: function() { return "#ifndef MIDI_INIT_DONE\n#define MIDI_INIT_DONE\nUSBMIDI.begin();\n#endif\nUSBMIDI.setHandleNoteOn(handleNoteOn); USBMIDI.setHandleNoteOff(handleNoteOff);"; },
        global: function(n, v) {
            var voices = parseInt(n.data.cfg_num_v) || 1;
            return "uint8_t " + v + "_notes[" + voices + "] = {0};\nuint8_t " + v + "_vels[" + voices + "] = {0};\nuint8_t " + v + "_rels[" + voices + "] = {0};\nbool " + v + "_gates[" + voices + "] = {false};\nbool " + v + "_trigs[" + voices + "] = {false};\nuint32_t " + v + "_age[" + voices + "] = {0};\nuint32_t " + v + "_counter = 0;";
        },
        hooks: {
            "midi_on": function(n, v, i) {
                var voices = parseInt(n.data.cfg_num_v) || 1;
                return "{ if (!" + i.ch + " || channel == (uint8_t)(" + i.ch + " - 1)) {\n    int target = -1; uint32_t oldest = 0xFFFFFFFF;\n    for(int k=0; k<" + voices + "; k++) { if (target == -1 && " + v + "_notes[k] == note && " + v + "_gates[k]) { target = k; } }\n    for(int k=0; k<" + voices + "; k++) { if (target == -1 && !" + v + "_gates[k]) { target = k; } }\n    if (target == -1) { for(int k=0; k<" + voices + "; k++) { if (" + v + "_age[k] < oldest) { oldest = " + v + "_age[k]; target = k; } } }\n    if (target != -1) { " + v + "_notes[target] = note; " + v + "_vels[target] = velocity; " + v + "_gates[target] = true; " + v + "_trigs[target] = true; " + v + "_age[target] = ++" + v + "_counter; }\n} }";
            },
            "midi_off": function(n, v, i) {
                return "{ if (!" + i.ch + " || channel == (uint8_t)(" + i.ch + " - 1)) {\n    for(int k=0; k<" + (parseInt(n.data.cfg_num_v) || 1) + "; k++) { if (" + v + "_notes[k] == note && " + v + "_gates[k]) { " + v + "_gates[k] = false; " + v + "_rels[k] = velocity; } }\n} }";
            }
        },
        control: function(n, v, i) {
            var voices = parseInt(n.data.cfg_num_v) || 1;
            var ftype = n.data.cfg_freq_type || "float";
            var code = "";
            for(var k=0; k<voices; k++) {
                var base = "node_" + n.id;
                if (isWired(n.id, "n"+k)) code += "    " + base + "_n" + k + " = " + v + "_notes[" + k + "];\n";
                if (isWired(n.id, "f"+k)) {
                    if (ftype === "Q16n16") code += "    " + base + "_f" + k + " = Q16n16_mtof(Q8n0_to_Q16n16(" + v + "_notes[" + k + "]));\n";
                    else code += "    " + base + "_f" + k + " = mtof(" + v + "_notes[" + k + "]);\n";
                }
                if (isWired(n.id, "v"+k)) code += "    " + base + "_v" + k + " = " + v + "_vels[" + k + "];\n";
                if (isWired(n.id, "r"+k)) code += "    " + base + "_r" + k + " = " + v + "_rels[" + k + "];\n";
                if (isWired(n.id, "g"+k)) code += "    " + base + "_g" + k + " = " + v + "_gates[" + k + "];\n";
                if (isWired(n.id, "t"+k)) { code += "    " + base + "_t" + k + " = " + v + "_trigs[" + k + "]; " + v + "_trigs[" + k + "] = false;\n"; } 
            }
            return code.trim();
        }
    },
    help: {
        summary: "Universal USB MIDI Note Input.",
        usage: "Supports up to 8 voices. Select 'FixMath' freq for high performance with FixMath oscillators.",
        inlets: { "ch": "MIDI Channel (0=Omni)." },
        outlets: { "noteX": "MIDI note number.", "freqX": "Converted frequency.", "gateX": "On/Off status." }
    },
    rpdnode: { "title": "MIDI Note In", "inlets": { "ch": { "type": "mozziflow/uint8_t", "no_text": true } }, "outlets": midiNoteOutlets }
});

// --- PITCH BEND IN (14-bit) ---
NodeLibrary.push({
    nodetype: 'mozziflow/ch32_midi_pb_in',
    category: "ch32x035",
    nodeclass: null,
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px"; container.style.background = "rgba(0,255,153,0.05)";
            container.style.border = "1px solid #0f9"; container.style.marginBottom = "5px";
            createCH32Input("CH (0=Omni)", node, "ch", "0", container);
            bodyElm.appendChild(container);
        }
    },
    mozzi: {
        rate: "control",
        includes: ["#include <USBMIDI.h>"],
        definitions: ["void handlePitchBend(uint8_t channel, int value) {\n    /*HOOK:midi_pb*/\n}"],
        setup: function() { return "USBMIDI.setHandlePitchBend(handlePitchBend);"; },
        global: function(n, v) { return "int " + v + "_val = 0;"; },
        hooks: {
            "midi_pb": function(n, v, i) {
                return "if (!" + i.ch + " || channel == (uint8_t)(" + i.ch + " - 1)) { " + v + "_val = value; }";
            }
        },
        control: function(n, v, i) {
            var code = "node_" + n.id + "_raw = " + v + "_val;\n";
            code += "node_" + n.id + "_norm = (float)" + v + "_val / 8192.0f;";
            return code;
        }
    },
    help: {
        summary: "High-resolution (14-bit) MIDI Pitch Bend input.",
        usage: "Captures wheel data. Use 'norm' (-1.0 to 1.0) for easy frequency modulation.",
        inlets: { "ch": "MIDI Channel." },
        outlets: { "raw": "Raw value (-8192 to 8191).", "norm": "Normalized float." }
    },
    rpdnode: { "title": "MIDI Pitch Bend", "inlets": { "ch": { "type": "mozziflow/uint8_t", "no_text": true } }, "outlets": { "raw": { "type": "mozziflow/int16_t" }, "norm": { "type": "mozziflow/float" } } }
});

// --- MIDI CLOCK SYNC ---
NodeLibrary.push({
    nodetype: 'mozziflow/ch32_midi_clock_in',
    category: "ch32x035",
    nodeclass: null,
    mozzi: {
        rate: "control",
        includes: ["#include <USBMIDI.h>"],
        definitions: ["void handleRealTime(uint8_t rt) {\n    /*HOOK:midi_rt*/\n}"],
        setup: function() { return "USBMIDI.setHandleRealTime(handleRealTime);"; },
        global: function(n, v) { return "bool " + v + "_t = 0; uint32_t " + v + "_last = 0; float " + v + "_bpm = 120.0f;"; },
        hooks: {
            "midi_rt": function(n, v, i) {
                return "if (rt == 0xF8) { " + v + "_t = 1; uint32_t now = micros(); if (" + v + "_last > 0) { " + v + "_bpm = 60000000.0f / ((float)(now - " + v + "_last) * 24.0f); } " + v + "_last = now; }";
            }
        },
        control: function(n, v, i) {
            var code = "node_" + n.id + "_tick = " + v + "_t; " + v + "_t = 0;\n";
            code += "node_" + n.id + "_bpm = " + v + "_bpm;";
            return code;
        }
    },
    help: {
        summary: "Synchronizes patches with external MIDI Clock (DAW).",
        usage: "Outputs a boolean pulse 24 times per beat. Provides real-time BPM calculation.",
        outlets: { "tick": "24PPQN sync pulse.", "bpm": "Calculated tempo (float)." }
    },
    rpdnode: { "title": "MIDI Clock In", "inlets": {}, "outlets": { "tick": { "type": "mozziflow/bool" }, "bpm": { "type": "mozziflow/float" } } }
});

// --- MIDI TRANSPORT ---
NodeLibrary.push({
    nodetype: 'mozziflow/ch32_midi_transport',
    category: "ch32x035",
    nodeclass: null,
    mozzi: {
        rate: "control",
        includes: ["#include <USBMIDI.h>"],
        definitions: ["void handleRealTime(uint8_t rt) {\n    /*HOOK:midi_rt*/\n}"],
        setup: function() { return "USBMIDI.setHandleRealTime(handleRealTime);"; },
        global: function(n, v) { return "bool " + v + "_play = 0; bool " + v + "_trig = 0;"; },
        hooks: {
            "midi_rt": function(n, v, i) {
                return "if (rt == 0xFA || rt == 0xFB) { " + v + "_play = 1; " + v + "_trig = 1; } else if (rt == 0xFC) { " + v + "_play = 0; }";
            }
        },
        control: function(n, v, i) {
            var code = "node_" + n.id + "_play = " + v + "_play;\n";
            code += "node_" + n.id + "_trig = " + v + "_trig; " + v + "_trig = 0;";
            return code;
        }
    },
    help: {
        summary: "Detects Start/Stop/Continue commands from USB MIDI.",
        usage: "Start your DAW to activate 'play'. 'trig' fires on the exact moment Play is pressed.",
        outlets: { "play": "DAW status (bool).", "trig": "Reset/Start pulse." }
    },
    rpdnode: { "title": "MIDI Transport", "inlets": {}, "outlets": { "play": { "type": "mozziflow/bool" }, "trig": { "type": "mozziflow/bool" } } }
});

// --- USB MIDI CC INPUT ---
var midiCCOutlets = {};
for (var i=0; i<8; i++) midiCCOutlets["v"+i] = { "type": "mozziflow/any", "label": "cc"+i };

NodeLibrary.push({
    nodetype: 'mozziflow/ch32_midi_cc_in',
    category: "ch32x035",
    nodeclass: null,
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px"; container.style.background = "rgba(0,255,153,0.05)";
            container.style.border = "1px solid #0f9"; container.style.marginBottom = "5px";
            
            createCH32TypeSelector(node, container, "VALUE TYPE", "val_type", [["int", "Int (0-127)"], ["float", "Float (0.0-1.0)"], ["sfix", "FixMath (0.0-1.0)"]]);

            var syncVisibility = function() {
                var count = parseInt(node.data.cfg_num_cc) || 1;
                var nElm = bodyElm;
                while (nElm && !nElm.classList.contains('rpd-node')) nElm = nElm.parentElement;
                if (!nElm) return;
                nElm.querySelectorAll('.rpd-outlet').forEach(function(row) {
                    var label = row.querySelector('.rpd-name');
                    if (label && label.innerText.indexOf('cc') === 0) { var idx = parseInt(label.innerText.replace('cc', '')); row.style.display = (idx < count) ? '' : 'none'; }
                });
                configBox.innerHTML = '';
                for(var k=0; k<count; k++) { createCH32Input("CC# " + k, node, "cc"+k, "74", configBox); }
            };
            createCH32Input("CH (0=Omni)", node, "ch", "0", container);
            var iN = document.createElement('input'); iN.type = "number"; iN.min = 1; iN.max = 8;
            iN.className = 'mozzi-inlet-val-input'; iN.setAttribute('data-alias', 'num_cc');
            iN.style.width = "100%"; iN.style.background = "#000"; iN.style.color = "#fff"; iN.style.fontSize = "10px";
            iN.value = node.data.cfg_num_cc || 1;
            iN.onchange = function() { node.data.cfg_num_cc = parseInt(this.value); syncVisibility(); };
            container.appendChild(iN);
            var configBox = document.createElement('div');
            configBox.style.marginTop = "5px"; configBox.style.borderTop = "1px solid #333"; configBox.style.paddingTop = "5px";
            container.appendChild(configBox);
            bodyElm.appendChild(container);
            node._syncHardwareUI = function() { syncVisibility(); };
            setTimeout(syncVisibility, 50);
        }
    },
    mozzi: {
        rate: "control",
        includes: ["#include <USBMIDI.h>"],
        definitions: ["void handleControlChange(uint8_t channel, uint8_t control, uint8_t value) {\n    /*HOOK:midi_cc*/\n}"],
        setup: function() { return "#ifndef MIDI_INIT_DONE\n#define MIDI_INIT_DONE\nUSBMIDI.begin();\n#endif\nUSBMIDI.setHandleControlChange(handleControlChange);"; },
        hooks: {
            "midi_cc": function(n, v, i) {
                var count = parseInt(n.data.cfg_num_cc) || 1;
                var code = "{ if (!" + i.ch + " || channel == (uint8_t)(" + i.ch + " - 1)) {";
                for(var k=0; k<count; k++) {
                    var ccNum = i["cc"+k] || "0";
                    if (isWired(n.id, "v"+k)) code += "\n    if (control == (uint8_t)" + ccNum + ") node_" + n.id + "_v" + k + " = value;";
                }
                code += "\n} }";
                return code;
            }
        },
        global: function(n, v) {
            // Need globals to hold the CC values because hook runs in interrupt/callback
            var count = parseInt(n.data.cfg_num_cc) || 1;
            var g = "";
            for(var k=0; k<count; k++) { g += "uint8_t node_" + n.id + "_v" + k + " = 0; "; }
            return g;
        },
        control: function(n, v, i) { 
            // If normalisation is required, do it here in the control loop
            var type = n.data.cfg_val_type || "int";
            var count = parseInt(n.data.cfg_num_cc) || 1;
            if (type === "int") return ""; // Direct use of global vars
            
            var code = "";
            for(var k=0; k<count; k++) {
                if(type === "float") code += "node_" + n.id + "_v" + k + "_out = (float)node_" + n.id + "_v" + k + " / 127.0f;\n";
                if(type === "sfix") code += "node_" + n.id + "_v" + k + "_out = SFix<0,8>::fromRaw(node_" + n.id + "_v" + k + " << 1);\n"; // Approx 0..1
            }
            return code;
        }
    },
    help: {
        summary: "Multi-channel MIDI Control Change (CC) input.",
        usage: "Map virtual knobs to CC numbers. Supports int (0-127), or normalized Float/FixMath (0.0-1.0).",
        inlets: { "ch": "MIDI Channel." },
        outlets: { "ccX": "Value." }
    },
    rpdnode: { "title": "MIDI CC In", "inlets": { "ch": { "type": "mozziflow/uint8_t", "no_text": true } }, "outlets": midiCCOutlets }
});

// --- MIDI PROGRAM CHANGE ---
NodeLibrary.push({
    nodetype: 'mozziflow/ch32_midi_pc_in',
    category: "ch32x035",
    nodeclass: null,
    mozzi: {
        rate: "control",
        includes: ["#include <USBMIDI.h>"],
        definitions: ["void handleProgramChange(uint8_t channel, uint8_t program) {\n    /*HOOK:midi_pc*/\n}"],
        setup: function() { return "USBMIDI.setHandleProgramChange(handleProgramChange);"; },
        global: function(n, v) { return "uint8_t " + v + "_prog = 0;"; },
        hooks: { "midi_pc": function(n, v, i) { return "if (!" + i.ch + " || channel == (uint8_t)(" + i.ch + " - 1)) { " + v + "_prog = program; }"; } },
        control: function(n, v, i) { return "node_" + n.id + "_prog = " + v + "_prog;"; }
    },
    help: {
        summary: "Receives MIDI Program Change messages.",
        usage: "Use this to switch presets or instrument states remotely (0-127).",
        outlets: { "prog": "Program number." }
    },
    rpdnode: { "title": "MIDI Prog Chg", "inlets": { "ch": { "type": "mozziflow/uint8_t", "no_text": true } }, "outlets": { "prog": { "type": "mozziflow/uint8_t" } } }
});

// --- MIDI PRESSURE (AFTERTOUCH) ---
NodeLibrary.push({
    nodetype: 'mozziflow/ch32_midi_pressure',
    category: "ch32x035",
    nodeclass: null,
    mozzi: {
        rate: "control",
        includes: ["#include <USBMIDI.h>"],
        definitions: ["void handleAfterTouch(uint8_t channel, uint8_t pressure) {\n    /*HOOK:midi_at*/\n}", "void handlePolyPressure(uint8_t channel, uint8_t note, uint8_t pressure) {\n    /*HOOK:midi_pp*/\n}"],
        setup: function() { return "USBMIDI.setHandleAfterTouch(handleAfterTouch); USBMIDI.setHandlePolyPressure(handlePolyPressure);"; },
        global: function(n, v) { return "uint8_t " + v + "_chan = 0; uint8_t " + v + "_poly = 0; uint8_t " + v + "_p_note = 0;"; },
        hooks: {
            "midi_at": function(n, v, i) { return "if (!" + i.ch + " || channel == (uint8_t)(" + i.ch + " - 1)) { " + v + "_chan = pressure; }"; },
            "midi_pp": function(n, v, i) { return "if (!" + i.ch + " || channel == (uint8_t)(" + i.ch + " - 1)) { " + v + "_poly = pressure; " + v + "_p_note = note; }"; }
        },
        control: function(n, v, i) {
            return "node_" + n.id + "_chan = " + v + "_chan;\nnode_" + n.id + "_poly = " + v + "_poly;\nnode_" + n.id + "_p_note = " + v + "_p_note;";
        }
    },
    help: {
        summary: "Captures MIDI Pressure (Aftertouch) data.",
        usage: "Supports global Channel Pressure and independent Polyphonic Key Pressure.",
        outlets: { "chan": "Global pressure.", "poly": "Per-key pressure.", "p_note": "Target note for Poly-Pressure." }
    },
    rpdnode: { "title": "MIDI Pressure", "inlets": { "ch": { "type": "mozziflow/uint8_t", "no_text": true } }, "outlets": { "chan": { "type": "mozziflow/uint8_t" }, "poly": { "type": "mozziflow/uint8_t" }, "p_note": { "type": "mozziflow/uint8_t" } } }
});

// --- USB MIDI OUTPUTS (CONTROLLER MODE) ---

NodeLibrary.push({
    nodetype: 'mozziflow/ch32_midi_note_out',
    category: "ch32x035",
    nodeclass: null,
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px"; container.style.background = "rgba(0,255,153,0.05)";
            container.style.border = "1px solid #0f9"; container.style.marginBottom = "5px";
            createCH32Input("CH", node, "ch", "1", container);
            bodyElm.appendChild(container);
        }
    },
    mozzi: {
        rate: "control", is_sink: true,
        includes: ["#include <USBMIDI.h>"],
        setup: function() { return "#ifndef MIDI_INIT_DONE\n#define MIDI_INIT_DONE\nUSBMIDI.begin();\n#endif"; },
        global: function(n, v) { return "bool " + v + "_l = 0; uint8_t " + v + "_n = 0;"; },
        control: function(n, v, i) {
            var c = "if(" + i.trig + " && !" + v + "_l) { " + v + "_n = (uint8_t)" + i.note + "; USBMIDI.sendNoteOn((uint8_t)(" + i.ch + " - 1), " + v + "_n, (uint8_t)" + i.vel + "); }\n";
            c += "else if(!" + i.trig + " && " + v + "_l) { USBMIDI.sendNoteOff((uint8_t)(" + i.ch + " - 1), " + v + "_n, 0); }\n" + v + "_l = " + i.trig + ";";
            return c;
        }
    },
    help: {
        summary: "Sends USB MIDI Note On/Off messages.",
        usage: "Connect a trigger to 'trig', a note number to 'note', and velocity to 'vel'. Turns the CH32 into a MIDI keyboard.",
        inlets: { "trig": "Gate pulse.", "note": "Note (0-127).", "vel": "Velocity (0-127)." }
    },
    rpdnode: { "title": "MIDI Note Out", "inlets": { "trig": { "type": "mozziflow/bool" }, "note": { "type": "mozziflow/uint8_t" }, "vel": { "type": "mozziflow/uint8_t" }, "ch": { "type": "mozziflow/uint8_t", "no_text": true } } }
});

NodeLibrary.push({
    nodetype: 'mozziflow/ch32_midi_cc_out',
    category: "ch32x035",
    nodeclass: null,
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px"; container.style.background = "rgba(0,255,153,0.05)";
            container.style.border = "1px solid #0f9"; container.style.marginBottom = "5px";
            createCH32Input("CH", node, "ch", "1", container);
            createCH32Input("CC#", node, "cc", "1", container);
            bodyElm.appendChild(container);
        }
    },
    mozzi: {
        rate: "control", is_sink: true,
        includes: ["#include <USBMIDI.h>"],
        setup: function() { return "#ifndef MIDI_INIT_DONE\n#define MIDI_INIT_DONE\nUSBMIDI.begin();\n#endif"; },
        global: function(n, v) { return "uint8_t " + v + "_l = 255;"; },
        control: function(n, v, i) {
            var c = "if((uint8_t)" + i.val + " != " + v + "_l) {\nUSBMIDI.sendControlChange((uint8_t)(" + i.ch + " - 1), (uint8_t)" + i.cc + ", (uint8_t)" + i.val + ");\n" + v + "_l = (uint8_t)" + i.val + ";\n}";
            return c;
        }
    },
    help: {
        summary: "Sends USB MIDI Control Change messages.",
        usage: "Ideal for mapping pots to software knobs. Sets CH and CC# in the node, and send value (0-127) to 'val'.",
        inlets: { "val": "Value to send." }
    },
    rpdnode: { "title": "MIDI CC Out", "inlets": { "cc": { "type": "mozziflow/uint8_t", "no_text": true }, "val": { "type": "mozziflow/uint8_t" }, "ch": { "type": "mozziflow/uint8_t", "no_text": true } } }
});

NodeLibrary.push({
    nodetype: 'mozziflow/ch32_midi_pb_out',
    category: "ch32x035",
    nodeclass: null,
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px"; container.style.background = "rgba(0,255,153,0.05)";
            container.style.border = "1px solid #0f9"; container.style.marginBottom = "5px";
            createCH32Input("CH", node, "ch", "1", container);
            bodyElm.appendChild(container);
        }
    },
    mozzi: {
        rate: "control", is_sink: true,
        includes: ["#include <USBMIDI.h>"],
        setup: function() { return "#ifndef MIDI_INIT_DONE\n#define MIDI_INIT_DONE\nUSBMIDI.begin();\n#endif"; },
        global: function(n, v) { return "int " + v + "_l = 9999;"; },
        control: function(n, v, i) {
            return "if(" + i.val + " != " + v + "_l) { USBMIDI.sendPitchBend((uint8_t)(" + i.ch + " - 1), " + i.val + "); " + v + "_l = " + i.val + "; }";
        }
    },
    help: {
        summary: "Sends high-resolution (14-bit) Pitch Bend messages.",
        usage: "Send a signal from -8192 to 8191 to 'val' to modulate pitch on a remote device.",
        inlets: { "val": "Pitch value." }
    },
    rpdnode: { "title": "MIDI PB Out", "inlets": { "val": { "type": "mozziflow/int16_t" }, "ch": { "type": "mozziflow/uint8_t", "no_text": true } } }
});

NodeLibrary.push({
    nodetype: 'mozziflow/ch32_usb_plotter',
    category: "ch32x035",
    nodeclass: "USBPlotter",
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px"; container.style.background = "rgba(0,255,153,0.05)";
            container.style.border = "1px solid #0f9"; container.style.marginBottom = "5px";
            var label = document.createElement('div');
            label.innerText = "CHANNELS:"; label.style.fontSize = "8px"; label.style.color = "#0f9";
            container.appendChild(label);
            var inp = document.createElement('input');
            inp.type = "number"; inp.min = 1; inp.max = 32; inp.style.width = "100%";
            inp.className = 'mozzi-inlet-val-input'; inp.setAttribute('data-alias', 'num_ch');
            inp.style.background = "#000"; inp.style.color = "#fff"; inp.style.fontSize = "10px";
            inp.value = node.data.cfg_num_ch || 1;
            inp.onchange = function() { node.data.cfg_num_ch = parseInt(this.value); syncVisibility(); };
            container.appendChild(inp);
            bodyElm.appendChild(container);
            var syncVisibility = function() {
                var channels = parseInt(node.data.cfg_num_ch) || 1;
                var nElm = bodyElm;
                while (nElm && !nElm.classList.contains('rpd-node')) nElm = nElm.parentElement;
                if (!nElm) return;
                nElm.querySelectorAll('.rpd-inlet').forEach(function(row) {
                    var label = row.querySelector('.rpd-name');
                    if (label && label.innerText.indexOf('v') === 0) {
                        var idx = parseInt(label.innerText.replace('v', ''));
                        row.style.display = (idx < channels) ? '' : 'none';
                    }
                });
            };
            node._syncHardwareUI = function() { syncVisibility(); };
            setTimeout(syncVisibility, 50);
        }
    },
    mozzi: {
        rate: "control", is_inline: true, is_sink: true,
        includes: ["#include <CH32X035_USBSerial.h>"],
        definitions: ["extern \"C\" uint8_t CDC_ready(void);"],
        setup: function(){ return "USBSerial.begin();"; },
        control: function(n,v,i){
            var num = parseInt(n.data.cfg_num_ch) || 1;
            var code = "if (CDC_ready()) {\n";
            for(var k=0; k<num; k++) {
                var val = i["val"+k] || "0";
                code += "    USBSerial.print(" + val + ");";
                if (k < num - 1) code += " USBSerial.print(\",\"); ";
            }
            code += "\n    USBSerial.println();\n}";
            return code;
        }
    },
    help: {
        summary: "Serial Plotter over USB. Visualizes up to 32 channels.",
        usage: "Ideal for debugging envelopes or LFOs. Connect any signal to 'vX' and use the Arduino Serial Plotter to see it.",
        inlets: { "vX": "Signal channel X." }
    },
    rpdnode: { "title": "USB Plotter", "inlets": (function(){ var p={}; for(var i=0; i<32; i++) p["val"+i] = { "type": "mozziflow/any", "label": "v"+i }; return p; })() }
});