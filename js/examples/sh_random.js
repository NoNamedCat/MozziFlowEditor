EXAMPLES['sh_random'] = `v2.1.1
network/add-patch root Sample_and_Hold_Random
patch/open root
# --- TRIGGER ---
patch/add-node root clock signal/mozzi_metronome Metronome
node/update-inlet clock bpm 120

# --- AUDIO ---
patch/add-node root noise wave/mozzi_noise Noise

patch/add-node root sh signal/mozzi_sh S%26H

patch/add-node root vca signal/mozzi_gain Gain
node/set-data vca eyJyYXRlX21vZGUiOjJ9
node/update-inlet vca gain 128

patch/add-node root norm math/shr Shift%20Right
node/update-inlet norm b 7

patch/add-node root out output/mozzi_master Output
node/set-data out eyJjaGFubmVscyI6Ik1PWlpJX01PTk8iLCJtb2RlIjoiTU9aWklfT1VUUFVUX1BXTSIsInJhdGVfbW9kZSI6Mn0=

# --- CONNECTIONS ---
outlet/connect noise:out sh:in
outlet/connect clock:out sh:trig
outlet/connect sh:out vca:in
outlet/connect vca:out norm:a
outlet/connect norm:out out:audio_in

# --- POSITIONING ---
node/move clock 50 50
node/move noise 50 200
node/move sh 250 125
node/move vca 450 150
node/move norm 600 150
node/move out 750 150
`;