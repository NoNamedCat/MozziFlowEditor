#define MOZZI_AUDIO_CHANNELS MOZZI_MONO
#define MOZZI_AUDIO_MODE MOZZI_OUTPUT_PWM

// MOZZIFLOW v111.0 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <FixMath.h>
#include <tables/saw2048_int8.h>

// GLOBALS
long node_s1_out = 0;
Oscil<SAW2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_s1(SAW2048_DATA); float last_f_s1=0;
long node_s2_out = 0;
Oscil<SAW2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_s2(SAW2048_DATA); float last_f_s2=0;
long node_mix_out = 0;
long node_norm_out = 0;
long node_out_out = 0;

void setup() {
    startMozzi();
    
}

void updateControl() {
    // Parameter update for audio node s1
        if(last_f_s1 != (float)220){ oscil_s1.setFreq((float)220); last_f_s1 = (float)220; }
    // Parameter update for audio node s2
        if(last_f_s2 != (float)220.5){ oscil_s2.setFreq((float)220.5); last_f_s2 = (float)220.5; }
}

AudioOutput updateAudio() {
    node_s1_out = oscil_s1.next();
    node_s2_out = oscil_s2.next();
    node_mix_out = ((long)node_s1_out + (long)node_s2_out);
    node_norm_out = ((long)node_mix_out >> (int)1);
    return MonoOutput::from8Bit((int)node_norm_out);
}

void loop() {
    audioHook();
}
