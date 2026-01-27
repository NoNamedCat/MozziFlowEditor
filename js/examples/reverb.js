EXAMPLES['reverb'] = `v2.1.1
network/add-patch root Reverb_Pro
patch/open root
# --- CONTROL RATE SECTION (64Hz) ---
patch/add-node root 2v0v signal/mozzi_metronome Metronome
node/move 2v0v 37 263
node/update-inlet 2v0v bpm 120
node/set-data 2v0v eyJyYXRlX21vZGUiOjF9

patch/add-node root fy0x signal/mozzi_sequencer16 Sequencer%2016
node/move fy0x 403 82
node/update-inlet fy0x s0 440
node/update-inlet fy0x s1 440
node/update-inlet fy0x s2 880
node/update-inlet fy0x s3 440
node/update-inlet fy0x s4 659
node/update-inlet fy0x s5 440
node/update-inlet fy0x s6 784
node/update-inlet fy0x s7 880
node/update-inlet fy0x s8 440
node/update-inlet fy0x s9 440
node/update-inlet fy0x s10 1318
node/update-inlet fy0x s11 880
node/update-inlet fy0x s12 440
node/update-inlet fy0x s13 440
node/update-inlet fy0x s14 880
node/update-inlet fy0x s15 659
node/set-data fy0x eyJyYXRlX21vZGUiOjF9

# --- AUDIO RATE SECTION (16kHz) ---
patch/add-node root 98uu signal/mozzi_adsr ADSR
node/move 98uu 414 656
node/update-inlet 98uu att 5
node/update-inlet 98uu lev 255
node/update-inlet 98uu dec 50
node/update-inlet 98uu sus 128
node/update-inlet 98uu rel 50
node/set-data 98uu eyJyYXRlX21vZGUiOjJ9

patch/add-node root 57t5 math/mozzi_map Map%20Range
node/move 57t5 703 403
node/update-inlet 57t5 min 0
node/update-inlet 57t5 max 200
node/set-data 57t5 eyJyYXRlX21vZGUiOjJ9

patch/add-node root z3tz wave/mozzi_saw Saw
node/move z3tz 706 274
node/update-inlet z3tz freq 440
node/set-data z3tz eyJyYXRlX21vZGUiOjJ9

patch/add-node root ss45 signal/mozzi_gain Gain
node/move ss45 951 340
node/update-inlet ss45 gain 255
node/set-data ss45 eyJyYXRlX21vZGUiOjJ9

patch/add-node root 44hy filter/mozzi_reverb Reverb%20Tank
node/move 44hy 1189 350
node/update-inlet 44hy mix 80
node/set-data 44hy eyJyYXRlX21vZGUiOjJ9

patch/add-node root f4uw output/mozzi_out Output
node/move f4uw 1458 375
node/set-data f4uw eyJyYXRlX21vZGUiOjJ9

# --- CONNECTIONS ---
outlet/connect 2v0v:out fy0x:trig
outlet/connect 2v0v:out 98uu:trig
outlet/connect fy0x:out z3tz:freq
outlet/connect z3tz:out ss45:in
outlet/connect ss45:out 44hy:in
outlet/connect 44hy:out f4uw:audio_in
outlet/connect 98uu:out 57t5:in
outlet/connect 57t5:out ss45:gain
`;