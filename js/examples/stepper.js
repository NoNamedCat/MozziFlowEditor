EXAMPLES['stepper'] = `v2.1.1
network/add-patch step Baby_Stepper
patch/open step
patch/add-node step clock signal/mozzi_metronome Metronome
patch/add-node step seq signal/mozzi_sequencer Sequencer
patch/add-node step quant signal/mozzi_quantizer Quantizer
patch/add-node step smooth signal/mozzi_smooth Smooth
patch/add-node step osc wave/mozzi_saw Saw
patch/add-node step lpf filter/mozzi_lpf LowPass
patch/add-node step out output/mozzi_out Output

node/move clock 50 50
node/move seq 250 50
node/move quant 450 50
node/move smooth 650 50
node/move osc 850 50
node/move lpf 850 200
node/move out 1050 200

node/update-inlet clock bpm 180
node/update-inlet seq s0 40
node/update-inlet seq s1 50
node/update-inlet seq s2 60
node/update-inlet seq s3 45
node/update-inlet seq s4 70
node/update-inlet seq s5 30
node/update-inlet seq s6 40
node/update-inlet seq s7 80
node/update-inlet smooth smooth 0.9

outlet/connect clock:out seq:trig
outlet/connect seq:out quant:in
outlet/connect quant:out smooth:in
outlet/connect smooth:out osc:freq
outlet/connect osc:out lpf:in
outlet/connect seq:out lpf:cutoff
outlet/connect lpf:out out:audio_in`;