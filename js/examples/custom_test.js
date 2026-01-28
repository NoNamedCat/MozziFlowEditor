EXAMPLES['custom_test'] = `v2.1.1
network/add-patch root Custom_Nodes_Test
patch/open root
patch/add-node root metro signal/mozzi_metronome Metronome
node/update-inlet metro bpm 60
patch/add-node root env signal/custom_envelope Custom%20Env
node/update-inlet env att 0.1
node/update-inlet env dec 0.2
node/update-inlet env sus 0.5
node/update-inlet env rel 0.5
patch/add-node root osc wave/mozzi_sin Sine
node/update-inlet osc freq 220
patch/add-node root vca math/mul Multiply
patch/add-node root dist filter/custom_dist Hard%20Clip
node/update-inlet dist drive 0.8
patch/add-node root out output/mozzi_master Output
outlet/connect metro:out env:trig
outlet/connect osc:out vca:a
outlet/connect env:out vca:b
outlet/connect vca:out dist:in
outlet/connect dist:out out:audio_in
node/move metro 50 100
node/move env 200 100
node/move osc 50 300
node/move vca 400 200
node/move dist 600 200
node/move out 800 200
`;
