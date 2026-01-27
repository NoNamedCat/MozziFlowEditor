// MOZZIFLOW v111.0 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <tables/sin2048_int8.h>

// GLOBALS
long node_mod_out = 0;
Oscil<SIN2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_mod(SIN2048_DATA);
long node_gain_out = 0;
long node_car_out = 0;
Oscil<SIN2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_car(SIN2048_DATA);
long node_out_out = 0;

void setup() {
    startMozzi();
    
}

void updateControl() {
    
}

AudioOutput updateAudio() {
    node_mod_out = oscil_mod.next();
    // Control logic moved to audio loop for node mod
    oscil_mod.setFreq((float)(long)5);
    node_gain_out = ((int)(((long)node_mod_out * (long)128) >> 8));
    node_car_out = oscil_car.phMod((long)node_gain_out);
    // Control logic moved to audio loop for node car
    oscil_car.setFreq((float)(long)220);
    return MonoOutput::from8Bit((int)node_car_out);
}

void loop() {
    audioHook();
}
