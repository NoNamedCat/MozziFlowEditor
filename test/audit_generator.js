const fs = require('fs');
const path = require('path');

// --- MOCK ---
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
fs.readdirSync(path.join(root, 'js/nodes')).forEach(f => eval(fs.readFileSync(path.join(root, 'js/nodes', f), 'utf8')));
eval(fs.readFileSync(path.join(root, 'js/mozziexport.js'), 'utf8'));

const examplesDir = path.join(root, 'js/examples');
const files = fs.readdirSync(examplesDir);

console.log("BASE AUDIT REPORT\n");
let totalGlobals = 0;
let totalLeaks = 0;

files.forEach(f => {
    const name = f.replace('.js', '');
    try {
        eval(fs.readFileSync(path.join(examplesDir, f), 'utf8'));
        const cmds = global.EXAMPLES[name].split('\n');
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
        const code = NodeToMozziCppInternal();
        const g = (code.match(/volatile int/g) || []).length;
        const leak = (code.split('updateControl()')[1] || '').split('}')[0].split('.next(').length - 1;
        totalGlobals += g; totalLeaks += leak;
        console.log(`${name.padEnd(20)}: Globals=${g}, Leaks=${leak}`);
    } catch(e) {}
});

console.log(`\nTOTALS: Globals=${totalGlobals}, AudioLeaks=${totalLeaks}`);
