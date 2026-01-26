const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const exportDir = path.join(root, 'exported_sketches');
const examplesDir = path.join(root, 'js/examples');
const nodesDir = path.join(root, 'js/nodes');
const exportFile = path.join(root, 'js/mozziexport.js');

if (!fs.existsSync(exportDir)) fs.mkdirSync(exportDir, { recursive: true });

// 1. MOCK RPD & GLOBAL LIBRARIES
global.NodeLibrary = [];
global.EXAMPLES = {};
global.mozziFlowContainer = [];
global.mozziFlowClassConnection = [];
global.Rpd = { nodetype: () => {}, noderenderer: () => {}, channeltype: () => {}, channelrenderer: () => {}, nodedescription: () => {} };
global.d3 = { select: () => ({ classed: () => ({ node: () => ({}) }) }) }; 
global._ = { findWhere: (arr, search) => arr.find(item => Object.keys(search).every(k => item[k] === search[k])) };
global.document = { createElement: () => ({ style: {} }) };
global.window = { setTimeout: () => {} };

// 2. LOAD CORE LOGIC
const nodeFiles = fs.readdirSync(nodesDir).filter(f => f.endsWith('.js'));
nodeFiles.forEach(file => {
    const content = fs.readFileSync(path.join(nodesDir, file), 'utf8');
    try { eval(content); } catch(e) { console.error(`Error loading node ${file}:`, e); }
});

const exportContent = fs.readFileSync(exportFile, 'utf8');
eval(exportContent);

// 3. IMPROVED PARSER
function parseExample(cmdString) {
    const nodes = [];
    const links = [];
    const lines = cmdString.split('\n');

    lines.forEach(line => {
        const parts = line.trim().split(/\s+/);
        if (parts[0] === 'patch/add-node') {
            const id = parts[2];
            const type = parts[3];
            const title = parts.slice(4).join(' ');
            
            const def = NodeLibrary.find(d => d.nodetype === type);
            const nodeClass = def ? def.nodeclass : 'Unknown';
            
            nodes.push({ 
                nodeid: id, 
                nodetype: type, 
                nodeclass: nodeClass,
                nodevariable: nodeClass.toLowerCase() + "_" + id.replace(/[^a-zA-Z0-9]/g, ""),
                nodedesc: title,
                nodeinletvalue: {},
                nodeoutletvalue: {},
                nodeinlet: [],
                nodeoutlet: [],
                nodeposition: {x:0, y:0},
                rpdNode: { inlets: {}, data: {} } // Minimal mock
            });
        } else if (parts[0] === 'outlet/connect') {
            const [srcNodeId, srcOut] = parts[1].split(':');
            const [dstNodeId, dstIn] = parts[2].split(':');
            
            const srcNode = nodes.find(n => n.nodeid === srcNodeId);
            const dstNode = nodes.find(n => n.nodeid === dstNodeId);

            links.push({ 
                node_in_id: dstNodeId, 
                inlet_alias: dstIn, 
                node_out_id: srcNodeId, 
                outlet_alias: srcOut,
                inlet_class: dstNode ? dstNode.nodeclass : '',
                inlet_class_alias: dstNode ? dstNode.nodevariable : '',
                outlet_class: srcNode ? srcNode.nodeclass : '',
                outlet_class_alias: srcNode ? srcNode.nodevariable : ''
            });
        } else if (parts[0] === 'node/update-inlet') {
            const id = parts[1];
            const inlet = parts[2];
            const val = parts[3];
            const node = nodes.find(n => n.nodeid === id);
            if (node) {
                node.nodeinletvalue[inlet] = [inlet, val];
            }
        }
    });

    return { nodes, links };
}

// 4. GENERATE AND EXPORT
const exampleFiles = fs.readdirSync(examplesDir).filter(f => f.endsWith('.js'));
console.log(`\nExporting ${exampleFiles.length} examples using internal exporter...\n`);

exampleFiles.forEach(file => {
    const exampleName = file.replace('.js', '');
    try {
        const exampleContent = fs.readFileSync(path.join(examplesDir, file), 'utf8');
        eval(exampleContent); 

        const patchSource = global.EXAMPLES[exampleName];
        const flatPatch = parseExample(patchSource);

        if (flatPatch.nodes.length === 0) {
            console.warn(`⚠️  [${exampleName}] No nodes found.`);
            return;
        }

        // Setup globals for the exporter
        global.mozziFlowContainer = flatPatch.nodes;
        global.mozziFlowClassConnection = flatPatch.links;

        const cppCode = NodeToMozziCppInternal();
        
        const sketchFolder = path.join(exportDir, exampleName);
        if (!fs.existsSync(sketchFolder)) fs.mkdirSync(sketchFolder, { recursive: true });
        fs.writeFileSync(path.join(sketchFolder, `${exampleName}.ino`), cppCode);
        
        if (cppCode.includes("Unknown")) {
             console.warn(`⚠️  [${exampleName}] Exported with Unknown classes.`);
        } else {
             console.log(`✅ [${exampleName}] Exported successfully.`);
        }
        
    } catch (err) {
        console.error(`❌ [${exampleName}] Export failed: ${err.stack}`);
    }
});