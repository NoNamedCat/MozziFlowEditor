EXAMPLES['sh_random'] = `v2.1.1
network/add-patch shrnd Random_SH_Melody
patch/open shrnd
patch/add-node shrnd n1 wave/mozzi_noise Noise
patch/add-node shrnd m1 signal/mozzi_metronome Metronome
patch/add-node shrnd sh1 signal/mozzi_sh S&H
patch/add-node shrnd q1 signal/mozzi_quantizer Quantizer
patch/add-node shrnd osc1 wave/mozzi_sin Sine
patch/add-node shrnd out1 output/mozzi_out Output
node/turn-on n1
node/turn-on m1
node/turn-on sh1
node/turn-on q1
node/turn-on osc1
node/turn-on out1
node/move n1 50 50
node/move m1 50 200
node/move sh1 250 125
node/move q1 450 125
node/move osc1 650 125
node/move out1 850 125
node/update-inlet m1 bpm 180
outlet/connect n1:out sh1:in
outlet/connect m1:out sh1:trig
outlet/connect sh1:out q1:in
outlet/connect q1:out osc1:freq
outlet/connect osc1:out out1:audio_in`;