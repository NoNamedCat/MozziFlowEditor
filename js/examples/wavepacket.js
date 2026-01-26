EXAMPLES['wavepacket'] = `v2.1.1
network/add-patch wp Vowel_Synthesizer
patch/open wp
patch/add-node wp l1 wave/mozzi_sin LFO_Pitch
patch/add-node wp l2 wave/mozzi_sin LFO_Grain
patch/add-node wp m1 math/mozzi_map Map_Pitch
patch/add-node wp m2 math/mozzi_map Map_BW
patch/add-node wp wp1 wave/mozzi_wavepacket WavePacket
patch/add-node wp out output/mozzi_out Output

node/move l1 50 50
node/move l2 50 300
node/move m1 250 50
node/move m2 250 300
node/move wp1 500 150
node/move out 750 150

node/update-inlet l1 freq 0.1
node/update-inlet l2 freq 0.15
node/update-inlet m1 imin -128
node/update-inlet m1 imax 127
node/update-inlet m1 omin 50
node/update-inlet m1 omax 200
node/update-inlet m2 imin -128
node/update-inlet m2 imax 127
node/update-inlet m2 omin 50
node/update-inlet m2 omax 1000
node/update-inlet wp1 freq 440

outlet/connect l1:out m1:in
outlet/connect l2:out m2:in
outlet/connect m1:out wp1:fund
outlet/connect m2:out wp1:bw
outlet/connect wp1:out out:audio_in`;