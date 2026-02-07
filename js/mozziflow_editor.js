var mozziFlowContainer = [];
var mozziFlowClassContainer = [];
var mozziFlowClassConnection = [];
var mozziFlowCount = {};
var mozziFlowPos = {};
var mozziFlowRoot = "";

// --- MOZZI UI ENGINE (v5.1 Fixed Type Architecture) ---
var MozziUI = {
    refreshNode: function(node) {
        if (!node || !node.data || !node._bodyElm) return;
        var body = node._bodyElm;
        
        var rateSel = body.querySelector('.node-rate-select');
        if (rateSel) {
            var m = (node.data.rate_mode !== undefined) ? node.data.rate_mode : 0;
            rateSel.value = m;
            var nElm = body;
            while (nElm && !nElm.classList.contains('rpd-node')) nElm = nElm.parentElement;
            if (nElm) {
                nElm.classList.remove('rate-control', 'rate-audio');
                if (m == 1) nElm.classList.add('rate-control');
                else if (m == 2) nElm.classList.add('rate-audio');
            }
        }

        var inputs = body.querySelectorAll('.mozzi-inlet-val-input');
        for(var i=0; i<inputs.length; i++) {
            var inp = inputs[i];
            var alias = inp.getAttribute('data-alias');
            if (alias) {
                var val = node.data[alias];
                if (val === undefined) val = node.data["cfg_" + alias]; 
                
                if (val !== undefined && val !== null && String(val) !== "[pool]" && typeof val !== 'object') {
                    inp.value = val;
                }
            }
        }
        if (node._syncHardwareUI) node._syncHardwareUI();
        if (node.on_refresh) node.on_refresh();
    }
};

window.mozziFlowHotswap = function(node, newData) {
    var id = node.id;
    var type = node.type;
    var patch = mozziFlowRoot;
    var pos = mozziFlowPos[id] || {x: 100, y: 100};
    
    var linksToRestore = [];
    mozziFlowClassConnection.forEach(function(link) {
        if (link.node_in_id === id) {
            linksToRestore.push({ type: 'in', other_node: link.node_out_id, other_outlet: link.outlet_alias, my_inlet: link.inlet_alias });
        } else if (link.node_out_id === id) {
            linksToRestore.push({ type: 'out', other_node: link.node_in_id, other_inlet: link.inlet_alias, my_outlet: link.outlet_alias });
        }
    });

    window.mozziFlowHotswapData = newData;
    patch.removeNode(node);
    var newNode = patch.addNode(type);
    newNode.move(pos.x, pos.y);
    
    // FAST RESTORE (50ms): Wait just enough for dynamic IO to be registered
    setTimeout(function() {
        var restorePass = function(retry) {
            var allDone = true;
            linksToRestore.forEach(function(l) {
                if (l.done) return;
                var other = _.find(mozziFlowContainer, function(n) { return n.nodeid === l.other_node; });
                if (!other || !other.rpdNode) return;
                
                try {
                    var out = (l.type === 'in') ? other.rpdNode.outlets[l.other_outlet] : newNode.outlets[l.my_outlet];
                    var ins = (l.type === 'in') ? newNode.inlets[l.my_inlet] : other.rpdNode.inlets[l.other_inlet];
                    
                    if (out && ins) {
                        out.connect(ins);
                        l.done = true;
                    } else {
                        allDone = false;
                    }
                } catch(e) { }
            });
            
            if (!allDone && retry > 0) {
                setTimeout(function() { restorePass(retry - 1); }, 50);
            } else {
                MozziUI.refreshNode(newNode);
                window.mozziFlowHotswapData = null;
            }
        };
        restorePass(10); // 10 retries every 50ms = 500ms total window
    }, 50);
    
    return newNode;
};

