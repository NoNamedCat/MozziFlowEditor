EXAMPLES['wavefolder'] = `v2.1.1
network/add-patch root WaveFolder_Distortion
patch/open root
# --- AUDIO ENGINE ---
patch/add-node root osc wave/mozzi_sin Sine
node/set-data osc eyJyYXRlX21vZGUiOjJ9
node/set-data osc eyJjaGFubmVscyI6Ik1PWlpJX01PTk8iLCJtb2RlIjoiTU9aWklfT1VUUFVUX1BXTSIsInJhdGVfbW9kZSI6Mn0=
node/update-inlet osc freq 110

patch/add-node root gain signal/mozzi_gain Gain
node/set-data gain eyJjaGFubmVscyI6Ik1PWlpJX01PTk8iLCJtb2RlIjoiTU9aWklfT1VUUFVUX1BXTSIsInJhdGVfbW9kZSI6Mn0=
node/update-inlet gain gain 255

patch/add-node root fold filter/mozzi_wavefolder Wave%20Folder
node/set-data fold eyJyYXRlX21vZGUiOjJ9
node/set-data fold eyJjaGFubmVscyI6Ik1PWlpJX01PTk8iLCJtb2RlIjoiTU9aWklfT1VUUFVUX1BXTSIsInJhdGVfbW9kZSI6Mn0=

patch/add-node root out output/mozzi_master Output
node/set-data out eyJjaGFubmVscyI6Ik1PWlpJX01PTk8iLCJtb2RlIjoiTU9aWklfT1VUUFVUX1BXTSIsInJhdGVfbW9kZSI6Mn0=

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
