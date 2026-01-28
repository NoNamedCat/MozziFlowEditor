EXAMPLES['karplus'] = `v2.1.1
network/add-patch root Karplus_Strong_Noise
patch/open root
# --- TRIGGER ---
patch/add-node root metro signal/mozzi_metronome Metronome
node/update-inlet metro bpm 120

# --- AUDIO ---
patch/add-node root noise wave/mozzi_noise Noise

patch/add-node root env signal/mozzi_adsr ADSR
node/set-data env eyJyYXRlX21vZGUiOjF9
node/update-inlet env att 0
node/update-inlet env dec 60
node/update-inlet env sus 0
node/update-inlet env rel 50

patch/add-node root vca signal/mozzi_gain Gain
node/set-data vca eyJyYXRlX21vZGUiOjJ9

patch/add-node root norm math/shr Shift%20Right
node/update-inlet norm b 8

patch/add-node root out output/mozzi_master Output
node/set-data out eyJjaGFubmVscyI6Ik1PWlpJX01PTk8iLCJtb2RlIjoiTU9aWklfT1VUUFVUX1BXTSIsInJhdGVfbW9kZSI6Mn0=

# --- CONNECTIONS ---
outlet/connect metro:out env:trig
outlet/connect noise:out vca:in
outlet/connect env:out vca:gain
outlet/connect vca:out norm:a
outlet/connect norm:out out:audio_in

# --- POSITIONING ---
node/move metro 50 50
node/move noise 50 200
node/move env 250 50
node/move vca 450 150
node/move norm 600 150
node/move out 750 150
`;