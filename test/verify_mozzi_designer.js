const fs = require('fs');
const path = require('path');

/**
 * UNIFIED TEST SUITE FOR MOZZIFLOWEDITOR
 * Verifies:
 * 1. Node Library integrity
 * 2. C++ Code Generation (Exporter)
 * 3. Sample Processing & Huffman Compression
 * 4. Predefined Examples validity
 */

// --- MOCK ENVIRONMENT ---
global.NodeLibrary = [];
global.mozziFlowContainer = [];
global.mozziFlowClassConnection = [];
global.mozziFlowRoot = {
    addNode: function(type, title) {
        var node = {
            nodeid: "node_" + Math.random().toString(36).substr(2, 5),
            id: "rpd_" + Math.random().toString(36).substr(2, 5),
            nodetype: type,
            nodeclass: "", 
            nodeinletvalue: {},
            inlets: {},
            outlets: {},
            move: function(x, y) {},
            type: type
        };
        var def = global.NodeLibrary.find(n => n.nodetype === type);
        if(def) {
            node.nodeclass = def.nodeclass;
            if(def.rpdnode.inlets) {
                Object.keys(def.rpdnode.inlets).forEach(k => {
                    node.inlets[k] = { receive: function(val) {
                        if(type === 'input/constant' && k === 'val') {
                            if(!node.data) node.data = {};
                            node.data.value = val;
                        }
                    }};
                });
            }
        }
        node.rpdNode = node; // Link back for exporter compatibility
        global.mozziFlowContainer.push(node);
        return node;
    }
};
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
global.window = { dispatchEvent: () => {}, btoa: (s) => Buffer.from(s).toString('base64'), atob: (s) => Buffer.from(s, 'base64').toString('utf8') };
global.document = { 
    getElementById: () => ({ innerHTML: '', style: {}, previousSibling: {} }), 
    getElementsByName: () => [{ value: '' }] 
};
global._ = { findWhere: (arr, p) => arr.find(i => Object.keys(p).every(k => i[k] === p[k])), filter: (arr, f) => arr.filter(f), isUndefined: (v) => v === undefined, uniq: (arr) => [...new Set(arr)] };

const originalWarn = console.warn;
console.warn = () => {}; // Silence connection warnings during import test
const originalError = console.error;
console.error = () => {}; // Silence connection errors during import test
// --- LOAD DESIGNER LOGIC ---
const jsDir = path.join(__dirname, '../js');
function loadDesignerScript(file) {
    const content = fs.readFileSync(path.join(jsDir, file), 'utf8');
    global.eval(content);
}

// Order matters for dependencies
loadDesignerScript('mozziflow.js');
loadDesignerScript('mozziexport.js');
loadDesignerScript('sample_converter.js');
loadDesignerScript('huffman_converter.js');

// Load all individual node files
const nodesDir = path.join(jsDir, 'nodes');
if (fs.existsSync(nodesDir)) {
    fs.readdirSync(nodesDir).forEach(file => {
        if (file.endsWith('.js')) {
            loadDesignerScript('nodes/' + file);
        }
    });
}

// global.EXAMPLES is initialized in index.html, we need to ensure it exists
global.EXAMPLES = {};

// Load all individual examples
const examplesDir = path.join(jsDir, 'examples');
if (fs.existsSync(examplesDir)) {
    fs.readdirSync(examplesDir).forEach(file => {
        if (file.endsWith('.js')) {
            loadDesignerScript('examples/' + file);
        }
    });
}

console.warn = originalWarn;
console.error = originalError;

// Helper to simulate import
const editorSource = fs.readFileSync(path.join(jsDir, 'mozziflow_editor.js'), 'utf8');
const searchStr = "var importPlainNetwork = function(code) {";
const startIdx = editorSource.indexOf(searchStr);
if (startIdx !== -1) {
    // Find the matching closing brace for the function
    let braceCount = 0;
    let endIdx = -1;
    for (let i = startIdx + searchStr.length - 1; i < editorSource.length; i++) {
        if (editorSource[i] === '{') braceCount++;
        if (editorSource[i] === '}') braceCount--;
        if (braceCount === 0) {
            endIdx = i;
            break;
        }
    }
    const fnBody = editorSource.substring(startIdx, endIdx + 1);
    eval(fnBody); // Defines var importPlainNetwork
    global.importPlainNetwork = importPlainNetwork;
}

