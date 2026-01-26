EXAMPLES['echo'] = `v2.1.1
network/add-patch ec Simple_Echo
patch/open ec
patch/add-node ec s1 wave/mozzi_saw Saw
patch/add-node ec metro signal/mozzi_metronome Metronome
patch/add-node ec adsr signal/mozzi_adsr ADSR
patch/add-node ec g1 signal/mozzi_gain Gain
patch/add-node ec del filter/mozzi_delay_fb Delay FB
patch/add-node ec out output/mozzi_out Output
node/turn-on s1
node/turn-on metro
node/turn-on adsr
node/turn-on g1
node/turn-on del
node/turn-on out
node/move metro 50 50
node/move s1 50 200
node/move adsr 250 50
node/move g1 250 200
node/move del 450 200
node/move out 650 200
node/update-inlet metro bpm 60
node/update-inlet s1 freq 110
node/update-inlet adsr att 10
node/update-inlet adsr dec 50
node/update-inlet adsr sus 128
node/update-inlet del samples 1024
node/update-inlet del feedback 180
node/set-data del eyJidWZmZXJTaXplIjoiMTAyNCJ9
outlet/connect metro:out adsr:trig
outlet/connect s1:out g1:in
outlet/connect adsr:out g1:gain
outlet/connect g1:out del:in
outlet/connect del:out out:audio_in`;