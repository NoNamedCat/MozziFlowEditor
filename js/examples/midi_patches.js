// MozziFlow Examples - MIDI CATEGORY (v8.5 Pro-Spec Fixed)
// Rebuilt by the maricón de mierda. Full Audio-Rate chains for smooth ADSR.

EXAMPLES['midi_mono_ch1'] = {
    category: "MIDI", title: "Monophonic Synth (Ch 1)",
    description: "High-quality monophonic lead. ADSR interpolated at Audio Rate for smooth response. Responds only to Channel 1.",
    code: `v2.1.1
network/add-patch root root
patch/open root
patch/add-node root midi mozziflow/ch32_midi_note_in MIDI%20In
node/move midi 50 150
node/set-data midi eyJjZmdfY2giOiIxIiwiY2ZnX251bV92IjoxLCJjZmdfZnJlcV90eXBlIjoiUTE2bjE2In0=
patch/add-node root osc mozziflow/saw Saw%20Osc
node/move osc 350 50
node/set-data osc eyJjZmdfZnJlcV9tb2RlIjoiZml4ZWQiLCJyYXRlX21vZGUiOjJ9
patch/add-node root adsr mozziflow/adsr ADSR
node/move adsr 350 250
node/set-data adsr eyJjZmdfYXQiOiI1MCIsImNmZ19kdCI6IjE1MCIsImNmZ19zbCI6IjMyNzY3IiwiY2ZnX3J0IjoiMzAwIiwiY2ZnX2xlcnAiOiJNT1paSV9BVURJT19SQVRFIiwicmF0ZV9tb2RlIjoyfQ==
patch/add-node root vca mozziflow/vca VCA
node/move vca 600 150
node/set-data vca eyJyYXRlX21vZGUiOjJ9
patch/add-node root out mozziflow/out Audio%20Out
node/move out 850 150
node/set-data out eyJjZmdfY29udHJvbF9yYXRlIjoiMjU2IiwiY2ZnX3JlcyI6IjE2Yml0In0=
outlet/connect midi:f0 osc:freq
outlet/connect midi:g0 adsr:trig
outlet/connect osc:out vca:in
outlet/connect adsr:out vca:cv
outlet/connect vca:out out:in`
};

