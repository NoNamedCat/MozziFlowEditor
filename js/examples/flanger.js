EXAMPLES['flanger'] = `v2.1.1
network/add-patch root Flanger_Liquid
patch/open root
# --- AUDIO ---
patch/add-node root osc wave/mozzi_sin Sine
node/set-data osc eyJyYXRlX21vZGUiOjJ9
node/update-inlet osc freq 220

# --- MODULATION (Control + Smooth) ---
patch/add-node root lfo wave/mozzi_sin LFO
node/set-data lfo eyJyYXRlX21vZGUiOjF9
node/update-inlet lfo freq 0.2

patch/add-node root mapper math/mozzi_map Map Range
node/set-data mapper eyJyYXRlX21vZGUiOjF9
node/update-inlet mapper in_min -128
node/update-inlet mapper in_max 127
node/update-inlet mapper out_min 10
node/update-inlet mapper out_max 100

patch/add-node root smooth filter/mozzi_smooth Smooth
node/set-data smooth eyJyYXRlX21vZGUiOjJ9
node/update-inlet smooth smooth 0.98

# --- EFFECT ---
patch/add-node root del filter/mozzi_audiodelay Audio Delay
node/set-data del eyJyYXRlX21vZGUiOjJ9

patch/add-node root out output/mozzi_out Output
node/set-data out eyJyYXRlX21vZGUiOjJ9

# --- CONNECTIONS ---
outlet/connect lfo:out mapper:in
outlet/connect mapper:out smooth:in
outlet/connect smooth:out del:delay
outlet/connect osc:out del:in
outlet/connect del:out out:audio_in

# --- POSITIONING ---
node/move osc 50 250
node/move lfo 50 50
node/move mapper 250 50
node/move smooth 450 50
node/move del 650 150
node/move out 850 150
`;