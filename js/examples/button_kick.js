EXAMPLES['button_kick'] = `v2.1.1
network/add-patch bkick Button_Drum_Trigger
patch/open bkick
patch/add-node bkick btn1 input/arduino_button Button
patch/add-node bkick kick wave/mozzi_sample Sample
patch/add-node bkick out1 output/mozzi_out Output
node/turn-on btn1
node/turn-on kick
node/turn-on out1
node/move btn1 50 150
node/move kick 300 150
node/move out1 550 150
node/set-data kick eyJzYW1wbGVJbmZvIjp7Im5hbWUiOiJraWNrX3B1bHNlLmgiLCJkYXRhIjpbMTI3LDAsLTEyNywwLDEyNywwLC0xMjcsMCwxMjcsMCwtMTI3LDBdLCJjcHAiOiJjb25zdCBpbnQ4X3Qga2lja19kYXRhW10gUFJPR01FTSA9IHsxMjcsMCwtMTI3LDAsMTI3LDAsLTEyNywwLDEyNywwLC0xMjcsMH07In19
node/update-inlet btn1 pin 5
outlet/connect btn1:out kick:trig
outlet/connect kick:out out1:audio_in`;