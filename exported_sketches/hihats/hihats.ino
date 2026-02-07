#define MOZZI_AUDIO_CHANNELS MOZZI_MONO
#define MOZZI_AUDIO_MODE MOZZI_OUTPUT_PWM

// MOZZIFLOW v111.0 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <FixMath.h>
#include <Metronome.h>
#include <mozzi_rand.h>
#include <StateVariable.h>
#include <Ead.h>

// GLOBALS
long node_clock_out = 0;
Metronome mozzimetronome_clock; float mozzimetronome_clock_lastbpm = 0;
long node_noise_out = 0;
long node_hpf_out = 0;
StateVariable<HIGHPASS> mozzisvf_hpf; unsigned int last_f_hpf=0; uint8_t last_r_hpf=0;
long node_env_out = 0;
Ead mozziead_env(MOZZI_AUDIO_RATE); bool mozziead_env_last = 0;
long node_vca_out = 0;
long node_norm_out = 0;
long node_out_out = 0;

void setup() {
    startMozzi();
    mozzimetronome_clock.start();
}

void updateControl() {
    // Parameter update for audio node clock
        if(mozzimetronome_clock_lastbpm != (float)(long)240) { mozzimetronome_clock.setBPM((float)(long)240); mozzimetronome_clock_lastbpm = (float)(long)240;}
        node_clock_out = mozzimetronome_clock.ready() ? 255 : 0;
    // Parameter update for audio node hpf
        if(last_f_hpf != (unsigned int)(long)8000){ mozzisvf_hpf.setCentreFreq((unsigned int)(long)8000); last_f_hpf=(unsigned int)(long)8000; }
        if(last_r_hpf != (uint8_t)(long)200){ mozzisvf_hpf.setResonance((uint8_t)(long)200); last_r_hpf=(uint8_t)(long)200; }
}

AudioOutput updateAudio() {
    node_noise_out = rand((int)256) - 128;
    node_hpf_out = mozzisvf_hpf.next((int)(long)node_noise_out);
    bool mozziead_env_trig = (long)node_clock_out>0;
        if(mozziead_env_trig && !mozziead_env_last){ mozziead_env.start((unsigned int)(long)20, (unsigned int)(long)100); }
        mozziead_env_last = mozziead_env_trig;
        node_env_out = (long)mozziead_env.next();
    node_vca_out = ((long)node_hpf_out * (long)node_env_out);
    node_norm_out = ((long)node_vca_out >> (int)8);
    return MonoOutput::from8Bit((int)node_norm_out);
}

void loop() {
    audioHook();
}
