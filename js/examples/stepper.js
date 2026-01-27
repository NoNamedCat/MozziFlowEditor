EXAMPLES['stepper'] = `v2.1.1
network/add-patch stp Stepper_Sequencer
patch/open stp
patch/add-node stp clock signal/mozzi_metronome Metronome
patch/add-node stp seq signal/mozzi_sequencer Sequencer
patch/add-node stp sm signal/mozzi_smooth Smooth
patch/add-node stp osc wave/mozzi_saw Saw
patch/add-node stp lpf filter/mozzi_lpf LowPass
patch/add-node stp out output/mozzi_out Output

node/update-inlet clock bpm 180
node/update-inlet osc freq 110

outlet/connect clock:out seq:trig
outlet/connect seq:out sm:in
outlet/connect sm:out osc:freq
outlet/connect osc:out lpf:in
outlet/connect seq:out lpf:cutoff
outlet/connect lpf:out out:audio_in`;