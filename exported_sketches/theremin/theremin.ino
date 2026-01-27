// MOZZIFLOW v110.9 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <IntMap.h>
#include <tables/sin2048_int8.h>
#include <AudioDelay.h>

// GLOBALS
long node_map_out = 0;
IntMap intmap_map(0, 255, 0, 255);
long node_osc_out = 0;
Oscil<SIN2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_osc(SIN2048_DATA);
long node_echo_out = 0;
AudioDelay<256> mozziaudiodelay_echo;
long node_out_out = 0;

void setup() {
    startMozzi();
    
}

void updateControl() {
    
}

AudioOutput updateAudio() {
    // Control logic moved to audio loop for node map
    node_map_out = intmap_map((int)node_sm_out);
    node_osc_out = oscil_osc.next();
    // Control logic moved to audio loop for node osc
    oscil_osc.setFreq((float)node_map_out);
    node_echo_out = mozziaudiodelay_echo.next((int)node_osc_out, (uint16_t)128);
    return MonoOutput::from8Bit((int)node_echo_out);
}

void loop() {
    audioHook();
}
