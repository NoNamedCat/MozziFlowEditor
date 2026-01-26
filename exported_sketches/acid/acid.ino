
#include <Mozzi.h>
#include <Metronome.h>
#include <Ead.h>
#include <Oscil.h>
#include <tables/saw2048_int8.h>
#include <ResonantFilter.h>


volatile int mozzimetronome_aoov_out = 0;
volatile int mozziead_5auw_out = 0;
volatile int mozzisaw_3gcd_out = 0;
volatile int mozzimultires_cfnu_low = 0;
volatile int mozzimultires_cfnu_high = 0;
volatile int mozzimultires_cfnu_band = 0;
volatile int mozzimultires_cfnu_notch = 0;
volatile int shr_776e_out = 0;
Metronome mozzimetronome_aoov;
Ead mozziead_5auw(CONTROL_RATE); bool mozziead_5auw_l=0;
Oscil<SAW2048_NUM_CELLS, AUDIO_RATE> mozzisaw_3gcd(SAW2048_DATA);
MultiResonantFilter<uint8_t> mozzimultires_cfnu;

void setup() {
	mozzimetronome_aoov.start();
	startMozzi(CONTROL_RATE);
}

void updateControl() {
	mozzimetronome_aoov.setBPM((float)135);
	mozzimetronome_aoov_out = mozzimetronome_aoov.ready() ? 255 : 0;
	if((int)mozzimetronome_aoov_out>0 && !mozziead_5auw_l){ mozziead_5auw.start((unsigned int)10, (unsigned int)200); mozziead_5auw_l=1; } else if((int)mozzimetronome_aoov_out==0) mozziead_5auw_l=0;
	mozziead_5auw_out = mozziead_5auw.next();
	mozzisaw_3gcd.setFreq((float)55);
	mozzimultires_cfnu.setCutoffFreqAndResonance((uint8_t)mozziead_5auw_out, (uint8_t)220);
}

AudioOutput updateAudio() {
	mozzisaw_3gcd_out = mozzisaw_3gcd.next();
	mozzimultires_cfnu.next((int)mozzisaw_3gcd_out);
	mozzimultires_cfnu_low = mozzimultires_cfnu.low();
	mozzimultires_cfnu_high = mozzimultires_cfnu.high();
	mozzimultires_cfnu_band = mozzimultires_cfnu.band();
	mozzimultires_cfnu_notch = mozzimultires_cfnu.notch();
	shr_776e_out = (int)mozzimultires_cfnu_low >> (int)2;
	return MonoOutput::from8Bit((int)shr_776e_out);
}

void loop() {
	audioHook();
}
