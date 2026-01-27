EXAMPLES['flanger'] = `v2.1.1
network/add-patch flg Flanger_Effect
patch/open flg
patch/add-node flg osc wave/mozzi_sin Sine
patch/add-node flg lfo lfo/mozzi_lfo_sin Sine%20LFO
patch/add-node flg del filter/mozzi_audiodelay Audio%20Delay
patch/add-node flg out output/mozzi_out Output

node/update-inlet osc freq 220
node/update-inlet lfo freq 0.2
node/update-inlet del delay 128

outlet/connect osc:out del:in
outlet/connect lfo:out del:delay
outlet/connect del:out out:audio_in`;