EXAMPLES['kick_drum'] = `v2.1.1
network/add-patch root Kick_Synthesizer
patch/open root
# --- CLOCK ---
patch/add-node root clock signal/mozzi_metronome Metronome
node/update-inlet clock bpm 120

# --- PITCH ENV ---
patch/add-node root env_p signal/mozzi_ead Ead%20Env
node/update-inlet env_p att 5
node/update-inlet env_p dec 100

patch/add-node root map_p math/mozzi_map Map%20Range
node/update-inlet map_p out_min 40
node/update-inlet map_p out_max 150

# --- AUDIO ---
patch/add-node root osc wave/mozzi_sin Sine
node/set-data osc eyJyYXRlX21vZGUiOjJ9

patch/add-node root env_v signal/mozzi_ead Ead%20Env
node/set-data env_v eyJyYXRlX21vZGUiOjJ9
node/update-inlet env_v att 10
node/update-inlet env_v dec 400

patch/add-node root vca signal/mozzi_gain Gain
node/set-data vca eyJyYXRlX21vZGUiOjJ9

patch/add-node root norm math/shr Shift%20Right
node/update-inlet norm b 8

patch/add-node root out output/mozzi_master Output
node/set-data out eyJjaGFubmVscyI6Ik1PWlpJX01PTk8iLCJtb2RlIjoiTU9aWklfT1VUUFVUX1BXTSIsInJhdGVfbW9kZSI6Mn0=

# --- CONNECTIONS ---
outlet/connect clock:out env_p:trig
outlet/connect env_p:out map_p:in
outlet/connect map_p:out osc:freq
outlet/connect clock:out env_v:trig
outlet/connect osc:out vca:in
outlet/connect env_v:out vca:gain
outlet/connect vca:out norm:a
outlet/connect norm:out out:audio_in

# --- POSITIONING ---
node/move clock 50 50
node/move env_p 250 50
node/move map_p 450 50
node/move osc 50 250
node/move env_v 250 250
node/move vca 650 150
node/move norm 800 150
node/move out 950 150
`;