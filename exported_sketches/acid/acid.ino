// MOZZIFLOW v111.0 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
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
Oscil<SAW2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_3gcd(SAW2048_DATA);
long node_cfnu_low = 0;
long node_cfnu_high = 0;
long node_cfnu_band = 0;
long node_cfnu_notch = 0;
long node_cfnu_out = 0;
MultiResonantFilter<uint8_t> mozzimultires_cfnu;
long node_776e_out = 0;
long node_k154_out = 0;

void setup() {
    startMozzi();
    mozzimetronome_aoov.start();
}

void updateControl() {
    
}

AudioOutput updateAudio() {
    // Control logic moved to audio loop for node aoov
    if(mozzimetronome_aoov_lastbpm != (float)(long)135) { mozzimetronome_aoov.setBPM((float)(long)135); mozzimetronome_aoov_lastbpm = (float)(long)135;}
        node_aoov_out = mozzimetronome_aoov.ready() ? 255 : 0;
    node_5auw_out = mozziead_5auw.next();
    // Control logic moved to audio loop for node 5auw
    if((long)node_aoov_out>0){ mozziead_5auw.start((unsigned int)(long)10, (unsigned int)(long)200); }
    node_3gcd_out = oscil_3gcd.next();
    // Control logic moved to audio loop for node 3gcd
    oscil_3gcd.setFreq((float)(long)55);
    mozzimultires_cfnu.next((int)(long)node_3gcd_out);
        node_cfnu_low = mozzimultires_cfnu.low();
        node_cfnu_high = mozzimultires_cfnu.high();
        node_cfnu_band = mozzimultires_cfnu.band();
        node_cfnu_notch = mozzimultires_cfnu.notch();
    // Control logic moved to audio loop for node cfnu
    mozzimultires_cfnu.setCutoffFreqAndResonance((uint8_t)(long)node_5auw_out, (uint8_t)(long)220);
    node_776e_out = ((long)node_cfnu_low >> (int)2);
    return MonoOutput::from8Bit((int)node_776e_out);
}

void loop() {
    audioHook();
}
