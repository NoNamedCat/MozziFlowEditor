EXAMPLES['encoder_router'] = `v2.1.1
network/add-patch enr Encoder_Router
patch/open enr
patch/add-node enr enc1 input/arduino_encoder Encoder
patch/add-node enr cnt1 signal/counter Counter
patch/add-node enr rout1 signal/router2 Router
patch/add-node enr osc1 wave/mozzi_sin Sine
patch/add-node enr osc2 wave/mozzi_saw Saw
patch/add-node enr out output/mozzi_out Output

node/update-inlet enc1 pinA 2
node/update-inlet enc1 pinB 3
node/update-inlet cnt1 max 1
node/update-inlet osc1 freq 440
node/update-inlet osc2 freq 220

outlet/connect enc1:up cnt1:up
outlet/connect enc1:down cnt1:down
outlet/connect cnt1:out rout1:idx
outlet/connect osc1:out rout1:in
outlet/connect rout1:out0 out:audio_in
outlet/connect osc2:out out:audio_in`;