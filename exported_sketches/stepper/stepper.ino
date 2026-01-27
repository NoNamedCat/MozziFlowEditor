// MOZZIFLOW v110.9 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <Metronome.h>
#include <tables/saw2048_int8.h>
#include <ResonantFilter.h>

// GLOBALS
long node_clock_out = 0;
Metronome mozzimetronome_clock; float mozzimetronome_clock_lastbpm = 0;
long node_seq_out = 0;
long node_seq_index = 0;
byte mozzisequencer_seq_i=0; bool mozzisequencer_seq_l=0;
long node_osc_out = 0;
Oscil<SAW2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_osc(SAW2048_DATA);
long node_lpf_out = 0;
LowPassFilter mozzilpf_lpf;
long node_out_out = 0;

void setup() {
    startMozzi();
    mozzimetronome_clock.start();
}

void updateControl() {
    
}

AudioOutput updateAudio() {
    // Control logic moved to audio loop for node clock
    if(mozzimetronome_clock_lastbpm != (float)180) { mozzimetronome_clock.setBPM((float)180); mozzimetronome_clock_lastbpm = (float)180;}
        node_clock_out = mozzimetronome_clock.ready() ? 255 : 0;
    // Control logic moved to audio loop for node seq
    if((int)node_clock_out>0 && !mozzisequencer_seq_l){ mozzisequencer_seq_i++; if(mozzisequencer_seq_i >= 8) mozzisequencer_seq_i=0; mozzisequencer_seq_l=1; } else if((int)node_clock_out==0) { mozzisequencer_seq_l=0; }
        int mozzisequencer_seq_arr[8] = {36,48,36,48,36,48,36,48};
        node_seq_index = mozzisequencer_seq_i;
        node_seq_out = mozzisequencer_seq_arr[mozzisequencer_seq_i];
    node_osc_out = oscil_osc.next();
    // Control logic moved to audio loop for node osc
    oscil_osc.setFreq((float)node_sm_out);
    node_lpf_out = mozzilpf_lpf.next((int)node_osc_out);
    // Control logic moved to audio loop for node lpf
    mozzilpf_lpf.setCutoffFreqAndResonance((uint8_t)node_seq_out, (uint8_t)0);
    return MonoOutput::from8Bit((int)node_lpf_out);
}

void loop() {
    audioHook();
}
