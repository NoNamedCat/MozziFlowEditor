// Mozzi Node Definitions - WAVE CATEGORY
// High-Fidelity Optimized Version 15.0: Inlining & Precision Casting

NodeLibrary.push({
    nodetype: 'wave/mozzi_sin',
    nodeclass: "MozziSin",
    description: "Sine oscillator with Phase Modulation support.",
    mozzi: {
        rate: "audio",
        is_inline: true,
        bipolar: true,
        includes: ["#include <Oscil.h>","#include <tables/sin2048_int8.h>"],
        defaults: {"freq":"440","phase":"0"},
        global: function(n, v, r) { return "Oscil<SIN2048_NUM_CELLS, "+r+"> "+v+"(SIN2048_DATA);"; },
        setup: function(n,v,i,r,s){ if (s.freq) return v+".setFreq((float)"+i.freq+");"; return ""; },
        control: function(n, v, i, r, s) { if (s.freq) return ""; return v+".setFreq((float)"+i.freq+");"; },
        audio: function(n, v, i) { 
            if (i.phase === "0" || i.phase === 0) return v+".next()";
            return v+".phMod((long)"+i.phase+")"; 
        },
    },
    rpdnode: {
    "title": "Sine",
    "inlets": { 
        "freq": { "type": "mozziflow/float_32", "is_control": true }, 
        "phase": { "type": "mozziflow/string", "no_text": true, "color": "bipolar_16" } 
    },
    "outlets": { "out": { "type": "mozziflow/string", "color": "bipolar_8" } }
}
});

NodeLibrary.push({
    nodetype: 'wave/mozzi_saw',
    nodeclass: "MozziSaw",
    description: "Sawtooth oscillator.",
    mozzi: {
        rate: "audio",
        is_inline: true,
        bipolar: true,
        includes: ["#include <Oscil.h>","#include <tables/saw2048_int8.h>"],
        defaults: {"freq":"440"},
        global: function(n, v, r) { return "Oscil<SAW2048_NUM_CELLS, "+r+"> "+v+"(SAW2048_DATA);"; },
        setup: function(n,v,i,r,s){ if (s.freq) return v+".setFreq((float)"+i.freq+");"; return ""; },
        control: function(n, v, i, r, s) { if (s.freq) return ""; return v+".setFreq((float)"+i.freq+");"; },
        audio: function(n, v, i) { return v+".next()"; },
    },
    rpdnode: {
    "title": "Saw",
    "inlets": { "freq": { "type": "mozziflow/float_32", "is_control": true } },
    "outlets": { "out": { "type": "mozziflow/string", "color": "bipolar_8" } }
}
});

NodeLibrary.push({
    nodetype: 'wave/mozzi_tri',
    nodeclass: "MozziTri",
    description: "Triangle oscillator.",
    mozzi: {
        rate: "audio",
        is_inline: true,
        bipolar: true,
        includes: ["#include <Oscil.h>","#include <tables/triangle2048_int8.h>"],
        defaults: {"freq":"440"},
        global: function(n, v, r) { return "Oscil<TRIANGLE2048_NUM_CELLS, "+r+"> "+v+"(TRIANGLE2048_DATA);"; },
        setup: function(n,v,i,r,s){ if (s.freq) return v+".setFreq((float)"+i.freq+");"; return ""; },
        control: function(n, v, i, r, s) { if (s.freq) return ""; return v+".setFreq((float)"+i.freq+");"; },
        audio: function(n, v, i) { return v+".next()"; },
    },
    rpdnode: {
    "title": "Triangle",
    "inlets": { "freq": { "type": "mozziflow/float_32", "is_control": true } },
    "outlets": { "out": { "type": "mozziflow/string", "color": "bipolar_8" } }
}
});

NodeLibrary.push({
    nodetype: 'wave/mozzi_square',
    nodeclass: "MozziSquare",
    description: "Square oscillator.",
    mozzi: {
        rate: "audio",
        is_inline: true,
        bipolar: true,
        includes: ["#include <Oscil.h>","#include <tables/square_no_alias_2048_int8.h>"],
        defaults: {"freq":"440"},
        global: function(n, v, r) { return "Oscil<SQUARE_NO_ALIAS_2048_NUM_CELLS, "+r+"> "+v+"(SQUARE_NO_ALIAS_2048_DATA);"; },
        setup: function(n,v,i,r,s){ if (s.freq) return v+".setFreq((float)"+i.freq+");"; return ""; },
        control: function(n, v, i, r, s) { if (s.freq) return ""; return v+".setFreq((float)"+i.freq+");"; },
        audio: function(n, v, i) { return v+".next()"; },
    },
    rpdnode: {
    "title": "Square",
    "inlets": { "freq": { "type": "mozziflow/float_32", "is_control": true } },
    "outlets": { "out": { "type": "mozziflow/string", "color": "bipolar_8" } }
}
});

NodeLibrary.push({
    nodetype: 'wave/mozzi_noise',
    nodeclass: "MozziNoise",
    description: "High-quality white noise source.",
    mozzi: {
        rate: "audio",
        is_inline: true,
        includes: ["#include <mozzi_rand.h>"],
        setup: function(n,v){ return "randSeed();"; },
        audio: function(n,v){ return "((int8_t)((xorshift96()>>24)-128))"; },
    },
    rpdnode: {
    "title": "Noise",
    "inlets": {},
    "outlets": { "out": { "type": "mozziflow/string", "color": "bipolar_8" } }
}
});

