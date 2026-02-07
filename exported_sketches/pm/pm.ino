#define MOZZI_AUDIO_CHANNELS MOZZI_MONO
#define MOZZI_AUDIO_MODE MOZZI_OUTPUT_PWM

// MOZZIFLOW v111.0 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <FixMath.h>
#include <tables/sin2048_int8.h>

// GLOBALS
long node_mod_out = 0;
Oscil<SIN2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_mod(SIN2048_DATA); float last_f_mod=0;
long node_gain_out = 0;
long node_car_out = 0;
Oscil<SIN2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_car(SIN2048_DATA); float last_f_car=0;
long node_out_out = 0;

void setup() {
    startMozzi();
    
}

void updateControl() {
    // Parameter update for audio node mod
        if(last_f_mod != (float)5){ oscil_mod.setFreq((float)5); last_f_mod = (float)5; }
    // Parameter update for audio node car
        if(last_f_car != (float)220){ oscil_car.setFreq((float)220); last_f_car = (float)220; }
}

AudioOutput updateAudio() {
    node_mod_out = oscil_mod.next();
    node_gain_out = ((long)node_mod_out * (long)10000);
    node_car_out = oscil_car.phMod((int)node_gain_out);
    return MonoOutput::from8Bit((int)node_car_out);
}

void loop() {
    audioHook();
}
