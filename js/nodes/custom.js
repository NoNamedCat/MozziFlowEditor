// Mozzi Node Definitions - CUSTOM USER NODES (Dynamic Injection)
// Specialized DSP modules defined directly in C++

NodeLibrary.push({
    nodetype: 'signal/exponential_glide',
    nodeclass: "ExponentialGlide",
    mozzi: {
        rate: "control",
        definitions: [`
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
`],
        global: function(n,v) { return "ExponentialGlide " + v + ";"; },
        control: function(n,v,i) {
            return "node_" + n.id + "_out = (long)" + v + ".process((float)" + i.freq + ", (long)" + i.glide_active + " > 0)";
        }
    },
    rpdnode: { 
        "title": "Exponential Glide", 
        "inlets": { 
            "freq": { "type": "mozziflow/float", "label": "freq_in" }, 
            "glide_active": { "type": "mozziflow/bool", "label": "active" } 
        }, 
        "outlets": { "out": { "type": "mozziflow/long" } } 
    }
});

NodeLibrary.push({
    nodetype: 'signal/accentuated_envelope',
    nodeclass: "AccentuatedEnvelope",
    mozzi: {
        rate: "control",
        definitions: [`
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
`],
        global: function(n,v) { return "AccentuatedEnvelope " + v + "; bool " + v + "_lastTrig = 0;"; },
        control: function(n,v,i) {
            return "bool " + v + "_trig = (long)" + i.trig + " > 0;\n" +
                   "if(" + v + "_trig && !" + v + "_lastTrig) " + v + ".trigger((long)" + i.boost + " > 0);\n" +
                   v + "_lastTrig = " + v + "_trig;\n" +
                   "node_" + n.id + "_out = (long)(" + v + ".next((float)" + i.decay + ") * 255.0f)";
        }
    },
    rpdnode: { 
        "title": "Dynamic Envelope", 
        "inlets": { 
            "trig": { "type": "mozziflow/bool" }, 
            "boost": { "type": "mozziflow/bool", "label": "boost" },
            "decay": { "type": "mozziflow/float", "default": "0.96" } 
        }, 
        "outlets": { "out": { "type": "mozziflow/long" } } 
    }
});

NodeLibrary.push({
    nodetype: 'filter/hard_clipper',
    nodeclass: "HardClipper",
    mozzi: {
        rate: "audio",
        definitions: [`
class HardClipper {
  private:
    int _gain;
  public:
    HardClipper() { _gain = 1; }
    
    void setDrive(float drive) {
      // Scale drive (0.0 to 1.0) to a gain factor from 1 to 50
      _gain = 1 + (int)(49.0f * drive);
    }
    
    int process(int input) {
      long signal = (long)input * _gain;
      // Symmetric clipping at 8-bit limits
      if(signal > 127) signal = 127;
      if(signal < -128) signal = -128;
      return (int)signal;
    }
};
`],
        global: function(n,v) { return "HardClipper " + v + ";"; },
        control: function(n,v,i) { return v + ".setDrive((float)" + i.drive + ");"; },
        audio: function(n,v,i) { return "node_" + n.id + "_out = " + v + ".process((int)" + i.in + ")"; }
    },
    rpdnode: { 
        "title": "Hard Clip", 
        "inlets": { 
            "in": { "type": "mozziflow/int8" }, 
            "drive": { "type": "mozziflow/float", "label": "saturation" } 
        }, 
        "outlets": { "out": { "type": "mozziflow/int8" } } 
    }
});
