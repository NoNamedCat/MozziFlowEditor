const fs = require('fs');
const path = require('path');

// --- MOCK ENVIRONMENT ---
global.NodeLibrary = [];
global.EXAMPLES = {};
global.mozziFlowContainer = [];
global.mozziFlowClassConnection = [];
global.d3_tiny = { select: () => ({ append: () => ({ call: () => ({ attr: () => ({ text: () => ({ append: () => ({ call: () => {} }) }) }) }) }) }) };
global.d3 = global.d3_tiny;
global.RpdUtils = { 
    NodeList: function() { this.addOnClick = () => {}; this.addSearch = () => {}; this.addCtrlSpaceAndArrows = () => {}; },
    getNodeTypesByToolkit: () => ({})
};
global.Rpd = { 
    allNodeTypes: {}, 
    allNodeDescriptions: {}, 
    allNodeTypeIcons: {},
    VERSION: "2.1.1", 
    events: { filter: () => ({ onValue: () => {} }) },
    nodedescription: () => {},
    channeltype: () => {},
    channelrenderer: () => {},
    nodetype: () => {},
    noderenderer: () => {}
};
global._ = { 
    findWhere: (a,s)=>a.find(i=>Object.keys(s).every(k=>i[k]===s[k])),
    filter: (a,f)=>a.filter(f),
    isUndefined: (v)=>v===undefined
};
global.document = { createElement: ()=>({style:{}}), getElementById: ()=>({innerHTML:''}) };
global.window = { setTimeout: ()=>{} };

const root = path.join(__dirname, '..');
const nodesDir = path.join(root, 'js/nodes');
const examplesDir = path.join(root, 'js/examples');

// Cargar Infraestructura Base
eval(fs.readFileSync(path.join(root, 'js/mozziflow.js'), 'utf8'));
if (!global.MOZZI_TYPES && typeof MOZZI_TYPES !== 'undefined') global.MOZZI_TYPES = MOZZI_TYPES;

// Cargar Exportador
eval(fs.readFileSync(path.join(root, 'js/mozziexport.js'), 'utf8'));

// Cargar Nodos
fs.readdirSync(nodesDir).forEach(f => {
    if (f.endsWith('.js')) eval(fs.readFileSync(path.join(nodesDir, f), 'utf8'));
});

function getExampleCode(name) {
    global.EXAMPLES = {}; 
    const examplePath = path.join(examplesDir, name + '.js');
    if (!fs.existsSync(examplePath)) return "// ERROR: File not found " + examplePath;
    
    eval(fs.readFileSync(examplePath, 'utf8'));
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
        } else if (p[0]==='node/set-data') {
            const n = nodes.find(x=>x.nodeid===p[1]); 
            if(n) {
                try { n.data = JSON.parse(Buffer.from(p.slice(2).join(' '), 'base64').toString()); } catch(e) {}
            }
        }
    });
    global.mozziFlowContainer = nodes;
    global.mozziFlowClassConnection = links;
    return NodeToMozziCppInternal();
}

// Argument handling for single file export
const targetName = process.argv[2];
if (targetName) {
    try {
        console.log(getExampleCode(targetName).replace(/\\n/g, '\n'));
    } catch(e) {
        console.log(`// FATAL ERROR generating ${targetName}: ${e.message}`);
    }
} else {
    const files = fs.readdirSync(examplesDir).filter(f => f.endsWith('.js'));
    files.forEach(f => {
        const name = f.replace('.js', '');
        console.log(`\n/* =================================================`);
        console.log(`   EXAMPLE: ${name.toUpperCase()} */`);
        console.log(`   ================================================= */`);
        try { console.log(getExampleCode(name).replace(/\\n/g, '\n')); } catch(e) { console.log(`// ERROR: ${e.message}`); }
    });
}
