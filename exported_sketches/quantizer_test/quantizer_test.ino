// MOZZIFLOW v111.0 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <tables/sin2048_int8.h>
#include <mozzi_midi.h>

// GLOBALS
long node_lfo_out = 0;
Oscil<SIN2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_lfo(SIN2048_DATA);
long node_mapper_out = 0;
long node_mtof_out = 0;
long node_osc_out = 0;
Oscil<SIN2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_osc(SIN2048_DATA);
long node_out_out = 0;

void setup() {
    startMozzi();
    
}

void updateControl() {
    
}

AudioOutput updateAudio() {
    node_lfo_out = oscil_lfo.next();
    // Control logic moved to audio loop for node lfo
    oscil_lfo.setFreq((float)(long)0.2);
    node_mapper_out = map((long)node_lfo_out, (long)-128, (long)127, (long)36, (long)72);
    // Control logic moved to audio loop for node mtof
    node_mtof_out = mtof((float)(long)node_mapper_out);
    node_osc_out = oscil_osc.next();
    // Control logic moved to audio loop for node osc
    oscil_osc.setFreq((float)(long)node_mtof_out);
    return MonoOutput::from8Bit((int)node_osc_out);
}

void loop() {
    audioHook();
}
