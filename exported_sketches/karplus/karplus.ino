
#include <Mozzi.h>
#include <Phasor.h>
#include <mozzi_rand.h>
#include <ADSR.h>
#include <mozzi_fixmath.h>
#include <AudioDelayFeedback.h>


volatile int mozzipulse_gd5c_out = 0;
volatile int mozzinoise_5p0r_out = 0;
volatile int mozziadsr_8umu_out = 0;
volatile int mozziadsr_8umu_act = 0;
volatile int mozzigain_v0oj_out = 0;
volatile int mozzidelayfb_ekdc_out = 0;
Phasor<CONTROL_RATE> mozzipulse_gd5c;
ADSR<CONTROL_RATE, AUDIO_RATE> mozziadsr_8umu; bool mozziadsr_8umu_l=0;
AudioDelayFeedback<512, LINEAR, int> mozzidelayfb_ekdc;

void setup() {
	randSeed();
	startMozzi(CONTROL_RATE);
}

void updateControl() {
	mozzipulse_gd5c.setFreq((float)1);
	mozzipulse_gd5c_out = (mozzipulse_gd5c.next() >> 24) < (int)30 ? 255 : 0;
	bool mozziadsr_8umu_tr=(int)mozzipulse_gd5c_out>0;
	if(mozziadsr_8umu_tr && !mozziadsr_8umu_l){ mozziadsr_8umu.noteOn((int)1>0); } else if(!mozziadsr_8umu_tr && mozziadsr_8umu_l){ mozziadsr_8umu.noteOff(); }
	mozziadsr_8umu_l=mozziadsr_8umu_tr;
	mozziadsr_8umu.setADLevels((uint8_t)255, (uint8_t)0);
	mozziadsr_8umu.setTimes((unsigned int)0, (unsigned int)60, 65535, (unsigned int)50);
	mozziadsr_8umu.update();
	mozziadsr_8umu_act = mozziadsr_8umu.playing() ? 255 : 0;
	mozzidelayfb_ekdc.setFeedbackLevel((int8_t)((int)255 - 128));
	mozzidelayfb_ekdc.setDelayTimeCells((uint16_t)140);
}

AudioOutput updateAudio() {
	mozzinoise_5p0r_out = (int8_t)((xorshift96()>>24)-128);
	mozziadsr_8umu_out = mozziadsr_8umu.next();
	mozzigain_v0oj_out = (int)(((long)mozzinoise_5p0r_out * (int)mozziadsr_8umu_out) >> 8);
	mozzidelayfb_ekdc_out = mozzidelayfb_ekdc.next((int)mozzigain_v0oj_out);
	return MonoOutput::from8Bit((int)mozzidelayfb_ekdc_out);
}

void loop() {
	audioHook();
}
