// MOZZIFLOW v111.0 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <FixMath.h>
#include <Metronome.h>

// GLOBALS
long node_clock_out = 0;
Metronome mozzimetronome_clock; float mozzimetronome_clock_lastbpm = 0;
long node_seq_out = 0;
long node_seq_index = 0;
byte mozzisequencer_seq_i=0; bool mozzisequencer_seq_l=0;
long node_out595_out = 0;

void setup() {
    startMozzi();
    mozzimetronome_clock.start();
    pinMode(11, OUTPUT); pinMode(12, OUTPUT); pinMode(13, OUTPUT);
}

void updateControl() {
    if(mozzimetronome_clock_lastbpm != (float)(long)120) { mozzimetronome_clock.setBPM((float)(long)120); mozzimetronome_clock_lastbpm = (float)(long)120;}
        node_clock_out = mozzimetronome_clock.ready() ? 255 : 0;
    if((long)node_clock_out>0 && !mozzisequencer_seq_l){ mozzisequencer_seq_i++; if(mozzisequencer_seq_i >= 8) mozzisequencer_seq_i=0; mozzisequencer_seq_l=1; } else if((long)node_clock_out==0) { mozzisequencer_seq_l=0; }
        int mozzisequencer_seq_arr[8] = {(int)(long)1,(int)(long)2,(int)(long)4,(int)(long)8,(int)(long)16,(int)(long)32,(int)(long)64,(int)(long)128};
        node_seq_index = mozzisequencer_seq_i;
        node_seq_out = mozzisequencer_seq_arr[mozzisequencer_seq_i];
    digitalWrite(12, LOW); shiftOut(11, 13, MSBFIRST, (uint8_t)node_seq_out); digitalWrite(12, HIGH);
}

AudioOutput updateAudio() {
    
    return MonoOutput::from8Bit(0);
}

void loop() {
    audioHook();
}
