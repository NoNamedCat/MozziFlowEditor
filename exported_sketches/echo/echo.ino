
#include <Mozzi.h>
#include <Oscil.h>
#include <tables/saw2048_int8.h>
#include <Metronome.h>
#include <ADSR.h>
#include <mozzi_fixmath.h>
#include <AudioDelayFeedback.h>


volatile int mozzisaw_s1_out = 0;
volatile int mozzimetronome_metro_out = 0;
volatile int mozziadsr_adsr_out = 0;
volatile int mozziadsr_adsr_act = 0;
volatile int mozzigain_g1_out = 0;
volatile int mozzidelayfb_del_out = 0;
Oscil<SAW2048_NUM_CELLS, AUDIO_RATE> mozzisaw_s1(SAW2048_DATA);
Metronome mozzimetronome_metro;
ADSR<CONTROL_RATE, AUDIO_RATE> mozziadsr_adsr; bool mozziadsr_adsr_l=0;
AudioDelayFeedback<512, LINEAR, int> mozzidelayfb_del;

void setup() {
	mozzimetronome_metro.start();
	startMozzi(CONTROL_RATE);
}

void updateControl() {
	mozzisaw_s1.setFreq((float)110);
	mozzimetronome_metro.setBPM((float)60);
	mozzimetronome_metro_out = mozzimetronome_metro.ready() ? 255 : 0;
	bool mozziadsr_adsr_tr=(int)mozzimetronome_metro_out>0;
	if(mozziadsr_adsr_tr && !mozziadsr_adsr_l){ mozziadsr_adsr.noteOn((int)0>0); } else if(!mozziadsr_adsr_tr && mozziadsr_adsr_l){ mozziadsr_adsr.noteOff(); }
	mozziadsr_adsr_l=mozziadsr_adsr_tr;
	mozziadsr_adsr.setADLevels((uint8_t)255, (uint8_t)128);
	mozziadsr_adsr.setTimes((unsigned int)10, (unsigned int)50, 65535, (unsigned int)50);
	mozziadsr_adsr.update();
	mozziadsr_adsr_act = mozziadsr_adsr.playing() ? 255 : 0;
	mozzidelayfb_del.setFeedbackLevel((int8_t)((int)180 - 128));
	mozzidelayfb_del.setDelayTimeCells((uint16_t)1024);
}

AudioOutput updateAudio() {
	mozzisaw_s1_out = mozzisaw_s1.next();
	mozziadsr_adsr_out = mozziadsr_adsr.next();
	mozzigain_g1_out = (int)(((long)mozzisaw_s1_out * (int)mozziadsr_adsr_out) >> 8);
	mozzidelayfb_del_out = mozzidelayfb_del.next((int)mozzigain_g1_out);
	return MonoOutput::from8Bit((int)mozzidelayfb_del_out);
}

void loop() {
	audioHook();
}
