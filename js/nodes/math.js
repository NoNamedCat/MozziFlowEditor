// Mozzi Node Definitions - MATH (Iron Integrity v111.35)
// MATH + LOGIC + MAPPING (Absolute Raw Transparency - Dual Rate)

NodeLibrary.push({
    nodetype: 'math/add',
    nodeclass: "MathAdd",
    mozzi: { 
        is_inline: true, 
        audio: function(n,v,i) { return "((long)"+i.a + " + (long)" + i.b + ")"; },
        control: function(n,v,i) { return "((long)"+i.a + " + (long)" + i.b + ")"; }
    },
    rpdnode: { "title": "Add", "inlets": { "a": { "type": "mozziflow/long" }, "b": { "type": "mozziflow/long" } }, "outlets": { "out": { "type": "mozziflow/long" } } }
});

NodeLibrary.push({
    nodetype: 'math/sub',
    nodeclass: "MathSub",
    mozzi: { 
        is_inline: true, 
        audio: function(n,v,i) { return "((long)"+i.a + " - (long)" + i.b + ")"; },
        control: function(n,v,i) { return "((long)"+i.a + " - (long)" + i.b + ")"; }
    },
    rpdnode: { "title": "Subtract", "inlets": { "a": { "type": "mozziflow/long" }, "b": { "type": "mozziflow/long" } }, "outlets": { "out": { "type": "mozziflow/long" } } }
});

NodeLibrary.push({
    nodetype: 'math/mul',
    nodeclass: "MathMul",
    mozzi: { 
        is_inline: true, 
        defaults: { "b": "1" },
        audio: function(n,v,i) { return "((long)"+i.a+" * (long)"+i.b+")"; },
        control: function(n,v,i) { return "((long)"+i.a+" * (long)"+i.b+")"; }
    },
    rpdnode: { "title": "Multiply", "inlets": { "a": { "type": "mozziflow/long" }, "b": { "type": "mozziflow/long" } }, "outlets": { "out": { "type": "mozziflow/long" } } }
});

NodeLibrary.push({
    nodetype: 'math/div',
    nodeclass: "MathDiv",
    mozzi: { 
        is_inline: true, 
        defaults: { "b": "1" },
        audio: function(n,v,i) { return "((long)"+i.a+" / (long)"+i.b+")"; },
        control: function(n,v,i) { return "((long)"+i.a+" / (long)"+i.b+")"; }
    },
    rpdnode: { "title": "Divide", "inlets": { "a": { "type": "mozziflow/long" }, "b": { "type": "mozziflow/long" } }, "outlets": { "out": { "type": "mozziflow/long" } } }
});

NodeLibrary.push({
    nodetype: 'math_audio/inv',
    nodeclass: "MathAudioInv",
    mozzi: { 
        is_inline: true, 
        audio: function(n,v,i) { return "(-(long)"+i.in+")"; },
        control: function(n,v,i) { return "(-(long)"+i.in+")"; }
    },
    rpdnode: { "title": "Invert Phase", "inlets": { "in": { "type": "mozziflow/long" } }, "outlets": { "out": { "type": "mozziflow/long" } } }
});

NodeLibrary.push({
    nodetype: 'math_audio/hwr',
    nodeclass: "MathAudioHWR",
    mozzi: { 
        is_inline: true, 
        audio: function(n,v,i) { return "((long)"+i.in+" > 0 ? (long)"+i.in+" : 0)"; },
        control: function(n,v,i) { return "((long)"+i.in+" > 0 ? (long)"+i.in+" : 0)"; }
    },
    rpdnode: { "title": "Half-Wave Rect", "inlets": { "in": { "type": "mozziflow/long" } }, "outlets": { "out": { "type": "mozziflow/long" } } }
});

