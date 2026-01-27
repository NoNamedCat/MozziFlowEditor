// MOZZIFLOW v110.9 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <mozzi_rand.h>
#include <tables/sin2048_int8.h>
#include <StateVariable.h>

// GLOBALS
long node_noise_out = 0;
long node_lfo_out = 0;
Oscil<SIN2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_lfo(SIN2048_DATA);
long node_map_out = 0;
long node_f1_out = 0;
StateVariable<LOWPASS> mozzisvf_f1;
long node_out_out = 0;

void setup() {
    startMozzi();
    
}

void updateControl() {
    
}

AudioOutput updateAudio() {
    node_noise_out = rand((int)256) - 128;
    node_lfo_out = oscil_lfo.next();
    // Control logic moved to audio loop for node lfo
    oscil_lfo.setFreq((float)1.3);
    node_map_out = map((int)node_lfo_out, 0, 255, (int)0, (int)0);
    node_f1_out = mozzisvf_f1.next((int)node_noise_out);
    // Control logic moved to audio loop for node f1
    mozzisvf_f1.setCentreFreq((unsigned int)node_map_out);
        mozzisvf_f1.setResonance((uint8_t)150);
    return MonoOutput::from8Bit((int)node_f1_out);
}

void loop() {
    audioHook();
}
