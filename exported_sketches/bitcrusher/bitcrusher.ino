#define MOZZI_AUDIO_CHANNELS MOZZI_MONO
#define MOZZI_AUDIO_MODE MOZZI_OUTPUT_PWM

// MOZZIFLOW v111.0 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <FixMath.h>
#include <tables/sin2048_int8.h>
#include <Phasor.h>

// GLOBALS
long node_src_out = 0;
Oscil<SIN2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_src(SIN2048_DATA); float last_f_src=0;
long node_rate_lfo_out = 0;
Phasor<MOZZI_CONTROL_RATE> phasor_rate_lfo; float last_f_rate_lfo=0;
long node_mapper_out = 0;
long node_crush_out = 0;
long node_out_out = 0;

void setup() {
    startMozzi();
    
}

void updateControl() {
    // Parameter update for audio node src
        if(last_f_src != (float)110){ oscil_src.setFreq((float)110); last_f_src = (float)110; }
    if(last_f_rate_lfo != (float)2){ phasor_rate_lfo.setFreq((float)2); last_f_rate_lfo = (float)2; }
    // Forced downsample for node rate_lfo
        node_rate_lfo_out = phasor_rate_lfo.next();
    node_mapper_out = ((((long)node_rate_lfo_out - (long)0) * ((long)6 - (long)1)) / ((long)255 - (long)0) + (long)1);
}

AudioOutput updateAudio() {
    node_src_out = oscil_src.next();
    node_crush_out = ((long)node_src_out & (0xFFFFFFFF << (int)node_mapper_out));
    return MonoOutput::from8Bit((int)node_crush_out);
}

void loop() {
    audioHook();
}
