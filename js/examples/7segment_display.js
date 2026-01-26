EXAMPLES['7segment_display'] = `v2.1.1
network/add-patch seg7 7-Segment_Display
patch/open seg7
patch/add-node seg7 enc1 input/arduino_encoder Encoder
patch/add-node seg7 cnt1 signal/counter Counter
patch/add-node seg7 drv1 signal/arduino_7seg 7-Seg Driver
patch/add-node seg7 shft output/arduino_shift595_1 Shift 595 (1)
node/turn-on enc1
node/turn-on cnt1
node/turn-on drv1
node/turn-on shft
node/move enc1 50 150
node/move cnt1 300 150
node/move drv1 550 150
node/move shft 800 150
node/update-inlet enc1 pinA 2
node/update-inlet enc1 pinB 3
node/update-inlet shft data_pin 11
node/update-inlet shft latch 12
node/update-inlet shft clock 13
node/update-inlet cnt1 max 9
outlet/connect enc1:up cnt1:up
outlet/connect enc1:down cnt1:down
outlet/connect cnt1:out drv1:val
outlet/connect drv1:d0 shft:bits0`;