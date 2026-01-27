// MOZZIFLOW v110.9 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <tables/sin2048_int8.h>
#include <WavePacket.h>

// GLOBALS
long node_l1_out = 0;
Oscil<SIN2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_l1(SIN2048_DATA);
long node_l2_out = 0;
Oscil<SIN2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_l2(SIN2048_DATA);
long node_wp1_out = 0;
WavePacket<DOUBLE> wavepacket_wp1;
long node_out_out = 0;

void setup() {
    startMozzi();
    wavepacket_wp1.set(100, 50, 100);
}

void updateControl() {
    
}

AudioOutput updateAudio() {
    node_l1_out = oscil_l1.next();
    // Control logic moved to audio loop for node l1
    oscil_l1.setFreq((float)0.1);
    node_l2_out = oscil_l2.next();
    // Control logic moved to audio loop for node l2
    oscil_l2.setFreq((float)0.15);
    node_wp1_out = wavepacket_wp1.next();
    // Control logic moved to audio loop for node wp1
    wavepacket_wp1.set((int)node_l1_out, (int)node_l2_out, (int)0);
    return MonoOutput::from8Bit((int)node_wp1_out);
}

void loop() {
    audioHook();
}
