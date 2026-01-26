
#include <Mozzi.h>
#include <Oscil.h>
#include <tables/sin2048_int8.h>


volatile int floatconstant_l4uz_out = 0;
volatile int mozzisin_d0ol_out = 0;
volatile int mozzigain_ki7e_out = 0;
volatile int mozzisin_jrnp_out = 0;
volatile int shr_lbq6_out = 0;
Oscil<SIN2048_NUM_CELLS, AUDIO_RATE> mozzisin_d0ol(SIN2048_DATA);
Oscil<SIN2048_NUM_CELLS, AUDIO_RATE> mozzisin_jrnp(SIN2048_DATA);

void setup() {
	startMozzi(CONTROL_RATE);
}

void updateControl() {
	mozzisin_d0ol.setFreq((float)0);
	mozzisin_jrnp.setFreq((float)440);
}

AudioOutput updateAudio() {
	mozzisin_d0ol_out = mozzisin_d0ol.next();
	mozzigain_ki7e_out = (int)(((long)mozzisin_d0ol_out * (int)150) >> 8);
	mozzisin_jrnp_out = mozzisin_jrnp.phMod((long)mozzigain_ki7e_out);
	shr_lbq6_out = (int)mozzisin_jrnp_out >> (int)1;
	return MonoOutput::from8Bit((int)shr_lbq6_out);
}

void loop() {
	audioHook();
}
