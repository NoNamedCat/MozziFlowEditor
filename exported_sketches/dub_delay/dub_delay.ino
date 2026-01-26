
#include <Mozzi.h>
#include <Oscil.h>
#include <tables/triangle2048_int8.h>
#include <tables/square_no_alias_2048_int8.h>
#include <mozzi_fixmath.h>
#include <AudioDelayFeedback.h>


volatile int mozzilfotri_lfo_out = 0;
volatile int mozzisquare_osc_out = 0;
volatile int arduinobutton_btn_out = 0;
volatile int mozzigain_vca_out = 0;
volatile int mozzidelayfb_delay_out = 0;
Oscil<TRIANGLE2048_NUM_CELLS, CONTROL_RATE> mozzilfotri_lfo(TRIANGLE2048_DATA);
Oscil<SQUARE_NO_ALIAS_2048_NUM_CELLS, AUDIO_RATE> mozzisquare_osc(SQUARE_NO_ALIAS_2048_DATA);
bool arduinobutton_btn_lS = false;
AudioDelayFeedback<512, LINEAR, int> mozzidelayfb_delay;

void setup() {
	pinMode(2, INPUT_PULLUP);
	startMozzi(CONTROL_RATE);
}

void updateControl() {
	mozzilfotri_lfo.setFreq((float)8);
	mozzilfotri_lfo_out = mozzilfotri_lfo.next();
	mozzisquare_osc.setFreq((float)mozzilfotri_lfo_out);
	bool cur = digitalRead(2) == LOW;
	arduinobutton_btn_out = (cur && !arduinobutton_btn_lS) ? 255 : 0;
	arduinobutton_btn_lS = cur;
	mozzidelayfb_delay.setFeedbackLevel((int8_t)((int)220 - 128));
	mozzidelayfb_delay.setDelayTimeCells((uint16_t)1500);
}

AudioOutput updateAudio() {
	mozzisquare_osc_out = mozzisquare_osc.next();
	mozzigain_vca_out = (int)(((long)mozzisquare_osc_out * (int)arduinobutton_btn_out) >> 8);
	mozzidelayfb_delay_out = mozzidelayfb_delay.next((int)mozzigain_vca_out);
	return MonoOutput::from8Bit((int)mozzidelayfb_delay_out);
}

void loop() {
	audioHook();
}
