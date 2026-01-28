#define MOZZI_AUDIO_CHANNELS MOZZI_MONO
#define MOZZI_AUDIO_MODE MOZZI_OUTPUT_PWM

// MOZZIFLOW v111.0 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <FixMath.h>
#include <tables/sin2048_int8.h>
#include <Smooth.h>
#include <WavePacket.h>

// GLOBALS
long node_lfo_out = 0;
Oscil<SIN2048_NUM_CELLS, MOZZI_CONTROL_RATE> oscil_lfo(SIN2048_DATA); float last_f_lfo=0;
long node_mapper_out = 0;
long node_smooth_out = 0;
Smooth<long> smooth_smooth; float smooth_smooth_last=0;
long node_wp_out = 0;
WavePacket<DOUBLE> wavepacket_wp;
long node_out_out = 0;

void setup() {
    startMozzi();
    smooth_smooth.setSmoothness(0.95f);
    wavepacket_wp.set(100, 50, 100);
}

void updateControl() {
    if(last_f_lfo != (float)0.2){ oscil_lfo.setFreq((float)0.2); last_f_lfo = (float)0.2; }
    // Forced downsample for node lfo
        node_lfo_out = oscil_lfo.next();
    node_mapper_out = ((((long)node_lfo_out - (long)-128) * ((long)250 - (long)40)) / ((long)127 - (long)-128) + (long)40);
    // Parameter update for audio node smooth
        node_smooth_out = smooth_smooth.next((long)node_mapper_out);
    // Parameter update for audio node wp
        wavepacket_wp.set((int)(long)node_smooth_out, (int)(long)0, (int)(long)0);
}

AudioOutput updateAudio() {
    node_wp_out = wavepacket_wp.next();
    return MonoOutput::from8Bit((int)node_wp_out);
}

void loop() {
    audioHook();
}
