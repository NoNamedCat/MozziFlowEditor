
#include <Mozzi.h>
#include <Oscil.h>
#include <tables/sin2048_int8.h>


volatile int mozzisin_s1_out = 0;
volatile int mozzisin_s2_out = 0;
volatile int mozzimixer2_mix_out = 0;
Oscil<SIN2048_NUM_CELLS, AUDIO_RATE> mozzisin_s1(SIN2048_DATA);
Oscil<SIN2048_NUM_CELLS, AUDIO_RATE> mozzisin_s2(SIN2048_DATA);

void setup() {
	startMozzi(CONTROL_RATE);
}

void updateControl() {
	mozzisin_s1.setFreq((float)220);
	mozzisin_s2.setFreq((float)220.5);
}

AudioOutput updateAudio() {
	mozzisin_s1_out = mozzisin_s1.next();
	mozzisin_s2_out = mozzisin_s2.next();
	mozzimixer2_mix_out = (int)mozzisin_s1_out + (int)mozzisin_s2_out;
	return MonoOutput::from8Bit((int)mozzimixer2_mix_out);
}

void loop() {
	audioHook();
}
