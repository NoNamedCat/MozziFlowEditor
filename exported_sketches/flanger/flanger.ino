
#include <Mozzi.h>
#include <Oscil.h>
#include <tables/triangle2048_int8.h>
#include <mozzi_fixmath.h>
#include <AudioDelayFeedback.h>


volatile int mozzitri_osc_out = 0;
volatile int mozzitri_lfo_out = 0;
volatile int mozzidelayfb_del_out = 0;
volatile int mozzimixer2_mix_out = 0;
Oscil<TRIANGLE2048_NUM_CELLS, AUDIO_RATE> mozzitri_osc(TRIANGLE2048_DATA);
Oscil<TRIANGLE2048_NUM_CELLS, AUDIO_RATE> mozzitri_lfo(TRIANGLE2048_DATA);
AudioDelayFeedback<512, LINEAR, int> mozzidelayfb_del;

void setup() {
	startMozzi(CONTROL_RATE);
}

void updateControl() {
	mozzitri_osc.setFreq((float)220);
	mozzitri_lfo.setFreq((float)0.2);
	mozzidelayfb_del.setFeedbackLevel((int8_t)((int)128 - 128));
	mozzidelayfb_del.setDelayTimeCells((uint16_t)512);
}

AudioOutput updateAudio() {
	mozzitri_osc_out = mozzitri_osc.next();
	mozzitri_lfo_out = mozzitri_lfo.next();
	mozzidelayfb_del_out = mozzidelayfb_del.next((int)mozzitri_osc_out);
	mozzimixer2_mix_out = (int)mozzitri_osc_out + (int)mozzidelayfb_del_out;
	return MonoOutput::from8Bit((int)mozzimixer2_mix_out);
}

void loop() {
	audioHook();
}
