EXAMPLES['granular_synth'] = `v2.1.1
network/add-patch gran Granular_Azure
patch/open gran
patch/add-node gran f1 input/float_constant Float Const
node/update-inlet f1 val 0.25
patch/add-node gran f2 input/float_constant Float Const
node/update-inlet f2 val 0.41
patch/add-node gran lfo1 lfo/mozzi_lfo_sin Sine LFO
patch/add-node gran lfo2 lfo/mozzi_lfo_sin Sine LFO
patch/add-node gran wp1 wave/mozzi_wavepacketsample WavePacket Sample
patch/add-node gran gain1 signal/mozzi_gain Gain
patch/add-node gran dcf filter/mozzi_dcfilter DC Filter
patch/add-node gran out1 output/mozzi_out Output
node/turn-on wp1
node/turn-on lfo1
node/turn-on lfo2
node/turn-on out1
node/move f1 20 50
node/move lfo1 200 50
node/move f2 20 250
node/move lfo2 200 250
node/move wp1 450 150
node/move gain1 650 150
node/move dcf 800 150
node/move out1 950 150
node/update-inlet gain1 gain 120
node/update-inlet wp1 fund 220
outlet/connect f1:out lfo1:freq
outlet/connect f2:out lfo2:freq
outlet/connect lfo1:out wp1:freq
outlet/connect lfo2:out wp1:bw
outlet/connect wp1:out gain1:in
outlet/connect gain1:out dcf:in
outlet/connect dcf:out out1:audio_in`;