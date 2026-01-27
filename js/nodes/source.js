// Mozzi Node Definitions - SOURCE (Iron Integrity v111.18)
NodeLibrary.push({
    nodetype: 'wave/mozzi_sin',
    nodeclass: "Oscil",
    mozzi: {
        rate: "audio",
        includes: ["#include <Oscil.h>","#include <tables/sin2048_int8.h>"],
        defaults: { "freq": "440", "phase": "0" },
        global: function(n, v, r) { return "Oscil<SIN2048_NUM_CELLS, "+r+"> "+v+"(SIN2048_DATA);"; },
        control: function(n,v,i){ return v+".setFreq((float)(long)"+i.freq+");"; },
        audio: function(n, v, i) { return (i.phase && i.phase != "0") ? v+".phMod((long)"+i.phase+")" : v+".next()"; }
    },
    rpdnode: { "title": "Sine", "inlets": { "freq": { "type": "mozziflow/any", "is_control": true, "color": "float" }, "phase": { "type": "mozziflow/any", "color": "mod" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "audio" } } }
});

NodeLibrary.push({
    nodetype: 'wave/mozzi_saw',
    nodeclass: "Oscil",
    mozzi: {
        rate: "audio",
        includes: ["#include <Oscil.h>","#include <tables/saw2048_int8.h>"],
        defaults: { "freq": "440" },
        global: function(n, v, r) { return "Oscil<SAW2048_NUM_CELLS, "+r+"> "+v+"(SAW2048_DATA);"; },
        control: function(n,v,i){ return v+".setFreq((float)(long)"+i.freq+");"; },
        audio: function(n, v, i) { return v+".next()"; }
    },
    rpdnode: { "title": "Saw", "inlets": { "freq": { "type": "mozziflow/any", "is_control": true, "color": "float" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "audio" } } }
});

NodeLibrary.push({
    nodetype: 'wave/mozzi_tri',
    nodeclass: "Oscil",
    mozzi: {
        rate: "audio",
        includes: ["#include <Oscil.h>","#include <tables/triangle2048_int8.h>"],
        defaults: { "freq": "440" },
        global: function(n, v, r) { return "Oscil<TRIANGLE2048_NUM_CELLS, "+r+"> "+v+"(TRIANGLE2048_DATA);"; },
        control: function(n,v,i){ return v+".setFreq((float)(long)"+i.freq+");"; },
        audio: function(n, v, i) { return v+".next()"; }
    },
    rpdnode: { "title": "Triangle", "inlets": { "freq": { "type": "mozziflow/any", "is_control": true, "color": "float" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "audio" } } }
});

NodeLibrary.push({
    nodetype: 'wave/mozzi_square',
    nodeclass: "Oscil",
    mozzi: {
        rate: "audio",
        includes: ["#include <Oscil.h>","#include <tables/square_no_alias_2048_int8.h>"],
        defaults: { "freq": "440" },
        global: function(n, v, r) { return "Oscil<SQUARE_NO_ALIAS_2048_NUM_CELLS, "+r+"> "+v+"(SQUARE_NO_ALIAS_2048_DATA);"; },
        control: function(n,v,i){ return v+".setFreq((float)(long)"+i.freq+");"; },
        audio: function(n, v, i) { return v+".next()"; }
    },
    rpdnode: { "title": "Square", "inlets": { "freq": { "type": "mozziflow/any", "is_control": true, "color": "float" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "audio" } } }
});

NodeLibrary.push({
    nodetype: 'wave/mozzi_phasor',
    nodeclass: "Phasor",
    mozzi: {
        rate: "audio",
        includes: ["#include <Phasor.h>"],
        defaults: { "freq": "440" },
        global: function(n,v,r){ return "Phasor<"+r+"> "+v+";"; },
        control: function(n,v,i){ return v+".setFreq((float)(long)"+i.freq+");"; },
        audio: function(n,v,i){ return v+".next()"; }
    },
    rpdnode: { "title": "Phasor", "inlets": { "freq": { "type": "mozziflow/any", "is_control": true, "color": "float" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "freq" } } }
});

NodeLibrary.push({
    nodetype: 'wave/mozzi_noise',
    nodeclass: "Noise",
    mozzi: { rate: "audio", is_inline: true, includes: ["#include <mozzi_rand.h>"], audio: function(n,v,i){ return "rand((int)256) - 128"; } },
    rpdnode: { "title": "Noise", "inlets": {}, "outlets": { "out": { "type": "mozziflow/any", "color": "audio" } } }
});

