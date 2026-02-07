#define MOZZI_AUDIO_CHANNELS MOZZI_MONO
#define MOZZI_AUDIO_MODE MOZZI_OUTPUT_PWM
#define MOZZI_CONTROL_RATE 256

// MOZZIFLOW v111.0 BALANCED CORE REFINED SKETCH
#include <Mozzi.h>
#include <Oscil.h>
#include <FixMath.h>
#include <Metronome.h>
#include <mozzi_midi.h>
#include <tables/saw2048_int8.h>
#include <StateVariable.h>

// CUSTOM DEFINITIONS

class ExponentialGlide {
  private:
    float _currentFreq;
    float _smoothingFactor;
  public:
    ExponentialGlide() { _currentFreq = 0.0f; _smoothingFactor = 0.15f; }
    
    // Process transition. If glideActive is false, jump is instantaneous.
    float process(float targetFreq, bool glideActive) {
      if (!glideActive) {
        _currentFreq = targetFreq;
      } else {
        // One-pole filter formula: f = f + k * (target - f)
        _currentFreq = _currentFreq + _smoothingFactor * (targetFreq - _currentFreq);
      }
      return _currentFreq;
    }
};



class AccentuatedEnvelope {
  private:
    float _level;
    float _normalDecay;
    float _accentDecay;
    bool _isBoosted;
  public:
    AccentuatedEnvelope() { _level = 0.0f; _normalDecay = 0.96f; _accentDecay = 0.85f; }
    
    void trigger(bool useBoost) { 
      _level = 1.0f; 
      _isBoosted = useBoost; 
    }
    
    float next(float userDecay) {
      // If boosted, decay is faster (smaller value)
      float d = _isBoosted ? (_accentDecay * userDecay) : userDecay;
      _level *= d;
      if (_level < 0.001f) _level = 0.0f;
      // If boosted, scale output amplitude
      return _isBoosted ? (_level * 1.5f) : _level;
    }
};



class HardClipper {
  private:
    int _gain;
  public:
    HardClipper() { _gain = 1; }
    
    void setDrive(int drive) {
      // Scale drive (0 to 255) to a gain factor from 1 to 50
      _gain = 1 + ((long)drive * 49 / 255);
    }
    
    int process(int input) {
      long signal = (long)input * _gain;
      // Symmetric clipping at 8-bit limits
      if(signal > 127) signal = 127;
      if(signal < -128) signal = -128;
      return (int)signal;
    }
};


// GLOBALS
long node_r9gr_out = 0;
Metronome mozzimetronome_r9gr; float mozzimetronome_r9gr_lastbpm = 0;
long node_uakc_out = 0;
long node_uakc_index = 0;
byte mozzisequencer16_uakc_i=0; bool mozzisequencer16_uakc_l=0;
long node_g9zd_out = 0;
long node_g9zd_index = 0;
byte mozzisequencer16_g9zd_i=0; bool mozzisequencer16_g9zd_l=0;
long node_2rk5_out = 0;
long node_2rk5_index = 0;
byte mozzisequencer16_2rk5_i=0; bool mozzisequencer16_2rk5_l=0;
long node_5igc_out = 0;
long node_l890_out = 0;
ExponentialGlide exponentialglide_l890;
long node_x0kk_out = 0;
Oscil<SAW2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_x0kk(SAW2048_DATA); float last_f_x0kk=0;
long node_nbfo_out = 0;
AccentuatedEnvelope accentuatedenvelope_nbfo; bool accentuatedenvelope_nbfo_lastTrig = 0;
long node_91a1_out = 0;
long node_p0uh_out = 0;
StateVariable<LOWPASS> mozzisvf_p0uh; unsigned int last_f_p0uh=0; uint8_t last_r_p0uh=0;
long node_ughw_out = 0;
long node_u75f_out = 0;
long node_j6jn_out = 0;
HardClipper hardclipper_j6jn;
long node_0cvd_out = 0;

void setup() {
    startMozzi();
    mozzimetronome_r9gr.start();
}

