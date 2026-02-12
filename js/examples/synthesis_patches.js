// MozziFlow Examples - SYNTHESIS CATEGORY (v8.0 Professional Suite)
// High-Resolution modulation and advanced filtering

EXAMPLES['synth_subtractive_pro'] = {
    category: "SYNTHESIS", title: "Pro Subtractive Saw",
    description: "Classic Bass synth: Pulse LFO generates gates for an Filter ADSR. Optimized for high-resolution 16-bit synthesis with 8-bit sawtooth core.",
    code: `v2.1.1
network/add-patch root root
patch/open root
patch/add-node root gate mozziflow/pulse_lfo Rhythm%20LFO
node/move gate 120 350
node/set-data gate eyJjZmdfZnJlcSI6IjEuNSIsImNmZ193aWR0aCI6IjMwIn0=
patch/add-node root adsr mozziflow/adsr Filter%20Env
node/move adsr 370 350
node/set-data adsr eyJjZmdfYXQiOiIxMCIsImNmZ19kdCI6IjE1MCIsImNmZ19zbCI6IjAiLCJjZmdfcnQiOiIxMDAiLCJjZmdfbGVycCI6Ik1PWlpJX0FVRElPX1JBVEUifQ==
patch/add-node root map mozziflow/map Env->Cutoff
node/move map 620 350
node/set-data map eyJjZmdfaW5fbWluIjoiMCIsImNmZ19pbl9tYXgiOiIyNTUiLCJjZmdfb3V0X21pbiI6IjAiLCJjZmdfb3V0X21heCI6IjYwMDAwIn0=
patch/add-node root osc mozziflow/saw Saw%20Wave
node/move osc 120 150
node/set-data osc eyJjZmdfZnJlcSI6IjU1LjBmIiwicmF0ZV9tb2RlIjoyfQ==
patch/add-node root lpf mozziflow/lpf Reso%20Filter
node/move lpf 420 150
node/set-data lpf eyJjZmdfcHJlY2lzaW9uIjoiaW50MTZfdCIsImNmZ19yZXMiOiI0NjAwMCJ9
patch/add-node root out mozziflow/out Audio%20Out
node/move out 720 150
node/set-data out eyJjZmdfY29udHJvbF9yYXRlIjoiMjU2IiwiY2ZnX3JlcyI6IjhiaXQifQ==
outlet/connect gate:out adsr:trig
outlet/connect adsr:out map:in
outlet/connect map:out lpf:cutoff
outlet/connect osc:out lpf:in
outlet/connect lpf:out out:in`
};

