// MOZZIFLOW v111.0 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <tables/sin2048_int8.h>
#include <WaveFolder.h>

// GLOBALS
long node_osc_out = 0;
Oscil<SIN2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_osc(SIN2048_DATA);
long node_gain_out = 0;
long node_fold_out = 0;
WaveFolder<int> mozziwavefolder_fold;
long node_out_out = 0;

void setup() {
    startMozzi();
    
}

void updateControl() {
    
}

AudioOutput updateAudio() {
    node_osc_out = oscil_osc.next();
    // Control logic moved to audio loop for node osc
    oscil_osc.setFreq((float)(long)110);
    node_gain_out = ((int)(((long)node_osc_out * (long)255) >> 8));
    node_fold_out = mozziwavefolder_fold.next((int)(long)node_gain_out);
    return MonoOutput::from8Bit((int)node_fold_out);
}

void loop() {
    audioHook();
}
