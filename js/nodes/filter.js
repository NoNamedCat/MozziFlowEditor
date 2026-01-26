// Mozzi Node Definitions - FILTER CATEGORY
// High-Fidelity Optimized Version 13.0

NodeLibrary.push({
    nodetype: 'filter/mozzi_lpf',
    nodeclass: "MozziLPF",
    description: "Standard LPF.",
    mozzi: {
        rate: "audio",
        includes: ["#include <ResonantFilter.h>"],
        defaults: {"in":"0","cutoff":"128"},
        global: function(n,v){ return "LowPassFilter "+v+";"; },
        setup: function(n,v,i,r,s){ if (s.cutoff) return v+".setCutoffFreq((uint8_t)"+i.cutoff+");"; return ""; },
        control: function(n,v,i,r,s){ if (s.cutoff) return ""; return v+".setCutoffFreq((uint8_t)"+i.cutoff+");"; },
        audio: function(n,v,i){ return v+"_out = "+v+".next("+i.in+");"; },
    },
    rpdnode: {
    "title": "LowPass",
    "inlets": {
        "in": { "type": "mozziflow/string", "no_text": true, "color": "bipolar_8" },
        "cutoff": { "type": "mozziflow/string", "is_control": true, "color": "unipolar_8" }
    },
    "outlets": { "out": { "type": "mozziflow/string", "color": "bipolar_8" } }
}
});

NodeLibrary.push({
    nodetype: 'filter/mozzi_svf',
    nodeclass: "MozziSVF",
    description: "State Variable Filter.",
    mozzi: {
        rate: 'audio',
        includes: ["#include <StateVariable.h>"],
        defaults: { in: "0", cutoff: "1200", res: "200" },
        global: function(n,v){
            var mode = (n.data && n.data.mode) ? n.data.mode : "LOWPASS";
            return "StateVariable<" + mode + "> " + v + ";";
        },
        setup: function(n,v,i,r,s){
            var code = "";
            if (s.cutoff) code += v+".setCentreFreq((int)"+i.cutoff+");\n\t";
            if (s.res) code += v+".setResonance((uint8_t)"+i.res+");";
            return code;
        },
        control: function(n,v,i,r,s){
            var code = "";
            if (!s.cutoff) code += v+".setCentreFreq((int)"+i.cutoff+");\n\t";
            if (!s.res) code += v+".setResonance((uint8_t)"+i.res+");";
            return code;
        },
        audio: function(n,v,i){ return v+"_out = "+v+".next("+i.in+");"; }
    },
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = { mode: "LOWPASS" };
            var container = document.createElement('div');
            container.style.padding = "5px"; container.style.textAlign = "center";
            var select = document.createElement('select');
            select.className = "mozzi-buffer-select";
            ["LOWPASS", "BANDPASS", "HIGHPASS", "NOTCH"].forEach(function(m) {
                var opt = document.createElement('option');
                opt.value = m; opt.innerText = m;
                if (m === node.data.mode) opt.selected = true;
                select.appendChild(opt);
            });
            select.onchange = function() { node.data.mode = this.value; };
            container.appendChild(select); bodyElm.appendChild(container);
        }
    },
    rpdnode: {
    "title": "SVF Filter",
    "inlets": {
        "in": { "type": "mozziflow/string", "no_text": true, "color": "bipolar_8" },
        "cutoff": { "type": "mozziflow/string", "label": "Freq (20-4k)", "is_control": true, "color": "unipolar_16" },
        "res": { "type": "mozziflow/string", "label": "Res (Inv 0-255)", "is_control": true, "color": "unipolar_8" }
    },
    "outlets": { "out": { "type": "mozziflow/string", "color": "bipolar_8" } }
}
});

NodeLibrary.push({
    nodetype: 'filter/mozzi_res',
    nodeclass: "MozziRes",
    description: "Resonant LPF.",
    mozzi: {
        rate: "audio",
        includes: ["#include <ResonantFilter.h>"],
        defaults: {"in":"0","cutoff":"128","res":"128"},
        global: function(n,v){ return "ResonantFilter<LOWPASS, uint8_t> "+v+";"; },
        setup: function(n,v,i,r,s){ if (s.cutoff && s.res) return v+".setCutoffFreqAndResonance((uint8_t)"+i.cutoff+", (uint8_t)"+i.res+");"; return ""; },
        control: function(n,v,i,r,s){ if (s.cutoff && s.res) return ""; return v+".setCutoffFreqAndResonance((uint8_t)"+i.cutoff+", (uint8_t)"+i.res+");"; },
        audio: function(n,v,i){ return v+"_out = "+v+".next("+i.in+");"; },
    },
    rpdnode: {
    "title": "Resonant LP",
    "inlets": {
        "in": { "type": "mozziflow/string", "no_text": true, "color": "bipolar_8" },
        "cutoff": { "type": "mozziflow/string", "is_control": true, "color": "unipolar_8" },
        "res": { "type": "mozziflow/string", "is_control": true, "color": "unipolar_8" }
    },
    "outlets": { "out": { "type": "mozziflow/string", "color": "bipolar_8" } }
}
});

