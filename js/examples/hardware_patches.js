// MozziFlow Examples - HARDWARE CATEGORY (v8.0 Professional Suite)
// Direct MCU Interaction and External Component Control

EXAMPLES['hw_pot_vol_control'] = {
    category: "HARDWARE", title: "Analog Volume Control",
    description: "Connect a Potentiometer to Pin A0 to control output volume. Uses Mozzi Async for smooth audio.",
    code: `v2.1.1
network/add-patch root root
patch/open root
patch/add-node root pot mozziflow/analog Pot%20In
node/move pot 100 250
node/set-data pot eyJjZmdfcmVhZF9tb2RlIjoibW96emkiLCJjZmdfcGluIjoiQTAifQ==
patch/add-node root osc mozziflow/sin Wave
node/move osc 100 50
patch/add-node root vca mozziflow/vca Master%20Amp
node/move vca 400 150
patch/add-node root out mozziflow/out Audio%20Out
node/move out 700 150
node/set-data out eyJjZmdfY29udHJvbF9yYXRlIjoiMjU2IiwiY2ZnX3JlcyI6IjhiaXQifQ==
outlet/connect pot:out vca:cv
outlet/connect osc:out vca:in
outlet/connect vca:out out:in`
};

EXAMPLES['hw_encoder_freq'] = {
    category: "HARDWARE", title: "Encoder Freq Tuner",
    description: "Use a Rotary Encoder to tune an oscillator. Demonstrates Counter and Encoder integration.",
    code: `v2.1.1
network/add-patch root root
patch/open root
patch/add-node root enc mozziflow/arduino_encoder Encoder
node/move enc 50 100
node/set-data enc eyJjZmdfcGluQSI6IjIiLCJjZmdfcGluQiI6IjMifQ==
patch/add-node root cnt mozziflow/counter Tuner
node/move cnt 300 100
node/set-data cnt eyJjZmdfbWF4IjoiMTAwMCJ9
patch/add-node root map mozziflow/map Scale
node/move map 550 100
node/set-data map eyJjZmdfb3V0X21pbiI6IjExMCIsImNmZ19vdXRfbWF4IjoiODgwIn0=
patch/add-node root osc mozziflow/sin Sine
node/move osc 800 100
patch/add-node root out mozziflow/out Audio%20Out
node/move out 1050 100
node/set-data out eyJjZmdfY29udHJvbF9yYXRlIjoiMjU2IiwiY2ZnX3JlcyI6IjhiaXQifQ==
outlet/connect enc:up cnt:up
outlet/connect enc:down cnt:down
outlet/connect cnt:out map:in
outlet/connect map:out osc:freq
outlet/connect osc:out out:in`
};

EXAMPLES['hw_usb_plotter_debug'] = {
    category: "HARDWARE", title: "ADSR Debug Plotter",
    description: "Sends ADSR envelope data over USB to the Arduino Serial Plotter. Useful for visual calibration.",
    code: `v2.1.1
network/add-patch root root
patch/open root
patch/add-node root clk mozziflow/metronome Metronome
node/move clk 50 100
patch/add-node root env mozziflow/adsr ADSR
node/move env 300 100
patch/add-node root plot mozziflow/ch32_usb_plotter USB%20Plotter
node/move plot 600 100
node/set-data plot eyJjZmdfbnVtX2NoIjoxfQ==
patch/add-node root out mozziflow/out Audio%20Out
node/move out 850 100
node/set-data out eyJjZmdfY29udHJvbF9yYXRlIjoiMjU2In0=
outlet/connect clk:out env:trig
outlet/connect env:out plot:val0`
};

EXAMPLES['hw_pot_filter'] = {
    category: "HARDWARE", title: "Physical Pot Filter",
    description: "Connect a 10k potentiometer to pin A0 (PA0) to control the cutoff of a Sawtooth bass synth.",
    code: `v2.1.1
network/add-patch root root
patch/open root
patch/add-node root pot mozziflow/analog Pot%20(A0)
node/move pot 120 250
node/set-data pot eyJjZmdfcGluIjoiNDAiLCJjZmdfcmVhZF9tb2RlIjoibW96emkifQ==
patch/add-node root map mozziflow/map Scale%20Freq
node/move map 320 250
node/set-data map eyJjZmdfaW5fbWluIjoiMCIsImNmZ19pbl9tYXgiOiIxMDIzIiwiY2ZnX291dF9taW4iOiI0MDAiLCJjZmdfb3V0X21heCI6IjgwMDAifQ==
patch/add-node root osc mozziflow/saw Saw%20Bass
node/move osc 120 100
node/set-data osc eyJjZmdfZnJlcSI6IjU1LjBmIiwicmF0ZV9tb2RlIjoyfQ==
patch/add-node root filter mozziflow/lpf Filter
node/move filter 520 100
node/set-data filter eyJjZmdfcHJlY2lzaW9uIjoiaW50MTZfdCIsInJhdGVfbW9kZSI6Mn0=
patch/add-node root out mozziflow/out Audio%20Out
node/move out 720 100
node/set-data out eyJjZmdfY29udHJvbF9yYXRlIjoiMjU2IiwiY2ZnX3JlcyI6IjhiaXQifQ==
outlet/connect pot:out map:in
outlet/connect map:out filter:cutoff
outlet/connect osc:out filter:in
outlet/connect filter:out out:in`
};
