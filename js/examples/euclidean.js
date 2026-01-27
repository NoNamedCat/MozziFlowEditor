EXAMPLES['euclidean'] = `v2.1.1
network/add-patch root Euclidean_Rhythms
patch/open root
# --- LOGIC ---
patch/add-node root clock signal/mozzi_metronome Metronome
node/set-data clock eyJyYXRlX21vZGUiOjF9
node/update-inlet clock bpm 240

patch/add-node root cnt1 signal/counter Counter
node/set-data cnt1 eyJyYXRlX21vZGUiOjF9
node/update-inlet cnt1 max 3

patch/add-node root rout signal/router4 Router%20(4)
node/set-data rout eyJyYXRlX21vZGUiOjF9

# --- SYNTH ---
patch/add-node root osc wave/mozzi_sin Sine
node/set-data osc eyJyYXRlX21vZGUiOjJ9
node/update-inlet osc freq 60

patch/add-node root env signal/mozzi_ead Ead%20Env
node/set-data env eyJyYXRlX21vZGUiOjJ9
node/update-inlet env att 5
node/update-inlet env dec 150

patch/add-node root vca signal/mozzi_gain Gain
node/set-data vca eyJyYXRlX21vZGUiOjJ9

patch/add-node root out output/mozzi_out Output
node/set-data out eyJyYXRlX21vZGUiOjJ9

# --- CONNECTIONS ---
outlet/connect clock:out cnt1:up
outlet/connect cnt1:out rout:idx
outlet/connect clock:out rout:in
outlet/connect rout:out0 env:trig
outlet/connect osc:out vca:in
outlet/connect env:out vca:gain
outlet/connect vca:out out:audio_in

# --- POSITIONING ---
node/move clock 50 100
node/move cnt1 250 50
node/move rout 450 100
node/move osc 450 250
node/move env 650 250
node/move vca 850 150
node/move out 1050 150
`;