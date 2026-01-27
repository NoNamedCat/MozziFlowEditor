EXAMPLES['stepper'] = `v2.1.1
network/add-patch root Stepper_Motor_Control
patch/open root
# --- LOGIC ---
patch/add-node root clock signal/mozzi_metronome Metronome
node/set-data clock eyJyYXRlX21vZGUiOjF9
node/update-inlet clock bpm 300

patch/add-node root seq signal/mozzi_sequencer Sequencer
node/set-data seq eyJyYXRlX21vZGUiOjF9
node/update-inlet seq s0 1
node/update-inlet seq s1 2
node/update-inlet seq s2 4
node/update-inlet seq s3 8

patch/add-node root out595 output/arduino_shift595_1 Shift%20595%20(1)
node/set-data out595 eyJyYXRlX21vZGUiOjF9
node/update-inlet out595 data_pin 8
node/update-inlet out595 latch 9
node/update-inlet out595 clock 10

# --- CONNECTIONS ---
outlet/connect clock:out seq:trig
outlet/connect seq:out out595:bits0

# --- POSITIONING ---
node/move clock 50 100
node/move seq 250 100
node/move out595 450 100
`;