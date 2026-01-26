EXAMPLES['pwm'] = `v2.1.1
network/add-patch pwm PWM_Phasing
patch/open pwm
patch/add-node pwm ph1 wave/mozzi_phasor Phasor
patch/add-node pwm ph2 wave/mozzi_phasor Phasor
patch/add-node pwm sub math/sub Subtract
patch/add-node pwm out output/mozzi_out Output
node/turn-on ph1
node/turn-on ph2
node/turn-on sub
node/turn-on out
node/move ph1 50 100
node/move ph2 50 300
node/move sub 300 200
node/move out 550 200
node/update-inlet ph1 freq 55
node/update-inlet ph2 freq 55.2
outlet/connect ph1:out sub:a
outlet/connect ph2:out sub:b
outlet/connect sub:out out:audio_in`;