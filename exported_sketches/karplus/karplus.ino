// MOZZIFLOW v111.0 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <Metronome.h>
#include <mozzi_rand.h>
#include <ADSR.h>

// GLOBALS
long node_metro_out = 0;
Metronome mozzimetronome_metro; float mozzimetronome_metro_lastbpm = 0;
long node_noise_out = 0;
long node_env_out = 0;
ADSR<MOZZI_CONTROL_RATE, MOZZI_AUDIO_RATE> mozziadsr_env; bool mozziadsr_env_l=0;
long node_vca_out = 0;
long node_out_out = 0;

void setup() {
    startMozzi();
    mozzimetronome_metro.start();
    mozziadsr_env.setADLevels((uint8_t)(long)255, (uint8_t)(long)0); mozziadsr_env.setTimes((unsigned int)(long)0, (unsigned int)(long)60, 65535, (unsigned int)(long)50);
}

void updateControl() {
    
}

AudioOutput updateAudio() {
    // Control logic moved to audio loop for node metro
    if(mozzimetronome_metro_lastbpm != (float)(long)120) { mozzimetronome_metro.setBPM((float)(long)120); mozzimetronome_metro_lastbpm = (float)(long)120;}
        node_metro_out = mozzimetronome_metro.ready() ? 255 : 0;
    node_noise_out = rand((int)256) - 128;
    // Control logic moved to audio loop for node env
    bool mozziadsr_env_tr=(long)node_metro_out>0;
        if(mozziadsr_env_tr && !mozziadsr_env_l){ mozziadsr_env.noteOn(); } else if(!mozziadsr_env_tr && mozziadsr_env_l){ mozziadsr_env.noteOff(); }
        mozziadsr_env_l=mozziadsr_env_tr;
        mozziadsr_env.update();
        node_env_out = mozziadsr_env.next();
    node_vca_out = ((int)(((long)node_noise_out * (long)node_env_out) >> 8));
    return MonoOutput::from8Bit((int)node_vca_out);
}

void loop() {
    audioHook();
}
