#define MOZZI_AUDIO_CHANNELS MOZZI_MONO
#define MOZZI_AUDIO_MODE MOZZI_OUTPUT_PWM

// MOZZIFLOW v111.0 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <FixMath.h>
#include <tables/sin2048_int8.h>
#include <Smooth.h>
#include <Phasor.h>

// GLOBALS
long node_lfo_out = 0;
Oscil<SIN2048_NUM_CELLS, MOZZI_CONTROL_RATE> oscil_lfo(SIN2048_DATA); float last_f_lfo=0;
long node_mapper_out = 0;
long node_smooth_out = 0;
Smooth<long> smooth_smooth; float smooth_smooth_last=0;
long node_osc_out = 0;
Phasor<MOZZI_AUDIO_RATE> phasor_osc; float last_f_osc=0;
long node_cmp_out = 0;
long node_norm_out = 0;
long node_out_out = 0;

void setup() {
    startMozzi();
    smooth_smooth.setSmoothness(0.95f);
}

void updateControl() {
    if(last_f_lfo != (float)0.5){ oscil_lfo.setFreq((float)0.5); last_f_lfo = (float)0.5; }
    // Forced downsample for node lfo
        node_lfo_out = oscil_lfo.next();
    node_mapper_out = ((((long)node_lfo_out - (long)-128) * ((long)255 - (long)0)) / ((long)127 - (long)-128) + (long)0);
    // Parameter update for audio node smooth
        node_smooth_out = smooth_smooth.next((long)node_mapper_out);
    // Parameter update for audio node osc
        if(last_f_osc != (float)110){ phasor_osc.setFreq((float)110); last_f_osc = (float)110; }
}

AudioOutput updateAudio() {
    node_osc_out = phasor_osc.next();
    node_cmp_out = ((long)node_osc_out > (long)node_smooth_out ? 255 : 0);
    node_norm_out = ((long)node_cmp_out >> (int)1);
    return MonoOutput::from8Bit((int)node_norm_out);
}

void loop() {
    audioHook();
}
