
#include <Mozzi.h>
#include <Sample.h>
#include <tables/sin2048_int8.h>


volatile int arduinobutton_btn1_out = 0;
volatile int mozzisample_kick_out = 0;
bool arduinobutton_btn1_lS = false;
int mozzisample_kick_last_trig = 0;
Sample<2048, AUDIO_RATE> mozzisample_kick(SIN2048_DATA);

void setup() {
	pinMode(5, INPUT_PULLUP);
	startMozzi(CONTROL_RATE);
}

void updateControl() {
	bool cur = digitalRead(5) == LOW;
	arduinobutton_btn1_out = (cur && !arduinobutton_btn1_lS) ? 255 : 0;
	arduinobutton_btn1_lS = cur;
	mozzisample_kick.setFreq((float)1.0);
	if((int)arduinobutton_btn1_out > 0 && mozzisample_kick_last_trig == 0) mozzisample_kick.start();
	mozzisample_kick_last_trig = (int)arduinobutton_btn1_out;
}

AudioOutput updateAudio() {
	mozzisample_kick_out = mozzisample_kick.next();
	return MonoOutput::from8Bit((int)mozzisample_kick_out);
}

void loop() {
	audioHook();
}
