
#include <Mozzi.h>
#include <mozzi_analog.h>
#include <Smooth.h>
#include <Oscil.h>
#include <tables/sin2048_int8.h>


volatile int mozziasyncanalog_pot1_out = 0;
volatile int mozzismooth_sm1_out = 0;
volatile int mozziquantizer_q1_out = 0;
volatile int mozzisin_osc1_out = 0;
Smooth<long> mozzismooth_sm1(0.95f);
int mozziquantizer_q1_sc[]={0,2,4,5,7,9,11,12};
Oscil<SIN2048_NUM_CELLS, AUDIO_RATE> mozzisin_osc1(SIN2048_DATA);

void setup() {
	startMozzi(CONTROL_RATE);
}

void updateControl() {
	mozziasyncanalog_pot1_out = mozziAnalogRead(A0);
	float mozzismooth_sm1_sm = (float)0.9; if(mozzismooth_sm1_sm<0.0f)mozzismooth_sm1_sm=0.0f; if(mozzismooth_sm1_sm>0.99f)mozzismooth_sm1_sm=0.99f; mozzismooth_sm1.setSmoothness(mozzismooth_sm1_sm);
	mozzismooth_sm1_out = mozzismooth_sm1.next((long)mozziasyncanalog_pot1_out);
	int mozziquantizer_q1_r=(int)abs(mozzismooth_sm1_out)/85; mozziquantizer_q1_out=mozziquantizer_q1_sc[mozziquantizer_q1_r%7]+((mozziquantizer_q1_r/7)*12)+48;
	mozzisin_osc1.setFreq((float)mozziquantizer_q1_out);
}

AudioOutput updateAudio() {
	mozzisin_osc1_out = mozzisin_osc1.next();
	return MonoOutput::from8Bit((int)mozzisin_osc1_out);
}

void loop() {
	audioHook();
}
