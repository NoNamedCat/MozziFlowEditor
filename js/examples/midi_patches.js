// MozziFlow Examples - MIDI CATEGORY (v7.5 Modern Architecture)
EXAMPLES['midi_basic'] = {
    category: "MIDI", title: "USB MIDI Mono Synth",
    description: "Connect your keyboard! Uses FixMath for ultra-fast frequency modulation.",
    code: `v2.1.1
network/add-patch root root
patch/open root
patch/add-node root m1 mozziflow/ch32_midi_note_in MIDI%20Note%20In
node/move m1 50 150
node/set-data m1 eyJjZmdfZnJlcV90eXBlIjoiUTE2bjE2In0=
patch/add-node root o1 mozziflow/sin Sine
node/move o1 350 100
node/set-data o1 eyJjZmdfZnJlcV9tb2RlIjoiZml4ZWQifQ==
patch/add-node root a1 mozziflow/adsr ADSR
node/move a1 350 300
node/set-data a1 eyJjZmdfbGVycCI6Ik1PWlpJX0FVRElPX1JBVEUifQ==
patch/add-node root vca mozziflow/vca VCA
node/move vca 600 150
node/set-data vca eyJjZmdfZG9tYWluIjoiaW50In0=
patch/add-node root out mozziflow/out Audio%20Out
node/move out 850 150
node/set-data out eyJjZmdfcmVzIjoiOGJpdCJ9
outlet/connect m1:f0 o1:freq
outlet/connect m1:g0 a1:trig
outlet/connect o1:out vca:in
outlet/connect a1:out vca:cv
outlet/connect vca:out out:in`
};

EXAMPLES['midi_controller'] = {
    category: "MIDI", title: "USB MIDI Controller Out",
    description: "Use your CH32 as a MIDI knob! Analog Input -> MIDI CC Out.",
    code: `v2.1.1
network/add-patch root root
patch/open root
patch/add-node root a1 mozziflow/analog Analog%20Input
node/move a1 100 100
node/set-data a1 eyJjZmdfcmVhZF9tb2RlIjoibW96emkifQ==
patch/add-node root c1 mozziflow/to_int8 To%20Int8
node/move c1 350 100
patch/add-node root out mozziflow/ch32_midi_cc_out MIDI%20CC%20Out
node/move out 600 100
node/set-data out eyJjZmdfY2MiOiI3In0=
outlet/connect a1:out c1:in
outlet/connect c1:out out:val`
};