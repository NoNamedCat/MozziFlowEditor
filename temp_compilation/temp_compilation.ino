
#include <Mozzi.h>
#include <Oscil.h>
#include <tables/sin2048_int8.h>
#include <WavePacket.h>


Oscil<SIN2048_NUM_CELLS, AUDIO_RATE> mozzisin_l1(SIN2048_DATA);
Oscil<SIN2048_NUM_CELLS, AUDIO_RATE> mozzisin_l2(SIN2048_DATA);
WavePacket<DOUBLE> mozziwavepacket_wp1;
int mozzisin_l1_out = 0;
int mozzisin_l2_out = 0;
int mozzimap_m1_out = 0;
int mozzimap_m2_out = 0;
int mozziwavepacket_wp1_out = 0;

void setup() {
	mozzisin_l1.setFreq((float)0.1);
	mozzisin_l2.setFreq((float)0.15);
	startMozzi(CONTROL_RATE);
}

void updateControl() {
	mozzimap_m1_out = map((int)(mozzisin_l1.next()), (int)-128, (int)127, (int)50, (int)200);
	mozzimap_m2_out = map((int)(mozzisin_l2.next()), (int)-128, (int)127, (int)50, (int)1000);
	int mozziwavepacket_wp1_f = (int)mozzimap_m1_out; if(mozziwavepacket_wp1_f<1) mozziwavepacket_wp1_f=1; mozziwavepacket_wp1.set(mozziwavepacket_wp1_f, (int)mozzimap_m2_out, (int)440);
}

AudioOutput updateAudio() {
	mozziwavepacket_wp1_out = mozziwavepacket_wp1.next();
	return MonoOutput::from8Bit((int)mozziwavepacket_wp1_out);
}

void loop() {
	audioHook();
}
