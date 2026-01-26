
#include <Mozzi.h>
#include <Phasor.h>


volatile int mozziphasor_ph1_out = 0;
volatile int mozziphasor_ph2_out = 0;
volatile int sub_sub_out = 0;
Phasor<AUDIO_RATE> mozziphasor_ph1;
Phasor<AUDIO_RATE> mozziphasor_ph2;

void setup() {
	startMozzi(CONTROL_RATE);
}

void updateControl() {
	mozziphasor_ph1.setFreq((float)55);
	mozziphasor_ph2.setFreq((float)55.2);
}

AudioOutput updateAudio() {
	mozziphasor_ph1_out = mozziphasor_ph1.next();
	mozziphasor_ph2_out = mozziphasor_ph2.next();
	sub_sub_out = (int)mozziphasor_ph1_out - (int)mozziphasor_ph2_out;
	return MonoOutput::from8Bit((int)sub_sub_out);
}

void loop() {
	audioHook();
}
