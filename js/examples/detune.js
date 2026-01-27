EXAMPLES['detune'] = `v2.1.1
network/add-patch root Detune_Oscillators
patch/open root
# --- AUDIO OSCILLATORS ---
patch/add-node root s1 wave/mozzi_sin Sine 1
node/set-data s1 eyJyYXRlX21vZGUiOjJ9
node/update-inlet s1 freq 220

patch/add-node root s2 wave/mozzi_sin Sine 2
node/set-data s2 eyJyYXRlX21vZGUiOjJ9
node/update-inlet s2 freq 220.5

# --- MIXER (High Precision) ---
patch/add-node root mix math/add Add
node/set-data mix eyJyYXRlX21vZGUiOjJ9

patch/add-node root out output/mozzi_out Output
node/set-data out eyJyYXRlX21vZGUiOjJ9

# --- CONNECTIONS ---
outlet/connect s1:out mix:a
outlet/connect s2:out mix:b
outlet/connect mix:out out:audio_in

# --- POSITIONING ---
node/move s1 50 50
node/move s2 50 200
node/move mix 250 125
node/move out 450 125
`;