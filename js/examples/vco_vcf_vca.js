EXAMPLES['vco_vcf_vca'] = `v2.1.1
network/add-patch root Classic_Mono_Synth
patch/open root
# --- CONTROL ---
patch/add-node root clock signal/mozzi_metronome Metronome
node/update-inlet clock bpm 120

patch/add-node root adsr signal/mozzi_adsr ADSR
node/set-data adsr eyJyYXRlX21vZGUiOjF9
node/update-inlet adsr att 50
node/update-inlet adsr dec 100
node/update-inlet adsr sus 128
node/update-inlet adsr rel 200

patch/add-node root smooth filter/mozzi_smooth Smooth
node/update-inlet smooth smooth 0.95

# --- AUDIO ---
patch/add-node root osc wave/mozzi_saw Saw
node/set-data osc eyJyYXRlX21vZGUiOjJ9
node/update-inlet osc freq 110

patch/add-node root filter filter/mozzi_svf SVF%20Filter
node/set-data filter eyJyYXRlX21vZGUiOjJ9
node/update-inlet filter res 180

patch/add-node root vca signal/mozzi_gain Gain
node/set-data vca eyJyYXRlX21vZGUiOjJ9

patch/add-node root norm math/shr Shift%20Right
node/update-inlet norm b 8

patch/add-node root out output/mozzi_master Output
node/set-data out eyJjaGFubmVscyI6Ik1PWlpJX01PTk8iLCJtb2RlIjoiTU9aWklfT1VUUFVUX1BXTSIsInJhdGVfbW9kZSI6Mn0=

# --- CONNECTIONS ---
outlet/connect clock:out adsr:trig
outlet/connect adsr:out filter:cutoff
outlet/connect adsr:out smooth:in
outlet/connect osc:out filter:in
outlet/connect filter:out vca:in
outlet/connect smooth:out vca:gain
outlet/connect vca:out norm:a
outlet/connect norm:out out:audio_in

# --- POSITIONING ---
node/move clock 50 50
node/move adsr 250 50
node/move smooth 450 50
node/move osc 50 250
node/move filter 250 250
node/move vca 650 150
node/move norm 800 150
node/move out 950 150
`;