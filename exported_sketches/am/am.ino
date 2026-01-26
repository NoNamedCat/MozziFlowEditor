
#include <Mozzi.h>
#include <Oscil.h>
#include <tables/sin2048_int8.h>


volatile int mozzisin_car_out = 0;
volatile int mozzisin_mod_out = 0;
volatile int mul_mul_out = 0;
Oscil<SIN2048_NUM_CELLS, AUDIO_RATE> mozzisin_car(SIN2048_DATA);
Oscil<SIN2048_NUM_CELLS, AUDIO_RATE> mozzisin_mod(SIN2048_DATA);

void setup() {
	startMozzi(CONTROL_RATE);
}

void updateControl() {
	mozzisin_car.setFreq((float)440);
	mozzisin_mod.setFreq((float)4);
}

AudioOutput updateAudio() {
	mozzisin_car_out = mozzisin_car.next();
	mozzisin_mod_out = mozzisin_mod.next();
	mul_mul_out = (int)((long)mozzisin_car_out * (int)mozzisin_mod_out);
	return MonoOutput::from8Bit((int)mul_mul_out);
}

void loop() {
	audioHook();
}
