EXAMPLES['sh_random'] = `v2.1.1
network/add-patch root S_H_Random
patch/open root
# --- TRIGGER (Control) ---
patch/add-node root clock signal/mozzi_metronome Metronome
node/set-data clock eyJyYXRlX21vZGUiOjF9
node/update-inlet clock bpm 120

# --- NOISE (Audio) ---
patch/add-node root noise wave/mozzi_noise Noise
node/set-data noise eyJyYXRlX21vZGUiOjJ9

# --- SAMPLE & HOLD ---
patch/add-node root sh signal/mozzi_sh S&H
node/set-data sh eyJyYXRlX21vZGUiOjJ9

# --- AUDIO OUT ---
patch/add-node root vca signal/mozzi_gain Gain
node/set-data vca eyJyYXRlX21vZGUiOjJ9
node/update-inlet vca gain 128

patch/add-node root out output/mozzi_out Output
node/set-data out eyJyYXRlX21vZGUiOjJ9

# --- CONNECTIONS ---
outlet/connect clock:out sh:trig
outlet/connect noise:out sh:in
outlet/connect sh:out vca:in
outlet/connect vca:out out:audio_in

# --- POSITIONING ---
node/move clock 50 50
node/move noise 50 250
node/move sh 250 150
node/move vca 450 150
node/move out 650 150
`;