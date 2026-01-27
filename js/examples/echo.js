EXAMPLES['echo'] = `v2.1.1
network/add-patch root Echo_Enveloped
patch/open root
# --- TIMING (Control) ---
patch/add-node root metro signal/mozzi_metronome Metronome
node/set-data metro eyJyYXRlX21vZGUiOjF9
node/update-inlet metro bpm 60

patch/add-node root adsr signal/mozzi_adsr ADSR
node/set-data adsr eyJyYXRlX21vZGUiOjF9
node/update-inlet adsr att 50
node/update-inlet adsr dec 100
node/update-inlet adsr rel 200

patch/add-node root smooth filter/mozzi_smooth Smooth
node/set-data smooth eyJyYXRlX21vZGUiOjJ9
node/update-inlet smooth smooth 0.95

# --- AUDIO ---
patch/add-node root s1 wave/mozzi_saw Saw
node/set-data s1 eyJyYXRlX21vZGUiOjJ9
node/update-inlet s1 freq 110

patch/add-node root vca signal/mozzi_gain Gain
node/set-data vca eyJyYXRlX21vZGUiOjJ9

patch/add-node root del filter/mozzi_audiodelay Audio Delay
node/set-data del eyJyYXRlX21vZGUiOjJ9
node/update-inlet del delay 128

patch/add-node root out output/mozzi_out Output
node/set-data out eyJyYXRlX21vZGUiOjJ9

# --- CONNECTIONS ---
outlet/connect metro:out adsr:trig
outlet/connect adsr:out smooth:in
outlet/connect smooth:out vca:gain
outlet/connect s1:out vca:in
outlet/connect vca:out del:in
outlet/connect del:out out:audio_in

# --- POSITIONING ---
node/move metro 50 50
node/move adsr 250 50
node/move smooth 450 50
node/move s1 50 250
node/move vca 650 150
node/move del 850 150
node/move out 1050 150
`;