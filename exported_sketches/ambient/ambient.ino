
#include <Mozzi.h>
#include <Metronome.h>
#include <ADSR.h>
#include <Oscil.h>
#include <tables/saw2048_int8.h>
#include <ReverbTank.h>


volatile int mozzimetronome_metro_out = 0;
volatile int mozziadsr_adsr_out = 0;
volatile int mozziadsr_adsr_act = 0;
volatile int mozzisaw_saw_out = 0;
volatile int mozzigain_gain_out = 0;
volatile int mozzireverb_rev_out = 0;
Metronome mozzimetronome_metro;
ADSR<CONTROL_RATE, AUDIO_RATE> mozziadsr_adsr; bool mozziadsr_adsr_l=0;
Oscil<SAW2048_NUM_CELLS, AUDIO_RATE> mozzisaw_saw(SAW2048_DATA);
ReverbTank mozzireverb_rev;

void setup() {
	mozzimetronome_metro.start();
	startMozzi(CONTROL_RATE);
}

void updateControl() {
	mozzimetronome_metro.setBPM((float)60);
	mozzimetronome_metro_out = mozzimetronome_metro.ready() ? 255 : 0;
	bool mozziadsr_adsr_tr=(int)mozzimetronome_metro_out>0;
	if(mozziadsr_adsr_tr && !mozziadsr_adsr_l){ mozziadsr_adsr.noteOn((int)0>0); } else if(!mozziadsr_adsr_tr && mozziadsr_adsr_l){ mozziadsr_adsr.noteOff(); }
	mozziadsr_adsr_l=mozziadsr_adsr_tr;
	mozziadsr_adsr.setADLevels((uint8_t)255, (uint8_t)100);
	mozziadsr_adsr.setTimes((unsigned int)10, (unsigned int)100, 65535, (unsigned int)50);
	mozziadsr_adsr.update();
	mozziadsr_adsr_act = mozziadsr_adsr.playing() ? 255 : 0;
	mozzisaw_saw.setFreq((float)440);
	mozzireverb_rev.setFeebackLevel((int8_t)((int)85 - 128));
	mozzireverb_rev.setEarlyReflections((int8_t)37, (int8_t)77, (int8_t)127);
	mozzireverb_rev.setLoopDelays((int8_t)117, (uint8_t)255);
}

AudioOutput updateAudio() {
	mozziadsr_adsr_out = mozziadsr_adsr.next();
	mozzisaw_saw_out = mozzisaw_saw.next();
	mozzigain_gain_out = (int)(((long)mozzisaw_saw_out * (int)mozziadsr_adsr_out) >> 8);
	int mozzireverb_rev_wet = mozzireverb_rev.next((int)mozzigain_gain_out);
	mozzireverb_rev_out = (int)((((long)mozzigain_gain_out * (255 - (int)150)) + ((long)mozzireverb_rev_wet * (int)150)) >> 8);
	return MonoOutput::from8Bit((int)mozzireverb_rev_out);
}

void loop() {
	audioHook();
}
