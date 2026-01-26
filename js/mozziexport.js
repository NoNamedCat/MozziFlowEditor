// Mozzi Native Exporter for MozziFlowEditor
// Generates procedural C++ code specific to Mozzi

function NodeToMozziCppInternal() {
    var nodes = mozziFlowContainer;
    var links = mozziFlowClassConnection;
    var variableMap = {};
    var adjacency = {};
    
    // 1. Setup Data Structures
    nodes.forEach(function(node) {
        variableMap[node.nodeid] = makeVarName(node.nodetype, node.nodeid);
        adjacency[node.nodeid] = [];
    });

    links.forEach(function(link) {
        if (adjacency[link.node_in_id]) {
            adjacency[link.node_in_id].push(link.node_out_id);
        }
    });

    // 2. FIND "LIVE" NODES
    var liveNodes = {};
    function markLive(nodeId) {
        if (liveNodes[nodeId]) return;
        liveNodes[nodeId] = true;
        links.forEach(function(link) {
            if (link.node_in_id === nodeId) markLive(link.node_out_id);
        });
    }

    nodes.forEach(function(node) {
        if (node.nodetype.indexOf('output/') !== -1) markLive(node.nodeid);
    });

    // 3. CYCLE DETECTION & TOPOLOGICAL SORT
    var visited = {};
    var recStack = {};
    var sortedNodes = [];
    var hasCycle = false;
    var feedbackNodes = {}; // Nodes involved in feedback loops

    function visit(nodeId) {
        if (recStack[nodeId]) { 
            hasCycle = true; 
            feedbackNodes[nodeId] = true; // This node is being read before it's fully calculated
            return; 
        }
        if (visited[nodeId]) return;
        visited[nodeId] = true;
        recStack[nodeId] = true;
        var deps = adjacency[nodeId];
        if (deps) {
            deps.forEach(function(depId) { if (liveNodes[depId]) visit(depId); });
        }
        recStack[nodeId] = false;
        var nodeObj = nodes.find(n => n.nodeid === nodeId);
        if (nodeObj && liveNodes[nodeId]) sortedNodes.push(nodeObj);
    }

    nodes.forEach(function(node) {
        if (liveNodes[node.nodeid] && !visited[node.nodeid]) visit(node.nodeid);
    });

    function makeVarName(type, id) {
        var parts = type.split('/');
        var cleanType = parts[parts.length - 1].replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
        return cleanType + "_" + id.replace(/[^a-zA-Z0-9]/g, "");
    }

    // 3.5. RATE INFERENCE (Bidirectional Analysis: Capacity vs Necessity)
    var nodeRates = {};
    var canBeAudio = {};
    var mustBeAudio = {};
    
    // 1. FORWARD PASS: Identify nodes that CAN produce audio (Capacity)
    sortedNodes.forEach(function(node) {
        var def = NodeLibrary.find(d => d.nodetype === node.nodetype);
        if (!def) return;
        
        // Explicitly audio nodes OR nodes with an audio processing function (Oscillators, even if elastic)
        if (def.mozzi && (def.mozzi.rate === 'audio' || typeof def.mozzi.audio === 'function')) {
            canBeAudio[node.nodeid] = true;
        } else {
            // Elastic nodes (like Math) can be audio if they receive audio on a non-control inlet
            var receivesAudio = false;
            links.forEach(function(link) {
                if (link.node_in_id === node.nodeid) {
                    if (canBeAudio[link.node_out_id]) {
                        var inletDef = def.rpdnode.inlets ? def.rpdnode.inlets[link.inlet_alias] : null;
                        if (!inletDef || !inletDef.is_control) receivesAudio = true;
                    }
                }
            });
            if (receivesAudio) canBeAudio[node.nodeid] = true;
        }
    });

    // 2. BACKWARD PASS: Identify nodes that NEED to produce audio (Necessity)
    // Initialize primary sinks (Outputs and fixed audio nodes with no outlets)
    sortedNodes.forEach(function(node) {
        var def = NodeLibrary.find(d => d.nodetype === node.nodetype);
        if (node.nodetype === 'output/mozzi_out' || (def && def.mozzi && def.mozzi.rate === 'audio')) {
            mustBeAudio[node.nodeid] = true;
        }
    });

    var changed = true;
    while (changed) {
        changed = false;
        sortedNodes.forEach(function(node) {
            // Check if any consumer needs this node's output as audio
            links.forEach(function(link) {
                if (link.node_out_id === node.nodeid) {
                    if (mustBeAudio[link.node_in_id] && !mustBeAudio[node.nodeid]) {
                        // The consumer is audio, but does it need THIS link as audio?
                        var consumerNode = nodes.find(n => n.nodeid === link.node_in_id);
                        var consumerDef = NodeLibrary.find(d => d.nodetype === consumerNode.nodetype);
                        var inletDef = (consumerDef && consumerDef.rpdnode && consumerDef.rpdnode.inlets) 
                                       ? consumerDef.rpdnode.inlets[link.inlet_alias] : null;
                        
                        // If it's a signal inlet (not is_control), then this node MUST be audio
                        if (!inletDef || !inletDef.is_control) {
                            mustBeAudio[node.nodeid] = true;
                            changed = true;
                        }
                    }
                }
            });
        });
    }

    // 3. FINAL RESOLUTION
    sortedNodes.forEach(function(node) {
        var def = NodeLibrary.find(d => d.nodetype === node.nodetype);
        // Rule: Fixed rate nodes stay fixed. Elastic nodes are audio ONLY if they can AND must.
        if (def && def.mozzi && def.mozzi.rate) {
            nodeRates[node.nodeid] = def.mozzi.rate;
        } else {
            nodeRates[node.nodeid] = (canBeAudio[node.nodeid] && mustBeAudio[node.nodeid]) ? 'audio' : 'control';
        }
    });

    // 3.6. SCOPE ANALYSIS (Optimizes RAM usage)
    var globalsNeeded = {};
    // 1. Mark feedback nodes
    for (var id in feedbackNodes) globalsNeeded[id] = true;
    
    // 2. Mark Cross-Rate variables (Audio<->Control)
    links.forEach(function(link) {
        var sourceRate = nodeRates[link.node_out_id];
        
        var destNode = nodes.find(n => n.nodeid === link.node_in_id);
        var destDef = NodeLibrary.find(d => d.nodetype === (destNode ? destNode.nodetype : ""));
        var inletDef = destDef && destDef.rpdnode.inlets ? destDef.rpdnode.inlets[link.inlet_alias] : null;
        var isDestInletControl = inletDef && inletDef.is_control;
        
        var producedIn = sourceRate;
        var consumedIn = (nodeRates[link.node_in_id] === 'control' || isDestInletControl) ? 'control' : 'audio';
        
        if (producedIn !== consumedIn) {
            globalsNeeded[link.node_out_id] = true;
        }
    });

    // 4. GENERATE CODE
    var code_includes = "#include <Mozzi.h>\n";
    var code_audio_tables = ""; // For storing raw sample data
    var code_globals = "";
    var code_setup = "void setup() {\n";
    var code_control = "void updateControl() {\n";
    var code_audio = "AudioOutput updateAudio() {\n";
    var warnings = "";

    if (hasCycle) warnings += "// WARNING: Feedback Loop Detected - using implicit unit delay (global var)\n";

    // COLLECT AUDIO TABLES FROM NODES
    nodes.forEach(function(node) {
        if (node.rpdNode && node.rpdNode.data) {
            var data = node.rpdNode.data;
            if (data.sampleInfo && data.sampleInfo.cpp) {
                code_audio_tables += "\n// Audio Data: " + data.sampleInfo.name + "\n" + data.sampleInfo.cpp + "\n";
            }
            if (data.huffmanInfo && data.huffmanInfo.cpp) {
                code_audio_tables += "\n// Huffman Data: " + data.huffmanInfo.name + "\n" + data.huffmanInfo.cpp + "\n";
            }
        }
    });

    // PRE-DECLARE ALL OUTPUT VARIABLES GLOBALLY
    // Using 'volatile' for thread-safety between updateControl and updateAudio (interrupt)
    sortedNodes.forEach(function(node) {
        var myVar = variableMap[node.nodeid];
        var def = NodeLibrary.find(d => d.nodetype === node.nodetype);
        
        if (def && def.rpdnode && def.rpdnode.outlets) {
            Object.keys(def.rpdnode.outlets).forEach(function(outletKey) {
                var suffix = (outletKey.toLowerCase() === "out") ? "_out" : "_" + outletKey.toLowerCase();
                code_globals += "volatile int " + myVar + suffix + " = 0;\n";
            });
        }
    });

    for (var i = 0; i < sortedNodes.length; i++) {
        var node = sortedNodes[i];
        if (node.rpdNode && node.rpdNode.data) node.data = node.rpdNode.data;
        var def = NodeLibrary.find(d => d.nodetype === node.nodetype);
        if (!def || !def.mozzi || def.is_constant) continue;

        var myVar = variableMap[node.nodeid];
        var inputs = {};
        if (def.mozzi.defaults) {
             for (var key in def.mozzi.defaults) { inputs[key] = def.mozzi.defaults[key]; }
        }

        links.forEach(function(link) {
            if (link.node_in_id === node.nodeid) {
                var inletName = link.inlet_alias;
                var senderNode = nodes.find(n => n.nodeid === link.node_out_id);
                var senderDef = NodeLibrary.find(d => d.nodetype === senderNode.nodetype);
                if (senderDef && senderDef.is_constant) {
                    var constVal = "0";
                    if (senderNode.rpdNode && senderNode.rpdNode.data && senderNode.rpdNode.data.value !== undefined) {
                        constVal = senderNode.rpdNode.data.value;
                    } else if (senderNode.data && senderNode.data.value !== undefined) {
                        constVal = senderNode.data.value;
                    }
                    inputs[inletName] = constVal;
                } else {
                    var suffix = (link.outlet_alias && link.outlet_alias.toLowerCase() !== "out") ? "_" + link.outlet_alias.toLowerCase() : "_out";
                    inputs[inletName] = variableMap[link.node_out_id] + suffix;
                }
            }
        });
        
        if (node.nodeinletvalue) {
            for (var key in node.nodeinletvalue) {
                 var valEntry = node.nodeinletvalue[key];
                 if (valEntry && valEntry[1] !== undefined && valEntry[1] !== "") {
                     if (!links.find(l => l.node_in_id === node.nodeid && l.inlet_alias === key)) inputs[key] = valEntry[1];
                 }
            }
        }

        if (def.mozzi.includes) {
            def.mozzi.includes.forEach(inc => { if (code_includes.indexOf(inc) === -1) code_includes += inc + "\n"; });
        }
        
        var targetRate = nodeRates[node.nodeid];
        var rateMacro = (targetRate === 'audio') ? "AUDIO_RATE" : "CONTROL_RATE";

        if (def.mozzi.global) { var g = def.mozzi.global(node, myVar, rateMacro); if (g) code_globals += g + "\n"; }
        if (def.mozzi.setup) { var s = def.mozzi.setup(node, myVar, inputs, rateMacro); if (s) code_setup += "\t" + s + "\n"; }
        
        if (def.mozzi.control) { 
            var c = def.mozzi.control(node, myVar, inputs, rateMacro); 
            if (c) {
                code_control += "\t" + c + "\n"; 
            }
        }
        
        if (def.mozzi.audio) { 
            var a = def.mozzi.audio(node, myVar, inputs, rateMacro); 
            if (targetRate === 'control') {
                // OPTIMIZATION: Run math/logic in Control Rate if all inputs are Control Rate
                if (a) code_control += "\t" + a + "\n";
            } else {
                // Standard Audio Rate Execution
                if (a) code_audio += "\t" + a + "\n"; 
            }
        }
    }
    
    code_setup += "\tstartMozzi(CONTROL_RATE);\n}\n";
    code_control += "}\n";
    if (code_audio.indexOf("return ") === -1) code_audio += "\treturn 0;\n";
    code_audio += "}\n\nvoid loop() {\n\taudioHook();\n}\n";
    
    return warnings + "\n" + code_includes + "\n" + code_audio_tables + "\n" + code_globals + "\n" + code_setup + "\n" + code_control + "\n" + code_audio;
}
