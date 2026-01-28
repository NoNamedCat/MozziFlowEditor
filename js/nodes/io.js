// Mozzi Node Definitions - IO (Iron Integrity v111.35)
// Technical Type Colors - No functional labels

NodeLibrary.push({
    nodetype: 'input/mozzi_analog_read',
    nodeclass: "MozziAnalogRead",
    mozzi: { 
        rate: "control", 
        is_inline: true,
        includes: ["#include <mozzi_analog.h>"], 
        control: function(n,v,i) { return "mozziAnalogRead((uint8_t)" + i.pin + ")"; } 
    },
    rpdnode: { "title": "Analog Input", "inlets": { "pin": { "type": "mozziflow/uint8", "label": "pin" } }, "outlets": { "out": { "type": "mozziflow/long" } } }
});

NodeLibrary.push({
    nodetype: 'input/constant',
    mozzi: { rate: "control", is_inline: true, control: function(n,v,i) { return (n.data && n.data.val) ? n.data.val : "0"; } },
    rpdnode: { "title": "Constant", "inlets": { "val": { "type": "mozziflow/long", "default": "0", "hidden": true } }, "outlets": { "out": { "type": "mozziflow/long" } } }
});

NodeLibrary.push({
    nodetype: 'input/arduino_button',
    nodeclass: "ArduinoButton",
    mozzi: { rate: "control", is_inline: true, setup: function(n,v,i){ return "pinMode("+i.pin+", INPUT_PULLUP);"; }, control: function(n,v,i){ return "digitalRead("+i.pin+") == LOW ? 255 : 0"; } },
    rpdnode: { "title": "Button", "inlets": { "pin": { "type": "mozziflow/uint8", "is_control": true, "label": "pin" } }, "outlets": { "out": { "type": "mozziflow/bool" } } }
});

NodeLibrary.push({
    nodetype: 'input/arduino_encoder',
    nodeclass: "ArduinoEncoder",
    mozzi: { 
        rate: "control", 
        global: function(n,v){ return "bool "+v+"_last;"; },
        setup: function(n,v,i) { return "pinMode("+i.pinA+", INPUT_PULLUP); pinMode("+i.pinB+", INPUT_PULLUP); "+v+"_last = digitalRead("+i.pinA+");"; },
        control: function(n,v,i) { 
            return "bool "+v+"_cur = digitalRead("+i.pinA+");\n" +
                   "node_"+n.id+"_up = 0; node_"+n.id+"_down = 0;\n" +
                   "if ("+v+"_cur != "+v+"_last && "+v+"_cur == LOW) {\n" +
                   "  if (digitalRead("+i.pinB+") != "+v+"_cur) { node_"+n.id+"_up = 255; } else { node_"+n.id+"_down = 255; }\n" +
                   "}\n"+v+"_last = "+v+"_cur;";
        } 
    },
    rpdnode: { "title": "Encoder", "inlets": { "pinA": { "type": "mozziflow/uint8", "is_control": true, "label": "pinA" }, "pinB": { "type": "mozziflow/uint8", "is_control": true, "label": "pinB" } }, "outlets": { "up": { "type": "mozziflow/bool" }, "down": { "type": "mozziflow/bool" } } }
});

