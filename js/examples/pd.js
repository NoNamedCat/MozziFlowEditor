EXAMPLES['pd'] = `v2.1.1
network/add-patch pd PhaseDistortion
patch/open pd
patch/add-node pd v1 wave/mozzi_pdresonant PD Resonant
patch/add-node pd out output/mozzi_out Output
node/turn-on v1
node/turn-on out
node/move v1 250 150
node/move out 500 150
node/update-inlet v1 freq 440
node/update-inlet v1 amount 128
outlet/connect v1:out out:audio_in`;