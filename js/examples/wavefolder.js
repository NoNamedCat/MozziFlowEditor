EXAMPLES['wavefolder'] = `v2.1.1
network/add-patch wf WaveFolder_Synth
patch/open wf
patch/add-node wf s1 wave/mozzi_sin Sine
patch/add-node wf l2 wave/mozzi_saw Saw
patch/add-node wf map math/mozzi_map Map%20Range
patch/add-node wf folder filter/mozzi_wavefolder WaveFolder
patch/add-node wf out output/mozzi_out Output

node/move s1 50 50
node/move l2 50 250
node/move map 250 250
node/move folder 450 150
node/move out 650 150

node/update-inlet s1 freq 440
node/update-inlet l2 freq 0.2
node/update-inlet map imin -128
node/update-inlet map imax 127
node/update-inlet map omin 15
node/update-inlet map omax 120
outlet/connect s1:out folder:in
outlet/connect l2:out map:in
outlet/connect map:out folder:gain
outlet/connect folder:out out:audio_in`;