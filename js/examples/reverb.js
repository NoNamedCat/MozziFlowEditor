EXAMPLES['reverb'] = `v2.1.1
network/add-patch root Reverb_Melody
patch/open root
# --- SEQUENCE ---
patch/add-node root metro signal/mozzi_metronome Metronome
node/update-inlet metro bpm 120

patch/add-node root seq signal/mozzi_sequencer16 Sequencer%20(16)
node/update-inlet seq s0 440
node/update-inlet seq s2 880
node/update-inlet seq s4 659

# --- AUDIO ---
patch/add-node root osc wave/mozzi_saw Saw
node/set-data osc eyJyYXRlX21vZGUiOjJ9

patch/add-node root rev filter/mozzi_reverb Reverb%20Tank
node/set-data rev eyJyYXRlX21vZGUiOjJ9
node/update-inlet rev mix 100

patch/add-node root norm math/shr Shift%20Right
node/update-inlet norm b 8

patch/add-node root out output/mozzi_master Output
node/set-data out eyJjaGFubmVscyI6Ik1PWlpJX01PTk8iLCJtb2RlIjoiTU9aWklfT1VUUFVUX1BXTSIsInJhdGVfbW9kZSI6Mn0=

# --- CONNECTIONS ---
outlet/connect metro:out seq:trig
outlet/connect seq:out osc:freq
outlet/connect osc:out rev:in
outlet/connect rev:out norm:a
outlet/connect norm:out out:audio_in

# --- POSITIONING ---
node/move metro 50 50
node/move seq 250 50
node/move osc 50 250
node/move rev 450 150
node/move norm 600 150
node/move out 750 150
`;