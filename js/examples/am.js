EXAMPLES['am'] = `v2.1.1
network/add-patch am AMSynthesis
patch/open am
patch/add-node am car wave/mozzi_sin Sine
patch/add-node am mod wave/mozzi_sin Sine
patch/add-node am mul math/mul_audio Mul (Audio)
patch/add-node am out output/mozzi_out Output
node/turn-on car
node/turn-on mod
node/turn-on mul
node/turn-on out
node/move car 50 50
node/move mod 50 200
node/move mul 250 125
node/move out 450 125
node/update-inlet car freq 440
node/update-inlet mod freq 4
outlet/connect car:out mul:a
outlet/connect mod:out mul:b
outlet/connect mul:out out:audio_in`;