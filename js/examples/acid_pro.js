EXAMPLES['acid_pro'] = `v2.1.1
network/add-patch acpro Acid_Pro_Optimized
patch/open acpro
# Timing and Sequencing (CONTROL RATE)
patch/add-node acpro clock signal/mozzi_metronome Metronome
node/set-data clock eyJyYXRlX21vZGUiOjF9
node/update-inlet clock bpm 135

patch/add-node acpro seq signal/mozzi_sequencer Sequencer
node/set-data seq eyJyYXRlX21vZGUiOjF9
node/update-inlet seq s0 36
node/update-inlet seq s1 48
node/update-inlet seq s2 36
node/update-inlet seq s3 39
node/update-inlet seq s4 41
node/update-inlet seq s5 36
node/update-inlet seq s6 46
node/update-inlet seq s7 43

patch/add-node acpro mtof math/mtof Midi->Freq
node/set-data mtof eyJyYXRlX21vZGUiOjF9

# Synthesis (AUDIO RATE)
patch/add-node acpro osc wave/mozzi_saw Saw
node/set-data osc eyJyYXRlX21vZGUiOjJ9

patch/add-node acpro env signal/mozzi_adsr ADSR
node/set-data env eyJyYXRlX21vZGUiOjF9
node/update-inlet env att 5
node/update-inlet env dec 180
node/update-inlet env sus 0
node/update-inlet env rel 50

# Optimized Modulation Chain (Control -> Smooth -> Audio)
patch/add-node acpro mapper math/mozzi_map Map%20Range
node/set-data mapper eyJyYXRlX21vZGUiOjF9
node/update-inlet mapper in_min 0
node/update-inlet mapper in_max 255
node/update-inlet mapper out_min 400
node/update-inlet mapper out_max 4000

patch/add-node acpro smooth filter/mozzi_smooth Smooth
node/set-data smooth eyJyYXRlX21vZGUiOjJ9
node/update-inlet smooth smooth 0.98

patch/add-node acpro vcf filter/mozzi_svf State Variable
node/set-data vcf eyJyYXRlX21vZGUiOjJ9
node/update-inlet vcf res 180

# VCA and Output
patch/add-node acpro vca signal/mozzi_gain Gain
node/set-data vca eyJyYXRlX21vZGUiOjJ9

patch/add-node acpro out output/mozzi_out Output

# Connections
outlet/connect clock:out seq:trig
outlet/connect clock:out env:trig
outlet/connect seq:out mtof:note
outlet/connect mtof:out osc:freq

# Modulation Path
outlet/connect env:out mapper:in
outlet/connect mapper:out smooth:in
outlet/connect smooth:out vcf:cutoff

# Signal Path
outlet/connect osc:out vcf:in
outlet/connect vcf:out vca:in
outlet/connect env:out vca:gain
outlet/connect vca:out out:audio_in

# Formatting
node/move clock 20 100
node/move seq 200 50
node/move mtof 380 50
node/move env 200 300
node/move osc 550 50
node/move mapper 400 300
node/move smooth 600 300
node/move vcf 800 150
node/move vca 1000 250
node/move out 1200 250`;