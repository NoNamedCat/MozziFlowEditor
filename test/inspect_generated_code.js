const fs = require('fs');
const path = require('path');

// --- MOCK ENVIRONMENT ---
global.NodeLibrary = [];
global.EXAMPLES = {};
global.mozziFlowContainer = [];
global.mozziFlowClassConnection = [];
global.Rpd = { nodetype: ()=>{}, channeltype: ()=>{}, channelrenderer: ()=>{}, noderenderer: ()=>{}, nodedescription: ()=>{} };
global.d3 = { select: ()=>({ classed: ()=>({ node: ()=>({}) }) }) };
global._ = { findWhere: (a,s)=>a.find(i=>Object.keys(s).every(k=>i[k]===s[k])) };
global.document = { createElement: ()=>({style:{}}), getElementById: ()=>({innerHTML:''}) };
global.window = { setTimeout: ()=>{} };

const root = path.join(__dirname, '..');
const nodesDir = path.join(root, 'js/nodes');
const examplesDir = path.join(root, 'js/examples');

// Cargar Nodos
fs.readdirSync(nodesDir).forEach(f => eval(fs.readFileSync(path.join(nodesDir, f), 'utf8')));
// Cargar Exportador
eval(fs.readFileSync(path.join(root, 'js/mozziexport.js'), 'utf8'));

function getExampleCode(name) {
    global.EXAMPLES = {}; // Limpiar ejemplos previos
    eval(fs.readFileSync(path.join(examplesDir, name + '.js'), 'utf8'));
    const cmdString = global.EXAMPLES[name];
    if (!cmdString) return "// ERROR: No commands found for " + name;
    
    const cmds = cmdString.split('\n');
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
    global.mozziFlowContainer = nodes;
    global.mozziFlowClassConnection = links;
    return NodeToMozziCppInternal();
}

const files = fs.readdirSync(examplesDir).filter(f => f.endsWith('.js'));
files.forEach(f => {
    const name = f.replace('.js', '');
    console.log(`\n/* =================================================`);
    console.log(`   EXAMPLE: ${name.toUpperCase()}
`);
    console.log(`   ================================================= */`);
    try {
        console.log(getExampleCode(name));
    } catch(e) {
        console.log(`// FATAL ERROR generating ${name}: ${e.message}`);
    }
});