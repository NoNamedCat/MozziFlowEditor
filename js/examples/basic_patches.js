// MozziFlow Examples - BASIC CATEGORY (v8.1 Standard Pulse Fix)
// Cleaned and rebuilt for v21.3 Export Engine. Fixed by the maricón de mierda.

EXAMPLES['basic_sine_pure'] = {
    category: "BASIC", title: "Pure 440Hz Sine",
    description: "The absolute reference tone. Standard 440Hz Sine wave running at 256Hz Control Rate.",
    code: `v2.1.1
network/add-patch root root
patch/open root
patch/add-node root o1 mozziflow/sin Sine
node/move o1 100 100
node/set-data o1 eyJjZmdfZnJlcSI6IjQ0MC4wZiIsImNmZ19mcmVxX21vZGUiOiJmbG9hdCJ9
patch/add-node root out mozziflow/out Audio%20Out
node/move out 400 100
node/set-data out eyJjZmdfcmVzIjoiOGJpdCIsImNmZ19jb250cm9sX3JhdGUiOiIyNTYifQ==
outlet/connect o1:out out:in`
};

EXAMPLES['basic_dual_mixer'] = {
    category: "BASIC", title: "Oscillator Mixer",
    description: "Mixes a Sine and a Saw wave. Demonstrates the use of the dynamic Mixer node in Integer domain.",
    code: `v2.1.1
network/add-patch root root
patch/open root
patch/add-node root o1 mozziflow/sin Sine
node/move o1 100 50
node/set-data o1 eyJjZmdfZnJlcSI6IjIyMC4wZiJ9
patch/add-node root o2 mozziflow/saw Saw
node/move o2 100 200
node/set-data o2 eyJjZmdfZnJlcSI6IjExMC4wZiIsInJhdGVfbW9kZSI6Mn0=
patch/add-node root mix mozziflow/mixer Mixer
node/move mix 350 100
node/set-data mix eyJjZmdfZG9tYWluIjoiaW50IiwicmF0ZV9tb2RlIjoyLCJjZmdfY2hhbm5lbHMiOiIyIn0=
patch/add-node root out mozziflow/out Audio%20Out
node/move out 600 100
node/set-data out eyJjZmdfY29udHJvbF9yYXRlIjoiMjU2IiwiY2ZnX3JlcyI6IjhiaXQifQ==
outlet/connect o1:out mix:in0
outlet/connect o2:out mix:in1
outlet/connect mix:out out:in`
};

EXAMPLES['basic_pwm_mod'] = {
    category: "BASIC", title: "Pulse Width Modulation",
    description: "Uses a Sine LFO to modulate the duty cycle of an Audio Pulse wave. Classic fat bass sound.",
    code: `v2.1.1
network/add-patch root root
patch/open root
patch/add-node root lfo mozziflow/lfo_sin LFO%20Sine
node/move lfo 100 250
node/set-data lfo eyJjZmdfZnJlcSI6IjIuMCIsImNmZ19vdXRfZG9tYWluIjoiaW50OCJ9
patch/add-node root map mozziflow/map Map%20Range
node/move map 350 250
node/set-data map eyJjZmdfaW5fbWluIjoiLTEyOCIsImNmZ19pbl9tYXgiOiIxMjciLCJjZmdfb3V0X21pbiI6IjEwIiwiY2ZnX291dF9tYXgiOiI5MCJ9
patch/add-node root pulse mozziflow/pulse Pulse%20Osc
node/move pulse 600 100
node/set-data pulse eyJjZmdfZnJlcSI6IjExMC4wZiIsInJhdGVfbW9kZSI6Mn0=
patch/add-node root out mozziflow/out Audio%20Out
node/move out 850 100
node/set-data out eyJjZmdfY29udHJvbF9yYXRlIjoiMjU2IiwiY2ZnX3JlcyI6IjhiaXQifQ==
outlet/connect lfo:out map:in
outlet/connect map:out pulse:width
outlet/connect pulse:out out:in`
};

