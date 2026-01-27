// MOZZIFLOW v110.9 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <tables/sin2048_int8.h>

// GLOBALS
long node_l1_out = 0;
Oscil<SIN2048_NUM_CELLS, MOZZI_AUDIO_RATE> mozzisin_l1(SIN2048_DATA);
long node_l2_out = 0;
Oscil<SIN2048_NUM_CELLS, MOZZI_AUDIO_RATE> mozzisin_l2(SIN2048_DATA);
long node_out_out = 0;

void setup() {
    startMozzi();
    
}

void updateControl() {
    // Control task for audio node l1
        mozzisin_l1.setFreq((float)0.1);
    // Control task for audio node l2
        mozzisin_l2.setFreq((float)0.15);
}

AudioOutput updateAudio() {
    node_l1_out = mozzisin_l1.next();
    node_l2_out = mozzisin_l2.next();
    return MonoOutput::from8Bit((int)node_wp1_out);
}

void loop() {
    audioHook();
}
