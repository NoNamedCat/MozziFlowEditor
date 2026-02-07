#define MOZZI_AUDIO_CHANNELS MOZZI_MONO
#define MOZZI_AUDIO_MODE MOZZI_OUTPUT_PWM

// MOZZIFLOW v111.0 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <FixMath.h>
#include <tables/sin2048_int8.h>
#include <WaveFolder.h>

// GLOBALS
long node_osc_out = 0;
Oscil<SIN2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_osc(SIN2048_DATA); float last_f_osc=0;
long node_gain_out = 0;
long node_fold_out = 0;
WaveFolder<int> mozziwavefolder_fold;
long node_out_out = 0;

void setup() {
    startMozzi();
    mozziwavefolder_fold.setLimits(-128, 127);
}

void updateControl() {
    // Parameter update for audio node osc
        if(last_f_osc != (float)110){ oscil_osc.setFreq((float)110); last_f_osc = (float)110; }
}

AudioOutput updateAudio() {
    node_osc_out = oscil_osc.next();
    node_gain_out = ((long)node_osc_out * (long)255);
    node_fold_out = mozziwavefolder_fold.next((int)(long)node_gain_out);
    return MonoOutput::from8Bit((int)node_fold_out);
}

void loop() {
    audioHook();
}
