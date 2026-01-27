// MOZZIFLOW v111.0 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <Metronome.h>
#include <ADSR.h>
#include <Smooth.h>
#include <tables/saw2048_int8.h>
#include <StateVariable.h>

// GLOBALS
long node_clock_out = 0;
Metronome mozzimetronome_clock; float mozzimetronome_clock_lastbpm = 0;
long node_adsr_out = 0;
ADSR<MOZZI_CONTROL_RATE, MOZZI_AUDIO_RATE> mozziadsr_adsr; bool mozziadsr_adsr_l=0;
long node_mapper_out = 0;
long node_smooth_out = 0;
Smooth<int> smooth_smooth(0.95f);
long node_osc_out = 0;
Oscil<SAW2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_osc(SAW2048_DATA);
long node_filter_out = 0;
StateVariable<LOWPASS> mozzisvf_filter;
long node_vca_out = 0;
long node_out_out = 0;

void setup() {
    startMozzi();
    mozzimetronome_clock.start();
    mozziadsr_adsr.setADLevels((uint8_t)(long)255, (uint8_t)(long)128); mozziadsr_adsr.setTimes((unsigned int)(long)50, (unsigned int)(long)100, 65535, (unsigned int)(long)200);
}

void updateControl() {
    
}

AudioOutput updateAudio() {
    // Control logic moved to audio loop for node clock
    if(mozzimetronome_clock_lastbpm != (float)(long)120) { mozzimetronome_clock.setBPM((float)(long)120); mozzimetronome_clock_lastbpm = (float)(long)120;}
        node_clock_out = mozzimetronome_clock.ready() ? 255 : 0;
    // Control logic moved to audio loop for node adsr
    bool mozziadsr_adsr_tr=(long)node_clock_out>0;
        if(mozziadsr_adsr_tr && !mozziadsr_adsr_l){ mozziadsr_adsr.noteOn(); } else if(!mozziadsr_adsr_tr && mozziadsr_adsr_l){ mozziadsr_adsr.noteOff(); }
        mozziadsr_adsr_l=mozziadsr_adsr_tr;
        mozziadsr_adsr.update();
        node_adsr_out = mozziadsr_adsr.next();
    node_mapper_out = map((long)node_adsr_out, (long)0, (long)255, (long)400, (long)4000);
    // Control logic moved to audio loop for node smooth
    node_smooth_out = smooth_smooth.next((int)(long)node_mapper_out);
    node_osc_out = oscil_osc.next();
    // Control logic moved to audio loop for node osc
    oscil_osc.setFreq((float)(long)110);
    node_filter_out = mozzisvf_filter.next((int)(long)node_osc_out);
    // Control logic moved to audio loop for node filter
    mozzisvf_filter.setCentreFreq((unsigned int)(long)node_smooth_out);
        mozzisvf_filter.setResonance((uint8_t)(long)180);
    node_vca_out = ((int)(((long)node_filter_out * (long)node_adsr_out) >> 8));
    return MonoOutput::from8Bit((int)node_vca_out);
}

void loop() {
    audioHook();
}
