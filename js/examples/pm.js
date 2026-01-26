EXAMPLES['pm'] = `v2.1.1
network/add-patch pm PhaseModulation
patch/open pm
patch/add-node pm mod wave/mozzi_sin Sine
patch/add-node pm car wave/mozzi_sin Sine
patch/add-node pm gain signal/mozzi_gain Gain
patch/add-node pm out output/mozzi_out Output
node/turn-on mod
node/turn-on car
node/turn-on gain
node/turn-on out
node/move mod 50 50
node/move gain 250 50
node/move car 450 50
node/move out 650 50
node/update-inlet mod freq 5
node/update-inlet gain gain 100
node/update-inlet car freq 440
outlet/connect mod:out gain:in
outlet/connect gain:out car:freq
outlet/connect car:out out:audio_in`;