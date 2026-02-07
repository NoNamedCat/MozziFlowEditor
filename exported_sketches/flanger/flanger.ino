#define MOZZI_AUDIO_CHANNELS MOZZI_MONO
#define MOZZI_AUDIO_MODE MOZZI_OUTPUT_PWM

// MOZZIFLOW v111.0 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <FixMath.h>
#include <tables/sin2048_int8.h>
#include <Smooth.h>
#include <AudioDelay.h>

// GLOBALS
long node_osc_out = 0;
Oscil<SIN2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_osc(SIN2048_DATA); float last_f_osc=0;
long node_lfo_out = 0;
Oscil<SIN2048_NUM_CELLS, MOZZI_CONTROL_RATE> oscil_lfo(SIN2048_DATA); float last_f_lfo=0;
long node_mapper_out = 0;
long node_smooth_out = 0;
Smooth<long> smooth_smooth; float smooth_smooth_last=0;
long node_del_out = 0;
AudioDelay<256> mozziaudiodelay_del;
long node_out_out = 0;

void setup() {
    startMozzi();
    smooth_smooth.setSmoothness(0.98f);
}

void updateControl() {
    // Parameter update for audio node osc
        if(last_f_osc != (float)220){ oscil_osc.setFreq((float)220); last_f_osc = (float)220; }
    if(last_f_lfo != (float)0.2){ oscil_lfo.setFreq((float)0.2); last_f_lfo = (float)0.2; }
    // Forced downsample for node lfo
        node_lfo_out = oscil_lfo.next();
    node_mapper_out = ((((long)node_lfo_out - (long)-128) * ((long)100 - (long)10)) / ((long)127 - (long)-128) + (long)10);
    // Parameter update for audio node smooth
        node_smooth_out = smooth_smooth.next((long)node_mapper_out);
}

AudioOutput updateAudio() {
    node_osc_out = oscil_osc.next();
    node_del_out = mozziaudiodelay_del.next((int)(long)node_osc_out, (uint16_t)(long)node_smooth_out);
    return MonoOutput::from8Bit((int)node_del_out);
}

void loop() {
    audioHook();
}
