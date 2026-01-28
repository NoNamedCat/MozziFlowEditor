#define MOZZI_AUDIO_CHANNELS MOZZI_MONO
#define MOZZI_AUDIO_MODE MOZZI_OUTPUT_PWM

// MOZZIFLOW v111.0 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <FixMath.h>
#include <Metronome.h>
#include <Ead.h>
#include <tables/sin2048_int8.h>

// GLOBALS
long node_clock_out = 0;
Metronome mozzimetronome_clock; float mozzimetronome_clock_lastbpm = 0;
long node_env_p_out = 0;
Ead mozziead_env_p(MOZZI_AUDIO_RATE); bool mozziead_env_p_last = 0;
long node_map_p_out = 0;
long node_osc_out = 0;
Oscil<SIN2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_osc(SIN2048_DATA); float last_f_osc=0;
long node_env_v_out = 0;
Ead mozziead_env_v(MOZZI_AUDIO_RATE); bool mozziead_env_v_last = 0;
long node_vca_out = 0;
long node_norm_out = 0;
long node_out_out = 0;

void setup() {
    startMozzi();
    mozzimetronome_clock.start();
}

void updateControl() {
    // Parameter update for audio node clock
        if(mozzimetronome_clock_lastbpm != (float)(long)120) { mozzimetronome_clock.setBPM((float)(long)120); mozzimetronome_clock_lastbpm = (float)(long)120;}
        node_clock_out = mozzimetronome_clock.ready() ? 255 : 0;
    // Parameter update for audio node map_p
        node_map_p_out = ((((long)node_env_p_out - (long)0) * ((long)150 - (long)40)) / ((long)255 - (long)0) + (long)40);
    // Parameter update for audio node osc
        if(last_f_osc != (float)node_map_p_out){ oscil_osc.setFreq((float)node_map_p_out); last_f_osc = (float)node_map_p_out; }
}

AudioOutput updateAudio() {
    bool mozziead_env_p_trig = (long)node_clock_out>0;
        if(mozziead_env_p_trig && !mozziead_env_p_last){ mozziead_env_p.start((unsigned int)(long)5, (unsigned int)(long)100); }
        mozziead_env_p_last = mozziead_env_p_trig;
        node_env_p_out = (long)mozziead_env_p.next();
    node_osc_out = oscil_osc.next();
    bool mozziead_env_v_trig = (long)node_clock_out>0;
        if(mozziead_env_v_trig && !mozziead_env_v_last){ mozziead_env_v.start((unsigned int)(long)10, (unsigned int)(long)400); }
        mozziead_env_v_last = mozziead_env_v_trig;
        node_env_v_out = (long)mozziead_env_v.next();
    node_vca_out = ((long)node_osc_out * (long)node_env_v_out);
    node_norm_out = ((long)node_vca_out >> (int)8);
    return MonoOutput::from8Bit((int)node_norm_out);
}

void loop() {
    audioHook();
}