void updateControl() {
    if(mozzimetronome_r9gr_lastbpm != (float)(long)135) { mozzimetronome_r9gr.setBPM((float)(long)135); mozzimetronome_r9gr_lastbpm = (float)(long)135;}
        node_r9gr_out = mozzimetronome_r9gr.ready() ? 255 : 0;
    if((long)node_r9gr_out>0 && !mozzisequencer16_uakc_l){ mozzisequencer16_uakc_i++; if(mozzisequencer16_uakc_i >= 16) mozzisequencer16_uakc_i=0; mozzisequencer16_uakc_l=1; } else if((long)node_r9gr_out==0) { mozzisequencer16_uakc_l=0; }
        int mozzisequencer16_uakc_arr[16] = {(int)(long)36,(int)(long)36,(int)(long)48,(int)(long)36,(int)(long)39,(int)(long)36,(int)(long)48,(int)(long)36,(int)(long)36,(int)(long)36,(int)(long)60,(int)(long)36,(int)(long)39,(int)(long)36,(int)(long)48,(int)(long)36};
        node_uakc_index = mozzisequencer16_uakc_i;
        node_uakc_out = mozzisequencer16_uakc_arr[mozzisequencer16_uakc_i];
    if((long)node_r9gr_out>0 && !mozzisequencer16_g9zd_l){ mozzisequencer16_g9zd_i++; if(mozzisequencer16_g9zd_i >= 16) mozzisequencer16_g9zd_i=0; mozzisequencer16_g9zd_l=1; } else if((long)node_r9gr_out==0) { mozzisequencer16_g9zd_l=0; }
        int mozzisequencer16_g9zd_arr[16] = {(int)(long)0,(int)(long)0,(int)(long)255,(int)(long)0,(int)(long)0,(int)(long)0,(int)(long)255,(int)(long)0,(int)(long)0,(int)(long)0,(int)(long)255,(int)(long)0,(int)(long)0,(int)(long)0,(int)(long)255,(int)(long)0};
        node_g9zd_index = mozzisequencer16_g9zd_i;
        node_g9zd_out = mozzisequencer16_g9zd_arr[mozzisequencer16_g9zd_i];
    if((long)node_r9gr_out>0 && !mozzisequencer16_2rk5_l){ mozzisequencer16_2rk5_i++; if(mozzisequencer16_2rk5_i >= 16) mozzisequencer16_2rk5_i=0; mozzisequencer16_2rk5_l=1; } else if((long)node_r9gr_out==0) { mozzisequencer16_2rk5_l=0; }
        int mozzisequencer16_2rk5_arr[16] = {(int)(long)255,(int)(long)0,(int)(long)0,(int)(long)0,(int)(long)255,(int)(long)0,(int)(long)0,(int)(long)0,(int)(long)255,(int)(long)0,(int)(long)0,(int)(long)0,(int)(long)255,(int)(long)0,(int)(long)0,(int)(long)0};
        node_2rk5_index = mozzisequencer16_2rk5_i;
        node_2rk5_out = mozzisequencer16_2rk5_arr[mozzisequencer16_2rk5_i];
    node_5igc_out = mtof((uint8_t)(long)node_uakc_out);
    node_l890_out = (long)exponentialglide_l890.process((float)node_5igc_out, (long)node_g9zd_out > 0);
    // Parameter update for audio node x0kk
        if(last_f_x0kk != (float)node_l890_out){ oscil_x0kk.setFreq((float)node_l890_out); last_f_x0kk = (float)node_l890_out; }
    bool accentuatedenvelope_nbfo_trig = (long)node_r9gr_out > 0;
        if(accentuatedenvelope_nbfo_trig && !accentuatedenvelope_nbfo_lastTrig) accentuatedenvelope_nbfo.trigger((long)node_2rk5_out > 0);
        accentuatedenvelope_nbfo_lastTrig = accentuatedenvelope_nbfo_trig;
        node_nbfo_out = (long)(accentuatedenvelope_nbfo.next((float)1) * 255.0f);
    node_91a1_out = ((((long)node_nbfo_out - (long)0) * ((long)4000 - (long)400)) / ((long)255 - (long)0) + (long)400);
    // Parameter update for audio node p0uh
        if(last_f_p0uh != (unsigned int)(long)node_91a1_out){ mozzisvf_p0uh.setCentreFreq((unsigned int)(long)node_91a1_out); last_f_p0uh=(unsigned int)(long)node_91a1_out; }
        if(last_r_p0uh != (uint8_t)(long)127){ mozzisvf_p0uh.setResonance((uint8_t)(long)127); last_r_p0uh=(uint8_t)(long)127; }
    // Parameter update for audio node j6jn
        hardclipper_j6jn.setDrive((int)1);
}

AudioOutput updateAudio() {
    node_x0kk_out = oscil_x0kk.next();
    node_p0uh_out = mozzisvf_p0uh.next((int)(long)node_x0kk_out);
    node_ughw_out = ((long)node_p0uh_out * (long)node_nbfo_out);
    node_u75f_out = ((long)node_ughw_out >> (int)8);
    node_j6jn_out = hardclipper_j6jn.process((int)node_u75f_out);
    return MonoOutput::from8Bit((int)node_j6jn_out);
}

void loop() {
    audioHook();
}
