// Mozzi Node Definitions - MODIFIER (Iron Integrity v111.36)
// FILTER + GAIN + EFFECTS (Technical Type Colors)

NodeLibrary.push({
    nodetype: 'filter/mozzi_lpf',
    nodeclass: "MozziLPF",
    mozzi: {
        rate: "audio",
        includes: ["#include <ResonantFilter.h>"],
        defaults: { "cutoff": "12000", "res": "0" },
        global: function(n,v){ return "LowPassFilter16 "+v+"; uint16_t last_f_"+n.id+"=0; uint16_t last_r_"+n.id+"=0;"; },
        control: function(n,v,i){ 
            return "if(last_f_"+n.id+" != (uint16_t)(long)"+i.cutoff+" || last_r_"+n.id+" != (uint16_t)(long)"+i.res+"){\n " + 
                   v+".setCutoffFreqAndResonance((uint16_t)(long)"+i.cutoff+", (uint16_t)(long)"+i.res+"); " + 
                   "last_f_"+n.id+"=(uint16_t)(long)"+i.cutoff+"; last_r_"+n.id+"=(uint16_t)(long)"+i.res+"; }"; 
        },
        audio: function(n,v,i){ return "node_" + n.id + "_out = " + v + ".next((int)(long)"+i.in+")"; }
    },
    rpdnode: { "title": "LowPass", "inlets": { "in": { "type": "mozziflow/int8" }, "cutoff": { "type": "mozziflow/uint16", "is_control": true, "label": "cutoff" }, "res": { "type": "mozziflow/uint16", "is_control": true, "label": "res" } }, "outlets": { "out": { "type": "mozziflow/long" } } }
});

NodeLibrary.push({
    nodetype: 'filter/mozzi_svf',
    nodeclass: "MozziSVF",
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            if (!node.data.mode) node.data.mode = "LOWPASS";
            if (!node._ui_mode) {
                var sel = document.createElement('select');
                sel.style.fontSize = '9px'; sel.style.width = '100%';
                sel.style.background = "#111"; sel.style.color = "#0f9";
                ["LOWPASS", "BANDPASS", "HIGHPASS", "NOTCH"].forEach(function(m) {
                    var opt = document.createElement('option');
                    opt.value = m; opt.innerText = m;
                    if (node.data.mode === m) opt.selected = true;
                    sel.appendChild(opt);
                });
                sel.onchange = function() { node.data.mode = this.value; };
                bodyElm.appendChild(sel); node._ui_mode = true;
            }
        }
    },
    mozzi: {
        rate: 'audio',
        includes: ["#include <StateVariable.h>"],
        defaults: { "cutoff": "1200", "res": "128" },
        global: function(n,v){
            var mode = (n.data && n.data.mode) ? n.data.mode : "LOWPASS";
            return "StateVariable<" + mode + "> " + v + "; unsigned int last_f_"+n.id+"=0; uint8_t last_r_"+n.id+"=0;"; 
        },
        control: function(n,v,i){ 
            return "if(last_f_"+n.id+" != (unsigned int)(long)"+i.cutoff+"){ "+v+".setCentreFreq((unsigned int)(long)"+i.cutoff+"); last_f_"+n.id+"=(unsigned int)(long)"+i.cutoff+"; }\n" + 
                   "if(last_r_"+n.id+" != (uint8_t)(long)"+i.res+"){ "+v+".setResonance((uint8_t)(long)"+i.res+"); last_r_"+n.id+"=(uint8_t)(long)"+i.res+"; }";
        },
        audio: function(n,v,i){ return "node_" + n.id + "_out = " + v + ".next((int)(long)"+i.in+")"; }
    },
    rpdnode: { "title": "SVF Filter", "inlets": { "in": { "type": "mozziflow/int8" }, "cutoff": { "type": "mozziflow/uint16", "is_control": true, "label": "cutoff" }, "res": { "type": "mozziflow/uint8", "is_control": true, "label": "res" } }, "outlets": { "out": { "type": "mozziflow/long" } } }
});