NodeLibrary.push({
    nodetype: 'wave/mozzi_pdresonant',
    nodeclass: "PDResonant",
    mozzi: {
        rate: "audio",
        includes: ["#include <PDResonant.h>"],
        defaults: { "freq": "440", "res": "128" },
        global: function(n,v){ return "PDResonant " + v + ";"; },
        control: function(n,v,i){ return v + ".update();"; },
        audio: function(n,v,i){ return v + ".next()"; },
    },
    rpdnode: { "title": "PD Resonant", inlets: { "freq": { "type": "mozziflow/any", "is_control": true, "color": "float" }, "res": { "type": "mozziflow/any", "is_control": true, "color": "control" } }, outlets: { "out": { "type": "mozziflow/any", "color": "audio" } } }
});

NodeLibrary.push({
    nodetype: 'wave/mozzi_wavepacket',
    nodeclass: "WavePacket",
    mozzi: {
        rate: "audio",
        includes: ["#include <WavePacket.h>"],
        global: function(n,v){ return "WavePacket<DOUBLE> "+v+";"; },
        setup: function(n,v,i){ return v+".set(100, 50, 100);"; },
        control: function(n,v,i){ return v+".set((int)(long)"+i.fund+", (int)(long)"+i.bw+", (int)(long)"+i.res+");"; },
        audio: function(n,v,i){ return v+".next()"; }
    },
    rpdnode: { "title": "WavePacket", "inlets": { "fund": { "type": "mozziflow/any", "color": "freq" }, "bw": { "type": "mozziflow/any", "color": "control" }, "res": { "type": "mozziflow/any", "color": "control" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "audio" } } }
});

NodeLibrary.push({
    nodetype: 'wave/mozzi_sample',
    nodeclass: "Sample",
    renderer: {
        'html': function(bodyElm, node) {
            if (!node._ui_sample) {
                var fileInp = document.createElement('input');
                fileInp.type = 'file'; fileInp.style.fontSize = '9px'; fileInp.style.width = '100%';
                fileInp.onchange = function(e) {
                    if (e.target.files.length > 0) {
                        MozziSampleConverter.processFile(e.target.files[0], function(res) {
                            if (res) {
                                if(!node.data) node.data = {};
                                node.data.sample_table = res.tableString;
                                node.data.sample_size = res.size;
                                node.data.sample_name = e.target.files[0].name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
                                var infoEl = bodyElm.querySelector('.sample-info');
                                if (infoEl) infoEl.innerText = "Loaded: " + res.info;
                            }
                        });
                    }
                };
                var info = document.createElement('div');
                info.className = 'sample-info'; info.style.fontSize = '8px'; info.style.color = '#0f9';
                info.innerText = (node.data && node.data.sample_name) ? "Loaded: " + node.data.sample_name : "No sample loaded";
                bodyElm.appendChild(fileInp); bodyElm.appendChild(info);
                node._ui_sample = true;
            }
        }
    },
    mozzi: {
        rate: "audio",
        includes: ["#include <Sample.h>"],
        global: function(n,v,r){
            if (!n.data || !n.data.sample_table) return "// No sample loaded for " + v;
            return "const int8_t " + n.data.sample_name + "_data[] PROGMEM = {" + n.data.sample_table + "};\nSample<" + n.data.sample_size + ", " + r + "> " + v + "(" + n.data.sample_name + "_data);";
        },
        control: function(n,v,i){ return "if((long)"+i.trig+">0){ "+v+".start(); }"; },
        audio: function(n,v,i){ return v + ".next()"; }
    },
    rpdnode: { "title": "Sample", "inlets": { "trig": { "type": "mozziflow/any", "color": "logic" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "audio" } } }
});

NodeLibrary.push({
    nodetype: 'lfo/mozzi_lfo_sin',
    nodeclass: "Oscil",
    mozzi: {
        rate: "control",
        includes: ["#include <Oscil.h>","#include <tables/sin2048_int8.h>"],
        defaults: { "freq": "1.0" },
        global: function(n, v, r) { return "Oscil<SIN2048_NUM_CELLS, "+r+"> "+v+"(SIN2048_DATA);"; },
        control: function(n,v,i){ return v+".setFreq((float)(long)"+i.freq+");\n" + v + ".next()"; }
    },
    rpdnode: { "title": "Sine LFO", "inlets": { "freq": { "type": "mozziflow/any", "is_control": true, "color": "float" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "control" } } }
});

NodeLibrary.push({
    nodetype: 'lfo/mozzi_pulse',
    nodeclass: "Metronome",
    mozzi: {
        rate: "control",
        includes: ["#include <Metronome.h>"],
        defaults: { "bpm": "120" },
        global: function(n,v){ return "Metronome " + v + "; bool " + v + "_st = 0;"; },
        setup: function(n,v,i){ return v + ".start();"; },
        control: function(n,v,i){ return v+".setBPM((float)(long)"+i.bpm+");\nif("+v+".ready()){ "+v+"_st = !"+v+"_st; }\n" + v + "_st ? 255 : 0"; }
    },
    rpdnode: { "title": "Pulse LFO", "inlets": { "bpm": { "type": "mozziflow/any", "color": "float" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "logic" } } }
});