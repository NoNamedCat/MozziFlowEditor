EXAMPLES['echo'] = `v2.1.1
network/add-patch echo Echo_Effect
patch/open echo
patch/add-node echo s1 wave/mozzi_saw Saw
patch/add-node echo metro signal/mozzi_metronome Metronome
patch/add-node echo adsr signal/mozzi_adsr ADSR
patch/add-node echo del filter/mozzi_audiodelay Audio%20Delay
patch/add-node echo out output/mozzi_out Output

node/update-inlet s1 freq 110
node/update-inlet metro bpm 60
node/update-inlet del delay 128

outlet/connect metro:out adsr:trig
outlet/connect s1:out del:in
outlet/connect del:out out:audio_in`;