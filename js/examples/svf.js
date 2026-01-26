EXAMPLES['svf'] = `v2.1.1
network/add-patch svf SVF_Filter_Noise
patch/open svf
patch/add-node svf noise wave/mozzi_noise Noise
patch/add-node svf lfo wave/mozzi_sin Sine
patch/add-node svf map math/mozzi_map Map%20Range
patch/add-node svf f1 filter/mozzi_svf SVF Filter
patch/add-node svf out output/mozzi_out Output

node/move noise 50 50
node/move lfo 50 250
node/move map 250 250
node/move f1 450 150
node/move out 650 150

node/update-inlet lfo freq 1.3
node/update-inlet map imin -128
node/update-inlet map imax 127
node/update-inlet map omin 400
node/update-inlet map omax 3500
node/update-inlet f1 res 150

outlet/connect lfo:out map:in
outlet/connect map:out f1:cutoff
outlet/connect noise:out f1:in
outlet/connect f1:out out:audio_in`;