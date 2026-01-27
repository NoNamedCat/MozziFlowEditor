EXAMPLES['granular_synth'] = `v2.1.1
network/add-patch root Granular_WavePacket
patch/open root
# --- SCANNING ---
patch/add-node root lfo1 wave/mozzi_sin Sine
node/set-data lfo1 eyJyYXRlX21vZGUiOjF9
node/update-inlet lfo1 freq 0.5

patch/add-node root mapper math/mozzi_map Map%20Range
node/set-data mapper eyJyYXRlX21vZGUiOjF9
node/update-inlet mapper in_min -128
node/update-inlet mapper in_max 127
node/update-inlet mapper out_min 50
node/update-inlet mapper out_max 500

patch/add-node root smooth filter/mozzi_smooth Smooth
node/set-data smooth eyJyYXRlX21vZGUiOjJ9
node/update-inlet smooth smooth 0.9

# --- ENGINE ---
patch/add-node root wp1 wave/mozzi_wavepacket WavePacket
node/set-data wp1 eyJyYXRlX21vZGUiOjJ9

patch/add-node root out output/mozzi_out Output
node/set-data out eyJyYXRlX21vZGUiOjJ9

# --- CONNECTIONS ---
outlet/connect lfo1:out mapper:in
outlet/connect mapper:out smooth:in
outlet/connect smooth:out wp1:fund
outlet/connect wp1:out out:audio_in

# --- POSITIONING ---
node/move lfo1 50 50
node/move mapper 250 50
node/move smooth 450 50
node/move wp1 650 150
node/move out 850 150
`;