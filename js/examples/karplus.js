EXAMPLES['karplus'] = `v2.1.1
network/add-patch root Karplus_Strong
patch/open root
# --- TIMING ---
patch/add-node root metro signal/mozzi_metronome Metronome
node/set-data metro eyJyYXRlX21vZGUiOjF9
node/update-inlet metro bpm 120

# --- NOISE BURST ---
patch/add-node root noise wave/mozzi_noise Noise
node/set-data noise eyJyYXRlX21vZGUiOjJ9

patch/add-node root env signal/mozzi_adsr ADSR
node/set-data env eyJyYXRlX21vZGUiOjJ9
node/update-inlet env att 0
node/update-inlet env dec 60
node/update-inlet env sus 0
node/update-inlet env rel 50

# --- VCA ---
patch/add-node root vca signal/mozzi_gain Gain
node/set-data vca eyJyYXRlX21vZGUiOjJ9

patch/add-node root out output/mozzi_out Output
node/set-data out eyJyYXRlX21vZGUiOjJ9

# --- CONNECTIONS ---
outlet/connect metro:out env:trig
outlet/connect noise:out vca:in
outlet/connect env:out vca:gain
outlet/connect vca:out out:audio_in

# --- POSITIONING ---
node/move metro 50 150
node/move noise 250 50
node/move env 250 250
node/move vca 450 150
node/move out 650 150
`;