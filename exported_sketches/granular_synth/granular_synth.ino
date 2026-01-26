
#include <Mozzi.h>
#include <Oscil.h>
#include <tables/sin2048_int8.h>
#include <WavePacketSample.h>
#include <tables/sin8192_int8.h>
#include <DCfilter.h>


volatile int floatconstant_f1_out = 0;
volatile int floatconstant_f2_out = 0;
volatile int mozzilfosin_lfo1_out = 0;
volatile int mozzilfosin_lfo2_out = 0;
volatile int mozziwavepacketsample_wp1_out = 0;
volatile int mozzigain_gain1_out = 0;
volatile int mozzidcfilter_dcf_out = 0;
Oscil<SIN2048_NUM_CELLS, CONTROL_RATE> mozzilfosin_lfo1(SIN2048_DATA);
Oscil<SIN2048_NUM_CELLS, CONTROL_RATE> mozzilfosin_lfo2(SIN2048_DATA);
WavePacketSample<DOUBLE> mozziwavepacketsample_wp1;
DCfilter mozzidcfilter_dcf(0.99f);

void setup() {
	startMozzi(CONTROL_RATE);
}

void updateControl() {
	mozzilfosin_lfo1.setFreq((float)0);
	mozzilfosin_lfo1_out = mozzilfosin_lfo1.next();
	mozzilfosin_lfo2.setFreq((float)0);
	mozzilfosin_lfo2_out = mozzilfosin_lfo2.next();
	int f = (int)220; if(f<1) f=1; mozziwavepacketsample_wp1.set(f, (int)mozzilfosin_lfo2_out, (int)mozzilfosin_lfo1_out);
}

AudioOutput updateAudio() {
	mozziwavepacketsample_wp1_out = mozziwavepacketsample_wp1.next();
	mozzigain_gain1_out = (int)(((long)mozziwavepacketsample_wp1_out * (int)120) >> 8);
	mozzidcfilter_dcf_out = mozzidcfilter_dcf.next((int)mozzigain_gain1_out);
	return MonoOutput::from8Bit((int)mozzidcfilter_dcf_out);
}

void loop() {
	audioHook();
}