NodeLibrary.push({
    nodetype: 'filter/mozzi_multires',
    nodeclass: "MozziMultiRes",
    mozzi: {
        rate: 'audio',
        includes: ["#include <ResonantFilter.h>"],
        defaults: { "cutoff": "12000", "res": "0" },
        global: function(n,v){ return "MultiResonantFilter<uint16_t> " + v + "; uint16_t last_f_"+n.id+"=0; uint16_t last_r_"+n.id+"=0;"; },
        control: function(n,v,i){ 
            return "if(last_f_"+n.id+" != (uint16_t)(long)"+i.cutoff+" || last_r_"+n.id+" != (uint16_t)(long)"+i.res+"){\n " + 
                   v+".setCutoffFreqAndResonance((uint16_t)(long)"+i.cutoff+", (uint16_t)(long)"+i.res+"); " + 
                   "last_f_"+n.id+"=(uint16_t)(long)"+i.cutoff+"; last_r_"+n.id+"=(uint16_t)(long)"+i.res+"; }"; 
        },
        audio: function(n,v,i){ 
            return v + ".next((int)(long)" + i.in + ");\n" + 
                   "node_" + n.id + "_low = " + v + ".low();\n" + 
                   "node_" + n.id + "_high = " + v + ".high();\n" + 
                   "node_" + n.id + "_band = " + v + ".band();\n" + 
                   "node_" + n.id + "_notch = " + v + ".notch()";
        }
    },
    rpdnode: { "title": "MultiRes Filter", "inlets": { "in": { "type": "mozziflow/int8" }, "cutoff": { "type": "mozziflow/uint16", "is_control": true, "label": "cutoff" }, "res": { "type": "mozziflow/uint16", "is_control": true, "label": "res" } }, "outlets": { "low": { "type": "mozziflow/long" }, "high": { "type": "mozziflow/long" }, "band": { "type": "mozziflow/long" }, "notch": { "type": "mozziflow/long" } } }
});

NodeLibrary.push({
    nodetype: 'filter/mozzi_dcfilter',
    nodeclass: "MozziDCFilter",
    mozzi: {
        rate: "audio",
        includes: ["#include <DCfilter.h>"],
        global: function(n,v){ return "DCfilter "+v+"(0.9f);"; },
        audio: function(n,v,i){ return "node_" + n.id + "_out = " + v + ".next((int)(long)"+i.in+")"; }
    },
    rpdnode: { "title": "DC Filter", "inlets": { "in": { "type": "mozziflow/int8" } }, "outlets": { "out": { "type": "mozziflow/int8" } } }
});

NodeLibrary.push({
    nodetype: 'filter/mozzi_reverb',
    nodeclass: "MozziReverb",
    mozzi: {
        rate: "audio",
        includes: ["#include <ReverbTank.h>"],
        defaults: { "mix": "128" },
        global: function(n,v){ return "ReverbTank "+v+";"; },
        audio: function(n,v,i){ 
            return "node_" + n.id + "_out = (((long)"+i.in+" * (long)(255 - (int)"+i.mix+")) + ((long)"+v+".next((int)(long)"+i.in+") * (long)"+i.mix+"))";
        }
    },
    rpdnode: { "title": "Reverb Tank", "inlets": { "in": { "type": "mozziflow/int8" }, "mix": { "type": "mozziflow/uint8", "label": "mix" } }, "outlets": { "out": { "type": "mozziflow/long" } } }
});

NodeLibrary.push({
    nodetype: 'filter/mozzi_wavefolder',
    nodeclass: "MozziWaveFolder",
    mozzi: {
        rate: "audio",
        includes: ["#include <WaveFolder.h>"],
        global: function(n,v){ return "WaveFolder<int> "+v+";"; },
        setup: function(n,v,i){ return v+".setLimits(-128, 127);"; },
        audio: function(n,v,i){ return "node_" + n.id + "_out = " + v + ".next((int)(long)"+i.in+")"; }
    },
    rpdnode: { "title": "Wave Folder", "inlets": { "in": { "type": "mozziflow/long" } }, "outlets": { "out": { "type": "mozziflow/int8" } } }
});

