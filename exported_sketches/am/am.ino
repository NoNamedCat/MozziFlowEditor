// MOZZIFLOW v110.9 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <tables/sin2048_int8.h>

// GLOBALS
long node_car_out = 0;
Oscil<SIN2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_car(SIN2048_DATA);
long node_mod_out = 0;
Oscil<SIN2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_mod(SIN2048_DATA);
long node_mul_out = 0;
long node_out_out = 0;

void setup() {
    startMozzi();
    
}

void updateControl() {
    
}

AudioOutput updateAudio() {
    node_car_out = oscil_car.next();
    // Control logic moved to audio loop for node car
    oscil_car.setFreq((float)440);
    node_mod_out = oscil_mod.next();
    // Control logic moved to audio loop for node mod
    oscil_mod.setFreq((float)4);
    node_mul_out = ((int)(((long)node_car_out * node_mod_out) >> 8));
    return MonoOutput::from8Bit((int)node_mul_out);
}

void loop() {
    audioHook();
}