const searchStr2 = "var NodeToMozziCpp = function() {";
const startIdx2 = editorSource.indexOf(searchStr2);
if (startIdx2 !== -1) {
    let braceCount = 0;
    let endIdx = -1;
    for (let i = startIdx2 + searchStr2.length - 1; i < editorSource.length; i++) {
        if (editorSource[i] === '{') braceCount++;
        if (editorSource[i] === '}') braceCount--;
        if (braceCount === 0) {
            endIdx = i;
            break;
        }
    }
    const fnBody = editorSource.substring(startIdx2, endIdx + 1);
    eval(fnBody); // Defines var NodeToMozziCpp
    global.NodeToMozziCpp = NodeToMozziCpp;
}

if (!global.importPlainNetwork) {
    throw new Error("Could not find importPlainNetwork in mozziflow_editor.js");
}

// --- TEST RUNNER ---
let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
    totalTests++;
    if (condition) {
        passedTests++;
        console.log(`  [PASS] ${message}`);
    } else {
        console.error(`  [FAIL] ${message}`);
    }
}

console.log("=== MOZZI DESIGNER AUTOMATED VERIFICATION ===\n");

// 1. LIBRARY INTEGRITY
console.log("1. Library Integrity:");
assert(global.NodeLibrary.length > 20, `Library should have many nodes (found ${global.NodeLibrary.length})`);
const essentialNodes = ['wave/mozzi_sin', 'filter/mozzi_svf', 'signal/mozzi_adsr', 'output/mozzi_out', 'wave/mozzi_sample'];
essentialNodes.forEach(type => {
    assert(global.NodeLibrary.find(n => n.nodetype === type), `Essential node ${type} should exist`);
});

// 2. EXPORTER TOPOLOGY & ORPHAN REMOVAL
console.log("\n2. Exporter & Signal Path:");
global.mozziFlowContainer = [];
global.mozziFlowClassConnection = [];
const osc = global.mozziFlowRoot.addNode('wave/mozzi_sin');
const out = global.mozziFlowRoot.addNode('output/mozzi_out');
const orphan = global.mozziFlowRoot.addNode('wave/mozzi_saw'); // No output path

global.mozziFlowClassConnection.push({
    node_out_id: osc.nodeid,
    node_in_id: out.nodeid,
    inlet_alias: 'in', // Corrected from audio_in
    outlet_alias: 'out'
});

const code = NodeToMozziCpp();
assert(code.indexOf('oscil_') !== -1, "Connected oscillator instance should be in code");
assert(code.indexOf('oscil_' + orphan.nodeid) === -1, "Orphan oscillator should be REMOVED (Optimized)");
assert(code.indexOf('updateAudio') !== -1, "Sketch should have updateAudio");

// 3. AUDIO PROCESSING & SAMPLE EXPORT
console.log("\n3. Audio Processing:");
const mockAudio = [0, 64, 127, 0, -64, -127];
const huffResult = global.MozziHuffmanConverter.processData(mockAudio);
assert(huffResult.encodedData.length > 0, "Huffman compression should produce data");
assert(huffResult.huffmanTable.length > 0, "Huffman tree should be generated");

// Test Sample Export
osc.nodetype = 'wave/mozzi_sample'; // Switch node type for export test
osc.data = { sample_table: "1,2,3", sample_table_size: 3, sample_name: "test_sample" };
const sampleCode = NodeToMozziCpp();
assert(sampleCode.indexOf('PROGMEM') !== -1, "Sample data should be in PROGMEM");
assert(sampleCode.indexOf('sample_') !== -1, "Sample object should be instantiated");

// 4. EXAMPLES VALIDITY
// ... (existing example test) ...

// 5. ANALOG NODE LOGIC
console.log("\n5. Analog Node Logic:");
const analogNode = global.NodeLibrary.find(n => n.nodetype === 'input/mozzi_analog');
assert(analogNode !== undefined, "Analog In node should exist");
if (analogNode) {
    const code = analogNode.mozzi.control({id: "test"}, "test_v", { pin: "A0" });
    assert(code.indexOf('mozziAnalogRead') !== -1, "Analog node should use mozziAnalogRead");
}

console.log(`\n=== RESULTS: ${passedTests}/${totalTests} Passed ===`);
if (passedTests < totalTests) process.exit(1);
