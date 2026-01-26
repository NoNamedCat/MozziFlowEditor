EXAMPLES['bitcrusher'] = `v2.1.1
network/add-patch bit Bit_Crusher
patch/open bit
# Simulates sample rate reduction using S&H clocked by audio phasor
patch/add-node bit src wave/mozzi_sin Sine
patch/add-node bit rate_phasor wave/mozzi_phasor Phasor
patch/add-node bit sh signal/mozzi_sh S&H
patch/add-node bit out output/mozzi_out Output

node/move src 50 50
node/move rate_phasor 50 200
node/move sh 300 125
node/move out 500 125

node/update-inlet src freq 110
node/update-inlet rate_phasor freq 400
# 400Hz sample rate = heavy aliasing

outlet/connect src:out sh:in
outlet/connect rate_phasor:out sh:trig
outlet/connect sh:out out:audio_in`;