EXAMPLES['acid'] = `v2.1.1
network/add-patch root Acid_Classic
patch/open root
patch/add-node root aoov signal/mozzi_metronome Metronome
node/update-inlet aoov bpm 135
patch/add-node root 5auw signal/mozzi_ead Ead%20Env
node/update-inlet 5auw att 10
node/update-inlet 5auw dec 200
patch/add-node root 3gcd wave/mozzi_saw Saw
node/update-inlet 3gcd freq 55
patch/add-node root cfnu filter/mozzi_multires MultiRes%20Filter
node/update-inlet cfnu res 220
patch/add-node root 776e math/shr Shift%20Right
node/update-inlet 776e b 2
patch/add-node root k154 output/mozzi_out Output
outlet/connect aoov:out 5auw:trig
outlet/connect 3gcd:out cfnu:in
outlet/connect 5auw:out cfnu:cutoff
outlet/connect cfnu:low 776e:a
outlet/connect 776e:out k154:audio_in
node/move aoov 10 100
node/move 5auw 200 100
node/move 3gcd 10 300
node/move cfnu 400 200
node/move 776e 600 200
node/move k154 800 200
`;