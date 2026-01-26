EXAMPLES['ambient'] = `v2.1.1
network/add-patch p1 Ambient_Reverb
patch/open p1
patch/add-node p1 metro signal/mozzi_metronome Metronome
patch/add-node p1 adsr signal/mozzi_adsr ADSR
patch/add-node p1 saw wave/mozzi_saw Saw
patch/add-node p1 gain signal/mozzi_gain Gain
patch/add-node p1 rev filter/mozzi_reverb Reverb Tank
patch/add-node p1 out output/mozzi_out Output
node/turn-on metro
node/turn-on adsr
node/turn-on saw
node/turn-on gain
node/turn-on rev
node/turn-on out
node/move metro 50 100
node/move adsr 250 100
node/move saw 50 300
node/move gain 450 200
node/move rev 650 200
node/move out 850 200
node/update-inlet metro bpm 60
node/update-inlet adsr sus 100
node/update-inlet rev mix 150
outlet/connect metro:out adsr:trig
outlet/connect saw:out gain:in
outlet/connect adsr:out gain:gain
outlet/connect gain:out rev:in
outlet/connect rev:out out:audio_in`;