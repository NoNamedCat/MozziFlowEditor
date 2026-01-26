EXAMPLES['kick_drum'] = `v2.1.1
network/add-patch kick Analog_Kick_Drum
patch/open kick
# Modules
patch/add-node kick clock signal/mozzi_metronome Metronome
patch/add-node kick osc wave/mozzi_sin Sine
patch/add-node kick env_amp signal/mozzi_ead Ead Env
patch/add-node kick env_pitch signal/mozzi_ead Ead Env
patch/add-node kick vca signal/mozzi_gain Gain
patch/add-node kick p_amt math/mul Multiply
patch/add-node kick base math/add Add
patch/add-node kick out output/mozzi_out Output

# Placement
node/move clock 50 50
node/move env_amp 250 50
node/move env_pitch 250 200
node/move p_amt 450 200
node/move base 600 200
node/move osc 750 200
node/move vca 900 100
node/move out 1100 100

# Config
node/update-inlet clock bpm 110
node/update-inlet p_amt b 150
node/update-inlet base b 45

# Connections
outlet/connect clock:out env_amp:trig
outlet/connect clock:out env_pitch:trig
outlet/connect env_pitch:out p_amt:a
outlet/connect p_amt:out base:a
outlet/connect base:out osc:freq
outlet/connect osc:out vca:in
outlet/connect env_amp:out vca:gain
outlet/connect vca:out out:audio_in`;