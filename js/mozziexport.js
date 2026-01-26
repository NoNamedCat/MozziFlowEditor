// Mozzi Native Exporter for MozziFlowEditor - STABLE INTELLIGENT VERSION
// Manages global/local scope by pre-declaring all active outlets in their respective functions.

function NodeToMozziCppInternal() {
    var nodes = mozziFlowContainer;
    var links = mozziFlowClassConnection;
    var variableMap = {};
    var adjacency = {};
    
    nodes.forEach(function(node) {
        variableMap[node.nodeid] = makeVarName(node.nodetype, node.nodeid);
        adjacency[node.nodeid] = [];
    });

    links.forEach(function(link) {
        if (adjacency[link.node_in_id]) adjacency[link.node_in_id].push(link.node_out_id);
    });

    var liveNodes = {};
    function markLive(nodeId) {
        if (liveNodes[nodeId]) return;
        liveNodes[nodeId] = true;
        links.forEach(function(link) { if (link.node_in_id === nodeId) markLive(link.node_out_id); });
    }
    nodes.forEach(function(node) { if (node.nodetype.indexOf('output/') !== -1) markLive(node.nodeid); });

    var visited = {}; var recStack = {}; var sortedNodes = []; var hasCycle = false; var feedbackNodes = {}; 
    function visit(nodeId) {
        if (recStack[nodeId]) { hasCycle = true; feedbackNodes[nodeId] = true; return; }
        if (visited[nodeId]) return;
        visited[nodeId] = true; recStack[nodeId] = true;
        var deps = adjacency[nodeId];
        if (deps) deps.forEach(function(depId) { if (liveNodes[depId]) visit(depId); });
        recStack[nodeId] = false;
        var nodeObj = nodes.find(n => n.nodeid === nodeId);
        if (nodeObj && liveNodes[nodeId]) sortedNodes.push(nodeObj);
    }
    nodes.forEach(function(node) { if (liveNodes[node.nodeid] && !visited[node.nodeid]) visit(node.nodeid); });

    function makeVarName(type, id) {
        var parts = type.split('/');
        return parts[parts.length - 1].replace(/[^a-zA-Z0-9]/g, "").toLowerCase() + "_" + id.replace(/[^a-zA-Z0-9]/g, "");
    }

    // --- PHASE 1: RATE INFERENCE ---
    var nodeRates = {};
    var mustBeAudio = {};
    sortedNodes.forEach(function(node) {
        var def = NodeLibrary.find(d => d.nodetype === node.nodetype);
        if (node.nodetype === 'output/mozzi_out' || (def && def.mozzi && def.mozzi.rate === 'audio')) mustBeAudio[node.nodeid] = true;
    });

    var changed = true;
    while (changed) {
        changed = false;
        sortedNodes.forEach(function(node) {
            links.forEach(function(link) {
                if (link.node_out_id === node.nodeid) {
                    if (mustBeAudio[link.node_in_id] && !mustBeAudio[node.nodeid]) {
                        var consumerNode = nodes.find(n => n.nodeid === link.node_in_id);
                        var consumerDef = NodeLibrary.find(d => d.nodetype === (consumerNode?consumerNode.nodetype:""));
                        var inletDef = (consumerDef && consumerDef.rpdnode && consumerDef.rpdnode.inlets) ? consumerDef.rpdnode.inlets[link.inlet_alias] : null;
                        if (!inletDef || !inletDef.is_control) { mustBeAudio[node.nodeid] = true; changed = true; }
                    }
                }
            });
        });
    }

    sortedNodes.forEach(function(node) {
        var def = NodeLibrary.find(d => d.nodetype === node.nodetype);
        if (def && def.mozzi && def.mozzi.rate) nodeRates[node.nodeid] = def.mozzi.rate;
        else nodeRates[node.nodeid] = mustBeAudio[node.nodeid] ? 'audio' : 'control';
    });

    // --- PHASE 2: GLOBAL PROMOTION ---
    var globalOutlets = {}; 
    links.forEach(function(link) {
        var sourceRate = nodeRates[link.node_out_id];
        var destNode = nodes.find(n => n.nodeid === link.node_in_id);
        var destRate = nodeRates[link.node_in_id];
        var suffix = (link.outlet_alias || "out").toLowerCase();
        // Promotion if crossing rate boundary or feedback
        if (sourceRate !== destRate || feedbackNodes[link.node_out_id]) {
            globalOutlets[link.node_out_id + "_" + suffix] = true;
        }
    });

    var code_includes = "#include <Mozzi.h>\n"; var code_tables = ""; var code_globals = "";
    var code_setup = "void setup() {\n";
    var code_control_body = ""; var code_audio_body = "";
    var controlLocals = {}; var audioLocals = {};

    // --- PHASE 3: GENERATION & DECLARATION TRACKING ---
    sortedNodes.forEach(function(node) {
        var def = NodeLibrary.find(d => d.nodetype === node.nodetype);
        if (!def || !def.mozzi || def.is_constant) return;
        var myVar = variableMap[node.nodeid];
        var targetRate = nodeRates[node.nodeid];
        var rateMacro = (targetRate === 'audio') ? "AUDIO_RATE" : "CONTROL_RATE";

        var inputs = {};
        if (def.mozzi.defaults) { for (var k in def.mozzi.defaults) inputs[k] = def.mozzi.defaults[k]; }
        links.forEach(function(link) {
            if (link.node_in_id === node.nodeid) {
                var senderNode = nodes.find(n => n.nodeid === link.node_out_id);
                var senderDef = NodeLibrary.find(d => d.nodetype === (senderNode?senderNode.nodetype:""));
                if (senderDef && senderDef.is_constant) {
                    inputs[link.inlet_alias] = (senderNode.rpdNode && senderNode.rpdNode.data && senderNode.rpdNode.data.value !== undefined) ? senderNode.rpdNode.data.value : "0";
                } else {
                    inputs[link.inlet_alias] = variableMap[link.node_out_id] + "_" + (link.outlet_alias || "out").toLowerCase();
                }
            }
        });
        if (node.nodeinletvalue) {
            for (var k in node.nodeinletvalue) {
                 var v = node.nodeinletvalue[k];
                 if (v && v[1] !== undefined && v[1] !== "" && !links.find(l => l.node_in_id === node.nodeid && l.inlet_alias === k)) inputs[k] = v[1];
            }
        }

        if (def.mozzi.includes) def.mozzi.includes.forEach(inc => { if (code_includes.indexOf(inc) === -1) code_includes += inc + "\n"; });
        if (def.mozzi.global) { var g = def.mozzi.global(node, myVar, rateMacro); if (g) code_globals += g + "\n"; }
        if (def.mozzi.setup) { var s = def.mozzi.setup(node, myVar, inputs, rateMacro); if (s) code_setup += "\t" + s + "\n"; }

        // Track declarations needed for outlets
        if (def.rpdnode && def.rpdnode.outlets) {
            Object.keys(def.rpdnode.outlets).forEach(ok => {
                var suffix = ok.toLowerCase() === "out" ? "_out" : "_" + ok.toLowerCase();
                var fullVar = myVar + suffix;
                if (globalOutlets[node.nodeid + suffix]) {
                    if (code_globals.indexOf("volatile int " + fullVar) === -1) code_globals += "volatile int " + fullVar + " = 0;\n";
                } else {
                    if (targetRate === 'audio' || def.mozzi.rate === 'audio') audioLocals[fullVar] = true;
                    else controlLocals[fullVar] = true;
                }
            });
        }

        if (def.mozzi.control) code_control_body += "\t" + def.mozzi.control(node, myVar, inputs, rateMacro) + "\n";
        if (def.mozzi.audio) {
            if (targetRate === 'audio' || def.mozzi.rate === 'audio') code_audio_body += "\t" + def.mozzi.audio(node, myVar, inputs, rateMacro) + "\n";
            else code_control_body += "\t" + def.mozzi.audio(node, myVar, inputs, rateMacro) + "\n";
        }
    });

    // --- PHASE 4: FINAL ASSEMBLY ---
    var final_control = "void updateControl() {\n";
    for (var v in controlLocals) final_control += "\tint " + v + " = 0;\n";
    final_control += code_control_body + "}\n";

    var final_audio = "AudioOutput updateAudio() {\n";
    for (var v in audioLocals) final_audio += "\tint " + v + " = 0;\n";
    final_audio += code_audio_body + (code_audio_body.indexOf("return ") === -1 ? "\treturn 0;\n" : "") + "}\n";

    code_setup += "\tstartMozzi(CONTROL_RATE);\n}\n";

nodes.forEach(function(node) {
        if (node.rpdNode && node.rpdNode.data) {
            var data = node.rpdNode.data;
            if (data.sampleInfo && data.sampleInfo.cpp) code_tables += "\n" + data.sampleInfo.cpp + "\n";
            if (data.huffmanInfo && data.huffmanInfo.cpp) code_tables += "\n" + data.huffmanInfo.cpp + "\n";
        }
    });

    return (hasCycle ? "// WARNING: Feedback Loop Detected\n" : "") + "\n" + code_includes + "\n" + code_tables + "\n" + code_globals + "\n" + code_setup + "\n" + final_control + "\n" + final_audio + "\nvoid loop() {\n\taudioHook();\n}\n";
}
