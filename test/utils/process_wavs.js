const fs = require('fs');
const path = require('path');

/**
 * Portable WAV Processor
 * Converts samples in the local 'samples' folder to Mozzi data.
 */

function processWav(filePath) {
    const buffer = fs.readFileSync(filePath);
    let table = [];
    // Skip 44 bytes of WAV header, sample at reduced rate for memory efficiency
    for (let i = 44; i < buffer.length; i += 6) {
        if (i + 1 >= buffer.length) break;
        if (table.length >= 2000) break;
        let val16 = buffer.readInt16LE(i);
        let val8 = Math.floor(val16 / 256);
        table.push(val8);
    }
    return table.join(',');
}

// PORTABLE PATH LOGIC
const samplesDir = path.join(__dirname, 'samples');
const samples = ['kick.wav', 'snare-m.wav', 'hihat-closed.wav'];
var output = {};

samples.forEach(f => {
    const fullPath = path.join(samplesDir, f);
    try {
        if (fs.existsSync(fullPath)) {
            output[f] = processWav(fullPath);
            console.log(`Processed: ${f}`);
        } else {
            console.warn(`Warning: ${f} not found in ${samplesDir}`);
        }
    } catch(e) {
        console.error(`Error processing ${f}: ${e.message}`);
    }
});

fs.writeFileSync(path.join(__dirname, 'temp_samples.json'), JSON.stringify(output), 'utf8');
console.log("\nSuccess: Processed WAVs to temp_samples.json");