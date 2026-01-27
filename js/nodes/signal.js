// Mozzi Node Definitions - SIGNAL (Iron Integrity v111.16)
// TIME + CONTROL + QUANTIZER + 7SEG + ROUTERS + PORTAMENTO + LINE + SEQ16

NodeLibrary.push({
    nodetype: 'signal/mozzi_adsr',
    nodeclass: "MozziADSR",
    mozzi: {
        rate: "control",
        includes: ["#include <ADSR.h>"],
        defaults: { "att": "50", "dec": "100", "lev": "255", "sus": "128", "rel": "200" },
        global: function(n,v){ return "ADSR<MOZZI_CONTROL_RATE, MOZZI_AUDIO_RATE> "+v+"; bool "+v+"_l=0;"; },
        setup: function(n,v,i){ return v+".setADLevels((uint8_t)"+i.lev+", (uint8_t)"+i.sus+"); " + v+".setTimes((unsigned int)"+i.att+", (unsigned int)"+i.dec+", 65535, (unsigned int)"+i.rel+");"; },
        control: function(n,v,i){ 
            return "bool "+v+"_tr=(int)"+i.trig+">0;\nif("+v+"_tr && !"+v+"_l){ "+v+".noteOn(); } else if(!"+v+"_tr && "+v+"_l){ "+v+".noteOff(); }\n"+v+"_l="+v+"_tr;\n"+v+".update();\n" + v + ".next()"; 
        }
    },
    rpdnode: { "title": "ADSR", "inlets": { "trig": { "type": "mozziflow/any", "color": "logic" }, "att": { "type": "mozziflow/any", "color": "freq" }, "lev": { "type": "mozziflow/any", "color": "control" }, "dec": { "type": "mozziflow/any", "color": "freq" }, "sus": { "type": "mozziflow/any", "color": "control" }, "rel": { "type": "mozziflow/any", "color": "freq" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "control" } } }
});

NodeLibrary.push({
    nodetype: 'signal/mozzi_ead',
    nodeclass: "MozziEad",
    mozzi: {
        rate: "audio",
        includes: ["#include <Ead.h>"],
        defaults: { "att": "20", "dec": "200" },
        global: function(n,v){ return "Ead "+v+"(MOZZI_AUDIO_RATE);"; },
        control: function(n,v,i){ return "if((int)"+i.trig+">0){ "+v+".start((unsigned int)"+i.att+", (unsigned int)"+i.dec+"); }"; },
        audio: function(n,v,i){ return v+".next()"; }
    },
    rpdnode: { "title": "Ead Env", "inlets": { "trig": { "type": "mozziflow/any", "color": "logic" }, "att": { "type": "mozziflow/any", "color": "freq" }, "dec": { "type": "mozziflow/any", "color": "freq" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "control" } } }
});

NodeLibrary.push({
    nodetype: 'signal/mozzi_metronome',
    nodeclass: "MozziMetronome",
    mozzi: {
        rate: "control",
        includes: ["#include <Metronome.h>"],
        defaults: { "bpm": "120" },
        global: function(n,v){ return "Metronome " + v + "; float " + v + "_lastbpm = 0;"; },
        setup: function(n,v,i){ return v + ".start();"; },
        control: function(n,v,i){ 
            return "if(" + v + "_lastbpm != (float)" + i.bpm + ") { " + v + ".setBPM((float)" + i.bpm + "); " + v + "_lastbpm = (float)" + i.bpm + ";} \n" + v + ".ready() ? 255 : 0"; 
        }
    },
    rpdnode: { "title": "Metronome", "inlets": { "bpm": { "type": "mozziflow/any", "color": "float" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "logic" } } }
});

