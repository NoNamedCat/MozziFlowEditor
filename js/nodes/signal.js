// Mozzi Node Definitions - SIGNAL (Iron Integrity v111.35)
// TIME + CONTROL + QUANTIZER + 7SEG + ROUTERS + PORTAMENTO + LINE + SEQ16

NodeLibrary.push({
    nodetype: 'filter/mozzi_smooth',
    nodeclass: "Smooth",
    mozzi: {
        rate: "control",
        includes: ["#include <Smooth.h>"],
        defaults: { "smooth": "0.95" },
        global: function(n,v){ return "Smooth<long> "+v+"; float "+v+"_last=0;"; },
        setup: function(n,v,i){ return !isVar(i.smooth) ? v+".setSmoothness("+i.smooth+"f);" : ""; },
        control: function(n,v,i){ 
            var code = "";
            if(isVar(i.smooth)) {
                code += "if((float)"+i.smooth+" != "+v+"_last) { "+v+".setSmoothness((float)"+i.smooth+"); "+v+"_last=(float)"+i.smooth+";} \n        ";
            }
            return "node_" + n.id + "_out = " + v + ".next((long)"+i.in+")"; 
        }
    },
    rpdnode: { "title": "Smooth", "inlets": { "in": { "type": "mozziflow/long" }, "smooth": { "type": "mozziflow/float", "label": "smooth" } }, "outlets": { "out": { "type": "mozziflow/long" } } }
});

NodeLibrary.push({
    nodetype: 'signal/mozzi_adsr',
    nodeclass: "MozziADSR",
    mozzi: {
        rate: "control",
        includes: ["#include <ADSR.h>"],
        defaults: { "att": "50", "dec": "100", "lev": "255", "sus": "128", "rel": "200" },
        global: function(n,v){ return "ADSR<MOZZI_CONTROL_RATE, MOZZI_CONTROL_RATE, uint16_t> "+v+"; bool "+v+"_l=0;"; },
        setup: function(n,v,i){ 
            return v+".setADLevels((uint8_t)(long)"+i.lev+", (uint8_t)(long)"+i.sus+"); " + v+".setTimes((unsigned int)(long)"+i.att+", (unsigned int)(long)"+i.dec+", 65535, (unsigned int)(long)"+i.rel+");"; 
        },
        control: function(n,v,i){ 
            return "bool "+v+"_tr=(long)"+i.trig+">0;\nif("+v+"_tr && !"+v+"_l){ "+v+".noteOn(); } else if(!"+v+"_tr && "+v+"_l){ "+v+".noteOff(); }\n"+v+"_l="+v+"_tr;\n"+v+".update();\n" + "node_" + n.id + "_out = (long)"+v + ".next()"; 
        }
    },
    rpdnode: { "title": "ADSR", "inlets": { "trig": { "type": "mozziflow/bool" }, "att": { "type": "mozziflow/uint16", "label": "att" }, "lev": { "type": "mozziflow/uint8", "label": "lev" }, "dec": { "type": "mozziflow/uint16", "label": "dec" }, "sus": { "type": "mozziflow/uint8", "label": "sus" }, "rel": { "type": "mozziflow/uint16", "label": "rel" } }, "outlets": { "out": { "type": "mozziflow/long" } } }
});

NodeLibrary.push({
    nodetype: 'signal/mozzi_ead',
    nodeclass: "MozziEad",
    mozzi: {
        rate: "audio",
        includes: ["#include <Ead.h>"],
        defaults: { "att": "20", "dec": "200" },
        global: function(n,v,r){ return "Ead "+v+"("+r+"); bool "+v+"_last = 0;"; },
        control: function(n,v,i){ 
            return "bool "+v+"_trig = (long)"+i.trig+">0;\n" +
                   "if("+v+"_trig && !"+v+"_last){ "+v+".start((unsigned int)(long)"+i.att+", (unsigned int)(long)"+i.dec+"); }\n" +
                   v+"_last = "+v+"_trig;\n" +
                   "node_" + n.id + "_out = (long)" + v + ".next()";
        },
        audio: function(n,v,i){ 
            return "bool "+v+"_trig = (long)"+i.trig+">0;\n" +
                   "if("+v+"_trig && !"+v+"_last){ "+v+".start((unsigned int)(long)"+i.att+", (unsigned int)(long)"+i.dec+"); }\n" +
                   v+"_last = "+v+"_trig;\n" +
                   "node_" + n.id + "_out = (long)" + v + ".next()";
        }
    },
    rpdnode: { "title": "Ead Env", "inlets": { "trig": { "type": "mozziflow/bool" }, "att": { "type": "mozziflow/uint16", "label": "att" }, "dec": { "type": "mozziflow/uint16", "label": "dec" } }, "outlets": { "out": { "type": "mozziflow/long" } } }
});