EXAMPLES['synth_karplus_strong'] = {
    category: "SYNTHESIS", title: "Karplus-Strong String",
    description: "Simplified physical modeling. A noise burst excites a feedback delay loop, creating a plucked string sound. Uses interpolated delay for better tuning.",
    code: `v2.1.1
network/add-patch root root
patch/open root
patch/add-node root o0q1 mozziflow/metronome Metronome
node/move o0q1 18 262
node/rate o0q1 1
node/update-inlet o0q1 cfg_bpm 20
node/set-data o0q1 eyJyYXRlX21vZGUiOjEsImNmZ19icG0iOiIyMCJ9
patch/add-node root su8r mozziflow/ead Ead
node/move su8r 205 253
node/rate su8r 2
node/update-inlet su8r cfg_domain int
node/update-inlet su8r cfg_att 1
node/update-inlet su8r cfg_dec 30
node/set-data su8r eyJjZmdfZG9tYWluIjoiaW50IiwiY2ZnX2F0dCI6IjEiLCJjZmdfZGVjIjoiMzAiLCJyYXRlX21vZGUiOjJ9
patch/add-node root 465d mozziflow/noise Noise
node/move 465d 221 133
node/rate 465d 2
node/update-inlet 465d cfg_out_domain int8
node/set-data 465d eyJjZmdfb3V0X2RvbWFpbiI6ImludDgiLCJyYXRlX21vZGUiOjJ9
patch/add-node root 49ar mozziflow/vca VCA
node/move 49ar 437 120
node/rate 49ar 2
node/update-inlet 49ar cfg_domain sfix
node/update-inlet 49ar cfg_precision int32_t
node/update-inlet 49ar cfg_cv 255
node/set-data 49ar eyJjZmdfZG9tYWluIjoic2ZpeCIsImNmZ19wcmVjaXNpb24iOiJpbnQzMl90IiwiY2ZnX2N2IjoiMjU1IiwicmF0ZV9tb2RlIjoyfQ==
patch/add-node root r9mx mozziflow/add Add
node/move r9mx 663 130
node/rate r9mx 2
node/update-inlet r9mx cfg_domain sfix
node/update-inlet r9mx cfg_precision int32_t
node/update-inlet r9mx cfg_b 0
node/set-data r9mx eyJjZmdfZG9tYWluIjoic2ZpeCIsImNmZ19wcmVjaXNpb24iOiJpbnQzMl90IiwiY2ZnX2IiOiIwIiwicmF0ZV9tb2RlIjoyfQ==
patch/add-node root i3vi mozziflow/audio_delay Delay
node/move i3vi 898 129
node/rate i3vi 2
node/update-inlet i3vi cfg_precision SFix<15,16>
node/update-inlet i3vi cfg_mode interp
node/update-inlet i3vi cfg_freq 110.2
node/update-inlet i3vi cfg_time 1024
node/set-data i3vi eyJjZmdfcHJlY2lzaW9uIjoiU0ZpeDwxNSwxNj4iLCJjZmdfbW9kZSI6ImludGVycCIsImNmZ19mcmVxIjoiMTEwLjIiLCJjZmdfdGltZSI6IjEwMjQiLCJyYXRlX21vZGUiOjJ9
patch/add-node root mpkf mozziflow/gain Filter%20Avg
node/move mpkf 770 407
node/rate mpkf 2
node/update-inlet mpkf cfg_domain float
node/update-inlet mpkf cfg_precision int32_t
node/update-inlet mpkf cfg_domain_set true
node/update-inlet mpkf cfg_gain 0.99
node/set-data mpkf eyJjZmdfZG9tYWluIjoiZmxvYXQiLCJjZmdfcHJlY2lzaW9uIjoiaW50MzJfdCIsImNmZ19kb21haW5fc2V0IjoidHJ1ZSIsImNmZ19nYWluIjoiMC45OSIsInJhdGVfbW9kZSI6Mn0=
patch/add-node root 0dhc mozziflow/out Audio%20Out
node/move 0dhc 1133 87
node/rate 0dhc 2
node/update-inlet 0dhc cfg_arch ch32x035
node/update-inlet 0dhc cfg_mode MOZZI_OUTPUT_PWM
node/update-inlet 0dhc cfg_channels MOZZI_MONO
node/update-inlet 0dhc cfg_control_rate 256
node/update-inlet 0dhc cfg_res auto
node/update-inlet 0dhc cfg_pin_1 PA6
node/set-data 0dhc eyJjZmdfYXJjaCI6ImNoMzJ4MDM1IiwiY2ZnX21vZGUiOiJNT1paSV9PVVRQVVRfUFdNIiwiY2ZnX2NoYW5uZWxzIjoiTU9aWklfTU9OTyIsImNmZ19jb250cm9sX3JhdGUiOiIyNTYiLCJjZmdfcmVzIjoiYXV0byIsImNmZ19waW5fMSI6IlBBNiIsInJhdGVfbW9kZSI6Mn0=
outlet/connect o0q1:out su8r:trig
outlet/connect 465d:out 49ar:in
outlet/connect su8r:out 49ar:cv
outlet/connect r9mx:out i3vi:in
outlet/connect 49ar:out r9mx:a
outlet/connect i3vi:out 0dhc:in
outlet/connect i3vi:out mpkf:in
outlet/connect mpkf:out r9mx:b`
};

