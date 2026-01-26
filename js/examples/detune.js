EXAMPLES['detune'] = `v2.1.1
network/add-patch dt Detuned_Oscs
patch/open dt
patch/add-node dt s1 wave/mozzi_sin Sine
patch/add-node dt s2 wave/mozzi_sin Sine
patch/add-node dt mix signal/mozzi_mixer2 Mixer 2
patch/add-node dt out output/mozzi_out Output
node/turn-on s1
node/turn-on s2
node/turn-on mix
node/turn-on out
node/move s1 50 50
node/move s2 50 200
node/move mix 250 125
node/move out 450 125
node/update-inlet s1 freq 220
node/update-inlet s2 freq 220.5
outlet/connect s1:out mix:ch1
outlet/connect s2:out mix:ch2
outlet/connect mix:out out:audio_in`;