// Mozzi Node Definitions - IO (Iron Integrity v111.9)
NodeLibrary.push({
    nodetype: 'input/constant',
    mozzi: { rate: "control", is_inline: true, control: function(n,v,i) { return (n.data && n.data.val) ? n.data.val : "0"; } },
    rpdnode: { "title": "Constant", "inlets": { "val": { "type": "mozziflow/any", "color": "control", "default": "0", "hidden": true } }, "outlets": { "out": { "type": "mozziflow/any", "color": "control" } } }
});

NodeLibrary.push({
    nodetype: 'input/arduino_button',
    nodeclass: "ArduinoButton",
    mozzi: { rate: "control", is_inline: true, setup: function(n,v,i){ return "pinMode("+i.pin+", INPUT_PULLUP);"; }, control: function(n,v,i){ return "digitalRead("+i.pin+") == LOW ? 255 : 0"; } },
    rpdnode: { "title": "Button", "inlets": { "pin": { "type": "mozziflow/any", "is_control": true, "color": "control" } }, "outlets": { "out": { "type": "mozziflow/any", "color": "logic" } } }
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
    rpdnode: { "title": "Encoder", "inlets": { "pinA": { "type": "mozziflow/any", "is_control": true, "color": "control" }, "pinB": { "type": "mozziflow/any", "is_control": true, "color": "control" } }, "outlets": { "up": { "type": "mozziflow/any", "color": "logic" }, "down": { "type": "mozziflow/any", "color": "logic" } } }
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
        rpdnode: { "title": "Mux 4051 (" + idx + ")", "inlets": { "s0": { "type": "mozziflow/any", "color": "control" }, "s1": { "type": "mozziflow/any", "color": "control" }, "s2": { "type": "mozziflow/any", "color": "control" }, "pin": { "type": "mozziflow/any", "color": "control" } }, "outlets": { "ch0": { "type": "mozziflow/any", "color": "control" }, "ch1": { "type": "mozziflow/any", "color": "control" }, "ch2": { "type": "mozziflow/any", "color": "control" }, "ch3": { "type": "mozziflow/any", "color": "control" }, "ch4": { "type": "mozziflow/any", "color": "control" }, "ch5": { "type": "mozziflow/any", "color": "control" }, "ch6": { "type": "mozziflow/any", "color": "control" }, "ch7": { "type": "mozziflow/any", "color": "control" } } }
    });
});

[1, 2, 3, 4].forEach(num => {
    var inlets = { "data_pin": { "type": "mozziflow/any", "color": "control" }, "latch": { "type": "mozziflow/any", "color": "control" }, "clock": { "type": "mozziflow/any", "color": "control" } };
    for(var b=0; b<num; b++) inlets["bits"+b] = { "type": "mozziflow/any", "color": "control" };
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
    nodetype: 'output/mozzi_out',
    nodeclass: "MozziOut",
    mozzi: { rate: "audio", is_inline: true, audio: function(n,v,i){ return "MonoOutput::from8Bit((int)"+i.audio_in+")"; } },
    rpdnode: { "title": "Output", "inlets": { "audio_in": { "type": "mozziflow/any", "color": "audio" } } }
});
NodeLibrary.push({ nodetype: 'output/mozzi_output', nodeclass: "MozziOut", mozzi: { rate: "audio", is_inline: true, audio: function(n,v,i){ return "MonoOutput::from8Bit((int)"+i.audio_in+")"; } }, rpdnode: { "title": "Output (Legacy)", "inlets": { "audio_in": { "type": "mozziflow/any", "color": "audio" } } } });