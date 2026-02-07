
const fs = require('fs');
const path = require('path');

global.NodeLibrary = [];
global.MOZZI_TYPES = {}; // Mock types
global.isVar = () => false;

const ROOT_DIR = path.join(__dirname, '..');
const NODES_DIR = path.join(ROOT_DIR, 'js/nodes');

fs.readdirSync(NODES_DIR).forEach(f => {
    if (f.endsWith('.js')) {
        console.log("Loading", f);
        try {
            eval(fs.readFileSync(path.join(NODES_DIR, f), 'utf8'));
        } catch (e) {
            console.error("Error loading " + f + ":", e);
        }
    }
});

console.log("Validating NodeLibrary (" + global.NodeLibrary.length + " nodes)...");

global.NodeLibrary.forEach((node, idx) => {
    if (!node.rpdnode) {
        console.error(`[FAIL] Node at index ${idx} (${node.nodetype}) is missing 'rpdnode' property!`);
        console.log(node);
    } else {
        // console.log(`[OK] ${node.nodetype}`);
    }
});

console.log("Validation complete.");
