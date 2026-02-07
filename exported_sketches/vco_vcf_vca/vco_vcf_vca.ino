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
#include <StateVariable.h>

// GLOBALS
long node_clock_out = 0;
Metronome mozzimetronome_clock; float mozzimetronome_clock_lastbpm = 0;
long node_adsr_out = 0;
ADSR<MOZZI_CONTROL_RATE, MOZZI_CONTROL_RATE, uint16_t> mozziadsr_adsr; bool mozziadsr_adsr_l=0;
long node_smooth_out = 0;
Smooth<long> smooth_smooth; float smooth_smooth_last=0;
long node_osc_out = 0;
Oscil<SAW2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_osc(SAW2048_DATA); float last_f_osc=0;
long node_filter_out = 0;
StateVariable<LOWPASS> mozzisvf_filter; unsigned int last_f_filter=0; uint8_t last_r_filter=0;
long node_vca_out = 0;
long node_norm_out = 0;
long node_out_out = 0;

void setup() {
    startMozzi();
    mozzimetronome_clock.start();
    mozziadsr_adsr.setADLevels((uint8_t)(long)255, (uint8_t)(long)128); mozziadsr_adsr.setTimes((unsigned int)(long)50, (unsigned int)(long)100, 65535, (unsigned int)(long)200);
    smooth_smooth.setSmoothness(0.95f);
}

void updateControl() {
    if(mozzimetronome_clock_lastbpm != (float)(long)120) { mozzimetronome_clock.setBPM((float)(long)120); mozzimetronome_clock_lastbpm = (float)(long)120;}
        node_clock_out = mozzimetronome_clock.ready() ? 255 : 0;
    bool mozziadsr_adsr_tr=(long)node_clock_out>0;
        if(mozziadsr_adsr_tr && !mozziadsr_adsr_l){ mozziadsr_adsr.noteOn(); } else if(!mozziadsr_adsr_tr && mozziadsr_adsr_l){ mozziadsr_adsr.noteOff(); }
        mozziadsr_adsr_l=mozziadsr_adsr_tr;
        mozziadsr_adsr.update();
        node_adsr_out = (long)mozziadsr_adsr.next();
    // Parameter update for audio node smooth
        node_smooth_out = smooth_smooth.next((long)node_adsr_out);
    // Parameter update for audio node osc
        if(last_f_osc != (float)110){ oscil_osc.setFreq((float)110); last_f_osc = (float)110; }
    // Parameter update for audio node filter
        if(last_f_filter != (unsigned int)(long)node_adsr_out){ mozzisvf_filter.setCentreFreq((unsigned int)(long)node_adsr_out); last_f_filter=(unsigned int)(long)node_adsr_out; }
        if(last_r_filter != (uint8_t)(long)180){ mozzisvf_filter.setResonance((uint8_t)(long)180); last_r_filter=(uint8_t)(long)180; }
}

AudioOutput updateAudio() {
    node_osc_out = oscil_osc.next();
    node_filter_out = mozzisvf_filter.next((int)(long)node_osc_out);
    node_vca_out = ((long)node_filter_out * (long)node_smooth_out);
    node_norm_out = ((long)node_vca_out >> (int)8);
    return MonoOutput::from8Bit((int)node_norm_out);
}

void loop() {
    audioHook();
}
