// MOZZIFLOW v110.9 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
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
Oscil<SIN2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_osc(SIN2048_DATA);
long node_env_out = 0;
Ead mozziead_env(MOZZI_AUDIO_RATE);
long node_vca_out = 0;
long node_out_out = 0;

void setup() {
    startMozzi();
    mozzimetronome_clock.start();
}

void updateControl() {
    
}

AudioOutput updateAudio() {
    // Control logic moved to audio loop for node clock
    if(mozzimetronome_clock_lastbpm != (float)240) { mozzimetronome_clock.setBPM((float)240); mozzimetronome_clock_lastbpm = (float)240;}
        node_clock_out = mozzimetronome_clock.ready() ? 255 : 0;
    // Control logic moved to audio loop for node cnt1
    if((int)node_clock_out>0 && !mozzicounter_cnt1_ul){ mozzicounter_cnt1_c++; mozzicounter_cnt1_ul=1; } else if((int)node_clock_out==0){ mozzicounter_cnt1_ul=0; }
        if((int)0>0 && !mozzicounter_cnt1_dl){ mozzicounter_cnt1_c--; mozzicounter_cnt1_dl=1; } else if((int)0==0){ mozzicounter_cnt1_dl=0; }
        if(mozzicounter_cnt1_c > (int)3) mozzicounter_cnt1_c = 0; if(mozzicounter_cnt1_c < 0) mozzicounter_cnt1_c = (int)3;
        node_cnt1_out = mozzicounter_cnt1_c;
    // Control logic moved to audio loop for node rout
    node_rout_out0 = ( (int)node_cnt1_out == 0 ) ? (int)node_clock_out : 0;
        node_rout_out1 = ( (int)node_cnt1_out == 1 ) ? (int)node_clock_out : 0;
        node_rout_out2 = ( (int)node_cnt1_out == 2 ) ? (int)node_clock_out : 0;
        node_rout_out3 = ( (int)node_cnt1_out == 3 ) ? (int)node_clock_out : 0;
    node_osc_out = oscil_osc.next();
    // Control logic moved to audio loop for node osc
    oscil_osc.setFreq((float)60);
    node_env_out = mozziead_env.next();
    // Control logic moved to audio loop for node env
    if((int)node_rout_out0>0){ mozziead_env.start((unsigned int)5, (unsigned int)150); }
    node_vca_out = (int)((long)node_osc_out * node_env_out >> 8);
    return MonoOutput::from8Bit((int)node_vca_out);
}

void loop() {
    audioHook();
}
