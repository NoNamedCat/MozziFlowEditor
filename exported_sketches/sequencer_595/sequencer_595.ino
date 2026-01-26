
#include <Mozzi.h>
#include <Metronome.h>
#include <mozzi_analog.h>
#include <Smooth.h>
#include <Oscil.h>
#include <tables/sin2048_int8.h>


volatile int mozzimetronome_m1_out = 0;
volatile int mozziasyncanalog_pot1_out = 0;
volatile int mozzismooth_sm1_out = 0;
volatile int mul_mul1_out = 0;
volatile int add_add1_out = 0;
volatile int mux40511_mux1_ch0 = 0;
volatile int mux40511_mux1_ch1 = 0;
volatile int mux40511_mux1_ch2 = 0;
volatile int mux40511_mux1_ch3 = 0;
volatile int mux40511_mux1_ch4 = 0;
volatile int mux40511_mux1_ch5 = 0;
volatile int mux40511_mux1_ch6 = 0;
volatile int mux40511_mux1_ch7 = 0;
volatile int mozzisequencer_seq1_out = 0;
volatile int mozzisequencer_seq1_index = 0;
volatile int onehot_dec1_out = 0;
volatile int mozzisin_osc1_out = 0;
Metronome mozzimetronome_m1;
Smooth<long> mozzismooth_sm1(0.95f);
int mux40511_mux1_v[8]; byte mux40511_mux1_i=0;
int mozzisequencer_seq1_s[8]={0}; byte mozzisequencer_seq1_i=0; bool mozzisequencer_seq1_l=0;
Oscil<SIN2048_NUM_CELLS, AUDIO_RATE> mozzisin_osc1(SIN2048_DATA);

void setup() {
	mozzimetronome_m1.start();
	pinMode(2,OUTPUT);pinMode(3,OUTPUT);pinMode(4,OUTPUT);
	pinMode(11, OUTPUT); pinMode(12, OUTPUT); pinMode(13, OUTPUT);
	startMozzi(CONTROL_RATE);
}

void updateControl() {
	mozzimetronome_m1.setBPM((float)240);
	mozzimetronome_m1_out = mozzimetronome_m1.ready() ? 255 : 0;
	mozziasyncanalog_pot1_out = mozziAnalogRead(A1);
	float mozzismooth_sm1_sm = (float)0.95; if(mozzismooth_sm1_sm<0.0f)mozzismooth_sm1_sm=0.0f; if(mozzismooth_sm1_sm>0.99f)mozzismooth_sm1_sm=0.99f; mozzismooth_sm1.setSmoothness(mozzismooth_sm1_sm);
	mozzismooth_sm1_out = mozzismooth_sm1.next((long)mozziasyncanalog_pot1_out);
	mul_mul1_out = (int)((long)mozzismooth_sm1_out * (int)2);
	add_add1_out = (int)mul_mul1_out + (int)1;
	digitalWrite(2,mux40511_mux1_i&1);digitalWrite(3,(mux40511_mux1_i>>1)&1);digitalWrite(4,(mux40511_mux1_i>>2)&1);
	mux40511_mux1_v[mux40511_mux1_i]=mozziAnalogRead(A0); mux40511_mux1_i=(mux40511_mux1_i+1)&7;
	mux40511_mux1_ch0=mux40511_mux1_v[0]; mux40511_mux1_ch1=mux40511_mux1_v[1]; mux40511_mux1_ch2=mux40511_mux1_v[2]; mux40511_mux1_ch3=mux40511_mux1_v[3]; mux40511_mux1_ch4=mux40511_mux1_v[4]; mux40511_mux1_ch5=mux40511_mux1_v[5]; mux40511_mux1_ch6=mux40511_mux1_v[6]; mux40511_mux1_ch7=mux40511_mux1_v[7];
	int mozzisequencer_seq1_len=(int)add_add1_out; if(mozzisequencer_seq1_len<1)mozzisequencer_seq1_len=1; if(mozzisequencer_seq1_len>8)mozzisequencer_seq1_len=8;
	mozzisequencer_seq1_s[0]=(int)mux40511_mux1_ch0;
	mozzisequencer_seq1_s[1]=(int)mux40511_mux1_ch1;
	mozzisequencer_seq1_s[2]=(int)mux40511_mux1_ch2;
	mozzisequencer_seq1_s[3]=(int)mux40511_mux1_ch3;
	mozzisequencer_seq1_s[4]=(int)mux40511_mux1_ch4;
	mozzisequencer_seq1_s[5]=(int)mux40511_mux1_ch5;
	mozzisequencer_seq1_s[6]=(int)mux40511_mux1_ch6;
	mozzisequencer_seq1_s[7]=(int)mux40511_mux1_ch7;
	if(mozzisequencer_seq1_i >= mozzisequencer_seq1_len) mozzisequencer_seq1_i=0;
	if((int)mozzimetronome_m1_out>0 && !mozzisequencer_seq1_l){ mozzisequencer_seq1_i++; if(mozzisequencer_seq1_i >= mozzisequencer_seq1_len) mozzisequencer_seq1_i=0; mozzisequencer_seq1_l=1; }else if((int)mozzimetronome_m1_out==0) mozzisequencer_seq1_l=0;
	mozzisequencer_seq1_out=mozzisequencer_seq1_s[mozzisequencer_seq1_i]; mozzisequencer_seq1_index=mozzisequencer_seq1_i;
	onehot_dec1_out = 1 << ((int)mozzisequencer_seq1_index & 31);
	digitalWrite(12, LOW); shiftOut(11, 13, MSBFIRST, (uint8_t)onehot_dec1_out); digitalWrite(12, HIGH);
	mozzisin_osc1.setFreq((float)mozzisequencer_seq1_out);
}

AudioOutput updateAudio() {
	mozzisin_osc1_out = mozzisin_osc1.next();
	return MonoOutput::from8Bit((int)mozzisin_osc1_out);
}

void loop() {
	audioHook();
}
