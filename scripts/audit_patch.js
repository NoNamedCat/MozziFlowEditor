const fs = require('fs');
const path = require('path');

// Mock environment to load nodes in Node.js
global.NodeLibrary = [];
global.Rpd = { channeltype: () => {}, nodetype: () => {}, noderenderer: () => {} };
global.MATH_TYPES_ALL = []; global.MATH_TYPES_INT = []; global.MOD_TYPES_HIFI = []; global.MOD_TYPES_ALL = []; global.isVar = () => true;

function audit(patchText) {
    console.log("--- AUDIT START ---");
    
    // 1. Load all real node files
    const nodesDir = path.join(__dirname, '../js/nodes');
    const files = fs.readdirSync(nodesDir);
    files.forEach(f => {
        if (f.endsWith('.js')) {
            const content = fs.readFileSync(path.join(nodesDir, f), 'utf8');
            try { eval(content); } catch(e) { /* Ignore UI-only errors */ }
        }
    });

    const registeredTypes = global.NodeLibrary.map(n => n.nodetype);
    console.log(`Registered types: ${registeredTypes.length}`);

    // 2. Parse Patch
    const lines = patchText.split('\n');
    let errors = 0;
    lines.forEach((line, i) => {
        const parts = line.trim().split(' ');
        if (parts[0] === 'patch/add-node') {
            const type = parts[3];
            if (!registeredTypes.includes(type)) {
                console.error(`Error at line ${i+1}: Node type '${type}' is NOT registered!`);
                errors++;
            }
        }
    });

    if (errors === 0) {
        console.log("--- AUDIT PASSED: Patch is 100% faithful to the library ---");
        process.exit(0);
    } else {
        console.error(`--- AUDIT FAILED: ${errors} errors found ---`);
        process.exit(1);
    }
}

const patch = process.argv[2] ? fs.readFileSync(process.argv[2], 'utf8') : "";
if (patch) audit(patch);
else console.log("Usage: node audit_patch.js <patch_file>");
