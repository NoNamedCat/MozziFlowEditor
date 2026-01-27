EXAMPLES['karplus'] = `v2.1.1
network/add-patch kar Karplus_Strong
patch/open kar
patch/add-node kar metro signal/mozzi_metronome Metronome
patch/add-node kar noise wave/mozzi_noise Noise
patch/add-node kar adsr signal/mozzi_adsr ADSR
patch/add-node kar vca math/mul Multiply
patch/add-node kar out output/mozzi_out Output

node/update-inlet metro bpm 120
node/update-inlet adsr att 0
node/update-inlet adsr dec 60

outlet/connect metro:out adsr:trig
outlet/connect noise:out vca:a
outlet/connect adsr:out vca:b
outlet/connect vca:out out:audio_in`;