EXAMPLES['acid_pro'] = `v2.1.1
network/add-patch root root
patch/open root
patch/add-node root 92zp signal/mozzi_metronome Metronome
node/move 92zp 39 400
node/update-inlet 92zp bpm 135
node/set-data 92zp eyJicG0iOiIxMzUiLCJyYXRlX21vZGUiOjF9
patch/add-node root 98hn signal/mozzi_sequencer Sequencer
node/move 98hn 270 232
node/update-inlet 98hn trig 0
node/update-inlet 98hn s0 36
node/update-inlet 98hn s1 48
node/update-inlet 98hn s2 36
node/update-inlet 98hn s3 39
node/update-inlet 98hn s4 41
node/update-inlet 98hn s5 36
node/update-inlet 98hn s6 46
node/update-inlet 98hn s7 43
node/set-data 98hn eyJ0cmlnIjoiMCIsInMwIjoiMzYiLCJzMSI6IjQ4IiwiczIiOiIzNiIsInMzIjoiMzkiLCJzNCI6IjQxIiwiczUiOiIzNiIsInM2IjoiNDYiLCJzNyI6IjQzIiwicmF0ZV9tb2RlIjoxfQ==
patch/add-node root jr02 math/mtof Midi-%3EFreq
node/move jr02 534 327
node/set-data jr02 eyJyYXRlX21vZGUiOjF9
patch/add-node root 640e signal/mozzi_adsr ADSR
node/move 640e 276 566
node/update-inlet 640e att 5
node/update-inlet 640e lev 255
node/update-inlet 640e dec 180
node/update-inlet 640e sus 64
node/update-inlet 640e rel 50
node/set-data 640e eyJhdHQiOiI1IiwibGV2IjoiMjU1IiwiZGVjIjoiMTgwIiwic3VzIjoiNjQiLCJyZWwiOiI1MCIsInJhdGVfbW9kZSI6MX0=
patch/add-node root o6yn math/mozzi_map Map%20Range
node/move o6yn 519 451
node/update-inlet o6yn in_min 0
node/update-inlet o6yn in_max 255
node/update-inlet o6yn out_min 400
node/update-inlet o6yn out_max 4000
node/set-data o6yn eyJpbl9taW4iOiIwIiwiaW5fbWF4IjoiMjU1Iiwib3V0X21pbiI6IjQwMCIsIm91dF9tYXgiOiI0MDAwIiwicmF0ZV9tb2RlIjoxfQ==
patch/add-node root qpyy filter/mozzi_smooth Smooth
node/move qpyy 775 503
node/update-inlet qpyy smooth 0.95
node/set-data qpyy eyJzbW9vdGgiOiIwLjk1IiwicmF0ZV9tb2RlIjoxfQ==
patch/add-node root ev8r wave/mozzi_saw Saw
node/move ev8r 783 333
node/update-inlet ev8r freq 440
node/set-data ev8r eyJmcmVxIjoiNDQwIiwicmF0ZV9tb2RlIjoyfQ==
patch/add-node root 3fyk filter/mozzi_svf SVF%20Filter
node/move 3fyk 1047 322
node/update-inlet 3fyk cutoff 1200
node/update-inlet 3fyk res 180
node/set-data 3fyk eyJyYXRlX21vZGUiOjIsIm1vZGUiOiJMT1dQQVNTIiwiY3V0b2ZmIjoiMTIwMCIsInJlcyI6IjE4MCJ9
patch/add-node root 04nw signal/mozzi_gain Gain
node/move 04nw 1316 606
node/update-inlet 04nw gain 1
node/set-data 04nw eyJnYWluIjoiMSIsInJhdGVfbW9kZSI6Mn0=
patch/add-node root hjsw math/shr Shift%20Right
node/move hjsw 1527 615
node/update-inlet hjsw b 8
node/set-data hjsw eyJiIjoiOCIsInJhdGVfbW9kZSI6Mn0=
patch/add-node root vdku output/mozzi_master Output
node/move vdku 1743 582
node/set-data vdku eyJjaGFubmVscyI6Ik1PWlpJX01PTk8iLCJtb2RlIjoiTU9aWklfT1VUUFVUX1BXTSIsInJhdGVfbW9kZSI6Mn0=
outlet/connect 92zp:out 98hn:trig
outlet/connect 92zp:out 640e:trig
outlet/connect 98hn:out jr02:note
outlet/connect jr02:out ev8r:freq
outlet/connect 640e:out o6yn:in
outlet/connect o6yn:out qpyy:in
outlet/connect qpyy:out 3fyk:cutoff
outlet/connect ev8r:out 3fyk:in
outlet/connect 3fyk:out 04nw:in
outlet/connect 640e:out 04nw:gain
outlet/connect 04nw:out hjsw:a
outlet/connect hjsw:out vdku:audio_in
`;