NodeLibrary.push({
    nodetype: 'signal/mozzi_sequencer',
    nodeclass: "MozziSequencer",
    mozzi: {
        rate: "control",
        defaults: { "trig":"0", "s0":"36", "s1":"48", "s2":"36", "s3":"48", "s4":"36", "s5":"48", "s6":"36", "s7":"48" },
        global: function(n,v){ return "byte "+v+"_i=0; bool "+v+"_l=0;"; },
        control: function(n,v,i){ 
            var triggerLogic = "if((int)"+i.trig+">0 && !"+v+"_l){ "+v+"_i++; if("+v+"_i >= 8) "+v+"_i=0; "+v+"_l=1; } else if((int)"+i.trig+"==0) { "+v+"_l=0; }\n";
            var arrayLogic = "int " + v + "_arr[8] = {"+i.s0+","+i.s1+","+i.s2+","+i.s3+","+i.s4+","+i.s5+","+i.s6+","+i.s7+"};\n";
            return triggerLogic + arrayLogic + "node_" + n.id + "_index = " + v + "_i;\n" + v + "_arr["+v+"_i]"; 
        }
    },
    rpdnode: { "title": "Sequencer (8)", "inlets": { "trig": { "type": "mozziflow/any", "color": "logic" }, "s0": { "type": "mozziflow/any", "color": "control" }, "s1": { "type": "mozziflow/any", "color": "control" }, "s2": { "type": "mozziflow/any", "color": "control" }, "s3": { "type": "mozziflow/any", "color": "control" }, "s4": { "type": "mozziflow/any", "color": "control" }, "s5": { "type": "mozziflow/any", "color": "control" }, "s6": { "type": "mozziflow/any", "color": "control" }, "s7": { "type": "mozziflow/any", "color": "control" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "control" }, "index": { "type": "mozziflow/any", "color": "control" } } }
});

NodeLibrary.push({
    nodetype: 'signal/mozzi_sequencer16',
    nodeclass: "MozziSequencer16",
    mozzi: {
        rate: "control",
        global: function(n,v){ return "byte "+v+"_i=0; bool "+v+"_l=0;"; },
        control: function(n,v,i){ 
            var triggerLogic = "if((int)"+i.trig+">0 && !"+v+"_l){ "+v+"_i++; if("+v+"_i >= 16) "+v+"_i=0; "+v+"_l=1; } else if((int)"+i.trig+"==0) { "+v+"_l=0; }\n";
            var s = []; for(var k=0; k<16; k++) s.push(i["s"+k] || "0");
            var arrayLogic = "int " + v + "_arr[16] = {" + s.join(',') + "};\n";
            return triggerLogic + arrayLogic + "node_" + n.id + "_index = " + v + "_i;\n" + v + "_arr["+v+"_i]"; 
        }
    },
    rpdnode: { 
        "title": "Sequencer (16)", 
        "inlets": (function(){ 
            var ins = { "trig": { "type": "mozziflow/any", "color": "logic" } };
            for(var k=0; k<16; k++) ins["s"+k] = { "type": "mozziflow/any", "color": "control", "label": "St "+(k+1) };
            return ins;
        })(),
        "outlets": { "out": { "type": "mozziflow/any", "color": "control" }, "index": { "type": "mozziflow/any", "color": "control" } } 
    }
});

NodeLibrary.push({
    nodetype: 'signal/mozzi_sh',
    nodeclass: "MozziSH",
    mozzi: {
        rate: "audio",
        is_inline: true,
        global: function(n,v){ return "int " + v + "_val = 0; bool " + v + "_l = 0;"; },
        audio: function(n,v,i){ 
            return "if((int)" + i.trig + " > 0 && !" + v + "_l){ " + v + "_val = (int)" + i.in + "; " + v + "_l=1; } else if((int)" + i.trig + "==0){ " + v + "_l=0; }\n" + v + "_val"; 
        },
    },
    rpdnode: { "title": "S&H", "inlets": { "in": { "type": "mozziflow/any", "color": "audio" }, "trig": { "type": "mozziflow/any", "color": "logic" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "audio" } } }
});

