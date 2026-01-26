
#include <Mozzi.h>
#include <Oscil.h>
#include <tables/sin2048_int8.h>
#include <Phasor.h>


volatile int mozzisin_src_out = 0;
volatile int mozziphasor_ratephasor_out = 0;
volatile int mozzish_sh_out = 0;
Oscil<SIN2048_NUM_CELLS, AUDIO_RATE> mozzisin_src(SIN2048_DATA);
Phasor<AUDIO_RATE> mozziphasor_ratephasor;
int mozzish_sh_val=0; bool mozzish_sh_l=0;

void setup() {
	startMozzi(CONTROL_RATE);
}

void updateControl() {
	mozzisin_src.setFreq((float)110);
	mozziphasor_ratephasor.setFreq((float)400);
}

AudioOutput updateAudio() {
	mozzisin_src_out = mozzisin_src.next();
	mozziphasor_ratephasor_out = mozziphasor_ratephasor.next();
	if((int)mozziphasor_ratephasor_out>0 && !mozzish_sh_l){mozzish_sh_val=(int)mozzisin_src_out; mozzish_sh_l=1;}else if((int)mozziphasor_ratephasor_out==0)mozzish_sh_l=0;
	mozzish_sh_out=mozzish_sh_val;
	return MonoOutput::from8Bit((int)mozzish_sh_out);
}

void loop() {
	audioHook();
}
