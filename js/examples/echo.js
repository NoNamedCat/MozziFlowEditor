EXAMPLES['echo'] = `v2.1.1
network/add-patch root Simple_Echo
patch/open root
# --- CONTROL ---
patch/add-node root metro signal/mozzi_metronome Metronome
node/update-inlet metro bpm 60

patch/add-node root adsr signal/mozzi_adsr ADSR
node/set-data adsr eyJyYXRlX21vZGUiOjF9
node/update-inlet adsr att 50
node/update-inlet adsr dec 100
node/update-inlet adsr sus 128
node/update-inlet adsr rel 200

patch/add-node root smooth filter/mozzi_smooth Smooth
node/update-inlet smooth smooth 0.95

# --- AUDIO ---
patch/add-node root s1 wave/mozzi_saw Saw
node/set-data s1 eyJyYXRlX21vZGUiOjJ9
node/update-inlet s1 freq 110

patch/add-node root vca signal/mozzi_gain Gain
node/set-data vca eyJyYXRlX21vZGUiOjJ9

patch/add-node root del filter/mozzi_audiodelay Audio%20Delay
node/set-data del eyJyYXRlX21vZGUiOjJ9
node/update-inlet del delay 128

patch/add-node root norm math/shr Shift%20Right
node/update-inlet norm b 8

patch/add-node root out output/mozzi_master Output
node/set-data out eyJjaGFubmVscyI6Ik1PWlpJX01PTk8iLCJtb2RlIjoiTU9aWklfT1VUUFVUX1BXTSIsInJhdGVfbW9kZSI6Mn0=

# --- CONNECTIONS ---
outlet/connect metro:out adsr:trig
outlet/connect adsr:out smooth:in
outlet/connect s1:out vca:in
outlet/connect smooth:out vca:gain
outlet/connect vca:out norm:a
outlet/connect norm:out del:in
outlet/connect del:out out:audio_in

# --- POSITIONING ---
node/move metro 50 50
node/move adsr 250 50
node/move smooth 450 50
node/move s1 50 250
node/move vca 650 150
node/move norm 750 150
node/move del 850 150
node/move out 1050 150
`;