NodeLibrary.push({
    nodetype: 'filter/mozzi_audiodelay',
    nodeclass: "MozziAudioDelay",
    mozzi: {
        rate: "audio",
        includes: ["#include <AudioDelay.h>"],
        defaults: { "delay": "128" },
        global: function(n,v){ return "AudioDelay<256> "+v+";"; },
        audio: function(n,v,i){ return "node_" + n.id + "_out = " + v + ".next((int)(long)"+i.in+", (uint16_t)(long)"+i.delay+")"; }
    },
    rpdnode: { "title": "Audio Delay", "inlets": { "in": { "type": "mozziflow/int8" }, "delay": { "type": "mozziflow/uint16", "label": "samples" } }, "outlets": { "out": { "type": "mozziflow/int8" } } }
});

NodeLibrary.push({
    nodetype: 'filter/mozzi_delay_hifi',
    nodeclass: "MozziDelayHiFi",
    mozzi: {
        rate: "audio",
        includes: ["#include <AudioDelayFeedback.h>"],
        defaults: { "delay": "128", "fb": "64" },
        global: function(n,v){ return "AudioDelayFeedback<256, LINEAR, int16_t> "+v+";"; },
        control: function(n,v,i){ return v+".setFeedbackLevel((int8_t)(long)"+i.fb+");"; },
        audio: function(n,v,i){ return "node_" + n.id + "_out = " + v + ".next((int16_t)(long)"+i.in+", (uint16_t)(long)"+i.delay+")"; }
    },
    rpdnode: { "title": "Hi-Fi Delay", "inlets": { "in": { "type": "mozziflow/int16" }, "delay": { "type": "mozziflow/uint16", "label": "samples" }, "fb": { "type": "mozziflow/int8", "label": "fb" } }, "outlets": { "out": { "type": "mozziflow/int16" } } }
});

NodeLibrary.push({
    nodetype: 'filter/mozzi_waveshaper',
    nodeclass: "MozziWaveShaper",
    mozzi: {
        rate: "audio",
        includes: ["#include <WaveShaper.h>"],
        global: function(n,v){ return "const int16_t "+v+"_table[256] PROGMEM = {0}; WaveShaper<int> "+v+"("+v+"_table);"; },
        audio: function(n,v,i){ return "node_" + n.id + "_out = " + v + ".next((int)(long)"+i.in+")"; }
    },
    rpdnode: { "title": "Wave Shaper", "inlets": { "in": { "type": "mozziflow/int8" } }, "outlets": { "out": { "type": "mozziflow/int8" } } }
});

NodeLibrary.push({
    nodetype: 'filter/mozzi_hpf',
    nodeclass: "MozziHPF",
    mozzi: {
        rate: "audio",
        includes: ["#include <ResonantFilter.h>"],
        defaults: { "cutoff": "12000", "res": "0" },
        global: function(n,v){ return "ResonantFilter<HIGHPASS, uint16_t> "+v+"; uint16_t last_f_"+n.id+"=0; uint16_t last_r_"+n.id+"=0;"; },
        control: function(n,v,i){ 
            return "if(last_f_"+n.id+" != (uint16_t)(long)"+i.cutoff+" || last_r_"+n.id+" != (uint16_t)(long)"+i.res+"){\n " + 
                   v+".setCutoffFreqAndResonance((uint16_t)(long)"+i.cutoff+", (uint16_t)(long)"+i.res+"); " + 
                   "last_f_"+n.id+"=(uint16_t)(long)"+i.cutoff+"; last_r_"+n.id+"=(uint16_t)(long)"+i.res+"; }"; 
        },
        audio: function(n,v,i){ return "node_" + n.id + "_out = " + v + ".next((int)(long)"+i.in+")"; }
    },
    rpdnode: { "title": "HighPass", "inlets": { "in": { "type": "mozziflow/int8" }, "cutoff": { "type": "mozziflow/uint16", "is_control": true, "label": "cutoff" }, "res": { "type": "mozziflow/uint16", "is_control": true, "label": "res" } }, "outlets": { "out": { "type": "mozziflow/long" } } }
});

