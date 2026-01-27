// MOZZIFLOW v111.0 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <Metronome.h>
#include <mozzi_rand.h>

// GLOBALS
long node_clock_out = 0;
Metronome mozzimetronome_clock; float mozzimetronome_clock_lastbpm = 0;
long node_noise_out = 0;
long node_sh_out = 0;
int mozzish_sh_val = 0; bool mozzish_sh_l = 0;
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
    if(mozzimetronome_clock_lastbpm != (float)(long)120) { mozzimetronome_clock.setBPM((float)(long)120); mozzimetronome_clock_lastbpm = (float)(long)120;}
        node_clock_out = mozzimetronome_clock.ready() ? 255 : 0;
    node_noise_out = rand((int)256) - 128;
    if((long)node_clock_out > 0 && !mozzish_sh_l){ mozzish_sh_val = (int)(long)node_noise_out; mozzish_sh_l=1; } else if((long)node_clock_out==0){ mozzish_sh_l=0; }
        node_sh_out = mozzish_sh_val;
    node_vca_out = ((int)(((long)node_sh_out * (long)128) >> 8));
    return MonoOutput::from8Bit((int)node_vca_out);
}

void loop() {
    audioHook();
}
