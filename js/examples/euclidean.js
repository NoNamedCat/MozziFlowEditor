EXAMPLES['euclidean'] = `v2.1.1
network/add-patch euc Euclidean_Rhythm
patch/open euc
# Master Clock
patch/add-node euc clock signal/mozzi_metronome Metronome
node/move clock 50 150
node/update-inlet clock bpm 240

# Counter to select the active beat
patch/add-node euc cnt1 signal/counter Counter
node/move cnt1 250 250
node/update-inlet cnt1 max 3

# Router to distribute clock pulses
patch/add-node euc rout signal/router4 Router
node/move rout 450 150

# Sound Engine
patch/add-node euc osc wave/mozzi_sin Sine
node/move osc 650 350
node/update-inlet osc freq 60

patch/add-node euc env signal/mozzi_ead Ead%20Env
node/move env 650 100
node/update-inlet env att 5
node/update-inlet env dec 150

patch/add-node euc vca math/mul Multiply
node/move vca 850 250

patch/add-node euc out output/mozzi_out Output
node/move out 1050 250

# Connections
# 1. Clock drives both counter and router input
outlet/connect clock:out cnt1:up
outlet/connect clock:out rout:in

# 2. Counter output controls WHICH router outlet is active
outlet/connect cnt1:out rout:idx

# 3. Use only Outlet 0 to trigger the sound (Beat 1 of 4)
outlet/connect rout:out0 env:trig

# 4. Audio Path
outlet/connect osc:out vca:a
outlet/connect env:out vca:b
outlet/connect vca:out out:audio_in
`;