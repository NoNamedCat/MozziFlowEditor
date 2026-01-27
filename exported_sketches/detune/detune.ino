// MOZZIFLOW v110.9 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <tables/sin2048_int8.h>

// GLOBALS
long node_s1_out = 0;
Oscil<SIN2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_s1(SIN2048_DATA);
long node_s2_out = 0;
Oscil<SIN2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_s2(SIN2048_DATA);
long node_mix_out = 0;

void setup() {
    startMozzi();
    
}

void updateControl() {
    
}

AudioOutput updateAudio() {
    node_s1_out = oscil_s1.next();
    // Control logic moved to audio loop for node s1
    oscil_s1.setFreq((float)220);
    node_s2_out = oscil_s2.next();
    // Control logic moved to audio loop for node s2
    oscil_s2.setFreq((float)220.5);
    node_mix_out = ((node_s1_out + node_s2_out) >> 1);
    return MonoOutput::from8Bit(0);
}

void loop() {
    audioHook();
}
