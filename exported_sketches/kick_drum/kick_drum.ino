// MOZZIFLOW v110.9 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <Metronome.h>
#include <Ead.h>
#include <tables/sin2048_int8.h>

// GLOBALS
long node_clock_out = 0;
Metronome mozzimetronome_clock; float mozzimetronome_clock_lastbpm = 0;
long node_env_pitch_out = 0;
Ead mozziead_env_pitch(MOZZI_AUDIO_RATE);
long node_p_amt_out = 0;
long node_base_out = 0;
long node_osc_out = 0;
Oscil<SIN2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_osc(SIN2048_DATA);
long node_env_amp_out = 0;
Ead mozziead_env_amp(MOZZI_AUDIO_RATE);
long node_vca_out = 0;
long node_out_out = 0;

void setup() {
    startMozzi();
    mozzimetronome_clock.start();
}

void updateControl() {
    
}

AudioOutput updateAudio() {
    // Control logic moved to audio loop for node clock
    if(mozzimetronome_clock_lastbpm != (float)110) { mozzimetronome_clock.setBPM((float)110); mozzimetronome_clock_lastbpm = (float)110;}
        node_clock_out = mozzimetronome_clock.ready() ? 255 : 0;
    node_env_pitch_out = mozziead_env_pitch.next();
    // Control logic moved to audio loop for node env_pitch
    if((int)node_clock_out>0){ mozziead_env_pitch.start((unsigned int)20, (unsigned int)200); }
    node_p_amt_out = (int)((long)node_env_pitch_out * 150 >> 8);
    node_base_out = (int)node_p_amt_out + (int)45;
    node_osc_out = oscil_osc.next();
    // Control logic moved to audio loop for node osc
    oscil_osc.setFreq((float)node_base_out);
    node_env_amp_out = mozziead_env_amp.next();
    // Control logic moved to audio loop for node env_amp
    if((int)node_clock_out>0){ mozziead_env_amp.start((unsigned int)20, (unsigned int)200); }
    node_vca_out = ((int)(((long)node_osc_out * node_env_amp_out) >> 8));
    return MonoOutput::from8Bit((int)node_vca_out);
}

void loop() {
    audioHook();
}
