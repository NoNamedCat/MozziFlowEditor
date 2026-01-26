
#include <Mozzi.h>
#include <Metronome.h>
#include <Sample.h>
#include <tables/sin2048_int8.h>
#include <DCfilter.h>


volatile int mozzimetronome_m1_out = 0;
volatile int mozzisample_kick_out = 0;
volatile int mozzigain_gain_out = 0;
volatile int mozzidcfilter_dcf_out = 0;
Metronome mozzimetronome_m1;
int mozzisample_kick_last_trig = 0;
Sample<2048, AUDIO_RATE> mozzisample_kick(SIN2048_DATA);
DCfilter mozzidcfilter_dcf(0.99f);

void setup() {
	mozzimetronome_m1.start();
	startMozzi(CONTROL_RATE);
}

void updateControl() {
	mozzimetronome_m1.setBPM((float)124);
	mozzimetronome_m1_out = mozzimetronome_m1.ready() ? 255 : 0;
	mozzisample_kick.setFreq((float)1.0);
	if((int)mozzimetronome_m1_out > 0 && mozzisample_kick_last_trig == 0) mozzisample_kick.start();
	mozzisample_kick_last_trig = (int)mozzimetronome_m1_out;
}

AudioOutput updateAudio() {
	mozzisample_kick_out = mozzisample_kick.next();
	mozzigain_gain_out = (int)(((long)mozzisample_kick_out * (int)180) >> 8);
	mozzidcfilter_dcf_out = mozzidcfilter_dcf.next((int)mozzigain_gain_out);
	return MonoOutput::from8Bit((int)mozzidcfilter_dcf_out);
}

void loop() {
	audioHook();
}
