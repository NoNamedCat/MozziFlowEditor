// MOZZIFLOW v110.9 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <Phasor.h>

// GLOBALS
long node_ph1_out = 0;
Phasor<MOZZI_AUDIO_RATE> phasor_ph1;
long node_ph2_out = 0;
Phasor<MOZZI_AUDIO_RATE> phasor_ph2;
long node_sub_out = 0;
long node_out_out = 0;

void setup() {
    startMozzi();
    
}

void updateControl() {
    
}

AudioOutput updateAudio() {
    node_ph1_out = phasor_ph1.next();
    // Control logic moved to audio loop for node ph1
    phasor_ph1.setFreq((float)55);
    node_ph2_out = phasor_ph2.next();
    // Control logic moved to audio loop for node ph2
    phasor_ph2.setFreq((float)55.2);
    node_sub_out = (int)node_ph1_out - (int)node_ph2_out;
    return MonoOutput::from8Bit((int)node_sub_out);
}

void loop() {
    audioHook();
}