EXAMPLES['midi_poly_3voice'] = {
    category: "MIDI", title: "Real 3-Voice Poly Synth",
    description: "True polyphony with Audio-Rate envelope interpolation. Uses a 3-channel mixer to combine independent voice chains.",
    code: `v2.1.1
network/add-patch root root
patch/open root
patch/add-node root midi mozziflow/ch32_midi_note_in MIDI%20In
node/move midi 30 150
node/set-data midi eyJjZmdfbnVtX3YiOjMsImNmZ19mcmVxX3R5cGUiOiJRMTZuMTYifQ==
patch/add-node root o0 mozziflow/sin Osc%200
node/move o0 300 20
node/set-data o0 eyJjZmdfZnJlcV9tb2RlIjoiZml4ZWQiLCJyYXRlX21vZGUiOjJ9
patch/add-node root a0 mozziflow/adsr Env%200
node/move a0 300 120
node/set-data a0 eyJjZmdfYXQiOiIxMCIsImNmZ19kdCI6IjEwMCIsImNmZ19zbCI6IjEyOCIsImNmZ19ydCI6IjIwMCIsImNmZ19sZXJwIjoiTU9aWklfQVVESU9fUkFURSIsInJhdGVfbW9kZSI6MiwiY2ZnX2RvbWFpbiI6ImludCJ9
patch/add-node root v0 mozziflow/vca VCA%200
node/move v0 500 50
node/set-data v0 eyJyYXRlX21vZGUiOjJ9
patch/add-node root o1 mozziflow/sin Osc%201
node/move o1 300 220
node/set-data o1 eyJjZmdfZnJlcV9tb2RlIjoiZml4ZWQiLCJyYXRlX21vZGUiOjJ9
patch/add-node root a1 mozziflow/adsr Env%201
node/move a1 300 320
node/set-data a1 eyJjZmdfYXQiOiIxMCIsImNmZ19kdCI6IjEwMCIsImNmZ19zbCI6IjEyOCIsImNmZ19ydCI6IjIwMCIsImNmZ19sZXJwIjoiTU9aWklfQVVESU9fUkFURSIsInJhdGVfbW9kZSI6MiwiY2ZnX2RvbWFpbiI6ImludCJ9
patch/add-node root v1 mozziflow/vca VCA%201
node/move v1 500 250
node/set-data v1 eyJyYXRlX21vZGUiOjJ9
patch/add-node root o2 mozziflow/sin Osc%202
node/move o2 300 420
node/set-data o2 eyJjZmdfZnJlcV9tb2RlIjoiZml4ZWQiLCJyYXRlX21vZGUiOjJ9
patch/add-node root a2 mozziflow/adsr Env%202
node/move a2 300 520
node/set-data a2 eyJjZmdfYXQiOiIxMCIsImNmZ19kdCI6IjEwMCIsImNmZ19zbCI6IjEyOCIsImNmZ19ydCI6IjIwMCIsImNmZ19sZXJwIjoiTU9aWklfQVVESU9fUkFURSIsInJhdGVfbW9kZSI6MiwiY2ZnX2RvbWFpbiI6ImludCJ9
patch/add-node root v2 mozziflow/vca VCA%202
node/move v2 500 450
node/set-data v2 eyJyYXRlX21vZGUiOjJ9
patch/add-node root mix mozziflow/mixer Voice%20Mixer
node/move mix 750 250
node/set-data mix eyJjZmdfZG9tYWluIjoiaW50IiwiY2ZnX2NoYW5uZWxzIjoiMyIsInJhdGVfbW9kZSI6Mn0=
patch/add-node root out mozziflow/out Audio%20Out
node/move out 950 250
node/set-data out eyJjZmdfYXJjaCI6ImNoMzJ4MDM1IiwiY2ZnX21vZGUiOiJNT1paSV9PVVRQVVRfUFdNIiwiY2ZnX2NoYW5uZWxzIjoiTU9aWklfTU9OTyIsImNmZ19jb250cm9sX3JhdGUiOiIyNTYiLCJjZmdfcmVzIjoiOGJpdCIsImNmZ19waW5fMSI6IlBBNiIsInJhdGVfbW9kZSI6Mn0=
outlet/connect midi:f0 o0:freq
outlet/connect midi:g0 a0:trig
outlet/connect o0:out v0:in
outlet/connect a0:out v0:cv
outlet/connect midi:f1 o1:freq
outlet/connect midi:g1 a1:trig
outlet/connect o1:out v1:in
outlet/connect a1:out v1:cv
outlet/connect midi:f2 o2:freq
outlet/connect midi:g2 a2:trig
outlet/connect o2:out v2:in
outlet/connect a2:out v2:cv
outlet/connect v0:out mix:in0
outlet/connect v1:out mix:in1
outlet/connect v2:out mix:in2
outlet/connect mix:out out:in`
};

EXAMPLES['midi_expression_pedal'] = {
    category: "MIDI", title: "MIDI CC Filter Sweep",
    description: "Modulate a filter using MIDI CC #74. High-resolution 16-bit processing.",
    code: `v2.1.1
network/add-patch root root
patch/open root
patch/add-node root cc mozziflow/ch32_midi_cc_in MIDI%20CC
node/move cc 50 250
node/set-data cc eyJjZmdfY2M0IjoiNzQifQ==
patch/add-node root smooth mozziflow/smooth_lag Smooth
node/move smooth 300 250
node/set-data smooth eyJjZmdfZG9tYWluIjoiZmxvYXQiLCJjZmdfY29lZmYiOiIwLjkyIn0=
patch/add-node root map mozziflow/map Scale
node/move map 550 250
node/set-data map eyJjZmdfb3V0X21pbiI6IjgwIiwiY2ZnX291dF9tYXgiOiIxMjAwMCJ9
patch/add-node root saw mozziflow/saw Saw
node/move saw 300 50
node/set-data saw eyJyYXRlX21vZGUiOjJ9
patch/add-node root lpf mozziflow/lpf Filter
node/move lpf 800 100
node/set-data lpf eyJjZmdfcHJlY2lzaW9uIjoidWludDE2X3QiLCJyYXRlX21vZGUiOjJ9
patch/add-node root out mozziflow/out Audio%20Out
node/move out 1050 100
node/set-data out eyJjZmdfY29udHJvbF9yYXRlIjoiMjU2IiwiY2ZnX3JlcyI6IjE2Yml0In0=
outlet/connect cc:v0 smooth:in
outlet/connect smooth:out map:in
outlet/connect map:out lpf:cutoff
outlet/connect saw:out lpf:in
outlet/connect lpf:out out:in`
};

