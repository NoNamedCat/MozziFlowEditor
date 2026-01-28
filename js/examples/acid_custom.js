EXAMPLES['acid_custom'] = `v2.1.1
network/add-patch root root
patch/open root
patch/add-node root r9gr signal/mozzi_metronome Metronome
node/move r9gr 22 235
node/update-inlet r9gr bpm 135
node/set-data r9gr eyJicG0iOiIxMzUiLCJyYXRlX21vZGUiOjF9
patch/add-node root uakc signal/mozzi_sequencer16 Notes
node/move uakc 250 50
node/update-inlet uakc s0 36
node/update-inlet uakc s1 36
node/update-inlet uakc s2 48
node/update-inlet uakc s3 36
node/update-inlet uakc s4 39
node/update-inlet uakc s5 36
node/update-inlet uakc s6 48
node/update-inlet uakc s7 36
node/update-inlet uakc s8 36
node/update-inlet uakc s9 36
node/update-inlet uakc s10 60
node/update-inlet uakc s11 36
node/update-inlet uakc s12 39
node/update-inlet uakc s13 36
node/update-inlet uakc s14 48
node/update-inlet uakc s15 36
node/set-data uakc eyJzMCI6IjM2IiwiczEiOiIzNiIsInMyIjoiNDgiLCJzMyI6IjM2IiwiczQiOiIzOSIsInM1IjoiMzYiLCJzNiI6IjQ4IiwiczciOiIzNiIsInM4IjoiMzYiLCJzOSI6IjM2IiwiczEwIjoiNjAiLCJzMTEiOiIzNiIsInMxMiI6IjM5IiwiczEzIjoiMzYiLCJzMTQiOiI0OCIsInMxNSI6IjM2IiwicmF0ZV9tb2RlIjoxfQ==
patch/add-node root g9zd signal/mozzi_sequencer16 Slides
node/move g9zd 250 640
node/update-inlet g9zd s2 255
node/update-inlet g9zd s6 255
node/update-inlet g9zd s10 255
node/update-inlet g9zd s14 255
node/set-data g9zd eyJzMiI6IjI1NSIsInM2IjoiMjU1IiwiczEwIjoiMjU1IiwiczE0IjoiMjU1IiwicmF0ZV9tb2RlIjoxfQ==
patch/add-node root 2rk5 signal/mozzi_sequencer16 Accents
node/move 2rk5 254 1251
node/update-inlet 2rk5 s0 255
node/update-inlet 2rk5 s4 255
node/update-inlet 2rk5 s8 255
node/update-inlet 2rk5 s12 255
node/set-data 2rk5 eyJzMCI6IjI1NSIsInM0IjoiMjU1IiwiczgiOiIyNTUiLCJzMTIiOiIyNTUiLCJyYXRlX21vZGUiOjF9
patch/add-node root 5igc math/mtof Midi-%3EFreq
node/move 5igc 507 92
node/set-data 5igc eyJyYXRlX21vZGUiOjF9
patch/add-node root l890 signal/exponential_glide 303%20Glide
node/move l890 741 89
node/set-data l890 eyJyYXRlX21vZGUiOjF9
patch/add-node root x0kk wave/mozzi_saw Saw%20VCO
node/move x0kk 988 103
node/update-inlet x0kk freq 440
node/set-data x0kk eyJyYXRlX21vZGUiOjIsImZyZXEiOiI0NDAifQ==
patch/add-node root nbfo signal/accentuated_envelope 303%20Env
node/move nbfo 737 228
node/update-inlet nbfo decay 1
node/set-data nbfo eyJkZWNheSI6IjEiLCJyYXRlX21vZGUiOjF9
patch/add-node root 91a1 math/mozzi_map Map%20Freq
node/move 91a1 984 369
node/update-inlet 91a1 in_min 0
node/update-inlet 91a1 in_max 255
node/update-inlet 91a1 out_min 400
node/update-inlet 91a1 out_max 4000
node/set-data 91a1 eyJpbl9taW4iOiIwIiwiaW5fbWF4IjoiMjU1Iiwib3V0X21pbiI6IjQwMCIsIm91dF9tYXgiOiI0MDAwIiwicmF0ZV9tb2RlIjoxfQ==
patch/add-node root p0uh filter/mozzi_svf Resonant%20LPF
node/move p0uh 1250 93
node/update-inlet p0uh cutoff 1200
node/update-inlet p0uh res 127
node/set-data p0uh eyJyYXRlX21vZGUiOjIsImN1dG9mZiI6IjEyMDAiLCJyZXMiOiIxMjcifQ==
patch/add-node root ughw math/mul VCA
node/move ughw 1488 231
node/update-inlet ughw b 1
node/set-data ughw eyJiIjoiMSJ9
patch/add-node root u75f math/shr Normalizer
node/move u75f 1713 134
node/update-inlet u75f b 8
node/set-data u75f eyJiIjoiOCJ9
patch/add-node root j6jn filter/hard_clipper Hard%20Clip
node/move j6jn 1961 146
node/update-inlet j6jn drive 1
node/set-data j6jn eyJyYXRlX21vZGUiOjIsImRyaXZlIjoiMSJ9
patch/add-node root 0cvd output/mozzi_master Master
node/move 0cvd 2276 102
node/set-data 0cvd eyJjaGFubmVscyI6Ik1PWlpJX01PTk8iLCJtb2RlIjoiTU9aWklfT1VUUFVUX1BXTSIsInJlc29sdXRpb24iOiI4Yml0In0=
outlet/connect r9gr:out uakc:trig
outlet/connect r9gr:out g9zd:trig
outlet/connect r9gr:out 2rk5:trig
outlet/connect r9gr:out nbfo:trig
outlet/connect uakc:out 5igc:note
outlet/connect 5igc:out l890:freq
outlet/connect g9zd:out l890:glide_active
outlet/connect l890:out x0kk:freq
outlet/connect 2rk5:out nbfo:boost
outlet/connect nbfo:out 91a1:in
outlet/connect 91a1:out p0uh:cutoff
outlet/connect x0kk:out p0uh:in
outlet/connect p0uh:out ughw:a
outlet/connect nbfo:out ughw:b
outlet/connect ughw:out u75f:a
outlet/connect u75f:out j6jn:in
outlet/connect j6jn:out 0cvd:audio_in
`;