// Register All Nodes
NodeLibrary.forEach(function(element){
    var def = element.rpdnode;
    def.category = element.category || "other"; // Preserve category for the palette
    Rpd.nodetype(element.nodetype, def);
    var toolkit = 'mozziflow'; 
    
    Rpd.noderenderer(element.nodetype, 'html', {
        first: function(bodyElm) {
            var node = this;
            node._bodyElm = bodyElm;
            if (!node.data) node.data = {};

            var applyCategory = function(retry) {
                var nElm = bodyElm;
                while (nElm && !nElm.classList.contains('rpd-node')) nElm = nElm.parentElement;
                if (nElm) {
                    var cat = element.category || "other";
                    nElm.classList.add('rpd-category-' + cat);
                } else if (retry > 0) {
                    setTimeout(function() { applyCategory(retry - 1); }, 20);
                }
            };
            applyCategory(20); 


            if (element.renderer && element.renderer.html) element.renderer.html(bodyElm, node);

            var inletDefs = element.rpdnode.inlets || {};
            var visibleInletAliases = [];
            for (var key in inletDefs) { if (!inletDefs[key].hidden) visibleInletAliases.push(key); }

            if (visibleInletAliases.length > 0 || element.nodetype === 'ch32x035/usb_plotter' || element.nodetype === 'input/mux4051' || element.nodetype === 'output/shift595') {
                var valContainer = document.createElement('div');
                valContainer.className = 'mozzi-inlet-values';
                bodyElm.appendChild(valContainer);

                var setupSync = function() {
                    if (!node.inlets) return;
                    var inputs = bodyElm.querySelectorAll('.mozzi-inlet-val-input, .mozzi-inlet-val-static');
                    for (var j = 0; j < inputs.length; j++) {
                        (function(disp){
                            var a = disp.getAttribute('data-alias');
                            var inl = node.inlets[a];
                            if (inl && inl.event && typeof inl.event.onValue === 'function') {
                                inl.event.onValue(function(val) {
                                    if (val === null || typeof val === 'object' || String(val) === "[pool]") return;
                                    if (disp.tagName === 'INPUT') {
                                        if (document.activeElement !== disp) disp.value = val;
                                        disp.style.color = inl.link ? "#0f9" : "#eee";
                                    } else { disp.innerText = val; disp.style.color = inl.link ? "#0f9" : "#555"; }
                                });
                            }
                        })(inputs[j]);
                    }
                };

                node._renderInletRows = function() {
                    valContainer.innerHTML = '';
                    var currentInlets = node.inlets || {};
                    for (var alias in currentInlets) {
                        if (alias === 'val' && element.nodetype === 'input/constant') continue;
                        if (currentInlets[alias].def.hidden) continue;

                        var row = document.createElement('div');
                        row.className = 'mozzi-inlet-row';
                        var label = document.createElement('span');
                        label.innerText = (currentInlets[alias].def.label || alias) + ':';
                        row.appendChild(label);

                        if (!currentInlets[alias].def.no_text) {
                            var valInp = document.createElement('input');
                            valInp.className = 'mozzi-inlet-val-input';
                            valInp.setAttribute('data-alias', alias);
                            var initVal = (node.data[alias] !== undefined) ? node.data[alias] : ((element.mozzi.defaults && element.mozzi.defaults[alias]) || "0");
                            valInp.value = initVal;
                            valInp.onmousedown = function(e) { e.stopPropagation(); };
                            valInp.oninput = (function(a){ return function() { 
                                node.data[a] = this.value;
                                if (node.inlets[a]) node.inlets[a].receive(this.value); 
                            }; })(alias);
                            row.appendChild(valInp);
                        } else {
                            var valSp = document.createElement('span'); 
                            valSp.className = 'mozzi-inlet-val-static';
                            valSp.setAttribute('data-alias', alias);
                            valSp.innerText = "--";
                            row.appendChild(valSp);
                        }
                        valContainer.appendChild(row);
                    }
                    setupSync();
                };
                
            node._renderInletRows();
            }

            var rateSelect = document.createElement('select');
            rateSelect.className = 'node-rate-select';
            rateSelect.style.width = "100%"; rateSelect.style.fontSize = "9px";
            rateSelect.style.background = "#111"; rateSelect.style.color = "#0f9";
            
            // Determine initial rate if not set
            if (node.data.rate_mode === undefined) {
                var defRate = (element.mozzi && element.mozzi.rate) ? element.mozzi.rate : "control";
                node.data.rate_mode = (defRate === "audio") ? 2 : 1;
            }

            var r_opts = [{v:1, t:'Control Rate'}, {v:2, t:'Audio Rate'}];
            for(var r=0; r<r_opts.length; r++) {
                var ro = document.createElement('option'); ro.value = r_opts[r].v; ro.innerText = r_opts[r].t;
                if (node.data.rate_mode === r_opts[r].v) ro.selected = true;
                rateSelect.appendChild(ro);
            }
            rateSelect.onchange = function() { 
                node.data.rate_mode = parseInt(this.value); 
                MozziUI.refreshNode(node); 
            };
            bodyElm.appendChild(rateSelect);

            node._onDataUpdate = function() { MozziUI.refreshNode(node); };
            setTimeout(function() { node._onDataUpdate(); }, 200);
        }
    });
});

String.prototype.replaceAll = function(search, replacement) { return this.replace(new RegExp(search, 'g'), replacement); };
var mozziFlowReset = function() { mozziFlowContainer = []; mozziFlowClassContainer = []; mozziFlowClassConnection = []; mozziFlowCount = {}; mozziFlowPos = {}; };

