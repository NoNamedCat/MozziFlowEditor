// MOZZIFLOW v111.0 BALANCED CORE REFINED SKETCH
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
long node_osc_out = 0;
Oscil<SIN2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_osc(SIN2048_DATA);
long node_env_vol_out = 0;
Ead mozziead_env_vol(MOZZI_AUDIO_RATE);
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
    if(mozzimetronome_clock_lastbpm != (float)(long)120) { mozzimetronome_clock.setBPM((float)(long)120); mozzimetronome_clock_lastbpm = (float)(long)120;}
        node_clock_out = mozzimetronome_clock.ready() ? 255 : 0;
    node_env_pitch_out = mozziead_env_pitch.next();
    // Control logic moved to audio loop for node env_pitch
    if((long)node_clock_out>0){ mozziead_env_pitch.start((unsigned int)(long)5, (unsigned int)(long)150); }
    node_p_amt_out = map((long)node_env_pitch_out, (long)0, (long)255, (long)40, (long)200);
    node_osc_out = oscil_osc.next();
    // Control logic moved to audio loop for node osc
    oscil_osc.setFreq((float)(long)node_p_amt_out);
    node_env_vol_out = mozziead_env_vol.next();
    // Control logic moved to audio loop for node env_vol
    if((long)node_clock_out>0){ mozziead_env_vol.start((unsigned int)(long)20, (unsigned int)(long)300); }
    node_vca_out = ((int)(((long)node_osc_out * (long)node_env_vol_out) >> 8));
    return MonoOutput::from8Bit((int)node_vca_out);
}

void loop() {
    audioHook();
}
