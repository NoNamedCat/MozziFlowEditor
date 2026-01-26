
#include <Mozzi.h>
#include <mozzi_analog.h>
#include <Smooth.h>
#include <IntMap.h>
#include <Oscil.h>
#include <tables/sin2048_int8.h>
#include <AudioDelay.h>


volatile int mozziasyncanalog_ldr_out = 0;
volatile int mozzismooth_smooth_out = 0;
volatile int mozziintmap_map_out = 0;
volatile int mozzisin_osc_out = 0;
volatile int mozziaudiodelay_echo_out = 0;
Smooth<long> mozzismooth_smooth(0.95f);
IntMap mozziintmap_map(0,1023,0,255);
Oscil<SIN2048_NUM_CELLS, AUDIO_RATE> mozzisin_osc(SIN2048_DATA);
AudioDelay<1024, int> mozziaudiodelay_echo;

void setup() {
	startMozzi(CONTROL_RATE);
}

void updateControl() {
	mozziasyncanalog_ldr_out = mozziAnalogRead(A0);
	float mozzismooth_smooth_sm = (float)0.95; if(mozzismooth_smooth_sm<0.0f)mozzismooth_smooth_sm=0.0f; if(mozzismooth_smooth_sm>0.99f)mozzismooth_smooth_sm=0.99f; mozzismooth_smooth.setSmoothness(mozzismooth_smooth_sm);
	mozzismooth_smooth_out = mozzismooth_smooth.next((long)mozziasyncanalog_ldr_out);
	mozziintmap_map_out = mozziintmap_map((int)mozzismooth_smooth_out);
	mozzisin_osc.setFreq((float)mozziintmap_map_out);
}

AudioOutput updateAudio() {
	mozzisin_osc_out = mozzisin_osc.next();
	mozziaudiodelay_echo_out = mozziaudiodelay_echo.next((int)mozzisin_osc_out, (uint16_t)300);
	return MonoOutput::from8Bit((int)mozziaudiodelay_echo_out);
}

void loop() {
	audioHook();
}