EXAMPLES['basic_vibrato_lead'] = {
    category: "BASIC", title: "Vibrato Sine Lead",
    description: "Demonstrates pitch modulation. A slow Sine LFO oscillates the frequency of an audio oscillator, creating a natural vibrato effect.",
    code: `v2.1.1
network/add-patch root root
patch/open root
patch/add-node root lfo mozziflow/lfo_sin Vibrato%20LFO
node/move lfo 120 250
node/set-data lfo eyJjZmdfZnJlcSI6IjUuMCIsImNmZ19vdXRfZG9tYWluIjoiaW50OCJ9
patch/add-node root map mozziflow/map Pitch%20Dev
node/move map 320 250
node/set-data map eyJjZmdfaW5fbWluIjoiLTEyOCIsImNmZ19pbl9tYXgiOiIxMjciLCJjZmdfb3V0X21pbiI6IjQzOCIsImNmZ19vdXRfbWF4IjoiNDQyIn0=
patch/add-node root osc mozziflow/sin Sine%20Osc
node/move osc 520 100
node/set-data osc eyJjZmdfZnJlcV9tb2RlIjoiZmxvYXQiLCJyYXRlX21vZGUiOjJ9
patch/add-node root out mozziflow/out Audio%20Out
node/move out 720 100
node/set-data out eyJjZmdfY29udHJvbF9yYXRlIjoiMjU2IiwiY2ZnX3JlcyI6IjhiaXQifQ==
outlet/connect lfo:out map:in
outlet/connect map:out osc:freq
outlet/connect osc:out out:in`
};

EXAMPLES['basic_tremolo'] = {
    category: "BASIC", title: "Simple Tremolo",
    description: "Amplitude Modulation (AM). A Sine LFO modulates a VCA to create a pulsing volume effect.",
    code: `v2.1.1
network/add-patch root root
patch/open root
patch/add-node root osc mozziflow/tri Triangle%20Wave
node/move osc 120 100
node/set-data osc eyJjZmdfZnJlcSI6IjIyMC4wZCJ9
patch/add-node root lfo mozziflow/lfo_sin Tremolo%20LFO
node/move lfo 120 300
node/set-data lfo eyJjZmdfZnJlcSI6IjQuMCIsImNmZ19vdXRfZG9tYWluIjoiaW50OCJ9
patch/add-node root map mozziflow/map Depth
node/move map 320 300
node/set-data map eyJjZmdfaW5fbWluIjoiLTEyOCIsImNmZ19pbl9tYXgiOiIxMjciLCJjZmdfb3V0X21pbiI6IjY0IiwiY2ZnX291dF9tYXgiOiIyNTUifQ==
patch/add-node root vca mozziflow/vca Amp%20Mod
node/move vca 520 150
patch/add-node root out mozziflow/out Audio%20Out
node/move out 720 150
node/set-data out eyJjZmdfY29udHJvbF9yYXRlIjoiMjU2IiwiY2ZnX3JlcyI6IjhiaXQifQ==
outlet/connect lfo:out map:in
outlet/connect map:out vca:cv
outlet/connect osc:out vca:in
outlet/connect vca:out out:in`
};

EXAMPLES['basic_glide_line'] = {
    category: "BASIC", title: "Frequency Glide",
    description: "Smooth frequency transitions using the Line node.",
    code: `v2.1.1
network/add-patch root root
patch/open root
patch/add-node root lfo mozziflow/lfo_sin Target%20Mod
node/move lfo 120 300
node/set-data lfo eyJjZmdfZnJlcSI6IjAuNSIsImNmZ19vdXRfZG9tYWluIjoiaW50OCJ9
patch/add-node root map mozziflow/map Map%20Freq
node/move map 320 300
node/set-data map eyJjZmdfaW5fbWluIjoiLTEyOCIsImNmZ19pbl9tYXgiOiIxMjciLCJjZmdfb3V0X21pbiI6IjIyMCIsImNmZ19vdXRfbWF4IjoiODgwIn0=
patch/add-node root line mozziflow/line_ramp Line%20Glide
node/move line 520 300
node/set-data line eyJjZmdfZHVyIjoiNTAwIiwiY2ZnX2RvbWFpbiI6ImZsb2F0In0=
patch/add-node root osc mozziflow/sin Sine
node/move osc 520 100
node/set-data osc eyJjZmdfZnJlcV9tb2RlIjoiZmxvYXQiLCJyYXRlX21vZGUiOjJ9
patch/add-node root out mozziflow/out Audio%20Out
node/move out 720 100
node/set-data out eyJjZmdfY29udHJvbF9yYXRlIjoiMjU2IiwiY2ZnX3JlcyI6IjhiaXQifQ==
outlet/connect lfo:out map:in
outlet/connect map:out line:target
outlet/connect line:out osc:freq
outlet/connect osc:out out:in`
};