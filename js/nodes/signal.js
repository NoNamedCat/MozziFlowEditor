// Mozzi Node Definitions - SIGNAL CATEGORY
// High-Fidelity Optimized Version 13.0

NodeLibrary.push({
    nodetype: 'signal/mozzi_autorange',
    nodeclass: "MozziAutoRange",
    description: "Normalization.",
    mozzi: {
        rate: "control",
        includes: ["#include <AutoRange.h>"],
        defaults: {"in":"0", "imin":"0", "imax":"1023"},
        global: function(n,v){
            var getVal = function(a, d) { if (n.nodeinletvalue && n.nodeinletvalue[a]) return n.nodeinletvalue[a][1]; return d; };
            return "AutoRange<int> "+v+"("+getVal('imin','0')+","+getVal('imax','1023')+");"; 
        },
        control: function(n,v,i){ return v+".next((int)"+i.in+");"; },
        audio: function(n,v){ return v+"_min="+v+".getMin(); "+v+"_max="+v+".getMax();"; },
    },
    rpdnode: {
    "title": "AutoRange",
    "inlets": {
        "in": { "type": "mozziflow/string", "no_text": true, "color": "unipolar_16" },
        "imin": { "type": "mozziflow/string", "color": "unipolar_16" },
        "imax": { "type": "mozziflow/string", "color": "unipolar_16" }
    },
    "outlets": {
        "min": { "type": "mozziflow/string", "color": "unipolar_16" },
        "max": { "type": "mozziflow/string", "color": "unipolar_16" }
    }
}
});

NodeLibrary.push({
    nodetype: 'signal/mozzi_eventdelay',
    nodeclass: "MozziEventDelay",
    description: "One-shot pulse delay.",
    mozzi: {
        rate: "control",
        includes: ["#include <EventDelay.h>"],
        defaults: {"start":"0","time":"1000"},
        global: function(n,v){ return "EventDelay "+v+"; bool "+v+"_l=0;"; },
        control: function(n,v,i){ return "if((int)"+i.start+">0 && !"+v+"_l){ "+v+".start((uint32_t)"+i.time+"); "+v+"_l=1; } else if((int)"+i.start+"==0) { "+v+"_l=0; } "+v+"_out = "+v+".ready()?255:0;"; },
    },
    rpdnode: {
    "title": "Event Delay",
    "inlets": {
        "start": { "type": "mozziflow/string", "no_text": true, "color": "logic" },
        "time": { "type": "mozziflow/string", "color": "unipolar_16" }
    },
    "outlets": { "out": { "type": "mozziflow/string", "color": "logic" } }
}
});

NodeLibrary.push({
    nodetype: 'signal/mozzi_rollingaverage',
    nodeclass: "MozziRollingAvg",
    description: "Moving average filter.",
    mozzi: {
        rate: "control",
        includes: ["#include <RollingAverage.h>"],
        defaults: {"in":"0"},
        global: function(n,v){ return "RollingAverage<int, 16> "+v+"; int "+v+"_val;"; },
        control: function(n,v,i){ return v+"_val = "+v+".next((int)"+i.in+");"; },
        audio: function(n,v){ return v+"_out="+v+"_val;"; },
    },
    rpdnode: {
    "title": "Rolling Avg",
    "inlets": { "in": { "type": "mozziflow/string", "no_text": true, "color": "unipolar_16" } },
    "outlets": { "out": { "type": "mozziflow/string", "color": "unipolar_16" } }
}
});

