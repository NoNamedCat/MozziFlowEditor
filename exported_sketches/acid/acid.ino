#define MOZZI_AUDIO_CHANNELS MOZZI_MONO
#define MOZZI_AUDIO_MODE MOZZI_OUTPUT_PWM

// MOZZIFLOW v111.0 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <FixMath.h>
#include <Metronome.h>
#include <Ead.h>
#include <tables/square_no_alias_2048_int8.h>
#include <Smooth.h>
#include <ResonantFilter.h>

// GLOBALS
long node_q5cx_out = 0;
Metronome mozzimetronome_q5cx; float mozzimetronome_q5cx_lastbpm = 0;
long node_m37r_out = 0;
Ead mozziead_m37r(MOZZI_AUDIO_RATE); bool mozziead_m37r_last = 0;
long node_odiw_out = 0;
Oscil<SQUARE_NO_ALIAS_2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_odiw(SQUARE_NO_ALIAS_2048_DATA); float last_f_odiw=0;
long node_og1x_out = 0;
long node_7aj4_out = 0;
Smooth<long> smooth_7aj4; float smooth_7aj4_last=0;
long node_z4a8_low = 0;
long node_z4a8_high = 0;
long node_z4a8_band = 0;
long node_z4a8_notch = 0;
long node_z4a8_out = 0;
MultiResonantFilter<uint16_t> mozzimultires_z4a8; uint16_t last_f_z4a8=0; uint16_t last_r_z4a8=0;
long node_bl74_out = 0;

void setup() {
    startMozzi();
    mozzimetronome_q5cx.start();
    smooth_7aj4.setSmoothness(0.4f);
}

void updateControl() {
    if(mozzimetronome_q5cx_lastbpm != (float)(long)135) { mozzimetronome_q5cx.setBPM((float)(long)135); mozzimetronome_q5cx_lastbpm = (float)(long)135;}
        node_q5cx_out = mozzimetronome_q5cx.ready() ? 255 : 0;
    // Parameter update for audio node odiw
        if(last_f_odiw != (float)53){ oscil_odiw.setFreq((float)53); last_f_odiw = (float)53; }
    node_og1x_out = ((((long)node_m37r_out - (long)0) * ((long)8000 - (long)100)) / ((long)255 - (long)0) + (long)100);
    // Parameter update for audio node 7aj4
        node_7aj4_out = smooth_7aj4.next((long)node_og1x_out);
    // Parameter update for audio node z4a8
        if(last_f_z4a8 != (uint16_t)(long)node_7aj4_out || last_r_z4a8 != (uint16_t)(long)300){
        mozzimultires_z4a8.setCutoffFreqAndResonance((uint16_t)(long)node_7aj4_out, (uint16_t)(long)300); last_f_z4a8=(uint16_t)(long)node_7aj4_out; last_r_z4a8=(uint16_t)(long)300; }
}

AudioOutput updateAudio() {
    bool mozziead_m37r_trig = (long)node_q5cx_out>0;
        if(mozziead_m37r_trig && !mozziead_m37r_last){ mozziead_m37r.start((unsigned int)(long)10, (unsigned int)(long)200); }
        mozziead_m37r_last = mozziead_m37r_trig;
        node_m37r_out = (long)mozziead_m37r.next();
    node_odiw_out = oscil_odiw.next();
    mozzimultires_z4a8.next((int)(long)node_odiw_out);
        node_z4a8_low = mozzimultires_z4a8.low();
        node_z4a8_high = mozzimultires_z4a8.high();
        node_z4a8_band = mozzimultires_z4a8.band();
        node_z4a8_notch = mozzimultires_z4a8.notch();
    return MonoOutput::from8Bit((int)node_z4a8_low);
}

void loop() {
    audioHook();
}
