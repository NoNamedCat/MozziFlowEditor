EXAMPLES['drums'] = `v2.1.1
network/add-patch dm LinnDrum_Clean
patch/open dm
patch/add-node dm kick wave/mozzi_sample Sample
patch/add-node dm m1 signal/mozzi_metronome Metronome
patch/add-node dm gain signal/mozzi_gain Gain
patch/add-node dm dcf filter/mozzi_dcfilter DC Filter
patch/add-node dm out output/mozzi_out Output
node/turn-on kick
node/turn-on m1
node/turn-on gain
node/turn-on dcf
node/turn-on out
node/move m1 50 150
node/move kick 250 150
node/move gain 450 150
node/move dcf 650 150
node/move out 800 150
node/update-inlet m1 bpm 124
node/update-inlet gain gain 180
node/set-data kick eyJzYW1wbGVJbmZvIjp7Im5hbWUiOiJraWNrX2RhdGEuaCIsImRhdGEiOlsxMjcsMCwtMTI3LDAsMTI3LDAsLTEyNywwLDEyNywwLC0xMjcsMF0sImNwcCI6ImNvbnN0IGludDhfdCBraWNrX2RhdGFbXSBQUk9HTUVNID0gezEyNywwLC0xMjcsMCwxMjcsMCwtMTI3LDAsMTI3LDAsLTEyNywwfTsiLCJzaXplIjoxMn19
outlet/connect m1:out kick:trig
outlet/connect kick:out gain:in
outlet/connect gain:out dcf:in
outlet/connect dcf:out out:audio_in`;