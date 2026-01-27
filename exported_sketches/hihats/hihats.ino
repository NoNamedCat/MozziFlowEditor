// MOZZIFLOW v111.0 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <Metronome.h>
#include <mozzi_rand.h>
#include <StateVariable.h>
#include <Ead.h>

// GLOBALS
long node_clock_out = 0;
Metronome mozzimetronome_clock; float mozzimetronome_clock_lastbpm = 0;
long node_noise_out = 0;
long node_hpf_out = 0;
StateVariable<LOWPASS> mozzisvf_hpf;
long node_env_out = 0;
Ead mozziead_env(MOZZI_AUDIO_RATE);
long node_vca_out = 0;
long node_out_out = 0;

void setup() {
    startMozzi();
    mozzimetronome_clock.start();
}

void updateControl() {
    
}

AudioOutput updateAudio() {
    // Control logic moved to audio loop for node clock
    if(mozzimetronome_clock_lastbpm != (float)(long)240) { mozzimetronome_clock.setBPM((float)(long)240); mozzimetronome_clock_lastbpm = (float)(long)240;}
        node_clock_out = mozzimetronome_clock.ready() ? 255 : 0;
    node_noise_out = rand((int)256) - 128;
    node_hpf_out = mozzisvf_hpf.next((int)(long)node_noise_out);
    // Control logic moved to audio loop for node hpf
    mozzisvf_hpf.setCentreFreq((unsigned int)(long)8000);
        mozzisvf_hpf.setResonance((uint8_t)(long)200);
    node_env_out = mozziead_env.next();
    // Control logic moved to audio loop for node env
    if((long)node_clock_out>0){ mozziead_env.start((unsigned int)(long)20, (unsigned int)(long)100); }
    node_vca_out = ((int)(((long)node_hpf_out * (long)node_env_out) >> 8));
    return MonoOutput::from8Bit((int)node_vca_out);
}

void loop() {
    audioHook();
}
