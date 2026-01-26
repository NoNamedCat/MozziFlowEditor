EXAMPLES['karplus'] = `v2.1.1
network/add-patch root root
patch/open root
patch/add-node root gd5c lfo/mozzi_pulse Pulse%20LFO
node/move gd5c 37 307
node/update-inlet gd5c freq 1
node/update-inlet gd5c width 30
patch/add-node root 5p0r wave/mozzi_noise Noise
node/move 5p0r 96 170
patch/add-node root 8umu signal/mozzi_adsr ADSR
node/move 8umu 282 311
node/update-inlet 8umu trig 0
node/update-inlet 8umu rst 1
node/update-inlet 8umu att 0
node/update-inlet 8umu lev 255
node/update-inlet 8umu dec 60
node/update-inlet 8umu sus 0
node/update-inlet 8umu rel 50
patch/add-node root v0oj signal/mozzi_gain Gain
node/move v0oj 512 159
node/update-inlet v0oj in 0
node/update-inlet v0oj gain 128
patch/add-node root ekdc filter/mozzi_delay_fb Delay%20FB
node/move ekdc 726 118
node/update-inlet ekdc in 0
node/update-inlet ekdc samples 140
node/update-inlet ekdc feedback 255
node/set-data ekdc eyJidWZmZXJTaXplIjo1MTIsImludGVycCI6IkxJTkVBUiIsInR5cGUiOiJpbnQifQ==
patch/add-node root hw32 output/mozzi_out Output
node/move hw32 1050 200
node/update-inlet hw32 audio_in 0
outlet/connect gd5c:out 8umu:trig
outlet/connect 5p0r:out v0oj:in
outlet/connect 8umu:out v0oj:gain
outlet/connect v0oj:out ekdc:in
outlet/connect ekdc:out hw32:audio_in`;