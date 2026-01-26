const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARDUINO_PATH = 'C:\\Users\\Juan\\AppData\\Local\\Programs\\Arduino IDE\\resources\\app\\lib\\backend\\resources\\arduino-cli.exe';
const BOARD = "WCH:ch32v:CH32X035_EVT";
const ROOT_DIR = path.join(__dirname, '..');
const TEMP_SKETCH_DIR = path.join(ROOT_DIR, 'temp_compilation');
const SKETCH_NAME = 'temp_compilation.ino';

// --- MOCK ---
global.NodeLibrary = []; global.EXAMPLES = {}; global.mozziFlowContainer = []; global.mozziFlowClassConnection = [];
global.Rpd = { nodetype: ()=>{}, channeltype: ()=>{}, channelrenderer: ()=>{}, noderenderer: ()=>{}, nodedescription: ()=>{} };
global.d3 = { select: ()=>({ classed: ()=>({ node: ()=>({}) }) }) }; global._ = { findWhere: (a,s)=>a.find(i=>Object.keys(s).every(k=>i[k]===s[k])) };
global.document = { createElement: ()=>({style:{}}), getElementById: ()=>({innerHTML:''}) }; global.window = { setTimeout: ()=>{} };

fs.readdirSync(path.join(ROOT_DIR, 'js/nodes')).forEach(f => eval(fs.readFileSync(path.join(ROOT_DIR, 'js/nodes', f), 'utf8')));
eval(fs.readFileSync(path.join(ROOT_DIR, 'js/mozziexport.js'), 'utf8'));

// FUNCIÓN DE LIMPIEZA
function cleanTempDir() {
    if (fs.existsSync(TEMP_SKETCH_DIR)) {
        fs.readdirSync(TEMP_SKETCH_DIR).forEach(file => {
            fs.unlinkSync(path.join(TEMP_SKETCH_DIR, file));
        });
    } else {
        fs.mkdirSync(TEMP_SKETCH_DIR);
    }
}

function compileExample(name) {
    cleanTempDir(); // Limpieza absoluta antes de generar el nuevo .ino
    
    global.EXAMPLES = {};
    eval(fs.readFileSync(path.join(ROOT_DIR, 'js/examples', name + '.js'), 'utf8'));
    const cmds = global.EXAMPLES[name].split('\n');
    const nodes = []; const links = [];
    cmds.forEach(l => {
        const p = l.trim().split(/\s+/);
        if (p[0]==='patch/add-node') {
            const d = NodeLibrary.find(x=>x.nodetype===p[3]);
            nodes.push({nodeid:p[2], nodetype:p[3], nodeclass:d?d.nodeclass:'?', nodeinletvalue:{}});
        } else if (p[0]==='outlet/connect') {
            const [sId,sO] = p[1].split(':'); const [dId,dI] = p[2].split(':');
            links.push({node_in_id:dId, inlet_alias:dI, node_out_id:sId, outlet_alias:sO});
        } else if (p[0]==='node/update-inlet') {
            const n = nodes.find(x=>x.nodeid===p[1]); if(n) n.nodeinletvalue[p[2]] = [p[2],p[3]];
        }
    });
    global.mozziFlowContainer = nodes; global.mozziFlowClassConnection = links;
    
    const cppCode = NodeToMozziCppInternal();
    fs.writeFileSync(path.join(TEMP_SKETCH_DIR, SKETCH_NAME), cppCode);

    try {
        const command = `"${ARDUINO_PATH}" compile --fqbn ${BOARD} "${TEMP_SKETCH_DIR}"`;
        execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
        return { success: true };
    } catch (e) {
        return { success: false, error: e.stderr || e.stdout || e.message };
    }
}

console.log(`🚀 Iniciando validación real de 31 ejemplos...\n`);
const files = fs.readdirSync(path.join(ROOT_DIR, 'js/examples')).filter(f => f.endsWith('.js'));
let passed = 0;

files.forEach(f => {
    const name = f.replace('.js', '');
    process.stdout.write(`Compilando [${name.padEnd(20)}]... `);
    const result = compileExample(name);
    if (result.success) { console.log("✅ PASS"); passed++; } 
    else { console.log("❌ FAIL\n\n[ERROR]:\n" + result.error + "\n"); }
});

console.log(`\n📊 RESULTADO: ${passed}/${files.length} pasaron.`);