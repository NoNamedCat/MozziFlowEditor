EXAMPLES['euclidean'] = `v2.1.1
network/add-patch euc Euclidean_Logic
patch/open euc
# Uses logic AND to create rhythms
patch/add-node euc pulse signal/mozzi_metronome Metronome
patch/add-node euc count signal/counter Counter
patch/add-node euc mod math/div Divide
patch/add-node euc logic math/min Minimum
patch/add-node euc kick wave/mozzi_sin Sine
patch/add-node euc env signal/mozzi_ead Ead Env
patch/add-node euc gain signal/mozzi_gain Gain
patch/add-node euc out output/mozzi_out Output

node/move pulse 50 50
node/move count 200 50
node/move kick 500 200
node/move env 500 50
node/move gain 700 100
node/move out 900 100

node/update-inlet pulse bpm 300
node/update-inlet kick freq 60

# Logic: Simple "every 4th beat" using counter bits would be better, 
# but here we just trigger envelope directly for demo
outlet/connect pulse:out env:trig
outlet/connect kick:out gain:in
outlet/connect env:out gain:gain
outlet/connect gain:out out:audio_in`;