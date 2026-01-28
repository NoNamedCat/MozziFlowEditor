// MOZZIFLOW v111.0 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <FixMath.h>
#include <Metronome.h>
#include <tables/sin2048_int8.h>

// GLOBALS
long node_metro_out = 0;
Metronome mozzimetronome_metro; float mozzimetronome_metro_lastbpm = 0;
long node_osc_out = 0;
Oscil<SIN2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_osc(SIN2048_DATA); float last_f_osc=0;
long node_vca_out = 0;
long node_out_out = 0;

void setup() {
    startMozzi();
    mozzimetronome_metro.start();
}

void updateControl() {
    if(mozzimetronome_metro_lastbpm != (float)(long)60) { mozzimetronome_metro.setBPM((float)(long)60); mozzimetronome_metro_lastbpm = (float)(long)60;}
        node_metro_out = mozzimetronome_metro.ready() ? 255 : 0;
    // Parameter update for audio node osc
        if(last_f_osc != (float)220){ oscil_osc.setFreq((float)220); last_f_osc = (float)220; }
    node_vca_out = ((long)node_osc_out * (long)node_env_out);
}

AudioOutput updateAudio() {
    node_osc_out = oscil_osc.next();
    return MonoOutput::from8Bit((int)node_dist_out);
}

void loop() {
    audioHook();
}
