EXAMPLES['fm'] = `v2.1.1
network/add-patch root root
patch/open root
patch/add-node root l4uz input/float_constant Float%20Const
node/move l4uz 24 101
node/update-inlet l4uz val 3.5
node/set-data l4uz eyJ2YWx1ZSI6IjMuNSJ9
patch/add-node root d0ol wave/mozzi_sin Sine
node/move d0ol 176 100
node/update-inlet d0ol freq 220
node/update-inlet d0ol phase 0
patch/add-node root jrnp wave/mozzi_sin Sine
node/move jrnp 654 101
node/update-inlet jrnp freq 440
node/update-inlet jrnp phase 0
patch/add-node root ki7e signal/mozzi_gain Gain
node/move ki7e 416 112
node/update-inlet ki7e in 0
node/update-inlet ki7e gain 150
patch/add-node root lbq6 math/shr Shift%20Right
node/move lbq6 890 111
node/update-inlet lbq6 a 0
node/update-inlet lbq6 b 1
patch/add-node root e2gb output/mozzi_out Output
node/move e2gb 1087 150
node/update-inlet e2gb audio_in 0
outlet/connect l4uz:out d0ol:freq
outlet/connect d0ol:out ki7e:in
outlet/connect ki7e:out jrnp:phase
outlet/connect jrnp:out lbq6:a
outlet/connect lbq6:out e2gb:audio_in`;