NodeLibrary.push({
    nodetype: 'signal/mozzi_automap',
    nodeclass: "MozziAutoMap",
    description: "Auto-scaling mapper.",
    mozzi: {
        rate: "control",
        includes: ["#include <AutoMap.h>"],
        defaults: {"in":"0","imin":"0","imax":"1023","omin":"0","omax":"255"},
        global: function(n,v){
            var getVal = function(a, d) { if (n.nodeinletvalue && n.nodeinletvalue[a]) return n.nodeinletvalue[a][1]; return d; };
            return "AutoMap "+v+" ("+getVal('imin','0')+","+getVal('imax','1023')+","+getVal('omin','0')+","+getVal('omax','255')+");"; 
        },
        audio: function(n,v,i){ return v+"_out = "+v+"((int)"+i.in+");"; },
    },
    rpdnode: {
    "title": "AutoMap",
    "inlets": {
        "in": { "type": "mozziflow/string", "no_text": true, "color": "unipolar_16" },
        "imin": { "type": "mozziflow/string", "color": "unipolar_16" },
        "imax": { "type": "mozziflow/string", "color": "unipolar_16" },
        "omin": { "type": "mozziflow/string", "color": "unipolar_16" },
        "omax": { "type": "mozziflow/string", "color": "unipolar_16" }
    },
    "outlets": { "out": { "type": "mozziflow/string", "color": "unipolar_16" } }
}
});

NodeLibrary.push({
    nodetype: 'signal/mozzi_gain',
    nodeclass: "MozziGain",
    description: "Digital VCA.",
    mozzi: {
        defaults: {"in":"0","gain":"128"},
        audio: function(n,v,i){ return v+"_out = (int)(((long)"+i.in+" * (int)"+i.gain+") >> 8);"; },
    },
    rpdnode: {
    "title": "Gain",
    "inlets": {
        "in": { "type": "mozziflow/string", "no_text": true }, 
        "gain": { "type": "mozziflow/string", "color": "unipolar_8" } 
    },
    "outlets": { "out": { "type": "mozziflow/string" } }
}
});

NodeLibrary.push({
    nodetype: 'signal/toggle',
    nodeclass: "ArduinoToggle",
    description: "Latching trigger switch.",
    mozzi: {
        rate: "control",
        defaults: {"trig":"0"},
        global: function(n,v){ return "bool "+v+"_s=0; bool "+v+"_l=0;"; },
        control: function(n,v,i){ return "if((int)"+i.trig+">0 && !"+v+"_l){ "+v+"_s=!"+v+"_s; "+v+"_l=1; } else if((int)"+i.trig+"==0) { "+v+"_l=0; } "+v+"_out = "+v+"_s?255:0;"; },
    },
    rpdnode: {
    "title": "Toggle",
    "inlets": { "trig": { "type": "mozziflow/string", "no_text": true, "color": "logic" } },
    "outlets": { "out": { "type": "mozziflow/string", "color": "logic" } }
}
});

NodeLibrary.push({
    nodetype: 'signal/mozzi_adsr',
    nodeclass: "MozziADSR",
    description: "Full ADSR Envelope.",
    mozzi: {
        rate: "control",
        is_inline: true,
        includes: ["#include <ADSR.h>"],
        defaults: {"trig":"0","rst":"0","att":"10","lev":"255","dec":"100","sus":"128","rel":"50"},
        global: function(n,v){ return "ADSR<CONTROL_RATE, AUDIO_RATE> "+v+"; bool "+v+"_l=0;"; },
        setup: function(n,v,i,r,s){
            var code = "";
            if (s.lev && s.sus) code += v+".setADLevels((uint8_t)"+i.lev+", (uint8_t)"+i.sus+");\n\t";
            if (s.att && s.dec && s.rel) code += v+".setTimes((unsigned int)"+i.att+", (unsigned int)"+i.dec+", 65535, (unsigned int)"+i.rel+");";
            return code;
        },
        control: function(n,v,i,r,s){
            var code = "bool "+v+"_tr=(int)"+i.trig+">0; if("+v+"_tr && !"+v+"_l){ "+v+".noteOn((int)"+i.rst+">0); } else if(!"+v+"_tr && "+v+"_l){ "+v+".noteOff(); } "+v+"_l="+v+"_tr; ";
            if (!s.lev || !s.sus) code += v+".setADLevels((uint8_t)"+i.lev+", (uint8_t)"+i.sus+"); ";
            if (!s.att || !s.dec || !s.rel) code += v+".setTimes((unsigned int)"+i.att+", (unsigned int)"+i.dec+", 65535, (unsigned int)"+i.rel+"); ";
            code += v+".update(); "+v+"_act = "+v+".playing() ? 255 : 0;"; 
            return code;
        },
        audio: function(n,v){ return v+".next()"; },
    },
    rpdnode: {
    "title": "ADSR",
    "inlets": {
        "trig": { "type": "mozziflow/string", "color": "logic" },
        "rst": { "type": "mozziflow/string", "color": "logic" },
        "att": { "type": "mozziflow/string", "color": "unipolar_16" },
        "lev": { "type": "mozziflow/string", "color": "unipolar_8" },
        "dec": { "type": "mozziflow/string", "color": "unipolar_16" },
        "sus": { "type": "mozziflow/string", "color": "unipolar_8" },
        "rel": { "type": "mozziflow/string", "color": "unipolar_16" }
    },
    "outlets": { "out": { "type": "mozziflow/string", "color": "unipolar_8" }, "act": { "type": "mozziflow/string", "color": "logic" } }
}
});