NodeLibrary.push({
    nodetype: 'filter/mozzi_wavefolder',
    nodeclass: "MozziWaveFolder",
    description: "Asymmetric folding distortion.",
    mozzi: {
        rate: "audio",
        includes: ["#include <WaveFolder.h>"],
        defaults: {"in":"0","low":"-128","high":"127"},
        global: function(n,v){ return "WaveFolder<int> "+v+";"; },
        setup: function(n,v,i,r,s){ if (s.low && s.high) return v+".setLimits((int)"+i.low+", (int)"+i.high+");"; return ""; },
        control: function(n,v,i,r,s){ if (s.low && s.high) return ""; return v+".setLimits((int)"+i.low+", (int)"+i.high+");"; },
        audio: function(n,v,i){ return v+"_out = "+v+".next("+i.in+");"; },
    },
    rpdnode: {
    "title": "WaveFolder",
    "inlets": {
        "in": { "type": "mozziflow/string", "no_text": true },
        "low": { "type": "mozziflow/string", "is_control": true },
        "high": { "type": "mozziflow/string", "is_control": true }
    },
    "outlets": { "out": { "type": "mozziflow/string" } }
}
});

NodeLibrary.push({
    nodetype: 'filter/mozzi_reverb',
    nodeclass: "MozziReverb",
    description: "Configurable ReverbTank.",
    mozzi: {
        rate: "audio",
        includes: ["#include <ReverbTank.h>"],
        defaults: {"in":"0","mix":"128","room":"85","e1":"37","e2":"77","e3":"127","l1":"117","l2":"255"},
        global: function(n,v){ return "ReverbTank "+v+";"; },
        setup: function(n,v,i,r,s){
            return v+".setFeebackLevel((int8_t)((int)"+i.room+" - 128));\n\t" +
                   v+".setEarlyReflections((int8_t)"+i.e1+", (int8_t)"+i.e2+", (int8_t)"+i.e3+");\n\t" +
                   v+".setLoopDelays((int8_t)"+i.l1+", (uint8_t)"+i.l2+");";
        },
        control: function(n,v,i,r,s){
            if (s.room && s.e1 && s.e2 && s.e3 && s.l1 && s.l2) return "";
            return v+".setFeebackLevel((int8_t)((int)"+i.room+" - 128));\n\t" +
                   v+".setEarlyReflections((int8_t)"+i.e1+", (int8_t)"+i.e2+", (int8_t)"+i.e3+");\n\t" +
                   v+".setLoopDelays((int8_t)"+i.l1+", (uint8_t)"+i.l2+");";
        },
        audio: function(n,v,i){
            return v+"_out = (int)((((long)"+i.in+" * (255 - (int)"+i.mix+")) + ((long)"+v+".next("+i.in+") * (int)"+i.mix+")) >> 8);"; 
        },
    },
    rpdnode: {
    "title": "Reverb Tank",
    "inlets": {
        "in": { "type": "mozziflow/string", "no_text": true, "color": "bipolar_8" },
        "mix": { "type": "mozziflow/string", "is_control": true, "color": "unipolar_8" },
        "room": { "type": "mozziflow/string", "is_control": true, "color": "unipolar_8" },
        "e1": { "type": "mozziflow/string", "is_control": true, "color": "unipolar_8" },
        "e2": { "type": "mozziflow/string", "is_control": true, "color": "unipolar_8" },
        "e3": { "type": "mozziflow/string", "is_control": true, "color": "unipolar_8" },
        "l1": { "type": "mozziflow/string", "is_control": true, "color": "unipolar_8" },
        "l2": { "type": "mozziflow/string", "is_control": true, "color": "unipolar_8" }
    },
    "outlets": { "out": { "type": "mozziflow/string", "color": "bipolar_8" } }
}
});

NodeLibrary.push({
    nodetype: 'filter/mozzi_multires',
    nodeclass: "MozziMultiRes",
    description: "4-output efficient filter.",
    mozzi: {
        rate: "audio",
        includes: ["#include <ResonantFilter.h>"],
        defaults: {"in":"0","cutoff":"128","res":"128"},
        global: function(n,v){ return "MultiResonantFilter<uint8_t> " + v + ";"; },
        setup: function(n,v,i,r,s){ if (s.cutoff && s.res) return v + ".setCutoffFreqAndResonance((uint8_t)" + i.cutoff + ", (uint8_t)" + i.res + ");"; return ""; },
        control: function(n,v,i,r,s){ if (s.cutoff && s.res) return ""; return v + ".setCutoffFreqAndResonance((uint8_t)" + i.cutoff + ", (uint8_t)" + i.res + ");"; },
        audio: function(n,v,i){
            return v + ".next((int)" + i.in + ");\n\t" +
                   v + "_low = " + v + ".low();\n\t"
                   v + "_high = " + v + ".high();\n\t"
                   v + "_band = " + v + ".band();\n\t"
                   v + "_notch = " + v + ".notch()";
        }
    },
    rpdnode: {
        "title": "MultiRes Filter",
        "inlets": {
            "in": { "type": "mozziflow/string", "no_text": true, "color": "bipolar_8" },
            "cutoff": { "type": "mozziflow/string", "label": "Freq / Cutoff", "is_control": true, "color": "unipolar_8" },
            "res": { "type": "mozziflow/string", "label": "Resonance / Q", "is_control": true, "color": "unipolar_8" }
        },
        "outlets": {
            "low": { "type": "mozziflow/string", "color": "bipolar_8" },
            "high": { "type": "mozziflow/string", "color": "bipolar_8" },
            "band": { "type": "mozziflow/string", "color": "bipolar_8" },
            "notch": { "type": "mozziflow/string", "color": "bipolar_8" }
        }
    }
});