EXAMPLES['midi_clock_sequencer'] = {
    category: "MIDI", title: "DAW Clocked Pulse",
    description: "Syncs a Sine wave pulse to MIDI Real-Time Clock.",
    code: `v2.1.1
network/add-patch root root
patch/open root
patch/add-node root clock mozziflow/ch32_midi_clock_in MIDI%20Clock
node/move clock 50 100
patch/add-node root div mozziflow/counter Div%206
node/move div 300 100
node/set-data div eyJjZmdfbWF4IjoiNiJ9
patch/add-node root env mozziflow/ead Env
node/move env 550 100
node/set-data env eyJyYXRlX21vZGUiOjJ9
patch/add-node root osc mozziflow/sin Sine
node/move osc 550 250
node/set-data osc eyJyYXRlX21vZGUiOjJ9
patch/add-node root vca mozziflow/vca Amp
node/move vca 750 150
node/set-data vca eyJyYXRlX21vZGUiOjJ9
patch/add-node root out mozziflow/out Audio%20Out
node/move out 950 150
node/set-data out eyJjZmdfY29udHJvbF9yYXRlIjoiMjU2IiwiY2ZnX3JlcyI6IjE2Yml0In0=
outlet/connect clock:tick div:up
outlet/connect div:out env:trig
outlet/connect env:out vca:cv
outlet/connect osc:out vca:in
outlet/connect vca:out out:in`
};

EXAMPLES['midi_tuned_string'] = {
    category: "MIDI", title: "MIDI Tuned String",
    description: "Expressive Karplus-Strong string synthesis. MIDI Notes control pitch and trigger the excitation burst. High-precision FixMath feedback loop.",
    code: `v2.1.1
network/add-patch root root
patch/open root
patch/add-node root ihf6 mozziflow/ch32_midi_note_in MIDI%20In
node/move ihf6 26 73
node/rate ihf6 1
node/update-inlet ihf6 cfg_freq_type float
node/update-inlet ihf6 cfg_ch 0
node/update-inlet ihf6 cfg_num_v 1
node/set-data ihf6 eyJjZmdfZnJlcV90eXBlIjoiZmxvYXQiLCJjZmdfY2giOiIwIiwicmF0ZV9tb2RlIjoxLCJjZmdfbnVtX3YiOjF9
patch/add-node root s0pc mozziflow/ead Ead
node/move s0pc 274 351
node/rate s0pc 2
node/update-inlet s0pc cfg_domain int
node/update-inlet s0pc cfg_att 1
node/update-inlet s0pc cfg_dec 30
node/set-data s0pc eyJjZmdfZG9tYWluIjoiaW50IiwiY2ZnX2F0dCI6IjEiLCJjZmdfZGVjIjoiMzAiLCJyYXRlX21vZGUiOjJ9
patch/add-node root yhd0 mozziflow/noise Noise
node/move yhd0 311 236
node/rate yhd0 2
node/update-inlet yhd0 cfg_out_domain int8
node/set-data yhd0 eyJjZmdfb3V0X2RvbWFpbiI6ImludDgiLCJyYXRlX21vZGUiOjJ9
patch/add-node root yix6 mozziflow/vca VCA
node/move yix6 507 246
node/rate yix6 2
node/update-inlet yix6 cfg_domain sfix
node/update-inlet yix6 cfg_precision int32_t
node/update-inlet yix6 cfg_cv 255
node/set-data yix6 eyJjZmdfZG9tYWluIjoic2ZpeCIsImNmZ19wcmVjaXNpb24iOiJpbnQzMl90IiwiY2ZnX2N2IjoiMjU1IiwicmF0ZV9tb2RlIjoyfQ==
patch/add-node root 4tz1 mozziflow/add Add
node/move 4tz1 740 258
node/rate 4tz1 2
node/update-inlet 4tz1 cfg_domain sfix
node/update-inlet 4tz1 cfg_precision int32_t
node/update-inlet 4tz1 cfg_b 0
node/set-data 4tz1 eyJjZmdfZG9tYWluIjoic2ZpeCIsImNmZ19wcmVjaXNpb24iOiJpbnQzMl90IiwiY2ZnX2IiOiIwIiwicmF0ZV9tb2RlIjoyfQ==
patch/add-node root 68io mozziflow/audio_delay Delay
node/move 68io 968 96
node/rate 68io 2
node/update-inlet 68io cfg_precision SFix<15,16>
node/update-inlet 68io cfg_mode interp
node/update-inlet 68io cfg_freq 220.0f
node/update-inlet 68io cfg_time 1024
node/set-data 68io eyJjZmdfcHJlY2lzaW9uIjoiU0ZpeDwxNSwxNj4iLCJjZmdfbW9kZSI6ImludGVycCIsImNmZ19mcmVxIjoiMjIwLjBmIiwiY2ZnX3RpbWUiOiIxMDI0IiwicmF0ZV9tb2RlIjoyfQ==
patch/add-node root snco mozziflow/gain Sustain
node/move snco 1265 360
node/rate snco 2
node/update-inlet snco cfg_domain sfix
node/update-inlet snco cfg_precision int32_t
node/update-inlet snco cfg_domain_set true
node/update-inlet snco cfg_gain 0.99
node/set-data snco eyJjZmdfZG9tYWluIjoic2ZpeCIsImNmZ19wcmVjaXNpb24iOiJpbnQzMl90IiwiY2ZnX2RvbWFpbl9zZXQiOnRydWUsImNmZ19nYWluIjoiMC45OSIsInJhdGVfbW9kZSI6Mn0=
patch/add-node root 8q1f mozziflow/out Audio%20Out
node/move 8q1f 1264 46
node/rate 8q1f 2
node/update-inlet 8q1f cfg_arch ch32x035
node/update-inlet 8q1f cfg_mode MOZZI_OUTPUT_PWM
node/update-inlet 8q1f cfg_channels MOZZI_MONO
node/update-inlet 8q1f cfg_control_rate 64
node/update-inlet 8q1f cfg_res auto
node/update-inlet 8q1f cfg_pin_1 PA6
node/set-data 8q1f eyJjZmdfYXJjaCI6ImNoMzJ4MDM1IiwiY2ZnX21vZGUiOiJNT1paSV9PVVRQVVRfUFdNIiwiY2ZnX2NoYW5uZWxzIjoiTU9aWklfTU9OTyIsImNmZ19jb250cm9sX3JhdGUiOiI2NCIsImNmZ19yZXMiOiJhdXRvIiwiY2ZnX3Bpbl8xIjoiUEE2IiwicmF0ZV9tb2RlIjoyfQ==
outlet/connect ihf6:t0 s0pc:trig
outlet/connect ihf6:t0 68io:trig
outlet/connect ihf6:f0 68io:freq
outlet/connect yhd0:out yix6:in
outlet/connect s0pc:out yix6:cv
outlet/connect yix6:out 4tz1:a
outlet/connect 4tz1:out 68io:in
outlet/connect 68io:out snco:in
outlet/connect snco:out 4tz1:b
outlet/connect 68io:out 8q1f:in`
};

