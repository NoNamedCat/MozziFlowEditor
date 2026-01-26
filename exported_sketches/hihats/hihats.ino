
#include <Mozzi.h>
#include <Metronome.h>
#include <mozzi_rand.h>
#include <StateVariable.h>
#include <Ead.h>


volatile int mozzimetronome_clock_out = 0;
volatile int mozzinoise_noise_out = 0;
volatile int mozzisvf_hpf_out = 0;
volatile int mozziead_env_out = 0;
volatile int mozzigain_vca_out = 0;
Metronome mozzimetronome_clock;
StateVariable<LOWPASS> mozzisvf_hpf;
Ead mozziead_env(CONTROL_RATE); bool mozziead_env_l=0;

void setup() {
	mozzimetronome_clock.start();
	randSeed();
	startMozzi(CONTROL_RATE);
}

void updateControl() {
	mozzimetronome_clock.setBPM((float)240);
	mozzimetronome_clock_out = mozzimetronome_clock.ready() ? 255 : 0;
	mozzisvf_hpf.setCentreFreq((int)8000);
	mozzisvf_hpf.setResonance((uint8_t)200);
	if((int)mozzimetronome_clock_out>0 && !mozziead_env_l){ mozziead_env.start((unsigned int)10, (unsigned int)200); mozziead_env_l=1; } else if((int)mozzimetronome_clock_out==0) mozziead_env_l=0;
	mozziead_env_out = mozziead_env.next();
}

AudioOutput updateAudio() {
	mozzinoise_noise_out = (int8_t)((xorshift96()>>24)-128);
	mozzisvf_hpf_out = mozzisvf_hpf.next((int)mozzinoise_noise_out);
	mozzigain_vca_out = (int)(((long)mozzisvf_hpf_out * (int)mozziead_env_out) >> 8);
	return MonoOutput::from8Bit((int)mozzigain_vca_out);
}

void loop() {
	audioHook();
}