[1, 2, 3, 4].forEach(idx => {
    NodeLibrary.push({
        nodetype: 'input/mux4051_' + idx,
        nodeclass: "Mux4051_" + idx,
        mozzi: { 
            rate: "control", 
            includes: ["#include <mozzi_analog.h>"],
            global: function(n,v){ return "int "+v+"_v[8]; byte "+v+"_c = 0;"; },
            setup: function(n,v,i) { return "pinMode("+i.s0+", OUTPUT); pinMode("+i.s1+", OUTPUT); pinMode("+i.s2+", OUTPUT);"; },
            control: function(n,v,i) { 
                var code = "";
                code += v + "_v[" + v + "_c] = mozziAnalogRead(" + i.pin + ");\n        ";
                code += v + "_c++; if(" + v + "_c > 7) " + v + "_c = 0;\n        ";
                code += "digitalWrite(" + i.s0 + ", (" + v + "_c & 1)); digitalWrite(" + i.s1 + ", ((" + v + "_c >> 1) & 1)); digitalWrite(" + i.s2 + ", ((" + v + "_c >> 2) & 1));\n        ";
                for(var c=0; c<8; c++) { code += "node_" + n.id + "_ch" + c + " = " + v + "_v[" + c + "]; "; } 
                return code.trim();
            } 
        },
        rpdnode: { "title": "Mux 4051 (" + idx + ")", "inlets": { "s0": { "type": "mozziflow/uint8", "label": "s0" }, "s1": { "type": "mozziflow/uint8", "label": "s1" }, "s2": { "type": "mozziflow/uint8", "label": "s2" }, "pin": { "type": "mozziflow/uint8", "label": "pin" } }, "outlets": { "ch0": { "type": "mozziflow/long" }, "ch1": { "type": "mozziflow/long" }, "ch2": { "type": "mozziflow/long" }, "ch3": { "type": "mozziflow/long" }, "ch4": { "type": "mozziflow/long" }, "ch5": { "type": "mozziflow/long" }, "ch6": { "type": "mozziflow/long" }, "ch7": { "type": "mozziflow/long" } } }
    });
});

[1, 2, 3, 4].forEach(num => {
    var inlets = { "data_pin": { "type": "mozziflow/uint8", "label": "data" }, "latch": { "type": "mozziflow/uint8", "label": "latch" }, "clock": { "type": "mozziflow/uint8", "label": "clock" } };
    for(var b=0; b<num; b++) inlets["bits"+b] = { "type": "mozziflow/uint8", "label": "bits"+b };
    NodeLibrary.push({
        nodetype: 'output/arduino_shift595_' + num,
        nodeclass: "ArduinoShift595_" + num,
        mozzi: {
            rate: "control", is_inline: true,
            setup: function(n,v,i){ return "pinMode("+i.data_pin+", OUTPUT); pinMode("+i.latch+", OUTPUT); pinMode("+i.clock+", OUTPUT);"; },
            control: function(n,v,i){ 
                var shifts = "";
                for(var b=num-1; b>=0; b--) shifts += "shiftOut("+i.data_pin+", "+i.clock+", MSBFIRST, (uint8_t)"+i["bits"+b]+"); ";
                return "digitalWrite("+i.latch+", LOW); " + shifts + "digitalWrite("+i.latch+", HIGH);"; 
            },
        },
        rpdnode: { "title": "Shift 595 (" + num + ")", "inlets": inlets }
    });
});

NodeLibrary.push({
    nodetype: 'output/arduino_digital_write',
    nodeclass: "ArduinoDigitalWrite",
    mozzi: { 
        rate: "control", 
        is_inline: true,
        setup: function(n,v,i){ return "pinMode("+i.pin+", OUTPUT);"; },
        control: function(n,v,i) { return "digitalWrite((uint8_t)" + i.pin + ", (long)" + i.val + " > 0 ? HIGH : LOW)"; } 
    },
    rpdnode: { "title": "Digital Write", "inlets": { "pin": { "type": "mozziflow/uint8", "label": "pin" }, "val": { "type": "mozziflow/bool", "label": "val" } } }
});

NodeLibrary.push({
    nodetype: 'output/arduino_analog_write',
    nodeclass: "ArduinoAnalogWrite",
    mozzi: { 
        rate: "control", 
        is_inline: true,
        setup: function(n,v,i){ return "pinMode("+i.pin+", OUTPUT);"; },
        control: function(n,v,i) { return "analogWrite((uint8_t)" + i.pin + ", (int)" + i.val + ")"; } 
    },
    rpdnode: { "title": "Analog Write (PWM)", "inlets": { "pin": { "type": "mozziflow/uint8", "label": "pin" }, "val": { "type": "mozziflow/uint8", "label": "val" } } }
});

