// MOZZIFLOW v111.0 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <tables/sin2048_int8.h>
#include <Ead.h>

// GLOBALS
long node_btn1_out = 0;
long node_kick_out = 0;
Oscil<SIN2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_kick(SIN2048_DATA);
long node_env_out = 0;
Ead mozziead_env(MOZZI_AUDIO_RATE);
long node_vca_out = 0;
long node_out_out = 0;

void setup() {
    startMozzi();
    pinMode(5, INPUT_PULLUP);
}

void updateControl() {
    
}

AudioOutput updateAudio() {
    // Control logic moved to audio loop for node btn1
    digitalRead(5) == LOW ? 255 : 0;
    node_kick_out = oscil_kick.next();
    // Control logic moved to audio loop for node kick
    oscil_kick.setFreq((float)(long)60);
    node_env_out = mozziead_env.next();
    // Control logic moved to audio loop for node env
    if((long)node_btn1_out>0){ mozziead_env.start((unsigned int)(long)20, (unsigned int)(long)200); }
    node_vca_out = ((int)(((long)node_kick_out * (long)node_env_out) >> 8));
    return MonoOutput::from8Bit((int)node_vca_out);
}

void loop() {
    audioHook();
}
