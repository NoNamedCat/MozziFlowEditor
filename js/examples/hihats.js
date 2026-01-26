EXAMPLES['hihats'] = `v2.1.1
network/add-patch hh Metallic_HiHats
patch/open hh
# Noise source + High Pass filter logic (High freq sine modulation)
patch/add-node hh clock signal/mozzi_metronome Metronome
patch/add-node hh noise wave/mozzi_noise Noise
patch/add-node hh hpf filter/mozzi_svf SVF Filter
patch/add-node hh env signal/mozzi_ead Ead Env
patch/add-node hh vca signal/mozzi_gain Gain
patch/add-node hh out output/mozzi_out Output

node/move clock 50 50
node/move noise 50 200
node/move env 250 50
node/move hpf 250 200
node/move vca 450 150
node/move out 650 150

node/update-inlet clock bpm 240
# High pass simulation via SVF BandPass/High freq
node/update-inlet hpf cutoff 8000
node/update-inlet hpf res 200

outlet/connect clock:out env:trig
outlet/connect noise:out hpf:in
outlet/connect hpf:out vca:in
outlet/connect env:out vca:gain
outlet/connect vca:out out:audio_in`;