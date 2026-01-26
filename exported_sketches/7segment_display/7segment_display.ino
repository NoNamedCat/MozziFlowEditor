
#include <Mozzi.h>


volatile int arduinoencoder_enc1_up = 0;
volatile int arduinoencoder_enc1_down = 0;
volatile int counter_cnt1_out = 0;
volatile int arduino7seg_drv1_d0 = 0;
volatile int arduino7seg_drv1_d1 = 0;
volatile int arduino7seg_drv1_d2 = 0;
volatile int arduino7seg_drv1_d3 = 0;
bool arduinoencoder_enc1_lA=0; int arduinoencoder_enc1_u=0; int arduinoencoder_enc1_d=0;
int counter_cnt1_v=0; bool counter_cnt1_lU=0; bool counter_cnt1_lD=0;
uint8_t arduino7seg_drv1_o[4]; const uint8_t arduino7seg_drv1_m[]={0x3F,0x06,0x5B,0x4F,0x66,0x6D,0x7D,0x07,0x7F,0x6F};

void setup() {
	pinMode(2, INPUT_PULLUP); pinMode(3, INPUT_PULLUP);
	pinMode(11, OUTPUT); pinMode(12, OUTPUT); pinMode(13, OUTPUT);
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
	long arduino7seg_drv1_t=(long)counter_cnt1_out; for(int i=0;i<4;i++){ arduino7seg_drv1_o[i]=arduino7seg_drv1_m[arduino7seg_drv1_t%10];arduino7seg_drv1_t/=10;}
	arduino7seg_drv1_d0=arduino7seg_drv1_o[0]; arduino7seg_drv1_d1=arduino7seg_drv1_o[1]; arduino7seg_drv1_d2=arduino7seg_drv1_o[2]; arduino7seg_drv1_d3=arduino7seg_drv1_o[3];
	digitalWrite(12, LOW); shiftOut(11, 13, MSBFIRST, (uint8_t)arduino7seg_drv1_d0); digitalWrite(12, HIGH);
}

AudioOutput updateAudio() {
	return 0;
}

void loop() {
	audioHook();
}
