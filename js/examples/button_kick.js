EXAMPLES['button_kick'] = `v2.1.1
network/add-patch bk Button_Kick
patch/open bk
# --- INPUT ---
patch/add-node bk btn1 input/arduino_button Button
node/set-data btn1 eyJyYXRlX21vZGUiOjF9
node/update-inlet btn1 pin 5

# --- SYNTH ---
patch/add-node bk kick wave/mozzi_sin Sine
node/set-data kick eyJyYXRlX21vZGUiOjJ9
node/update-inlet kick freq 60

patch/add-node bk env signal/mozzi_ead Ead%20Env
node/set-data env eyJyYXRlX21vZGUiOjJ9
node/update-inlet env att 20
node/update-inlet env dec 200

patch/add-node bk vca signal/mozzi_gain Gain
node/set-data vca eyJyYXRlX21vZGUiOjJ9

patch/add-node bk out output/mozzi_out Output
node/set-data out eyJyYXRlX21vZGUiOjJ9

# --- CONNECTIONS ---
outlet/connect btn1:out env:trig
outlet/connect kick:out vca:in
outlet/connect env:out vca:gain
outlet/connect vca:out out:audio_in

# --- POSITIONING ---
node/move btn1 50 150
node/move env 250 250
node/move kick 250 50
node/move vca 450 150
node/move out 650 150
`;