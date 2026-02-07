#define MOZZI_AUDIO_CHANNELS MOZZI_MONO
#define MOZZI_AUDIO_MODE MOZZI_OUTPUT_PWM

// MOZZIFLOW v111.0 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <FixMath.h>
#include <tables/sin2048_int8.h>
#include <mozzi_midi.h>

// GLOBALS
long node_lfo_out = 0;
Oscil<SIN2048_NUM_CELLS, MOZZI_CONTROL_RATE> oscil_lfo(SIN2048_DATA); float last_f_lfo=0;
long node_mapper_out = 0;
long node_mtof_out = 0;
long node_osc_out = 0;
Oscil<SIN2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_osc(SIN2048_DATA); float last_f_osc=0;
long node_out_out = 0;

void setup() {
    startMozzi();
    
}

void updateControl() {
    if(last_f_lfo != (float)0.2){ oscil_lfo.setFreq((float)0.2); last_f_lfo = (float)0.2; }
    // Forced downsample for node lfo
        node_lfo_out = oscil_lfo.next();
    node_mapper_out = ((((long)node_lfo_out - (long)-128) * ((long)72 - (long)36)) / ((long)127 - (long)-128) + (long)36);
    node_mtof_out = mtof((uint8_t)(long)node_mapper_out);
    // Parameter update for audio node osc
        if(last_f_osc != (float)node_mtof_out){ oscil_osc.setFreq((float)node_mtof_out); last_f_osc = (float)node_mtof_out; }
}

AudioOutput updateAudio() {
    node_osc_out = oscil_osc.next();
    return MonoOutput::from8Bit((int)node_osc_out);
}

void loop() {
    audioHook();
}
