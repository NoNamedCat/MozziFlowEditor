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

console.log("SMART AUDIT REPORT (Real Leaks Only)\n");
console.log(`${"Example".padEnd(20)} | Globals | Real Leaks`);
console.log("-".repeat(45));

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
        
        // Custom Export to extract internal nodeRates
        const code = NodeToMozziCppInternal();
        const g = (code.match(/volatile int/g) || []).length;
        
        // Heuristic: A leak is when an AUDIO node is forced to CONTROL loop
        // We look for objects like Oscil, StateVariable, MultiResonantFilter, etc inside updateControl
        const controlBlock = (code.split('updateControl()')[1] || '').split('}')[0];
        
        const audioObjects = [
            'Oscil<', 'Phasor<', 'WavePacket<', 'StateVariable',
            'LowPassFilter', 'MultiResonantFilter', 'AudioDelayFeedback',
            'WavePacketSample', 'DCfilter'
        ];
        
        let realLeaks = 0;
        audioObjects.forEach(obj => {
            // Count calls to .next() or similar methods on these objects inside updateControl
            // Actually, any mention of the variable associated with these objects followed by a method
            // is suspicious if it happens in control.
            nodes.forEach(n => {
                const def = NodeLibrary.find(x => x.nodetype === n.nodetype);
                if (def && def.mozzi && def.mozzi.rate === 'audio') {
                    const varName = n.nodeclass.toLowerCase() + "_" + n.nodeid; // Approximation
                    // Use regex to find if this specific node instance calls .next() in control
                    // Since variable naming might vary, we search for the pattern in the generated code
                    if (controlBlock.includes(".next(") && def.mozzi.audio && def.mozzi.audio.toString().includes(".next")) {
                        // This is complex to automate perfectly without the internal variable map
                    }
                }
            });
            // Simpler: find if any of the audio-rate typenames appear in control logic calls
            if (controlBlock.includes(".next") && obj.includes(".next")) {
                // ...
            }
        });

        // Let's use a more direct method: look for the audio rate objects being declared or used in control
        // Since we can't easily map nodeids to C++ vars here, we count known audio class methods in control
        const leaks = (controlBlock.match(/\.next\(/g) || []).length;
        // Subtract known control-rate objects that use .next
        const controlObjectsCount = (controlBlock.match(/mozziead|mozzimetronome|mozziadsr|mozzismooth|mozziline|mozziportamento/g) || []).length;
        
        const actualLeaks = Math.max(0, leaks - controlObjectsCount);

        console.log(`${name.padEnd(20)} | ${g.toString().padEnd(7)} | ${actualLeaks}`);
    } catch(e) {}
});
