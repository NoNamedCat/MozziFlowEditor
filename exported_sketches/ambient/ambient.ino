// MOZZIFLOW v110.9 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <Metronome.h>
#include <ADSR.h>
#include <tables/saw2048_int8.h>
#include <ReverbTank.h>

// GLOBALS
long node_metro_out = 0;
Metronome mozzimetronome_metro; float mozzimetronome_metro_lastbpm = 0;
long node_adsr_out = 0;
ADSR<MOZZI_CONTROL_RATE, MOZZI_AUDIO_RATE> mozziadsr_adsr; bool mozziadsr_adsr_l=0;
long node_saw_out = 0;
Oscil<SAW2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_saw(SAW2048_DATA);
long node_gain_out = 0;
long node_rev_out = 0;
ReverbTank mozzireverb_rev;
long node_out_out = 0;

void setup() {
    startMozzi();
    mozzimetronome_metro.start();
    mozziadsr_adsr.setADLevels((uint8_t)255, (uint8_t)100); mozziadsr_adsr.setTimes((unsigned int)50, (unsigned int)100, 65535, (unsigned int)200);
}

void updateControl() {
    
}

AudioOutput updateAudio() {
    // Control logic moved to audio loop for node metro
    if(mozzimetronome_metro_lastbpm != (float)60) { mozzimetronome_metro.setBPM((float)60); mozzimetronome_metro_lastbpm = (float)60;}
        node_metro_out = mozzimetronome_metro.ready() ? 255 : 0;
    // Control logic moved to audio loop for node adsr
    bool mozziadsr_adsr_tr=(int)node_metro_out>0;
        if(mozziadsr_adsr_tr && !mozziadsr_adsr_l){ mozziadsr_adsr.noteOn(); } else if(!mozziadsr_adsr_tr && mozziadsr_adsr_l){ mozziadsr_adsr.noteOff(); }
        mozziadsr_adsr_l=mozziadsr_adsr_tr;
        mozziadsr_adsr.update();
        node_adsr_out = mozziadsr_adsr.next();
    node_saw_out = oscil_saw.next();
    // Control logic moved to audio loop for node saw
    oscil_saw.setFreq((float)440);
    node_gain_out = ((int)(((long)node_saw_out * node_adsr_out) >> 8));
    node_rev_out = ((int)(((long)node_gain_out * (255 - 150) + (long)mozzireverb_rev.next((int)node_gain_out) * 150) >> 8));
    return MonoOutput::from8Bit((int)node_rev_out);
}

void loop() {
    audioHook();
}
