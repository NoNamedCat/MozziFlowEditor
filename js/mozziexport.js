/**
 * MOZZI EXPORT ENGINE v111.0 "IRON INTEGRITY REFINED"
 * Standard: Smart DSP Compiler + Multi-Output Global Auto-Declaration
 */

function calculateNodeRates(project) {
    var nodes = project.nodes;
    var links = project.links;
    var nodeRates = {};
    var isFixed = {};

    function findLinkToInlet(nodeId, inletName) {
        return Object.values(links).find(l => l.next_node == nodeId && l.next_inlet == inletName);
    }

    // 1. Initial State: Respect Manual Settings
    Object.keys(nodes).forEach(id => {
        var node = nodes[id];
        var mode = parseInt(node.data ? node.data.rate_mode : 0);
        if (mode === 1) { 
            nodeRates[id] = "CONTROL"; 
            isFixed[id] = true; 
        } else if (mode === 2) { 
            nodeRates[id] = "AUDIO"; 
            isFixed[id] = true; 
        } else { 
            nodeRates[id] = null; 
            isFixed[id] = false; 
        }
    });

    // 2. Selective Backpropagation
    // We run multiple passes to ensure convergence
    for (var p = 0; p < 10; p++) {
        var changed = false;
        Object.keys(nodes).forEach(id => {
            if (isFixed[id]) return; // Never overwrite manual settings
            if (nodeRates[id] === "AUDIO") return; // Already audio

            var node = nodes[id];
            
            // Hardcoded Audio Outputs
            if (node.type.includes("output/mozzi_out") || node.type.includes("output/mozzi_output")) {
                if (nodeRates[id] !== "AUDIO") { nodeRates[id] = "AUDIO"; changed = true; }
                return;
            }

            // Propagation Rule: If I feed ANY node that is AUDIO, and I am AUTO, I become AUDIO
            // UNLESS I am feeding it via a parameter that is traditionally control (Optional refinement, but let's stick to user request)
            var feedsAudio = Object.values(links).some(l => l.prev_node === id && nodeRates[l.next_node] === "AUDIO");
            
            if (feedsAudio) {
                nodeRates[id] = "AUDIO";
                changed = true;
            }
        });
        if (!changed) break;
    }

    // 3. Final Fallback: Use Library Defaults for remaining NULLs
    Object.keys(nodes).forEach(id => {
        if (nodeRates[id] === null) {
            var node = nodes[id];
            var def = NodeLibrary.find(n => n.nodetype === node.type);
            if (def && def.mozzi && def.mozzi.rate) {
                nodeRates[id] = def.mozzi.rate.toUpperCase();
            } else {
                nodeRates[id] = "CONTROL"; // Absolute fallback
            }
        }
    });

    return nodeRates;
}

