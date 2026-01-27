EXAMPLES['kick_drum'] = `v2.1.1
network/add-patch root Kick_Drum_Pro
patch/open root
# --- LOGIC ---
patch/add-node root clock signal/mozzi_metronome Metronome
node/set-data clock eyJyYXRlX21vZGUiOjF9
node/update-inlet clock bpm 120

# --- PITCH ENVELOPE (Audio for smooth glide) ---
patch/add-node root env_pitch signal/mozzi_ead Pitch Env
node/set-data env_pitch eyJyYXRlX21vZGUiOjJ9
node/update-inlet env_pitch att 5
node/update-inlet env_pitch dec 150

patch/add-node root p_amt math/mozzi_map Pitch Amt
node/set-data p_amt eyJyYXRlX21vZGUiOjJ9
node/update-inlet p_amt in_min 0
node/update-inlet p_amt in_max 255
node/update-inlet p_amt out_min 40
node/update-inlet p_amt out_max 200

# --- OSCILLATOR ---
patch/add-node root osc wave/mozzi_sin Sine
node/set-data osc eyJyYXRlX21vZGUiOjJ9

# --- VOLUME ENVELOPE ---
patch/add-node root env_vol signal/mozzi_ead Vol Env
node/set-data env_vol eyJyYXRlX21vZGUiOjJ9
node/update-inlet env_vol att 20
node/update-inlet env_vol dec 300

patch/add-node root vca signal/mozzi_gain Gain
node/set-data vca eyJyYXRlX21vZGUiOjJ9

patch/add-node root out output/mozzi_out Output
node/set-data out eyJyYXRlX21vZGUiOjJ9

# --- CONNECTIONS ---
outlet/connect clock:out env_pitch:trig
outlet/connect clock:out env_vol:trig
outlet/connect env_pitch:out p_amt:in
outlet/connect p_amt:out osc:freq
outlet/connect osc:out vca:in
outlet/connect env_vol:out vca:gain
outlet/connect vca:out out:audio_in

# --- POSITIONING ---
node/move clock 20 150
node/move env_pitch 200 50
node/move p_amt 400 50
node/move osc 600 50
node/move env_vol 400 250
node/move vca 800 150
node/move out 1000 150
`;