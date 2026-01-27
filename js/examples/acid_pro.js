EXAMPLES['acid_pro'] = `v2.1.1
network/add-patch acpro Acid_Pro_Replication
patch/open acpro
# Timing and Sequencing (CONTROL RATE FORCED)
patch/add-node acpro clock signal/mozzi_metronome Metronome
node/set-data clock eyJyYXRlX21vZGUiOjF9
node/update-inlet clock bpm 135
patch/add-node acpro seq signal/mozzi_sequencer Sequencer
node/set-data seq eyJyYXRlX21vZGUiOjF9
node/update-inlet seq steps 8
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

# Synthesis (AUDIO RATE DEFAULT)
patch/add-node acpro osc wave/mozzi_saw Saw
patch/add-node acpro env signal/mozzi_adsr ADSR
node/set-data env eyJyYXRlX21vZGUiOjF9
node/update-inlet env att 5
node/update-inlet env dec 180
node/update-inlet env sus 0
node/update-inlet env rel 50
patch/add-node acpro vcf filter/mozzi_svf State Variable
node/update-inlet vcf res 160

# Filter Modulation Chain (CONTROL RATE FORCED)
# These are math ops for control signals, so they should be control rate
patch/add-node acpro c_mul math_audio/mul Mul (Control)
node/set-data c_mul eyJyYXRlX21vZGUiOjF9
node/update-inlet c_mul b 100
patch/add-node acpro c_add math/add Add (Control)
node/set-data c_add eyJyYXRlX21vZGUiOjF9
node/update-inlet c_add a 30
patch/add-node acpro c_shl math/shl Shift Left (Control)
node/set-data c_shl eyJyYXRlX21vZGUiOjF9
node/update-inlet c_shl b 2

# VCA and Mastering (AUDIO RATE)
patch/add-node acpro vca math_audio/mul VCA
patch/add-node acpro vol math_audio/mul Master Vol
node/update-inlet vol b 80
patch/add-node acpro clip math_audio/clipper Clipper
node/update-inlet clip min -127
node/update-inlet clip max 127
patch/add-node acpro out output/mozzi_out Output

# Connections
outlet/connect clock:out seq:trig
outlet/connect clock:out env:trig
outlet/connect seq:out mtof:note
outlet/connect mtof:out osc:freq

# Modulation
outlet/connect env:out c_mul:a
outlet/connect c_mul:out c_add:b
outlet/connect c_add:out c_shl:a
outlet/connect c_shl:out vcf:cutoff

# Signal Path
outlet/connect osc:out vcf:in
outlet/connect vcf:out vca:a
outlet/connect env:out vca:b
outlet/connect vca:out vol:a
outlet/connect vol:out clip:in
outlet/connect clip:out out:audio_in

# Formatting
node/move clock 20 100
node/move seq 200 50
node/move mtof 380 50
node/move env 200 250
node/move osc 550 50
node/move c_mul 380 250
node/move c_add 530 250
node/move c_shl 680 250
node/move vcf 850 150
node/move vca 1000 250
node/move vol 1150 250
node/move clip 1300 250
node/move out 1450 250`;