NodeLibrary.push({
    nodetype: 'wave/mozzi_phasor',
    nodeclass: "MozziPhasor",
    description: "High-Res Phasor.",
    mozzi: {
        rate: "audio",
        is_inline: true,
        includes: ["#include <Phasor.h>"],
        defaults: {"freq":"440"},
        global: function(n,v){ return "Phasor<AUDIO_RATE> "+v+";"; },
        setup: function(n,v,i,r,s){ if (s.freq) return v+".setFreq((float)"+i.freq+");"; return ""; },
        control: function(n, v, i, r, s) { if (s.freq) return ""; return v+".setFreq((float)"+i.freq+");"; },
        audio: function(n,v,i){ return v+".next()"; },
    },
    rpdnode: {
    "title": "Phasor",
    "inlets": { "freq": { "type": "mozziflow/float_32", "is_control": true } },
    "outlets": { "out": { "type": "mozziflow/string", "color": "unipolar_16" } }
}
});

NodeLibrary.push({
    nodetype: 'wave/mozzi_sample',
    nodeclass: "MozziSample",
    description: "Plays audio samples from PROGMEM.",
    mozzi: {
        rate: "audio",
        is_inline: true,
        includes: ["#include <Sample.h>","#include <tables/sin2048_int8.h>"],
        defaults: {"freq":"1.0","trig":"0"},
        global: function(n,v){ 
            var tableName = "SIN2048_DATA"; var size = "2048";
            if (n.data && n.data.sampleInfo) {
                var match = (n.data.sampleInfo.cpp || "").match(/int8_t\s+([a-zA-Z0-9_]+)\s*\[\]/);
                tableName = match ? match[1] : (n.data.sampleInfo.name.replace('.h', '').toUpperCase() + "_DATA");
                size = n.data.sampleInfo.data.length;
            }
            return "int " + v + "_last_trig = 0;\nSample<" + size + ", AUDIO_RATE> " + v + "(" + tableName + ");"; 
        },
        setup: function(n,v,i,r,s){ if (s.freq) return v+".setFreq((float)"+i.freq+");"; return ""; },
        control: function(n,v,i,r,s){ 
            var code = "";
            if (!s.freq) code += v + ".setFreq((float)" + i.freq + ");\n\t";
            code += "if((int)" + i.trig + " > 0 && " + v + "_last_trig == 0) " + v + ".start();\n\t" +
                   v + "_last_trig = (int)" + i.trig + ";"; 
            return code;
        },
        audio: function(n,v,i){ return v+".next()"; },
    },
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px"; container.style.textAlign = "center";
            var btn = document.createElement('button');
            btn.innerText = "Load Audio"; btn.className = "mozzi-load-btn";
            var status = document.createElement('div');
            status.style.fontSize = "9px"; status.style.color = "#eee"; status.style.marginTop = "4px";
            var fileIn = document.createElement('input');
            fileIn.type = "file"; fileIn.style.display = "none";
            fileIn.accept = "audio/*";
            btn.onclick = function() { fileIn.click(); };
            container.appendChild(btn); container.appendChild(status); container.appendChild(fileIn);
            bodyElm.appendChild(container);
        }
    },
    rpdnode: {
    "title": "Sample",
    "inlets": { 
        "freq": { "type": "mozziflow/float_32", "is_control": true }, 
        "trig": { "type": "mozziflow/string", "no_text": true, "is_control": true, "color": "logic" } 
    },
    "outlets": { "out": { "type": "mozziflow/string", "color": "bipolar_8" } }
}
});

NodeLibrary.push({
    nodetype: 'wave/mozzi_wavepacket',
    nodeclass: "MozziWavePacket",
    description: "Granular synthesis engine.",
    mozzi: {
        rate: "audio",
        includes: ["#include <WavePacket.h>"],
        defaults: {"freq":"440","fund":"220","bw":"100"},
        global: function(n,v){ return "WavePacket<DOUBLE> "+v+";"; },
        setup: function(n,v,i,r,s){ 
            if (s.fund && s.bw && s.freq) return v+".set((int)"+i.fund+", (int)"+i.bw+", (int)"+i.freq+");";
            return "";
        },
        control: function(n,v,i,r,s){ 
            if (s.fund && s.bw && s.freq) return "";
            return "int "+v+"_f = (int)"+i.fund+"; if("+v+"_f<1) "+v+"_f=1; " + 
                   v+".set("+v+"_f, (int)"+i.bw+", (int)"+i.freq+");"; 
        },
        audio: function(n,v,i){ return v+"_out = "+v+".next();"; },
    },
    rpdnode: {
    "title": "WavePacket",
    "inlets": {
        "freq": { "type": "mozziflow/float_32", "is_control": true },
        "fund": { "type": "mozziflow/string", "is_control": true, "color": "unipolar_16" },
        "bw": { "type": "mozziflow/string", "is_control": true, "color": "unipolar_8" }
    },
    "outlets": { "out": { "type": "mozziflow/string", "color": "bipolar_8" } }
}
});

NodeLibrary.push({
    nodetype: 'wave/mozzi_huffman',
    nodeclass: "MozziHuffman",
    description: "Compressed sample playback.",
    mozzi: {
        rate: "audio",
        includes: ["#include <SampleHuffman.h>"],
        defaults: {"trig":"0"},
        global: function(n,v){ 
            if (n.data && n.data.huffmanInfo) {
                var info = n.data.huffmanInfo;
                return "SampleHuffman " + v + "(" + info.sounddata_name + ", " + info.huffman_name + ", " + info.sounddata_bits + ");";
            }
            return "// Huffman: No data loaded"; 
        },
        audio: function(n,v){ return v+"_out = "+v+".next()"; },
    },
    rpdnode: {
    "title": "Huffman",
    "inlets": { "trig": { "type": "mozziflow/string", "no_text": true, "is_control": true, "color": "logic" } },
    "outlets": { "out": { "type": "mozziflow/string", "color": "bipolar_8" } }
}
});