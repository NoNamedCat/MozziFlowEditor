// MOZZIFLOW v110.9 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <PDResonant.h>

// GLOBALS
long node_v1_out = 0;
PDResonant pdresonant_v1;
long node_out_out = 0;

void setup() {
    startMozzi();
    
}

void updateControl() {
    
}

AudioOutput updateAudio() {
    node_v1_out = pdresonant_v1.next();
    // Control logic moved to audio loop for node v1
    pdresonant_v1.update();
    return MonoOutput::from8Bit((int)node_v1_out);
}

void loop() {
    audioHook();
}
