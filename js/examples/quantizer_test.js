EXAMPLES['quantizer_test'] = `v2.1.1
network/add-patch root Quantizer_Test
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
node/update-inlet mapper out_min 36
node/update-inlet mapper out_max 72

patch/add-node root mtof math/mtof Midi->Freq
node/set-data mtof eyJyYXRlX21vZGUiOjF9

# --- AUDIO ---
patch/add-node root osc wave/mozzi_sin Sine
node/set-data osc eyJyYXRlX21vZGUiOjJ9
node/set-data osc eyJjaGFubmVscyI6Ik1PWlpJX01PTk8iLCJtb2RlIjoiTU9aWklfT1VUUFVUX1BXTSIsInJhdGVfbW9kZSI6Mn0=

patch/add-node root out output/mozzi_master Output
node/set-data out eyJjaGFubmVscyI6Ik1PWlpJX01PTk8iLCJtb2RlIjoiTU9aWklfT1VUUFVUX1BXTSIsInJhdGVfbW9kZSI6Mn0=

# --- CONNECTIONS ---
outlet/connect lfo:out mapper:in
outlet/connect mapper:out mtof:note
outlet/connect mtof:out osc:freq
outlet/connect osc:out out:audio_in

# --- POSITIONING ---
node/move lfo 50 150
node/move mapper 250 150
node/move mtof 450 150
node/move osc 650 150
node/move out 850 150
`;
