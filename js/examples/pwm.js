EXAMPLES['pwm'] = `v2.1.1
network/add-patch root PWM_PulseWidth
patch/open root
# --- MODULATION (Control + Smooth) ---
patch/add-node root lfo wave/mozzi_sin LFO
node/set-data lfo eyJyYXRlX21vZGUiOjF9
node/update-inlet lfo freq 0.5

patch/add-node root mapper math/mozzi_map Map Range
node/set-data mapper eyJyYXRlX21vZGUiOjF9
node/update-inlet mapper in_min -128
node/update-inlet mapper in_max 127
node/update-inlet mapper out_min 10
node/update-inlet mapper out_max 245

patch/add-node root smooth filter/mozzi_smooth Smooth
node/set-data smooth eyJyYXRlX21vZGUiOjJ9
node/update-inlet smooth smooth 0.95

# --- AUDIO ---
patch/add-node root osc wave/mozzi_phasor Phasor
node/set-data osc eyJyYXRlX21vZGUiOjJ9
node/update-inlet osc freq 110

patch/add-node root cmp math/gt PWM Logic
node/set-data cmp eyJyYXRlX21vZGUiOjJ9

patch/add-node root out output/mozzi_out Output
node/set-data out eyJyYXRlX21vZGUiOjJ9

# --- CONNECTIONS ---
outlet/connect lfo:out mapper:in
outlet/connect mapper:out smooth:in
outlet/connect smooth:out cmp:b
outlet/connect osc:out cmp:a
outlet/connect cmp:out out:audio_in

# --- POSITIONING ---
node/move lfo 50 50
node/move mapper 250 50
node/move smooth 450 50
node/move osc 50 250
node/move cmp 650 150
node/move out 850 150
`;