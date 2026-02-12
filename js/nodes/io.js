// Mozzi Node Definitions - MASTER IO & ARCHITECTURES (v7.8 ES5 Strict)
// Universal Hardware Configurator + Original IO Nodes

var ARCH_DATA = {
    "ch32x035": {
        name: "WCH CH32X035 (RISC-V)",
        modes: [["MOZZI_OUTPUT_PWM", "PWM (8-bit)"], ["MOZZI_OUTPUT_2PIN_PWM", "2-Pin PWM (16-bit)"], ["EXTERNAL_PT8211_SPI", "PT8211 (SPI)"]],
        pins: { pwm1: "PA6", pwm2: "PA7", ws: "5" },
        fixed: ["pwm1", "pwm2"],
        mono_only: ["MOZZI_OUTPUT_PWM", "MOZZI_OUTPUT_2PIN_PWM"],
        notes: "PWM is hardwired to Timer 3."
    },
    "esp32": {
        name: "ESP32 (Standard/S3/C3)",
        modes: [["MOZZI_OUTPUT_INTERNAL_DAC", "Internal DAC (8-bit)"], ["MOZZI_OUTPUT_PWM", "PWM (10-bit)"], ["MOZZI_OUTPUT_I2S_DAC", "I2S DAC"], ["MOZZI_OUTPUT_PDM_VIA_I2S", "PDM Audio"]],
        pins: { pwm1: "15", pwm2: "16", dac1: "25", dac2: "26", i2s_bck: "26", i2s_ws: "25", i2s_data: "33" },
        fixed: ["dac1", "dac2"],
        mono_only: ["MOZZI_OUTPUT_PDM_VIA_I2S"],
        stereo_support: true,
        notes: "Fully remappable via GPIO Matrix (except DAC)."
    },
    "stm32maple": {
        name: "STM32 Maple (Legacy Core)",
        modes: [["MOZZI_OUTPUT_PWM", "PWM (10-bit)"], ["MOZZI_OUTPUT_2PIN_PWM", "2-Pin PWM (14-bit)"]],
        pins: { pwm1: "PB8", pwm2: "PB9" },
        fixed: ["pwm1", "pwm2"],
        mono_only: ["MOZZI_OUTPUT_2PIN_PWM"],
        notes: "Uses Timer 4. Common on older BluePill setups."
    },
    "esp8266": {
        name: "Raspberry Pico (RP2040)",
        modes: [["MOZZI_OUTPUT_PWM", "PWM (11-bit)"], ["MOZZI_OUTPUT_I2S_DAC", "I2S DAC"]],
        pins: { pwm1: "0", pwm2: "1", i2s_bck: "20", i2s_ws: "21", i2s_data: "22" },
        fixed: ["i2s_ws"], 
        stereo_support: true,
        notes: "PWM pins must be neighboring (same slice)."
    },
    "avr": {
        name: "Arduino Uno/Mega (AVR)",
        modes: [["MOZZI_OUTPUT_PWM", "PWM (9-bit)"], ["MOZZI_OUTPUT_2PIN_PWM", "2-Pin PWM (14-bit)"]],
        pins: { pwm1: "9", pwm2: "10", pwm1_low: "10" },
        fixed: ["pwm1_low"],
        mono_only: ["MOZZI_OUTPUT_2PIN_PWM"],
        notes: "PWM restricted to Timer 1 pins (9, 10)."
    },
    "renesas": {
        name: "Arduino UNO R4 (Renesas)",
        modes: [["MOZZI_OUTPUT_INTERNAL_DAC", "Internal DAC (12-bit)"]],
        pins: { dac1: "A0" },
        fixed: ["dac1"],
        mono_only: true,
        notes: "DAC is the only native output supported."
    },
    "samd21": {
        name: "SAMD21 (Zero/MKR)",
        modes: [["MOZZI_OUTPUT_INTERNAL_DAC", "Internal DAC (10-bit)"]],
        pins: { dac1: "DAC0" },
        fixed: ["dac1"],
        mono_only: true,
        notes: "Pin PA02 is the hardware DAC."
    },
    "mbed": {
        name: "MBED (Giga/Portenta)",
        modes: [["MOZZI_OUTPUT_INTERNAL_DAC", "Dual DAC (12-bit)"], ["MOZZI_OUTPUT_PDM_VIA_SERIAL", "PDM Serial"]],
        pins: { dac1: "A13", dac2: "A12", serial_tx: "D18", serial_rx: "D19" },
        fixed: ["dac1", "dac2"],
        mono_only: ["MOZZI_OUTPUT_PDM_VIA_SERIAL"],
        notes: "Supports high-fidelity stereo via A13/A12."
    },
    "stm32duino": {
        name: "STM32 (Official/Duino)",
        modes: [["MOZZI_OUTPUT_PWM", "PWM (10-bit)"], ["MOZZI_OUTPUT_2PIN_PWM", "2-Pin PWM (14-bit)"]],
        pins: { pwm1: "PA8", pwm2: "PA9" },
        fixed: [],
        mono_only: ["MOZZI_OUTPUT_2PIN_PWM"],
        notes: "Pins must be on the same hardware timer."
    },
    "teensy": {
        name: "Teensy 3.x / 4.x",
        modes: [["MOZZI_OUTPUT_INTERNAL_DAC", "Internal DAC (12-bit)"], ["MOZZI_OUTPUT_PWM", "PWM"]],
        pins: { dac1: "A14", pwm1: "A8", pwm2: "A9" },
        fixed: ["dac1"],
        mono_only: ["MOZZI_OUTPUT_INTERNAL_DAC"],
        notes: "T3 has DAC (Mono), T4 uses high-speed PWM (Stereo)."
    },
    "esp8266": {
        name: "ESP8266 (NodeMCU)",
        modes: [["MOZZI_OUTPUT_PDM_VIA_SERIAL", "PDM Serial"], ["MOZZI_OUTPUT_PDM_VIA_I2S", "PDM via I2S"], ["MOZZI_OUTPUT_I2S_DAC", "I2S DAC"]],
        pins: { serial_tx: "GPIO2", i2s_data: "RX/GPIO3", i2s_bck: "GPIO15", i2s_ws: "GPIO2" },
        fixed: ["serial_tx", "i2s_data", "i2s_bck", "i2s_ws"],
        mono_only: ["MOZZI_OUTPUT_PDM_VIA_SERIAL", "MOZZI_OUTPUT_PDM_VIA_I2S"],
        notes: "No native PWM. Only I2S DAC supports stereo."
    }
};