EXAMPLES['synth_fm_dynamic'] = {
    category: "SYNTHESIS", title: "Dynamic FM Bell",
    description: "Improved high-fidelity FM synthesis. Uses dynamic modulation index (Modulator * ADSR) for organic timbral evolution. Optimized for 8-bit PWM hardware.",
    code: `v2.1.1
network/add-patch root root
patch/open root
patch/add-node root juwk mozziflow/metronome Metronome
node/move juwk 35 249
node/rate juwk 1
node/set-data juwk eyJyYXRlX21vZGUiOjF9
patch/add-node root i4au mozziflow/adsr ADSR
node/move i4au 237 204
node/rate i4au 2
node/update-inlet i4au cfg_domain int
node/update-inlet i4au cfg_lerp MOZZI_AUDIO_RATE
node/update-inlet i4au cfg_reset true
node/update-inlet i4au cfg_at 1
node/update-inlet i4au cfg_al 255
node/update-inlet i4au cfg_dt 500
node/update-inlet i4au cfg_dl 200
node/update-inlet i4au cfg_st 100
node/update-inlet i4au cfg_sl 200
node/update-inlet i4au cfg_rt 300
node/update-inlet i4au cfg_rl 0
node/set-data i4au eyJjZmdfZG9tYWluIjoiaW50IiwiY2ZnX2xlcnAiOiJNT1paSV9BVURJT19SQVRFIiwiY2ZnX3Jlc2V0IjoidHJ1ZSIsImNmZ19hdCI6IjEiLCJjZmdfYWwiOiIyNTUiLCJjZmdfZHQiOiI1MDAiLCJjZmdfZGwiOiIyMDAiLCJjZmdfc3QiOiIxMDAiLCJjZmdfc2wiOiIyMDAiLCJjZmdfcnQiOiIzMDAiLCJjZmdfcmwiOiIwIiwicmF0ZV9tb2RlIjoyfQ==
patch/add-node root 9f0b mozziflow/sin Sine
node/move 9f0b 234 2
node/rate 9f0b 2
node/update-inlet 9f0b cfg_freq_mode fixed
node/update-inlet 9f0b cfg_out_domain sfix
node/update-inlet 9f0b cfg_freq 330.0f
node/update-inlet 9f0b cfg_phase 0
node/set-data 9f0b eyJjZmdfZnJlcV9tb2RlIjoiZml4ZWQiLCJjZmdfb3V0X2RvbWFpbiI6InNmaXgiLCJjZmdfZnJlcSI6IjMzMC4wZiIsImNmZ19waGFzZSI6IjAiLCJyYXRlX21vZGUiOjJ9
patch/add-node root o1bw mozziflow/mul Mul
node/move o1bw 475 147
node/rate o1bw 2
node/update-inlet o1bw cfg_domain int
node/update-inlet o1bw cfg_precision int32_t
node/update-inlet o1bw cfg_b 20
node/set-data o1bw eyJjZmdfZG9tYWluIjoiaW50IiwiY2ZnX3ByZWNpc2lvbiI6ImludDMyX3QiLCJjZmdfYiI6IjIwIiwicmF0ZV9tb2RlIjoyfQ==
patch/add-node root f7ab mozziflow/sin Sine
node/move f7ab 683 115
node/rate f7ab 2
node/update-inlet f7ab cfg_freq_mode fixed
node/update-inlet f7ab cfg_out_domain int8
node/update-inlet f7ab cfg_freq 440.0f
node/update-inlet f7ab cfg_phase 0
node/set-data f7ab eyJjZmdfZnJlcV9tb2RlIjoiZml4ZWQiLCJjZmdfb3V0X2RvbWFpbiI6ImludDgiLCJjZmdfZnJlcSI6IjQ0MC4wZiIsImNmZ19waGFzZSI6IjAiLCJyYXRlX21vZGUiOjJ9
patch/add-node root 9w6o mozziflow/vca VCA
node/move 9w6o 935 308
node/rate 9w6o 2
node/update-inlet 9w6o cfg_domain int
node/update-inlet 9w6o cfg_precision int32_t
node/update-inlet 9w6o cfg_cv 255
node/set-data 9w6o eyJjZmdfZG9tYWluIjoiaW50IiwiY2ZnX3ByZWNpc2lvbiI6ImludDMyX3QiLCJjZmdfY3YiOiIyNTUiLCJyYXRlX21vZGUiOjJ9
patch/add-node root g6pq mozziflow/out Audio%20Out
node/move g6pq 1154 244
node/rate g6pq 2
node/update-inlet g6pq cfg_arch ch32x035
node/update-inlet g6pq cfg_mode MOZZI_OUTPUT_PWM
node/update-inlet g6pq cfg_channels MOZZI_MONO
node/update-inlet g6pq cfg_control_rate 256
node/update-inlet g6pq cfg_res 8bit
node/update-inlet g6pq cfg_pin_1 PA6
node/set-data g6pq eyJjZmdfYXJjaCI6ImNoMzJ4MDM1IiwiY2ZnX21vZGUiOiJNT1paSV9PVVRQVVRfUFdNIiwiY2ZnX2NoYW5uZWxzIjoiTU9aWklfTU9OTyIsImNmZ19jb250cm9sX3JhdGUiOiIyNTYiLCJjZmdfcmVzIjoiOGJpdCIsImNmZ19waW5fMSI6IlBBNiIsInJhdGVfbW9kZSI6Mn0=
outlet/connect juwk:out i4au:trig
outlet/connect i4au:out 9w6o:cv
outlet/connect o1bw:out f7ab:phase
outlet/connect f7ab:out 9w6o:in
outlet/connect 9w6o:out g6pq:in
outlet/connect 9f0b:out o1bw:a
outlet/connect i4au:out o1bw:b`
};

