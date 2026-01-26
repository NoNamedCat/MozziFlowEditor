EXAMPLES['theremin'] = `v2.1.1
network/add-patch theremin Light_Theremin
patch/open theremin
patch/add-node theremin ldr input/mozzi_async_analog Async Analog
patch/add-node theremin smooth signal/mozzi_smooth Smooth
patch/add-node theremin map math/mozzi_intmap IntMap
patch/add-node theremin osc wave/mozzi_sin Sine
patch/add-node theremin echo filter/mozzi_audiodelay Audio Delay
patch/add-node theremin out output/mozzi_out Output

node/move ldr 50 150
node/move smooth 250 150
node/move map 450 150
node/move osc 650 150
node/move echo 850 150
node/move out 1050 150

node/update-inlet ldr pin A0
node/update-inlet smooth smooth 0.95
node/update-inlet echo time 300

outlet/connect ldr:out smooth:in
outlet/connect smooth:out map:in
outlet/connect map:out osc:freq
outlet/connect osc:out echo:in
outlet/connect echo:out out:audio_in`;