
#include <Mozzi.h>
#include <Metronome.h>
#include <Smooth.h>
#include <Oscil.h>
#include <tables/saw2048_int8.h>
#include <ResonantFilter.h>


volatile int mozzimetronome_clock_out = 0;
volatile int mozzisequencer_seq_out = 0;
volatile int mozzisequencer_seq_index = 0;
volatile int mozziquantizer_quant_out = 0;
volatile int mozzismooth_smooth_out = 0;
volatile int mozzisaw_osc_out = 0;
volatile int mozzilpf_lpf_out = 0;
Metronome mozzimetronome_clock;
int mozzisequencer_seq_s[8]={0}; byte mozzisequencer_seq_i=0; bool mozzisequencer_seq_l=0;
int mozziquantizer_quant_sc[]={0,2,4,5,7,9,11,12};
Smooth<long> mozzismooth_smooth(0.95f);
Oscil<SAW2048_NUM_CELLS, AUDIO_RATE> mozzisaw_osc(SAW2048_DATA);
LowPassFilter mozzilpf_lpf;

void setup() {
	mozzimetronome_clock.start();
	startMozzi(CONTROL_RATE);
}

void updateControl() {
	mozzimetronome_clock.setBPM((float)180);
	mozzimetronome_clock_out = mozzimetronome_clock.ready() ? 255 : 0;
	int mozzisequencer_seq_len=(int)8; if(mozzisequencer_seq_len<1)mozzisequencer_seq_len=1; if(mozzisequencer_seq_len>8)mozzisequencer_seq_len=8;
	mozzisequencer_seq_s[0]=(int)40;
	mozzisequencer_seq_s[1]=(int)50;
	mozzisequencer_seq_s[2]=(int)60;
	mozzisequencer_seq_s[3]=(int)45;
	mozzisequencer_seq_s[4]=(int)70;
	mozzisequencer_seq_s[5]=(int)30;
	mozzisequencer_seq_s[6]=(int)40;
	mozzisequencer_seq_s[7]=(int)80;
	if(mozzisequencer_seq_i >= mozzisequencer_seq_len) mozzisequencer_seq_i=0;
	if((int)mozzimetronome_clock_out>0 && !mozzisequencer_seq_l){ mozzisequencer_seq_i++; if(mozzisequencer_seq_i >= mozzisequencer_seq_len) mozzisequencer_seq_i=0; mozzisequencer_seq_l=1; }else if((int)mozzimetronome_clock_out==0) mozzisequencer_seq_l=0;
	mozzisequencer_seq_out=mozzisequencer_seq_s[mozzisequencer_seq_i]; mozzisequencer_seq_index=mozzisequencer_seq_i;
	int mozziquantizer_quant_r=(int)abs(mozzisequencer_seq_out)/85; mozziquantizer_quant_out=mozziquantizer_quant_sc[mozziquantizer_quant_r%7]+((mozziquantizer_quant_r/7)*12)+48;
	float mozzismooth_smooth_sm = (float)0.9; if(mozzismooth_smooth_sm<0.0f)mozzismooth_smooth_sm=0.0f; if(mozzismooth_smooth_sm>0.99f)mozzismooth_smooth_sm=0.99f; mozzismooth_smooth.setSmoothness(mozzismooth_smooth_sm);
	mozzismooth_smooth_out = mozzismooth_smooth.next((long)mozziquantizer_quant_out);
	mozzisaw_osc.setFreq((float)mozzismooth_smooth_out);
	mozzilpf_lpf.setCutoffFreq((uint8_t)mozzisequencer_seq_out);
}

AudioOutput updateAudio() {
	mozzisaw_osc_out = mozzisaw_osc.next();
	mozzilpf_lpf_out = mozzilpf_lpf.next((int)mozzisaw_osc_out);
	return MonoOutput::from8Bit((int)mozzilpf_lpf_out);
}

void loop() {
	audioHook();
}
