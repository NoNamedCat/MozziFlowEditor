EXAMPLES['wavefolder'] = `v2.1.1
network/add-patch wf Wave_Folder_Synth
patch/open wf
patch/add-node wf s1 wave/mozzi_sin Sine
patch/add-node wf l2 wave/mozzi_sin Sine
patch/add-node wf fld filter/mozzi_wavefolder Wave%20Folder
patch/add-node wf out output/mozzi_out Output

node/update-inlet s1 freq 440
node/update-inlet l2 freq 0.2

outlet/connect s1:out fld:in
# Note: LFO modulation of folder depth is internal in this basic example
outlet/connect fld:out out:audio_in`;