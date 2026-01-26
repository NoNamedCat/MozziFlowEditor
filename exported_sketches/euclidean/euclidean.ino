
#include <Mozzi.h>
#include <Metronome.h>
#include <Oscil.h>
#include <tables/sin2048_int8.h>
#include <Ead.h>


volatile int mozzimetronome_pulse_out = 0;
volatile int mozzisin_kick_out = 0;
volatile int mozziead_env_out = 0;
volatile int mozzigain_gain_out = 0;
Metronome mozzimetronome_pulse;
Oscil<SIN2048_NUM_CELLS, AUDIO_RATE> mozzisin_kick(SIN2048_DATA);
Ead mozziead_env(CONTROL_RATE); bool mozziead_env_l=0;

void setup() {
	mozzimetronome_pulse.start();
	startMozzi(CONTROL_RATE);
}

void updateControl() {
	mozzimetronome_pulse.setBPM((float)300);
	mozzimetronome_pulse_out = mozzimetronome_pulse.ready() ? 255 : 0;
	mozzisin_kick.setFreq((float)60);
	if((int)mozzimetronome_pulse_out>0 && !mozziead_env_l){ mozziead_env.start((unsigned int)10, (unsigned int)200); mozziead_env_l=1; } else if((int)mozzimetronome_pulse_out==0) mozziead_env_l=0;
	mozziead_env_out = mozziead_env.next();
}

AudioOutput updateAudio() {
	mozzisin_kick_out = mozzisin_kick.next();
	mozzigain_gain_out = (int)(((long)mozzisin_kick_out * (int)mozziead_env_out) >> 8);
	return MonoOutput::from8Bit((int)mozzigain_gain_out);
}

void loop() {
	audioHook();
}
