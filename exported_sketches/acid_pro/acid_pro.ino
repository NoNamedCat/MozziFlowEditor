// MOZZIFLOW v111.0 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <Metronome.h>
#include <mozzi_midi.h>
#include <tables/saw2048_int8.h>
#include <ADSR.h>
#include <Smooth.h>
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
long node_mapper_out = 0;
long node_smooth_out = 0;
Smooth<int> smooth_smooth(0.98f);
long node_vcf_out = 0;
StateVariable<LOWPASS> mozzisvf_vcf;
long node_vca_out = 0;
long node_out_out = 0;

void setup() {
    startMozzi();
    mozzimetronome_clock.start();
    mozziadsr_env.setADLevels((uint8_t)(long)255, (uint8_t)(long)0); mozziadsr_env.setTimes((unsigned int)(long)5, (unsigned int)(long)180, 65535, (unsigned int)(long)50);
}

void updateControl() {
    
}

AudioOutput updateAudio() {
    // Control logic moved to audio loop for node clock
    if(mozzimetronome_clock_lastbpm != (float)(long)135) { mozzimetronome_clock.setBPM((float)(long)135); mozzimetronome_clock_lastbpm = (float)(long)135;}
        node_clock_out = mozzimetronome_clock.ready() ? 255 : 0;
    // Control logic moved to audio loop for node seq
    if((long)node_clock_out>0 && !mozzisequencer_seq_l){ mozzisequencer_seq_i++; if(mozzisequencer_seq_i >= 8) mozzisequencer_seq_i=0; mozzisequencer_seq_l=1; } else if((long)node_clock_out==0) { mozzisequencer_seq_l=0; }
        int mozzisequencer_seq_arr[8] = {(int)(long)36,(int)(long)48,(int)(long)36,(int)(long)39,(int)(long)41,(int)(long)36,(int)(long)46,(int)(long)43};
        node_seq_index = mozzisequencer_seq_i;
        node_seq_out = mozzisequencer_seq_arr[mozzisequencer_seq_i];
    // Control logic moved to audio loop for node mtof
    node_mtof_out = mtof((float)(long)node_seq_out);
    node_osc_out = oscil_osc.next();
    // Control logic moved to audio loop for node osc
    oscil_osc.setFreq((float)(long)node_mtof_out);
    // Control logic moved to audio loop for node env
    bool mozziadsr_env_tr=(long)node_clock_out>0;
        if(mozziadsr_env_tr && !mozziadsr_env_l){ mozziadsr_env.noteOn(); } else if(!mozziadsr_env_tr && mozziadsr_env_l){ mozziadsr_env.noteOff(); }
        mozziadsr_env_l=mozziadsr_env_tr;
        mozziadsr_env.update();
        node_env_out = mozziadsr_env.next();
    node_mapper_out = map((long)node_env_out, (long)0, (long)255, (long)400, (long)4000);
    // Control logic moved to audio loop for node smooth
    node_smooth_out = smooth_smooth.next((int)(long)node_mapper_out);
    node_vcf_out = mozzisvf_vcf.next((int)(long)node_osc_out);
    // Control logic moved to audio loop for node vcf
    mozzisvf_vcf.setCentreFreq((unsigned int)(long)node_smooth_out);
        mozzisvf_vcf.setResonance((uint8_t)(long)180);
    node_vca_out = ((int)(((long)node_vcf_out * (long)node_env_out) >> 8));
    return MonoOutput::from8Bit((int)node_vca_out);
}

void loop() {
    audioHook();
}
