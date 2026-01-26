
#include <Mozzi.h>
#include <Oscil.h>
#include <tables/sin2048_int8.h>


volatile int mozzisin_mod_out = 0;
volatile int mozzigain_gain_out = 0;
volatile int mozzisin_car_out = 0;
Oscil<SIN2048_NUM_CELLS, CONTROL_RATE> mozzisin_mod(SIN2048_DATA);
Oscil<SIN2048_NUM_CELLS, AUDIO_RATE> mozzisin_car(SIN2048_DATA);

void setup() {
	startMozzi(CONTROL_RATE);
}

void updateControl() {
	mozzisin_mod.setFreq((float)5);
	mozzisin_mod_out = mozzisin_mod.next();
	mozzigain_gain_out = (int)(((long)mozzisin_mod_out * (int)100) >> 8);
	mozzisin_car.setFreq((float)mozzigain_gain_out);
}

AudioOutput updateAudio() {
	mozzisin_car_out = mozzisin_car.next();
	return MonoOutput::from8Bit((int)mozzisin_car_out);
}

void loop() {
	audioHook();
}