NodeLibrary.push({
    nodetype: 'signal/mozzi_ead',
    nodeclass: "MozziEad",
    description: "Exponential Attack-Decay (Control Rate).",
    mozzi: {
        rate: "control",
        is_inline: true,
        includes: ["#include <Ead.h>"],
        defaults: {"trig":"0","att":"10","dec":"200"},
        global: function(n,v){ return "Ead "+v+"(AUDIO_RATE); bool "+v+"_l=0;"; },
        control: function(n,v,i){
            return "if((int)"+i.trig+">0 && !"+v+"_l){ "+v+".start((unsigned int)"+i.att+", (unsigned int)"+i.dec+"); "+v+"_l=1; } else if((int)"+i.trig+"==0) { "+v+"_l=0; }"; 
        },
        audio: function(n,v){ return v+".next()"; },
    },
    rpdnode: {
    "title": "Ead Env",
    "inlets": {
        "trig": { "type": "mozziflow/string", "no_text": true, "color": "logic" },
        "att": { "type": "mozziflow/string", "default": "10", "color": "unipolar_16" },
        "dec": { "type": "mozziflow/string", "default": "200", "color": "unipolar_16" }
    },
    "outlets": { "out": { "type": "mozziflow/string", "color": "unipolar_8" } }
}
});

NodeLibrary.push({
    nodetype: 'signal/mozzi_smooth',
    nodeclass: "MozziSmooth",
    description: "Softens rapid changes.",
    mozzi: {
        rate: "control",
        includes: ["#include <Smooth.h>"],
        defaults: {"in":"0","smooth":"0.95"},
        global: function(n,v){ return "Smooth<long> "+v+"(0.95f);"; },
        setup: function(n,v,i,r,s){ if (s.smooth) return v+".setSmoothness((float)"+i.smooth+");"; return ""; },
        control: function(n,v,i,r,s){
            var code = "";
            if (!s.smooth) code += v+".setSmoothness((float)"+i.smooth+"); ";
            return code + v+"_out = "+v+".next((long)"+i.in+");";
        },
    },
    rpdnode: {
    "title": "Smooth",
    "inlets": { "in": { "type": "mozziflow/string", "no_text": true }, "smooth": { "type": "mozziflow/string", "default": "0.95", "color": "unipolar_8" } },
    "outlets": { "out": { "type": "mozziflow/string", "color": "unipolar_16" } }
}
});

