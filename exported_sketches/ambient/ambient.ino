#define MOZZI_AUDIO_CHANNELS MOZZI_STEREO
#define MOZZI_AUDIO_MODE MOZZI_OUTPUT_PWM

// MOZZIFLOW v111.0 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <FixMath.h>
#include <tables/sin2048_int8.h>
#include <tables/saw2048_int8.h>
#include <ReverbTank.h>

// GLOBALS
long node_lfo1_out = 0;
Oscil<SIN2048_NUM_CELLS, MOZZI_CONTROL_RATE> oscil_lfo1(SIN2048_DATA); float last_f_lfo1=0;
long node_map1_out = 0;
long node_saw1_out = 0;
Oscil<SAW2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_saw1(SAW2048_DATA); float last_f_saw1=0;
long node_rev_out = 0;
ReverbTank mozzireverb_rev;
long node_norm_out = 0;
long node_out_out = 0;

void setup() {
    startMozzi();
    
}

void updateControl() {
    if(last_f_lfo1 != (float)0.1){ oscil_lfo1.setFreq((float)0.1); last_f_lfo1 = (float)0.1; }
    // Forced downsample for node lfo1
        node_lfo1_out = oscil_lfo1.next();
    node_map1_out = ((((long)node_lfo1_out - (long)0) * ((long)800 - (long)200)) / ((long)255 - (long)0) + (long)200);
    // Parameter update for audio node saw1
        if(last_f_saw1 != (float)node_map1_out){ oscil_saw1.setFreq((float)node_map1_out); last_f_saw1 = (float)node_map1_out; }
}

AudioOutput updateAudio() {
    node_saw1_out = oscil_saw1.next();
    node_rev_out = (((long)node_saw1_out * (long)(255 - (int)128)) + ((long)mozzireverb_rev.next((int)(long)node_saw1_out) * (long)128));
    node_norm_out = ((long)node_rev_out >> (int)8);
    return StereoOutput::from8Bit((int)node_norm_out, (int)node_norm_out);
}

void loop() {
    audioHook();
}
