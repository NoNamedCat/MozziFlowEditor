EXAMPLES['drums'] = `v2.1.1
network/add-patch root Drum_Machine
patch/open root
# --- TIMING (Control) ---
patch/add-node root m1 signal/mozzi_metronome Metronome
node/set-data m1 eyJyYXRlX21vZGUiOjF9
node/update-inlet m1 bpm 124

# --- KICK SYNTH (Audio for fast attack) ---
patch/add-node root kick wave/mozzi_sin Sine
node/set-data kick eyJyYXRlX21vZGUiOjJ9
node/update-inlet kick freq 55

patch/add-node root env signal/mozzi_ead Ead Env
node/set-data env eyJyYXRlX21vZGUiOjJ9
node/update-inlet env att 20
node/update-inlet env dec 200

patch/add-node root vca signal/mozzi_gain Gain
node/set-data vca eyJyYXRlX21vZGUiOjJ9

patch/add-node root out output/mozzi_out Output
node/set-data out eyJyYXRlX21vZGUiOjJ9

# --- CONNECTIONS ---
outlet/connect m1:out env:trig
outlet/connect kick:out vca:in
outlet/connect env:out vca:gain
outlet/connect vca:out out:audio_in

# --- POSITIONING ---
node/move m1 50 150
node/move kick 250 50
node/move env 250 250
node/move vca 450 150
node/move out 650 150
`;