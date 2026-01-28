EXAMPLES['ambient'] = `v2.1.1
network/add-patch p1 Ambient_Cloud_Stereo
patch/open p1
# --- CLOUD GENERATOR ---
patch/add-node p1 lfo1 wave/mozzi_sin Sine
node/set-data lfo1 eyJyYXRlX21vZGUiOjF9
node/update-inlet lfo1 freq 0.1

patch/add-node p1 map1 math/mozzi_map Map%20Range
node/set-data map1 eyJyYXRlX21vZGUiOjF9
node/update-inlet map1 out_min 200
node/update-inlet map1 out_max 800

# --- AUDIO ---
patch/add-node p1 saw1 wave/mozzi_saw Saw
node/set-data saw1 eyJyYXRlX21vZGUiOjJ9

patch/add-node p1 rev filter/mozzi_reverb Reverb%20Tank
node/set-data rev eyJyYXRlX21vZGUiOjJ9
node/update-inlet rev mix 128

patch/add-node p1 norm math/shr Shift%20Right
node/update-inlet norm b 8

# --- OUTPUT STEREO ---
patch/add-node p1 out output/mozzi_master Output
node/set-data out eyJjaGFubmVscyI6Ik1PWlpJX1NURVJFTyIsIm1vZGUiOiJNT1paSV9PVVRQVVRfUFdNIiwicmF0ZV9tb2RlIjoyfQ==

# --- CONNECTIONS ---
outlet/connect lfo1:out map1:in
outlet/connect map1:out saw1:freq
outlet/connect saw1:out rev:in
outlet/connect rev:out norm:a
outlet/connect norm:out out:l
outlet/connect norm:out out:r

# --- POSITIONING ---
node/move lfo1 50 50
node/move map1 250 50
node/move saw1 450 150
node/move rev 650 150
node/move norm 750 150
node/move out 900 150
`;