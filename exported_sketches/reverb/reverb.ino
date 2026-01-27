// MOZZIFLOW v111.0 BALANCED CORE REFINED SKETCH
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
    mozziadsr_98uu.setADLevels((uint8_t)(long)255, (uint8_t)(long)128); mozziadsr_98uu.setTimes((unsigned int)(long)5, (unsigned int)(long)50, 65535, (unsigned int)(long)50);
}

void updateControl() {
    
}

AudioOutput updateAudio() {
    // Control logic moved to audio loop for node 2v0v
    if(mozzimetronome_2v0v_lastbpm != (float)(long)120) { mozzimetronome_2v0v.setBPM((float)(long)120); mozzimetronome_2v0v_lastbpm = (float)(long)120;}
        node_2v0v_out = mozzimetronome_2v0v.ready() ? 255 : 0;
    // Control logic moved to audio loop for node fy0x
    if((long)node_2v0v_out>0 && !mozzisequencer16_fy0x_l){ mozzisequencer16_fy0x_i++; if(mozzisequencer16_fy0x_i >= 16) mozzisequencer16_fy0x_i=0; mozzisequencer16_fy0x_l=1; } else if((long)node_2v0v_out==0) { mozzisequencer16_fy0x_l=0; }
        int mozzisequencer16_fy0x_arr[16] = {(int)(long)440,(int)(long)440,(int)(long)880,(int)(long)440,(int)(long)659,(int)(long)440,(int)(long)784,(int)(long)880,(int)(long)440,(int)(long)440,(int)(long)1318,(int)(long)880,(int)(long)440,(int)(long)440,(int)(long)880,(int)(long)659};
        node_fy0x_index = mozzisequencer16_fy0x_i;
        node_fy0x_out = mozzisequencer16_fy0x_arr[mozzisequencer16_fy0x_i];
    // Control logic moved to audio loop for node 98uu
    bool mozziadsr_98uu_tr=(long)node_2v0v_out>0;
        if(mozziadsr_98uu_tr && !mozziadsr_98uu_l){ mozziadsr_98uu.noteOn(); } else if(!mozziadsr_98uu_tr && mozziadsr_98uu_l){ mozziadsr_98uu.noteOff(); }
        mozziadsr_98uu_l=mozziadsr_98uu_tr;
        mozziadsr_98uu.update();
        node_98uu_out = mozziadsr_98uu.next();
    node_57t5_out = map((long)node_98uu_out, (long)0, (long)255, (long)0, (long)200);
    node_z3tz_out = oscil_z3tz.next();
    // Control logic moved to audio loop for node z3tz
    oscil_z3tz.setFreq((float)(long)node_fy0x_out);
    node_ss45_out = ((int)(((long)node_z3tz_out * (long)node_57t5_out) >> 8));
    node_44hy_out = ((int)(((long)node_ss45_out * (255 - (long)80) + (long)mozzireverb_44hy.next((int)(long)node_ss45_out) * (long)80) >> 8));
    return MonoOutput::from8Bit((int)node_44hy_out);
}

void loop() {
    audioHook();
}
