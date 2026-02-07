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
            // SAFETY FIX: Default to 'Unknown' if class is missing to prevent crashes
            const nodeClass = (def && def.nodeclass) ? def.nodeclass : 'Unknown';
            const safeVariable = nodeClass ? nodeClass.toLowerCase() + '_' + id.replace(/[^a-zA-Z0-9]/g, "") : "node_" + id;
            
            nodes.push({
                nodeid: id, 
                nodetype: type, 
                nodeclass: nodeClass,
                nodevariable: safeVariable,
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
        } else if (parts[0] === 'node/set-data') {
            const id = parts[1];
            const rawData = parts.slice(2).join(' ');
            try {
                const data = JSON.parse(Buffer.from(rawData, 'base64').toString('utf8'));
                const node = nodes.find(n => n.nodeid === id);
                if (node) {
                    node.data = data;
                }
            } catch (e) { console.error(`Error decoding data for ${id}:`, e); }
        }
    });

    return { nodes, links };
}

// 4. GENERATE AND EXPORT
const exampleFiles = fs.readdirSync(examplesDir).filter(f => f.endsWith('.js'));
console.log(`\nExporting ${exampleFiles.length} examples to individual files and 'all_examples_export.log'...\n`);

const logFile = path.join(root, 'all_examples_export.log');
fs.writeFileSync(logFile, `// MOZZIFLOW CONSOLIDATED EXPORT AUDIT - ${new Date().toISOString()}\n\n`);

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
        
        // Write individual file
        const sketchFolder = path.join(exportDir, exampleName);
        if (!fs.existsSync(sketchFolder)) fs.mkdirSync(sketchFolder, { recursive: true });
        fs.writeFileSync(path.join(sketchFolder, `${exampleName}.ino`), cppCode);
        
        // Append to combined log
        fs.appendFileSync(logFile, `\n\n// =========================================================\n`);
        fs.appendFileSync(logFile, `// EXAMPLE: ${exampleName}\n`);
        fs.appendFileSync(logFile, `// =========================================================\n\n`);
        fs.appendFileSync(logFile, cppCode);
        fs.appendFileSync(logFile, `\n\n`);

        if (cppCode.includes("Unknown")) {
             console.warn(`⚠️  [${exampleName}] Exported with Unknown classes.`);
        } else {
             console.log(`✅ [${exampleName}] Exported and logged.`);
        }
        
    } catch (err) {
        console.error(`❌ [${exampleName}] Export failed: ${err.stack}`);
    }
});
