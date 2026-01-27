const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARDUINO_PATH = 'C:\\Users\\Juan\\AppData\\Local\\Programs\\Arduino IDE\\resources\\app\\lib\\backend\\resources\\arduino-cli.exe';
const BOARD = "WCH:ch32v:CH32X035_EVT";
const ROOT_DIR = path.join(__dirname, '..');
const TEMP_SKETCH_DIR = path.join(ROOT_DIR, 'temp_compilation');
const SKETCH_NAME = 'temp_compilation.ino';

// --- MOCKS PARA ENTORNO NODE.JS ---
global.NodeLibrary = []; global.EXAMPLES = {};
global.Rpd = { nodetype: ()=>{}, channeltype: ()=>{}, channelrenderer: ()=>{}, noderenderer: ()=>{}, nodedescription: ()=>{} };

// Cargar nodos y exportador
fs.readdirSync(path.join(ROOT_DIR, 'js/nodes')).forEach(f => {
    if (f.endsWith('.js')) eval(fs.readFileSync(path.join(ROOT_DIR, 'js/nodes', f), 'utf8'));
});
eval(fs.readFileSync(path.join(ROOT_DIR, 'js/mozziexport.js'), 'utf8'));

function cleanTempDir() {
    if (!fs.existsSync(TEMP_SKETCH_DIR)) fs.mkdirSync(TEMP_SKETCH_DIR);
    fs.readdirSync(TEMP_SKETCH_DIR).forEach(file => fs.unlinkSync(path.join(TEMP_SKETCH_DIR, file)));
}

function parseExampleToProject(name) {
    global.EXAMPLES = {};
    eval(fs.readFileSync(path.join(ROOT_DIR, 'js/examples', name + '.js'), 'utf8'));
    const cmds = global.EXAMPLES[name].split('\n');
    
    const project = { nodes: {}, links: {} };
    let linkIdCounter = 0;

    cmds.forEach(l => {
        const p = l.trim().split(/\s+/);
        if (p[0] === 'patch/add-node') {
            const nodeId = p[2];
            const nodeType = p[3];
            const def = NodeLibrary.find(x => x.nodetype === nodeType);
            project.nodes[nodeId] = {
                id: nodeId,
                type: nodeType,
                nodevariable: "node_" + nodeId, // Match real editor naming
                inlets: {},
                outlets: {},
                data: {}
            };
            if (def && def.rpdnode && def.rpdnode.inlets) {
                Object.keys(def.rpdnode.inlets).forEach(k => project.nodes[nodeId].inlets[k] = {});
            }
            if (def && def.rpdnode && def.rpdnode.outlets) {
                Object.keys(def.rpdnode.outlets).forEach(k => project.nodes[nodeId].outlets[k] = {});
            }
        } else if (p[0] === 'outlet/connect') {
            const [sId, sO] = p[1].split(':');
            const [dId, dI] = p[2].split(':');
            const linkId = "link_" + (linkIdCounter++);
            project.links[linkId] = {
                prev_node: sId,
                prev_outlet: sO,
                next_node: dId,
                next_inlet: dI
            };
        } else if (p[0] === 'node/update-inlet') {
            const nodeId = p[1];
            const inletName = p[2];
            const value = p[3];
            if (project.nodes[nodeId]) {
                project.nodes[nodeId].inlets[inletName] = { value: value };
                project.nodes[nodeId].data[inletName] = value;
            }
        } else if (p[0] === 'node/set-data') {
            const id = p[1];
            const rawData = p.slice(2).join(' ');
            try {
                const data = JSON.parse(Buffer.from(rawData, 'base64').toString('utf8'));
                if (project.nodes[id]) {
                    project.nodes[id].data = Object.assign(project.nodes[id].data || {}, data);
                }
            } catch (e) {}
        }
    });
    return project;
}

function compileExample(name) {
    cleanTempDir();
    try {
        const project = parseExampleToProject(name);
        const cppCode = exportToMozzi(project, null);
        fs.writeFileSync(path.join(TEMP_SKETCH_DIR, SKETCH_NAME), cppCode);

        const command = `"${ARDUINO_PATH}" compile --fqbn ${BOARD} "${TEMP_SKETCH_DIR}"`;
        execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
        return { success: true };
    } catch (e) {
        return { success: false, error: e.stderr || e.stdout || e.message };
    }
}

console.log(`🚀 Iniciando validación real v109.4...\n`);
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