EXAMPLES['theremin'] = `v2.1.1
network/add-patch thm Theremin_Sim
patch/open thm
patch/add-node thm ana input/mozzi_async_analog Async%20Analog
patch/add-node thm sm signal/mozzi_smooth Smooth
patch/add-node thm map math/mozzi_intmap IntMap
patch/add-node thm osc wave/mozzi_sin Sine
patch/add-node thm echo filter/mozzi_audiodelay Audio%20Delay
patch/add-node thm out output/mozzi_out Output

node/update-inlet ana pin A0
node/update-inlet map min 220
node/update-inlet map max 880
node/update-inlet echo delay 128

outlet/connect ana:out sm:in
outlet/connect sm:out map:in
outlet/connect map:out osc:freq
outlet/connect osc:out echo:in
outlet/connect echo:out out:audio_in`;