EXAMPLES['synth_percussion'] = {
    category: "SYNTHESIS", title: "Resonant Percussion",
    description: "Uses the WavePacket node triggered by a Metronome for organic, vocal-like hits.",
    code: `v2.1.1
network/add-patch root root
patch/open root
patch/add-node root clk mozziflow/metronome Metronome
node/move clk 100 100
node/set-data clk eyJjZmdfYnBtIjoiMTYwIn0=
patch/add-node root wp mozziflow/wavepacket WavePacket
node/move wp 400 100
node/set-data wp eyJjZmdfZnVuZCI6IjYwIiwiY2ZnX2J3IjoiNDAiLCJjZmdfcmVzIjoiMTgwIn0=
patch/add-node root env mozziflow/ead Ead
node/move env 400 300
node/set-data env eyJjZmdfYXR0IjoiNSIsImNmZ19kZWMiOiIxNTAifQ==
patch/add-node root vca mozziflow/vca VCA
node/move vca 650 150
patch/add-node root out mozziflow/out Audio%20Out
node/move out 900 150
node/set-data out eyJjZmdfY29udHJvbF9yYXRlIjoiMjU2IiwiY2ZnX3JlcyI6IjE2Yml0In0=
outlet/connect clk:out env:trig
outlet/connect wp:out vca:in
outlet/connect env:out vca:cv
outlet/connect vca:out out:in`
};

EXAMPLES['test_multi_wave'] = {
    category: "SYNTHESIS", title: "Multi-Wave Explorer",
    description: "Tests the Multi-Wave node by automatically cycling through Sine, Triangle, Saw, and Square waveforms every second using a Counter.",
    code: `v2.1.1
network/add-patch root root
patch/open root
patch/add-node root clk mozziflow/metronome Metronome
node/move clk 50 100
node/set-data clk eyJjZmdfYnBtIjoiNjAifQ==
patch/add-node root cnt mozziflow/counter Counter
node/move cnt 250 100
node/set-data cnt eyJjZmdfbWF4IjoiMyJ9
patch/add-node root osc mozziflow/multi_wave Multi%20Wave
node/move osc 450 100
node/set-data osc eyJjZmdfZnJlcSI6IjIyMC4wZiIsImNmZ19vdXRfZG9tYWluIjoic2ZpeCJ9
patch/add-node root out mozziflow/out Audio%20Out
node/move out 700 100
node/set-data out eyJjZmdfY29udHJvbF9yYXRlIjoiMjU2IiwiY2ZnX3JlcyI6IjhiaXQifQ==
outlet/connect clk:out cnt:up
outlet/connect cnt:out osc:type
outlet/connect osc:out out:in`
};

