// MOZZIFLOW v110.9 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <Metronome.h>
#include <mozzi_analog.h>
#include <tables/sin2048_int8.h>

// GLOBALS
long node_m1_out = 0;
Metronome mozzimetronome_m1; float mozzimetronome_m1_lastbpm = 0;
long node_mux1_ch0 = 0;
long node_mux1_ch1 = 0;
long node_mux1_ch2 = 0;
long node_mux1_ch3 = 0;
long node_mux1_ch4 = 0;
long node_mux1_ch5 = 0;
long node_mux1_ch6 = 0;
long node_mux1_ch7 = 0;
long node_mux1_out = 0;
int mux4051_1_mux1_v[8]; byte mux4051_1_mux1_c = 0;
long node_seq1_out = 0;
long node_seq1_index = 0;
byte mozzisequencer_seq1_i=0; bool mozzisequencer_seq1_l=0;
long node_osc1_out = 0;
Oscil<SIN2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_osc1(SIN2048_DATA);
long node_out1_out = 0;

void setup() {
    startMozzi();
    mozzimetronome_m1.start();
    pinMode(2, OUTPUT); pinMode(3, OUTPUT); pinMode(4, OUTPUT);
}

void updateControl() {
    
}

AudioOutput updateAudio() {
    // Control logic moved to audio loop for node m1
    if(mozzimetronome_m1_lastbpm != (float)240) { mozzimetronome_m1.setBPM((float)240); mozzimetronome_m1_lastbpm = (float)240;}
        node_m1_out = mozzimetronome_m1.ready() ? 255 : 0;
    // Control logic moved to audio loop for node mux1
    mux4051_1_mux1_v[mux4051_1_mux1_c] = mozziAnalogRead(A0);
        mux4051_1_mux1_c++; if(mux4051_1_mux1_c > 7) mux4051_1_mux1_c = 0;
        digitalWrite(2, (mux4051_1_mux1_c & 1)); digitalWrite(3, ((mux4051_1_mux1_c >> 1) & 1)); digitalWrite(4, ((mux4051_1_mux1_c >> 2) & 1));
        node_mux1_ch0 = mux4051_1_mux1_v[0]; node_mux1_ch1 = mux4051_1_mux1_v[1]; node_mux1_ch2 = mux4051_1_mux1_v[2]; node_mux1_ch3 = mux4051_1_mux1_v[3]; node_mux1_ch4 = mux4051_1_mux1_v[4]; node_mux1_ch5 = mux4051_1_mux1_v[5]; node_mux1_ch6 = mux4051_1_mux1_v[6]; node_mux1_ch7 = mux4051_1_mux1_v[7];
    // Control logic moved to audio loop for node seq1
    if((int)node_m1_out>0 && !mozzisequencer_seq1_l){ mozzisequencer_seq1_i++; if(mozzisequencer_seq1_i >= 8) mozzisequencer_seq1_i=0; mozzisequencer_seq1_l=1; } else if((int)node_m1_out==0) { mozzisequencer_seq1_l=0; }
        int mozzisequencer_seq1_arr[8] = {node_mux1_ch0,node_mux1_ch1,36,48,36,48,36,48};
        node_seq1_index = mozzisequencer_seq1_i;
        node_seq1_out = mozzisequencer_seq1_arr[mozzisequencer_seq1_i];
    node_osc1_out = oscil_osc1.next();
    // Control logic moved to audio loop for node osc1
    oscil_osc1.setFreq((float)node_seq1_out);
    return MonoOutput::from8Bit((int)node_osc1_out);
}

void loop() {
    audioHook();
}
