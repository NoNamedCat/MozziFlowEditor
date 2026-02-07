#define MOZZI_AUDIO_CHANNELS MOZZI_MONO
#define MOZZI_AUDIO_MODE MOZZI_OUTPUT_PWM

// MOZZIFLOW v111.0 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <FixMath.h>
#include <Metronome.h>
#include <tables/sin2048_int8.h>
#include <Ead.h>

// GLOBALS
long node_m1_out = 0;
Metronome mozzimetronome_m1; float mozzimetronome_m1_lastbpm = 0;
long node_kick_out = 0;
Oscil<SIN2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_kick(SIN2048_DATA); float last_f_kick=0;
long node_env_out = 0;
Ead mozziead_env(MOZZI_AUDIO_RATE); bool mozziead_env_last = 0;
long node_vca_out = 0;
long node_norm_out = 0;
long node_out_out = 0;

void setup() {
    startMozzi();
    mozzimetronome_m1.start();
}

void updateControl() {
    // Parameter update for audio node m1
        if(mozzimetronome_m1_lastbpm != (float)(long)124) { mozzimetronome_m1.setBPM((float)(long)124); mozzimetronome_m1_lastbpm = (float)(long)124;}
        node_m1_out = mozzimetronome_m1.ready() ? 255 : 0;
    // Parameter update for audio node kick
        if(last_f_kick != (float)55){ oscil_kick.setFreq((float)55); last_f_kick = (float)55; }
}

AudioOutput updateAudio() {
    node_kick_out = oscil_kick.next();
    bool mozziead_env_trig = (long)node_m1_out>0;
        if(mozziead_env_trig && !mozziead_env_last){ mozziead_env.start((unsigned int)(long)20, (unsigned int)(long)200); }
        mozziead_env_last = mozziead_env_trig;
        node_env_out = (long)mozziead_env.next();
    node_vca_out = ((long)node_kick_out * (long)node_env_out);
    node_norm_out = ((long)node_vca_out >> (int)8);
    return MonoOutput::from8Bit((int)node_norm_out);
}

void loop() {
    audioHook();
}
