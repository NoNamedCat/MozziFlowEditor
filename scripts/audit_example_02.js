const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Mock Environment
global.NodeLibrary = []; global.window = global; global.EXAMPLES = {};
global.MOZZI_TYPES = { 
    'mozziflow/bool': {cpp:'bool'}, 'mozziflow/int8_t':{cpp:'int8_t'}, 'mozziflow/uint8_t':{cpp:'uint8_t'},
    'mozziflow/int16_t':{cpp:'int16_t'}, 'mozziflow/uint16_t':{cpp:'uint16_t'}, 
    'mozziflow/int32_t':{cpp:'int32_t'}, 'mozziflow/uint32_t':{cpp:'uint32_t'},
    'mozziflow/float':{cpp:'float'}, 'mozziflow/any':{cpp:'int32_t'}
};
global.isVar = (v) => isNaN(parseFloat(v));

// Load Files
const jsDir = 'C:/Users/Juan/Documents/Arduino/libraries/mozzifloweditor/js';
const files = ['nodes/math.js', 'nodes/modifier.js', 'nodes/signal.js', 'nodes/source.js', 'nodes/ch32x035.js', 'nodes/io.js', 'mozziexport.js'];
files.forEach(f => { 
    const content = fs.readFileSync(path.join(jsDir, f), 'utf8');
    new vm.Script(content).runInThisContext();
});

// Load Example 02
const exampleContent = fs.readFileSync(path.join(jsDir, 'examples/02_midi_filter.js'), 'utf8');
eval(exampleContent); 

const patchSource = global.EXAMPLES['02_midi_filter'];
const patch = { nodes: {}, links: [] };
patchSource.split('\n').forEach(line => {
    const p = line.trim().split(/\s+/);
    if (p[0] === 'patch/add-node') patch.nodes[p[2]] = { id: p[2], type: p[3], data: {} };
    else if (p[0] === 'node/rate') patch.nodes[p[1]].data.rate_mode = parseInt(p[2]);
    else if (p[0] === 'node/set-data') Object.assign(patch.nodes[p[1]].data, JSON.parse(Buffer.from(p[2], 'base64').toString('utf8')));
    else if (p[0] === 'outlet/connect') {
        const out = p[1].split(':'), ins = p[2].split(':');
        patch.links.push({ prev_node: out[0], prev_outlet: out[1], next_node: ins[0], next_inlet: ins[1] });
    }
});

const result = exportToMozzi(patch, null);
console.log(result);