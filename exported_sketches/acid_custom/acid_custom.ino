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
    
    void setDrive(float drive) {
      // Scale drive (0.0 to 1.0) to a gain factor from 1 to 20
      _gain = 1 + (int)(19.0f * drive);
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
long node_metro_out = 0;
Metronome mozzimetronome_metro; float mozzimetronome_metro_lastbpm = 0;
long node_seq_note_out = 0;
long node_seq_note_index = 0;
byte mozzisequencer16_seq_note_i=0; bool mozzisequencer16_seq_note_l=0;
long node_seq_slide_out = 0;
long node_seq_slide_index = 0;
byte mozzisequencer16_seq_slide_i=0; bool mozzisequencer16_seq_slide_l=0;
long node_seq_accent_out = 0;
long node_seq_accent_index = 0;
byte mozzisequencer16_seq_accent_i=0; bool mozzisequencer16_seq_accent_l=0;
long node_mtof_out = 0;
long node_glide_out = 0;
ExponentialGlide exponentialglide_glide;
long node_osc_out = 0;
Oscil<SAW2048_NUM_CELLS, MOZZI_AUDIO_RATE> oscil_osc(SAW2048_DATA); float last_f_osc=0;
long node_env_out = 0;
AccentuatedEnvelope accentuatedenvelope_env; bool accentuatedenvelope_env_lastTrig = 0;
long node_map_out = 0;
long node_filter_out = 0;
StateVariable<LOWPASS> mozzisvf_filter; unsigned int last_f_filter=0; uint8_t last_r_filter=0;
long node_vca_out = 0;
long node_norm_out = 0;
long node_dist_out = 0;
HardClipper hardclipper_dist;
long node_out_out = 0;

void setup() {
    startMozzi();
    mozzimetronome_metro.start();
}

void updateControl() {
    // Parameter update for audio node metro
        if(mozzimetronome_metro_lastbpm != (float)(long)135) { mozzimetronome_metro.setBPM((float)(long)135); mozzimetronome_metro_lastbpm = (float)(long)135;}
        node_metro_out = mozzimetronome_metro.ready() ? 255 : 0;
    // Parameter update for audio node seq_note
        if((long)node_metro_out>0 && !mozzisequencer16_seq_note_l){ mozzisequencer16_seq_note_i++; if(mozzisequencer16_seq_note_i >= 16) mozzisequencer16_seq_note_i=0; mozzisequencer16_seq_note_l=1; } else if((long)node_metro_out==0) { mozzisequencer16_seq_note_l=0; }
        int mozzisequencer16_seq_note_arr[16] = {(int)(long)36,(int)(long)36,(int)(long)48,(int)(long)36,(int)(long)39,(int)(long)36,(int)(long)48,(int)(long)36,(int)(long)36,(int)(long)36,(int)(long)60,(int)(long)36,(int)(long)39,(int)(long)36,(int)(long)48,(int)(long)36};
        node_seq_note_index = mozzisequencer16_seq_note_i;
        node_seq_note_out = mozzisequencer16_seq_note_arr[mozzisequencer16_seq_note_i];
    // Parameter update for audio node seq_slide
        if((long)node_metro_out>0 && !mozzisequencer16_seq_slide_l){ mozzisequencer16_seq_slide_i++; if(mozzisequencer16_seq_slide_i >= 16) mozzisequencer16_seq_slide_i=0; mozzisequencer16_seq_slide_l=1; } else if((long)node_metro_out==0) { mozzisequencer16_seq_slide_l=0; }
        int mozzisequencer16_seq_slide_arr[16] = {(int)(long)0,(int)(long)0,(int)(long)255,(int)(long)0,(int)(long)0,(int)(long)0,(int)(long)255,(int)(long)0,(int)(long)0,(int)(long)0,(int)(long)255,(int)(long)0,(int)(long)0,(int)(long)0,(int)(long)255,(int)(long)0};
        node_seq_slide_index = mozzisequencer16_seq_slide_i;
        node_seq_slide_out = mozzisequencer16_seq_slide_arr[mozzisequencer16_seq_slide_i];
    // Parameter update for audio node seq_accent
        if((long)node_metro_out>0 && !mozzisequencer16_seq_accent_l){ mozzisequencer16_seq_accent_i++; if(mozzisequencer16_seq_accent_i >= 16) mozzisequencer16_seq_accent_i=0; mozzisequencer16_seq_accent_l=1; } else if((long)node_metro_out==0) { mozzisequencer16_seq_accent_l=0; }
        int mozzisequencer16_seq_accent_arr[16] = {(int)(long)255,(int)(long)0,(int)(long)0,(int)(long)0,(int)(long)255,(int)(long)0,(int)(long)0,(int)(long)0,(int)(long)255,(int)(long)0,(int)(long)0,(int)(long)0,(int)(long)255,(int)(long)0,(int)(long)0,(int)(long)0};
        node_seq_accent_index = mozzisequencer16_seq_accent_i;
        node_seq_accent_out = mozzisequencer16_seq_accent_arr[mozzisequencer16_seq_accent_i];
    // Parameter update for audio node mtof
        node_mtof_out = mtof((uint8_t)(long)node_seq_note_out);
    // Parameter update for audio node glide
        node_glide_out = (long)exponentialglide_glide.process((float)node_mtof_out, (long)node_seq_slide_out > 0);
    // Parameter update for audio node osc
        if(last_f_osc != (float)node_glide_out){ oscil_osc.setFreq((float)node_glide_out); last_f_osc = (float)node_glide_out; }
    // Parameter update for audio node env
        bool accentuatedenvelope_env_trig = (long)node_metro_out > 0;
        if(accentuatedenvelope_env_trig && !accentuatedenvelope_env_lastTrig) accentuatedenvelope_env.trigger((long)node_seq_accent_out > 0);
        accentuatedenvelope_env_lastTrig = accentuatedenvelope_env_trig;
        node_env_out = (long)(accentuatedenvelope_env.next((float)0.96) * 255.0f);
    // Parameter update for audio node map
        node_map_out = ((((long)node_env_out - (long)0) * ((long)4000 - (long)400)) / ((long)255 - (long)0) + (long)400);
    // Parameter update for audio node filter
        if(last_f_filter != (unsigned int)(long)node_map_out){ mozzisvf_filter.setCentreFreq((unsigned int)(long)node_map_out); last_f_filter=(unsigned int)(long)node_map_out; }
        if(last_r_filter != (uint8_t)(long)200){ mozzisvf_filter.setResonance((uint8_t)(long)200); last_r_filter=(uint8_t)(long)200; }
    // Parameter update for audio node dist
        hardclipper_dist.setDrive((float)0.6);
}

AudioOutput updateAudio() {
    node_osc_out = oscil_osc.next();
    node_filter_out = mozzisvf_filter.next((int)(long)node_osc_out);
    node_vca_out = ((long)node_filter_out * (long)node_env_out);
    node_norm_out = ((long)node_vca_out >> (int)8);
    node_dist_out = hardclipper_dist.process((int)node_norm_out);
    return MonoOutput::from8Bit((int)node_dist_out);
}

void loop() {
    audioHook();
}
