
#include <Mozzi.h>
#include <mozzi_rand.h>
#include <Metronome.h>
#include <Oscil.h>
#include <tables/sin2048_int8.h>


volatile int mozzinoise_n1_out = 0;
volatile int mozzimetronome_m1_out = 0;
volatile int mozzish_sh1_out = 0;
volatile int mozziquantizer_q1_out = 0;
volatile int mozzisin_osc1_out = 0;
Metronome mozzimetronome_m1;
int mozzish_sh1_val=0; bool mozzish_sh1_l=0;
int mozziquantizer_q1_sc[]={0,2,4,5,7,9,11,12};
Oscil<SIN2048_NUM_CELLS, AUDIO_RATE> mozzisin_osc1(SIN2048_DATA);

void setup() {
	randSeed();
	mozzimetronome_m1.start();
	startMozzi(CONTROL_RATE);
}

void updateControl() {
	mozzimetronome_m1.setBPM((float)180);
	mozzimetronome_m1_out = mozzimetronome_m1.ready() ? 255 : 0;
	if((int)mozzimetronome_m1_out>0 && !mozzish_sh1_l){mozzish_sh1_val=(int)mozzinoise_n1_out; mozzish_sh1_l=1;}else if((int)mozzimetronome_m1_out==0)mozzish_sh1_l=0;
	mozzish_sh1_out=mozzish_sh1_val;
	int mozziquantizer_q1_r=(int)abs(mozzish_sh1_out)/85; mozziquantizer_q1_out=mozziquantizer_q1_sc[mozziquantizer_q1_r%7]+((mozziquantizer_q1_r/7)*12)+48;
	mozzisin_osc1.setFreq((float)mozziquantizer_q1_out);
}

AudioOutput updateAudio() {
	mozzinoise_n1_out = (int8_t)((xorshift96()>>24)-128);
	mozzisin_osc1_out = mozzisin_osc1.next();
	return MonoOutput::from8Bit((int)mozzisin_osc1_out);
}

void loop() {
	audioHook();
}
