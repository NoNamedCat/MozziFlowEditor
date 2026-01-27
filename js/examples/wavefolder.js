EXAMPLES['wavefolder'] = `v2.1.1
network/add-patch root WaveFolder_Distortion
patch/open root
# --- AUDIO ENGINE ---
patch/add-node root osc wave/mozzi_sin Sine
node/set-data osc eyJyYXRlX21vZGUiOjJ9
node/update-inlet osc freq 110

patch/add-node root gain signal/mozzi_gain Pre-Gain
node/set-data gain eyJyYXRlX21vZGUiOjJ9
node/update-inlet gain gain 255

patch/add-node root fold filter/mozzi_wavefolder Wave Folder
node/set-data fold eyJyYXRlX21vZGUiOjJ9

patch/add-node root out output/mozzi_out Output
node/set-data out eyJyYXRlX21vZGUiOjJ9

# --- CONNECTIONS ---
outlet/connect osc:out gain:in
outlet/connect gain:out fold:in
outlet/connect fold:out out:audio_in

# --- POSITIONING ---
node/move osc 50 150
node/move gain 250 150
node/move fold 450 150
node/move out 650 150
`;