NodeLibrary.push({
    nodetype: 'math_audio/xor',
    nodeclass: "MathAudioXOR",
    mozzi: { 
        is_inline: true, 
        audio: function(n,v,i) { return "((long)"+i.a+" ^ (long)"+i.b+")"; },
        control: function(n,v,i) { return "((long)"+i.a+" ^ (long)"+i.b+")"; }
    },
    rpdnode: { "title": "XOR RingMod", "inlets": { "a": { "type": "mozziflow/long" }, "b": { "type": "mozziflow/long" } }, "outlets": { "out": { "type": "mozziflow/long" } } }
});

NodeLibrary.push({
    nodetype: 'math_audio/bitcrush',
    nodeclass: "MathAudioBitcrush",
    mozzi: { 
        is_inline: true, 
        defaults: { "bits": "2" },
        audio: function(n,v,i) { return "((long)"+i.in+" & (0xFFFFFFFF << (int)"+i.bits+"))"; },
        control: function(n,v,i) { return "((long)"+i.in+" & (0xFFFFFFFF << (int)"+i.bits+"))"; }
    },
    rpdnode: { "title": "Bit-Crusher", "inlets": { "in": { "type": "mozziflow/long" }, "bits": { "type": "mozziflow/uint8", "label": "bits" } }, "outlets": { "out": { "type": "mozziflow/long" } } }
});

NodeLibrary.push({
    nodetype: 'math_audio/xfade',
    nodeclass: "MathAudioXFade",
    mozzi: { 
        is_inline: true, 
        defaults: { "mix": "128" },
        audio: function(n,v,i) { 
            return "(((long)"+i.a+" * (long)(255 - (int)"+i.mix+")) + ((long)"+i.b+" * (long)(int)"+i.mix+"))"; 
        },
        control: function(n,v,i) { 
            return "(((long)"+i.a+" * (long)(255 - (int)"+i.mix+")) + ((long)"+i.b+" * (long)(int)"+i.mix+"))"; 
        } 
    },
    rpdnode: { "title": "Crossfader", "inlets": { "a": { "type": "mozziflow/long" }, "b": { "type": "mozziflow/long" }, "mix": { "type": "mozziflow/uint8", "label": "mix" } }, "outlets": { "out": { "type": "mozziflow/long" } } }
});

NodeLibrary.push({
    nodetype: 'math_audio/sum3',
    nodeclass: "MathAudioSum3",
    mozzi: { 
        is_inline: true, 
        audio: function(n,v,i) { return "((long)"+i.a+" + (long)"+i.b+" + (long)"+i.c+")"; },
        control: function(n,v,i) { return "((long)"+i.a+" + (long)"+i.b+" + (long)"+i.c+")"; }
    },
    rpdnode: { "title": "Mixer 3", "inlets": { "a": { "type": "mozziflow/long" }, "b": { "type": "mozziflow/long" }, "c": { "type": "mozziflow/long" } }, "outlets": { "out": { "type": "mozziflow/long" } } }
});

NodeLibrary.push({
    nodetype: 'math/mtof',
    nodeclass: "MathMTOF",
    mozzi: { 
        rate: "control",
        is_inline: true, 
        includes: ["#include <mozzi_midi.h>"], 
        control: function(n,v,i) { return "mtof((uint8_t)(long)"+i.note+")"; } 
    },
    rpdnode: { "title": "Midi->Freq", "inlets": { "note": { "type": "mozziflow/uint8", "label": "note" } }, "outlets": { "out": { "type": "mozziflow/float" } } }
});

NodeLibrary.push({
    nodetype: 'math/mozzi_map',
    nodeclass: "MathMap",
    mozzi: { 
        rate: "control",
        is_inline: true, 
        defaults: { "in_min": "0", "in_max": "255", "out_min": "0", "out_max": "1023" },
        control: function(n,v,i) { 
            return "((((long)"+i.in+" - (long)"+i.in_min+") * ((long)"+i.out_max+" - (long)"+i.out_min+")) / ((long)"+i.in_max+" - (long)"+i.in_min+") + (long)"+i.out_min+")"; 
        } 
    },
    rpdnode: { "title": "Map Range", "inlets": { "in": { "type": "mozziflow/long" }, "in_min": { "type": "mozziflow/long" }, "in_max": { "type": "mozziflow/long" }, "out_min": { "type": "mozziflow/long" }, "out_max": { "type": "mozziflow/long" } }, "outlets": { "out": { "type": "mozziflow/long" } } }
});