var createArchInput = function(label, node, key, defaultValue, container, isFixed) {
    var row = document.createElement('div');
    row.style.display = "flex"; row.style.justifyContent = "space-between"; row.style.fontSize = "8px"; row.style.marginBottom = "2px";
    var lbl = document.createElement('span'); lbl.innerText = label + ":"; lbl.style.color = isFixed ? "#666" : "#0f9"; row.appendChild(lbl);
    var inp = document.createElement('input');
    inp.type = "text"; inp.style.width = "60px";
    inp.className = 'mozzi-inlet-val-input';
    inp.style.background = isFixed ? "#222" : "#000"; 
    inp.style.color = isFixed ? "#aaa" : "#0ff"; 
    inp.style.fontSize = "8px"; inp.style.border = "1px solid #333";
    if (isFixed) inp.readOnly = true;
    var realKey = "cfg_" + key;
    var val = (node.data && node.data[realKey] !== undefined) ? node.data[realKey] : defaultValue;
    inp.value = val;
    if (node.data) node.data[realKey] = val; 
    inp.oninput = function() { node.data[realKey] = this.value; };
    row.appendChild(inp);
    container.appendChild(row);
};

var createIOSelector = function(node, container, label, key, options) {
    var l = document.createElement('div'); l.innerText = label; l.style.fontSize = "7px"; l.style.marginTop = "4px"; l.style.color = "#0f9";
    var s = document.createElement('select'); s.style.width = "100%"; s.style.fontSize = "9px"; s.style.background = "#000"; s.style.color = "#fff";
    // FIX: Add class and alias for auto-refresh binding
    s.className = 'mozzi-inlet-val-input';
    s.setAttribute('data-alias', key);
    
    var realKey = "cfg_" + key;
    options.forEach(function(o) { var opt = document.createElement('option'); opt.value = o[0]; opt.innerText = o[1]; if(node.data[realKey] === o[0]) opt.selected = true; s.appendChild(opt); });
    s.onchange = function() { node.data[realKey] = this.value; if(node._syncHardwareUI) node._syncHardwareUI(); if(node._onDataUpdate) node._onDataUpdate(); };
    if(!node.data[realKey]) node.data[realKey] = options[0][0];
    container.appendChild(l); container.appendChild(s);
    return s;
};

// --- MUX 4051 ---
var muxOutlets = {};
for (var i=0; i<64; i++) muxOutlets["ch"+i] = { "type": "mozziflow/int16_t", "label": "ch"+i };