NodeLibrary.push({
    nodetype: 'signal/mozzi_metronome',
    nodeclass: "MozziMetronome",
    description: "BPM timing pulse.",
    mozzi: {
        rate: "control",
        includes: ["#include <Metronome.h>"],
        defaults: {"bpm":"120"},
        global: function(n,v){ return "Metronome " + v + "; float " + v + "_lastbpm = 0;"; },
        setup: function(n,v,i,r,s){ 
            var code = v + ".start();";
            if (s.bpm) code += "\n\t" + v + ".setBPM((float)" + i.bpm + ");";
            return code;
        },
        control: function(n,v,i,r,s){ 
            if (s.bpm) return v + "_out = " + v + ".ready() ? 255 : 0;";
            return "if(" + v + "_lastbpm != (float)" + i.bpm + ") { " + v + ".setBPM((float)" + i.bpm + "); " + v + "_lastbpm = (float)" + i.bpm + ";} " + v + "_out = " + v + ".ready() ? 255 : 0;"; 
        },
    },
    rpdnode: {
    "title": "Metronome",
    "inlets": { "bpm": { "type": "mozziflow/string", "color": "unipolar_16" } },
    "outlets": { "out": { "type": "mozziflow/string", "color": "logic" } }
}
});

// SEQUENCER HELPER
function makeSequencer(steps) {
    return {
        nodetype: 'signal/mozzi_sequencer' + (steps==8?'':steps),
        nodeclass: "MozziSequencer" + (steps==8?'':steps),
        mozzi: {
            rate: "control",
            global: function(n,v){ return "int "+v+"_s["+steps+"]={0}; byte "+v+"_i=0; bool "+v+"_l=0;"; },
            setup: function(n,v,i,r,s){
                var code = "";
                for(var j=0;j<steps;j++) if(s['s'+j]) code += v+"_s["+j+"]="+i['s'+j]+"; ";
                return code;
            },
            control: function(n,v,i,r,s){
                var stepCount = (i.steps && i.steps !== "undefined") ? i.steps : steps;
                var code = "int "+v+"_len=(int)"+stepCount+"; if("+v+"_len<1)"+v+"_len=1; if("+v+"_len>"+steps+")"+v+"_len="+steps+"; ";
                for(var j=0;j<steps;j++) if(!s['s'+j]) code += v+"_s["+j+"]=" + i['s'+j] + "; "; 
                code += "if("+v+"_i >= "+v+"_len) "+v+"_i=0; if((int)"+i.trig+">0 && !"+v+"_l){ "+v+"_i++; if("+v+"_i >= "+v+"_len) "+v+"_i=0; "+v+"_l=1; } else if((int)"+i.trig+"==0) { "+v+"_l=0; } "+v+"_out="+v+"_s["+v+"_i]; "+v+"_index="+v+"_i;"; 
                return code;
            }
        }
    };
}

NodeLibrary.push({
    nodetype: 'signal/mozzi_sequencer',
    nodeclass: "MozziSequencer",
    description: "8-step sequencer.",
    mozzi: makeSequencer(8).mozzi,
    rpdnode: {
    "title": "Sequencer (8)",
    "inlets": {
        "trig": { "type": "mozziflow/string", "no_text": true, "color": "logic" },
        "steps": { "type": "mozziflow/string", "default": "8", "color": "unipolar_16" },
        "s0": { "type": "mozziflow/string", "color": "unipolar_16" }, "s1": { "type": "mozziflow/string", "color": "unipolar_16" }, "s2": { "type": "mozziflow/string", "color": "unipolar_16" }, "s3": { "type": "mozziflow/string", "color": "unipolar_16" }, "s4": { "type": "mozziflow/string", "color": "unipolar_16" }, "s5": { "type": "mozziflow/string", "color": "unipolar_16" }, "s6": { "type": "mozziflow/string", "color": "unipolar_16" }, "s7": { "type": "mozziflow/string", "color": "unipolar_16" }
    },
    "outlets": { "out": { "type": "mozziflow/string", "color": "unipolar_16" }, "index": { "type": "mozziflow/string", "color": "unipolar_16" } }
}
});

