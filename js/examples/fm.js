EXAMPLES['fm'] = `v2.1.1
network/add-patch fm FM_Synthesis_HiRes
patch/open fm
# --- MODULATOR ---
patch/add-node fm mod wave/mozzi_sin Sine
node/set-data mod eyJyYXRlX21vZGUiOjJ9
node/update-inlet mod freq 5

patch/add-node fm gain signal/mozzi_gain Gain
node/set-data gain eyJyYXRlX21vZGUiOjJ9
node/update-inlet gain gain 150

# --- CARRIER ---
patch/add-node fm car wave/mozzi_sin Sine
node/set-data car eyJyYXRlX21vZGUiOjJ9
node/update-inlet car freq 440

patch/add-node fm out output/mozzi_out Output
node/set-data out eyJyYXRlX21vZGUiOjJ9

# --- CONNECTIONS ---
outlet/connect mod:out gain:in
outlet/connect gain:out car:phase
outlet/connect car:out out:audio_in

# --- POSITIONING ---
node/move mod 50 50
node/move gain 250 50
node/move car 450 50
node/move out 650 50
`;