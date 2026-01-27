// Mozzi Node Definitions - MATH (Iron Integrity v111.16)
// MATH + LOGIC + MAPPING (Comprehensive Restoration + Visual ID)

NodeLibrary.push({
    nodetype: 'math/add',
    nodeclass: "MathAdd",
    mozzi: { is_inline: true, audio: function(n,v,i) { return "((long)"+i.a + " + (long)" + i.b + ")"; } },
    rpdnode: { "title": "Add", "inlets": { "a": { "type": "mozziflow/any", "color": "audio" }, "b": { "type": "mozziflow/any", "color": "audio" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "audio" } } }
});

NodeLibrary.push({
    nodetype: 'math/sub',
    nodeclass: "MathSub",
    mozzi: { is_inline: true, audio: function(n,v,i) { return "((long)"+i.a + " - (long)" + i.b + ")"; } },
    rpdnode: { "title": "Subtract", "inlets": { "a": { "type": "mozziflow/any", "color": "audio" }, "b": { "type": "mozziflow/any", "color": "audio" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "audio" } } }
});

NodeLibrary.push({
    nodetype: 'math/mul',
    nodeclass: "MathMul",
    mozzi: { 
        is_inline: true, 
        defaults: { "b": "255" },
        audio: function(n,v,i) { return "(int)((long)" + i.a + " * (long)" + i.b + " >> 8)"; } 
    },
    rpdnode: { "title": "Multiply", "inlets": { "a": { "type": "mozziflow/any", "color": "audio" }, "b": { "type": "mozziflow/any", "color": "control" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "audio" } } }
});

NodeLibrary.push({
    nodetype: 'math/div',
    nodeclass: "MathDiv",
    mozzi: { is_inline: true, audio: function(n,v,i) { return "(long)"+i.b + " != 0 ? (long)" + i.a + " / (long)" + i.b + " : 0"; } },
    rpdnode: { "title": "Divide", "inlets": { "a": { "type": "mozziflow/any", "color": "audio" }, "b": { "type": "mozziflow/any", "color": "control" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "audio" } } }
});

// MATH AUDIO SECTION
NodeLibrary.push({
    nodetype: 'math_audio/inv',
    nodeclass: "MathAudioInv",
    mozzi: { is_inline: true, audio: function(n,v,i) { return "(-(long)"+i.in+")"; } },
    rpdnode: { "title": "Invert Phase", "inlets": { "in": { "type": "mozziflow/any", "color": "audio" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "audio" } } }
});

NodeLibrary.push({
    nodetype: 'math_audio/hwr',
    nodeclass: "MathAudioHWR",
    mozzi: { is_inline: true, audio: function(n,v,i) { return "((long)"+i.in+" > 0 ? (long)"+i.in+" : 0)"; } },
    rpdnode: { "title": "Half-Wave Rect", "inlets": { "in": { "type": "mozziflow/any", "color": "audio" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "audio" } } }
});

NodeLibrary.push({
    nodetype: 'math_audio/xor',
    nodeclass: "MathAudioXOR",
    mozzi: { is_inline: true, audio: function(n,v,i) { return "((long)"+i.a+" ^ (long)"+i.b+")"; } },
    rpdnode: { "title": "XOR RingMod", "inlets": { "a": { "type": "mozziflow/any", "color": "audio" }, "b": { "type": "mozziflow/any", "color": "audio" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "audio" } } }
});

NodeLibrary.push({
    nodetype: 'math_audio/bitcrush',
    nodeclass: "MathAudioBitcrush",
    mozzi: { 
        is_inline: true, 
        defaults: { "bits": "2" },
        audio: function(n,v,i) { return "((long)"+i.in+" & (0xFF << (int)"+i.bits+"))"; } 
    },
    rpdnode: { "title": "Bit-Crusher", "inlets": { "in": { "type": "mozziflow/any", "color": "audio" }, "bits": { "type": "mozziflow/any", "color": "control" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "audio" } } }
});

NodeLibrary.push({
    nodetype: 'math_audio/xfade',
    nodeclass: "MathAudioXFade",
    mozzi: { 
        is_inline: true, 
        defaults: { "mix": "128" },
        audio: function(n,v,i) { return "((int)(((long)"+i.a+" * (255 - (long)"+i.mix+") + (long)"+i.b+" * (long)"+i.mix+") >> 8))"; } 
    },
    rpdnode: { "title": "Crossfader", "inlets": { "a": { "type": "mozziflow/any", "color": "audio" }, "b": { "type": "mozziflow/any", "color": "audio" }, "mix": { "type": "mozziflow/any", "color": "control" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "audio" } } }
});