NodeLibrary.push({
    nodetype: 'signal/mozzi_sequencer16',
    nodeclass: "MozziSequencer16",
    description: "16-step sequencer.",
    mozzi: makeSequencer(16).mozzi,
    rpdnode: {
    "title": "Sequencer (16)",
    "inlets": {
        "trig": { "type": "mozziflow/string", "no_text": true, "color": "logic" },
        "steps": { "type": "mozziflow/string", "default": "16", "color": "unipolar_16" },
        "s0": { "type": "mozziflow/string", "color": "unipolar_16" }, "s1": { "type": "mozziflow/string", "color": "unipolar_16" }, "s2": { "type": "mozziflow/string", "color": "unipolar_16" }, "s3": { "type": "mozziflow/string", "color": "unipolar_16" }, "s4": { "type": "mozziflow/string", "color": "unipolar_16" }, "s5": { "type": "mozziflow/string", "color": "unipolar_16" }, "s6": { "type": "mozziflow/string", "color": "unipolar_16" }, "s7": { "type": "mozziflow/string", "color": "unipolar_16" }, "s8": { "type": "mozziflow/string", "color": "unipolar_16" }, "s9": { "type": "mozziflow/string", "color": "unipolar_16" }, "s10": { "type": "mozziflow/string", "color": "unipolar_16" }, "s11": { "type": "mozziflow/string", "color": "unipolar_16" }, "s12": { "type": "mozziflow/string", "color": "unipolar_16" }, "s13": { "type": "mozziflow/string", "color": "unipolar_16" }, "s14": { "type": "mozziflow/string", "color": "unipolar_16" }, "s15": { "type": "mozziflow/string", "color": "unipolar_16" }
    },
    "outlets": { "out": { "type": "mozziflow/string", "color": "unipolar_16" }, "index": { "type": "mozziflow/string", "color": "unipolar_16" } }
}
});

NodeLibrary.push({
    nodetype: 'signal/mozzi_sequencer24',
    nodeclass: "MozziSequencer24",
    description: "24-step sequencer.",
    mozzi: makeSequencer(24).mozzi,
    rpdnode: {
    "title": "Sequencer (24)",
    "inlets": {
        "trig": { "type": "mozziflow/string", "no_text": true, "color": "logic" },
        "steps": { "type": "mozziflow/string", "default": "24", "color": "unipolar_16" },
        "s0": { "type": "mozziflow/string", "color": "unipolar_16" }, "s1": { "type": "mozziflow/string", "color": "unipolar_16" }, "s2": { "type": "mozziflow/string", "color": "unipolar_16" }, "s3": { "type": "mozziflow/string", "color": "unipolar_16" }, "s4": { "type": "mozziflow/string", "color": "unipolar_16" }, "s5": { "type": "mozziflow/string", "color": "unipolar_16" }, "s6": { "type": "mozziflow/string", "color": "unipolar_16" }, "s7": { "type": "mozziflow/string", "color": "unipolar_16" }, "s8": { "type": "mozziflow/string", "color": "unipolar_16" }, "s9": { "type": "mozziflow/string", "color": "unipolar_16" }, "s10": { "type": "mozziflow/string", "color": "unipolar_16" }, "s11": { "type": "mozziflow/string", "color": "unipolar_16" }, "s12": { "type": "mozziflow/string", "color": "unipolar_16" }, "s13": { "type": "mozziflow/string", "color": "unipolar_16" }, "s14": { "type": "mozziflow/string", "color": "unipolar_16" }, "s15": { "type": "mozziflow/string", "color": "unipolar_16" }, "s16": { "type": "mozziflow/string", "color": "unipolar_16" }, "s17": { "type": "mozziflow/string", "color": "unipolar_16" }, "s18": { "type": "mozziflow/string", "color": "unipolar_16" }, "s19": { "type": "mozziflow/string", "color": "unipolar_16" }, "s20": { "type": "mozziflow/string", "color": "unipolar_16" }, "s21": { "type": "mozziflow/string", "color": "unipolar_16" }, "s22": { "type": "mozziflow/string", "color": "unipolar_16" }, "s23": { "type": "mozziflow/string", "color": "unipolar_16" }
    },
    "outlets": { "out": { "type": "mozziflow/string", "color": "unipolar_16" }, "index": { "type": "mozziflow/string", "color": "unipolar_16" } }
}
});

