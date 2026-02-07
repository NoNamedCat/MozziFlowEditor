#define MOZZI_AUDIO_CHANNELS MOZZI_MONO
#define MOZZI_AUDIO_MODE MOZZI_OUTPUT_PWM

// MOZZIFLOW v111.0 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <FixMath.h>
#include <tables/sin2048_int8.h>
#include <Ead.h>

// GLOBALS
long node_btn1_out = 0;
long node_kick_out = 0;
Oscil<SIN2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_kick(SIN2048_DATA); float last_f_kick=0;
long node_env_out = 0;
Ead mozziead_env(MOZZI_AUDIO_RATE); bool mozziead_env_last = 0;
long node_vca_out = 0;
long node_norm_out = 0;
long node_out_out = 0;

void setup() {
    startMozzi();
    pinMode(5, INPUT_PULLUP);
}

void updateControl() {
    digitalRead(5) == LOW ? 255 : 0;
    // Parameter update for audio node kick
        if(last_f_kick != (float)60){ oscil_kick.setFreq((float)60); last_f_kick = (float)60; }
}

AudioOutput updateAudio() {
    node_kick_out = oscil_kick.next();
    bool mozziead_env_trig = (long)node_btn1_out>0;
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
