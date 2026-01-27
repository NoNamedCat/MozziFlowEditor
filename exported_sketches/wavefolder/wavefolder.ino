// MOZZIFLOW v110.9 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <tables/sin2048_int8.h>
#include <WaveFolder.h>

// GLOBALS
long node_s1_out = 0;
Oscil<SIN2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_s1(SIN2048_DATA);
long node_l2_out = 0;
Oscil<SIN2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_l2(SIN2048_DATA);
long node_fld_out = 0;
WaveFolder<int> mozziwavefolder_fld;
long node_out_out = 0;

void setup() {
    startMozzi();
    
}

void updateControl() {
    
}

AudioOutput updateAudio() {
    node_s1_out = oscil_s1.next();
    // Control logic moved to audio loop for node s1
    oscil_s1.setFreq((float)440);
    node_l2_out = oscil_l2.next();
    // Control logic moved to audio loop for node l2
    oscil_l2.setFreq((float)0.2);
    node_fld_out = mozziwavefolder_fld.next((int)node_s1_out);
    return MonoOutput::from8Bit((int)node_fld_out);
}

void loop() {
    audioHook();
}
