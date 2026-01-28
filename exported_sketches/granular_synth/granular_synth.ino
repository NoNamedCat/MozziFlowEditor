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
long node_lfo1_out = 0;
Oscil<SIN2048_NUM_CELLS, MOZZI_CONTROL_RATE> oscil_lfo1(SIN2048_DATA); float last_f_lfo1=0;
long node_mapper_out = 0;
long node_smooth_out = 0;
Smooth<long> smooth_smooth; float smooth_smooth_last=0;
long node_wp1_out = 0;
WavePacket<DOUBLE> wavepacket_wp1;
long node_out_out = 0;

void setup() {
    startMozzi();
    smooth_smooth.setSmoothness(0.9f);
    wavepacket_wp1.set(100, 50, 100);
}

void updateControl() {
    if(last_f_lfo1 != (float)0.5){ oscil_lfo1.setFreq((float)0.5); last_f_lfo1 = (float)0.5; }
    // Forced downsample for node lfo1
        node_lfo1_out = oscil_lfo1.next();
    node_mapper_out = ((((long)node_lfo1_out - (long)-128) * ((long)500 - (long)50)) / ((long)127 - (long)-128) + (long)50);
    // Parameter update for audio node smooth
        node_smooth_out = smooth_smooth.next((long)node_mapper_out);
    // Parameter update for audio node wp1
        wavepacket_wp1.set((int)(long)node_smooth_out, (int)(long)0, (int)(long)0);
}

AudioOutput updateAudio() {
    node_wp1_out = wavepacket_wp1.next();
    return MonoOutput::from8Bit((int)node_wp1_out);
}

void loop() {
    audioHook();
}
