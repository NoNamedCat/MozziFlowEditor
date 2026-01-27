// MOZZIFLOW v110.9 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <tables/saw2048_int8.h>
#include <Metronome.h>
#include <ADSR.h>
#include <AudioDelay.h>

// GLOBALS
long node_s1_out = 0;
Oscil<SAW2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_s1(SAW2048_DATA);
long node_metro_out = 0;
Metronome mozzimetronome_metro; float mozzimetronome_metro_lastbpm = 0;
long node_adsr_out = 0;
ADSR<MOZZI_CONTROL_RATE, MOZZI_AUDIO_RATE> mozziadsr_adsr; bool mozziadsr_adsr_l=0;
long node_del_out = 0;
AudioDelay<256> mozziaudiodelay_del;
long node_out_out = 0;

void setup() {
    startMozzi();
    mozzimetronome_metro.start();
    mozziadsr_adsr.setADLevels((uint8_t)255, (uint8_t)128); mozziadsr_adsr.setTimes((unsigned int)50, (unsigned int)100, 65535, (unsigned int)200);
}

void updateControl() {
    
}

AudioOutput updateAudio() {
    node_s1_out = oscil_s1.next();
    // Control logic moved to audio loop for node s1
    oscil_s1.setFreq((float)110);
    // Control logic moved to audio loop for node metro
    if(mozzimetronome_metro_lastbpm != (float)60) { mozzimetronome_metro.setBPM((float)60); mozzimetronome_metro_lastbpm = (float)60;}
        node_metro_out = mozzimetronome_metro.ready() ? 255 : 0;
    // Control logic moved to audio loop for node adsr
    bool mozziadsr_adsr_tr=(int)node_metro_out>0;
        if(mozziadsr_adsr_tr && !mozziadsr_adsr_l){ mozziadsr_adsr.noteOn(); } else if(!mozziadsr_adsr_tr && mozziadsr_adsr_l){ mozziadsr_adsr.noteOff(); }
        mozziadsr_adsr_l=mozziadsr_adsr_tr;
        mozziadsr_adsr.update();
        node_adsr_out = mozziadsr_adsr.next();
    node_del_out = mozziaudiodelay_del.next((int)node_s1_out, (uint16_t)128);
    return MonoOutput::from8Bit((int)node_del_out);
}

void loop() {
    audioHook();
}
