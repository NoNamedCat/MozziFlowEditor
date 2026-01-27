// MOZZIFLOW v111.0 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <tables/sin2048_int8.h>
#include <Smooth.h>
#include <tables/square_no_alias_2048_int8.h>
#include <AudioDelay.h>

// GLOBALS
long node_lfo_out = 0;
Oscil<SIN2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_lfo(SIN2048_DATA);
long node_mapper_out = 0;
long node_smooth_out = 0;
Smooth<int> smooth_smooth(0.95f);
long node_osc_out = 0;
Oscil<SQUARE_NO_ALIAS_2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_osc(SQUARE_NO_ALIAS_2048_DATA);
long node_del_out = 0;
AudioDelay<256> mozziaudiodelay_del;
long node_out_out = 0;

void setup() {
    startMozzi();
    
}

void updateControl() {
    
}

AudioOutput updateAudio() {
    node_lfo_out = oscil_lfo.next();
    // Control logic moved to audio loop for node lfo
    oscil_lfo.setFreq((float)(long)0.5);
    node_mapper_out = map((long)node_lfo_out, (long)-128, (long)127, (long)50, (long)250);
    // Control logic moved to audio loop for node smooth
    node_smooth_out = smooth_smooth.next((int)(long)node_mapper_out);
    node_osc_out = oscil_osc.next();
    // Control logic moved to audio loop for node osc
    oscil_osc.setFreq((float)(long)110);
    node_del_out = mozziaudiodelay_del.next((int)(long)node_osc_out, (uint16_t)(long)node_smooth_out);
    return MonoOutput::from8Bit((int)node_del_out);
}

void loop() {
    audioHook();
}
