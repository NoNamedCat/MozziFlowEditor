EXAMPLES['detune'] = `v2.1.1
network/add-patch root Detuned_Saws
patch/open root
# --- OSCILLATORS ---
patch/add-node root s1 wave/mozzi_saw Saw
node/set-data s1 eyJyYXRlX21vZGUiOjJ9
node/update-inlet s1 freq 220

patch/add-node root s2 wave/mozzi_saw Saw
node/set-data s2 eyJyYXRlX21vZGUiOjJ9
node/update-inlet s2 freq 220.5

# --- MIXER ---
patch/add-node root mix math/add Add
node/set-data mix eyJyYXRlX21vZGUiOjJ9

patch/add-node root norm math/shr Shift%20Right
node/update-inlet norm b 1

patch/add-node root out output/mozzi_master Output
node/set-data out eyJjaGFubmVscyI6Ik1PWlpJX01PTk8iLCJtb2RlIjoiTU9aWklfT1VUUFVUX1BXTSIsInJhdGVfbW9kZSI6Mn0=

# --- CONNECTIONS ---
outlet/connect s1:out mix:a
outlet/connect s2:out mix:b
outlet/connect mix:out norm:a
outlet/connect norm:out out:audio_in

# --- POSITIONING ---
node/move s1 50 50
node/move s2 50 200
node/move mix 250 125
node/move norm 400 125
node/move out 550 125
`;