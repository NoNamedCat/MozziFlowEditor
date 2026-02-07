#define MOZZI_AUDIO_CHANNELS MOZZI_MONO
#define MOZZI_AUDIO_MODE MOZZI_OUTPUT_PWM

// MOZZIFLOW v111.0 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <FixMath.h>
#include <Metronome.h>
#include <mozzi_rand.h>
#include <ADSR.h>

// GLOBALS
long node_metro_out = 0;
Metronome mozzimetronome_metro; float mozzimetronome_metro_lastbpm = 0;
long node_noise_out = 0;
long node_env_out = 0;
ADSR<MOZZI_CONTROL_RATE, MOZZI_CONTROL_RATE, uint16_t> mozziadsr_env; bool mozziadsr_env_l=0;
long node_vca_out = 0;
long node_norm_out = 0;
long node_out_out = 0;

void setup() {
    startMozzi();
    mozzimetronome_metro.start();
    mozziadsr_env.setADLevels((uint8_t)(long)255, (uint8_t)(long)0); mozziadsr_env.setTimes((unsigned int)(long)0, (unsigned int)(long)60, 65535, (unsigned int)(long)50);
}

void updateControl() {
    if(mozzimetronome_metro_lastbpm != (float)(long)120) { mozzimetronome_metro.setBPM((float)(long)120); mozzimetronome_metro_lastbpm = (float)(long)120;}
        node_metro_out = mozzimetronome_metro.ready() ? 255 : 0;
    bool mozziadsr_env_tr=(long)node_metro_out>0;
        if(mozziadsr_env_tr && !mozziadsr_env_l){ mozziadsr_env.noteOn(); } else if(!mozziadsr_env_tr && mozziadsr_env_l){ mozziadsr_env.noteOff(); }
        mozziadsr_env_l=mozziadsr_env_tr;
        mozziadsr_env.update();
        node_env_out = (long)mozziadsr_env.next();
}

AudioOutput updateAudio() {
    node_noise_out = rand((int)256) - 128;
    node_vca_out = ((long)node_noise_out * (long)node_env_out);
    node_norm_out = ((long)node_vca_out >> (int)8);
    return MonoOutput::from8Bit((int)node_norm_out);
}

void loop() {
    audioHook();
}
