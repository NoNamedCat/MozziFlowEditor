/**
 * ARCHITECTURE EXPORT VALIDATION SUITE (v1.1 Robust)
 */
const fs = require('fs');
const path = require('path');

// Mock environment
global.NodeLibrary = [];
global.isWired = () => true;
global.MOZZI_TYPES = { 'mozziflow/any': { cpp: 'int32_t' } };

const exportScript = fs.readFileSync(path.join(__dirname, '../js/mozziexport.js'), 'utf8');
eval(exportScript);

const tests = [
    {
        id: 'CH32_PT8211_SPI',
        data: { cfg_arch: "ch32x035", cfg_mode: "EXTERNAL_PT8211_SPI", cfg_channels: "MOZZI_STEREO", cfg_pin_ws: "10" },
        checks: ["#define MOZZI_AUDIO_MODE MOZZI_OUTPUT_EXTERNAL_TIMED", "void audioOutput", "SPI.transfer16", "StereoOutput"]
    },
    {
        id: 'ESP32_INTERNAL_DAC',
        data: { cfg_arch: "esp32", cfg_mode: "MOZZI_OUTPUT_INTERNAL_DAC", cfg_channels: "MOZZI_MONO" },
        checks: ["#define MOZZI_AUDIO_MODE MOZZI_OUTPUT_INTERNAL_DAC", "MonoOutput"]
    },
    {
        id: 'RP2040_I2S_LSBJ',
        data: { cfg_arch: "rp2040", cfg_mode: "MOZZI_OUTPUT_I2S_DAC", cfg_i2s_format: "MOZZI_I2S_FORMAT_LSBJ", cfg_channels: "MOZZI_STEREO" },
        checks: ["#define MOZZI_AUDIO_MODE MOZZI_OUTPUT_I2S_DAC", "MOZZI_I2S_FORMAT_LSBJ", "StereoOutput"]
    },
    {
        id: 'ESP8266_PDM',
        data: { cfg_arch: "esp8266", cfg_mode: "MOZZI_OUTPUT_PDM_VIA_SERIAL", cfg_channels: "MOZZI_MONO" },
        checks: ["#define MOZZI_AUDIO_MODE MOZZI_OUTPUT_PDM_VIA_SERIAL", "MonoOutput"]
    },
    {
        id: 'AVR_2PIN_HIFI',
        data: { cfg_arch: "avr", cfg_mode: "MOZZI_OUTPUT_2PIN_PWM", cfg_channels: "MOZZI_MONO" },
        checks: ["#define MOZZI_AUDIO_MODE MOZZI_OUTPUT_2PIN_PWM", "MonoOutput"]
    }
];

console.log("--- STARTING ROBUST ARCHITECTURE VALIDATION ---");
let failed = 0;

tests.forEach(t => {
    console.log(`\nTesting Hardware Config: ${t.id}...`);
    try {
        const project = {
            nodes: { "out1": { id: "out1", type: "mozziflow/out", data: t.data } },
            links: []
        };
        const cpp = exportToMozzi(project, null);
        let pass = true;
        t.checks.forEach(c => {
            if (!cpp.includes(c)) { console.error(`  [FAIL] Missing: ${c}`); pass = false; }
        });
        if (pass) console.log(`  [PASS] C++ code generated correctly.`); else failed++;
    } catch(e) { console.error(`  [CRASH] ${e.stack}`); failed++; }
});

console.log(`\n--- FINAL RESULTS: ${tests.length - failed}/${tests.length} PASSED ---
`);
if (failed > 0) process.exit(1);