EXAMPLES['test_sfix_mixer'] = {
    category: "SYNTHESIS", title: "SFix Hi-Fi Mixer",
    description: "High-precision FixMath summing. Three oscillators are mixed using the dynamic Mixer node in SFix mode, maintaining full resolution before the final 8-bit output conversion.",
    code: `v2.1.1
network/add-patch root root
patch/open root
patch/add-node root 7aqs mozziflow/sin Sine
node/move 7aqs 39 50
node/rate 7aqs 2
node/update-inlet 7aqs cfg_freq_mode float
node/update-inlet 7aqs cfg_out_domain int8
node/update-inlet 7aqs cfg_freq 221.0f
node/update-inlet 7aqs cfg_phase 0
node/set-data 7aqs eyJjZmdfZnJlcV9tb2RlIjoiZmxvYXQiLCJjZmdfb3V0X2RvbWFpbiI6ImludDgiLCJjZmdfZnJlcSI6IjIyMS4wZiIsImNmZ19waGFzZSI6IjAiLCJyYXRlX21vZGUiOjJ9
patch/add-node root qb42 mozziflow/tri Triangle
node/move qb42 51 246
node/rate qb42 2
node/update-inlet qb42 cfg_freq_mode float
node/update-inlet qb42 cfg_out_domain int8
node/update-inlet qb42 cfg_freq 338.0f
node/set-data qb42 eyJjZmdfZnJlcV9tb2RlIjoiZmxvYXQiLCJjZmdfb3V0X2RvbWFpbiI6ImludDgiLCJjZmdfZnJlcSI6IjMzOC4wZiIsInJhdGVfbW9kZSI6Mn0=
patch/add-node root v28n mozziflow/saw Saw
node/move v28n 50 414
node/rate v28n 2
node/update-inlet v28n cfg_freq_mode float
node/update-inlet v28n cfg_out_domain int8
node/update-inlet v28n cfg_freq 445.0f
node/set-data v28n eyJjZmdfZnJlcV9tb2RlIjoiZmxvYXQiLCJjZmdfb3V0X2RvbWFpbiI6ImludDgiLCJjZmdfZnJlcSI6IjQ0NS4wZiIsInJhdGVfbW9kZSI6Mn0=
patch/add-node root dkx0 mozziflow/mixer Mixer
node/move dkx0 266 249
node/rate dkx0 2
node/update-inlet dkx0 cfg_domain sfix
node/update-inlet dkx0 cfg_precision int32_t
node/update-inlet dkx0 cfg_channels 3
node/set-data dkx0 eyJjZmdfZG9tYWluIjoic2ZpeCIsImNmZ19wcmVjaXNpb24iOiJpbnQzMl90IiwicmF0ZV9tb2RlIjoyLCJjZmdfY2hhbm5lbHMiOiIzIn0=
patch/add-node root r4pp mozziflow/gain Gain%20Stage
node/move r4pp 476 262
node/rate r4pp 2
node/update-inlet r4pp cfg_domain sfix
node/update-inlet r4pp cfg_precision int32_t
node/update-inlet r4pp cfg_domain_set true
node/update-inlet r4pp cfg_gain 0.3
node/set-data r4pp eyJjZmdfZG9tYWluIjoic2ZpeCIsImNmZ19wcmVjaXNpb24iOiJpbnQzMl90IiwiY2ZnX2RvbWFpbl9zZXQiOnRydWUsImNmZ19nYWluIjoiMC4zIiwicmF0ZV9tb2RlIjoyfQ==
patch/add-node root 6fqa mozziflow/out Audio%20Out
node/move 6fqa 691 197
node/rate 6fqa 2
node/update-inlet 6fqa cfg_arch ch32x035
node/update-inlet 6fqa cfg_mode MOZZI_OUTPUT_PWM
node/update-inlet 6fqa cfg_channels MOZZI_MONO
node/update-inlet 6fqa cfg_control_rate 256
node/update-inlet 6fqa cfg_res 8bit
node/update-inlet 6fqa cfg_pin_1 PA6
node/set-data 6fqa eyJjZmdfYXJjaCI6ImNoMzJ4MDM1IiwiY2ZnX21vZGUiOiJNT1paSV9PVVRQVVRfUFdNIiwiY2ZnX2NoYW5uZWxzIjoiTU9aWklfTU9OTyIsImNmZ19jb250cm9sX3JhdGUiOiIyNTYiLCJjZmdfcmVzIjoiOGJpdCIsImNmZ19waW5fMSI6IlBBNiIsInJhdGVfbW9kZSI6Mn0=
outlet/connect 7aqs:out dkx0:in0
outlet/connect qb42:out dkx0:in1
outlet/connect v28n:out dkx0:in2
outlet/connect dkx0:out r4pp:in
outlet/connect r4pp:out 6fqa:in`
};

