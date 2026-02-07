const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARDUINO_PATH = 'C:\\Users\\Juan\\AppData\\Local\\Programs\\Arduino IDE\\resources\\app\\lib\\backend\\resources\\arduino-cli.exe';
const BOARD = "WCH:ch32v:CH32X035_EVT";
const ROOT_DIR = path.join(__dirname, '..');
const TEMP_SKETCH_DIR = path.join(ROOT_DIR, 'temp_compilation');

// --- MOCKS para entorno NODE.JS ---
global.NodeLibrary = []; global.EXAMPLES = {};
global.d3_tiny = { select: () => ({ append: () => ({ call: () => ({ attr: () => ({ text: () => ({ append: () => ({ call: () => {} }) }) }) }) }) }) };
global.d3 = global.d3_tiny;
global.RpdUtils = { NodeList: function() { this.addOnClick = () => {}; this.addSearch = () => {}; this.addCtrlSpaceAndArrows = () => {}; }, getNodeTypesByToolkit: () => ({}) };
global.Rpd = { allNodeTypes: {}, allNodeDescriptions: {}, allNodeTypeIcons: {}, VERSION: "2.1.1", events: { filter: () => ({ onValue: () => {} }) }, nodedescription: () => {}, channeltype: () => {}, channelrenderer: () => {}, nodetype: () => {}, noderenderer: () => {} };
global._ = { findWhere: (a,s)=>a.find(i=>Object.keys(s).every(k=>i[k]===s[k])), filter: (a,f)=>a.filter(f), find: (a,f)=>a.find(f), isUndefined: (v)=>v===undefined };
global.document = { createElement: ()=>({style:{}}), getElementById: ()=>({innerHTML:''}) }; global.window = { setTimeout: ()=>{} };

// Cargar Infraestructura
eval(fs.readFileSync(path.join(ROOT_DIR, 'js/mozziflow.js'), 'utf8'));
if (typeof MOZZI_TYPES !== 'undefined') global.MOZZI_TYPES = MOZZI_TYPES;
fs.readdirSync(path.join(ROOT_DIR, 'js/nodes')).forEach(f => { if (f.endsWith('.js')) eval(fs.readFileSync(path.join(ROOT_DIR, 'js/nodes', f), 'utf8')); });

// CARGAR EXPORTADOR V4.5 (Ultimate Resilience)
eval(fs.readFileSync(path.join(ROOT_DIR, 'js/mozziexport.js'), 'utf8'));

function cleanTempDir(name) {
    const testDir = path.join(TEMP_SKETCH_DIR, name);
    if (fs.existsSync(testDir)) { fs.readdirSync(testDir).forEach(file => fs.unlinkSync(path.join(testDir, file))); } 
    else { if (!fs.existsSync(TEMP_SKETCH_DIR)) fs.mkdirSync(TEMP_SKETCH_DIR); fs.mkdirSync(testDir); }
    return testDir;
}

function parseExampleToProject(name) {
    const cmds = global.EXAMPLES[name].split('\n');
    const project = { nodes: {}, links: {} };
    let linkIdCounter = 0;
    cmds.forEach(l => {
        const p = l.trim().split(/\s+/);
        if (p[0] === 'patch/add-node') {
            const nodeId = p[2], nodeType = p[3];
            const def = global.NodeLibrary.find(n => n.nodetype === nodeType);
            project.nodes[nodeId] = { id: nodeId, nodeid: nodeId, type: nodeType, nodetype: nodeType, nodevariable: "node_" + nodeId, data: {}, _def: def };
        } else if (p[0] === 'outlet/connect') {
            const [sId, sO] = p[1].split(':'); const [dId, dI] = p[2].split(':');
            const linkId = "link_" + (linkIdCounter++);
            project.links[linkId] = { prev_node: sId, prev_outlet: sO, next_node: dId, next_inlet: dI };
        } else if (p[0] === 'node/update-inlet') {
            const nodeId = p[1], inName = p[2], val = p[3];
            if (project.nodes[nodeId]) { project.nodes[nodeId].data[inName] = val; }
        } else if (p[0] === 'node/set-data') {
            const id = p[1], raw = p.slice(2).join(' ');
            try { const data = JSON.parse(Buffer.from(raw, 'base64').toString('utf8')); if (project.nodes[id]) project.nodes[id].data = Object.assign(project.nodes[id].data || {}, data); } catch (e) {}
        }
    });
    return project;
}

// Verificar entorno
try {
    const ver = execSync(`"${ARDUINO_PATH}" version`, { encoding: 'utf8' });
    console.log(`🛠️ Entorno de compilación verificado: ${ver.trim()}`);
} catch (e) {
    console.error("🔥 ERROR CRÍTICO: No se encontró arduino-cli en la ruta especificada.");
    console.error("Ruta: " + ARDUINO_PATH);
    process.exit(1);
}

function compileExample(name) {
    const testDir = cleanTempDir(name);
    const sketchPath = path.join(testDir, name + '.ino');
    try {
        const project = parseExampleToProject(name);
        const cppCode = exportToMozzi(project, null);
        fs.writeFileSync(sketchPath, cppCode);
        
        // Compile (Verify only)
        const command = `"${ARDUINO_PATH}" compile --fqbn ${BOARD} "${testDir}" --warnings all`;
        execSync(command, { encoding: 'utf8', stdio: 'pipe' }); // Capture stdio to throw on stderr
        return { success: true };
    } catch (e) {
        return { success: false, error: e.stdout + "\n" + e.stderr };
    }
}

console.log(`🚀 Iniciando validación real V5.0 Brutal-Check...\n`);
const files = fs.readdirSync(path.join(ROOT_DIR, 'js/examples')).filter(f => f.endsWith('.js'));
let passed = 0;
let total = 0;

files.forEach(f => {
    global.EXAMPLES = {};
    eval(fs.readFileSync(path.join(ROOT_DIR, 'js/examples', f), 'utf8'));
    Object.keys(global.EXAMPLES).forEach(name => {
        total++;
        process.stdout.write(`Compilando [${name.padEnd(25)}]... `);
        const result = compileExample(name);
        if (result.success) { console.log("✅ PASS"); passed++; } 
        else { console.log("❌ FAIL\n\n[ERROR]:\n" + result.error + "\n"); }
    });
});
console.log(`\n📊 RESULTADO FINAL: ${passed}/${total} pasaron.`);
