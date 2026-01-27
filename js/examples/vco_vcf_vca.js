EXAMPLES['vco_vcf_vca'] = `v2.1.1
network/add-patch root Classic_Subtractive
patch/open root
# --- TIMING ---
patch/add-node root clock signal/mozzi_metronome Metronome
node/set-data clock eyJyYXRlX21vZGUiOjF9
node/update-inlet clock bpm 120

# --- ENVELOPE ---
patch/add-node root adsr signal/mozzi_adsr ADSR
node/set-data adsr eyJyYXRlX21vZGUiOjF9
node/update-inlet adsr att 50
node/update-inlet adsr dec 100
node/update-inlet adsr rel 200

patch/add-node root mapper math/mozzi_map Map%20Range
node/set-data mapper eyJyYXRlX21vZGUiOjF9
node/update-inlet mapper in_min 0
node/update-inlet mapper in_max 255
node/update-inlet mapper out_min 400
node/update-inlet mapper out_max 4000

patch/add-node root smooth filter/mozzi_smooth Smooth
node/set-data smooth eyJyYXRlX21vZGUiOjJ9
node/update-inlet smooth smooth 0.95

# --- SIGNAL PATH ---
patch/add-node root osc wave/mozzi_saw Saw
node/set-data osc eyJyYXRlX21vZGUiOjJ9
node/update-inlet osc freq 110

patch/add-node root filter filter/mozzi_svf SVF%20Filter
node/set-data filter eyJyYXRlX21vZGUiOjJ9
node/update-inlet filter res 180

patch/add-node root vca signal/mozzi_gain Gain
node/set-data vca eyJyYXRlX21vZGUiOjJ9

patch/add-node root out output/mozzi_out Output
node/set-data out eyJyYXRlX21vZGUiOjJ9

# --- CONNECTIONS ---
outlet/connect clock:out adsr:trig
outlet/connect adsr:out mapper:in
outlet/connect mapper:out smooth:in
outlet/connect smooth:out filter:cutoff
outlet/connect osc:out filter:in
outlet/connect filter:out vca:in
outlet/connect adsr:out vca:gain
outlet/connect vca:out out:audio_in

# --- POSITIONING ---
node/move clock 20 50
node/move adsr 200 50
node/move mapper 400 50
node/move smooth 600 50
node/move osc 200 300
node/move filter 800 200
node/move vca 1000 200
node/move out 1200 200
`;