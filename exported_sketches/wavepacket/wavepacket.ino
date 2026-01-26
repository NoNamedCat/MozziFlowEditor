
#include <Mozzi.h>
#include <Oscil.h>
#include <tables/sin2048_int8.h>
#include <WavePacket.h>


volatile int mozzisin_l1_out = 0;
volatile int mozzisin_l2_out = 0;
volatile int mozzimap_m1_out = 0;
volatile int mozzimap_m2_out = 0;
volatile int mozziwavepacket_wp1_out = 0;
Oscil<SIN2048_NUM_CELLS, CONTROL_RATE> mozzisin_l1(SIN2048_DATA);
Oscil<SIN2048_NUM_CELLS, CONTROL_RATE> mozzisin_l2(SIN2048_DATA);
WavePacket<DOUBLE> mozziwavepacket_wp1;

void setup() {
	startMozzi(CONTROL_RATE);
}

void updateControl() {
	mozzisin_l1.setFreq((float)0.1);
	mozzisin_l1_out = mozzisin_l1.next();
	mozzisin_l2.setFreq((float)0.15);
	mozzisin_l2_out = mozzisin_l2.next();
	mozzimap_m1_out = map((int)mozzisin_l1_out, (int)-128, (int)127, (int)50, (int)200);
	mozzimap_m2_out = map((int)mozzisin_l2_out, (int)-128, (int)127, (int)50, (int)1000);
	int f = (int)mozzimap_m1_out; if(f<1) f=1; mozziwavepacket_wp1.set(f, (int)mozzimap_m2_out, (int)440);
}

AudioOutput updateAudio() {
	mozziwavepacket_wp1_out = mozziwavepacket_wp1.next();
	return MonoOutput::from8Bit((int)mozziwavepacket_wp1_out);
}

void loop() {
	audioHook();
}
