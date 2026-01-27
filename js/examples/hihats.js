EXAMPLES['hihats'] = `v2.1.1
network/add-patch root HiHats_WhiteNoise
patch/open root
# --- CLOCK ---
patch/add-node root clock signal/mozzi_metronome Metronome
node/set-data clock eyJyYXRlX21vZGUiOjF9
node/update-inlet clock bpm 240

# --- NOISE ENGINE ---
patch/add-node root noise wave/mozzi_noise Noise
node/set-data noise eyJyYXRlX21vZGUiOjJ9

patch/add-node root hpf filter/mozzi_svf SVF%20Filter
node/set-data hpf eyJyYXRlX21vZGUiOjJ9
node/update-inlet hpf cutoff 8000
node/update-inlet hpf res 200

# --- ENVELOPE ---
patch/add-node root env signal/mozzi_ead Ead%20Env
node/set-data env eyJyYXRlX21vZGUiOjJ9
node/update-inlet env att 20
node/update-inlet env dec 100

patch/add-node root vca signal/mozzi_gain Gain
node/set-data vca eyJyYXRlX21vZGUiOjJ9

patch/add-node root out output/mozzi_out Output
node/set-data out eyJyYXRlX21vZGUiOjJ9

# --- CONNECTIONS ---
outlet/connect clock:out env:trig
outlet/connect noise:out hpf:in
outlet/connect hpf:out vca:in
outlet/connect env:out vca:gain
outlet/connect vca:out out:audio_in

# --- POSITIONING ---
node/move clock 50 100
node/move noise 250 50
node/move hpf 450 50
node/move env 450 250
node/move vca 650 150
node/move out 850 150
`;