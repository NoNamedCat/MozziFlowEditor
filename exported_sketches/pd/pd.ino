
#include <Mozzi.h>
#include <Phasor.h>
#include <tables/sin2048_int8.h>


volatile int mozzipdresonant_v1_out = 0;
Phasor<AUDIO_RATE> mozzipdresonant_v1_ph; unsigned int mozzipdresonant_v1_idx;

void setup() {
	startMozzi(CONTROL_RATE);
}

void updateControl() {
	mozzipdresonant_v1_ph.setFreq((int)440);
}

AudioOutput updateAudio() {
	mozzipdresonant_v1_idx = ((mozzipdresonant_v1_ph.next() >> 16) * (int)128) >> 10;
	mozzipdresonant_v1_out = SIN2048_DATA[mozzipdresonant_v1_idx & 2047];
	return MonoOutput::from8Bit((int)mozzipdresonant_v1_out);
}

void loop() {
	audioHook();
}