EXAMPLES['test_sfix_fm'] = {
    category: "SYNTHESIS", title: "SFix FM Synthesis",
    description: "Corrected SFix-based Frequency Modulation. Uses a dynamic modulation index (Modulator -> VCA -> Scale -> Phase) and a final VCA for strong output volume on 8-bit hardware.",
    code: `v2.1.1
network/add-patch root root
patch/open root
patch/add-node root 3cz7 mozziflow/metronome Metronome
node/move 3cz7 35 249
node/rate 3cz7 1
node/update-inlet 3cz7 cfg_bpm 88
node/set-data 3cz7 eyJyYXRlX21vZGUiOjEsImNmZ19icG0iOiI4OCJ9
patch/add-node root 7bsr mozziflow/adsr ADSR
node/move 7bsr 237 204
node/rate 7bsr 2
node/update-inlet 7bsr cfg_domain int
node/update-inlet 7bsr cfg_lerp MOZZI_AUDIO_RATE
node/update-inlet 7bsr cfg_reset true
node/update-inlet 7bsr cfg_at 10
node/update-inlet 7bsr cfg_al 255
node/update-inlet 7bsr cfg_dt 200
node/update-inlet 7bsr cfg_dl 128
node/update-inlet 7bsr cfg_st 0
node/update-inlet 7bsr cfg_sl 128
node/update-inlet 7bsr cfg_rt 500
node/update-inlet 7bsr cfg_rl 0
node/set-data 7bsr eyJjZmdfZG9tYWluIjoiaW50IiwiY2ZnX2xlcnAiOiJNT1paSV9BVURJT19SQVRFIiwiY2ZnX3Jlc2V0IjoidHJ1ZSIsImNmZ19hdCI6IjEwIiwiY2ZnX2FsIjoyNTUsImNmZ19kdCI6IjIwMCIsImNmZ19kbCI6MTI4LCJjZmdfc3QiOjAsImNmZ19zbCI6MTI4LCJjZmdfcnQiOjUwMCwiY2ZnX3JsIjowLCJyYXRlX21vZGUiOjJ9
patch/add-node root 5h0m mozziflow/sin Modulator
node/move 5h0m 234 2
node/rate 5h0m 2
node/update-inlet 5h0m cfg_freq_mode fixed
node/update-inlet 5h0m cfg_out_domain sfix
node/update-inlet 5h0m cfg_freq 660.0f
node/update-inlet 5h0m cfg_phase 0
node/set-data 5h0m eyJjZmdfZnJlcV9tb2RlIjoiZml4ZWQiLCJjZmdfb3V0X2RvbWFpbiI6InNmaXgiLCJjZmdfZnJlcSI6IjY2MC4wZiIsImNmZ19waGFzZSI6IjAiLCJyYXRlX21vZGUiOjJ9
patch/add-node root imau mozziflow/vca Index%20VCA
node/move imau 475 147
node/rate imau 2
node/update-inlet imau cfg_domain sfix
node/update-inlet imau cfg_precision int32_t
node/update-inlet imau cfg_cv 255
node/set-data imau eyJjZmdfZG9tYWluIjoic2ZpeCIsImNmZ19wcmVjaXNpb24iOiJpbnQzMl90IiwiY2ZnX2N2IjoiMjU1IiwicmF0ZV9tb2RlIjoyfQ==
patch/add-node root jgti mozziflow/mul Scale
node/move jgti 670 159
node/rate jgti 2
node/update-inlet jgti cfg_domain sfix
node/update-inlet jgti cfg_precision int32_t
node/update-inlet jgti cfg_b 10
node/set-data jgti eyJjZmdfZG9tYWluIjoic2ZpeCIsImNmZ19wcmVjaXNpb24iOiJpbnQzMl90IiwiY2ZnX2IiOiIxMCIsInJhdGVfbW9kZSI6Mn0=
patch/add-node root jxwk mozziflow/sin Carrier
node/move jxwk 878 118
node/rate jxwk 2
node/update-inlet jxwk cfg_freq_mode fixed
node/update-inlet jxwk cfg_out_domain int8
node/update-inlet jxwk cfg_freq 440.0f
node/update-inlet jxwk cfg_phase 0
node/set-data jxwk eyJjZmdfZnJlcV9tb2RlIjoiZml4ZWQiLCJjZmdfb3V0X2RvbWFpbiI6ImludDgiLCJjZmdfZnJlcSI6IjQ0MC4wZiIsImNmZ19waGFzZSI6IjAiLCJyYXRlX21vZGUiOjJ9
patch/add-node root f3n9 mozziflow/vca Amp%20VCA
node/move f3n9 1050 300
node/rate f3n9 2
node/update-inlet f3n9 cfg_domain int
node/update-inlet f3n9 cfg_precision int32_t
node/update-inlet f3n9 cfg_cv 255
node/set-data f3n9 eyJjZmdfZG9tYWluIjoiaW50IiwiY2ZnX3ByZWNpc2lvbiI6ImludDMyX3QiLCJjZmdfY3YiOiIyNTUiLCJyYXRlX21vZGUiOjJ9
patch/add-node root 2avi mozziflow/out Audio%20Out
node/move 2avi 1250 244
node/rate 2avi 2
node/update-inlet 2avi cfg_arch ch32x035
node/update-inlet 2avi cfg_mode MOZZI_OUTPUT_PWM
node/update-inlet 2avi cfg_channels MOZZI_MONO
node/update-inlet 2avi cfg_control_rate 256
node/update-inlet 2avi cfg_res 8bit
node/update-inlet 2avi cfg_pin_1 PA6
node/set-data 2avi eyJjZmdfYXJjaCI6ImNoMzJ4MDM1IiwiY2ZnX21vZGUiOiJNT1paSV9PVVRQVVRfUFdNIiwiY2ZnX2NoYW5uZWxzIjoiTU9aWklfTU9OTyIsImNmZ19jb250cm9sX3JhdGUiOiIyNTYiLCJjZmdfcmVzIjoiOGJpdCIsImNmZ19waW5fMSI6IlBBNiIsInJhdGVfbW9kZSI6Mn0=
outlet/connect 3cz7:out 7bsr:trig
outlet/connect 5h0m:out imau:in
outlet/connect 7bsr:out imau:cv
outlet/connect imau:out jgti:a
outlet/connect jgti:out jxwk:phase
outlet/connect jxwk:out f3n9:in
outlet/connect 7bsr:out f3n9:cv
outlet/connect f3n9:out 2avi:in`
};

