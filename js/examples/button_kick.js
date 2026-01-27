EXAMPLES['button_kick'] = `v2.1.1
network/add-patch btk Button_Kick
patch/open btk
patch/add-node btk btn1 input/arduino_button Button
patch/add-node btk kick wave/mozzi_sin Sine
patch/add-node btk env signal/mozzi_ead Ead%20Env
patch/add-node btk vca math/mul Multiply
patch/add-node btk out output/mozzi_out Output

node/update-inlet btn1 pin 5
node/update-inlet kick freq 60

outlet/connect btn1:out env:trig
outlet/connect kick:out vca:a
outlet/connect env:out vca:b
outlet/connect vca:out out:audio_in`;