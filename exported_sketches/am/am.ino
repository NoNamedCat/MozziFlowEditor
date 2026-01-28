#define MOZZI_AUDIO_CHANNELS MOZZI_MONO
#define MOZZI_AUDIO_MODE MOZZI_OUTPUT_PWM

// MOZZIFLOW v111.0 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <FixMath.h>
#include <tables/sin2048_int8.h>
#include <Smooth.h>

// GLOBALS
long node_mod_out = 0;
Oscil<SIN2048_NUM_CELLS, MOZZI_CONTROL_RATE> oscil_mod(SIN2048_DATA);
long node_smooth_out = 0;
Smooth<long> smooth_smooth; float smooth_smooth_last=0;
long node_car_out = 0;
Oscil<SIN2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_car(SIN2048_DATA); float last_f_car=0;
long node_mul_out = 0;
long node_norm_out = 0;
long node_out_out = 0;

void setup() {
    startMozzi();
    smooth_smooth.setSmoothness(0.9f);
}

void updateControl() {
    oscil_mod.setFreq((float)4);
        node_mod_out = oscil_mod.next();
    node_smooth_out = smooth_smooth.next((long)node_mod_out);
    // Parameter update for audio node car
        if(last_f_car != (float)440){ oscil_car.setFreq((float)440); last_f_car = (float)440; }
}

AudioOutput updateAudio() {
    node_car_out = oscil_car.next();
    node_mul_out = ((long)node_car_out * (long)node_smooth_out);
    node_norm_out = ((long)node_mul_out >> (int)7);
    return MonoOutput::from8Bit((int)node_norm_out);
}

void loop() {
    audioHook();
}
