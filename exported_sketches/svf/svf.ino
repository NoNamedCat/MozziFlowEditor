
#include <Mozzi.h>
#include <mozzi_rand.h>
#include <Oscil.h>
#include <tables/sin2048_int8.h>
#include <StateVariable.h>


volatile int mozzinoise_noise_out = 0;
volatile int mozzisin_lfo_out = 0;
volatile int mozzimap_map_out = 0;
volatile int mozzisvf_f1_out = 0;
Oscil<SIN2048_NUM_CELLS, CONTROL_RATE> mozzisin_lfo(SIN2048_DATA);
StateVariable<LOWPASS> mozzisvf_f1;

void setup() {
	randSeed();
	startMozzi(CONTROL_RATE);
}

void updateControl() {
	mozzisin_lfo.setFreq((float)1.3);
	mozzisin_lfo_out = mozzisin_lfo.next();
	mozzimap_map_out = map((int)mozzisin_lfo_out, (int)-128, (int)127, (int)400, (int)3500);
	mozzisvf_f1.setCentreFreq((int)mozzimap_map_out);
	mozzisvf_f1.setResonance((uint8_t)150);
}

AudioOutput updateAudio() {
	mozzinoise_noise_out = (int8_t)((xorshift96()>>24)-128);
	mozzisvf_f1_out = mozzisvf_f1.next((int)mozzinoise_noise_out);
	return MonoOutput::from8Bit((int)mozzisvf_f1_out);
}

void loop() {
	audioHook();
}