NodeLibrary.push({
    nodetype: 'output/mozzi_master',
    nodeclass: "MozziMaster",
    renderer: {
        'html': function(bodyElm, node) {
            if (!node.data) node.data = {};
            if (!node.data.channels) node.data.channels = "MOZZI_MONO";
            if (!node.data.mode) node.data.mode = "MOZZI_OUTPUT_PWM";
            if (!node.data.resolution) node.data.resolution = "8bit";
            
            if (!node._ui_master) {
                var container = document.createElement('div');
                container.style.padding = "5px"; container.style.fontSize = "9px";
                
                // Channel Selector
                var labelChan = document.createElement('div'); labelChan.innerText = "Channels:";
                var selChan = document.createElement('select'); selChan.style.width = "100%";
                [["Mono", "MOZZI_MONO"], ["Stereo", "MOZZI_STEREO"]].forEach(opt => {
                    var o = document.createElement('option'); o.value = opt[1]; o.innerText = opt[0];
                    if (node.data.channels === opt[1]) o.selected = true;
                    selChan.appendChild(o);
                });
                selChan.onchange = function() { node.data.channels = this.value; };
                
                // Resolution Selector
                var labelRes = document.createElement('div'); labelRes.innerText = "Output Resolution:";
                var selRes = document.createElement('select'); selRes.style.width = "100%";
                [["8-bit", "8bit"], ["16-bit", "16bit"], ["32-bit (SFix)", "32bit"]].forEach(opt => {
                    var o = document.createElement('option'); o.value = opt[1]; o.innerText = opt[0];
                    if (node.data.resolution === opt[1]) o.selected = true;
                    selRes.appendChild(o);
                });
                selRes.onchange = function() { node.data.resolution = this.value; };

                // Mode Selector
                var labelMode = document.createElement('div'); labelMode.innerText = "Hardware Mode:";
                var selMode = document.createElement('select'); selMode.style.width = "100%";
                [
                    ["PWM (1-pin)", "MOZZI_OUTPUT_PWM"],
                    ["PWM (2-pin / Hi-Fi)", "MOZZI_OUTPUT_2PIN_PWM"],
                    ["Internal DAC", "MOZZI_OUTPUT_INTERNAL_DAC"],
                    ["I2S External DAC", "MOZZI_OUTPUT_I2S_DAC"],
                    ["PDM via I2S", "MOZZI_OUTPUT_PDM_VIA_I2S"],
                    ["Custom External", "MOZZI_OUTPUT_EXTERNAL_CUSTOM"]
                ].forEach(opt => {
                    var o = document.createElement('option'); o.value = opt[1]; o.innerText = opt[0];
                    if (node.data.mode === opt[1]) o.selected = true;
                    selMode.appendChild(o);
                });
                selMode.onchange = function() { node.data.mode = this.value; };

                container.appendChild(labelChan); container.appendChild(selChan);
                container.appendChild(labelRes); container.appendChild(selRes);
                container.appendChild(labelMode); container.appendChild(selMode);
                bodyElm.appendChild(container);
                node._ui_master = true;
            }
        }
    },
    mozzi: { 
        rate: "audio", is_inline: true, 
        audio: function(n,v,i){ 
            var isStereo = (i.l && i.l.includes("node_")) || (i.r && i.r.includes("node_"));
            var res = (n.data && n.data.resolution) ? n.data.resolution : "8bit";
            
            var render = function(sig) {
                if (res === "8bit") return "MonoOutput::from8Bit((int)"+sig+")";
                if (res === "16bit") return "MonoOutput::from16Bit((int)"+sig+")";
                return "MonoOutput::fromSFix(SFix<15,16>("+sig+", true))";
            };

            if (isStereo) {
                var left = i.l || "0";
                var right = i.r || "0";
                if (res === "32bit") return "StereoOutput::fromSFix(SFix<15,16>("+left+", true), SFix<15,16>("+right+", true))";
                if (res === "16bit") return "StereoOutput::from16Bit((int)"+left+", (int)"+right+")";
                return "StereoOutput::from8Bit((int)"+left+", (int)"+right+")";
            } else {
                return render(i.audio_in || "0");
            }
        } 
    },
    rpdnode: { 
        "title": "Master Output", 
        "inlets": { 
            "audio_in": { "type": "mozziflow/long", "label": "mono" },
            "l": { "type": "mozziflow/long", "label": "L" }, 
            "r": { "type": "mozziflow/long", "label": "R" } 
        } 
    }
});
