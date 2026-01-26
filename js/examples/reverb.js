EXAMPLES['reverb'] = `v2.1.1
network/add-patch rv Sequenced_Reverb
patch/open rv
patch/add-node rv 7rxd signal/mozzi_metronome Metronome
node/move 7rxd 37 263
node/update-inlet 7rxd bpm 120
patch/add-node rv 8zre signal/mozzi_sequencer16 Sequencer%2016
node/move 8zre 403 82
node/update-inlet 8zre steps 16
node/update-inlet 8zre s0 440
node/update-inlet 8zre s1 440
node/update-inlet 8zre s2 880
node/update-inlet 8zre s3 440
node/update-inlet 8zre s4 659
node/update-inlet 8zre s5 440
node/update-inlet 8zre s6 784
node/update-inlet 8zre s7 880
node/update-inlet 8zre s8 440
node/update-inlet 8zre s9 440
node/update-inlet 8zre s10 1318
node/update-inlet 8zre s11 880
node/update-inlet 8zre s12 440
node/update-inlet 8zre s13 440
node/update-inlet 8zre s14 880
node/update-inlet 8zre s15 659
patch/add-node rv r9wp signal/mozzi_adsr ADSR
node/move r9wp 414 656
node/update-inlet r9wp att 5
node/update-inlet r9wp dec 100
node/update-inlet r9wp rel 50
patch/add-node rv 5tdl wave/mozzi_saw Saw
node/move 5tdl 706 274
patch/add-node rv s37v signal/mozzi_gain Gain
node/move s37v 951 340
patch/add-node rv 8idx filter/mozzi_reverb Reverb%20Tank
node/move 8idx 1189 350
node/update-inlet 8idx mix 127
node/update-inlet 8idx room 180
patch/add-node rv 0ivj output/mozzi_out Output
node/move 0ivj 1458 375
patch/add-node rv gk10 math/mozzi_map Map%20Range
node/move gk10 703 403
node/update-inlet gk10 imin 0
node/update-inlet gk10 imax 255
node/update-inlet gk10 omin 0
node/update-inlet gk10 omax 255
outlet/connect 7rxd:out 8zre:trig
outlet/connect 7rxd:out r9wp:trig
outlet/connect 8zre:out 5tdl:freq
outlet/connect 5tdl:out s37v:in
outlet/connect s37v:out 8idx:in
outlet/connect 8idx:out 0ivj:audio_in
outlet/connect r9wp:out gk10:in
outlet/connect gk10:out s37v:gain`;