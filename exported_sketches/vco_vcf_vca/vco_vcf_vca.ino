
#include <Mozzi.h>
#include <Phasor.h>
#include <Oscil.h>
#include <tables/saw2048_int8.h>
#include <ADSR.h>
#include <ResonantFilter.h>


volatile int mozzipulse_tlk7_out = 0;
volatile int mozzisaw_q7rj_out = 0;
volatile int mozziadsr_rlfd_out = 0;
volatile int mozziadsr_rlfd_act = 0;
volatile int mozzimultires_zt91_low = 0;
volatile int mozzimultires_zt91_high = 0;
volatile int mozzimultires_zt91_band = 0;
volatile int mozzimultires_zt91_notch = 0;
volatile int mozzigain_4f9t_out = 0;
Phasor<CONTROL_RATE> mozzipulse_tlk7;
Oscil<SAW2048_NUM_CELLS, AUDIO_RATE> mozzisaw_q7rj(SAW2048_DATA);
ADSR<CONTROL_RATE, AUDIO_RATE> mozziadsr_rlfd; bool mozziadsr_rlfd_l=0;
MultiResonantFilter<uint8_t> mozzimultires_zt91;

void setup() {
	startMozzi(CONTROL_RATE);
}

void updateControl() {
	mozzipulse_tlk7.setFreq((float)1);
	mozzipulse_tlk7_out = (mozzipulse_tlk7.next() >> 24) < (int)120 ? 255 : 0;
	mozzisaw_q7rj.setFreq((float)110);
	bool mozziadsr_rlfd_tr=(int)mozzipulse_tlk7_out>0;
	if(mozziadsr_rlfd_tr && !mozziadsr_rlfd_l){ mozziadsr_rlfd.noteOn((int)0>0); } else if(!mozziadsr_rlfd_tr && mozziadsr_rlfd_l){ mozziadsr_rlfd.noteOff(); }
	mozziadsr_rlfd_l=mozziadsr_rlfd_tr;
	mozziadsr_rlfd.setADLevels((uint8_t)255, (uint8_t)150);
	mozziadsr_rlfd.setTimes((unsigned int)20, (unsigned int)200, 65535, (unsigned int)800);
	mozziadsr_rlfd.update();
	mozziadsr_rlfd_act = mozziadsr_rlfd.playing() ? 255 : 0;
	mozzimultires_zt91.setCutoffFreqAndResonance((uint8_t)mozziadsr_rlfd_out, (uint8_t)100);
}

AudioOutput updateAudio() {
	mozzisaw_q7rj_out = mozzisaw_q7rj.next();
	mozziadsr_rlfd_out = mozziadsr_rlfd.next();
	mozzimultires_zt91.next((int)mozzisaw_q7rj_out);
	mozzimultires_zt91_low = mozzimultires_zt91.low();
	mozzimultires_zt91_high = mozzimultires_zt91.high();
	mozzimultires_zt91_band = mozzimultires_zt91.band();
	mozzimultires_zt91_notch = mozzimultires_zt91.notch();
	mozzigain_4f9t_out = (int)(((long)mozzimultires_zt91_low * (int)mozziadsr_rlfd_out) >> 8);
	return MonoOutput::from8Bit((int)mozzigain_4f9t_out);
}

void loop() {
	audioHook();
}
