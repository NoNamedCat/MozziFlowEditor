
#include <Mozzi.h>
#include <Metronome.h>
#include <Ead.h>
#include <Oscil.h>
#include <tables/sin2048_int8.h>


volatile int mozzimetronome_clock_out = 0;
volatile int mozziead_envpitch_out = 0;
volatile int mul_pamt_out = 0;
volatile int add_base_out = 0;
volatile int mozzisin_osc_out = 0;
volatile int mozziead_envamp_out = 0;
volatile int mozzigain_vca_out = 0;
Metronome mozzimetronome_clock;
Ead mozziead_envpitch(CONTROL_RATE); bool mozziead_envpitch_l=0;
Oscil<SIN2048_NUM_CELLS, AUDIO_RATE> mozzisin_osc(SIN2048_DATA);
Ead mozziead_envamp(CONTROL_RATE); bool mozziead_envamp_l=0;

void setup() {
	mozzimetronome_clock.start();
	startMozzi(CONTROL_RATE);
}

void updateControl() {
	mozzimetronome_clock.setBPM((float)110);
	mozzimetronome_clock_out = mozzimetronome_clock.ready() ? 255 : 0;
	if((int)mozzimetronome_clock_out>0 && !mozziead_envpitch_l){ mozziead_envpitch.start((unsigned int)10, (unsigned int)200); mozziead_envpitch_l=1; } else if((int)mozzimetronome_clock_out==0) mozziead_envpitch_l=0;
	mozziead_envpitch_out = mozziead_envpitch.next();
	mul_pamt_out = (int)((long)mozziead_envpitch_out * (int)150);
	add_base_out = (int)mul_pamt_out + (int)45;
	mozzisin_osc.setFreq((float)add_base_out);
	if((int)mozzimetronome_clock_out>0 && !mozziead_envamp_l){ mozziead_envamp.start((unsigned int)10, (unsigned int)200); mozziead_envamp_l=1; } else if((int)mozzimetronome_clock_out==0) mozziead_envamp_l=0;
	mozziead_envamp_out = mozziead_envamp.next();
}

AudioOutput updateAudio() {
	mozzisin_osc_out = mozzisin_osc.next();
	mozzigain_vca_out = (int)(((long)mozzisin_osc_out * (int)mozziead_envamp_out) >> 8);
	return MonoOutput::from8Bit((int)mozzigain_vca_out);
}

void loop() {
	audioHook();
}
