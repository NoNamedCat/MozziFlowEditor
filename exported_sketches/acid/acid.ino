// MOZZIFLOW v111.0 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <FixMath.h>
#include <Metronome.h>
#include <Ead.h>
#include <tables/saw2048_int8.h>
#include <ResonantFilter.h>

// GLOBALS
long node_aoov_out = 0;
Metronome mozzimetronome_aoov; float mozzimetronome_aoov_lastbpm = 0;
long node_5auw_out = 0;
Ead mozziead_5auw(MOZZI_AUDIO_RATE);
long node_3gcd_out = 0;
Oscil<SAW2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_3gcd(SAW2048_DATA); float last_f_3gcd=0;
long node_cfnu_low = 0;
long node_cfnu_high = 0;
long node_cfnu_band = 0;
long node_cfnu_notch = 0;
long node_cfnu_out = 0;
MultiResonantFilter<uint16_t> mozzimultires_cfnu; uint16_t last_f_cfnu=0; uint16_t last_r_cfnu=0;
long node_776e_out = 0;
long node_k154_out = 0;

void setup() {
    startMozzi();
    mozzimetronome_aoov.start();
}

void updateControl() {
    // Parameter update for audio node aoov
        if(mozzimetronome_aoov_lastbpm != (float)(long)135) { mozzimetronome_aoov.setBPM((float)(long)135); mozzimetronome_aoov_lastbpm = (float)(long)135;}
        node_aoov_out = mozzimetronome_aoov.ready() ? 255 : 0;
    // Parameter update for audio node 5auw
        if((long)node_aoov_out>0){ mozziead_5auw.start((unsigned int)(long)10, (unsigned int)(long)200); }
    // Parameter update for audio node 3gcd
        if(last_f_3gcd != (float)55){ oscil_3gcd.setFreq((float)55); last_f_3gcd = (float)55; }
    // Parameter update for audio node cfnu
        if(last_f_cfnu != (uint16_t)(long)node_5auw_out || last_r_cfnu != (uint16_t)(long)220){ mozzimultires_cfnu.setCutoffFreqAndResonance((uint16_t)(long)node_5auw_out, (uint16_t)(long)220); last_f_cfnu=(uint16_t)(long)node_5auw_out; last_r_cfnu=(uint16_t)(long)220; }
    node_776e_out = ((long)node_cfnu_low >> (int)2);
}

AudioOutput updateAudio() {
    node_5auw_out = (long)mozziead_5auw.next();
    node_3gcd_out = oscil_3gcd.next();
    mozzimultires_cfnu.next((int)(long)node_3gcd_out);
        node_cfnu_low = mozzimultires_cfnu.low();
        node_cfnu_high = mozzimultires_cfnu.high();
        node_cfnu_band = mozzimultires_cfnu.band();
        node_cfnu_notch = mozzimultires_cfnu.notch();
    return MonoOutput::from8Bit((int)node_776e_out);
}

void loop() {
    audioHook();
}
