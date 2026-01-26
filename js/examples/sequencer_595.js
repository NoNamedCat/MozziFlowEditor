EXAMPLES['sequencer_595'] = `v2.1.1
network/add-patch s595 Sequencer_with_LEDs
patch/open s595

patch/add-node s595 m1 signal/mozzi_metronome Metronome
patch/add-node s595 pot1 input/mozzi_async_analog Async Analog (Steps)
patch/add-node s595 sm1 signal/mozzi_smooth Smooth
patch/add-node s595 mul1 math/mul Multiply (Scale)
patch/add-node s595 add1 math/add Add (Offset)
patch/add-node s595 mux1 input/mux4051_1 Mux 4051 (1)
patch/add-node s595 seq1 signal/mozzi_sequencer Sequencer
patch/add-node s595 dec1 signal/onehot Index to Bit
patch/add-node s595 s595 output/arduino_shift595_1 Shift 595 (1)
patch/add-node s595 osc1 wave/mozzi_sin Sine
patch/add-node s595 out1 output/mozzi_out Output

node/turn-on m1
node/turn-on pot1
node/turn-on sm1
node/turn-on mul1
node/turn-on add1
node/turn-on mux1
node/turn-on seq1
node/turn-on dec1
node/turn-on s595
node/turn-on osc1
node/turn-on out1

node/move m1 50 50
node/move pot1 50 200
node/move sm1 50 350
node/move mul1 50 500
node/move add1 50 650
node/move seq1 350 50
node/move mux1 350 400
node/move dec1 650 50
node/move s595 900 300
node/move osc1 650 600
node/move out1 900 600

node/update-inlet m1 bpm 240
node/update-inlet pot1 pin A1
node/update-inlet sm1 smooth 0.95
node/update-inlet mul1 b 2
node/update-inlet add1 b 1
node/update-inlet mux1 s0 2
node/update-inlet mux1 s1 3
node/update-inlet mux1 s2 4
node/update-inlet mux1 pin A0
node/update-inlet s595 data_pin 11
node/update-inlet s595 latch 12
node/update-inlet s595 clock 13

outlet/connect m1:out seq1:trig
outlet/connect pot1:out sm1:in
outlet/connect sm1:out mul1:a
outlet/connect mul1:out add1:a
outlet/connect add1:out seq1:steps
outlet/connect mux1:ch0 seq1:s0
outlet/connect mux1:ch1 seq1:s1
outlet/connect mux1:ch2 seq1:s2
outlet/connect mux1:ch3 seq1:s3
outlet/connect mux1:ch4 seq1:s4
outlet/connect mux1:ch5 seq1:s5
outlet/connect mux1:ch6 seq1:s6
outlet/connect mux1:ch7 seq1:s7
outlet/connect seq1:index dec1:in
outlet/connect dec1:out s595:bits0
outlet/connect seq1:out osc1:freq
outlet/connect osc1:out out1:audio_in`;