NodeLibrary.push({
    nodetype: 'signal/mozzi_autorange',
    nodeclass: "MozziAutoRange",
    mozzi: {
        rate: "audio",
        includes: ["#include <AutoRange.h>"],
        global: function(n,v){ return "AutoRange<long> "+v+"(-128, 127);"; },
        audio: function(n,v,i){ return "node_" + n.id + "_out = " + v + ".next((long)"+i.in+")"; }
    },
    rpdnode: { "title": "Auto Normalizer", "inlets": { "in": { "type": "mozziflow/any", "color": "fix32", "label": "val" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "fix32" } } }
});

NodeLibrary.push({
    nodetype: 'signal/mozzi_sh',
    nodeclass: "MozziSH",
    mozzi: {
        rate: "audio",
        is_inline: true,
        global: function(n,v){ return "long " + v + "_val = 0; bool " + v + "_l = 0;"; },
        audio: function(n,v,i){ 
            return "if((long)" + i.trig + " > 0 && !" + v + "_l){ " + v + "_val = (long)" + i.in + "; " + v + "_l=1; } else if((long)" + i.trig + "==0){ " + v + "_l=0; }\n" + "node_" + n.id + "_out = " + v + "_val"; 
        },
    },
    rpdnode: { "title": "S&H", "inlets": { "in": { "type": "mozziflow/long" }, "trig": { "type": "mozziflow/bool" } }, "outlets": { "out": { "type": "mozziflow/long" } } }
});

NodeLibrary.push({
    nodetype: 'signal/mozzi_line',
    nodeclass: "MozziLine",
    mozzi: {
        rate: "control",
        includes: ["#include <Line.h>"],
        global: function(n,v){ return "Line<long> "+v+";"; },
        control: function(n,v,i){ return "if((long)"+i.trig+">0){ "+v+".set((long)"+i.start+", (long)"+i.end+", (uint32_t)(long)"+i.steps+"); }\n"+"node_" + n.id + "_out = " + v + ".next()"; }
    },
    rpdnode: { "title": "Line", "inlets": { "start": { "type": "mozziflow/long" }, "end": { "type": "mozziflow/long" }, "steps": { "type": "mozziflow/long", "label": "steps" }, "trig": { "type": "mozziflow/bool" } }, "outlets": { "out": { "type": "mozziflow/long" } } }
});

NodeLibrary.push({
    nodetype: 'signal/mozzi_portamento',
    nodeclass: "MozziPortamento",
    mozzi: {
        rate: "control",
        includes: ["#include <Portamento.h>"],
        global: function(n,v,r){ return "Portamento<"+r+"> "+v+";"; },
        setup: function(n,v,i){ return v+".setTime(200);"; },
        control: function(n,v,i){ return "if((long)"+i.trig+">0){ "+v+".start((uint8_t)(long)"+i.note+"); }\n"+"node_" + n.id + "_out = (long)"+v+".next().asRaw()"; }
    },
    rpdnode: { "title": "Portamento", "inlets": { "note": { "type": "mozziflow/any", "color": "control", "label": "note" }, "trig": { "type": "mozziflow/any", "color": "logic" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "fix32" } } }
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
            return "if(" + v + "_lastbpm != (float)(long)" + i.bpm + ") { " + v + ".setBPM((float)(long)" + i.bpm + "); " + v + "_lastbpm = (float)(long)" + i.bpm + ";} \n" + "node_" + n.id + "_out = " + v + ".ready() ? 255 : 0"; 
        }
    },
    rpdnode: { "title": "Metronome", "inlets": { "bpm": { "type": "mozziflow/float", "label": "bpm" } }, "outlets": { "out": { "type": "mozziflow/bool" } } }
});

NodeLibrary.push({
    nodetype: 'signal/mozzi_sequencer',
    nodeclass: "MozziSequencer",
    mozzi: {
        rate: "control",
        defaults: { "trig":"0", "s0":"36", "s1":"48", "s2":"36", "s3":"39", "s4":"41", "s5":"36", "s6":"46", "s7":"43" },
        global: function(n,v){ return "byte "+v+"_i=0; bool "+v+"_l=0;"; },
        control: function(n,v,i){ 
            var triggerLogic = "if((long)"+i.trig+">0 && !"+v+"_l){ "+v+"_i++; if("+v+"_i >= 8) "+v+"_i=0; "+v+"_l=1; } else if((long)"+i.trig+"==0) { "+v+"_l=0; }\n        ";
            var s = []; for(var k=0; k<8; k++) s.push("(int)(long)"+(i["s"+k] || "0"));
            var arrayLogic = "int " + v + "_arr[8] = {" + s.join(',') + "};\n        ";
            return triggerLogic + arrayLogic + "node_" + n.id + "_index = " + v + "_i;\n        node_" + n.id + "_out = " + v + "_arr["+v+"_i]"; 
        }
    },
    rpdnode: { "title": "Sequencer (8)", "inlets": { "trig": { "type": "mozziflow/bool" }, "s0": { "type": "mozziflow/long" }, "s1": { "type": "mozziflow/long" }, "s2": { "type": "mozziflow/long" }, "s3": { "type": "mozziflow/long" }, "s4": { "type": "mozziflow/long" }, "s5": { "type": "mozziflow/long" }, "s6": { "type": "mozziflow/long" }, "s7": { "type": "mozziflow/long" } }, "outlets": { "out": { "type": "mozziflow/long" }, "index": { "type": "mozziflow/long" } } }
});