NodeLibrary.push({
    nodetype: 'mozziflow/mux4051',
    category: "input",
    nodeclass: "Mux4051",
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            if (!node.data.cfg_num_chips) node.data.cfg_num_chips = 1;
            var container = document.createElement('div');
            container.style.padding = "5px"; container.style.background = "rgba(0,255,153,0.05)";
            container.style.border = "1px solid #0f9"; container.style.marginBottom = "5px";
            
            createIOSelector(node, container, "READ MODE", "read_mode", [["standard", "Sync (Wait)"], ["mozzi", "Async (Mozzi)"]]);

            var syncVisibility = function() {
                var chips = parseInt(node.data.cfg_num_chips) || 1;
                var nElm = bodyElm;
                while (nElm && !nElm.classList.contains('rpd-node')) nElm = nElm.parentElement;
                if (!nElm) return;
                nElm.querySelectorAll('.rpd-outlet').forEach(function(row) {
                    var label = row.querySelector('.rpd-name');
                    if (label && label.innerText.indexOf('ch') === 0) {
                        var idx = parseInt(label.innerText.replace('ch', ''));
                        row.style.display = (idx < (chips * 8)) ? '' : 'none';
                    }
                });
                configBox.innerHTML = '';
                createArchInput("S0", node, "s0", "0", configBox, false);
                createArchInput("S1", node, "s1", "0", configBox, false);
                createArchInput("S2", node, "s2", "0", configBox, false);
                for(var k=0; k<chips; k++) { createArchInput("PIN"+k, node, "pin"+k, "0", configBox, false); }
            };
            var label = document.createElement('div');
            label.innerText = "CHIPS (x8):"; label.style.fontSize = "8px"; label.style.color = "#0f9";
            container.appendChild(label);
            var inp = document.createElement('input');
            inp.type = "number"; inp.min = 1; inp.max = 8; inp.style.width = "100%";
            inp.style.background = "#000"; inp.style.color = "#fff"; inp.style.fontSize = "10px";
            inp.value = node.data.cfg_num_chips;
            inp.onchange = function() { node.data.cfg_num_chips = parseInt(this.value); syncVisibility(); };
            container.appendChild(inp);
            var configBox = document.createElement('div');
            configBox.style.marginTop = "5px"; configBox.style.borderTop = "1px solid #333"; configBox.style.paddingTop = "5px";
            container.appendChild(configBox);
            bodyElm.appendChild(container);
            setTimeout(syncVisibility, 50);
        }
    },
        mozzi: { 
            rate: "control", includes: ["#include <mozzi_analog.h>"],
            global: function(n,v){
                var total = (parseInt(n.data.cfg_num_chips) || 1) * 8;
                return "int " + v + "_v[" + total + "] = {0}; uint8_t " + v + "_c = 0;"; 
            },
            setup: function(n,v,i) { return "pinMode(" + i.s0 + ", OUTPUT); pinMode(" + i.s1 + ", OUTPUT); pinMode(" + i.s2 + ", OUTPUT);"; },
            control: function(n,v,i) { 
                var num_chips = parseInt(n.data.cfg_num_chips) || 1;
                var isAsync = (n.data.cfg_read_mode === "mozzi");
                var code = "";
                for(var j=0; j<num_chips; j++) {
                    if (isAsync) code += "    " + v + "_v[" + (j*8) + " + " + v + "_c] = getMozziAnalogRead(" + i["pin"+j] + ");\n    startMozziAnalogRead(" + i["pin"+j] + ");\n";
                    else code += "    " + v + "_v[" + (j*8) + " + " + v + "_c] = mozziAnalogRead(" + i["pin"+j] + ");\n";
                }
                code += "    " + v + "_c++; if(" + v + "_c >= 8) " + v + "_c = 0;\n";
                code += "    digitalWrite(" + i.s0 + ", (" + v + "_c & 1)); digitalWrite(" + i.s1 + ", ((" + v + "_c >> 1) & 1)); digitalWrite(" + i.s2 + ", ((" + v + "_c >> 2) & 1));\n";
                for(var k=0; k<(num_chips*8); k++) { 
                    if (isWired(n.id, "ch" + k)) code += "    node_" + n.id + "_ch" + k + " = " + v + "_v[" + k + "];\n"; 
                } 
                return code.trim();
            } 
        },
        help: {
            summary: "CD4051 Multiplexer scanner.",
            usage: "Async mode uses Mozzi's non-blocking ADC queue (recommended).",
            inlets: { "s0-s2": "Address pins.", "pinX": "Analog pins." },
            outlets: { "chX": "16-bit analog value from channel X." }
        },
        rpdnode: { "title": "Mux 4051", "inlets": { "s0": {"type":"mozziflow/uint8_t","no_text":true}, "s1": {"type":"mozziflow/uint8_t","no_text":true}, "s2": {"type":"mozziflow/uint8_t","no_text":true}, "pin0":{"type":"mozziflow/uint8_t","no_text":true} }, "outlets": muxOutlets }
    });
    
    // --- SHIFT 595 (BITS) ---
    var shiftInletsBits = { "data":{"type":"mozziflow/uint8_t","no_text":true}, "latch":{"type":"mozziflow/uint8_t","no_text":true}, "clock":{"type":"mozziflow/uint8_t","no_text":true} };
    for (var i=0; i<64; i++) shiftInletsBits["b"+i] = { "type": "mozziflow/bool", "label": "b"+i, "no_text": true };
    
    NodeLibrary.push({
        nodetype: 'mozziflow/shift595_bits',
        category: "output",
        nodeclass: "Shift595Bits",
        renderer: {
            'html': function(bodyElm, node) {
                if (!node.data) node.data = {};
                if (!node.data.cfg_num_chips) node.data.cfg_num_chips = 1;
                var container = document.createElement('div');
                container.style.padding = "5px"; container.style.background = "rgba(0,255,153,0.05)";
                container.style.border = "1px solid #0f9"; container.style.marginBottom = "5px";
                var syncVisibility = function() {
                    var chips = parseInt(node.data.cfg_num_chips) || 1;
                    var nElm = bodyElm;
                    while (nElm && !nElm.classList.contains('rpd-node')) nElm = nElm.parentElement;
                    if (!nElm) return;
                    nElm.querySelectorAll('.rpd-inlet').forEach(function(row) {
                        var label = row.querySelector('.rpd-name');
                        if (label && label.innerText.indexOf('b') === 0) {
                            var idx = parseInt(label.innerText.replace('b', ''));
                            row.style.display = (idx < (chips * 8)) ? '' : 'none';
                        }
                    });
                    configBox.innerHTML = '';
                    createArchInput("DATA", node, "data", "0", configBox, false);
                    createArchInput("LATCH", node, "latch", "0", configBox, false);
                    createArchInput("CLOCK", node, "clock", "0", configBox, false);
                };
                var label = document.createElement('div');
                label.innerText = "CHIPS (x8):"; label.style.fontSize = "8px"; label.style.color = "#0f9";
                container.appendChild(label);
                var inp = document.createElement('input');
                inp.type = "number"; inp.min = 1; inp.max = 8; inp.style.width = "100%";
                inp.style.background = "#000"; inp.style.color = "#fff"; inp.style.fontSize = "10px";
                inp.value = node.data.cfg_num_chips;
                inp.onchange = function() { node.data.cfg_num_chips = parseInt(this.value); syncVisibility(); };
                container.appendChild(inp);
                var configBox = document.createElement('div');
                configBox.style.marginTop = "5px"; configBox.style.borderTop = "1px solid #333"; configBox.style.paddingTop = "5px";
                container.appendChild(configBox);
                bodyElm.appendChild(container);
                setTimeout(syncVisibility, 50);
            }
        },
        mozzi: {
            rate: "control", is_inline: true, is_sink: true,
            setup: function(n,v,i){ return "pinMode(" + i.data + ", OUTPUT); pinMode(" + i.latch + ", OUTPUT); pinMode(" + i.clock + ", OUTPUT);"; },
            control: function(n,v,i){ 
                var count = parseInt(n.data.cfg_num_chips) || 1;
                var code = "digitalWrite(" + i.latch + ", LOW);\n";
                for(var chip=count-1; chip>=0; chip--) {
                    code += "    { uint8_t b = 0; ";
                    for(var b=0; b<8; b++) { var idx = (chip * 8) + b; var bitVal = i["b"+idx] || "0"; code += "if(" + bitVal + ") b |= (1 << " + b + "); "; }
                    code += "shiftOut(" + i.data + ", " + i.clock + ", MSBFIRST, b); }\n";
                }
                code += "    digitalWrite(" + i.latch + ", HIGH);";
                return code;
            },
        },
        help: {
            summary: "74HC595 Shift Register bit output.",
            usage: "Connect DATA, LATCH, CLOCK to MCU. Send boolean values to b0...b63 to control digital pins or LEDs.",
            inlets: { "data/latch/clock": "MCU pins.", "bX": "Boolean values for bits." }
        },
        rpdnode: { "title": "Shift 595 (Bits)", "inlets": shiftInletsBits, "outlets": {} }
    });
    
    // --- DIGITAL OUTPUT ---
    NodeLibrary.push({
        nodetype: 'mozziflow/digital_out',
        category: "output",
        nodeclass: "DigitalOut",
        renderer: {
            'html': function(bodyElm, node) {
                if (!node.data) node.data = {};
                var container = document.createElement('div');
                container.style.padding = "5px"; container.style.background = "rgba(0,255,153,0.05)";
                container.style.border = "1px solid #0f9"; container.style.marginBottom = "5px";
                createArchInput("PIN", node, "pin", "0", container, false);
                bodyElm.appendChild(container);
            }
        },
        mozzi: {
            rate: "control", is_inline: true, is_sink: true,
            inputs: { "in": { type: "bool" }, "pin": { type: "uint8_t" } },
            setup: function(n,v,i){ return "pinMode(" + i.pin + ", OUTPUT);"; },
            control: function(n,v,i){ return "digitalWrite(" + i.pin + ", " + i.in + ");"; }
        },
        help: {
            summary: "Standard Arduino digitalWrite.",
            usage: "Sends a boolean signal to a physical MCU pin.",
            inlets: { "in": "Boolean signal.", "pin": "MCU Pin number." }
        },
        rpdnode: { "title": "Digital Out", "inlets": { "in": { "type": "mozziflow/bool" }, "pin": {"type":"mozziflow/uint8_t","no_text":true} }, "outlets": {} }
    });
    
    // --- ANALOG OUTPUT (PWM) ---
    NodeLibrary.push({
        nodetype: 'mozziflow/analog_out',
        category: "output",
        nodeclass: "AnalogOut",
        renderer: {
            'html': function(bodyElm, node) {
                if (!node.data) node.data = {};
                var container = document.createElement('div');
                container.style.padding = "5px"; container.style.background = "rgba(0,255,153,0.05)";
                container.style.border = "1px solid #0f9"; container.style.marginBottom = "5px";
                createArchInput("PIN", node, "pin", "0", container, false);
                bodyElm.appendChild(container);
            }
        },
        mozzi: {
            rate: "control", is_inline: true, is_sink: true,
            inputs: { "val": { type: "uint8_t" }, "pin": { type: "uint8_t" } },
            setup: function(n,v,i){ return "pinMode(" + i.pin + ", OUTPUT);"; },
            control: function(n,v,i){ return "analogWrite(" + i.pin + ", " + i.val + ");"; }
        },
        help: {
            summary: "Standard Arduino analogWrite (PWM).",
            usage: "Outputs a PWM signal (0-255) to a physical pin. Note: Not for audio, use for LEDs or motors.",
            inlets: { "val": "Byte value (0-255).", "pin": "MCU PWM-capable pin." }
        },
        rpdnode: { "title": "Analog Out (PWM)", "inlets": { "val": { "type": "mozziflow/uint8_t", "label": "val" }, "pin": {"type":"mozziflow/uint8_t","no_text":true} }, "outlets": {} }
    });
    
    // --- CONSTANT ---
    NodeLibrary.push({
        nodetype: 'mozziflow/constant',
        category: "input",
        nodeclass: "Constant",
        renderer: {
            'html': function(bodyElm, node) {
                if (!node.data) node.data = {};
                if (!node.data.cfg_val) node.data.cfg_val = "0";
                var container = document.createElement('div');
                container.style.padding = "2px";
                // Added: Type selector
                createIOSelector(node, container, "TYPE", "val_type", [["int", "Integer"], ["float", "Float"], ["sfix", "FixMath (16.16)"]]);
                var inp = document.createElement('input');
                inp.className = 'mozzi-constant-input'; inp.style.width = "100%";
                inp.style.background = "#000"; inp.style.color = "#0f9"; inp.style.fontSize = "10px";
                inp.value = node.data.cfg_val;
                inp.oninput = function() { node.data.cfg_val = this.value; };
                container.appendChild(inp);
                bodyElm.appendChild(container);
            }
        },
        mozzi: { 
            rate: "control", is_inline: true, 
            output_type: function(n) {
                var t = n.data.cfg_val_type || "int";
                if (t === "float") return "mozziflow/float";
                if (t === "sfix") return "mozziflow/sfix";
                return "mozziflow/int32_t";
            },
            control: function(n,v,i) { 
                var val = n.data.cfg_val || "0";
                return "node_" + n.id + "_out = " + val + ";"; 
            },
            audio: function(n,v,i) { 
                var val = n.data.cfg_val || "0";
                return "node_" + n.id + "_out = " + val + ";"; 
            }
        },
        help: {
            summary: "Fixed numeric value.",
            usage: "Type any number. Select type to avoid explicit casting nodes downstream.",
            outlets: { "out": "Value." }
        },
        rpdnode: { "title": "Constant", "outlets": { "out": { "type": "mozziflow/any" } } }
    });
    
    // --- ARDUINO ENCODER ---
    NodeLibrary.push({
        nodetype: 'mozziflow/arduino_encoder',
        category: "input",
        nodeclass: "ArduinoEncoder",
        renderer: {
            'html': function(bodyElm, node) {
                if (!node.data) node.data = {};
                var container = document.createElement('div');
                container.style.padding = "5px"; container.style.background = "rgba(0,255,153,0.05)";
                container.style.border = "1px solid #0f9"; container.style.marginBottom = "5px";
                createArchInput("PIN A", node, "pinA", "0", container, false);
                createArchInput("PIN B", node, "pinB", "0", container, false);
                bodyElm.appendChild(container);
            }
        },
        mozzi: { 
            rate: "control", 
            inputs: { "pinA": { type: "uint8_t" }, "pinB": { type: "uint8_t" } },
            global: function(n,v){ return "bool " + v + "_last;"; },
            setup: function(n,v,i) { return "pinMode(" + i.pinA + ", INPUT_PULLUP); pinMode(" + i.pinB + ", INPUT_PULLUP); " + v + "_last = digitalRead(" + i.pinA + ");"; },
            control: function(n,v,i) { 
                return "bool _cur = digitalRead(" + i.pinA + ");\n" + 
                       "node_" + n.id + "_up = 0; node_" + n.id + "_down = 0;\n" + 
                       "if (_cur != " + v + "_last && _cur == LOW) {\n" + 
                       "  if (digitalRead(" + i.pinB + ") != _cur) { node_" + n.id + "_up = 1; } else { node_" + n.id + "_down = 1; }\n" + 
                       "}\n" + v + "_last = _cur;";
            } 
        },
        help: {
            summary: "Incremental Rotary Encoder decoder.",
            usage: "Connect Pin A and Pin B of an encoder. Provides UP/DOWN pulses for menu navigation or value changes.",
            inlets: { "pinA/pinB": "MCU Pins." },
            outlets: { "up": "True pulse on CW rotation.", "down": "True pulse on CCW rotation." }
        },
        rpdnode: { "title": "Encoder", "inlets": { "pinA": { "type": "mozziflow/uint8_t", "label": "pinA" }, "pinB": { "type": "mozziflow/uint8_t", "label": "pinB" } }, "outlets": { "up": { "type": "mozziflow/bool" }, "down": { "type": "mozziflow/bool" } } }
    });
    
    // --- AUDIO OUT (MASTER) ---
    NodeLibrary.push({
        nodetype: 'mozziflow/out',
        category: "output",
        nodeclass: "AudioOutput",
        renderer: {
            'html': function(bodyElm, node) {
                if (!node.data) node.data = {};
                if (!node.data.cfg_arch) node.data.cfg_arch = "ch32x035";
                if (!node.data.cfg_mode) node.data.cfg_mode = "MOZZI_OUTPUT_PWM";
                if (!node.data.cfg_channels) node.data.cfg_channels = "MOZZI_MONO";
                if (!node.data.cfg_control_rate) node.data.cfg_control_rate = "64";
                if (!node.data.cfg_res) node.data.cfg_res = "auto";

                var container = document.createElement('div');
                container.style.border = "1px solid #0f9"; container.style.padding = "5px";
                container.style.background = "rgba(0,255,153,0.1)";
                
                var title = document.createElement('div');
                title.innerText = "MASTER SETUP"; title.style.fontSize = "8px"; title.style.color = "#0f9";
                title.style.textAlign = "center"; title.style.marginBottom = "5px";
                container.appendChild(title);
    
                var createSel = function(label, key, options, onChange) {
                    var l = document.createElement('div'); l.innerText = label; l.style.fontSize = "7px"; l.style.marginTop = "4px";
                    var s = document.createElement('select'); s.style.width = "100%"; s.style.fontSize = "9px"; s.style.background = "#000"; s.style.color = "#fff";
                    s.className = 'mozzi-inlet-val-input';
                    s.setAttribute('data-alias', key);
                    options.forEach(function(o) { var opt = document.createElement('option'); opt.value = o[0]; opt.innerText = o[1]; if(node.data["cfg_"+key] === o[0]) opt.selected = true; s.appendChild(opt); });
                    s.onchange = function() { node.data["cfg_"+key] = this.value; if(onChange) onChange(this.value); syncUI(); };
                    container.appendChild(l); container.appendChild(s);
                    return s;
                };
    
                var archSel = createSel("ARCHITECTURE", "arch", Object.keys(ARCH_DATA).map(function(k) { return [k, ARCH_DATA[k].name]; }), function(v){
                    node.data.cfg_mode = ARCH_DATA[v].modes[0][0]; 
                });
    
                var modeBox = document.createElement('div'); container.appendChild(modeBox);
                var chanBox = document.createElement('div'); container.appendChild(chanBox);
                
                // Added: Input Resolution Selector
                createIOSelector(node, container, "INPUT RESOLUTION", "res", [["auto", "Auto (Native)"], ["8bit", "8-bit Signal"], ["16bit", "16-bit Signal"]]);
                
                var rateSel = createSel("CONTROL RATE", "control_rate", [["64","64 Hz"],["128","128 Hz"],["256","256 Hz"],["512","512 Hz"],["1024","1024 Hz"]]);
                
                // Post-Gain master
                var gEnableRow = document.createElement('div'); gEnableRow.style.display = "flex"; gEnableRow.style.alignItems = "center"; gEnableRow.style.marginTop = "5px";
                var gChk = document.createElement('input'); gChk.type = "checkbox"; gChk.checked = (node.data.cfg_use_gain === "true");
                gChk.onchange = function() { node.data.cfg_use_gain = this.checked ? "true" : "false"; syncUI(); };
                var gLbl = document.createElement('span'); gLbl.innerText = " Post-Gain"; gLbl.style.fontSize = "7px";
                gEnableRow.appendChild(gChk); gEnableRow.appendChild(gLbl);
                container.appendChild(gEnableRow);
    
                var pinBox = document.createElement('div');
                pinBox.style.marginTop = "5px"; pinBox.style.borderTop = "1px solid #333";
                container.appendChild(pinBox);
    
                var syncUI = function() {
                    var arch = ARCH_DATA[node.data.cfg_arch];
                    modeBox.innerHTML = ''; chanBox.innerHTML = '';
                    
                    // Mode Select
                    var mSel = document.createElement('select'); mSel.style.width = "100%"; mSel.style.fontSize = "9px"; mSel.style.background = "#000"; mSel.style.color = "#fff";
                    arch.modes.forEach(function(o) { var opt = document.createElement('option'); opt.value = o[0]; opt.innerText = o[1]; if(node.data.cfg_mode === o[0]) opt.selected = true; mSel.appendChild(opt); });
                    mSel.onchange = function() { node.data.cfg_mode = this.value; syncUI(); };
                    var mLbl = document.createElement('div'); mLbl.innerText = "OUTPUT MODE"; mLbl.style.fontSize = "7px"; mLbl.style.marginTop = "4px";
                    modeBox.appendChild(mLbl); modeBox.appendChild(mSel);
    
                    // Channels Select (Filtered)
                    var currentMode = node.data.cfg_mode;
                    var isMonoOnly = (arch.mono_only === true);
                    if (!isMonoOnly && Array.isArray(arch.mono_only)) {
                        for(var m=0; m<arch.mono_only.length; m++) {
                            if (arch.mono_only[m] === currentMode) { isMonoOnly = true; break; }
                        }
                    }
    
                    if (isMonoOnly) node.data.cfg_channels = "MOZZI_MONO";
                    var cSel = document.createElement('select'); cSel.style.width = "100%"; cSel.style.fontSize = "9px"; cSel.style.background = "#000"; cSel.style.color = "#fff";
                    
                    var optMono = document.createElement('option'); optMono.value = "MOZZI_MONO"; optMono.innerText = "Mono";
                    if(node.data.cfg_channels === "MOZZI_MONO") optMono.selected = true;
                    cSel.appendChild(optMono);
    
                    if (!isMonoOnly) {
                        var optStereo = document.createElement('option'); optStereo.value = "MOZZI_STEREO"; optStereo.innerText = "Stereo";
                        if(node.data.cfg_channels === "MOZZI_STEREO") optStereo.selected = true;
                        cSel.appendChild(optStereo);
                    } else {
                        cSel.disabled = true;
                        cSel.style.color = "#666";
                    }
    
                    cSel.onchange = function() { node.data.cfg_channels = this.value; syncUI(); };
                    var cLbl = document.createElement('div'); cLbl.innerText = "CHANNELS" + (isMonoOnly ? " (HW FIXED)" : ""); cLbl.style.fontSize = "7px"; cLbl.style.marginTop = "4px"; if(isMonoOnly) cLbl.style.color = "#f33";
                    chanBox.appendChild(cLbl); chanBox.appendChild(cSel);
    
                    // Pin Config
                    pinBox.innerHTML = '';
                    if (node.data.cfg_use_gain === "true") createArchInput("GAIN MUL", node, "post_gain", "1.0", pinBox, false);
    
                    var mode = node.data.cfg_mode;
                    var checkFixed = function(k) { return arch.fixed.indexOf(k) !== -1; };
    
                    if (mode === "MOZZI_OUTPUT_PWM") {
                        createArchInput("PIN L", node, "pin_1", arch.pins.pwm1, pinBox, checkFixed("pwm1"));
                        if (node.data.cfg_channels === "MOZZI_STEREO") createArchInput("PIN R", node, "pin_2", arch.pins.pwm2, pinBox, checkFixed("pwm2"));
                    } else if (mode === "MOZZI_OUTPUT_2PIN_PWM") {
                        createArchInput("PIN HIGH", node, "pin_1", arch.pins.pwm1, pinBox, checkFixed("pwm1"));
                        createArchInput("PIN LOW", node, "pin_2", arch.pins.pwm1_low || arch.pins.pwm2, pinBox, checkFixed("pwm1_low") || checkFixed("pwm2"));
                    } else if (mode === "MOZZI_OUTPUT_INTERNAL_DAC") {
                        createArchInput("DAC 1", node, "pin_1", arch.pins.dac1, pinBox, true);
                        if ((node.data.cfg_channels === "MOZZI_STEREO") && arch.pins.dac2) createArchInput("DAC 2", node, "pin_2", arch.pins.dac2, pinBox, true);
                    } else if (mode === "MOZZI_OUTPUT_I2S_DAC" || mode === "MOZZI_OUTPUT_PDM_VIA_I2S") {
                        if(mode === "MOZZI_OUTPUT_I2S_DAC") {
                            var fl = document.createElement('div'); fl.innerText = "I2S FORMAT"; fl.style.fontSize = "7px"; fl.style.marginTop = "4px";
                            var fs = document.createElement('select'); fs.style.width = "100%"; fs.style.fontSize = "9px"; fs.style.background = "#000"; fs.style.color = "#fff";
                            [["MOZZI_I2S_FORMAT_PLAIN", "Standard"], ["MOZZI_I2S_FORMAT_LSBJ", "LSBJ (PT8211)"]].forEach(function(o) { var opt = document.createElement('option'); opt.value = o[0]; opt.innerText = o[1]; if(node.data.cfg_i2s_format === o[0]) opt.selected = true; fs.appendChild(opt); });
                            fs.onchange = function() { node.data.cfg_i2s_format = this.value; };
                            pinBox.appendChild(fl); pinBox.appendChild(fs);
                        }
                        createArchInput("BCK", node, "pin_bck", arch.pins.i2s_bck, pinBox, checkFixed("i2s_bck"));
                        createArchInput("WS", node, "pin_ws", arch.pins.i2s_ws, pinBox, checkFixed("i2s_ws") || (node.data.cfg_arch === "rp2040"));
                        createArchInput("DATA", node, "pin_data", arch.pins.i2s_data, pinBox, checkFixed("i2s_data"));
                    } else if (mode === "MOZZI_OUTPUT_PDM_VIA_SERIAL") {
                        createArchInput("TX PIN", node, "pin_tx", arch.pins.serial_tx, pinBox, checkFixed("serial_tx"));
                    } else if (mode === "EXTERNAL_PT8211_SPI") {
                        createArchInput("WS PIN", node, "pin_ws", arch.pins.ws, pinBox, false);
                        var info = document.createElement('div'); info.innerText = "BCK->SCK | DIN->MOSI"; info.style.fontSize = "7px"; info.style.color = "#666"; pinBox.appendChild(info);
                    }
                    
                    var note = document.createElement('div');
                    note.innerText = arch.notes; note.style.fontSize = "7px"; note.style.color = "#f90"; note.style.marginTop = "5px"; note.style.fontStyle = "italic";
                    pinBox.appendChild(note);
                };
    
                bodyElm.appendChild(container);
                node._syncHardwareUI = syncUI;
                syncUI();
            }
        },
        mozzi: {
            rate: "audio", is_sink: true,
            includes: ["#include <Mozzi.h>"],
            inputs: {
                "in": { type: "int32_t" },
                "in_r": { type: "int32_t" }
            },
            audio: function(n, v, i) {
                var res = n.data.cfg_res || "auto";
                var method = (res === "8bit") ? "from8Bit" : ((res === "16bit") ? "from16Bit" : "");
                var inL = i.in || "0";
                var inR = i.in_r || "0";

                if (n.data.cfg_channels === "MOZZI_STEREO") {
                    if (method) return "return StereoOutput::" + method + "(" + inL + ", " + inR + ").clip();";
                    return "return StereoOutput(" + inL + ", " + inR + ").clip();";
                } else {
                    if (method) return "return MonoOutput::" + method + "(" + inL + ").clip();";
                    return "return MonoOutput(" + inL + ").clip();";
                }
            }
        },
        help: {
            summary: "Master Output and Hardware Configurator.",
            usage: "Use 'INPUT RESOLUTION' to match your signal chain (8-bit vs 16-bit). This ensures correct volume on any hardware.",
            inlets: { "in": "Left/Mono audio signal.", "in_r": "Right audio signal (Stereo modes)." }
        },
        rpdnode: { "title": "Audio Out", "inlets": { "in": { "type": "mozziflow/any", "label": "L/Mono" }, "in_r": { "type": "mozziflow/any", "label": "Right" } } }
    });
    
    // --- ARDUINO BUTTON ---
    NodeLibrary.push({
        nodetype: 'mozziflow/arduino_button',
        category: "input",
        nodeclass: "ArduinoButton",
        renderer: {
            'html': function(bodyElm, node) {
                if (!node.data) node.data = {};
                var container = document.createElement('div');
                container.style.padding = "5px"; container.style.background = "rgba(0,255,153,0.05)";
                container.style.border = "1px solid #0f9"; container.style.marginBottom = "5px";
                createArchInput("PIN", node, "pin", "0", container, false);
                bodyElm.appendChild(container);
            }
        },
        mozzi: { 
            rate: "control", is_inline: true, 
            inputs: { "pin": { type: "uint8_t" } },
            setup: function(n,v,i){ return "pinMode(" + i.pin + ", INPUT_PULLUP);"; }, 
            control: function(n,v,i){ return "node_" + n.id + "_out = (digitalRead(" + i.pin + ") == LOW);"; } 
        },
        help: {
            summary: "Physical button input using internal pull-up.",
            usage: "Connect a button between a pin and Ground. Outputs True when pressed.",
            inlets: { "pin": "MCU digital pin." },
            outlets: { "out": "Boolean status." }
        },
        rpdnode: { "title": "Button", "inlets": { "pin": { "type": "mozziflow/uint8_t", "label": "pin" } }, "outlets": { "out": { "type": "mozziflow/bool" } } }
    });
    
    // --- ANALOG INPUT ---
    NodeLibrary.push({
        nodetype: 'mozziflow/analog',
        category: "input",
        nodeclass: "AnalogInput",
        renderer: {
            'html': function(bodyElm, node) {
                if (!node.data) node.data = {};
                var container = document.createElement('div');
                container.style.padding = "5px"; container.style.background = "rgba(0,255,153,0.05)";
                container.style.border = "1px solid #0f9"; container.style.marginBottom = "5px";
                
                createIOSelector(node, container, "READ MODE", "read_mode", [["standard", "Standard"], ["mozzi", "Mozzi Async"]]);
                
                createArchInput("PIN", node, "pin", "0", container, false);
                bodyElm.appendChild(container);
            }
        },
        mozzi: {
            rate: "control",
            includes: ["#include <mozzi_analog.h>"],
            inputs: { "pin": { type: "uint8_t" } },
            control: function(n,v,i){ 
                if (n.data.cfg_read_mode === "mozzi") return "node_" + n.id + "_out = getMozziAnalogRead(" + i.pin + ");\nstartMozziAnalogRead(" + i.pin + ");";
                return "node_" + n.id + "_out = mozziAnalogRead(" + i.pin + ");"; 
            }
        },
        help: {
            summary: "Physical analog potentiometer/sensor input.",
            usage: "Standard uses blocking read. Mozzi Async uses non-blocking queue (smoother audio).",
            inlets: { "pin": "MCU analog-capable pin." },
            outlets: { "out": "16-bit analog value." }
        },
        rpdnode: { "title": "Analog Input", "inlets": { "pin": { "type": "mozziflow/uint8_t", "label": "pin" } }, "outlets": { "out": { "type": "mozziflow/int16_t" } } }
    });