// Mozzi Node Definitions - MATH (Iron Integrity v111.16)
// MATH + LOGIC + MAPPING (Comprehensive Restoration + Visual ID)

NodeLibrary.push({
    nodetype: 'math/add',
    nodeclass: "MathAdd",
    mozzi: { is_inline: true, audio: function(n,v,i) { return "(int)"+i.a + " + (int)" + i.b; } },
    rpdnode: { "title": "Add", "inlets": { "a": { "type": "mozziflow/any", "color": "audio" }, "b": { "type": "mozziflow/any", "color": "audio" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "audio" } } }
});

NodeLibrary.push({
    nodetype: 'math/sub',
    nodeclass: "MathSub",
    mozzi: { is_inline: true, audio: function(n,v,i) { return "(int)"+i.a + " - (int)" + i.b; } },
    rpdnode: { "title": "Subtract", "inlets": { "a": { "type": "mozziflow/any", "color": "audio" }, "b": { "type": "mozziflow/any", "color": "audio" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "audio" } } }
});

NodeLibrary.push({
    nodetype: 'math/mul',
    nodeclass: "MathMul",
    mozzi: { 
        is_inline: true, 
        defaults: { "b": "255" },
        audio: function(n,v,i) { return "(int)((long)" + i.a + " * " + i.b + " >> 8)"; } 
    },
    rpdnode: { "title": "Multiply", "inlets": { "a": { "type": "mozziflow/any", "color": "audio" }, "b": { "type": "mozziflow/any", "color": "control" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "audio" } } }
});

NodeLibrary.push({
    nodetype: 'math/div',
    nodeclass: "MathDiv",
    mozzi: { is_inline: true, audio: function(n,v,i) { return i.b + " != 0 ? (int)" + i.a + " / (int)" + i.b + " : 0"; } },
    rpdnode: { "title": "Divide", "inlets": { "a": { "type": "mozziflow/any", "color": "audio" }, "b": { "type": "mozziflow/any", "color": "control" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "audio" } } }
});

NodeLibrary.push({
    nodetype: 'math/mtof',
    nodeclass: "MathMTOF",
    mozzi: { 
        rate: "control",
        is_inline: true, 
        includes: ["#include <mozzi_midi.h>"], 
        control: function(n,v,i) { return "mtof((float)"+i.note+")"; } 
    },
    rpdnode: { "title": "Midi->Freq", "inlets": { "note": { "type": "mozziflow/any", "color": "control" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "float" } } }
});


NodeLibrary.push({
    nodetype: 'math/shl',
    nodeclass: "MathSHL",
    mozzi: { is_inline: true, audio: function(n,v,i) { return "((int)"+i.a + " << (int)" + i.b + ")"; } },
    rpdnode: { "title": "Shift Left", "inlets": { "a": { "type": "mozziflow/any", "color": "audio" }, "b": { "type": "mozziflow/any", "color": "control" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "audio" } } }
});

NodeLibrary.push({
    nodetype: 'math/shr',
    nodeclass: "MathSHR",
    mozzi: { is_inline: true, audio: function(n,v,i) { return "((int)"+i.a + " >> (int)" + i.b + ")"; } },
    rpdnode: { "title": "Shift Right", "inlets": { "a": { "type": "mozziflow/any", "color": "audio" }, "b": { "type": "mozziflow/any", "color": "control" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "audio" } } }
});

NodeLibrary.push({
    nodetype: 'math/min',
    nodeclass: "MathMin",
    mozzi: { is_inline: true, audio: function(n,v,i) { return "((int)"+i.a + " < (int)" + i.b + " ? (int)" + i.a + " : (int)" + i.b + ")"; } },
    rpdnode: { "title": "Minimum", "inlets": { "a": { "type": "mozziflow/any", "color": "audio" }, "b": { "type": "mozziflow/any", "color": "audio" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "audio" } } }
});

NodeLibrary.push({
    nodetype: 'math/mozzi_map',
    nodeclass: "MozziMap",
    mozzi: { 
        is_inline: true, 
        defaults: { "in_min": "0", "in_max": "255", "out_min": "0", "out_max": "255" },
        audio: function(n,v,i) { return "map((int)"+i.in+", (int)"+i.in_min+", (int)"+i.in_max+", (int)"+i.out_min+", (int)"+i.out_max+")"; } 
    },
    rpdnode: { 
        "title": "Map Range", 
        "inlets": { 
            "in": { "type": "mozziflow/any", "color": "control" }, 
            "in_min": { "type": "mozziflow/any", "color": "control", "label": "In Min" }, 
            "in_max": { "type": "mozziflow/any", "color": "control", "label": "In Max" },
            "out_min": { "type": "mozziflow/any", "color": "control", "label": "Out Min" },
            "out_max": { "type": "mozziflow/any", "color": "control", "label": "Out Max" }
        }, 
        "outlets": { "out": { "type": "mozziflow/any", "color": "control" } } 
    }
});

