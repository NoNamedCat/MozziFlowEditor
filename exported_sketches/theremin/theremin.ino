#define MOZZI_AUDIO_CHANNELS MOZZI_MONO
#define MOZZI_AUDIO_MODE MOZZI_OUTPUT_PWM

// MOZZIFLOW v111.0 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <FixMath.h>
#include <tables/sin2048_int8.h>
#include <Smooth.h>

// GLOBALS
long node_p1_out = 0;
Oscil<SIN2048_NUM_CELLS, MOZZI_CONTROL_RATE> oscil_p1(SIN2048_DATA);
long node_mapper_out = 0;
long node_smooth_out = 0;
Smooth<long> smooth_smooth; float smooth_smooth_last=0;
long node_osc_out = 0;
Oscil<SIN2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_osc(SIN2048_DATA); float last_f_osc=0;
long node_out_out = 0;

void setup() {
    startMozzi();
    smooth_smooth.setSmoothness(0.95f);
}

void updateControl() {
    oscil_p1.setFreq((float)0.1);
        node_p1_out = oscil_p1.next();
    node_mapper_out = ((((long)node_p1_out - (long)-128) * ((long)1000 - (long)200)) / ((long)127 - (long)-128) + (long)200);
    node_smooth_out = smooth_smooth.next((long)node_mapper_out);
    // Parameter update for audio node osc
        if(last_f_osc != (float)node_smooth_out){ oscil_osc.setFreq((float)node_smooth_out); last_f_osc = (float)node_smooth_out; }
}

AudioOutput updateAudio() {
    node_osc_out = oscil_osc.next();
    return MonoOutput::from8Bit((int)node_osc_out);
}

void loop() {
    audioHook();
}
