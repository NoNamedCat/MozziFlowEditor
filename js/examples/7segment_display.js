EXAMPLES['7segment_display'] = `v2.1.1
network/add-patch root 7-Segment_Control
patch/open root
# --- CONTROL LOGIC ---
patch/add-node root enc1 input/arduino_encoder Encoder
node/set-data enc1 eyJyYXRlX21vZGUiOjF9
node/update-inlet enc1 pinA 2
node/update-inlet enc1 pinB 3

patch/add-node root cnt1 signal/counter Counter
node/set-data cnt1 eyJyYXRlX21vZGUiOjF9
node/update-inlet cnt1 max 9

patch/add-node root drv1 signal/arduino_7seg 7-Seg%20Driver
node/set-data drv1 eyJyYXRlX21vZGUiOjF9

patch/add-node root shft output/arduino_shift595_1 Shift%20595%20(1)
node/set-data shft eyJyYXRlX21vZGUiOjF9
node/update-inlet shft data_pin 11
node/update-inlet shft latch 12
node/update-inlet shft clock 13

# --- CONNECTIONS ---
outlet/connect enc1:up cnt1:up
outlet/connect enc1:down cnt1:down
outlet/connect cnt1:out drv1:val
outlet/connect drv1:out shft:bits0

# --- POSITIONING ---
node/move enc1 50 100
node/move cnt1 250 100
node/move drv1 450 100
node/move shft 650 100
`;
