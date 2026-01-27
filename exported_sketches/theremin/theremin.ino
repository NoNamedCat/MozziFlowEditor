// MOZZIFLOW v111.0 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <tables/sin2048_int8.h>
#include <Smooth.h>

// GLOBALS
long node_p1_out = 0;
Oscil<SIN2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_p1(SIN2048_DATA);
long node_mapper_out = 0;
long node_smooth_out = 0;
Smooth<int> smooth_smooth(0.95f);
long node_osc_out = 0;
Oscil<SIN2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_osc(SIN2048_DATA);
long node_out_out = 0;

void setup() {
    startMozzi();
    
}

void updateControl() {
    
}

AudioOutput updateAudio() {
    node_p1_out = oscil_p1.next();
    // Control logic moved to audio loop for node p1
    oscil_p1.setFreq((float)(long)0.1);
    node_mapper_out = map((long)node_p1_out, (long)-128, (long)127, (long)200, (long)1000);
    // Control logic moved to audio loop for node smooth
    node_smooth_out = smooth_smooth.next((int)(long)node_mapper_out);
    node_osc_out = oscil_osc.next();
    // Control logic moved to audio loop for node osc
    oscil_osc.setFreq((float)(long)node_smooth_out);
    return MonoOutput::from8Bit((int)node_osc_out);
}

void loop() {
    audioHook();
}