EXAMPLES['synth_acid_tb'] = {
    category: "SYNTHESIS", title: "Acid Bass (303 Style)",
    description: "Classic Saw bass. Uses an ADSR envelope to modulate both the SVF filter cutoff and a final VCA stage for precise percussive control.",
    code: `v2.1.1
network/add-patch root root
patch/open root
patch/add-node root sngq mozziflow/metronome Metronome
node/move sngq 36 321
node/rate sngq 1
node/update-inlet sngq cfg_bpm 128
node/set-data sngq eyJyYXRlX21vZGUiOjEsImNmZ19icG0iOiIxMjgifQ==
patch/add-node root ocjk mozziflow/adsr ADSR
node/move ocjk 228 280
node/rate ocjk 2
node/update-inlet ocjk cfg_domain int
node/update-inlet ocjk cfg_lerp MOZZI_AUDIO_RATE
node/update-inlet ocjk cfg_reset false
node/update-inlet ocjk cfg_at 1
node/update-inlet ocjk cfg_al 255
node/update-inlet ocjk cfg_dt 200
node/update-inlet ocjk cfg_dl 0
node/update-inlet ocjk cfg_st 0
node/update-inlet ocjk cfg_sl 0
node/update-inlet ocjk cfg_rt 300
node/update-inlet ocjk cfg_rl 0
node/set-data ocjk eyJjZmdfZG9tYWluIjoiaW50IiwiY2ZnX2xlcnAiOiJNT1paSV9BVURJT19SQVRFIiwiY2ZnX3Jlc2V0IjoiZmFsc2UiLCJjZmdfYXQiOiIxIiwiY2ZnX2FsIjoiMjU1IiwiY2ZnX2R0IjoiMjAwIiwiY2ZnX2RsIjoiMCIsImNmZ19zdCI6IjAiLCJjZmdfc3QiOiIwIiwiY2ZnX3J0IjoiMzAwIiwiY2ZnX3JsIjoiMCIsInJhdGVfbW9kZSI6Mn0=
patch/add-node root x0ny mozziflow/map Map
node/move x0ny 449 249
node/rate x0ny 2
node/update-inlet x0ny cfg_in_min 0
node/update-inlet x0ny cfg_in_max 255
node/update-inlet x0ny cfg_out_min 40
node/update-inlet x0ny cfg_out_max 6000
node/set-data x0ny eyJjZmdfaW5fbWluIjoiMCIsImNmZ19pbl9tYXgiOiIyNTUiLCJjZmdfb3V0X21pbiI6IjQwIiwiY2ZnX291dF9tYXgiOiI2MDAwIiwicmF0ZV9tb2RlIjoyfQ==
patch/add-node root twbx mozziflow/saw Saw
node/move twbx 475 77
node/rate twbx 2
node/update-inlet twbx cfg_freq_mode float
node/update-inlet twbx cfg_out_domain int8
node/update-inlet twbx cfg_freq 50
node/set-data twbx eyJjZmdfZnJlcV9tb2RlIjoiZmxvYXQiLCJjZmdfb3V0X2RvbWFpbiI6ImludDgiLCJjZmdfZnJlcSI6IjUwIiwicmF0ZV9tb2RlIjoyfQ==
patch/add-node root t1zq mozziflow/svf Filter
node/move t1zq 686 178
node/rate t1zq 2
node/update-inlet t1zq cfg_cutoff 1200
node/update-inlet t1zq cfg_res 80
node/set-data t1zq eyJjZmdfY3V0b2ZmIjoiMTIwMCIsImNmZ19yZXMiOiI4MCIsInJhdGVfbW9kZSI6MiwibW9kZSI6IkxPV1BBU1MifQ==
patch/add-node root tzxe mozziflow/vca VCA
node/move tzxe 912 378
node/rate tzxe 2
node/update-inlet tzxe cfg_domain sfix
node/update-inlet tzxe cfg_precision int32_t
node/update-inlet tzxe cfg_cv 255
node/set-data tzxe eyJjZmdfZG9tYWluIjoic2ZpeCIsImNmZ19wcmVjaXNpb24iOiJpbnQzMl90IiwiY2ZnX2N2IjoiMjU1IiwicmF0ZV9tb2RlIjoyfQ==
patch/add-node root ztyk mozziflow/out Audio%20Out
node/move ztyk 1146 312
node/rate ztyk 2
node/update-inlet ztyk cfg_arch ch32x035
node/update-inlet ztyk cfg_mode MOZZI_OUTPUT_PWM
node/update-inlet ztyk cfg_channels MOZZI_MONO
node/update-inlet ztyk cfg_control_rate 64
node/update-inlet ztyk cfg_res 8bit
node/update-inlet ztyk cfg_pin_1 PA6
node/set-data ztyk eyJjZmdfYXJjaCI6ImNoMzJ4MDM1IiwiY2ZnX21vZGUiOiJNT1paSV9PVVRQVVRfUFdNIiwiY2ZnX2NoYW5uZWxzIjoiTU9aWklfTU9OTyIsImNmZ19jb250cm9sX3JhdGUiOiI2NCIsImNmZ19yZXMiOiI4Yml0IiwiY2ZnX3Bpbl8xIjoiUEE2IiwicmF0ZV9tb2RlIjoyfQ==
outlet/connect sngq:out ocjk:trig
outlet/connect ocjk:out x0ny:in
outlet/connect x0ny:out t1zq:cutoff
outlet/connect twbx:out t1zq:in
outlet/connect ocjk:out tzxe:cv
outlet/connect t1zq:out tzxe:in
outlet/connect tzxe:out ztyk:in`
};

