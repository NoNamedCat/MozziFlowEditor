// MOZZIFLOW v110.9 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <Metronome.h>
#include <tables/saw2048_int8.h>
#include <ADSR.h>
#include <ResonantFilter.h>

// GLOBALS
long node_tlk7_out = 0;
Metronome metronome_tlk7; bool metronome_tlk7_st = 0;
long node_q7rj_out = 0;
Oscil<SAW2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_q7rj(SAW2048_DATA);
long node_rlfd_out = 0;
ADSR<MOZZI_CONTROL_RATE, MOZZI_AUDIO_RATE> mozziadsr_rlfd; bool mozziadsr_rlfd_l=0;
long node_zt91_low = 0;
long node_zt91_high = 0;
long node_zt91_band = 0;
long node_zt91_notch = 0;
long node_zt91_out = 0;
MultiResonantFilter<uint8_t> mozzimultires_zt91;
long node_4f9t_out = 0;
long node_z6hw_out = 0;

void setup() {
    startMozzi();
    metronome_tlk7.start();
    mozziadsr_rlfd.setADLevels((uint8_t)255, (uint8_t)150); mozziadsr_rlfd.setTimes((unsigned int)20, (unsigned int)200, 65535, (unsigned int)800);
}

void updateControl() {
    
}

AudioOutput updateAudio() {
    // Control logic moved to audio loop for node tlk7
    metronome_tlk7.setBPM((float)120);
        if(metronome_tlk7.ready()){ metronome_tlk7_st = !metronome_tlk7_st; }
        node_tlk7_out = metronome_tlk7_st ? 255 : 0;
    node_q7rj_out = oscil_q7rj.next();
    // Control logic moved to audio loop for node q7rj
    oscil_q7rj.setFreq((float)110);
    // Control logic moved to audio loop for node rlfd
    bool mozziadsr_rlfd_tr=(int)node_tlk7_out>0;
        if(mozziadsr_rlfd_tr && !mozziadsr_rlfd_l){ mozziadsr_rlfd.noteOn(); } else if(!mozziadsr_rlfd_tr && mozziadsr_rlfd_l){ mozziadsr_rlfd.noteOff(); }
        mozziadsr_rlfd_l=mozziadsr_rlfd_tr;
        mozziadsr_rlfd.update();
        node_rlfd_out = mozziadsr_rlfd.next();
    mozzimultires_zt91.next((int)node_q7rj_out);
        node_zt91_low = mozzimultires_zt91.low();
        node_zt91_high = mozzimultires_zt91.high();
        node_zt91_band = mozzimultires_zt91.band();
        node_zt91_notch = mozzimultires_zt91.notch();
    // Control logic moved to audio loop for node zt91
    mozzimultires_zt91.setCutoffFreqAndResonance((uint8_t)node_rlfd_out, (uint8_t)100);
    node_4f9t_out = ((int)(((long)node_zt91_low * node_rlfd_out) >> 8));
    return MonoOutput::from8Bit((int)node_4f9t_out);
}

void loop() {
    audioHook();
}
