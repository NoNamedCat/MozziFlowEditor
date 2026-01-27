// MOZZIFLOW v110.9 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>

// GLOBALS
long node_enc1_up = 0;
long node_enc1_down = 0;
long node_enc1_out = 0;
bool arduinoencoder_enc1_last;
long node_cnt1_out = 0;
int mozzicounter_cnt1_c = 0; bool mozzicounter_cnt1_ul = 0; bool mozzicounter_cnt1_dl = 0;
long node_drv1_d0 = 0;
long node_drv1_out = 0;
long node_shft_out = 0;

void setup() {
    startMozzi();
    pinMode(2, INPUT_PULLUP); pinMode(3, INPUT_PULLUP); arduinoencoder_enc1_last = digitalRead(2);
    pinMode(11, OUTPUT); pinMode(12, OUTPUT); pinMode(13, OUTPUT);
}

void updateControl() {
    
}

AudioOutput updateAudio() {
    // Control logic moved to audio loop for node enc1
    bool arduinoencoder_enc1_cur = digitalRead(2);
        node_enc1_up = 0; node_enc1_down = 0;
        if (arduinoencoder_enc1_cur != arduinoencoder_enc1_last && arduinoencoder_enc1_cur == LOW) {
        if (digitalRead(3) != arduinoencoder_enc1_cur) { node_enc1_up = 255; } else { node_enc1_down = 255; }
        }
        arduinoencoder_enc1_last = arduinoencoder_enc1_cur;
    // Control logic moved to audio loop for node cnt1
    if((int)node_enc1_up>0 && !mozzicounter_cnt1_ul){ mozzicounter_cnt1_c++; mozzicounter_cnt1_ul=1; } else if((int)node_enc1_up==0){ mozzicounter_cnt1_ul=0; }
        if((int)node_enc1_down>0 && !mozzicounter_cnt1_dl){ mozzicounter_cnt1_c--; mozzicounter_cnt1_dl=1; } else if((int)node_enc1_down==0){ mozzicounter_cnt1_dl=0; }
        if(mozzicounter_cnt1_c > (int)9) mozzicounter_cnt1_c = 0; if(mozzicounter_cnt1_c < 0) mozzicounter_cnt1_c = (int)9;
        node_cnt1_out = mozzicounter_cnt1_c;
    // Control logic moved to audio loop for node drv1
    node_drv1_out = ((int[]){0x3F,0x06,0x5B,0x4F,0x66,0x6D,0x7D,0x07,0x7F,0x6F})[(int)node_cnt1_out % 10];
    // Control logic moved to audio loop for node shft
    digitalWrite(12, LOW); shiftOut(11, 13, MSBFIRST, (uint8_t)node_drv1_d0); digitalWrite(12, HIGH);
    return MonoOutput::from8Bit(0);
}

void loop() {
    audioHook();
}
