EXAMPLES['quantizer_test'] = `v2.1.1
network/add-patch qtz Quantizer_Test
patch/open qtz
patch/add-node qtz lfo lfo/mozzi_lfo_sin Sine%20LFO
patch/add-node qtz q1 signal/mozzi_quantizer Quantizer
patch/add-node qtz osc wave/mozzi_sin Sine
patch/add-node qtz out output/mozzi_out Output

node/update-inlet lfo freq 0.5
node/update-inlet osc freq 440

outlet/connect lfo:out q1:in
outlet/connect q1:out osc:freq
outlet/connect osc:out out:audio_in`;