NodeLibrary.push({
    nodetype: 'math_audio/sum3',
    nodeclass: "MathAudioSum3",
    mozzi: { is_inline: true, audio: function(n,v,i) { return "(((long)"+i.a+" + (long)"+i.b+" + (long)"+i.c+") / 3)"; } },
    rpdnode: { "title": "Mixer 3", "inlets": { "a": { "type": "mozziflow/any", "color": "audio" }, "b": { "type": "mozziflow/any", "color": "audio" }, "c": { "type": "mozziflow/any", "color": "audio" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "audio" } } }
});

NodeLibrary.push({
    nodetype: 'math/mtof',
    nodeclass: "MathMTOF",
    mozzi: { 
        rate: "control",
        is_inline: true, 
        includes: ["#include <mozzi_midi.h>"], 
        control: function(n,v,i) { return "mtof((float)(long)"+i.note+")"; } 
    },
    rpdnode: { "title": "Midi->Freq", "inlets": { "note": { "type": "mozziflow/any", "color": "control" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "float" } } }
});


NodeLibrary.push({
    nodetype: 'math/shl',
    nodeclass: "MathSHL",
    mozzi: { is_inline: true, audio: function(n,v,i) { return "((long)"+i.a + " << (int)" + i.b + ")"; } },
    rpdnode: { "title": "Shift Left", "inlets": { "a": { "type": "mozziflow/any", "color": "audio" }, "b": { "type": "mozziflow/any", "color": "control" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "audio" } } }
});

NodeLibrary.push({
    nodetype: 'math/shr',
    nodeclass: "MathSHR",
    mozzi: { is_inline: true, audio: function(n,v,i) { return "((long)"+i.a + " >> (int)" + i.b + ")"; } },
    rpdnode: { "title": "Shift Right", "inlets": { "a": { "type": "mozziflow/any", "color": "audio" }, "b": { "type": "mozziflow/any", "color": "control" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "audio" } } }
});

NodeLibrary.push({
    nodetype: 'math/min',
    nodeclass: "MathMin",
    mozzi: { is_inline: true, audio: function(n,v,i) { return "((long)"+i.a + " < (long)" + i.b + " ? (long)" + i.a + " : (long)" + i.b + ")"; } },
    rpdnode: { "title": "Minimum", "inlets": { "a": { "type": "mozziflow/any", "color": "audio" }, "b": { "type": "mozziflow/any", "color": "audio" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "audio" } } }
});

NodeLibrary.push({
    nodetype: 'math/max',
    nodeclass: "MathMax",
    mozzi: { is_inline: true, audio: function(n,v,i) { return "((long)"+i.a + " > (long)" + i.b + " ? (long)" + i.a + " : (long)" + i.b + ")"; } },
    rpdnode: { "title": "Maximum", "inlets": { "a": { "type": "mozziflow/any", "color": "audio" }, "b": { "type": "mozziflow/any", "color": "audio" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "audio" } } }
});

NodeLibrary.push({
    nodetype: 'math/abs',
    nodeclass: "MathAbs",
    mozzi: { is_inline: true, audio: function(n,v,i) { return "abs((long)"+i.in+")"; } },
    rpdnode: { "title": "Absolute", "inlets": { "in": { "type": "mozziflow/any", "color": "audio" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "audio" } } }
});

NodeLibrary.push({
    nodetype: 'math/gt',
    nodeclass: "MathGT",
    mozzi: { is_inline: true, audio: function(n,v,i) { return "((long)"+i.a + " > (long)" + i.b + " ? 255 : 0)"; } },
    rpdnode: { "title": "Greater Than", "inlets": { "a": { "type": "mozziflow/any", "color": "audio" }, "b": { "type": "mozziflow/any", "color": "audio" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "logic" } } }
});

NodeLibrary.push({
    nodetype: 'math/gte',
    nodeclass: "MathGTE",
    mozzi: { is_inline: true, audio: function(n,v,i) { return "((long)"+i.a + " >= (long)" + i.b + " ? 255 : 0)"; } },
    rpdnode: { "title": "Greater or Equal", "inlets": { "a": { "type": "mozziflow/any", "color": "audio" }, "b": { "type": "mozziflow/any", "color": "audio" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "logic" } } }
});

NodeLibrary.push({
    nodetype: 'math/lt',
    nodeclass: "MathLT",
    mozzi: { is_inline: true, audio: function(n,v,i) { return "((long)"+i.a + " < (long)" + i.b + " ? 255 : 0)"; } },
    rpdnode: { "title": "Less Than", "inlets": { "a": { "type": "mozziflow/any", "color": "audio" }, "b": { "type": "mozziflow/any", "color": "audio" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "logic" } } }
});

NodeLibrary.push({
    nodetype: 'math/lte',
    nodeclass: "MathLTE",
    mozzi: { is_inline: true, audio: function(n,v,i) { return "((long)"+i.a + " <= (long)" + i.b + " ? 255 : 0)"; } },
    rpdnode: { "title": "Less or Equal", "inlets": { "a": { "type": "mozziflow/any", "color": "audio" }, "b": { "type": "mozziflow/any", "color": "audio" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "logic" } } }
});

