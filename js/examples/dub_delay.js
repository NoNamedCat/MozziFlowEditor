EXAMPLES['dub_delay'] = `v2.1.1
network/add-patch dub Dub_Siren_Delay
patch/open dub
patch/add-node dub lfo lfo/mozzi_lfo_tri Triangle LFO
patch/add-node dub osc wave/mozzi_square Square
patch/add-node dub btn input/arduino_button Button
patch/add-node dub vca signal/mozzi_gain Gain
patch/add-node dub delay filter/mozzi_delay_fb Delay FB
patch/add-node dub out output/mozzi_out Output

node/move lfo 50 50
node/move btn 50 200
node/move osc 250 50
node/move vca 450 150
node/move delay 650 150
node/move out 850 150

node/update-inlet lfo freq 8
node/update-inlet osc freq 440
node/update-inlet btn pin 2
node/update-inlet delay samples 1500
node/update-inlet delay feedback 220
node/set-data delay eyJidWZmZXJTaXplIjoiMjA0OCJ9
outlet/connect lfo:out osc:freq
outlet/connect osc:out vca:in
outlet/connect btn:out vca:gain
outlet/connect vca:out delay:in
outlet/connect delay:out out:audio_in`;