EXAMPLES['encoder_router'] = `v2.1.1
network/add-patch root Encoder_Router_Logic
patch/open root
# --- ALL CONTROL RATE ---
patch/add-node root enc1 input/arduino_encoder Encoder
node/set-data enc1 eyJyYXRlX21vZGUiOjF9
node/update-inlet enc1 pinA 2
node/update-inlet enc1 pinB 3

patch/add-node root cnt1 signal/counter Counter
node/set-data cnt1 eyJyYXRlX21vZGUiOjF9
node/update-inlet cnt1 max 1

patch/add-node root rout1 signal/router2 Router%20(2)
node/set-data rout1 eyJyYXRlX21vZGUiOjF9

patch/add-node root osc1 wave/mozzi_sin Sine
node/set-data osc1 eyJyYXRlX21vZGUiOjJ9
node/set-data osc1 eyJjaGFubmVscyI6Ik1PWlpJX01PTk8iLCJtb2RlIjoiTU9aWklfT1VUUFVUX1BXTSIsInJhdGVfbW9kZSI6Mn0=
node/update-inlet osc1 freq 440

patch/add-node root osc2 wave/mozzi_saw Saw
node/set-data osc2 eyJyYXRlX21vZGUiOjJ9
node/set-data osc2 eyJjaGFubmVscyI6Ik1PWlpJX01PTk8iLCJtb2RlIjoiTU9aWklfT1VUUFVUX1BXTSIsInJhdGVfbW9kZSI6Mn0=
node/update-inlet osc2 freq 220

patch/add-node root out output/mozzi_master Output
node/set-data out eyJjaGFubmVscyI6Ik1PWlpJX01PTk8iLCJtb2RlIjoiTU9aWklfT1VUUFVUX1BXTSIsInJhdGVfbW9kZSI6Mn0=

# --- CONNECTIONS ---
outlet/connect enc1:up cnt1:up
outlet/connect enc1:down cnt1:down
outlet/connect cnt1:out rout1:idx
outlet/connect osc1:out rout1:in
outlet/connect rout1:out0 out:audio_in

# --- POSITIONING ---
node/move enc1 50 100
node/move cnt1 250 100
node/move rout1 450 100
node/move osc1 50 300
node/move osc2 250 300
node/move out 650 100
`;
