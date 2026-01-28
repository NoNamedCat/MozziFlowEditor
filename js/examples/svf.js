EXAMPLES['svf'] = `v2.1.1
network/add-patch root SVF_Filter_Sweep
patch/open root
# --- MODULATION ---
patch/add-node root lfo wave/mozzi_sin Sine
node/set-data lfo eyJyYXRlX21vZGUiOjF9
node/update-inlet lfo freq 0.2

patch/add-node root mapper math/mozzi_map Map%20Range
node/set-data mapper eyJyYXRlX21vZGUiOjF9
node/update-inlet mapper in_min -128
node/update-inlet mapper in_max 127
node/update-inlet mapper out_min 200
node/update-inlet mapper out_max 4000

patch/add-node root smooth filter/mozzi_smooth Smooth
node/set-data smooth eyJyYXRlX21vZGUiOjF9
node/update-inlet smooth smooth 0.95

# --- ENGINE ---
patch/add-node root osc wave/mozzi_saw Saw
node/set-data osc eyJyYXRlX21vZGUiOjJ9
node/update-inlet osc freq 110

patch/add-node root filter filter/mozzi_svf SVF%20Filter
node/set-data filter eyJtb2RlIjoiTE9XUEFTUyIsInJhdGVfbW9kZSI6Mn0=
node/update-inlet filter res 180

patch/add-node root out output/mozzi_master Output
node/set-data out eyJjaGFubmVscyI6Ik1PWlpJX01PTk8iLCJtb2RlIjoiTU9aWklfT1VUUFVUX1BXTSIsInJhdGVfbW9kZSI6Mn0=

# --- CONNECTIONS ---
outlet/connect lfo:out mapper:in
outlet/connect mapper:out smooth:in
outlet/connect smooth:out filter:cutoff
outlet/connect osc:out filter:in
outlet/connect filter:out out:audio_in

# --- POSITIONING ---
node/move lfo 50 50
node/move mapper 250 50
node/move smooth 450 50
node/move osc 50 250
node/move filter 650 150
node/move out 850 150
`;