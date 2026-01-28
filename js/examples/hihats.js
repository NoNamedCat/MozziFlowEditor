EXAMPLES['hihats'] = `v2.1.1
network/add-patch root Hi-Hats_Noise
patch/open root
# --- CLOCK ---
patch/add-node root clock signal/mozzi_metronome Metronome
node/update-inlet clock bpm 240

# --- AUDIO ---
patch/add-node root noise wave/mozzi_noise Noise

patch/add-node root hpf filter/mozzi_svf SVF%20Filter
node/set-data hpf eyJyYXRlX21vZGUiOjIsIm1vZGUiOiJISUdIUEFTUyJ9
node/update-inlet hpf cutoff 8000
node/update-inlet hpf res 200

patch/add-node root env signal/mozzi_ead Ead%20Env
node/set-data env eyJyYXRlX21vZGUiOjJ9
node/update-inlet env att 20
node/update-inlet env dec 100

patch/add-node root vca signal/mozzi_gain Gain
node/set-data vca eyJyYXRlX21vZGUiOjJ9

patch/add-node root norm math/shr Shift%20Right
node/update-inlet norm b 8

patch/add-node root out output/mozzi_master Output
node/set-data out eyJjaGFubmVscyI6Ik1PWlpJX01PTk8iLCJtb2RlIjoiTU9aWklfT1VUUFVUX1BXTSIsInJhdGVfbW9kZSI6Mn0=

# --- CONNECTIONS ---
outlet/connect noise:out hpf:in
outlet/connect clock:out env:trig
outlet/connect hpf:out vca:in
outlet/connect env:out vca:gain
outlet/connect vca:out norm:a
outlet/connect norm:out out:audio_in

# --- POSITIONING ---
node/move clock 50 50
node/move noise 50 200
node/move hpf 250 200
node/move env 250 50
node/move vca 450 150
node/move norm 600 150
node/move out 750 150
`;