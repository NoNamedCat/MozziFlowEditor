// Mozzi Node Definitions - SOURCE (v6.0 Absolute Fix)
var createSourceInput = function(label, node, key, defaultValue, container) {
    var row = document.createElement('div');
    row.style.display = "flex"; row.style.justifyContent = "space-between"; row.style.fontSize = "8px"; row.style.marginBottom = "2px";
    var lbl = document.createElement('span'); lbl.innerText = label + ":"; row.appendChild(lbl);
    var inp = document.createElement('input');
    inp.type = "text"; inp.style.width = "40px";
    inp.className = 'mozzi-inlet-val-input';
    inp.style.background = "#000"; inp.style.color = "#0f9"; inp.style.fontSize = "8px"; inp.style.border = "1px solid #333";
    var realKey = key.indexOf("cfg_") === 0 ? key : "cfg_" + key;
    var alias = key.replace("cfg_", "");
    inp.setAttribute('data-alias', alias);
    var val = (node.data && node.data[realKey] !== undefined) ? node.data[realKey] : defaultValue;
    inp.value = val;
    if (node.data) node.data[realKey] = val; 
    inp.oninput = function() { node.data[realKey] = this.value; };
    row.appendChild(inp);
    container.appendChild(row);
};

var createSourceFreqSelector = function(node, container) {
    var row = document.createElement('div');
    row.style.display = "flex"; row.style.justifyContent = "space-between"; row.style.marginBottom = "4px";
    var sel = document.createElement('select');
    sel.style.width = "100%"; sel.style.fontSize = "9px"; sel.style.background = "#222"; sel.style.color = "#0ff";
    // FIX: Binding
    sel.className = 'mozzi-inlet-val-input';
    sel.setAttribute('data-alias', 'freq_mode');

    var opts = [["float", "Float Freq"], ["fixed", "FixMath Freq"]];
    opts.forEach(function(o){ 
        var opt = document.createElement('option'); opt.value = o[0]; opt.innerText = o[1];
        if(node.data.cfg_freq_mode === o[0]) opt.selected = true;
        sel.appendChild(opt); 
    });
    sel.onchange = function() { node.data.cfg_freq_mode = this.value; };
    if(!node.data.cfg_freq_mode) node.data.cfg_freq_mode = "float";
    row.appendChild(sel);
    container.appendChild(row);
};

