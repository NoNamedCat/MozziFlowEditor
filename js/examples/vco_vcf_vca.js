EXAMPLES['vco_vcf_vca'] = `v2.1.1
network/add-patch root root
patch/open root
patch/add-node root tlk7 lfo/mozzi_pulse Pulse%20LFO
node/move tlk7 50 200
node/update-inlet tlk7 freq 1
node/update-inlet tlk7 width 120
patch/add-node root q7rj wave/mozzi_saw Saw
node/move q7rj 71 29
node/update-inlet q7rj freq 110
patch/add-node root rlfd signal/mozzi_adsr ADSR
node/move rlfd 315 110
node/update-inlet rlfd trig 0
node/update-inlet rlfd rst 0
node/update-inlet rlfd att 20
node/update-inlet rlfd lev 255
node/update-inlet rlfd dec 200
node/update-inlet rlfd sus 150
node/update-inlet rlfd rel 800
patch/add-node root zt91 filter/mozzi_multires MultiRes%20Filter
node/move zt91 540 41
node/update-inlet zt91 in 0
node/update-inlet zt91 cutoff 128
node/update-inlet zt91 res 100
patch/add-node root 4f9t signal/mozzi_gain Gain
node/move 4f9t 854 157
node/update-inlet 4f9t in 0
node/update-inlet 4f9t gain 128
patch/add-node root z6hw output/mozzi_out Output
node/move z6hw 1098 171
node/update-inlet z6hw audio_in 0
outlet/connect tlk7:out rlfd:trig
outlet/connect q7rj:out zt91:in
outlet/connect zt91:low 4f9t:in
outlet/connect rlfd:out 4f9t:gain
outlet/connect 4f9t:out z6hw:audio_in
outlet/connect rlfd:out zt91:cutoff`;