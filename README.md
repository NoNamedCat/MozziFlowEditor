# MozziFlowEditor

**[🚀 Try the Live Demo here!](https://nonamedcat.github.io/MozziFlowEditor/)**

A visual node-based editor for creating audio patches for the Mozzi library on Arduino.

## Documentation
- **[Full Node Manual (MANUAL.md)](MANUAL.md)**: Detailed information about every node, its inputs, outputs, and usage tips with images.

## Development
### Auto-Generating Documentation
The project includes a suite of tools to keep the documentation in sync with the code:
- `npm run build-docs`: Injects documentation into the code, renders node images using a headless browser, and regenerates `MANUAL.md`.

*Note: This process is automated via GitHub Actions on every push to the main branch.*

---
Based on mozziflow86 by Budi Prakosa. Modified for Mozzi by NoNamedCat.

## Key Features

- **Full Mozzi Suite:** 70+ nodes covering oscillators, filters, envelopes, and more.
- **Hardware Support:** Native nodes for Shift Registers (595), Multiplexers (4051), Encoders, and Buttons.
- **Advanced Audio:** Real-time WAV/MP3 to Mozzi table conversion with Huffman Compression support.
- **Smart Export:** Dependency-ordered C++ generation with automatic removal of unused nodes.
- **Interactive UI:** Dynamic descriptions, zoom support, and real-time step sequencing.

## Available Modules

### Oscillators & Waveforms
- **Mozzi Sine:** Pure sine wave, ideal for sub-bass and FM.
- **Mozzi Saw:** Harmonic-rich saw wave for leads and strings.
- **Mozzi Triangle:** Soft harmonic wave for flutes and pads.
- **Mozzi Square:** Hollow chip-tune sound with odd harmonics.
- **Mozzi Noise:** White noise source for percussion and wind.
- **Mozzi Phasor:** Linear ramp for driving custom logic or PWM.
- **Mozzi Sample:** Plays audio samples from PROGMEM (WAV/MP3).
- **Mozzi Huffman:** Plays compressed audio samples (saves 50% flash).
- **Mozzi WavePacket:** Granular-style bubbles of sound.
- **Mozzi WavePacket Sample:** Granular synthesis using audio samples as source.
- **Mozzi PD Resonant:** Casio CZ-style Phase Distortion synthesis.

### LFOs (Control Rate)
- **Sine LFO:** Smooth unipolar modulation (0-255).
- **Triangle LFO:** Linear unipolar sweeps (0-255).
- **Square LFO:** Rhythmic on/off modulation (0 or 255).
- **Saw LFO:** Rhythmic rising ramps (0-255).

### Filters & Distortion
- **Mozzi LowPass:** Standard 1st-order low-pass filter.
- **Mozzi SVF:** High-quality State Variable Filter (LP/HP/BP/Notch).
- **Mozzi Resonant LP:** Sharp, squelchy acid-style filter.
- **Mozzi WaveFolder:** West-coast style folding distortion.
- **Mozzi WaveShaper:** Chebyshev-based harmonic saturation.
- **Mozzi Audio Delay:** Simple audio delay (no feedback).
- **Mozzi Delay FB:** Digital delay with feedback and time modulation.
- **Mozzi Reverb:** Schroeder-style Reverb Tank simulator.
- **Mozzi DC Filter:** Removes DC offset from signals.
- **Mozzi OverSample:** 2x anti-aliasing filter for cleaner highs.

### Control & Envelopes
- **Mozzi ADSR:** Full Attack-Decay-Sustain-Release envelope.
- **Mozzi Ead Env:** Exponential Attack-Decay for percussion.
- **Mozzi Line:** Linear ramps for pitch or volume glides.
- **Mozzi Smooth:** Softens rapid changes to prevent zipper noise.
- **Mozzi Portamento:** Smooth frequency transitions between notes.
- **Mozzi Rolling Average:** Smooths noisy signals using moving average.
- **Mozzi AutoRange:** Tracks and maps signal min/max automatically.
- **Mozzi AutoMap:** Rescales input ranges (e.g., 0-1023 to 20-2000).
- **Mozzi Event Delay:** Non-blocking programmed timer.
- **Mozzi Metronome:** Precise timing trigger source.
- **Step Sequencer (8/16/24/32):** Multi-length musical sequencers.
- **Quantizer (C-Maj):** Forces input values into musical scales.
- **Sample & Hold:** Freezes signal value on trigger.
- **Toggle Switch:** Latching ON/OFF control from a single pulse.
- **Counter:** Incremental value tracker with Reset.
- **Signal Router:** Dynamic 1-to-N signal routing.
- **Mozzi Gain:** Signal amplification and VCA control.
- **Mozzi Mixer (2 Ch):** Sums two signals with independent levels.

### Hardware I/O
- **Constant:** Static value provider or Pin definition.
- **Analog In:** Reads sensors or potentiometers.
- **Async Analog:** High-performance non-blocking analog reads.
- **Digital In:** Standard Arduino digital pin access.
- **Digital Out:** Controls LEDs or external logic.
- **Analog Out:** PWM output for non-audio peripherals.
- **Mozzi RC Poll:** Measures resistance/capacitance on digital pins.
- **Mozzi CapPoll:** Capacitive touch sensing on a single pin.
- **Mux 4051 (1/2/3/4):** CD4051 Multiplexer support (up to 32 inputs).
- **Shift Out 595 (1/2/3/4):** Controls cascaded 74HC595 shift registers (up to 32 bits).
- **Rotary Encoder:** Real-time clockwise/counter-clockwise triggers.
- **Button (Debounced):** Clean digital triggers from physical buttons.
- **One-Hot:** Converts index to individual bit triggers.
- **Arduino 7-Seg:** Driver for 7-segment numeric displays.
- **Mozzi Output:** The final audio destination (Speaker).

### Math Utilities
- **Mozzi IntMap:** Optimized 10-bit to 8-bit integer mapping.
- **Map Range:** Manual remapping of any input/output range.
- **Add / Subtract:** Basic signal arithmetic.
- **Multiply / Divide:** Scaling and ring modulation (fixed-point).
- **Absolute / Min / Max:** Signal rectification and limiting.

## How to Use

1. Clone this repository.
2. Open `index.html` in any modern web browser.
3. Design your audio graph by dragging nodes from the menu.
4. Use **Constant / Pin** nodes to define your hardware pins.
5. Press **ALT+E** to view the C++ code.
6. Press **ALT+S** to download the Arduino `.ino` file.

## For Developers

The `test/` folder contains a full toolkit:
- `verify_mozzi_designer.js`: Run `node test/verify_mozzi_designer.js` to verify node integrity.
- `rebuild_database.js`: Run to update `js/examples.js` after adding new `.txt` patches to `test/patches/`.
- `utils/`: Audio processing scripts for new sample generation.

---
*Developed by NoNamedCat.*