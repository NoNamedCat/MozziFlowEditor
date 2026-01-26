EXAMPLES['encoder_router'] = `v2.1.1
network/add-patch erout Multi_Param_Encoder
patch/open erout
patch/add-node erout enc1 input/arduino_encoder Encoder
patch/add-node erout cnt1 signal/counter Counter
patch/add-node erout pot1 input/mozzi_async_analog Async Analog
patch/add-node erout rout1 signal/router Router
patch/add-node erout osc1 wave/mozzi_sin Sine
patch/add-node erout osc2 wave/mozzi_saw Saw
patch/add-node erout mix1 signal/mozzi_mixer2 Mixer 2
patch/add-node erout out1 output/mozzi_out Output
node/turn-on enc1
node/turn-on cnt1
node/turn-on pot1
node/turn-on rout1
node/turn-on osc1
node/turn-on osc2
node/turn-on mix1
node/turn-on out1
node/move enc1 50 100
node/move cnt1 300 100
node/move pot1 50 350
node/move rout1 300 350
node/move osc1 550 100
node/move osc2 550 350
node/move mix1 800 225
node/move out1 1000 225
node/update-inlet enc1 pinA 2
node/update-inlet enc1 pinB 3
node/update-inlet pot1 pin A1
node/update-inlet cnt1 max 1
outlet/connect enc1:up cnt1:up
outlet/connect enc1:down cnt1:down
outlet/connect cnt1:out rout1:idx
outlet/connect pot1:out rout1:in
outlet/connect rout1:out0 osc1:freq
outlet/connect rout1:out1 osc2:freq
outlet/connect osc1:out mix1:ch1
outlet/connect osc2:out mix1:ch2
outlet/connect mix1:out out1:audio_in`;