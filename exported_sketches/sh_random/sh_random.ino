// MOZZIFLOW v110.9 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <mozzi_rand.h>
#include <Metronome.h>
#include <tables/sin2048_int8.h>

// GLOBALS
long node_noise_out = 0;
long node_metro_out = 0;
Metronome mozzimetronome_metro; float mozzimetronome_metro_lastbpm = 0;
long node_sh1_out = 0;
int mozzish_sh1_val = 0; bool mozzish_sh1_l = 0;
long node_osc_out = 0;
Oscil<SIN2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_osc(SIN2048_DATA);
long node_out_out = 0;

void setup() {
    startMozzi();
    mozzimetronome_metro.start();
}

void updateControl() {
    
}

AudioOutput updateAudio() {
    node_noise_out = rand((int)256) - 128;
    // Control logic moved to audio loop for node metro
    if(mozzimetronome_metro_lastbpm != (float)180) { mozzimetronome_metro.setBPM((float)180); mozzimetronome_metro_lastbpm = (float)180;}
        node_metro_out = mozzimetronome_metro.ready() ? 255 : 0;
    if((int)node_metro_out > 0 && !mozzish_sh1_l){ mozzish_sh1_val = (int)node_noise_out; mozzish_sh1_l=1; } else if((int)node_metro_out==0){ mozzish_sh1_l=0; }
        node_sh1_out = mozzish_sh1_val;
    node_osc_out = oscil_osc.next();
    // Control logic moved to audio loop for node osc
    oscil_osc.setFreq((float)node_sh1_out);
    return MonoOutput::from8Bit((int)node_osc_out);
}

void loop() {
    audioHook();
}