NodeLibrary.push({
    nodetype: 'signal/mozzi_sequencer32',
    nodeclass: "MozziSequencer32",
    description: "32-step sequencer.",
    mozzi: makeSequencer(32).mozzi,
    rpdnode: {
    "title": "Sequencer (32)",
    "inlets": {
        "trig": { "type": "mozziflow/string", "no_text": true, "color": "logic" },
        "steps": { "type": "mozziflow/string", "default": "32", "color": "unipolar_16" },
        "s0": { "type": "mozziflow/string", "color": "unipolar_16" }, "s1": { "type": "mozziflow/string", "color": "unipolar_16" }, "s2": { "type": "mozziflow/string", "color": "unipolar_16" }, "s3": { "type": "mozziflow/string", "color": "unipolar_16" }, "s4": { "type": "mozziflow/string", "color": "unipolar_16" }, "s5": { "type": "mozziflow/string", "color": "unipolar_16" }, "s6": { "type": "mozziflow/string", "color": "unipolar_16" }, "s7": { "type": "mozziflow/string", "color": "unipolar_16" }, "s8": { "type": "mozziflow/string", "color": "unipolar_16" }, "s9": { "type": "mozziflow/string", "color": "unipolar_16" }, "s10": { "type": "mozziflow/string", "color": "unipolar_16" }, "s11": { "type": "mozziflow/string", "color": "unipolar_16" }, "s12": { "type": "mozziflow/string", "color": "unipolar_16" }, "s13": { "type": "mozziflow/string", "color": "unipolar_16" }, "s14": { "type": "mozziflow/string", "color": "unipolar_16" }, "s15": { "type": "mozziflow/string", "color": "unipolar_16" }, "s16": { "type": "mozziflow/string", "color": "unipolar_16" }, "s17": { "type": "mozziflow/string", "color": "unipolar_16" }, "s18": { "type": "mozziflow/string", "color": "unipolar_16" }, "s19": { "type": "mozziflow/string", "color": "unipolar_16" }, "s20": { "type": "mozziflow/string", "color": "unipolar_16" }, "s21": { "type": "mozziflow/string", "color": "unipolar_16" }, "s22": { "type": "mozziflow/string", "color": "unipolar_16" }, "s23": { "type": "mozziflow/string", "color": "unipolar_16" }, "s24": { "type": "mozziflow/string", "color": "unipolar_16" }, "s25": { "type": "mozziflow/string", "color": "unipolar_16" }, "s26": { "type": "mozziflow/string", "color": "unipolar_16" }, "s27": { "type": "mozziflow/string", "color": "unipolar_16" }, "s28": { "type": "mozziflow/string", "color": "unipolar_16" }, "s29": { "type": "mozziflow/string", "color": "unipolar_16" }, "s30": { "type": "mozziflow/string", "color": "unipolar_16" }, "s31": { "type": "mozziflow/string", "color": "unipolar_16" }
    },
    "outlets": { "out": { "type": "mozziflow/string", "color": "unipolar_16" }, "index": { "type": "mozziflow/string", "color": "unipolar_16" } }
}
});

NodeLibrary.push({
    nodetype: 'signal/mozzi_quantizer',
    nodeclass: "MozziQuantizer",
    description: "Chromatic quantizer.",
    mozzi: {
        defaults: {"in":"0"},
        global: function(n,v){ return "int "+v+"_sc[]={0,2,4,5,7,9,11,12};"; },
        audio: function(n,v,i){ return v+"_out="+v+"_sc[(abs((int)"+i.in+")/85)%7]+(((abs((int)"+i.in+")/85)/7)*12)+48;"; },
    },
    rpdnode: {
    "title": "Quantizer",
    "inlets": { "in": { "type": "mozziflow/string", "no_text": true } },
    "outlets": { "out": { "type": "mozziflow/string", "color": "unipolar_8" } }
}
});

