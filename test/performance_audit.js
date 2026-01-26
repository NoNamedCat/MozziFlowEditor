const fs = require('fs');
const path = require('path');

// --- MOCK ENVIRONMENT ---
global.NodeLibrary = [];
global.mozziFlowContainer = [];
global.mozziFlowClassConnection = [];
global.Rpd = { nodetype: ()=>{}, channeltype: ()=>{}, channelrenderer: ()=>{}, noderenderer: ()=>{}, nodedescription: ()=>{} };
global.d3 = { select: ()=>({ classed: ()=>({ node: ()=>({}) }) }) };
global._ = { findWhere: (a,s)=>a.find(i=>Object.keys(s).every(k=>i[k]===s[k])) };
global.document = { createElement: ()=>({style:{}}), getElementById: ()=>({innerHTML:''}) };
global.window = { setTimeout: ()=>{} };

const root = path.join(__dirname, '..');
const nodesDir = path.join(root, 'js/nodes');

// Load Nodes
fs.readdirSync(nodesDir).forEach(f => {
    if (f.endsWith('.js')) {
        eval(fs.readFileSync(path.join(nodesDir, f), 'utf8'));
    }
});
// Load Exporter
eval(fs.readFileSync(path.join(root, 'js/mozziexport.js'), 'utf8'));

// Test Scenario: A "Dirty" design that should be optimized
// 1. Sine Osc (Freq 440) -> ADSR (Fixed levels) -> Gain (Modulated) -> Output
// 2. Constant(100) -> Cutoff of SVF Filter
function audit() {
    global.mozziFlowContainer = [
        { nodeid: 'n1', nodetype: 'wave/mozzi_sin', nodeinletvalue: { freq: ['freq', '440'] } },
        { nodeid: 'n2', nodetype: 'signal/mozzi_adsr', nodeinletvalue: { att: ['att', '10'], lev: ['lev', '255'], dec: ['dec', '100'], sus: ['sus', '128'], rel: ['rel', '50'] } },
        { nodeid: 'n3', nodetype: 'filter/mozzi_svf', nodeinletvalue: { cutoff: ['cutoff', '1000'], res: ['res', '150'] } },
        { nodeid: 'n4', nodetype: 'output/mozzi_out' }
    ];
    
    global.mozziFlowClassConnection = [
        { node_out_id: 'n1', outlet_alias: 'out', node_in_id: 'n3', inlet_alias: 'in' }, // Sine -> Filter
        { node_out_id: 'n2', outlet_alias: 'out', node_in_id: 'n4', inlet_alias: 'in' },  // ADSR (used as gain mock) -> Out
        { node_out_id: 'n3', outlet_alias: 'out', node_in_id: 'n4', inlet_alias: 'in' }   // Filter -> Out
    ];

    const code = NodeToMozziCppInternal();
    console.log("--- GENERATED CODE AUDIT ---");
    
    const lines = code.split('\n');
    const setupSection = code.substring(code.indexOf('void setup()'), code.indexOf('void updateControl()'));
    const controlSection = code.substring(code.indexOf('void updateControl()'), code.indexOf('AudioOutput updateAudio()'));
    
    let score = 0;
    let total = 4;

    console.log("\nChecking for Smart Setup (Constant params in setup):");
    if (setupSection.includes('setFreq(440f)')) { console.log("[PASS] setFreq in setup"); score++; } 
    else { console.log("[FAIL] setFreq NOT in setup"); }

    if (setupSection.includes('setCentreFreq(1000)')) { console.log("[PASS] SVF cutoff in setup"); score++; } 
    else { console.log("[FAIL] SVF cutoff NOT in setup"); }

    console.log("\nChecking for Clean Control Loop (No constant updates):");
    const redundantFreq = controlSection.includes('setFreq(440f)');
    const redundantCutoff = controlSection.includes('setCentreFreq(1000)');

    if (!redundantFreq) { console.log("[PASS] No setFreq in control loop"); score++; } 
    else { console.log("[FAIL] Redundant setFreq in control loop!"); }

    if (!redundantCutoff) { console.log("[PASS] No setCentreFreq in control loop"); score++; } 
    else { console.log("[FAIL] Redundant setCentreFreq in control loop!"); }

    console.log("\nChecking for Cast Optimization:");
    const hasAggressiveCasts = controlSection.includes('(int)440') || controlSection.includes('(float)440');
    if (!hasAggressiveCasts) { console.log("[PASS] No aggressive casts for constants"); } 
    else { console.log("[FAIL] Found aggressive casts in control loop!"); }

    console.log(`\nFINAL SCORE: ${score}/${total}`);
    
    if (score === total) {
        console.log("\nAUDIT SUCCESSFUL: The tool is now generating clean, manual-quality code.");
    } else {
        console.log("\nAUDIT FAILED: Optimization gaps found.");
    }
    
    // Output full code for manual inspection if needed
    // console.log("\n--- CODE PREVIEW ---");
    // console.log(code);
}

audit();