NodeLibrary.push({
    nodetype: 'math/shl',
    nodeclass: "MathSHL",
    mozzi: { 
        is_inline: true, 
        audio: function(n,v,i) { return "((long)"+i.a + " << (int)" + i.b + ")"; },
        control: function(n,v,i) { return "((long)"+i.a + " << (int)" + i.b + ")"; }
    },
    rpdnode: { "title": "Shift Left", "inlets": { "a": { "type": "mozziflow/long" }, "b": { "type": "mozziflow/uint8", "label": "bits" } }, "outlets": { "out": { "type": "mozziflow/long" } } }
});

NodeLibrary.push({
    nodetype: 'math/shr',
    nodeclass: "MathSHR",
    mozzi: { 
        is_inline: true, 
        audio: function(n,v,i) { return "((long)"+i.a + " >> (int)" + i.b + ")"; },
        control: function(n,v,i) { return "((long)"+i.a + " >> (int)" + i.b + ")"; }
    },
    rpdnode: { "title": "Shift Right", "inlets": { "a": { "type": "mozziflow/long" }, "b": { "type": "mozziflow/uint8", "label": "bits" } }, "outlets": { "out": { "type": "mozziflow/long" } } }
});

NodeLibrary.push({
    nodetype: 'math/gt',
    nodeclass: "MathGT",
    mozzi: { 
        is_inline: true, 
        audio: function(n,v,i) { return "((long)"+i.a + " > (long)" + i.b + " ? 255 : 0)"; },
        control: function(n,v,i) { return "((long)"+i.a + " > (long)" + i.b + " ? 255 : 0)"; }
    },
    rpdnode: { "title": "Greater Than", "inlets": { "a": { "type": "mozziflow/long" }, "b": { "type": "mozziflow/long" } }, "outlets": { "out": { "type": "mozziflow/bool" } } }
});

NodeLibrary.push({
    nodetype: 'math/gte',
    nodeclass: "MathGTE",
    mozzi: { 
        is_inline: true, 
        audio: function(n,v,i) { return "((long)"+i.a + " >= (long)" + i.b + " ? 255 : 0)"; },
        control: function(n,v,i) { return "((long)"+i.a + " >= (long)" + i.b + " ? 255 : 0)"; }
    },
    rpdnode: { "title": "Greater or Equal", "inlets": { "a": { "type": "mozziflow/long" }, "b": { "type": "mozziflow/long" } }, "outlets": { "out": { "type": "mozziflow/bool" } } }
});

NodeLibrary.push({
    nodetype: 'math/lt',
    nodeclass: "MathLT",
    mozzi: { 
        is_inline: true, 
        audio: function(n,v,i) { return "((long)"+i.a + " < (long)" + i.b + " ? 255 : 0)"; },
        control: function(n,v,i) { return "((long)"+i.a + " < (long)" + i.b + " ? 255 : 0)"; }
    },
    rpdnode: { "title": "Less Than", "inlets": { "a": { "type": "mozziflow/long" }, "b": { "type": "mozziflow/long" } }, "outlets": { "out": { "type": "mozziflow/bool" } } }
});

NodeLibrary.push({
    nodetype: 'math/lte',
    nodeclass: "MathLTE",
    mozzi: { 
        is_inline: true, 
        audio: function(n,v,i) { return "((long)"+i.a + " <= (long)" + i.b + " ? 255 : 0)"; },
        control: function(n,v,i) { return "((long)"+i.a + " <= (long)" + i.b + " ? 255 : 0)"; }
    },
    rpdnode: { "title": "Less or Equal", "inlets": { "a": { "type": "mozziflow/long" }, "b": { "type": "mozziflow/long" } }, "outlets": { "out": { "type": "mozziflow/bool" } } }
});

