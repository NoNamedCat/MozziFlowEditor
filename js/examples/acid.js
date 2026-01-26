EXAMPLES['acid'] = `v2.1.1
network/add-patch root root
patch/open root
patch/add-node root aoov signal/mozzi_metronome Metronome
node/move aoov 9 254
node/update-inlet aoov bpm 135
patch/add-node root 5auw signal/mozzi_ead Ead%20Env
node/move 5auw 244 256
node/update-inlet 5auw trig 0
node/update-inlet 5auw att 10
node/update-inlet 5auw dec 200
patch/add-node root 3gcd wave/mozzi_saw Saw
node/move 3gcd 270 112
node/update-inlet 3gcd freq 55
patch/add-node root cfnu filter/mozzi_multires MultiRes%20Filter
node/move cfnu 500 200
node/update-inlet cfnu in 0
node/update-inlet cfnu cutoff 60
node/update-inlet cfnu res 220
patch/add-node root 776e math/shr Shift%20Right
node/move 776e 846 192
node/update-inlet 776e a 0
node/update-inlet 776e b 2
patch/add-node root k154 output/mozzi_out Output
node/move k154 1053 245
node/update-inlet k154 audio_in 0
outlet/connect aoov:out 5auw:trig
outlet/connect 3gcd:out cfnu:in
outlet/connect 5auw:out cfnu:cutoff
outlet/connect cfnu:low 776e:a
outlet/connect 776e:out k154:audio_in`;