// MOZZIFLOW v111.0 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <tables/sin2048_int8.h>
#include <Phasor.h>

// GLOBALS
long node_src_out = 0;
Oscil<SIN2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_src(SIN2048_DATA);
long node_rate_lfo_out = 0;
Phasor<MOZZI_AUDIO_RATE> phasor_rate_lfo;
long node_mapper_out = 0;
long node_crush_out = 0;
long node_out_out = 0;

void setup() {
    startMozzi();
    
}

void updateControl() {
    
}

AudioOutput updateAudio() {
    node_src_out = oscil_src.next();
    // Control logic moved to audio loop for node src
    oscil_src.setFreq((float)(long)110);
    node_rate_lfo_out = phasor_rate_lfo.next();
    // Control logic moved to audio loop for node rate_lfo
    phasor_rate_lfo.setFreq((float)(long)2);
    node_mapper_out = map((long)node_rate_lfo_out, (long)0, (long)255, (long)1, (long)6);
    node_crush_out = ((long)node_src_out & (0xFF << (int)node_mapper_out));
    return MonoOutput::from8Bit((int)node_crush_out);
}

void loop() {
    audioHook();
}
