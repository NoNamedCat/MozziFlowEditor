EXAMPLES['granular_synth'] = `v2.1.1
network/add-patch grn Granular_Synth
patch/open grn
patch/add-node grn lfo1 lfo/mozzi_lfo_sin Sine%20LFO
patch/add-node grn wp1 wave/mozzi_wavepacket WavePacket
patch/add-node grn out output/mozzi_out Output

node/update-inlet lfo1 freq 0.5
node/update-inlet wp1 fund 100
node/update-inlet wp1 bw 50

outlet/connect lfo1:out wp1:fund
outlet/connect wp1:out out:audio_in`;