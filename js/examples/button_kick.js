EXAMPLES['button_kick'] = `v2.1.1
network/add-patch root Button_Kick
patch/open root
# --- INPUT ---
patch/add-node root btn1 input/arduino_button Button
node/set-data btn1 eyJyYXRlX21vZGUiOjF9
node/update-inlet btn1 pin 5

# --- ENGINE ---
patch/add-node root kick wave/mozzi_sin Sine
node/set-data kick eyJyYXRlX21vZGUiOjJ9
node/update-inlet kick freq 60

patch/add-node root env signal/mozzi_ead Ead%20Env
node/set-data env eyJyYXRlX21vZGUiOjJ9
node/update-inlet env att 20
node/update-inlet env dec 200

patch/add-node root vca signal/mozzi_gain Gain
node/set-data vca eyJyYXRlX21vZGUiOjJ9

patch/add-node root norm math/shr Shift%20Right
node/update-inlet norm b 8

patch/add-node root out output/mozzi_master Output
node/set-data out eyJjaGFubmVscyI6Ik1PWlpJX01PTk8iLCJtb2RlIjoiTU9aWklfT1VUUFVUX1BXTSIsInJhdGVfbW9kZSI6Mn0=

# --- CONNECTIONS ---
outlet/connect btn1:out env:trig
outlet/connect kick:out vca:in
outlet/connect env:out vca:gain
outlet/connect vca:out norm:a
outlet/connect norm:out out:audio_in

# --- POSITIONING ---
node/move btn1 50 50
node/move kick 50 200
node/move env 250 50
node/move vca 450 150
node/move norm 600 150
node/move out 750 150
`;