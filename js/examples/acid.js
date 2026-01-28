EXAMPLES['acid'] = `v2.1.1
network/add-patch root root
patch/open root
patch/add-node root q5cx signal/mozzi_metronome Metronome
node/move q5cx 48 273
node/update-inlet q5cx bpm 135
node/set-data q5cx eyJicG0iOiIxMzUiLCJyYXRlX21vZGUiOjF9
patch/add-node root m37r signal/mozzi_ead Ead%20Env
node/move m37r 283 269
node/update-inlet m37r att 10
node/update-inlet m37r dec 200
node/set-data m37r eyJhdHQiOiIxMCIsImRlYyI6IjIwMCIsInJhdGVfbW9kZSI6Mn0=
patch/add-node root z4a8 filter/mozzi_multires MultiRes%20Filter
node/move z4a8 1054 145
node/update-inlet z4a8 cutoff 12000
node/update-inlet z4a8 res 300
node/set-data z4a8 eyJyYXRlX21vZGUiOjIsImN1dG9mZiI6IjEyMDAwIiwicmVzIjoiMzAwIn0=
patch/add-node root bl74 output/mozzi_master Output
node/move bl74 1309 82
node/set-data bl74 eyJjaGFubmVscyI6Ik1PWlpJX01PTk8iLCJtb2RlIjoiTU9aWklfT1VUUFVUX1BXTSIsInJlc29sdXRpb24iOiI4Yml0In0=
patch/add-node root og1x math/mozzi_map Map%20Range
node/move og1x 528 287
node/update-inlet og1x in_min 0
node/update-inlet og1x in_max 255
node/update-inlet og1x out_min 100
node/update-inlet og1x out_max 8000
node/set-data og1x eyJpbl9taW4iOiIwIiwiaW5fbWF4IjoiMjU1Iiwib3V0X21pbiI6IjEwMCIsIm91dF9tYXgiOiI4MDAwIiwicmF0ZV9tb2RlIjoxfQ==
patch/add-node root 7aj4 filter/mozzi_smooth Smooth
node/move 7aj4 793 339
node/update-inlet 7aj4 smooth 0.4
node/set-data 7aj4 eyJzbW9vdGgiOiIwLjQiLCJyYXRlX21vZGUiOjJ9
patch/add-node root odiw wave/mozzi_square Square
node/move odiw 343 120
node/update-inlet odiw freq 53
node/set-data odiw eyJmcmVxIjoiNTMifQ==
outlet/connect q5cx:out m37r:trig
outlet/connect m37r:out og1x:in
outlet/connect z4a8:low bl74:audio_in
outlet/connect og1x:out 7aj4:in
outlet/connect 7aj4:out z4a8:cutoff
outlet/connect odiw:out z4a8:in
`;