NodeLibrary.push({
    nodetype: 'signal/mozzi_sequencer16',
    nodeclass: "MozziSequencer16",
    mozzi: {
        rate: "control",
        global: function(n,v){ return "byte "+v+"_i=0; bool "+v+"_l=0;"; },
        control: function(n,v,i){ 
            var triggerLogic = "if((long)"+i.trig+">0 && !"+v+"_l){ "+v+"_i++; if("+v+"_i >= 16) "+v+"_i=0; "+v+"_l=1; } else if((long)"+i.trig+"==0) { "+v+"_l=0; }\n        ";
            var s = []; for(var k=0; k<16; k++) s.push("(int)(long)"+(i["s"+k] || "0"));
            var arrayLogic = "int " + v + "_arr[16] = {" + s.join(',') + "};\n        ";
            return triggerLogic + arrayLogic + "node_" + n.id + "_index = " + v + "_i;\n        node_" + n.id + "_out = " + v + "_arr["+v+"_i]"; 
        }
    },
    rpdnode: { 
        "title": "Sequencer (16)", 
        "inlets": (function(){ 
            var ins = { "trig": { "type": "mozziflow/bool" } };
            for(var k=0; k<16; k++) ins["s"+k] = { "type": "mozziflow/long" };
            return ins;
        })(),
        "outlets": { "out": { "type": "mozziflow/long" }, "index": { "type": "mozziflow/long" } } 
    }
});

NodeLibrary.push({
    nodetype: 'signal/counter',
    nodeclass: "MozziCounter",
    mozzi: {
        rate: "control",
        defaults: { "up":"0", "down":"0", "max":"9" },
        global: function(n,v){ return "int "+v+"_c = 0; bool "+v+"_ul = 0; bool "+v+"_dl = 0;"; },
        control: function(n,v,i){ 
            return "if((long)"+i.up+">0 && !"+v+"_ul){ "+v+"_c++; "+v+"_ul=1; } else if((long)"+i.up+"==0){ "+v+"_ul=0; }\n        " +
                   "if((long)"+i.down+">0 && !"+v+"_dl){ "+v+"_c--; "+v+"_dl=1; } else if((long)"+i.down+"==0){ "+v+"_dl=0; }\n        " +
                   "if("+v+"_c > (long)"+i.max+") "+v+"_c = 0; if("+v+"_c < 0) "+v+"_c = (long)"+i.max+";\n        " + "node_" + n.id + "_out = " + v + "_c"; 
        }
    },
    rpdnode: { "title": "Counter", "inlets": { "up": { "type": "mozziflow/bool" }, "down": { "type": "mozziflow/bool" }, "max": { "type": "mozziflow/long", "label": "max" } }, "outlets": { "out": { "type": "mozziflow/long" } } }
});

[2, 4, 8].forEach(num => {
    var outlets = {};
    for(var k=0; k<num; k++) outlets["out"+k] = { "type": "mozziflow/long" };
    NodeLibrary.push({
        nodetype: 'signal/router' + num,
        nodeclass: "Router" + num,
        mozzi: {
            rate: "control", is_inline: true,
            control: function(n,v,i){ 
                var code = "";
                for(var k=0; k<num; k++) { code += "node_" + n.id + "_out" + k + " = ( (long)" + i.idx + " == " + k + " ) ? (long)" + i.in + " : 0;\n        "; } 
                return code.trim();
            }
        },
        rpdnode: { "title": "Router (" + num + ")", "inlets": { "in": { "type": "mozziflow/long" }, "idx": { "type": "mozziflow/long", "label": "idx" } }, "outlets": outlets }
    });
});

NodeLibrary.push({
    nodetype: 'signal/arduino_7seg',
    nodeclass: "SevenSeg",
    mozzi: { rate: "control", is_inline: true, control: function(n,v,i) { return "node_" + n.id + "_out = ((int[]){0x3F,0x06,0x5B,0x4F,0x66,0x6D,0x7D,0x07,0x7F,0x6F})[(int)(long)"+i.val+" % 10]"; } },
    rpdnode: { "title": "7-Seg Driver", "inlets": { "val": { "type": "mozziflow/long", "label": "val" } }, "outlets": { "out": { "type": "mozziflow/uint8" } } }
});
