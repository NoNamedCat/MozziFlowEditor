const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ARDUINO_CLI = 'C:\\Users\\Juan\\AppData\\Local\\Programs\\Arduino IDE\\resources\\app\\lib\\backend\\resources\\arduino-cli.exe';
const FQBN = 'WCH:ch32v:CH32X035_EVT';
const SKETCHES_DIR = path.join(__dirname, '../exported_sketches');

if (!fs.existsSync(SKETCHES_DIR)) {
    console.error("❌ Folder 'exported_sketches' not found. Run 'node scripts/export_all_examples.js' first.");
    process.exit(1);
}

const sketches = fs.readdirSync(SKETCHES_DIR).filter(f => fs.lstatSync(path.join(SKETCHES_DIR, f)).isDirectory());

console.log(`\n🚀 Starting mass compilation of ${sketches.length} examples for ${FQBN}...\n`);

let passed = 0;
let failed = 0;

sketches.forEach(name => {
    const sketchPath = path.join(SKETCHES_DIR, name, `${name}.ino`);
    if (!fs.existsSync(sketchPath)) return;

    process.stdout.write(`Compiling [${name}]... `);
    
    try {
        execSync(`"${ARDUINO_CLI}" compile --fqbn ${FQBN} "${path.join(SKETCHES_DIR, name)}"`, { stdio: 'pipe' });
        console.log("✅ PASS");
        passed++;
    } catch (e) {
        console.log("❌ FAIL");
        console.error(e.stderr ? e.stderr.toString() : e.message);
        failed++;
    }
});

console.log(`\n📊 COMPILATION SUMMARY`);
console.log(`-----------------------`);
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`-----------------------`);

if (failed > 0) process.exit(1);
else console.log("✨ All examples are valid and compilable!\n");
