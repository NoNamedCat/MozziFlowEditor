EXAMPLES['theremin'] = `v2.1.1
network/add-patch root Theremin_Stable
patch/open root
# --- SENSOR INPUT ---
patch/add-node root p1 wave/mozzi_sin Sine
node/set-data p1 eyJyYXRlX21vZGUiOjF9
node/update-inlet p1 freq 0.1

patch/add-node root mapper math/mozzi_map Map%20Range
node/set-data mapper eyJyYXRlX21vZGUiOjF9
node/update-inlet mapper in_min -128
node/update-inlet mapper in_max 127
node/update-inlet mapper out_min 200
node/update-inlet mapper out_max 1000

# --- STABILIZER ---
patch/add-node root smooth filter/mozzi_smooth Smooth
node/set-data smooth eyJyYXRlX21vZGUiOjJ9
node/update-inlet smooth smooth 0.95

# --- SYNTH ---
patch/add-node root osc wave/mozzi_sin Sine
node/set-data osc eyJyYXRlX21vZGUiOjJ9

patch/add-node root out output/mozzi_out Output
node/set-data out eyJyYXRlX21vZGUiOjJ9

# --- CONNECTIONS ---
outlet/connect p1:out mapper:in
outlet/connect mapper:out smooth:in
outlet/connect smooth:out osc:freq
outlet/connect osc:out out:audio_in

# --- POSITIONING ---
node/move p1 50 150
node/move mapper 250 150
node/move smooth 450 150
node/move osc 650 150
node/move out 850 150
`;