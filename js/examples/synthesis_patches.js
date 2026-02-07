// MozziFlow Examples - SYNTHESIS CATEGORY (v7.6 High-Performance 256Hz)
EXAMPLES['synth_fm'] = {
    category: "SYNTHESIS", title: "Classic FM Synthesis",
    description: "Frequency Modulation: Modulator -> Index -> Carrier. Runs at 256Hz Control Rate.",
    code: `v2.1.1
network/add-patch root root
patch/open root
patch/add-node root mod mozziflow/sin Sine
node/move mod 100 100
node/set-data mod eyJjZmdfZnJlcSI6IjIuMGYifQ==
patch/add-node root idx mozziflow/mul Multiply
node/move idx 350 100
node/set-data idx eyJjZmdfYiI6IjUwMDAiLCJjZmdfZG9tYWluIjoiaW50In0=
patch/add-node root car mozziflow/sin Sine
node/move car 600 100
node/set-data car eyJjZmdfZnJlcSI6IjQ0MC4wZiIsImNmZ19mcmVxX21vZGUiOiJmbG9hdCJ9
patch/add-node root out mozziflow/out Audio%20Out
node/move out 850 100
node/set-data out eyJjZmdfcmVzIjoiOGJpdCIsImNmZ19jb250cm9sX3JhdGUiOiIyNTYifQ==
outlet/connect mod:out idx:a
outlet/connect idx:out car:phase
outlet/connect car:out out:in`
};

EXAMPLES['synth_subtractive'] = {
    category: "SYNTHESIS", title: "Subtractive Saw Synth",
    description: "Pro setup: Audio-rate modulation for smooth filtering at 256Hz Control Rate.",
    code: `v2.1.1
network/add-patch root root
patch/open root
patch/add-node root m1 mozziflow/metronome Metronome
node/move m1 50 250
node/set-data m1 eyJjZmdfYnBtIjoiMTIwIn0=
patch/add-node root o1 mozziflow/saw Saw
node/move o1 300 50
node/set-data o1 eyJjZmdfZnJlcSI6IjQ0MC4wZiIsImNmZ19mcmVxX21vZGUiOiJmbG9hdCJ9
patch/add-node root g1 mozziflow/gain Signal%20Boost
node/move g1 550 50
node/set-data g1 eyJjZmdfZ2FpbiI6IjY0LjAiLCJjZmdfZG9tYWluIjoic2ZpeCIsImNmZ19kb21haW5fc2V0Ijp0cnVlfQ==
patch/add-node root a1 mozziflow/adsr ADSR
node/move a1 300 250
node/rate a1 2
node/set-data a1 eyJjZmdfYXQiOiI1MCIsImNmZ19hbCI6IjI1NSIsImNmZ19kdCI6IjEwMCIsImNmZ19kbCI6IjEyOCIsImNmZ19zdCI6IjIwMCIsImNmZ19zbCI6IjEyOCIsImNmZ19ydCI6IjMwMCIsImNmZ19ybCI6IjAiLCJjZmdfbGVycCI6Ik1PWlpJX0FVRElPX1JBVEUifQ==
patch/add-node root map1 mozziflow/map Map%20Range
node/move map1 550 250
node/rate map1 2
node/set-data map1 eyJjZmdfaW5fbWluIjoiMCIsImNmZ19pbl9tYXgiOiIyNTUiLCJjZmdfb3V0X21pbiI6IjQwIiwiY2ZnX291dF9tYXgiOiI4MDAwIn0=
patch/add-node root f1 mozziflow/lpf LowPass
node/move f1 800 100
node/rate f1 2
node/set-data f1 eyJjZmdfY3V0b2ZmIjoiODAwMCIsImNmZ19yZXMiOiIwIiwiY2ZnX3ByZWNpc2lvbiI6InVpbnQxNl90In0=
patch/add-node root out mozziflow/out Audio%20Out
node/move out 1050 100
node/set-data out eyJjZmdfYXJjaCI6ImNoMzJ4MDM1IiwiY2ZnX21vZGUiOiJNT1paSV9PVVRQVVRfUFdNIiwiY2ZnX3JlcyI6IjhiaXQiLCJjZmdfY29udHJvbF9yYXRlIjoiMjU2In0=
outlet/connect m1:out a1:trig
outlet/connect o1:out g1:in
outlet/connect g1:out f1:in
outlet/connect a1:out map1:in
outlet/connect map1:out f1:cutoff
outlet/connect f1:out out:in`
};
