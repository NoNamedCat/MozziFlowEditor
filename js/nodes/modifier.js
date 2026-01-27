// Mozzi Node Definitions - MODIFIER (Iron Integrity v111.17)
// FILTER + GAIN + EFFECTS (Template Fixes + Visual ID)

NodeLibrary.push({
    nodetype: 'filter/mozzi_lpf',
    nodeclass: "MozziLPF",
    mozzi: {
        rate: "audio",
        includes: ["#include <ResonantFilter.h>"],
        defaults: { "cutoff": "128", "res": "0" },
        global: function(n,v){ return "LowPassFilter "+v+";"; },
        control: function(n,v,i){ return v+".setCutoffFreqAndResonance((uint8_t)(long)"+i.cutoff+", (uint8_t)(long)"+i.res+");"; },
        audio: function(n,v,i){ return v+".next((int)(long)"+i.in+")"; }
    },
    rpdnode: { "title": "LowPass", "inlets": { "in": { "type": "mozziflow/any", "color": "audio" }, "cutoff": { "type": "mozziflow/any", "is_control": true, "color": "control" }, "res": { "type": "mozziflow/any", "is_control": true, "color": "control" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "audio" } } }
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
            return "StateVariable<" + mode + "> " + v + ";"; 
        },
        control: function(n,v,i){ return v+".setCentreFreq((unsigned int)(long)"+i.cutoff+");\n"+v+".setResonance((uint8_t)(long)"+i.res+");"; },
        audio: function(n,v,i){ return v+".next((int)(long)"+i.in+")"; }
    },
    rpdnode: { "title": "SVF Filter", "inlets": { "in": { "type": "mozziflow/any", "color": "audio" }, "cutoff": { "type": "mozziflow/any", "is_control": true, "color": "freq", "label": "Freq" }, "res": { "type": "mozziflow/any", "is_control": true, "color": "control", "label": "Res" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "audio" } } }
});

NodeLibrary.push({
    nodetype: 'filter/mozzi_multires',
    nodeclass: "MozziMultiRes",
    mozzi: {
        rate: 'audio',
        includes: ["#include <ResonantFilter.h>"],
        defaults: { "cutoff": "128", "res": "0" },
        global: function(n,v){ return "MultiResonantFilter<uint8_t> " + v + ";"; },
        control: function(n,v,i){ return v+".setCutoffFreqAndResonance((uint8_t)(long)"+i.cutoff+", (uint8_t)(long)"+i.res+");"; },
        audio: function(n,v,i){ 
            return v + ".next((int)(long)" + i.in + ");\n" +
                   "node_" + n.id + "_low = " + v + ".low();\n" +
                   "node_" + n.id + "_high = " + v + ".high();\n" +
                   "node_" + n.id + "_band = " + v + ".band();\n" +
                   "node_" + n.id + "_notch = " + v + ".notch()";
        }
    },
    rpdnode: { "title": "MultiRes Filter", "inlets": { "in": { "type": "mozziflow/any", "color": "audio" }, "cutoff": { "type": "mozziflow/any", "is_control": true, "color": "control" }, "res": { "type": "mozziflow/any", "is_control": true, "color": "control" } }, "outlets": { "low": { "type": "mozziflow/any", "color": "audio" }, "high": { "type": "mozziflow/any", "color": "audio" }, "band": { "type": "mozziflow/any", "color": "audio" }, "notch": { "type": "mozziflow/any", "color": "audio" } } }
});

NodeLibrary.push({
    nodetype: 'filter/mozzi_dcfilter',
    nodeclass: "MozziDCFilter",
    mozzi: {
        rate: "audio",
        includes: ["#include <DCfilter.h>"],
        global: function(n,v){ return "DCfilter "+v+"(0.9f);"; },
        audio: function(n,v,i){ return v+".next((int)(long)"+i.in+")"; }
    },
    rpdnode: { "title": "DC Filter", "inlets": { "in": { "type": "mozziflow/any", "color": "audio" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "audio" } } }
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
            return "((int)(((long)"+i.in+" * (255 - (long)"+i.mix+") + (long)"+v+".next((int)(long)"+i.in+") * (long)"+i.mix+") >> 8))";
        }
    },
    rpdnode: { "title": "Reverb Tank", "inlets": { "in": { "type": "mozziflow/any", "color": "audio" }, "mix": { "type": "mozziflow/any", "color": "control" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "audio" } } }
});

NodeLibrary.push({
    nodetype: 'filter/mozzi_wavefolder',
    nodeclass: "MozziWaveFolder",
    mozzi: {
        rate: "audio",
        includes: ["#include <WaveFolder.h>"],
        global: function(n,v){ return "WaveFolder<int> "+v+";"; },
        audio: function(n,v,i){ return v+".next((int)(long)"+i.in+")"; }
    },
    rpdnode: { "title": "Wave Folder", "inlets": { "in": { "type": "mozziflow/any", "color": "audio" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "audio" } } }
});

NodeLibrary.push({
    nodetype: 'filter/mozzi_audiodelay',
    nodeclass: "MozziAudioDelay",
    mozzi: {
        rate: "audio",
        includes: ["#include <AudioDelay.h>"],
        defaults: { "delay": "128" },
        global: function(n,v){ return "AudioDelay<256> "+v+";"; },
        audio: function(n,v,i){ return v+".next((int)(long)"+i.in+", (uint16_t)(long)"+i.delay+")"; }
    },
    rpdnode: { "title": "Audio Delay", "inlets": { "in": { "type": "mozziflow/any", "color": "audio" }, "delay": { "type": "mozziflow/any", "color": "freq" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "audio" } } }
});

NodeLibrary.push({
    nodetype: 'signal/mozzi_gain',
    nodeclass: "MozziGain",
    mozzi: { 
        rate: "audio", 
        is_inline: true, 
        defaults: { "gain": "255" },
        audio: function(n,v,i){ return "((int)(((long)"+i.in+" * (long)"+i.gain+") >> 8))"; } 
    },
    rpdnode: { "title": "Gain", "inlets": { "in": { "type": "mozziflow/any", "color": "audio" }, "gain": { "type": "mozziflow/any", "is_control": true, "color": "control" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "audio" } } }
});