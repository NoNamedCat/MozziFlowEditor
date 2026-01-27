// MOZZIFLOW v110.9 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <Metronome.h>
#include <mozzi_rand.h>
#include <ADSR.h>

// GLOBALS
long node_metro_out = 0;
Metronome mozzimetronome_metro; float mozzimetronome_metro_lastbpm = 0;
long node_noise_out = 0;
long node_adsr_out = 0;
ADSR<MOZZI_CONTROL_RATE, MOZZI_AUDIO_RATE> mozziadsr_adsr; bool mozziadsr_adsr_l=0;
long node_vca_out = 0;
long node_out_out = 0;

void setup() {
    startMozzi();
    mozzimetronome_metro.start();
    mozziadsr_adsr.setADLevels((uint8_t)255, (uint8_t)128); mozziadsr_adsr.setTimes((unsigned int)0, (unsigned int)60, 65535, (unsigned int)200);
}

void updateControl() {
    
}

AudioOutput updateAudio() {
    // Control logic moved to audio loop for node metro
    if(mozzimetronome_metro_lastbpm != (float)120) { mozzimetronome_metro.setBPM((float)120); mozzimetronome_metro_lastbpm = (float)120;}
        node_metro_out = mozzimetronome_metro.ready() ? 255 : 0;
    node_noise_out = rand((int)256) - 128;
    // Control logic moved to audio loop for node adsr
    bool mozziadsr_adsr_tr=(int)node_metro_out>0;
        if(mozziadsr_adsr_tr && !mozziadsr_adsr_l){ mozziadsr_adsr.noteOn(); } else if(!mozziadsr_adsr_tr && mozziadsr_adsr_l){ mozziadsr_adsr.noteOff(); }
        mozziadsr_adsr_l=mozziadsr_adsr_tr;
        mozziadsr_adsr.update();
        node_adsr_out = mozziadsr_adsr.next();
    node_vca_out = (int)((long)node_noise_out * node_adsr_out >> 8);
    return MonoOutput::from8Bit((int)node_vca_out);
}

void loop() {
    audioHook();
}
