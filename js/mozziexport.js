// Mozzi Native Exporter for MozziFlowEditor - PRECISION VERSION 17.0
// Total Variable Integrity: Combined Recursive Inlining and Universal Scope Visibility.

function NodeToMozziCppInternal() {
    var nodes = mozziFlowContainer;
    var links = mozziFlowClassConnection;
    var variableMap = {};
    
    function makeVarName(type, id) {
        var cleanType = type.trim();
        var def = NodeLibrary.find(d => d.nodetype === cleanType);
        var prefix = (def && def.nodeclass) ? def.nodeclass.toLowerCase() : cleanType.split('/').pop().replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
        return prefix + "_" + id.replace(/[^a-zA-Z0-9]/g, "");
    }

    nodes.forEach(function(node) {
        variableMap[node.nodeid] = makeVarName(node.nodetype, node.nodeid);
    });

    // 1. Topological Sort
    var adjacency = {};
    nodes.forEach(n => adjacency[n.nodeid] = []);
    links.forEach(l => { if (adjacency[l.node_in_id]) adjacency[l.node_in_id].push(l.node_out_id); });

    var visited = {}; var recStack = {}; var sortedNodes = []; var hasCycle = false; var feedbackNodes = {};
    function visit(nodeId) {
        if (recStack[nodeId]) { hasCycle = true; feedbackNodes[nodeId] = true; return; }
        if (visited[nodeId]) return;
        visited[nodeId] = true; recStack[nodeId] = true;
        var deps = adjacency[nodeId];
        if (deps) deps.forEach(function(depId) { visit(depId); });
        recStack[nodeId] = false;
        var nodeObj = nodes.find(n => n.nodeid === nodeId);
        if (nodeObj) sortedNodes.push(nodeObj);
    }
    nodes.forEach(function(node) { if (!visited[node.nodeid]) visit(node.nodeid); });
    nodes.forEach(function(node) { if (!sortedNodes.find(n => n.nodeid === node.nodeid)) sortedNodes.push(node); });

    // 2. Rate Inference
    var nodeRates = {};
    var mustBeAudio = {};
    nodes.forEach(function(node) {
        var def = NodeLibrary.find(d => d.nodetype === node.nodetype);
        if (node.nodetype === 'output/mozzi_out' || (def && def.mozzi && def.mozzi.rate === 'audio')) mustBeAudio[node.nodeid] = true;
    });
    var changed = true;
    while (changed) {
        changed = false;
        nodes.forEach(function(node) {
            links.forEach(function(link) {
                if (link.node_out_id === node.nodeid && mustBeAudio[link.node_in_id] && !mustBeAudio[node.nodeid]) {
                    var consumerDef = NodeLibrary.find(d => d.nodetype === (nodes.find(n => n.nodeid === link.node_in_id)?.nodetype || ""));
                    var inletDef = consumerDef?.rpdnode?.inlets?.[link.inlet_alias];
                    if (!inletDef || !inletDef.is_control) { mustBeAudio[node.nodeid] = true; changed = true; }
                }
            });
        });
    }
    nodes.forEach(function(node) {
        var def = NodeLibrary.find(d => d.nodetype === node.nodetype);
        nodeRates[node.nodeid] = (def && def.mozzi && def.mozzi.rate) ? def.mozzi.rate : (mustBeAudio[node.nodeid] ? 'audio' : 'control');
    });

    // 3. RECURSIVE EXPRESSION RESOLVER
    function resolveInput(nodeId, inletAlias) {
        var link = links.find(l => l.node_in_id === nodeId && l.inlet_alias === inletAlias);
        var node = nodes.find(n => n.nodeid === nodeId);
        var nodeDef = NodeLibrary.find(d => d.nodetype === node.nodetype);

        if (!link) {
            if (node.nodeinletvalue && node.nodeinletvalue[inletAlias]) return node.nodeinletvalue[inletAlias][1];
            if (nodeDef && nodeDef.mozzi && nodeDef.mozzi.defaults) return nodeDef.mozzi.defaults[inletAlias] || "0";
            return "0";
        }

        var srcId = link.node_out_id;
        var srcNode = nodes.find(n => n.nodeid === srcId);
        var srcDef = NodeLibrary.find(d => d.nodetype === srcNode.nodetype);
        var myVar = variableMap[srcId];

        if (srcDef && srcDef.is_constant) {
            return (srcNode.rpdNode && srcNode.rpdNode.data && srcNode.rpdNode.data.value !== undefined) ? srcNode.rpdNode.data.value : "0";
        }

        if (srcDef && srcDef.mozzi && srcDef.mozzi.is_inline) {
            var nestedInputs = {};
            var nestedIsStatic = {};
            var inlets = (srcDef.rpdnode && srcDef.rpdnode.inlets) ? Object.keys(srcDef.rpdnode.inlets) : [];
            inlets.forEach(ia => {
                nestedInputs[ia] = resolveInput(srcId, ia);
                nestedIsStatic[ia] = !links.some(l => l.node_in_id === srcId && l.inlet_alias === ia);
            });
            if (srcDef.mozzi.defaults) {
                for (var k in srcDef.mozzi.defaults) {
                    if (!nestedInputs[k]) { nestedInputs[k] = srcDef.mozzi.defaults[k]; nestedIsStatic[k] = true; }
                }
            }
            var rateMacro = (nodeRates[srcId] === 'audio') ? "AUDIO_RATE" : "CONTROL_RATE";
            var expr = srcDef.mozzi.audio ? srcDef.mozzi.audio(srcNode, myVar, nestedInputs, rateMacro, nestedIsStatic) : (myVar + "_out");
            return "(" + expr.trim().replace(/;$/, "") + ")";
        }

        return myVar + "_" + (link.outlet_alias || "out").toLowerCase();
    }

    // 4. TOTAL SCOPE VISIBILITY (Safety Pass)
    var globalOutlets = {}; 
    var volatileOutlets = {};
    
    // Pass A: Outlets from Node Library
    nodes.forEach(function(node) {
        var def = NodeLibrary.find(d => d.nodetype === node.nodetype);
        if (!def || def.is_constant) return;
        var myVar = variableMap[node.nodeid];
        if (def.rpdnode && def.rpdnode.outlets) {
            Object.keys(def.rpdnode.outlets).forEach(ok => {
                var vName = myVar + "_" + ok.toLowerCase();
                globalOutlets[vName] = (def.rpdnode.outlets[ok].type.indexOf('float') !== -1) ? 'float' : 'int';
            });
        }
    });

    // Pass B: Outlets from Links (Catch all dynamic ones)
    links.forEach(function(link) {
        var srcId = link.node_out_id;
        var dstId = link.node_in_id;
        var vName = variableMap[srcId] + "_" + (link.outlet_alias || "out").toLowerCase();
        if (!globalOutlets[vName]) globalOutlets[vName] = "int";

        var srcRate = nodeRates[srcId];
        var dstRate = nodeRates[dstId];
        var destDef = NodeLibrary.find(d => d.nodetype === (nodes.find(n => n.nodeid === dstId)?.nodetype || ""));
        var inletDef = destDef?.rpdnode?.inlets?.[link.inlet_alias];
        var isDstAudio = (dstRate === 'audio' && (!inletDef || !inletDef.is_control));
        if (srcRate === 'control' && isDstAudio) volatileOutlets[vName] = true;
    });

    // 5. Assembly
    var code_includes = "#include <Mozzi.h>\n"; var code_tables = ""; var code_globals = "";
    var code_setup = "void setup() {\n"; var code_control_body = ""; var code_audio_body = "";

    function sanitize(s) { if (!s) return ""; s = s.trim(); if (s && !s.endsWith(";") && !s.endsWith("}")) s += ";"; return s; }

    nodes.forEach(function(node) {
        var def = NodeLibrary.find(d => d.nodetype === node.nodetype);
        if (!def || !def.mozzi) return;
        var myVar = variableMap[node.nodeid];
        var rateMacro = (nodeRates[node.nodeid] === 'audio') ? "AUDIO_RATE" : "CONTROL_RATE";
        if (def.mozzi.includes) def.mozzi.includes.forEach(inc => { if (code_includes.indexOf(inc) === -1) code_includes += inc + "\n"; });
        if (def.mozzi.global) { var g = def.mozzi.global(node, myVar, rateMacro); if (g) code_globals += sanitize(g) + "\n"; }
    });

    for (var vName in globalOutlets) {
        var prefix = volatileOutlets[vName] ? "volatile " : "";
        code_globals += prefix + globalOutlets[vName] + " " + vName + " = 0;\n";
    }

    sortedNodes.forEach(function(node) {
        var def = NodeLibrary.find(d => d.nodetype === node.nodetype);
        if (!def || !def.mozzi || def.is_constant) return;
        var myVar = variableMap[node.nodeid];
        var targetRate = nodeRates[node.nodeid];
        var rateMacro = (targetRate === 'audio') ? "AUDIO_RATE" : "CONTROL_RATE";

        var inputs = {}; var isStatic = {};
        var inletKeys = (def.rpdnode && def.rpdnode.inlets) ? Object.keys(def.rpdnode.inlets) : [];
        inletKeys.forEach(ia => {
            inputs[ia] = resolveInput(node.nodeid, ia);
            isStatic[ia] = !links.some(l => l.node_in_id === node.nodeid && l.inlet_alias === ia);
        });

        if (def.mozzi.setup) { var s = def.mozzi.setup(node, myVar, inputs, rateMacro, isStatic); if (s) code_setup += "\t" + sanitize(s) + "\n"; }
        if (def.mozzi.control) { var c = def.mozzi.control(node, myVar, inputs, rateMacro, isStatic); if (c) code_control_body += "\t" + sanitize(c) + "\n"; }
        
        if (def.mozzi.audio && !def.mozzi.is_inline) {
            var a = def.mozzi.audio(node, myVar, inputs, rateMacro, isStatic);
            if (a) { if (targetRate === 'audio') code_audio_body += "\t" + sanitize(a) + "\n"; else code_control_body += "\t" + sanitize(a) + "\n"; }
        }
    });

    var final_control = "void updateControl() {\n" + code_control_body + "}\n";
    var final_audio = "AudioOutput updateAudio() {\n" + code_audio_body + (code_audio_body.indexOf("return ") === -1 ? "\treturn 0;\n" : "") + "}\n";
    code_setup += "\tstartMozzi(CONTROL_RATE);\n}\n";

    nodes.forEach(function(node) {
        if (node.rpdNode && node.rpdNode.data) {
            var d = node.rpdNode.data;
            if (d.sampleInfo && d.sampleInfo.cpp) code_tables += "\n" + d.sampleInfo.cpp + "\n";
            if (d.huffmanInfo && d.huffmanInfo.cpp) code_tables += "\n" + d.huffmanInfo.cpp + "\n";
        }
    });

    return "\n" + code_includes + "\n" + code_tables + "\n" + code_globals + "\n" + code_setup + "\n" + final_control + "\n" + final_audio + "\nvoid loop() {\n\taudioHook();\n}\n";
}
