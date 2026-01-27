EXAMPLES['fm'] = `v2.1.1
network/add-patch fm FM_Synthesis
patch/open fm
patch/add-node fm mod wave/mozzi_sin Sine
patch/add-node fm car wave/mozzi_sin Sine
patch/add-node fm gain math/mul Multiply
patch/add-node fm out output/mozzi_out Output

node/update-inlet mod freq 5
node/update-inlet car freq 440
node/update-inlet gain b 150

outlet/connect mod:out gain:a
outlet/connect gain:out car:phase
outlet/connect car:out out:audio_in`;