var exportSpec = {
    'network/add-patch': function(update) { mozziFlowRoot = update.patch; return [ 'network/add-patch', update.patch.id, encodeURIComponent(update.patch.name) ]; },
    'patch/add-node': function(update) { espAddToContainer(update.node); return [ 'patch/add-node', update.node.patch.id, update.node.id, update.node.type, encodeURIComponent(update.node.def.title) ]; },
    'patch/remove-node': function(update) { espDeleteFromContainer(update.node); return [ 'patch/remove-node', update.patch.id, update.node.id ]; },
    'node/add-inlet': function(update) { espAddInletToContainer(update.inlet); return [ 'node/add-inlet', update.node.id, update.inlet.id, update.inlet.type, update.inlet.alias, encodeURIComponent(update.inlet.def.label) ]; },
    'node/add-outlet': function(update) { espAddOutletToContainer(update.outlet); return [ 'node/add-outlet', update.node.id, update.outlet.id, update.outlet.type, update.outlet.alias, encodeURIComponent(update.outlet.def.label) ]; },
    'node/move': function(update) { return [ 'node/move', update.node.id ].concat(update.position); },
    'outlet/connect': function(update) { 
        espAddToConnection(update); 
        return [ 'outlet/connect', update.outlet.id, update.inlet.id, update.link.id ]; 
    },
    'outlet/disconnect': function(update) { espDeleteConnection(update); return [ 'outlet/disconnect', update.outlet.id, update.link.id ]; },
    'inlet/update': function(update) { espUpdateInletValue(update); return [ 'inlet/update' ]; },
    'outlet/update': function(update) { espUpdateOutletValue(update); return [ 'outlet/update' ]; }
};

var lowCaseFirst = function(string) { 
    if (!string) return "node";
    return string.charAt(0).toLowerCase() + string.slice(1); 
};
var espUpdateNodePosition = function(update) { var nodeId = update.node.id; var pos = { x: update.position[0], y: update.position[1] }; mozziFlowPos[nodeId] = pos; var node = _.findWhere(mozziFlowContainer, {nodeid: nodeId}); if (node) node.nodeposition = pos; };
var espAddInletToContainer = function(inlet) { var node_out = _.findWhere(mozziFlowContainer, {nodeid: inlet.node.id}); if (!node_out || inlet.alias === "") return; var exists = false; for(var i=0; i<node_out.nodeinlet.length; i++) { if(node_out.nodeinlet[i].id === inlet.id) exists = true; } if(!exists) node_out.nodeinlet.push({ id: inlet.id, type: inlet.type, alias: inlet.alias, value: inlet.alias }); };
var espAddOutletToContainer = function(outlet) { var node_out = _.findWhere(mozziFlowContainer, {nodeid: outlet.node.id}); if (!node_out || outlet.alias === "") return; var exists = false; for(var i=0; i<node_out.nodeoutlet.length; i++) { if(node_out.nodeoutlet[i].id === outlet.id) exists = true; } if(!exists) node_out.nodeoutlet.push({ id: outlet.id, type: outlet.type, alias: outlet.alias, value: outlet.alias }); };
var espUpdateInletValue = function(node) { 
    var node_in = _.findWhere(mozziFlowContainer, {nodeid: node.inlet.node.id}); if (!node_in || !node.inlet.alias) return;
    if (node_in.rpdNode && node_in.rpdNode.data) node_in.rpdNode.data[node.inlet.alias] = node.value;
};
var espUpdateOutletValue = function(node) { var node_out = _.findWhere(mozziFlowContainer, {nodeid: node.outlet.node.id}); if (!node_out || !node.outlet.alias) return; var name = node.outlet.alias.toLowerCase(); if(node.value === "") delete node_out.nodeoutletvalue[name]; else node_out.nodeoutletvalue[name] = [node.outlet.id, node.value]; };
var espAddToConnection = function(node) { var node_in = _.findWhere(mozziFlowContainer, {nodeid: node.inlet.node.id}); var node_out = _.findWhere(mozziFlowContainer, {nodeid: node.outlet.node.id}); if (!node_in || !node_out) return; mozziFlowClassConnection.push({
        linkid: node.link.id, inletid: node.inlet.id, outletid: node.outlet.id, nodeid: node.link.id,
        inlet_class_alias: node_in.nodevariable, inlet_class: node_in.nodeclass, inlet_alias: node.link.inlet.alias,
        outlet_class_alias: node_out.nodevariable, outlet_class: node_out.nodeclass, outlet_alias: node.link.outlet.alias,
        node_in_id: node_in.nodeid, node_out_id: node_out.nodeid
    }); };
