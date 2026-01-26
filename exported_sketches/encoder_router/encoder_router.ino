
#include <Mozzi.h>
#include <mozzi_analog.h>
#include <Oscil.h>
#include <tables/sin2048_int8.h>
#include <tables/saw2048_int8.h>


volatile int arduinoencoder_enc1_up = 0;
volatile int arduinoencoder_enc1_down = 0;
volatile int counter_cnt1_out = 0;
volatile int mozziasyncanalog_pot1_out = 0;
volatile int router_rout1_out0 = 0;
volatile int router_rout1_out1 = 0;
volatile int router_rout1_out2 = 0;
volatile int router_rout1_out3 = 0;
volatile int router_rout1_out4 = 0;
volatile int router_rout1_out5 = 0;
volatile int router_rout1_out6 = 0;
volatile int router_rout1_out7 = 0;
volatile int mozzisin_osc1_out = 0;
volatile int mozzisaw_osc2_out = 0;
volatile int mozzimixer2_mix1_out = 0;
bool arduinoencoder_enc1_lA=0; int arduinoencoder_enc1_u=0; int arduinoencoder_enc1_d=0;
int counter_cnt1_v=0; bool counter_cnt1_lU=0; bool counter_cnt1_lD=0;
int router_rout1_v[8]={0};
Oscil<SIN2048_NUM_CELLS, AUDIO_RATE> mozzisin_osc1(SIN2048_DATA);
Oscil<SAW2048_NUM_CELLS, AUDIO_RATE> mozzisaw_osc2(SAW2048_DATA);

void setup() {
	pinMode(2, INPUT_PULLUP); pinMode(3, INPUT_PULLUP);
	startMozzi(CONTROL_RATE);
}

void updateControl() {
	arduinoencoder_enc1_u=0; arduinoencoder_enc1_d=0; bool cA=digitalRead(2);
	if(cA!=arduinoencoder_enc1_lA && cA==LOW){if(digitalRead(3)!=cA) arduinoencoder_enc1_u=255; else arduinoencoder_enc1_d=255;}
	arduinoencoder_enc1_lA=cA;
	arduinoencoder_enc1_up=arduinoencoder_enc1_u; arduinoencoder_enc1_down=arduinoencoder_enc1_d;
	if((int)arduinoencoder_enc1_up>0 && !counter_cnt1_lU){counter_cnt1_v++;counter_cnt1_lU=1;}else if((int)arduinoencoder_enc1_up==0)counter_cnt1_lU=0;
	if((int)arduinoencoder_enc1_down>0 && !counter_cnt1_lD){counter_cnt1_v--;counter_cnt1_lD=1;}else if((int)arduinoencoder_enc1_down==0)counter_cnt1_lD=0;
	counter_cnt1_out=counter_cnt1_v;
	mozziasyncanalog_pot1_out = mozziAnalogRead(A1);
	int router_rout1_idx=(int)counter_cnt1_out; if(router_rout1_idx<8) router_rout1_v[router_rout1_idx]=(int)mozziasyncanalog_pot1_out;
	router_rout1_out0=router_rout1_v[0]; router_rout1_out1=router_rout1_v[1]; router_rout1_out2=router_rout1_v[2]; router_rout1_out3=router_rout1_v[3]; router_rout1_out4=router_rout1_v[4]; router_rout1_out5=router_rout1_v[5]; router_rout1_out6=router_rout1_v[6]; router_rout1_out7=router_rout1_v[7];
	mozzisin_osc1.setFreq((float)router_rout1_out0);
	mozzisaw_osc2.setFreq((float)router_rout1_out1);
}

AudioOutput updateAudio() {
	mozzisin_osc1_out = mozzisin_osc1.next();
	mozzisaw_osc2_out = mozzisaw_osc2.next();
	mozzimixer2_mix1_out = (int)mozzisin_osc1_out + (int)mozzisaw_osc2_out;
	return MonoOutput::from8Bit((int)mozzimixer2_mix1_out);
}

void loop() {
	audioHook();
}
