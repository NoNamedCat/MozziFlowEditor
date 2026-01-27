// MOZZIFLOW v110.9 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <Metronome.h>
#include <mozzi_midi.h>
#include <tables/saw2048_int8.h>
#include <ADSR.h>
#include <StateVariable.h>

// GLOBALS
long node_clock_out = 0;
Metronome mozzimetronome_clock; float mozzimetronome_clock_lastbpm = 0;
long node_seq_out = 0;
long node_seq_index = 0;
byte mozzisequencer_seq_i=0; bool mozzisequencer_seq_l=0;
long node_mtof_out = 0;
long node_osc_out = 0;
Oscil<SAW2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_osc(SAW2048_DATA);
long node_env_out = 0;
ADSR<MOZZI_CONTROL_RATE, MOZZI_AUDIO_RATE> mozziadsr_env; bool mozziadsr_env_l=0;
long node_c_mul_out = 0;
long node_c_add_out = 0;
long node_c_shl_out = 0;
long node_vcf_out = 0;
StateVariable<LOWPASS> mozzisvf_vcf;
long node_vca_out = 0;
long node_vol_out = 0;
long node_clip_out = 0;
long node_out_out = 0;

void setup() {
    startMozzi();
    mozzimetronome_clock.start();
    mozziadsr_env.setADLevels((uint8_t)255, (uint8_t)0); mozziadsr_env.setTimes((unsigned int)5, (unsigned int)180, 65535, (unsigned int)50);
}

void updateControl() {
    if(mozzimetronome_clock_lastbpm != (float)135) { mozzimetronome_clock.setBPM((float)135); mozzimetronome_clock_lastbpm = (float)135;}
        node_clock_out = mozzimetronome_clock.ready() ? 255 : 0;
    if((int)node_clock_out>0 && !mozzisequencer_seq_l){ mozzisequencer_seq_i++; if(mozzisequencer_seq_i >= 8) mozzisequencer_seq_i=0; mozzisequencer_seq_l=1; } else if((int)node_clock_out==0) { mozzisequencer_seq_l=0; }
        int mozzisequencer_seq_arr[8] = {36,48,36,39,41,36,46,43};
        node_seq_index = mozzisequencer_seq_i;
        node_seq_out = mozzisequencer_seq_arr[mozzisequencer_seq_i];
    node_mtof_out = mtof((float)node_seq_out);
    bool mozziadsr_env_tr=(int)node_clock_out>0;
        if(mozziadsr_env_tr && !mozziadsr_env_l){ mozziadsr_env.noteOn(); } else if(!mozziadsr_env_tr && mozziadsr_env_l){ mozziadsr_env.noteOff(); }
        mozziadsr_env_l=mozziadsr_env_tr;
        mozziadsr_env.update();
        node_env_out = mozziadsr_env.next();
    // Forced downsample for node c_mul
        node_c_mul_out = ((int)(((long)node_env_out * 100) >> 8));
    // Forced downsample for node c_add
        node_c_add_out = (int)30 + (int)node_c_mul_out;
    // Forced downsample for node c_shl
        node_c_shl_out = ((int)node_c_add_out << (int)2);
}

AudioOutput updateAudio() {
    node_osc_out = oscil_osc.next();
    // Control logic moved to audio loop for node osc
    oscil_osc.setFreq((float)node_mtof_out);
    node_vcf_out = mozzisvf_vcf.next((int)node_osc_out);
    // Control logic moved to audio loop for node vcf
    mozzisvf_vcf.setCentreFreq((unsigned int)node_c_shl_out);
        mozzisvf_vcf.setResonance((uint8_t)160);
    node_vca_out = ((int)(((long)node_vcf_out * node_env_out) >> 8));
    node_vol_out = ((int)(((long)node_vca_out * 80) >> 8));
    node_clip_out = ((int)node_vol_out > 127 ? 127 : ((int)node_vol_out < -128 ? -128 : (int)node_vol_out));
    return MonoOutput::from8Bit((int)node_clip_out);
}

void loop() {
    audioHook();
}