function exportToMozzi(project, canvas) {
    var nodes = project.nodes;
    var links = project.links;
    var codeParts = {
        includes: new Set(["#include <Mozzi.h>", "#include <Oscil.h>"]),
        globals: [],
        setup: [],
        control: [],
        audio: []
    };

    function findLinkToInlet(nodeId, inletName) {
        return Object.values(links).find(l => l.next_node == nodeId && l.next_inlet == inletName);
    }

    // --- 1. ORDENACIÓN TOPOLÓGICA (DFS) ---
    var sortedNodeIds = [];
    var visited = new Set();
    function visit(nodeId) {
        if (visited.has(nodeId)) return;
        var node = nodes[nodeId];
        if (!node) return;
        var def = NodeLibrary.find(n => n.nodetype === node.type);
        if (def && def.rpdnode && def.rpdnode.inlets) {
            Object.keys(def.rpdnode.inlets).forEach(i => {
                var link = findLinkToInlet(nodeId, i);
                if (link) visit(link.prev_node);
            });
        }
        visited.add(nodeId);
        sortedNodeIds.push(nodeId);
    }
    Object.keys(nodes).forEach(visit);

    // --- 2. INFERENCIA DE TASAS ---
    var nodeRates = calculateNodeRates(project);

    // --- 3. REGISTRO GLOBAL ---
    var declaredSignals = new Set();
    sortedNodeIds.forEach(id => {
        var node = nodes[id];
        var def = NodeLibrary.find(n => n.nodetype === node.type);
        if (!def) return;

        var libOutlets = (def.rpdnode && def.rpdnode.outlets) ? Object.keys(def.rpdnode.outlets) : [];
        var allPossibleOutlets = libOutlets.concat(["out"]);

        allPossibleOutlets.forEach(outName => {
            var varName = "node_" + id + "_" + outName;
            if (!declaredSignals.has(varName)) {
                var cType = (def.mozzi && def.mozzi.is_float) ? "float" : "long";
                codeParts.globals.push(cType + " " + varName + " = 0;");
                declaredSignals.add(varName);
            }
        });

        if (def.nodeclass) {
            var instanceName = def.nodeclass.toLowerCase() + "_" + id;
            var effectiveRate = "MOZZI_" + nodeRates[id] + "_RATE";
            if (def.mozzi && def.mozzi.global) {
                codeParts.globals.push(def.mozzi.global(node, instanceName, effectiveRate));
            } else if (!def.mozzi.is_inline) {
                codeParts.globals.push(def.nodeclass + " " + instanceName + ";");
            }
        }
    });

    // --- 4. GENERACIÓN DE CÓDIGO ---
    sortedNodeIds.forEach(id => {
        var node = nodes[id];
        var def = NodeLibrary.find(n => n.nodetype === node.type);
        if (!def || !def.mozzi) return;

        var finalRate = nodeRates[id];
        var instanceName = def.nodeclass ? (def.nodeclass.toLowerCase() + "_" + id) : ("node_" + id);
        
        var inputs = {};
        if (def.rpdnode && def.rpdnode.inlets) {
            Object.keys(def.rpdnode.inlets).forEach(inName => {
                var link = findLinkToInlet(id, inName);
                if (link) inputs[inName] = "node_" + link.prev_node + "_" + link.prev_outlet;
                else {
                    var val = (node.data && node.data[inName] !== undefined) ? node.data[inName] : null;
                    if (val === null || val === "[pool]" || val === "") val = (def.mozzi.defaults && def.mozzi.defaults[inName]) || "0";
                    inputs[inName] = val;
                }
            });
        }

        if (def.mozzi.includes) def.mozzi.includes.forEach(inc => codeParts.includes.add(inc));

        function processCode(code, targetVar) {
            if (!code) return null;
            var lines = code.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
            return lines.map((line, idx) => {
                if (idx === lines.length - 1) {
                    if (line.includes('=') || line.includes('return') || line.includes('.set') || 
                        line.includes('.noteOn') || line.includes('.start') || line.includes('digitalWrite') ||
                        line.startsWith('if') || line.startsWith('while') || line.endsWith('}') || line.endsWith(';')) {
                        return line + (line.endsWith(';') || line.endsWith('}') ? "" : ";");
                    }
                    return targetVar + " = " + line + ";";
                }
                if (line.endsWith('{') || line.endsWith('}') || line.endsWith(';') || line.startsWith('if')) return line;
                return line + ";";
            }).join('\n        ');
        }

        var mainOutlet = "node_" + id + "_out";

        if (node.type.includes("output/mozzi_out") || node.type.includes("output/mozzi_output")) {
            var audioInLink = findLinkToInlet(id, 'audio_in');
            if (audioInLink) {
                var prevNodeVar = "node_" + audioInLink.prev_node + "_" + audioInLink.prev_outlet;
                codeParts.audio.push("return MonoOutput::from8Bit((int)" + prevNodeVar + ");");
            } else {
                var defVal = (node.data && node.data.audio_in) || "0";
                codeParts.audio.push("return MonoOutput::from8Bit((int)" + defVal + ");");
            }
            return;
        }

        if (def.mozzi.setup) codeParts.setup.push(def.mozzi.setup(node, instanceName, inputs));
        
        var cCode = def.mozzi.control ? def.mozzi.control(node, instanceName, inputs) : null;
        var aCode = def.mozzi.audio ? def.mozzi.audio(node, instanceName, inputs) : null;

        if (finalRate === "AUDIO") {
            if (aCode) {
                var procA = processCode(aCode, mainOutlet);
                if (procA) codeParts.audio.push(procA);
            }
            if (cCode) {
                var procC = processCode(cCode, mainOutlet);
                if (procC) codeParts.audio.push("// Control logic moved to audio loop for node " + id + "\n    " + procC);
            }
        } else {
            if (cCode) {
                var procC = processCode(cCode, mainOutlet);
                if (procC) codeParts.control.push(procC);
            }
            if (aCode) {
                var procA = processCode(aCode, mainOutlet);
                if (procA) codeParts.control.push("// Forced downsample for node " + id + "\n        " + procA);
            }
        }
    });

    var finalCode = "// MOZZIFLOW v111.0 BALANCED CORE REFINED SKETCH\n";
    finalCode += Array.from(codeParts.includes).join('\n') + '\n\n';
    finalCode += "// GLOBALS\n" + codeParts.globals.join('\n') + '\n\n';
    finalCode += "void setup() {\n    startMozzi();\n    " + codeParts.setup.join('\n    ') + "\n}\n\n";
    finalCode += "void updateControl() {\n    " + codeParts.control.join('\n    ') + "\n}\n\n";
    finalCode += "AudioOutput updateAudio() {\n    " + codeParts.audio.join('\n    ');
    if (!codeParts.audio.some(l => l.includes("return"))) {
        finalCode += "\n    return MonoOutput::from8Bit(0);";
    }
    finalCode += "\n}\n\nvoid loop() {\n    audioHook();\n}\n";

    return finalCode;
}

function NodeToMozziCppInternal() {
    var project = { nodes: {}, links: {} };
    if (typeof mozziFlowContainer !== 'undefined') {
        mozziFlowContainer.forEach(function(node) {
            // FIX: Access rpdNode.data instead of node.data
            project.nodes[node.nodeid] = { 
                id: node.nodeid, 
                type: node.nodetype, 
                data: (node.rpdNode && node.rpdNode.data) ? node.rpdNode.data : (node.data || {}) 
            };
            if (node.nodeinletvalue) {
                Object.keys(node.nodeinletvalue).forEach(function(key) {
                    project.nodes[node.nodeid].data[key] = node.nodeinletvalue[key][1];
                });
            }
        });
    }
    if (typeof mozziFlowClassConnection !== 'undefined') {
        mozziFlowClassConnection.forEach(function(link, idx) {
            project.links["link_" + idx] = { prev_node: link.node_out_id, prev_outlet: link.outlet_alias, next_node: link.node_in_id, next_inlet: link.inlet_alias };
        });
    }
    return exportToMozzi(project, null);
}