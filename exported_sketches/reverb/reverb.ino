
#include <Mozzi.h>
#include <Metronome.h>
#include <ADSR.h>
#include <Oscil.h>
#include <tables/saw2048_int8.h>
#include <ReverbTank.h>


volatile int mozzimetronome_7rxd_out = 0;
volatile int mozzisequencer16_8zre_out = 0;
volatile int mozzisequencer16_8zre_index = 0;
volatile int mozziadsr_r9wp_out = 0;
volatile int mozziadsr_r9wp_act = 0;
volatile int mozzisaw_5tdl_out = 0;
volatile int mozzimap_gk10_out = 0;
volatile int mozzigain_s37v_out = 0;
volatile int mozzireverb_8idx_out = 0;
Metronome mozzimetronome_7rxd;
int mozzisequencer16_8zre_s[16]={0}; byte mozzisequencer16_8zre_i=0; bool mozzisequencer16_8zre_l=0;
ADSR<CONTROL_RATE, AUDIO_RATE> mozziadsr_r9wp; bool mozziadsr_r9wp_l=0;
Oscil<SAW2048_NUM_CELLS, AUDIO_RATE> mozzisaw_5tdl(SAW2048_DATA);
ReverbTank mozzireverb_8idx;

void setup() {
	mozzimetronome_7rxd.start();
	startMozzi(CONTROL_RATE);
}

void updateControl() {
	mozzimetronome_7rxd.setBPM((float)120);
	mozzimetronome_7rxd_out = mozzimetronome_7rxd.ready() ? 255 : 0;
	int mozzisequencer16_8zre_len=(int)16; if(mozzisequencer16_8zre_len<1)mozzisequencer16_8zre_len=1; if(mozzisequencer16_8zre_len>16)mozzisequencer16_8zre_len=16;
	mozzisequencer16_8zre_s[0]=(int)440;
	mozzisequencer16_8zre_s[1]=(int)440;
	mozzisequencer16_8zre_s[2]=(int)880;
	mozzisequencer16_8zre_s[3]=(int)440;
	mozzisequencer16_8zre_s[4]=(int)659;
	mozzisequencer16_8zre_s[5]=(int)440;
	mozzisequencer16_8zre_s[6]=(int)784;
	mozzisequencer16_8zre_s[7]=(int)880;
	mozzisequencer16_8zre_s[8]=(int)440;
	mozzisequencer16_8zre_s[9]=(int)440;
	mozzisequencer16_8zre_s[10]=(int)1318;
	mozzisequencer16_8zre_s[11]=(int)880;
	mozzisequencer16_8zre_s[12]=(int)440;
	mozzisequencer16_8zre_s[13]=(int)440;
	mozzisequencer16_8zre_s[14]=(int)880;
	mozzisequencer16_8zre_s[15]=(int)659;
	if(mozzisequencer16_8zre_i >= mozzisequencer16_8zre_len) mozzisequencer16_8zre_i=0;
	if((int)mozzimetronome_7rxd_out>0 && !mozzisequencer16_8zre_l){ mozzisequencer16_8zre_i++; if(mozzisequencer16_8zre_i >= mozzisequencer16_8zre_len) mozzisequencer16_8zre_i=0; mozzisequencer16_8zre_l=1; }else if((int)mozzimetronome_7rxd_out==0) mozzisequencer16_8zre_l=0;
	mozzisequencer16_8zre_out=mozzisequencer16_8zre_s[mozzisequencer16_8zre_i]; mozzisequencer16_8zre_index=mozzisequencer16_8zre_i;
	bool mozziadsr_r9wp_tr=(int)mozzimetronome_7rxd_out>0;
	if(mozziadsr_r9wp_tr && !mozziadsr_r9wp_l){ mozziadsr_r9wp.noteOn((int)0>0); } else if(!mozziadsr_r9wp_tr && mozziadsr_r9wp_l){ mozziadsr_r9wp.noteOff(); }
	mozziadsr_r9wp_l=mozziadsr_r9wp_tr;
	mozziadsr_r9wp.setADLevels((uint8_t)255, (uint8_t)128);
	mozziadsr_r9wp.setTimes((unsigned int)5, (unsigned int)100, 65535, (unsigned int)50);
	mozziadsr_r9wp.update();
	mozziadsr_r9wp_act = mozziadsr_r9wp.playing() ? 255 : 0;
	mozzisaw_5tdl.setFreq((float)mozzisequencer16_8zre_out);
	mozzimap_gk10_out = map((int)mozziadsr_r9wp_out, (int)0, (int)255, (int)0, (int)255);
	mozzireverb_8idx.setFeebackLevel((int8_t)((int)180 - 128));
	mozzireverb_8idx.setEarlyReflections((int8_t)37, (int8_t)77, (int8_t)127);
	mozzireverb_8idx.setLoopDelays((int8_t)117, (uint8_t)255);
}

AudioOutput updateAudio() {
	mozziadsr_r9wp_out = mozziadsr_r9wp.next();
	mozzisaw_5tdl_out = mozzisaw_5tdl.next();
	mozzigain_s37v_out = (int)(((long)mozzisaw_5tdl_out * (int)mozzimap_gk10_out) >> 8);
	int mozzireverb_8idx_wet = mozzireverb_8idx.next((int)mozzigain_s37v_out);
	mozzireverb_8idx_out = (int)((((long)mozzigain_s37v_out * (255 - (int)127)) + ((long)mozzireverb_8idx_wet * (int)127)) >> 8);
	return MonoOutput::from8Bit((int)mozzireverb_8idx_out);
}

void loop() {
	audioHook();
}
