const fs = require('fs');
const path = require('path');

global.NodeLibrary = [];
global.mozziFlowContainer = [];
global.mozziFlowClassConnection = [];
global.EXAMPLES = {};
global.MOZZI_TYPES = {
    'mozziflow/int8_t': { cpp: 'int8_t' },
    'mozziflow/uint8_t': { cpp: 'uint8_t' },
    'mozziflow/int16_t': { cpp: 'int16_t' },
    'mozziflow/uint16_t': { cpp: 'uint16_t' },
    'mozziflow/int32_t': { cpp: 'int32_t' },
    'mozziflow/uint32_t': { cpp: 'uint32_t' },
    'mozziflow/float': { cpp: 'float' },
    'mozziflow/bool': { cpp: 'bool' },
    'mozziflow/sfix8': { cpp: 'SFix8' },
    'mozziflow/sfix16_8': { cpp: 'SFix16_8' },
    'mozziflow/sfix32_16': { cpp: 'SFix32_16' },
    'mozziflow/ufix16_16': { cpp: 'UFix16_16' }
};

global.d3_tiny = { select: () => ({ append: () => ({ call: () => ({ attr: () => ({ text: () => ({ append: () => ({ call: () => {} }) }) }) }) }) }) };
global.d3 = global.d3_tiny;
global.Rpd = { channeltype: () => {}, nodetype: () => {}, noderenderer: () => {}, channelrenderer: () => {}, events: { filter: () => ({ onValue: () => {} }) }, addPatch: () => ({ addNode: () => {} }) };
global._ = { findWhere: (arr, p) => arr.find(i => Object.keys(p).every(k => i[k] === p[k])), filter: (arr, f) => arr.filter(f), isUndefined: (v) => v === undefined, debounce: (f) => f };
global.window = { dispatchEvent: () => {}, btoa: (s) => Buffer.from(s).toString('base64'), atob: (s) => Buffer.from(s, 'base64').toString('utf8') };
global.document = { getElementById: () => ({ innerHTML: '', style: {} }), createElement: () => ({ style: {} }), activeElement: {} };

global.RpdUtils = { NodeList: function() { this.addOnClick = () => {}; this.addSearch = () => {}; this.addCtrlSpaceAndArrows = () => {}; }, getNodeTypesByToolkit: () => ({}) };
const jsDir = './js';
function loadScript(file) {
    const content = fs.readFileSync(path.join(jsDir, file), 'utf8');
    eval(content);
}

// Load Core & Engine
const coreContent = fs.readFileSync(path.join(jsDir, 'mozziflow.js'), 'utf8');
global.eval(coreContent);
const exportContent = fs.readFileSync(path.join(jsDir, 'mozziexport.js'), 'utf8');
global.eval(exportContent);
global.exportToMozzi = exportToMozzi;

// Load Nodes
const nodesDir = './js/nodes';
fs.readdirSync(nodesDir).forEach(file => { if (file.endsWith('.js')) loadScript('nodes/' + file); });

// Load Examples
const examplesDir = './js/examples';
fs.readdirSync(examplesDir).forEach(file => { if (file.endsWith('.js')) loadScript('examples/' + file); });

// Mock Editor Functions
const editorSource = fs.readFileSync('./js/mozziflow_editor.js', 'utf8');
const exportSource = fs.readFileSync('./js/mozziexport.js', 'utf8');

// Use simple assignments for the functions we need
global.importPlainNetwork = function(code) {
    var lines = code.split(/\r?\n/); var nodeMap = {}; var ioMap = {}; var connections = []; var dataQueue = {};
    lines.forEach(function(line) { var parts = line.trim().split(' '); if (parts[0] === 'node/set-data') { try { dataQueue[parts[1]] = JSON.parse(Buffer.from(parts.slice(2).join(' '), 'base64').toString('utf8')); } catch(e) {} } });
    lines.forEach(function(line) {
        var parts = line.trim().split(' '); var cmd = parts[0];
        if (cmd === 'patch/add-node') {
            var id = parts[2], type = parts[3], title = parts.slice(4).join(' ').replace(/%20/g, ' ');
            var node = global.mozziFlowRoot.addNode(type, title); node.nodeid = id; nodeMap[id] = node;
            if (dataQueue[id]) { 
                if (!node.data) node.data = {}; 
                for (var key in dataQueue[id]) { node.data[key] = dataQueue[id][key]; } 
            } 
        } 
        else if (cmd === 'node/update-inlet') { 
            var node = nodeMap[parts[1]]; 
            if (node) {
                if (!node.data) node.data = {};
                node.data[parts[2]] = parts[3];
            }
        }
        else if (cmd === 'outlet/connect') connections.push(parts);
    });
    connections.forEach(function(link) {
        var outParts = link[1].split(':');
        var inParts = link[2].split(':');
        global.mozziFlowClassConnection.push({
            node_out_id: outParts[0],
            outlet_alias: outParts[1],
            node_in_id: inParts[0],
            inlet_alias: inParts[1]
        });
    });
};

global.NodeToMozziCppInternal = function() {
    var project = { nodes: {}, links: {} };
    if (typeof mozziFlowContainer !== 'undefined') {
        mozziFlowContainer.forEach(function(node) {
            project.nodes[node.nodeid] = { id: node.nodeid, nodeid: node.nodeid, type: node.nodetype, nodetype: node.nodetype, nodevariable: "node_" + node.nodeid, data: node.data || {}, _def: null };
        });
    }
    if (typeof mozziFlowClassConnection !== 'undefined') {
        mozziFlowClassConnection.forEach(function(link, idx) {
            project.links["link_" + idx] = { prev_node: link.node_out_id, prev_outlet: link.outlet_alias, next_node: link.node_in_id, next_inlet: link.inlet_alias };
        });
    }
    return exportToMozzi(project, null);
};

global.NodeToMozziCpp = function() { return global.NodeToMozziCppInternal(); };

// Process All
let output = "// MOZZIFLOW FULL AUDIT LOG - DUMB EXPORTER v14.0\n\n";
Object.keys(global.EXAMPLES).forEach(key => {
    output += `\n// #########################################################\n`;
    output += `// EXAMPLE: ${key}\n`;
    output += `// #########################################################\n\n`;
    
    global.mozziFlowContainer = [];
    global.mozziFlowClassConnection = [];
    global.mozziFlowCount = {};
    global.mozziFlowRoot = { addNode: (type) => {
        const id = "node_" + Math.random().toString(36).substr(2, 5);
        const n = { nodeid: id, id: id, type: type, nodetype: type, data: {} };
        global.mozziFlowContainer.push(n);
        return n;
    }};

    try {
        importPlainNetwork(global.EXAMPLES[key]);
        output += NodeToMozziCpp();
    } catch(e) {
        output += `// EXPORT ERROR: ${e.message}\n`;
    }
});

fs.writeFileSync('audit_export.log', output);
console.log("Audit log generated in audit_export.log");
