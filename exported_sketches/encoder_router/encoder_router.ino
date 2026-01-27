// MOZZIFLOW v111.0 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <tables/sin2048_int8.h>
#include <tables/saw2048_int8.h>

// GLOBALS
long node_enc1_up = 0;
long node_enc1_down = 0;
long node_enc1_out = 0;
bool arduinoencoder_enc1_last;
long node_cnt1_out = 0;
int mozzicounter_cnt1_c = 0; bool mozzicounter_cnt1_ul = 0; bool mozzicounter_cnt1_dl = 0;
long node_osc1_out = 0;
Oscil<SIN2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_osc1(SIN2048_DATA);
long node_rout1_out0 = 0;
long node_rout1_out1 = 0;
long node_rout1_out = 0;
long node_osc2_out = 0;
Oscil<SAW2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_osc2(SAW2048_DATA);
long node_out_out = 0;

void setup() {
    startMozzi();
    pinMode(2, INPUT_PULLUP); pinMode(3, INPUT_PULLUP); arduinoencoder_enc1_last = digitalRead(2);
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
    if((long)node_enc1_up>0 && !mozzicounter_cnt1_ul){ mozzicounter_cnt1_c++; mozzicounter_cnt1_ul=1; } else if((long)node_enc1_up==0){ mozzicounter_cnt1_ul=0; }
        if((long)node_enc1_down>0 && !mozzicounter_cnt1_dl){ mozzicounter_cnt1_c--; mozzicounter_cnt1_dl=1; } else if((long)node_enc1_down==0){ mozzicounter_cnt1_dl=0; }
        if(mozzicounter_cnt1_c > (long)1) mozzicounter_cnt1_c = 0; if(mozzicounter_cnt1_c < 0) mozzicounter_cnt1_c = (long)1;
        node_cnt1_out = mozzicounter_cnt1_c;
    node_osc1_out = oscil_osc1.next();
    // Control logic moved to audio loop for node osc1
    oscil_osc1.setFreq((float)(long)440);
    // Control logic moved to audio loop for node rout1
    node_rout1_out0 = ( (long)node_cnt1_out == 0 ) ? (int)(long)node_osc1_out : 0;
        node_rout1_out1 = ( (long)node_cnt1_out == 1 ) ? (int)(long)node_osc1_out : 0;
    node_osc2_out = oscil_osc2.next();
    // Control logic moved to audio loop for node osc2
    oscil_osc2.setFreq((float)(long)220);
    return MonoOutput::from8Bit((int)node_rout1_out0);
}

void loop() {
    audioHook();
}
