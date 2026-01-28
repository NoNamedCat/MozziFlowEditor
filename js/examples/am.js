EXAMPLES['am'] = `v2.1.1
network/add-patch am Amplitude_Modulation
patch/open am
# --- MODULATION ---
patch/add-node am mod lfo/mozzi_lfo_sin Sine%20LFO
node/set-data mod eyJyYXRlX21vZGUiOjF9
node/update-inlet mod freq 4

patch/add-node am smooth filter/mozzi_smooth Smooth
node/set-data smooth eyJyYXRlX21vZGUiOjF9
node/update-inlet smooth smooth 0.9

# --- CARRIER ---
patch/add-node am car wave/mozzi_sin Sine
node/set-data car eyJyYXRlX21vZGUiOjJ9
node/update-inlet car freq 440

patch/add-node am mul signal/mozzi_gain Gain
node/set-data mul eyJyYXRlX21vZGUiOjJ9

patch/add-node am norm math/shr Shift%20Right
node/update-inlet norm b 7

patch/add-node am out output/mozzi_master Output
node/set-data out eyJjaGFubmVscyI6Ik1PWlpJX01PTk8iLCJtb2RlIjoiTU9aWklfT1VUUFVUX1BXTSIsInJhdGVfbW9kZSI6Mn0=

# --- CONNECTIONS ---
outlet/connect mod:out smooth:in
outlet/connect smooth:out mul:gain
outlet/connect car:out mul:in
outlet/connect mul:out norm:a
outlet/connect norm:out out:audio_in

# --- POSITIONING ---
node/move mod 50 50
node/move smooth 250 50
node/move car 50 250
node/move mul 450 150
node/move norm 600 150
node/move out 750 150
`;