NodeLibrary.push({
    nodetype: 'signal/mozzi_sh',
    nodeclass: "MozziSH",
    description: "Sample & Hold unit.",
    mozzi: {
        defaults: {"in":"0","trig":"0"},
        global: function(n,v){ return "int "+v+"_val=0; bool "+v+"_l=0;"; },
        audio: function(n,v,i){ return "if((int)"+i.trig+">0 && !"+v+"_l){ "+v+"_val=(int)"+i.in+"; "+v+"_l=1; } else if((int)"+i.trig+"==0) { "+v+"_l=0; } "+v+"_out="+v+"_val;"; },
    },
    rpdnode: {
    "title": "S&H",
    "inlets": { "in": { "type": "mozziflow/string", "no_text": true }, "trig": { "type": "mozziflow/string", "no_text": true, "color": "logic" } },
    "outlets": { "out": { "type": "mozziflow/string" } }
}
});

NodeLibrary.push({
    nodetype: 'signal/counter',
    nodeclass: "ArduinoCounter",
    description: "Value counter.",
    mozzi: {
        rate: "control",
        defaults: {"up":"0","down":"0"},
        global: function(n,v){ return "int "+v+"_v=0; bool "+v+"_lU=0; bool "+v+"_lD=0;"; },
        control: function(n,v,i){ return "if((int)"+i.up+">0 && !"+v+"_lU){ "+v+"_v++; "+v+"_lU=1; } else if((int)"+i.up+"==0) { "+v+"_lU=0; } if((int)"+i.down+">0 && !"+v+"_lD){ "+v+"_v--; "+v+"_lD=1; } else if((int)"+i.down+"==0) { "+v+"_lD=0; } "+v+"_out="+v+"_v;"; },
    },
    rpdnode: {
    "title": "Counter",
    "inlets": {
        "up": { "type": "mozziflow/string", "no_text": true, "color": "logic" },
        "down": { "type": "mozziflow/string", "no_text": true, "color": "logic" },
        "reset": { "type": "mozziflow/string", "no_text": true, "color": "logic" },
        "min": { "type": "mozziflow/string", "color": "unipolar_16" },
        "max": { "type": "mozziflow/string", "color": "unipolar_16" }
    },
    "outlets": { "out": { "type": "mozziflow/string", "color": "unipolar_16" } }
}
});

NodeLibrary.push({
    nodetype: 'signal/arduino_7seg',
    nodeclass: "Arduino7Seg",
    description: "7-Seg Driver.",
    mozzi: {
        rate: "control",
        defaults: {"val":"0"},
        global: function(n,v){ return "uint8_t "+v+"_o[4]; const uint8_t "+v+"_m[]={0x3F,0x06,0x5B,0x4F,0x66,0x6D,0x7D,0x07,0x7F,0x6F};"; },
        control: function(n,v,i){ return "long "+v+"_t=(long)"+i.val+"; for(int i=0;i<4;i++){ "+v+"_o[i]="+v+"_m["+v+"_t%10]; "+v+"_t/=10; } "+v+"_d0="+v+"_o[0]; "+v+"_d1="+v+"_o[1]; "+v+"_d2="+v+"_o[2]; "+v+"_d3="+v+"_o[3];"; },
    },
    rpdnode: {
    "title": "7-Seg Driver",
    "inlets": { "val": { "type": "mozziflow/string", "no_text": true, "color": "unipolar_16" } },
    "outlets": { "d0": { "type": "mozziflow/string", "color": "logic" }, "d1": { "type": "mozziflow/string", "color": "logic" }, "d2": { "type": "mozziflow/string", "color": "logic" }, "d3": { "type": "mozziflow/string", "color": "logic" } }
}
});

NodeLibrary.push({
    nodetype: 'signal/onehot',
    nodeclass: "ArduinoOneHot",
    description: "One-hot bit encoder.",
    mozzi: {
        rate: "control",
        defaults: {"in":"0"},
        control: function(n,v,i){ return v+"_out = 1 << ((int)"+i.in+" & 31);"; },
    },
    rpdnode: {
    "title": "Index to Bit",
    "inlets": { "in": { "type": "mozziflow/string", "no_text": true, "color": "logic" } },
    "outlets": { "out": { "type": "mozziflow/string", "color": "logic" } }
}
});
