// MOZZIFLOW v110.9 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <Metronome.h>
#include <ADSR.h>
#include <tables/saw2048_int8.h>
#include <ReverbTank.h>

// GLOBALS
long node_2v0v_out = 0;
Metronome mozzimetronome_2v0v; float mozzimetronome_2v0v_lastbpm = 0;
long node_fy0x_out = 0;
long node_fy0x_index = 0;
byte mozzisequencer16_fy0x_i=0; bool mozzisequencer16_fy0x_l=0;
long node_98uu_out = 0;
ADSR<MOZZI_CONTROL_RATE, MOZZI_AUDIO_RATE> mozziadsr_98uu; bool mozziadsr_98uu_l=0;
long node_57t5_out = 0;
long node_z3tz_out = 0;
Oscil<SAW2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_z3tz(SAW2048_DATA);
long node_ss45_out = 0;
long node_44hy_out = 0;
ReverbTank mozzireverb_44hy;
long node_f4uw_out = 0;

void setup() {
    startMozzi();
    mozzimetronome_2v0v.start();
    mozziadsr_98uu.setADLevels((uint8_t)255, (uint8_t)128); mozziadsr_98uu.setTimes((unsigned int)5, (unsigned int)50, 65535, (unsigned int)50);
}

void updateControl() {
    if(mozzimetronome_2v0v_lastbpm != (float)120) { mozzimetronome_2v0v.setBPM((float)120); mozzimetronome_2v0v_lastbpm = (float)120;}
        node_2v0v_out = mozzimetronome_2v0v.ready() ? 255 : 0;
    if((int)node_2v0v_out>0 && !mozzisequencer16_fy0x_l){ mozzisequencer16_fy0x_i++; if(mozzisequencer16_fy0x_i >= 16) mozzisequencer16_fy0x_i=0; mozzisequencer16_fy0x_l=1; } else if((int)node_2v0v_out==0) { mozzisequencer16_fy0x_l=0; }
        int mozzisequencer16_fy0x_arr[16] = {440,440,880,440,659,440,784,880,440,440,1318,880,440,440,880,659};
        node_fy0x_index = mozzisequencer16_fy0x_i;
        node_fy0x_out = mozzisequencer16_fy0x_arr[mozzisequencer16_fy0x_i];
}

AudioOutput updateAudio() {
    // Control logic moved to audio loop for node 98uu
    bool mozziadsr_98uu_tr=(int)node_2v0v_out>0;
        if(mozziadsr_98uu_tr && !mozziadsr_98uu_l){ mozziadsr_98uu.noteOn(); } else if(!mozziadsr_98uu_tr && mozziadsr_98uu_l){ mozziadsr_98uu.noteOff(); }
        mozziadsr_98uu_l=mozziadsr_98uu_tr;
        mozziadsr_98uu.update();
        node_98uu_out = mozziadsr_98uu.next();
    node_57t5_out = map((int)node_98uu_out, 0, 255, (int)0, (int)200);
    node_z3tz_out = oscil_z3tz.next();
    // Control logic moved to audio loop for node z3tz
    oscil_z3tz.setFreq((float)node_fy0x_out);
    node_ss45_out = ((int)(((long)node_z3tz_out * node_57t5_out) >> 8));
    node_44hy_out = ((int)(((long)node_ss45_out * (255 - 80) + (long)mozzireverb_44hy.next((int)node_ss45_out) * 80) >> 8));
    return MonoOutput::from8Bit((int)node_44hy_out);
}

void loop() {
    audioHook();
}
