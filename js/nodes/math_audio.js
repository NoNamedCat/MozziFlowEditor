// Mozzi Node Definitions - MATH AUDIO CATEGORY
// High-Fidelity Optimized Version 15.0: Inlining & Precision Casting

NodeLibrary.push({
    nodetype: 'math_audio/add',
    nodeclass: "MathAudioAdd",
    description: "Safe signal addition (divides by 2).",
    mozzi: {
        is_inline: true,
        defaults: {"a":"0","b":"0"},
        audio: function(n,v,i) { return "((" + i.a + " + " + i.b + ") >> 1)"; },
    },
    rpdnode: {
        "title": "Add (Audio)",
        "inlets": { 
            "a": { "type": "mozziflow/string", "color": "bipolar_8" }, 
            "b": { "type": "mozziflow/string", "color": "bipolar_8" } 
        },
        "outlets": { "out": { "type": "mozziflow/string", "color": "bipolar_8" } }
    }
});

NodeLibrary.push({
    nodetype: 'math_audio/sub',
    nodeclass: "MathAudioSub",
    description: "Safe signal subtraction (divides by 2).",
    mozzi: {
        is_inline: true,
        defaults: {"a":"0","b":"0"},
        audio: function(n,v,i) { return "((" + i.a + " - " + i.b + ") >> 1)"; },
    },
    rpdnode: {
        "title": "Sub (Audio)",
        "inlets": { 
            "a": { "type": "mozziflow/string", "color": "bipolar_8" }, 
            "b": { "type": "mozziflow/string", "color": "bipolar_8" } 
        },
        "outlets": { "out": { "type": "mozziflow/string", "color": "bipolar_8" } }
    }
});

NodeLibrary.push({
    nodetype: 'math_audio/mul',
    nodeclass: "MathAudioMul",
    description: "Signal multiplier (VCA style, divides by 256).",
    mozzi: {
        is_inline: true,
        defaults: {"a":"0","b":"255"},
        audio: function(n,v,i) { return "((int)(((long)" + i.a + " * " + i.b + ") >> 8))"; },
    },
    rpdnode: {
        "title": "Mul (Audio)",
        "inlets": { 
            "a": { "type": "mozziflow/string", "color": "bipolar_8" }, 
            "b": { "type": "mozziflow/string", "color": "unipolar_8" } 
        },
        "outlets": { "out": { "type": "mozziflow/string", "color": "bipolar_8" } }
    }
});

NodeLibrary.push({
    nodetype: 'math_audio/crossfade',
    nodeclass: "MathAudioCrossfade",
    description: "Linear crossfade between two signals.",
    mozzi: {
        is_inline: true,
        defaults: {"a":"0","b":"0","mix":"128"},
        audio: function(n,v,i) { 
            return "((int)(( (long)" + i.a + " * (255 - " + i.mix + ") + (long)" + i.b + " * " + i.mix + " ) >> 8))"; 
        },
    },
    rpdnode: {
        "title": "Crossfade",
        "inlets": { 
            "a": { "type": "mozziflow/string", "color": "bipolar_8" }, 
            "b": { "type": "mozziflow/string", "color": "bipolar_8" },
            "mix": { "type": "mozziflow/string", "default": "128", "color": "unipolar_8" }
        },
        "outlets": { "out": { "type": "mozziflow/string", "color": "bipolar_8" } }
    }
});

NodeLibrary.push({
    nodetype: 'math_audio/inv',
    nodeclass: "MathAudioInv",
    description: "Signal inverter.",
    mozzi: {
        is_inline: true,
        defaults: {"in":"0"},
        audio: function(n,v,i) { return "(-" + i.in + ")"; },
    },
    rpdnode: {
        "title": "Invert",
        "inlets": { "in": { "type": "mozziflow/string", "color": "bipolar_8" } },
        "outlets": { "out": { "type": "mozziflow/string", "color": "bipolar_8" } }
    }
});

NodeLibrary.push({
    nodetype: 'math_audio/clipper',
    nodeclass: "MathAudioClipper",
    description: "Hard clipper.",
    mozzi: {
        is_inline: true,
        defaults: {"in":"0","min":"-127","max":"127"},
        audio: function(n,v,i) { return "constrain((int)" + i.in + ", (int)" + i.min + ", (int)" + i.max + ")"; },
    },
    rpdnode: {
        "title": "Clipper",
        "inlets": { 
            "in": { "type": "mozziflow/string", "color": "bipolar_8" },
            "min": { "type": "mozziflow/string", "default": "-127" },
            "max": { "type": "mozziflow/string", "default": "127" }
        },
        "outlets": { "out": { "type": "mozziflow/string", "color": "bipolar_8" } }
    }
});