var _oscConfigs = [["sin", "SIN2048", "Sine"], ["saw", "SAW2048", "Saw"], ["tri", "TRIANGLE2048", "Triangle"], ["square", "SQUARE_NO_ALIAS_2048", "Square"]];
_oscConfigs.forEach(function(cfg) {
    NodeLibrary.push({
        nodetype: 'mozziflow/' + cfg[0],
        category: "wave",
        nodeclass: "Oscil",
        renderer: {
            'html': function(bodyElm, node) {
                if (!node.data) node.data = {};
                var container = document.createElement('div');
                container.style.padding = "5px"; container.style.background = "rgba(0,255,153,0.05)";
                container.style.border = "1px solid #0f9"; container.style.marginBottom = "5px";
                createSourceFreqSelector(node, container);
                createSourceInput("FREQ", node, "freq", "440.0f", container);
                if (cfg[0] === "sin") createSourceInput("PHASE", node, "phase", "0", container);
                bodyElm.appendChild(container);
            }
        },
        mozzi: {
            rate: "audio",
            includes: ["#include <Oscil.h>", "#include <tables/" + cfg[1].toLowerCase() + "_int8.h>"],
            defaults: { "freq": "440.0f", "phase": "0" },
            global: function(n, v, r) { 
                var type = (n.data.cfg_freq_mode === "fixed") ? "Q16n16" : "float";
                return "Oscil<" + cfg[1] + "_NUM_CELLS, " + r + "> " + v + "(" + cfg[1] + "_DATA); " + type + " last_f_" + n.id + " = 0;"; 
            },
            control: function(n,v,i){
                if(n.data.cfg_freq_mode === "fixed") {
                    var val = (i.freq.indexOf("node_") === -1) ? "float_to_Q16n16(" + i.freq + ")" : "(Q16n16)" + i.freq;
                    return "if(last_f_" + n.id + " != (Q16n16)" + val + "){ " + v + ".setFreq_Q16n16((Q16n16)" + val + "); last_f_" + n.id + " = (Q16n16)" + val + "; }";
                }
                return "if(last_f_" + n.id + " != " + i.freq + "){ " + v + ".setFreq((float)" + i.freq + "); last_f_" + n.id + " = " + i.freq + "; }"; 
            },
            audio: function(n, v, i) { 
                if (cfg[0] === "sin" && i.phase && i.phase != "0") return "node_" + n.id + "_out = " + v + ".phMod(" + i.phase + ");";
                return "node_" + n.id + "_out = " + v + ".next();"; 
            }
        },
        help: {
            summary: "Standard " + cfg[2] + " wave oscillator based on a 2048-sample wavetable.",
            usage: "Use 'FixMath Freq' for high-speed modulation without floats. Connect a Q16n16 signal to freq.",
            inlets: { "freq": "Oscillator frequency.", "phase": "Phase modulation input (signed int)." },
            outlets: { "out": "8-bit audio signal (-128 to 127)." }
        },
        rpdnode: { "title": cfg[2], "inlets": (cfg[0] === "sin") ? { "freq": { "type": "mozziflow/any", "is_control": true, "label": "freq" }, "phase": { "type": "mozziflow/int32_t", "label": "phase" } } : { "freq": { "type": "mozziflow/any", "is_control": true, "label": "freq" } }, "outlets": { "out": { "type": "mozziflow/int8_t" } } }
    });
});
NodeLibrary.push({
    nodetype: 'mozziflow/phasor',
    category: "wave",
    nodeclass: "Phasor",
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px"; container.style.background = "rgba(0,255,153,0.05)";
            container.style.border = "1px solid #0f9"; container.style.marginBottom = "5px";
            createSourceInput("FREQ", node, "freq", "440.0f", container);
            bodyElm.appendChild(container);
        }
    },
    mozzi: {
        rate: "audio",
        includes: ["#include <Phasor.h>"], defaults: { "freq": "440.0f" },
        global: function(n,v,r){ return "Phasor<" + r + "> " + v + "; float last_f_" + n.id + " = 0.0f;"; },
        control: function(n,v,i){ return "if(last_f_" + n.id + " != " + i.freq + "){ " + v + ".setFreq((float)" + i.freq + "); last_f_" + n.id + " = " + i.freq + "; }"; },
        audio: function(n,v,i){ return "node_" + n.id + "_out = " + v + ".next();"; }
    },
    help: {
        summary: "High-precision phase accumulator. Loops from 0 to 4,294,967,295.",
        usage: "Use it to drive custom oscillators, waveshapers, or as a raw sawtooth-like control source.",
        inlets: { "freq": "Frequency of the cycle in Hz." },
        outlets: { "out": "32-bit unsigned phase value." }
    },
    rpdnode: { "title": "Phasor", "inlets": { "freq": { "type": "mozziflow/float", "is_control": true, "label": "freq" } }, "outlets": { "out": { "type": "mozziflow/uint32_t" } } }
});
NodeLibrary.push({
    nodetype: 'mozziflow/noise',
    category: "wave",
    nodeclass: "Noise",
    mozzi: {
        rate: "audio", 
        includes: ["#include <mozzi_rand.h>"], 
        global: function(n,v){ return ""; },
        audio: function(n,v,i){ return "node_" + n.id + "_out = (rand(256) - 128);"; } 
    },
    help: {
        summary: "Pseudo-random white noise generator.",
        usage: "Directly output for percussion, sound effects, or as a modulation source for 'dirty' textures.",
        outlets: { "out": "8-bit random signal (-128 to 127)." }
    },
    rpdnode: { "title": "Noise", "inlets": {}, "outlets": { "out": { "type": "mozziflow/int8_t" } } }
});
NodeLibrary.push({
    nodetype: 'mozziflow/wavepacket',
    category: "wave",
    nodeclass: "WavePacket",
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            var container = document.createElement('div');
            container.style.padding = "5px"; container.style.background = "rgba(0,255,153,0.05)";
            container.style.border = "1px solid #0f9"; container.style.marginBottom = "5px";
            createSourceInput("FUND", node, "fund", "100", container);
            createSourceInput("BW", node, "bw", "50", container);
            createSourceInput("RES", node, "res", "100", container);
            bodyElm.appendChild(container);
        }
    },
    mozzi: {
        rate: "audio", includes: ["#include <WavePacket.h>"],
        global: function(n,v){ return "WavePacket<DOUBLE> " + v + ";"; },
        setup: function(n,v,i){ return v + ".set(100, 50, 100);"; },
        control: function(n,v,i){ return v + ".set(" + i.fund + ", " + i.bw + ", " + i.res + ");"; },
        audio: function(n,v,i){ return "node_" + n.id + "_out = " + v + ".next();"; }
    },
    help: {
        summary: "Advanced resonant wave-packet generator. Great for vocal and bell sounds.",
        usage: "Control FUND (Fundamental), BW (Bandwidth), and RES (Resonance) to sculpt the timbre.",
        inlets: { "fund": "Fundamental frequency.", "bw": "Bandwidth of resonance.", "res": "Resonance level." },
        outlets: { "out": "16-bit audio signal." }
    },
    rpdnode: { "title": "WavePacket", "inlets": { "fund": { "type": "mozziflow/uint16_t", "label": "fund" }, "bw": { "type": "mozziflow/uint8_t", "label": "bw" }, "res": { "type": "mozziflow/uint8_t", "label": "res" } }, "outlets": { "out": { "type": "mozziflow/int16_t" } } }
});
NodeLibrary.push({
    nodetype: 'mozziflow/sample',
    category: "wave",
    nodeclass: "Sample",
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            if (!node.data.interp) node.data.interp = "INTERP_NONE";
            if (!node._ui_sample) {
                var fileInp = document.createElement('input'); fileInp.type = 'file'; fileInp.style.fontSize = '9px'; fileInp.style.width = '100%';
                fileInp.onchange = function(e) {
                    if (e.target.files.length > 0) {
                        MozziSampleConverter.processFile(e.target.files[0], function(res) {
                            if (res) { node.data.sample_table = res.tableString; node.data.sample_table_size = res.size; node.data.sample_name = e.target.files[0].name.replace(/[^a-z0-9]/gi, '_').toLowerCase(); bodyElm.querySelector('.sample-info').innerText = "Loaded: " + res.info; }
                        });
                    }
                };
                var selInt = document.createElement('select'); selInt.style.width = "100%"; selInt.style.fontSize = "9px"; selInt.style.background = "#111"; selInt.style.color = "#0f9";
                selInt.className = 'mozzi-inlet-val-input';
                selInt.setAttribute('data-alias', 'interp');
                var _interpOpts = [["INTERP_NONE", "None"], ["INTERP_LINEAR", "Linear"]];
                _interpOpts.forEach(function(opt) { var o = document.createElement('option'); o.value = opt[0]; o.innerText = opt[1]; if (node.data.interp === opt[0]) o.selected = true; selInt.appendChild(o); });
                selInt.onchange = function() { node.data.interp = this.value; };
                var info = document.createElement('div'); info.className = 'sample-info'; info.style.fontSize = '8px'; info.style.color = '#0f9';
                info.innerText = (node.data && node.data.sample_name) ? "Loaded: " + node.data.sample_name : "No sample loaded";
                bodyElm.appendChild(fileInp); bodyElm.appendChild(selInt); 
                var container = document.createElement('div'); container.style.marginTop = "5px";
                createSourceInput("RATE", node, "freq", "1.0f", container);
                bodyElm.appendChild(container);
                bodyElm.appendChild(info); node._ui_sample = true;
            }
        }
    },
    mozzi: {
        rate: "audio", is_inline: false, includes: ["#include <Sample.h>"],
        global: function(n,v,r){
            var data = n.data || {};
            var name = data.sample_name ? data.sample_name : "dummy_sample_" + n.id;
            var table = data.sample_table ? data.sample_table : "0";
            var size = data.sample_table_size ? data.sample_table_size : "1";
            var interp = data.interp ? data.interp : "INTERP_NONE";
            return "const int8_t " + name + "_data[] PROGMEM = {" + table + "};\nSample<" + size + ", " + r + ", " + interp + "> " + v + "(" + name + "_data); float last_f_" + n.id + " = 0.0f;";
        },
        control: function(n,v,i){ return "if(" + i.trig + "){ " + v + ".start(); }\nif(last_f_" + n.id + " != " + i.freq + "){ " + v + ".setFreq(" + i.freq + "); last_f_" + n.id + " = " + i.freq + "; }"; },
        audio: function(n,v,i){ return "node_" + n.id + "_out = " + v + ".next()"; } 
    },
    help: {
        summary: "WAV player. Converts files to internal PROGMEM tables.",
        usage: "Load a .wav file. Use 'trig' to play. 'RATE' controls playback speed.",
        inlets: { "trig": "Play pulse.", "freq": "Speed multiplier." },
        outlets: { "out": "8-bit audio." }
    },
    rpdnode: { "title": "Sample", "inlets": { "trig": { "type": "mozziflow/bool", "label": "trig" }, "freq": { "type": "mozziflow/float", "is_control": true, "label": "freq" } }, "outlets": { "out": { "type": "mozziflow/int8_t" } } }
});