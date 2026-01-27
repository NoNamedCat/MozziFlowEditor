// MOZZIFLOW v111.0 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <tables/sin2048_int8.h>
#include <Smooth.h>
#include <tables/saw2048_int8.h>
#include <StateVariable.h>

// GLOBALS
long node_lfo_out = 0;
Oscil<SIN2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_lfo(SIN2048_DATA);
long node_mapper_out = 0;
long node_smooth_out = 0;
Smooth<int> smooth_smooth(0.95f);
long node_osc_out = 0;
Oscil<SAW2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_osc(SAW2048_DATA);
long node_filter_out = 0;
StateVariable<LOWPASS> mozzisvf_filter;
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
    node_mapper_out = map((long)node_lfo_out, (long)-128, (long)127, (long)200, (long)4000);
    // Control logic moved to audio loop for node smooth
    node_smooth_out = smooth_smooth.next((int)(long)node_mapper_out);
    node_osc_out = oscil_osc.next();
    // Control logic moved to audio loop for node osc
    oscil_osc.setFreq((float)(long)110);
    node_filter_out = mozzisvf_filter.next((int)(long)node_osc_out);
    // Control logic moved to audio loop for node filter
    mozzisvf_filter.setCentreFreq((unsigned int)(long)node_smooth_out);
        mozzisvf_filter.setResonance((uint8_t)(long)180);
    return MonoOutput::from8Bit((int)node_filter_out);
}

void loop() {
    audioHook();
}
