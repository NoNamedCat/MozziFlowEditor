#define MOZZI_AUDIO_CHANNELS MOZZI_MONO
#define MOZZI_AUDIO_MODE MOZZI_OUTPUT_PWM

// MOZZIFLOW v111.0 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <FixMath.h>
#include <Metronome.h>
#include <mozzi_midi.h>
#include <ADSR.h>
#include <Smooth.h>
#include <tables/saw2048_int8.h>
#include <StateVariable.h>

// GLOBALS
long node_92zp_out = 0;
Metronome mozzimetronome_92zp; float mozzimetronome_92zp_lastbpm = 0;
long node_98hn_out = 0;
long node_98hn_index = 0;
byte mozzisequencer_98hn_i=0; bool mozzisequencer_98hn_l=0;
long node_jr02_out = 0;
long node_640e_out = 0;
ADSR<MOZZI_CONTROL_RATE, MOZZI_CONTROL_RATE, uint16_t> mozziadsr_640e; bool mozziadsr_640e_l=0;
long node_o6yn_out = 0;
long node_qpyy_out = 0;
Smooth<long> smooth_qpyy; float smooth_qpyy_last=0;
long node_ev8r_out = 0;
Oscil<SAW2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_ev8r(SAW2048_DATA); float last_f_ev8r=0;
long node_3fyk_out = 0;
StateVariable<LOWPASS> mozzisvf_3fyk; unsigned int last_f_3fyk=0; uint8_t last_r_3fyk=0;
long node_04nw_out = 0;
long node_hjsw_out = 0;
long node_vdku_out = 0;

void setup() {
    startMozzi();
    mozzimetronome_92zp.start();
    mozziadsr_640e.setADLevels((uint8_t)(long)255, (uint8_t)(long)64); mozziadsr_640e.setTimes((unsigned int)(long)5, (unsigned int)(long)180, 65535, (unsigned int)(long)50);
    smooth_qpyy.setSmoothness(0.95f);
}

void updateControl() {
    if(mozzimetronome_92zp_lastbpm != (float)(long)135) { mozzimetronome_92zp.setBPM((float)(long)135); mozzimetronome_92zp_lastbpm = (float)(long)135;}
        node_92zp_out = mozzimetronome_92zp.ready() ? 255 : 0;
    if((long)node_92zp_out>0 && !mozzisequencer_98hn_l){ mozzisequencer_98hn_i++; if(mozzisequencer_98hn_i >= 8) mozzisequencer_98hn_i=0; mozzisequencer_98hn_l=1; } else if((long)node_92zp_out==0) { mozzisequencer_98hn_l=0; }
        int mozzisequencer_98hn_arr[8] = {(int)(long)36,(int)(long)48,(int)(long)36,(int)(long)39,(int)(long)41,(int)(long)36,(int)(long)46,(int)(long)43};
        node_98hn_index = mozzisequencer_98hn_i;
        node_98hn_out = mozzisequencer_98hn_arr[mozzisequencer_98hn_i];
    node_jr02_out = mtof((uint8_t)(long)node_98hn_out);
    bool mozziadsr_640e_tr=(long)node_92zp_out>0;
        if(mozziadsr_640e_tr && !mozziadsr_640e_l){ mozziadsr_640e.noteOn(); } else if(!mozziadsr_640e_tr && mozziadsr_640e_l){ mozziadsr_640e.noteOff(); }
        mozziadsr_640e_l=mozziadsr_640e_tr;
        mozziadsr_640e.update();
        node_640e_out = (long)mozziadsr_640e.next();
    node_o6yn_out = ((((long)node_640e_out - (long)0) * ((long)4000 - (long)400)) / ((long)255 - (long)0) + (long)400);
    node_qpyy_out = smooth_qpyy.next((long)node_o6yn_out);
    // Parameter update for audio node ev8r
        if(last_f_ev8r != (float)node_jr02_out){ oscil_ev8r.setFreq((float)node_jr02_out); last_f_ev8r = (float)node_jr02_out; }
    // Parameter update for audio node 3fyk
        if(last_f_3fyk != (unsigned int)(long)node_qpyy_out){ mozzisvf_3fyk.setCentreFreq((unsigned int)(long)node_qpyy_out); last_f_3fyk=(unsigned int)(long)node_qpyy_out; }
        if(last_r_3fyk != (uint8_t)(long)180){ mozzisvf_3fyk.setResonance((uint8_t)(long)180); last_r_3fyk=(uint8_t)(long)180; }
}

AudioOutput updateAudio() {
    node_ev8r_out = oscil_ev8r.next();
    node_3fyk_out = mozzisvf_3fyk.next((int)(long)node_ev8r_out);
    node_04nw_out = ((long)node_3fyk_out * (long)node_640e_out);
    node_hjsw_out = ((long)node_04nw_out >> (int)8);
    return MonoOutput::from8Bit((int)node_hjsw_out);
}

void loop() {
    audioHook();
}
