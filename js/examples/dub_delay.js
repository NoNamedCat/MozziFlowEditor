EXAMPLES['dub_delay'] = `v2.1.1
network/add-patch dub Dub_Delay
patch/open dub
patch/add-node dub osc wave/mozzi_square Square
patch/add-node dub lfo lfo/mozzi_lfo_sin Sine%20LFO
patch/add-node dub btn input/arduino_button Button
patch/add-node dub del filter/mozzi_audiodelay Audio%20Delay
patch/add-node dub out output/mozzi_out Output

node/update-inlet lfo freq 0.5
node/update-inlet btn pin 2
node/update-inlet del delay 200

outlet/connect lfo:out osc:freq
outlet/connect osc:out del:in
outlet/connect btn:out out:audio_in
# Note: Connections fixed to use existing outlets
outlet/connect del:out out:audio_in`;