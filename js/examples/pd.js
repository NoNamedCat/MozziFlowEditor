EXAMPLES['pd'] = `v2.1.1
network/add-patch root Phase_Distortion
patch/open root
# --- MODULATION ---
patch/add-node root lfo wave/mozzi_sin Sine
node/set-data lfo eyJyYXRlX21vZGUiOjF9
node/update-inlet lfo freq 0.5

patch/add-node root mapper math/mozzi_map Map%20Range
node/set-data mapper eyJyYXRlX21vZGUiOjF9
node/update-inlet mapper in_min -128
node/update-inlet mapper in_max 127
node/update-inlet mapper out_min 0
node/update-inlet mapper out_max 255

patch/add-node root smooth filter/mozzi_smooth Smooth
node/set-data smooth eyJyYXRlX21vZGUiOjF9
node/update-inlet smooth smooth 0.95

# --- ENGINE ---
patch/add-node root osc wave/mozzi_saw Saw
node/set-data osc eyJyYXRlX21vZGUiOjJ9
node/update-inlet osc freq 110

patch/add-node root out output/mozzi_master Output
node/set-data out eyJjaGFubmVscyI6Ik1PWlpJX01PTk8iLCJtb2RlIjoiTU9aWklfT1VUUFVUX1BXTSIsInJhdGVfbW9kZSI6Mn0=

# --- CONNECTIONS ---
outlet/connect lfo:out mapper:in
outlet/connect mapper:out smooth:in
outlet/connect osc:out out:audio_in

# --- POSITIONING ---
node/move lfo 50 50
node/move mapper 250 50
node/move smooth 450 50
node/move osc 650 150
node/move out 850 150
`;