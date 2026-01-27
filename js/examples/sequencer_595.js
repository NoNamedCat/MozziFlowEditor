EXAMPLES['sequencer_595'] = `v2.1.1
network/add-patch s59 Sequencer_595
patch/open s59
patch/add-node s59 m1 signal/mozzi_metronome Metronome
patch/add-node s59 mux1 input/mux4051_1 Mux%204051
patch/add-node s59 seq1 signal/mozzi_sequencer Sequencer
patch/add-node s59 osc1 wave/mozzi_sin Sine
patch/add-node s59 out1 output/mozzi_out Output

node/update-inlet m1 bpm 240
node/update-inlet mux1 s0 2
node/update-inlet mux1 s1 3
node/update-inlet mux1 s2 4
node/update-inlet mux1 pin A0

outlet/connect m1:out seq1:trig
outlet/connect mux1:ch0 seq1:s0
outlet/connect mux1:ch1 seq1:s1
outlet/connect seq1:out osc1:freq
outlet/connect osc1:out out1:audio_in`;