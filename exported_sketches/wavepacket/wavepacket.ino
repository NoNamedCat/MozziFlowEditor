// MOZZIFLOW v111.0 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <tables/sin2048_int8.h>
#include <Smooth.h>
#include <WavePacket.h>

// GLOBALS
long node_lfo_out = 0;
Oscil<SIN2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_lfo(SIN2048_DATA);
long node_mapper_out = 0;
long node_smooth_out = 0;
Smooth<int> smooth_smooth(0.95f);
long node_wp_out = 0;
WavePacket<DOUBLE> wavepacket_wp;
long node_out_out = 0;

void setup() {
    startMozzi();
    wavepacket_wp.set(100, 50, 100);
}

void updateControl() {
    
}

AudioOutput updateAudio() {
    node_lfo_out = oscil_lfo.next();
    // Control logic moved to audio loop for node lfo
    oscil_lfo.setFreq((float)(long)0.2);
    node_mapper_out = map((long)node_lfo_out, (long)-128, (long)127, (long)40, (long)250);
    // Control logic moved to audio loop for node smooth
    node_smooth_out = smooth_smooth.next((int)(long)node_mapper_out);
    node_wp_out = wavepacket_wp.next();
    // Control logic moved to audio loop for node wp
    wavepacket_wp.set((int)(long)node_smooth_out, (int)(long)0, (int)(long)0);
    return MonoOutput::from8Bit((int)node_wp_out);
}

void loop() {
    audioHook();
}
