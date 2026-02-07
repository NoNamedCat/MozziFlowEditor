const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARDUINO_PATH = 'C:\\Users\\Juan\\AppData\\Local\\Programs\\Arduino IDE\\resources\\app\\lib\\backend\\resources\\arduino-cli.exe';
const BOARD = "WCH:ch32v:CH32X035_EVT";
const ROOT_DIR = path.join(__dirname, '..');
const JS_DIR = path.join(ROOT_DIR, 'js').replace(/\\/g, '/');
const TEMP_DIR = path.join(ROOT_DIR, 'temp_compilation/stress_tests');

if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

function runIsolatedTest(name, project) {
    const runnerPath = path.join(TEMP_DIR, `${name}_runner.js`);
    const runnerCode = `
const fs = require('fs');
const path = require('path');
const vm = require('vm');
global.NodeLibrary = [];
global.window = global;
global.MOZZI_TYPES = { 
    'mozziflow/bool': {cpp:'bool'}, 'mozziflow/int8_t':{cpp:'int8_t'}, 'mozziflow/uint8_t':{cpp:'uint8_t'}, 
    'mozziflow/int16_t':{cpp:'int16_t'}, 'mozziflow/uint16_t':{cpp:'uint16_t'}, 
    'mozziflow/int32_t':{cpp:'int32_t'}, 'mozziflow/uint32_t':{cpp:'uint32_t'},
    'mozziflow/float':{cpp:'float'}, 'mozziflow/any':{cpp:'int32_t'}
};
global.isVar = (v) => isNaN(parseFloat(v));

const files = ['nodes/math.js', 'nodes/modifier.js', 'nodes/signal.js', 'nodes/source.js', 'nodes/io.js', 'nodes/ch32x035.js', 'mozziexport.js'];
files.forEach(f => { 
    const content = fs.readFileSync("${JS_DIR}/" + f, 'utf8');
    const script = new vm.Script(content);
    script.runInThisContext();
});

const project = ${JSON.stringify(project)};
const cpp = exportToMozzi(project, null);
console.log(cpp);
    `;
    
    fs.writeFileSync(runnerPath, runnerCode);
    
    const testDir = path.join(TEMP_DIR, name);
    if (!fs.existsSync(testDir)) fs.mkdirSync(testDir);
    const sketchPath = path.join(testDir, name + '.ino');

    try {
        console.log(`\n--- [AUDITORIA: ${name}] ---`);
        const cppOutput = execSync(`node "${runnerPath}"`, { encoding: 'utf8' });
        fs.writeFileSync(sketchPath, cppOutput);
        
        process.stdout.write("Compilando... ");
        execSync(`"${ARDUINO_PATH}" compile --fqbn ${BOARD} "${testDir}" --libraries C:\\Users\\Juan\\Documents\\Arduino\\libraries`, { encoding: 'utf8', stdio: 'pipe' });
        console.log("✅ EXITO");
        
    } catch (e) {
        console.log("❌ FALLO");
        const out = e.stdout ? e.stdout.toString() : "";
        const err = e.stderr ? e.stderr.toString() : e.message;
        console.error("\n[DETALLE]:\n" + out + "\n" + err);
    }
}

// ---------------------------------------------------------
runIsolatedTest("Test_Math_Logic", {
    nodes: {
        "c1":  { id:"c1",  type:"input/constant", data: {cfg_val:"100", rate_mode:1} },
        "c2":  { id:"c2",  type:"input/constant", data: {cfg_val:"200", rate_mode:1} },
        "add": { id:"add", type:"math/add", data: {rate_mode:1} },
        "map": { id:"map", type:"math/mozzi_map", data: {cfg_in_min:"0", cfg_in_max:"300", cfg_out_min:"0", cfg_out_max:"255", rate_mode:1} },
        "out": { id:"out", type:"output/analog_out", data: {cfg_pin:"PA3", rate_mode:1} }
    },
    links: [ 
        {prev_node:"c1", prev_outlet:"out", next_node:"add", next_inlet:"a"},
        {prev_node:"c2", prev_outlet:"out", next_node:"add", next_inlet:"b"},
        {prev_node:"add", prev_outlet:"out", next_node:"map", next_inlet:"in"},
        {prev_node:"map", prev_outlet:"out", next_node:"out", next_inlet:"val"}
    ]
});

runIsolatedTest("Test_HiFi_Effects", {
    nodes: {
        "osc": { id:"osc", type:"wave/mozzi_sin", data: {cfg_freq:"440.0f", rate_mode:2} },
        "rev": { id:"rev", type:"filter/mozzi_reverb", data: {cfg_fb:"100", cfg_d1:"120", rate_mode:2} },
        "out": { id:"out", type:"output/mozzi_out", data: {rate_mode:2} }
    },
    links: [ 
        {prev_node:"osc", prev_outlet:"out", next_node:"rev", next_inlet:"in"},
        {prev_node:"rev", prev_outlet:"out", next_node:"out", next_inlet:"in"}
    ]
});

runIsolatedTest("Test_Bitwise_HW", {
    nodes: {
        "btn": { id:"btn", type:"input/arduino_button", data: {cfg_pin:"PA0", rate_mode:1} },
        "shl": { id:"shl", type:"math/shl", data: {cfg_bits:"4", rate_mode:1} },
        "out": { id:"out", type:"output/digital_out", data: {cfg_pin:"PA1", rate_mode:1} }
    },
    links: [ 
        {prev_node:"btn", prev_outlet:"out", next_node:"shl", next_inlet:"a"},
        {prev_node:"shl", prev_outlet:"out", next_node:"out", next_inlet:"in"}
    ]
});