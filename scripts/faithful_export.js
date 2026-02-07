const fs = require('fs');
const path = require('path');

// 1. Mock Browser Environment
global.window = global;
global.MOZZI_TYPES = {
    'mozziflow/uint8_t': { cpp: 'uint8_t' },
    'mozziflow/int16_t': { cpp: 'int16_t' },
    'mozziflow/int32_t': { cpp: 'int32_t' },
    'mozziflow/float': { cpp: 'float' }
};
global.NodeLibrary = [];
global.Rpd = { channeltype: () => {}, nodetype: () => {}, noderenderer: () => {} };
global.isVar = (v) => isNaN(parseFloat(v));

// 2. Load Real Files
const jsDir = path.join(__dirname, '../js');
const files = [
    'nodes/math.js', 'nodes/modifier.js', 'nodes/signal.js', 
    'nodes/source.js', 'nodes/io.js', 'nodes/midi.js', 'nodes/ch32x035.js', 'mozziexport.js'
];
files.forEach(f => {
    const content = fs.readFileSync(path.join(jsDir, f), 'utf8');
    const script = new (require('vm').Script)(content);
    script.runInThisContext();
});

// 3. Define the Patch (DYNAMICALLY DECODED)
const patch = { nodes: {}, links: [] };
const exampleText = fs.readFileSync(path.join(jsDir, 'examples/midi_synth_pro.js'), 'utf8');
const lines = exampleText.split('\n');

lines.forEach(line => {
    const parts = line.trim().split(' ');
    if (parts[0] === 'patch/add-node') {
        const id = parts[2], type = parts[3];
        patch.nodes[id] = { id: id, type: type, data: {}, rate_mode: 0 };
    } else if (parts[0] === 'node/rate') {
        patch.nodes[parts[1]].data.rate_mode = parseInt(parts[2]);
    } else if (parts[0] === 'node/set-data') {
        const data = JSON.parse(Buffer.from(parts[2], 'base64').toString('utf8'));
        Object.assign(patch.nodes[parts[1]].data, data);
    } else if (parts[0] === 'outlet/connect') {
        const out = parts[1].split(':'), ins = parts[2].split(':');
        patch.links.push({ prev_node: out[0], prev_outlet: out[1], next_node: ins[0], next_inlet: ins[1] });
    }
});

// 4. Run Export & Save
if (typeof exportToMozzi === 'function') {
    const result = exportToMozzi(patch, null);
    const buildDir = path.join(__dirname, '../temp_compilation');
    if (!fs.existsSync(buildDir)) fs.mkdirSync(buildDir);
    fs.writeFileSync(path.join(buildDir, 'temp_compilation.ino'), result);
    console.log("SKETCH SAVED TO temp_compilation/temp_compilation.ino");
}