NodeLibrary.push({
    nodetype: 'math/mozzi_intmap',
    nodeclass: "IntMap",
    mozzi: {
        rate: "control",
        includes: ["#include <IntMap.h>"],
        global: function(n,v){ return "IntMap "+v+"(0, 255, 0, 255);"; },
        control: function(n,v,i){ return v+"((int)"+i.in+")"; }
    },
    rpdnode: { "title": "IntMap", "inlets": { "in": { "type": "mozziflow/any", "color": "control" }, "min": { "type": "mozziflow/any", "color": "control" }, "max": { "type": "mozziflow/any", "color": "control" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "control" } } }
});

NodeLibrary.push({
    nodetype: 'math/mozzi_automap',
    nodeclass: "AutoMap",
    mozzi: {
        rate: "control",
        includes: ["#include <AutoMap.h>"],
        global: function(n,v){ return "AutoMap "+v+"(0, 1023, 0, 255);"; },
        control: function(n,v,i){ return v+".next((int)"+i.in+")"; }
    },
    rpdnode: { "title": "AutoMap", "inlets": { "in": { "type": "mozziflow/any", "color": "freq" }, "min": { "type": "mozziflow/any", "color": "control" }, "max": { "type": "mozziflow/any", "color": "control" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "control" } } }
});

// LEGACY ALIASES
NodeLibrary.push({
    nodetype: 'math_audio/mul',
    nodeclass: "MathAudioMul",
    mozzi: { 
        is_inline: true, 
        defaults: { "b": "255" },
        audio: function(n,v,i) { return "((int)(((long)" + i.a + " * " + i.b + ") >> 8))"; } 
    },
    rpdnode: { "title": "Mul (Audio)", "inlets": { "a": { "type": "mozziflow/any", "color": "audio" }, "b": { "type": "mozziflow/any", "color": "audio" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "audio" } } }
});

NodeLibrary.push({
    nodetype: 'math_audio/add',
    nodeclass: "MathAudioAdd",
    mozzi: { is_inline: true, audio: function(n,v,i) { return "((" + i.a + " + " + i.b + ") >> 1)"; } },
    rpdnode: { "title": "Add (Audio)", "inlets": { "a": { "type": "mozziflow/any", "color": "audio" }, "b": { "type": "mozziflow/any", "color": "audio" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "audio" } } }
});

NodeLibrary.push({
    nodetype: 'math_audio/clipper',
    nodeclass: "MathAudioClipper",
    mozzi: { is_inline: true, audio: function(n,v,i) { return "((int)" + i.in + " > 127 ? 127 : ((int)" + i.in + " < -128 ? -128 : (int)" + i.in + "))"; } },
    rpdnode: { "title": "Clipper", "inlets": { "in": { "type": "mozziflow/any", "color": "audio" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "audio" } } }
});

// LOGIC SECTION
NodeLibrary.push({
    nodetype: 'logic/and',
    nodeclass: "LogicAND",
    mozzi: { is_inline: true, audio: function(n,v,i) { return "((int)"+i.a+" > 0 && (int)"+i.b+" > 0) ? 255 : 0"; } },
    rpdnode: { "title": "AND", inlets: { "a": { "type": "mozziflow/any", "color": "logic" }, "b": { "type": "mozziflow/any", "color": "logic" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "logic" } } }
});

NodeLibrary.push({
    nodetype: 'logic/or',
    nodeclass: "LogicOR",
    mozzi: { is_inline: true, audio: function(n,v,i) { return "((int)"+i.a+" > 0 || (int)"+i.b+" > 0) ? 255 : 0"; } },
    rpdnode: { "title": "OR", inlets: { "a": { "type": "mozziflow/any", "color": "logic" }, "b": { "type": "mozziflow/any", "color": "logic" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "logic" } } }
});

NodeLibrary.push({
    nodetype: 'logic/xor',
    nodeclass: "LogicXOR",
    mozzi: { is_inline: true, audio: function(n,v,i) { return "(((int)"+i.a+" > 0) != ((int)"+i.b+" > 0)) ? 255 : 0"; } },
    rpdnode: { "title": "XOR", inlets: { "a": { "type": "mozziflow/any", "color": "logic" }, "b": { "type": "mozziflow/any", "color": "logic" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "logic" } } }
});

NodeLibrary.push({
    nodetype: 'logic/not',
    nodeclass: "LogicNOT",
    mozzi: { is_inline: true, audio: function(n,v,i) { return "(int)"+i.in+" == 0 ? 255 : 0"; } },
    rpdnode: { "title": "NOT", inlets: { "in": { "type": "mozziflow/any", "color": "logic" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "logic" } } }
});
