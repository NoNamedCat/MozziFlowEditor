#define MOZZI_AUDIO_CHANNELS MOZZI_MONO
#define MOZZI_AUDIO_MODE MOZZI_OUTPUT_PWM

// MOZZIFLOW v111.0 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <FixMath.h>
#include <Metronome.h>
#include <tables/saw2048_int8.h>
#include <ReverbTank.h>

// GLOBALS
long node_metro_out = 0;
Metronome mozzimetronome_metro; float mozzimetronome_metro_lastbpm = 0;
long node_seq_out = 0;
long node_seq_index = 0;
byte mozzisequencer16_seq_i=0; bool mozzisequencer16_seq_l=0;
long node_osc_out = 0;
Oscil<SAW2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_osc(SAW2048_DATA); float last_f_osc=0;
long node_rev_out = 0;
ReverbTank mozzireverb_rev;
long node_norm_out = 0;
long node_out_out = 0;

void setup() {
    startMozzi();
    mozzimetronome_metro.start();
}

void updateControl() {
    // Parameter update for audio node metro
        if(mozzimetronome_metro_lastbpm != (float)(long)120) { mozzimetronome_metro.setBPM((float)(long)120); mozzimetronome_metro_lastbpm = (float)(long)120;}
        node_metro_out = mozzimetronome_metro.ready() ? 255 : 0;
    // Parameter update for audio node seq
        if((long)node_metro_out>0 && !mozzisequencer16_seq_l){ mozzisequencer16_seq_i++; if(mozzisequencer16_seq_i >= 16) mozzisequencer16_seq_i=0; mozzisequencer16_seq_l=1; } else if((long)node_metro_out==0) { mozzisequencer16_seq_l=0; }
        int mozzisequencer16_seq_arr[16] = {(int)(long)440,(int)(long)0,(int)(long)880,(int)(long)0,(int)(long)659,(int)(long)0,(int)(long)0,(int)(long)0,(int)(long)0,(int)(long)0,(int)(long)0,(int)(long)0,(int)(long)0,(int)(long)0,(int)(long)0,(int)(long)0};
        node_seq_index = mozzisequencer16_seq_i;
        node_seq_out = mozzisequencer16_seq_arr[mozzisequencer16_seq_i];
    // Parameter update for audio node osc
        if(last_f_osc != (float)node_seq_out){ oscil_osc.setFreq((float)node_seq_out); last_f_osc = (float)node_seq_out; }
}

AudioOutput updateAudio() {
    node_osc_out = oscil_osc.next();
    node_rev_out = (((long)node_osc_out * (long)(255 - (int)100)) + ((long)mozzireverb_rev.next((int)(long)node_osc_out) * (long)100));
    node_norm_out = ((long)node_rev_out >> (int)8);
    return MonoOutput::from8Bit((int)node_norm_out);
}

void loop() {
    audioHook();
}
