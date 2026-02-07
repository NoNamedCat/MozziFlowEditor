// MozziFlow Examples - BASIC CATEGORY (v7.6 High-Performance 256Hz)
EXAMPLES['basic_sine'] = {
    category: "BASIC", title: "Simple Sine Tone",
    description: "The absolute basic: A 440Hz Sine wave at 256Hz Control Rate.",
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

EXAMPLES['basic_dual_osc'] = {
    category: "BASIC", title: "Dual Oscillator Mix",
    description: "Mixed oscillators running at 256Hz Control Rate.",
    code: `v2.1.1
network/add-patch root root
patch/open root
patch/add-node root o1 mozziflow/sin Sine
node/move o1 100 50
node/set-data o1 eyJjZmdfZnJlcSI6IjQ0MC4wZiIsImNmZ19mcmVxX21vZGUiOiJmbG9hdCJ9
patch/add-node root o2 mozziflow/saw Saw
node/move o2 100 200
node/set-data o2 eyJjZmdfZnJlcSI6IjIyMC4wZiIsImNmZ19mcmVxX21vZGUiOiJmbG9hdCJ9
patch/add-node root mix mozziflow/add3 Mixer%203
node/move mix 350 100
node/set-data mix eyJjZmdfZG9tYWluIjoiaW50In0=
patch/add-node root out mozziflow/out Audio%20Out
node/move out 600 100
node/set-data out eyJjZmdfcmVzIjoiOGJpdCIsImNmZ19jb250cm9sX3JhdGUiOiIyNTYifQ==
outlet/connect o1:out mix:a
outlet/connect o2:out mix:b
outlet/connect mix:out out:in`
};

EXAMPLES['test_ui_sync'] = {
    category: "TESTING", title: "UI Synchronization Stress Test",
    description: "Verifies that all dropdown selectors (Control Rate, Precision, Domains) sync correctly with internal data.",
    code: `v2.1.1
network/add-patch root root
patch/open root
patch/add-node root out mozziflow/out Audio%20Out
node/move out 1000 100
node/set-data out eyJjZmdfYXJjaCI6ImVzcDMyIiwiY2ZnX21vZGUiOiJNT1paSV9PVVRQVVRfUFdNIiwiY2ZnX2NvbnRyb2xfcmF0ZSI6IjUxMiIsImNmZ19yZXMiOiIxNmJpdCJ9
patch/add-node root lfo1 mozziflow/lfo_sin Sine%20LFO
node/move lfo1 50 100
node/set-data lfo1 eyJjZmdfb3V0X2RvbWFpbiI6InNmaXgifQ==
patch/add-node root adsr1 mozziflow/adsr ADSR
node/move adsr1 50 300
node/set-data adsr1 eyJjZmdfbGVycCI6Ik1PWlpJX0NPTlRST0xfUkFURSJ9
patch/add-node root osc1 mozziflow/sin Sine
node/move osc1 300 100
node/set-data osc1 eyJjZmdfZnJlcV9tb2RlIjoiZml4ZWQifQ==
patch/add-node root lp1 mozziflow/lpf LowPass
node/move lp1 550 100
node/set-data lp1 eyJjZmdfcHJlY2lzaW9uIjoidWludDhfdCJ9
patch/add-node root svf1 mozziflow/svf SVF%20Filter
node/move svf1 550 300
node/set-data svf1 eyJtb2RlIjoiQkFORFBBU1MifQ==
patch/add-node root vca1 mozziflow/vca VCA
node/move vca1 800 100
node/set-data vca1 eyJjZmdfZG9tYWluIjoiZmxvYXQifQ==
patch/add-node root mul1 mozziflow/mul Multiply
node/move mul1 300 300
node/set-data mul1 eyJjZmdfZG9tYWluIjoic2ZpeCJ9
patch/add-node root c1 mozziflow/to_fix To%20FixMath
node/move c1 800 300
node/set-data c1 eyJjZmdfdHlwZSI6IlVGaXg8MCw4PiJ9`
};