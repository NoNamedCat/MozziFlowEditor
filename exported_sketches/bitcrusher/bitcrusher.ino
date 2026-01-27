// MOZZIFLOW v110.9 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <tables/sin2048_int8.h>
#include <Phasor.h>

// GLOBALS
long node_src_out = 0;
Oscil<SIN2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_src(SIN2048_DATA);
long node_rate_phasor_out = 0;
Phasor<MOZZI_AUDIO_RATE> phasor_rate_phasor;
long node_sh_out = 0;
int mozzish_sh_val = 0; bool mozzish_sh_l = 0;
long node_out_out = 0;

void setup() {
    startMozzi();
    
}

void updateControl() {
    
}

AudioOutput updateAudio() {
    node_src_out = oscil_src.next();
    // Control logic moved to audio loop for node src
    oscil_src.setFreq((float)110);
    node_rate_phasor_out = phasor_rate_phasor.next();
    // Control logic moved to audio loop for node rate_phasor
    phasor_rate_phasor.setFreq((float)400);
    if((int)node_rate_phasor_out > 0 && !mozzish_sh_l){ mozzish_sh_val = (int)node_src_out; mozzish_sh_l=1; } else if((int)node_rate_phasor_out==0){ mozzish_sh_l=0; }
        node_sh_out = mozzish_sh_val;
    return MonoOutput::from8Bit((int)node_sh_out);
}

void loop() {
    audioHook();
}
