EXAMPLES['pm'] = `v2.1.1
network/add-patch pm Phase_Modulation
patch/open pm
# --- MODULATOR ---
patch/add-node pm mod wave/mozzi_sin Sine
node/set-data mod eyJyYXRlX21vZGUiOjJ9
node/update-inlet mod freq 5

patch/add-node pm gain math/mul Multiply
node/set-data gain eyJyYXRlX21vZGUiOjJ9
node/update-inlet gain b 10000

# --- CARRIER ---
patch/add-node pm car wave/mozzi_sin Sine
node/set-data car eyJyYXRlX21vZGUiOjJ9
node/update-inlet car freq 220

patch/add-node pm out output/mozzi_master Output
node/set-data out eyJjaGFubmVscyI6Ik1PWlpJX01PTk8iLCJtb2RlIjoiTU9aWklfT1VUUFVUX1BXTSIsInJhdGVfbW9kZSI6Mn0=

# --- CONNECTIONS ---
outlet/connect mod:out gain:a
outlet/connect gain:out car:phase
outlet/connect car:out out:audio_in

# --- POSITIONING ---
node/move mod 50 50
node/move gain 250 50
node/move car 450 50
node/move out 650 50
`;