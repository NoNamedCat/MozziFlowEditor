EXAMPLES['wavepacket'] = `v2.1.1
network/add-patch wp Wave_Packet_Sweep
patch/open wp
patch/add-node wp l1 wave/mozzi_sin Sine
patch/add-node wp l2 wave/mozzi_sin Sine
patch/add-node wp wp1 wave/mozzi_wavepacket WavePacket
patch/add-node wp out output/mozzi_out Output

node/update-inlet l1 freq 0.1
node/update-inlet l2 freq 0.15

outlet/connect l1:out wp1:fund
outlet/connect l2:out wp1:bw
outlet/connect wp1:out out:audio_in`;