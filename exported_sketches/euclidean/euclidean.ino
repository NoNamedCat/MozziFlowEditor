#define MOZZI_AUDIO_CHANNELS MOZZI_MONO
#define MOZZI_AUDIO_MODE MOZZI_OUTPUT_PWM

// MOZZIFLOW v111.0 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <FixMath.h>
#include <Metronome.h>
#include <tables/sin2048_int8.h>
#include <Ead.h>

// GLOBALS
long node_clock_out = 0;
Metronome mozzimetronome_clock; float mozzimetronome_clock_lastbpm = 0;
long node_cnt1_out = 0;
int mozzicounter_cnt1_c = 0; bool mozzicounter_cnt1_ul = 0; bool mozzicounter_cnt1_dl = 0;
long node_rout_out0 = 0;
long node_rout_out1 = 0;
long node_rout_out2 = 0;
long node_rout_out3 = 0;
long node_rout_out = 0;
long node_osc_out = 0;
Oscil<SIN2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_osc(SIN2048_DATA); float last_f_osc=0;
long node_env_out = 0;
Ead mozziead_env(MOZZI_AUDIO_RATE); bool mozziead_env_last = 0;
long node_vca_out = 0;
long node_norm_out = 0;
long node_out_out = 0;

void setup() {
    startMozzi();
    mozzimetronome_clock.start();
}

void updateControl() {
    // Parameter update for audio node clock
        if(mozzimetronome_clock_lastbpm != (float)(long)240) { mozzimetronome_clock.setBPM((float)(long)240); mozzimetronome_clock_lastbpm = (float)(long)240;}
        node_clock_out = mozzimetronome_clock.ready() ? 255 : 0;
    // Parameter update for audio node cnt1
        if((long)node_clock_out>0 && !mozzicounter_cnt1_ul){ mozzicounter_cnt1_c++; mozzicounter_cnt1_ul=1; } else if((long)node_clock_out==0){ mozzicounter_cnt1_ul=0; }
        if((long)0>0 && !mozzicounter_cnt1_dl){ mozzicounter_cnt1_c--; mozzicounter_cnt1_dl=1; } else if((long)0==0){ mozzicounter_cnt1_dl=0; }
        if(mozzicounter_cnt1_c > (long)3) mozzicounter_cnt1_c = 0; if(mozzicounter_cnt1_c < 0) mozzicounter_cnt1_c = (long)3;
        node_cnt1_out = mozzicounter_cnt1_c;
    // Parameter update for audio node rout
        node_rout_out0 = ( (long)node_cnt1_out == 0 ) ? (long)node_clock_out : 0;
        node_rout_out1 = ( (long)node_cnt1_out == 1 ) ? (long)node_clock_out : 0;
        node_rout_out2 = ( (long)node_cnt1_out == 2 ) ? (long)node_clock_out : 0;
        node_rout_out3 = ( (long)node_cnt1_out == 3 ) ? (long)node_clock_out : 0;
    // Parameter update for audio node osc
        if(last_f_osc != (float)60){ oscil_osc.setFreq((float)60); last_f_osc = (float)60; }
}

AudioOutput updateAudio() {
    node_osc_out = oscil_osc.next();
    bool mozziead_env_trig = (long)node_rout_out0>0;
        if(mozziead_env_trig && !mozziead_env_last){ mozziead_env.start((unsigned int)(long)5, (unsigned int)(long)150); }
        mozziead_env_last = mozziead_env_trig;
        node_env_out = (long)mozziead_env.next();
    node_vca_out = ((long)node_osc_out * (long)node_env_out);
    node_norm_out = ((long)node_vca_out >> (int)8);
    return MonoOutput::from8Bit((int)node_norm_out);
}

void loop() {
    audioHook();
}
