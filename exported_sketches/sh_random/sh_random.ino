#define MOZZI_AUDIO_CHANNELS MOZZI_MONO
#define MOZZI_AUDIO_MODE MOZZI_OUTPUT_PWM

// MOZZIFLOW v111.0 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <FixMath.h>
#include <Metronome.h>
#include <mozzi_rand.h>

// GLOBALS
long node_clock_out = 0;
Metronome mozzimetronome_clock; float mozzimetronome_clock_lastbpm = 0;
long node_noise_out = 0;
long node_sh_out = 0;
long mozzish_sh_val = 0; bool mozzish_sh_l = 0;
long node_vca_out = 0;
long node_norm_out = 0;
long node_out_out = 0;

void setup() {
    startMozzi();
    mozzimetronome_clock.start();
}

void updateControl() {
    // Parameter update for audio node clock
        if(mozzimetronome_clock_lastbpm != (float)(long)120) { mozzimetronome_clock.setBPM((float)(long)120); mozzimetronome_clock_lastbpm = (float)(long)120;}
        node_clock_out = mozzimetronome_clock.ready() ? 255 : 0;
}

AudioOutput updateAudio() {
    node_noise_out = rand((int)256) - 128;
    if((long)node_clock_out > 0 && !mozzish_sh_l){ mozzish_sh_val = (long)node_noise_out; mozzish_sh_l=1; } else if((long)node_clock_out==0){ mozzish_sh_l=0; }
        node_sh_out = mozzish_sh_val;
    node_vca_out = ((long)node_sh_out * (long)128);
    node_norm_out = ((long)node_vca_out >> (int)7);
    return MonoOutput::from8Bit((int)node_norm_out);
}

void loop() {
    audioHook();
}
