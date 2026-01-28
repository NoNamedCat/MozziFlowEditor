EXAMPLES['wavepacket'] = `v2.1.1
network/add-patch root WavePacket_Synth
patch/open root
# --- MODULATION ---
patch/add-node root lfo wave/mozzi_sin Sine
node/set-data lfo eyJyYXRlX21vZGUiOjJ9
node/set-data lfo eyJyYXRlX21vZGUiOjF9
node/update-inlet lfo freq 0.2

patch/add-node root mapper math/mozzi_map Map%20Range
node/set-data mapper eyJyYXRlX21vZGUiOjF9
node/update-inlet mapper in_min -128
node/update-inlet mapper in_max 127
node/update-inlet mapper out_min 40
node/update-inlet mapper out_max 250

patch/add-node root smooth filter/mozzi_smooth Smooth
node/set-data smooth eyJyYXRlX21vZGUiOjJ9
node/set-data smooth eyJjaGFubmVscyI6Ik1PWlpJX01PTk8iLCJtb2RlIjoiTU9aWklfT1VUUFVUX1BXTSIsInJhdGVfbW9kZSI6Mn0=
node/update-inlet smooth smooth 0.95

# --- ENGINE ---
patch/add-node root wp wave/mozzi_wavepacket WavePacket
node/set-data wp eyJyYXRlX21vZGUiOjJ9
node/set-data wp eyJjaGFubmVscyI6Ik1PWlpJX01PTk8iLCJtb2RlIjoiTU9aWklfT1VUUFVUX1BXTSIsInJhdGVfbW9kZSI6Mn0=

patch/add-node root out output/mozzi_master Output
node/set-data out eyJjaGFubmVscyI6Ik1PWlpJX01PTk8iLCJtb2RlIjoiTU9aWklfT1VUUFVUX1BXTSIsInJhdGVfbW9kZSI6Mn0=

# --- CONNECTIONS ---
outlet/connect lfo:out mapper:in
outlet/connect mapper:out smooth:in
outlet/connect smooth:out wp:fund
outlet/connect wp:out out:audio_in

# --- POSITIONING ---
node/move lfo 50 50
node/move mapper 250 50
node/move smooth 450 50
node/move wp 650 150
node/move out 850 150
`;