EXAMPLES['midi_pb_lead'] = {
    category: "MIDI", title: "MIDI Lead with Bending",
    description: "Monophonic Sine lead where frequency is physically bent by the MIDI Pitch Wheel. Reorganized for clarity.",
    code: `v2.1.1
network/add-patch root root
patch/open root
patch/add-node root 6zkd mozziflow/ch32_midi_note_in MIDI%20In
node/move 6zkd 92 30
node/rate 6zkd 1
node/update-inlet 6zkd cfg_freq_type float
node/update-inlet 6zkd cfg_ch 0
node/set-data 6zkd eyJjZmdfZnJlcV90eXBlIjoiZmxvYXQiLCJjZmdfY2giOiIwIiwicmF0ZV9tb2RlIjoxfQ==
patch/add-node root 1osy mozziflow/ch32_midi_pb_in Pitch%20Bend
node/move 1osy 152 488
node/rate 1osy 1
node/update-inlet 1osy cfg_ch 0
node/set-data 1osy eyJjZmdfY2giOiIwIiwicmF0ZV9tb2RlIjoxfQ==
patch/add-node root jyrh mozziflow/mul Mul
node/move jyrh 402 493
node/rate jyrh 2
node/update-inlet jyrh cfg_domain float
node/update-inlet jyrh cfg_precision int32_t
node/update-inlet jyrh cfg_b 2.0
node/set-data jyrh eyJjZmdfZG9tYWluIjoiZmxvYXQiLCJjZmdfcHJlY2lzaW9uIjoiaW50MzJfdCIsImNmZ19iIjoiMi4wIiwicmF0ZV9tb2RlIjoyfQ==
patch/add-node root 9058 mozziflow/add Add
node/move 9058 594 16
node/rate 9058 2
node/update-inlet 9058 cfg_domain float
node/update-inlet 9058 cfg_precision int32_t
node/update-inlet 9058 cfg_b 0
node/set-data 9058 eyJjZmdfZG9tYWluIjoiZmxvYXQiLCJjZmdfcHJlY2lzaW9uIjoiaW50MzJfdCIsImNmZ19iIjoiMCIsInJhdGVfbW9kZSI6Mn0=
patch/add-node root j6rc mozziflow/adsr ADSR
node/move j6rc 344 101
node/rate j6rc 2
node/update-inlet j6rc cfg_domain int
node/update-inlet j6rc cfg_lerp MOZZI_CONTROL_RATE
node/update-inlet j6rc cfg_reset false
node/update-inlet j6rc cfg_at 50
node/update-inlet j6rc cfg_al 255
node/update-inlet j6rc cfg_dt 100
node/update-inlet j6rc cfg_dl 128
node/update-inlet j6rc cfg_st 0
node/update-inlet j6rc cfg_sl 128
node/update-inlet j6rc cfg_rt 300
node/update-inlet j6rc cfg_rl 0
node/set-data j6rc eyJjZmdfZG9tYWluIjoiaW50IiwiY2ZnX2xlcnAiOiJNT1paSV9DT05UUk9MX1JBVEUiLCJjZmdfcmVzZXQiOiJmYWxzZSIsImNmZ19hdCI6IjUwIiwiY2ZnX2FsIjoiMjU1IiwiY2ZnX2R0IjoiMTAwIiwiY2ZnX2RsIjoiMTI4IiwiY2ZnX3N0IjoiMCIsImNmZ19zbCI6IjEyOCIsImNmZ19ydCI6IjMwMCIsImNmZ19ybCI6IjAiLCJyYXRlX21vZGUiOjJ9
patch/add-node root r1pm mozziflow/sin Sine
node/move r1pm 805 5
node/rate r1pm 2
node/update-inlet r1pm cfg_freq_mode float
node/update-inlet r1pm cfg_out_domain int8
node/update-inlet r1pm cfg_freq 440.0f
node/update-inlet r1pm cfg_phase 0
node/set-data r1pm eyJjZmdfZnJlcV9tb2RlIjoiZmxvYXQiLCJjZmdfb3V0X2RvbWFpbiI6ImludDgiLCJjZmdfZnJlcSI6IjQ0MC4wZiIsImNmZ19waGFzZSI6IjAiLCJyYXRlX21vZGUiOjJ9
patch/add-node root 0moe mozziflow/vca VCA
node/move 0moe 1038 198
node/rate 0moe 2
node/update-inlet 0moe cfg_domain int
node/update-inlet 0moe cfg_precision int32_t
node/update-inlet 0moe cfg_cv 255
node/set-data 0moe eyJjZmdfZG9tYWluIjoiaW50IiwiY2ZnX3ByZWNpc2lvbiI6ImludDMyX3QiLCJjZmdfY3YiOiIyNTUiLCJyYXRlX21vZGUiOjJ9
patch/add-node root 66oe mozziflow/out Audio%20Out
node/move 66oe 1256 134
node/rate 66oe 2
node/update-inlet 66oe cfg_arch ch32x035
node/update-inlet 66oe cfg_mode MOZZI_OUTPUT_PWM
node/update-inlet 66oe cfg_channels MOZZI_MONO
node/update-inlet 66oe cfg_control_rate 64
node/update-inlet 66oe cfg_res auto
node/update-inlet 66oe cfg_pin_1 PA6
node/set-data 66oe eyJjZmdfYXJjaCI6ImNoMzJ4MDM1IiwiY2ZnX21vZGUiOiJNT1paSV9PVVRQVVRfUFdNIiwiY2ZnX2NoYW5uZWxzIjoiTU9aWklfTU9OTyIsImNmZ19jb250cm9sX3JhdGUiOiI2NCIsImNmZ19yZXMiOiJhdXRvIiwiY2ZnX3Bpbl8xIjoiUEE2IiwicmF0ZV9tb2RlIjoyfQ==
outlet/connect 6zkd:f0 9058:a
outlet/connect 1osy:norm jyrh:a
outlet/connect jyrh:out 9058:b
outlet/connect 9058:out r1pm:freq
outlet/connect 6zkd:t0 j6rc:trig
outlet/connect r1pm:out 0moe:in
outlet/connect j6rc:out 0moe:cv
outlet/connect 0moe:out 66oe:in`
};