NodeLibrary.push({
    nodetype: 'math/eq',
    nodeclass: "MathEQ",
    mozzi: { 
        is_inline: true, 
        audio: function(n,v,i) { return "((long)"+i.a + " == (long)" + i.b + " ? 255 : 0)"; },
        control: function(n,v,i) { return "((long)"+i.a + " == (long)" + i.b + " ? 255 : 0)"; }
    },
    rpdnode: { "title": "Equal", "inlets": { "a": { "type": "mozziflow/long" }, "b": { "type": "mozziflow/long" } }, "outlets": { "out": { "type": "mozziflow/bool" } } }
});

NodeLibrary.push({
    nodetype: 'math/neq',
    nodeclass: "MathNEQ",
    mozzi: { 
        is_inline: true, 
        audio: function(n,v,i) { return "((long)"+i.a + " != (long)" + i.b + " ? 255 : 0)"; },
        control: function(n,v,i) { return "((long)"+i.a + " != (long)" + i.b + " ? 255 : 0)"; }
    },
    rpdnode: { "title": "Not Equal", "inlets": { "a": { "type": "mozziflow/long" }, "b": { "type": "mozziflow/long" } }, "outlets": { "out": { "type": "mozziflow/bool" } } }
});

NodeLibrary.push({
    nodetype: 'logic/and',
    nodeclass: "LogicAND",
    mozzi: { 
        is_inline: true, 
        audio: function(n,v,i) { return "((long)"+i.a+" > 0 && (long)"+i.b+" > 0) ? 255 : 0"; },
        control: function(n,v,i) { return "((long)"+i.a+" > 0 && (long)"+i.b+" > 0) ? 255 : 0"; }
    },
    rpdnode: { "title": "AND", inlets: { "a": { "type": "mozziflow/bool" }, "b": { "type": "mozziflow/bool" } }, "outlets": { "out": { "type": "mozziflow/bool" } } }
});

NodeLibrary.push({
    nodetype: 'logic/or',
    nodeclass: "LogicOR",
    mozzi: { 
        is_inline: true, 
        audio: function(n,v,i) { return "((long)"+i.a+" > 0 || (long)"+i.b+" > 0) ? 255 : 0"; },
        control: function(n,v,i) { return "((long)"+i.a+" > 0 || (long)"+i.b+" > 0) ? 255 : 0"; }
    },
    rpdnode: { "title": "OR", inlets: { "a": { "type": "mozziflow/bool" }, "b": { "type": "mozziflow/bool" } }, "outlets": { "out": { "type": "mozziflow/bool" } } }
});

NodeLibrary.push({
    nodetype: 'logic/xor',
    nodeclass: "LogicXOR",
    mozzi: { 
        is_inline: true, 
        audio: function(n,v,i) { return "(((long)"+i.a+" > 0) != ((long)"+i.b+" > 0)) ? 255 : 0"; },
        control: function(n,v,i) { return "(((long)"+i.a+" > 0) != ((long)"+i.b+" > 0)) ? 255 : 0"; }
    },
    rpdnode: { "title": "XOR", inlets: { "a": { "type": "mozziflow/bool" }, "b": { "type": "mozziflow/bool" } }, "outlets": { "out": { "type": "mozziflow/bool" } } }
});

NodeLibrary.push({
    nodetype: 'logic/not',
    nodeclass: "LogicNOT",
    mozzi: { 
        is_inline: true, 
        audio: function(n,v,i) { return "((long)"+i.in+" == 0 ? 255 : 0)"; },
        control: function(n,v,i) { return "((long)"+i.in+" == 0 ? 255 : 0)"; }
    },
    rpdnode: { "title": "NOT", inlets: { "in": { "type": "mozziflow/bool" } }, "outlets": { "out": { "type": "mozziflow/bool" } } }
});