EXAMPLES['synth_ambient_drone'] = {
    category: "SYNTHESIS", title: "Ambient Drone Pad",
    description: "Deep texture using three detuned oscillators mixed in FixMath domain.",
    code: `v2.1.1
network/add-patch root root
patch/open root
patch/add-node root o1 mozziflow/sin Osc%201
node/move o1 120 50
node/set-data o1 eyJjZmdfZnJlcSI6IjExMC4wZiIsImNmZ19vdXRfZG9tYWluIjoic2ZpeCJ9
patch/add-node root o2 mozziflow/sin Osc%202
node/move o2 120 200
node/set-data o2 eyJjZmdfZnJlcSI6IjExMC44ZiIsImNmZ19vdXRfZG9tYWluIjoic2ZpeCJ9
patch/add-node root o3 mozziflow/sin Osc%203
node/move o3 120 350
node/set-data o3 eyJjZmdfZnJlcSI6IjExMS41ZiIsImNmZ19vdXRfZG9tYWluIjoic2ZpeCJ9
patch/add-node root mix mozziflow/mixer Mixer
node/move mix 420 150
node/set-data mix eyJjZmdfZG9tYWluIjoic2ZpeCIsImNmZ19jaGFubmVscyI6IjMifQ==
patch/add-node root gain mozziflow/gain Pad%20Vol
node/move gain 620 150
node/set-data gain eyJjZmdfZG9tYWluIjoic2ZpeCIsImNmZ19nYWluIjoiMC4zMCJ9
patch/add-node root out mozziflow/out Audio%20Out
node/move out 820 150
node/set-data out eyJjZmdfY29udHJvbF9yYXRlIjoiMjU2In0=
outlet/connect o1:out mix:in0
outlet/connect o2:out mix:in1
outlet/connect o3:out mix:in2
outlet/connect mix:out gain:in
outlet/connect gain:out out:in`
};