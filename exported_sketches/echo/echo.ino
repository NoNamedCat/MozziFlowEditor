#define MOZZI_AUDIO_CHANNELS MOZZI_MONO
#define MOZZI_AUDIO_MODE MOZZI_OUTPUT_PWM

// MOZZIFLOW v111.0 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <FixMath.h>
#include <Metronome.h>
#include <ADSR.h>
#include <Smooth.h>
#include <tables/saw2048_int8.h>
#include <AudioDelay.h>

// GLOBALS
long node_metro_out = 0;
Metronome mozzimetronome_metro; float mozzimetronome_metro_lastbpm = 0;
long node_adsr_out = 0;
ADSR<MOZZI_CONTROL_RATE, MOZZI_CONTROL_RATE, uint16_t> mozziadsr_adsr; bool mozziadsr_adsr_l=0;
long node_smooth_out = 0;
Smooth<long> smooth_smooth; float smooth_smooth_last=0;
long node_s1_out = 0;
Oscil<SAW2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_s1(SAW2048_DATA); float last_f_s1=0;
long node_vca_out = 0;
long node_norm_out = 0;
long node_del_out = 0;
AudioDelay<256> mozziaudiodelay_del;
long node_out_out = 0;

void setup() {
    startMozzi();
    mozzimetronome_metro.start();
    mozziadsr_adsr.setADLevels((uint8_t)(long)255, (uint8_t)(long)128); mozziadsr_adsr.setTimes((unsigned int)(long)50, (unsigned int)(long)100, 65535, (unsigned int)(long)200);
    smooth_smooth.setSmoothness(0.95f);
}

void updateControl() {
    if(mozzimetronome_metro_lastbpm != (float)(long)60) { mozzimetronome_metro.setBPM((float)(long)60); mozzimetronome_metro_lastbpm = (float)(long)60;}
        node_metro_out = mozzimetronome_metro.ready() ? 255 : 0;
    bool mozziadsr_adsr_tr=(long)node_metro_out>0;
        if(mozziadsr_adsr_tr && !mozziadsr_adsr_l){ mozziadsr_adsr.noteOn(); } else if(!mozziadsr_adsr_tr && mozziadsr_adsr_l){ mozziadsr_adsr.noteOff(); }
        mozziadsr_adsr_l=mozziadsr_adsr_tr;
        mozziadsr_adsr.update();
        node_adsr_out = (long)mozziadsr_adsr.next();
    // Parameter update for audio node smooth
        node_smooth_out = smooth_smooth.next((long)node_adsr_out);
    // Parameter update for audio node s1
        if(last_f_s1 != (float)110){ oscil_s1.setFreq((float)110); last_f_s1 = (float)110; }
}

AudioOutput updateAudio() {
    node_s1_out = oscil_s1.next();
    node_vca_out = ((long)node_s1_out * (long)node_smooth_out);
    node_norm_out = ((long)node_vca_out >> (int)8);
    node_del_out = mozziaudiodelay_del.next((int)(long)node_norm_out, (uint16_t)(long)128);
    return MonoOutput::from8Bit((int)node_del_out);
}

void loop() {
    audioHook();
}
