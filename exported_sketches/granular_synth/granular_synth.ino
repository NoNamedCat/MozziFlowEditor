// MOZZIFLOW v111.0 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <tables/sin2048_int8.h>
#include <Smooth.h>
#include <WavePacket.h>

// GLOBALS
long node_lfo1_out = 0;
Oscil<SIN2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_lfo1(SIN2048_DATA);
long node_mapper_out = 0;
long node_smooth_out = 0;
Smooth<int> smooth_smooth(0.9f);
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
    node_lfo1_out = oscil_lfo1.next();
    // Control logic moved to audio loop for node lfo1
    oscil_lfo1.setFreq((float)(long)0.5);
    node_mapper_out = map((long)node_lfo1_out, (long)-128, (long)127, (long)50, (long)500);
    // Control logic moved to audio loop for node smooth
    node_smooth_out = smooth_smooth.next((int)(long)node_mapper_out);
    node_wp1_out = wavepacket_wp1.next();
    // Control logic moved to audio loop for node wp1
    wavepacket_wp1.set((int)(long)node_smooth_out, (int)(long)0, (int)(long)0);
    return MonoOutput::from8Bit((int)node_wp1_out);
}

void loop() {
    audioHook();
}