NodeLibrary.push({
    nodetype: 'math/eq',
    nodeclass: "MathEQ",
    mozzi: { is_inline: true, audio: function(n,v,i) { return "((long)"+i.a + " == (long)" + i.b + " ? 255 : 0)"; } },
    rpdnode: { "title": "Equal", "inlets": { "a": { "type": "mozziflow/any", "color": "audio" }, "b": { "type": "mozziflow/any", "color": "audio" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "logic" } } }
});

NodeLibrary.push({
    nodetype: 'math/neq',
    nodeclass: "MathNEQ",
    mozzi: { is_inline: true, audio: function(n,v,i) { return "((long)"+i.a + " != (long)" + i.b + " ? 255 : 0)"; } },
    rpdnode: { "title": "Not Equal", "inlets": { "a": { "type": "mozziflow/any", "color": "audio" }, "b": { "type": "mozziflow/any", "color": "audio" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "logic" } } }
});

NodeLibrary.push({
    nodetype: 'math/mozzi_map',
    nodeclass: "MozziMap",
    mozzi: { 
        is_inline: true, 
        defaults: { "in_min": "0", "in_max": "255", "out_min": "0", "out_max": "255" },
        audio: function(n,v,i) { return "map((long)"+i.in+", (long)"+i.in_min+", (long)"+i.in_max+", (long)"+i.out_min+", (long)"+i.out_max+")"; } 
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
        control: function(n,v,i){ return v+"((int)(long)"+i.in+")"; }
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
        control: function(n,v,i){ return v+".next((int)(long)"+i.in+")"; }
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
        audio: function(n,v,i) { return "((int)(((long)" + i.a + " * (long)" + i.b + ") >> 8))"; } 
    },
    rpdnode: { "title": "Mul (Audio)", "inlets": { "a": { "type": "mozziflow/any", "color": "audio" }, "b": { "type": "mozziflow/any", "color": "audio" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "audio" } } }
});

NodeLibrary.push({
    nodetype: 'math_audio/add',
    nodeclass: "MathAudioAdd",
    mozzi: { is_inline: true, audio: function(n,v,i) { return "(((long)" + i.a + " + (long)" + i.b + ") >> 1)"; } },
    rpdnode: { "title": "Add (Audio)", "inlets": { "a": { "type": "mozziflow/any", "color": "audio" }, "b": { "type": "mozziflow/any", "color": "audio" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "audio" } } }
});

NodeLibrary.push({
    nodetype: 'math_audio/clipper',
    nodeclass: "MathAudioClipper",
    mozzi: { is_inline: true, audio: function(n,v,i) { return "((long)" + i.in + " > 127 ? 127 : ((long)" + i.in + " < -128 ? -128 : (long)" + i.in + "))"; } },
    rpdnode: { "title": "Clipper", "inlets": { "in": { "type": "mozziflow/any", "color": "audio" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "audio" } } }
});

// LOGIC SECTION
NodeLibrary.push({
    nodetype: 'logic/and',
    nodeclass: "LogicAND",
    mozzi: { is_inline: true, audio: function(n,v,i) { return "((long)"+i.a+" > 0 && (long)"+i.b+" > 0) ? 255 : 0"; } },
    rpdnode: { "title": "AND", inlets: { "a": { "type": "mozziflow/any", "color": "logic" }, "b": { "type": "mozziflow/any", "color": "logic" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "logic" } } }
});

NodeLibrary.push({
    nodetype: 'logic/or',
    nodeclass: "LogicOR",
    mozzi: { is_inline: true, audio: function(n,v,i) { return "((long)"+i.a+" > 0 || (long)"+i.b+" > 0) ? 255 : 0"; } },
    rpdnode: { "title": "OR", inlets: { "a": { "type": "mozziflow/any", "color": "logic" }, "b": { "type": "mozziflow/any", "color": "logic" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "logic" } } }
});

NodeLibrary.push({
    nodetype: 'logic/xor',
    nodeclass: "LogicXOR",
    mozzi: { is_inline: true, audio: function(n,v,i) { return "(((long)"+i.a+" > 0) != ((long)"+i.b+" > 0)) ? 255 : 0"; } },
    rpdnode: { "title": "XOR", inlets: { "a": { "type": "mozziflow/any", "color": "logic" }, "b": { "type": "mozziflow/any", "color": "logic" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "logic" } } }
});

NodeLibrary.push({
    nodetype: 'logic/not',
    nodeclass: "LogicNOT",
    mozzi: { is_inline: true, audio: function(n,v,i) { return "(long)"+i.in+" == 0 ? 255 : 0"; } },
    rpdnode: { "title": "NOT", inlets: { "in": { "type": "mozziflow/any", "color": "logic" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "logic" } } }
});