var espDeleteConnection = function(node) { mozziFlowClassConnection = _.filter(mozziFlowClassConnection, function(el) { return el.nodeid !== node.link.id; }); };
var espAddToContainer = function(node) { var node_prop = _.findWhere(NodeLibrary, {nodetype: node.type}); if (!node_prop) return; var node_class = node_prop.nodeclass;
    if (_.isUndefined(mozziFlowCount[node_class])) mozziFlowCount[node_class] = 1; else mozziFlowCount[node_class]++;
    var pos = mozziFlowPos[node.id] || {x:0,y:0};
    mozziFlowContainer.push({
        rpdNode: node, nodeid: node.id, nodedesc: encodeURIComponent(node.def.title), nodeclass: node_class,
        nodevariable: lowCaseFirst(node_class)  + "_" + mozziFlowCount[node_class], nodevarcount: mozziFlowCount[node_class],
        nodetype: node.type, nodeinletvalue: {}, nodeoutletvalue: {}, nodeinlet: [], nodeoutlet: [], nodeposition: pos
    });
};

var espDeleteFromContainer = function(node) { mozziFlowContainer = _.filter(mozziFlowContainer, function(el) { return el.nodeid !== node.id; }); };

var importPlainNetwork = function(code) {
    var lines = code.split(/\r?\n/); var nodeMap = {}; var ioMap = {}; var connections = []; var dataQueue = {};
    lines.forEach(function(line) { 
        var parts = line.trim().split(' '); 
        if (parts[0] === 'node/set-data') { 
            try { 
                var raw = parts.slice(2).join(' ');
                var decoded = (typeof Buffer !== 'undefined') ? Buffer.from(raw, 'base64').toString('utf8') : atob(raw);
                dataQueue[parts[1]] = JSON.parse(decoded); 
            } catch(e) {
                try { dataQueue[parts[1]] = JSON.parse(decodeURIComponent(parts[2])); } catch(e2) {}
            } 
        } 
    });
    lines.forEach(function(line) {
        var parts = line.trim().split(' '); var cmd = parts[0];
        if (cmd === 'patch/add-node') {
            var id = parts[2], type = parts[3], title = parts.slice(4).join(' ').replace(/%20/g, ' ');
            
            try {
                var node = mozziFlowRoot.addNode(type, title); 
                if (node) {
                    node.nodeid = id; 
                    nodeMap[id] = node;
                    if (dataQueue[id]) { 
                        if (!node.data) node.data = {}; 
                        for (var key in dataQueue[id]) { node.data[key] = dataQueue[id][key]; } 
                    }
                }
            } catch (e) {
                console.error("Critical: Failed to load node " + type, e);
            }
        } 
        else if (cmd === 'node/rate') {
            var node = nodeMap[parts[1]];
            if (node) {
                if (!node.data) node.data = {};
                node.data.rate_mode = parseInt(parts[2]);
            }
        }
        else if (cmd === 'node/type') {
            var node = nodeMap[parts[1]];
            if (node) {
                if (!node.data) node.data = {};
                // Since output types are now fixed, we ignore this legacy command 
                // but keep the data just in case
                node.data.legacy_out_type = parts[2];
            }
        }
        else if (cmd === 'node/update-inlet') { 
            var node = nodeMap[parts[1]]; 
            if (node) {
                var alias = parts[2];
                var value = parts[3];
                if (!node.data) node.data = {};
                node.data[alias] = value;
                var containerNode = _.findWhere(mozziFlowContainer, {nodeid: node.id});
                if (containerNode) {
                    if (!containerNode.data) containerNode.data = {};
                    containerNode.data[alias] = value;
                }
                if (node.inlets && node.inlets[alias]) node.inlets[alias].receive(value); 
            }
        }
        else if (cmd === 'outlet/connect') connections.push(parts);
    });
    setTimeout(function() {
        connections.forEach(function(p) {
            var outParts = p[1].split(':');
            var inParts = p[2].split(':');
            var outNode = nodeMap[outParts[0]];
            var inNode = nodeMap[inParts[0]];
            if (outNode && inNode && outNode.outlets && inNode.inlets) {
                var outOutlet = outNode.outlets[outParts[1]];
                var inInlet = inNode.inlets[inParts[1]];
                if (outOutlet && inInlet) outOutlet.connect(inInlet);
            }
        });
        setTimeout(function() { window.dispatchEvent(new Event('resize')); Object.keys(nodeMap).forEach(function(id) { MozziUI.refreshNode(nodeMap[id]); }); }, 300);
    }, 150);
};

