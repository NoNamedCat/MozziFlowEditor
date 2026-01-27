EXAMPLES['sh_random'] = `v2.1.1
network/add-patch shr Sample_And_Hold
patch/open shr
patch/add-node shr noise wave/mozzi_noise Noise
patch/add-node shr metro signal/mozzi_metronome Metronome
patch/add-node shr sh1 signal/mozzi_sh S&H
patch/add-node shr osc wave/mozzi_sin Sine
patch/add-node shr out output/mozzi_out Output

node/update-inlet metro bpm 180
node/update-inlet osc freq 440

outlet/connect noise:out sh1:in
outlet/connect metro:out sh1:trig
outlet/connect sh1:out osc:freq
outlet/connect osc:out out:audio_in`;