NodeLibrary.push({
    nodetype: 'signal/counter',
    nodeclass: "MozziCounter",
    mozzi: {
        rate: "control",
        defaults: { "up":"0", "down":"0", "max":"9" },
        global: function(n,v){ return "int "+v+"_c = 0; bool "+v+"_ul = 0; bool "+v+"_dl = 0;"; },
        control: function(n,v,i){ 
            return "if((int)"+i.up+">0 && !"+v+"_ul){ "+v+"_c++; "+v+"_ul=1; } else if((int)"+i.up+"==0){ "+v+"_ul=0; }\n" +
                   "if((int)"+i.down+">0 && !"+v+"_dl){ "+v+"_c--; "+v+"_dl=1; } else if((int)"+i.down+"==0){ "+v+"_dl=0; }\n" +
                   "if("+v+"_c > (int)"+i.max+") "+v+"_c = 0; if("+v+"_c < 0) "+v+"_c = (int)"+i.max+";\n"+v+"_c"; 
        }
    },
    rpdnode: { "title": "Counter", "inlets": { "up": { "type": "mozziflow/any", "color": "logic" }, "down": { "type": "mozziflow/any", "color": "logic" }, "max": { "type": "mozziflow/any", "color": "freq" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "control" } } }
});

[2, 4, 8].forEach(num => {
    var outlets = {};
    for(var k=0; k<num; k++) outlets["out"+k] = { "type": "mozziflow/any", "color": "audio" };
    NodeLibrary.push({
        nodetype: 'signal/router' + num,
        nodeclass: "Router" + num,
        mozzi: {
            rate: "control", is_inline: true,
            control: function(n,v,i){ 
                var code = "";
                for(var k=0; k<num; k++) { code += "node_" + n.id + "_out" + k + " = ( (int)" + i.idx + " == " + k + " ) ? (int)" + i.in + " : 0;\n        "; } 
                return code.trim();
            }
        },
        rpdnode: { "title": "Router (" + num + ")", "inlets": { "in": { "type": "mozziflow/any", "color": "audio" }, "idx": { "type": "mozziflow/any", "color": "control", "label": "Index" } }, "outlets": outlets }
    });
});

NodeLibrary.push({
    nodetype: 'signal/arduino_7seg',
    nodeclass: "SevenSeg",
    mozzi: { rate: "control", is_inline: true, control: function(n,v,i) { return "((int[]){0x3F,0x06,0x5B,0x4F,0x66,0x6D,0x7D,0x07,0x7F,0x6F})[(int)"+i.val+" % 10]"; } },
    rpdnode: { "title": "7-Seg Driver", "inlets": { "val": { "type": "mozziflow/any", "color": "control" } }, "outlets": { "d0": { "type": "mozziflow/any", "color": "control" } } }
});

NodeLibrary.push({
    nodetype: 'signal/mozzi_portamento',
    nodeclass: "MozziPortamento",
    mozzi: {
        rate: "control",
        includes: ["#include <Portamento.h>"],
        global: function(n,v,r){ return "Portamento<"+r+"> "+v+";"; },
        setup: function(n,v,i){ return v+".setTime(200);"; },
        control: function(n,v,i){ return "if((int)"+i.trig+">0){ "+v+".start((uint8_t)"+i.note+"); }\n"+v+".next()"; }
    },
    rpdnode: { "title": "Portamento", "inlets": { "note": { "type": "mozziflow/any", "color": "control" }, "trig": { "type": "mozziflow/any", "color": "logic" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "control" } } }
});

NodeLibrary.push({
    nodetype: 'signal/mozzi_line',
    nodeclass: "MozziLine",
    mozzi: {
        rate: "control",
        includes: ["#include <Line.h>"],
        global: function(n,v){ return "Line<int> "+v+";"; },
        control: function(n,v,i){ return "if((int)"+i.trig+">0){ "+v+".set((int)"+i.start+", (int)"+i.end+", (int)"+i.steps+"); }\n"+v+".next()"; }
    },
    rpdnode: { "title": "Line", "inlets": { "start": { "type": "mozziflow/any", "color": "control" }, "end": { "type": "mozziflow/any", "color": "control" }, "steps": { "type": "mozziflow/any", "color": "freq" }, "trig": { "type": "mozziflow/any", "color": "logic" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "control" } } }
});