var NodeImportCpp = function (code) {
    var code_import = code.trim();
    if (code_import.indexOf('v2.') !== 0) {
        var start_tag = "--BEGINMOZZIFLOWPATCH--", stop_tag = "--ENDMOZZIFLOWPATCH--";
        var start_index = code_import.indexOf(start_tag);
        if (start_index !== -1) { start_index += start_tag.length; var last_index = code_import.indexOf(stop_tag); code_import = atob(code_import.substr(start_index, last_index - start_index).replace(/\s/g, '')); } 
    }
    if (code_import.indexOf('v2.') === 0) {
        if (mozziFlowRoot) { try { mozziFlowRoot.close(); } catch(e) {} } 
        var container = document.getElementById('rpd-canvas-container'); container.innerHTML = ''; 
        mozziFlowReset(); Rpd.renderNext('html', container, { style: 'quartz', fullPage: false });
        mozziFlowRoot = Rpd.addPatch('root');
        if (typeof initAnchoredPalette === 'function') { document.getElementById('node-palette').innerHTML = '<div class="palette-header">Mozzi Nodes</div>'; initAnchoredPalette(mozziFlowRoot); }
        importPlainNetwork(code_import);
    }
};

var NodeToPlainNetwork = function() {
    var output = "v2.1.1\nnetwork/add-patch root root\npatch/open root\n";
    mozziFlowContainer.forEach(function(node) {
        output += "patch/add-node root " + node.nodeid + " " + node.nodetype + " " + node.nodedesc + "\n";
        var pos = mozziFlowPos[node.nodeid] || node.nodeposition || {x:0, y:0};
        output += "node/move " + node.nodeid + " " + Math.floor(pos.x) + " " + Math.floor(pos.y) + "\n";
        if (node.rpdNode && node.rpdNode.data) {
            if (node.rpdNode.data.rate_mode !== undefined) output += "node/rate " + node.nodeid + " " + node.rpdNode.data.rate_mode + "\n";
            if (node.rpdNode.data.out_type !== undefined) output += "node/type " + node.nodeid + " " + node.rpdNode.data.out_type + "\n";
            Object.keys(node.rpdNode.data).forEach(function(key) {
                var val = node.rpdNode.data[key];
                if (key === 'out_type' || key === 'rate_mode' || key === 'channels' || key === 'mode' || key === 'bits') return;
                if (val !== undefined && val !== null && String(val) !== "[pool]" && typeof val !== 'object') {
                    output += "node/update-inlet " + node.nodeid + " " + key + " " + val + "\n";
                }
            });
            output += "node/set-data " + node.nodeid + " " + btoa(JSON.stringify(node.rpdNode.data)) + "\n";
        }
    });
    mozziFlowClassConnection.forEach(function(link) { output += "outlet/connect " + link.node_out_id + ":" + link.outlet_alias + " " + link.node_in_id + ":" + link.inlet_alias + "\n"; });
    return output;
};

var NodeToMozziCpp = function() { return (typeof NodeToMozziCppInternal === 'function') ? NodeToMozziCppInternal() : "// Exporter error"; };
var NodeToCPPDownload = function() {
    var code = NodeToMozziCpp(); var blob = new Blob([code], {type: "text/plain;charset=utf-8"});
    var downloadLink = document.createElement("a"); downloadLink.download = "MozziSketch_" + (new Date().getTime()) + ".ino";
    downloadLink.href = window.URL.createObjectURL(blob); downloadLink.click();
};

Rpd.events.filter(function(update) { return exportSpec[update.type]; }).onValue(function(update) { exportSpec[update.type](update); if (update.type === 'node/move') espUpdateNodePosition(update); });

var editPatchSource = function() {
    if (typeof modalOpen !== "undefined" && modalOpen === 1) return;
    modalOpen = 1; var currentCode = NodeToPlainNetwork();
    vex.dialog.open({
        message: "Patch Source Code Editor", showCloseButton: true,
        buttons: [Object.assign({}, vex.dialog.buttons.YES, { text: "Load / Update" }), Object.assign({}, vex.dialog.buttons.NO, { text: "Cancel" })],
        input: ["<div class=\"vex-custom-input-wrapper\"><textarea id=\"patch-source-editor\" rows=\"20\" cols=\"80\" style=\"font-size: 0.7em; font-family: monospace; background: #111; color: #0f9; width: 100%;\">" + currentCode + "</textarea></div>"].join(""),
        beforeClose: function() { modalOpen = 0; },
        onSubmit: function(event) { event.preventDefault(); NodeImportCpp(document.getElementById("patch-source-editor").value.trim()); this.close(); }
    });
};
