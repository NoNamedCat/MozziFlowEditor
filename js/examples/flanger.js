EXAMPLES['flanger'] = `v2.1.1
network/add-patch flg Flanger
patch/open flg
patch/add-node flg osc wave/mozzi_tri Triangle
patch/add-node flg lfo wave/mozzi_tri Triangle
patch/add-node flg del filter/mozzi_delay_fb Delay FB
patch/add-node flg mix signal/mozzi_mixer2 Mixer 2
patch/add-node flg out output/mozzi_out Output
node/turn-on osc
node/turn-on lfo
node/turn-on del
node/turn-on mix
node/turn-on out
node/move osc 50 100
node/move lfo 50 300
node/move del 300 200
node/move mix 550 200
node/move out 800 200
node/update-inlet osc freq 220
node/update-inlet lfo freq 0.2
node/update-inlet del fb -100
outlet/connect osc:out del:in
outlet/connect lfo:out del:time
outlet/connect osc:out mix:ch1
outlet/connect del:out mix:ch2
outlet/connect mix:out out:audio_in`;