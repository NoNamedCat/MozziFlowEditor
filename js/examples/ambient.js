EXAMPLES['ambient'] = `v2.1.1
network/add-patch p1 Ambient_Reverb_Optimized
patch/open p1
# --- CONTROL RATE ---
patch/add-node p1 metro signal/mozzi_metronome Metronome
node/set-data metro eyJyYXRlX21vZGUiOjF9
node/update-inlet metro bpm 60

patch/add-node p1 adsr signal/mozzi_adsr ADSR
node/set-data adsr eyJyYXRlX21vZGUiOjF9
node/update-inlet adsr att 50
node/update-inlet adsr dec 100
node/update-inlet adsr sus 150
node/update-inlet adsr rel 200

patch/add-node p1 smooth filter/mozzi_smooth Smooth
node/set-data smooth eyJyYXRlX21vZGUiOjJ9
node/update-inlet smooth smooth 0.95

# --- AUDIO RATE ---
patch/add-node p1 saw wave/mozzi_saw Saw
node/set-data saw eyJyYXRlX21vZGUiOjJ9
node/update-inlet saw freq 440

patch/add-node p1 gain signal/mozzi_gain Gain
node/set-data gain eyJyYXRlX21vZGUiOjJ9

patch/add-node p1 rev filter/mozzi_reverb Reverb Tank
node/set-data rev eyJyYXRlX21vZGUiOjJ9
node/update-inlet rev mix 150

patch/add-node p1 out output/mozzi_out Output
node/set-data out eyJyYXRlX21vZGUiOjJ9

# --- CONNECTIONS ---
outlet/connect metro:out adsr:trig
outlet/connect adsr:out smooth:in
outlet/connect smooth:out gain:gain
outlet/connect saw:out gain:in
outlet/connect gain:out rev:in
outlet/connect rev:out out:audio_in

# --- POSITIONING ---
node/move metro 50 50
node/move adsr 250 50
node/move smooth 450 50
node/move saw 50 300
node/move gain 650 200
node/move rev 850 200
node/move out 1050 200
`;