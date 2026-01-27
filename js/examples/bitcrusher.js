EXAMPLES['bitcrusher'] = `v2.1.1
network/add-patch bc BitCrusher_Native
patch/open bc
# --- SOURCE ---
patch/add-node bc src wave/mozzi_sin Sine
node/update-inlet src freq 110
node/set-data src eyJyYXRlX21vZGUiOjJ9

# --- MODULATOR ---
patch/add-node bc rate_lfo wave/mozzi_phasor Phasor
node/update-inlet rate_lfo freq 2
node/set-data rate_lfo eyJyYXRlX21vZGUiOjF9

patch/add-node bc mapper math/mozzi_map Map%20Range
node/update-inlet mapper in_min 0
node/update-inlet mapper in_max 255
node/update-inlet mapper out_min 1
node/update-inlet mapper out_max 6
node/set-data mapper eyJyYXRlX21vZGUiOjF9

# --- EFFECT ---
patch/add-node bc crush math_audio/bitcrush Bit-Crusher
node/set-data crush eyJyYXRlX21vZGUiOjJ9

patch/add-node bc out output/mozzi_out Output
node/set-data out eyJyYXRlX21vZGUiOjJ9

# --- CONNECTIONS ---
outlet/connect rate_lfo:out mapper:in
outlet/connect mapper:out crush:bits
outlet/connect src:out crush:in
outlet/connect crush:out out:audio_in

# --- POSITIONING ---
node/move src 50 50
node/move rate_lfo 50 250
node/move mapper 250 250
node/move crush 450 150
node/move out 650 150
`;