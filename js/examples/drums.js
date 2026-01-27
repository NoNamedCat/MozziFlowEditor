EXAMPLES['drums'] = `v2.1.1
network/add-patch drm Drum_Machine
patch/open drm
patch/add-node drm m1 signal/mozzi_metronome Metronome
patch/add-node drm kick wave/mozzi_sin Sine
patch/add-node drm env signal/mozzi_ead Ead%20Env
patch/add-node drm vca math/mul Multiply
patch/add-node drm out output/mozzi_out Output

node/update-inlet m1 bpm 124
node/update-inlet kick freq 55

outlet/connect m1:out env:trig
outlet/connect kick:out vca:a
outlet/connect env:out vca:b
outlet/connect vca:out out:audio_in`;