NodeLibrary.push({
    nodetype: 'filter/mozzi_bpf',
    nodeclass: "MozziBPF",
    mozzi: {
        rate: "audio",
        includes: ["#include <ResonantFilter.h>"],
        defaults: { "cutoff": "12000", "res": "0" },
        global: function(n,v){ return "ResonantFilter<BANDPASS, uint16_t> "+v+"; uint16_t last_f_"+n.id+"=0; uint16_t last_r_"+n.id+"=0;"; },
        control: function(n,v,i){ 
            return "if(last_f_"+n.id+" != (uint16_t)(long)"+i.cutoff+" || last_r_"+n.id+" != (uint16_t)(long)"+i.res+"){\n " + 
                   v+".setCutoffFreqAndResonance((uint16_t)(long)"+i.cutoff+", (uint16_t)(long)"+i.res+"); " + 
                   "last_f_"+n.id+"=(uint16_t)(long)"+i.cutoff+"; last_r_"+n.id+"=(uint16_t)(long)"+i.res+"; }"; 
        },
        audio: function(n,v,i){ return "node_" + n.id + "_out = " + v + ".next((int)(long)"+i.in+")"; }
    },
    rpdnode: { "title": "BandPass", "inlets": { "in": { "type": "mozziflow/int8" }, "cutoff": { "type": "mozziflow/uint16", "is_control": true, "label": "cutoff" }, "res": { "type": "mozziflow/uint16", "is_control": true, "label": "res" } }, "outlets": { "out": { "type": "mozziflow/long" } } }
});

NodeLibrary.push({
    nodetype: 'filter/mozzi_nf',
    nodeclass: "MozziNF",
    mozzi: {
        rate: "audio",
        includes: ["#include <ResonantFilter.h>"],
        defaults: { "cutoff": "12000", "res": "0" },
        global: function(n,v){ return "ResonantFilter<NOTCH, uint16_t> "+v+"; uint16_t last_f_"+n.id+"=0; uint16_t last_r_"+n.id+"=0;"; },
        control: function(n,v,i){ 
            return "if(last_f_"+n.id+" != (uint16_t)(long)"+i.cutoff+" || last_r_"+n.id+" != (uint16_t)(long)"+i.res+"){\n " + 
                   v+".setCutoffFreqAndResonance((uint16_t)(long)"+i.cutoff+", (uint16_t)(long)"+i.res+"); " + 
                   "last_f_"+n.id+"=(uint16_t)(long)"+i.cutoff+"; last_r_"+n.id+"=(uint16_t)(long)"+i.res+"; }"; 
        },
        audio: function(n,v,i){ return "node_" + n.id + "_out = " + v + ".next((int)(long)"+i.in+")"; }
    },
    rpdnode: { "title": "Notch Filter", "inlets": { "in": { "type": "mozziflow/int8" }, "cutoff": { "type": "mozziflow/uint16", "is_control": true, "label": "cutoff" }, "res": { "type": "mozziflow/uint16", "is_control": true, "label": "res" } }, "outlets": { "out": { "type": "mozziflow/long" } } }
});

NodeLibrary.push({
    nodetype: 'signal/mozzi_gain',
    nodeclass: "MozziGain",
    mozzi: {
        rate: "audio",
        is_inline: true,
        defaults: { "gain": "1" },
        audio: function(n,v,i){
            return "node_" + n.id + "_out = ((long)"+i.in+" * (long)"+i.gain+")"; 
        }
    },
    rpdnode: { "title": "Gain", "inlets": { "in": { "type": "mozziflow/long" }, "gain": { "type": "mozziflow/long", "label": "mul" } }, "outlets": { "out": { "type": "mozziflow/long" } } }
});