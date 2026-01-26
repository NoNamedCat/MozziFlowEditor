EXAMPLES['quantizer_test'] = `v2.1.1
network/add-patch qntz Musical_Quantizer
patch/open qntz
patch/add-node qntz pot1 input/mozzi_async_analog Async Analog
patch/add-node qntz sm1 signal/mozzi_smooth Smooth
patch/add-node qntz q1 signal/mozzi_quantizer Quantizer
patch/add-node qntz osc1 wave/mozzi_sin Sine
patch/add-node qntz out1 output/mozzi_out Output
node/turn-on pot1
node/turn-on sm1
node/turn-on q1
node/turn-on osc1
node/turn-on out1
node/move pot1 50 150
node/move sm1 250 150
node/move q1 450 150
node/move osc1 650 150
node/move out1 850 150
node/update-inlet pot1 pin A0
node/update-inlet sm1 smooth 0.9
outlet/connect pot1:out sm1:in
outlet/connect sm1:out q1:in
outlet/connect q1:out osc1:freq
outlet/connect osc1:out out1:audio_in`;