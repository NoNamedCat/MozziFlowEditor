var mozziFlowContainer = [];
var mozziFlowClassContainer = [];
var mozziFlowClassConnection = [];
var mozziFlowCount = {};
var mozziFlowPos = {};
var mozziFlowRoot = "";

// Register All Nodes
NodeLibrary.forEach(function(element){
    if (element.description) {
        element.rpdnode.description = element.description;
    }

    // NEW: Inject Mozzi defaults into RPD inlet definitions so they are used on creation
    if (element.mozzi && element.mozzi.defaults) {
        Object.keys(element.mozzi.defaults).forEach(function(alias) {
            if (element.rpdnode.inlets && element.rpdnode.inlets[alias]) {
                element.rpdnode.inlets[alias].default = element.mozzi.defaults[alias];
            }
        });
    }
    
    Rpd.nodetype(element.nodetype, element.rpdnode);
    
    var toolkit = element.nodetype.split('/')[0];
    Rpd.noderenderer(element.nodetype, 'html', {
        first: function(bodyElm) {
            var node = this;
            var valDisplays = {};
            
            // 1. Get visible inlets from the STATIC library definition
            var inletDefs = element.rpdnode.inlets || {};
            var visibleInletAliases = Object.keys(inletDefs).filter(function(alias) {
                return !inletDefs[alias].hidden;
            });

            if (visibleInletAliases.length > 0) {
                var valContainer = document.createElement('div');
                valContainer.className = 'mozzi-inlet-values';
                bodyElm.appendChild(valContainer);

                visibleInletAliases.forEach(function(alias) {
                    // Skip hidden or internal RPD inlets
                    if (alias === 'val' && element.nodetype === 'input/constant') return;

                    var inletDef = inletDefs[alias];
                    var row = document.createElement('div');
                    row.className = 'mozzi-inlet-row';
                    
                    var label = document.createElement('span');
                    label.className = 'mozzi-inlet-label';
                    label.innerText = (inletDef.label || alias) + ':';
                    row.appendChild(label);

                    if (!inletDef.no_text) {
                        var valInput = document.createElement('input');
                        valInput.className = 'mozzi-inlet-val-input';
                        valInput.type = 'text';
                        
                        var initVal = (element.mozzi && element.mozzi.defaults && element.mozzi.defaults[alias] !== undefined) 
                                      ? element.mozzi.defaults[alias] : "0";
                        valInput.value = initVal;

                        valInput.onmousedown = function(e) { e.stopPropagation(); };
                        valInput.oninput = function() {
                            if (node.inlets && node.inlets[alias]) {
                                if (!node.inlets[alias].link) {
                                    node.inlets[alias].receive(this.value);
                                }
                            }
                        };
                        row.appendChild(valInput);
                        valDisplays[alias] = valInput;

                        // Clean fix: Store input reference for direct sync
                        if (!node._inputs) node._inputs = {};
                        node._inputs[alias] = valInput;
                    } else {
                        // For no_text inlets, show a static value display only
                        var valSpan = document.createElement('span');
                        valSpan.className = 'mozzi-inlet-val-static';
                        valSpan.innerText = "--";
                        row.appendChild(valSpan);
                        valDisplays[alias] = valSpan;
                    }

                    valContainer.appendChild(row);
                });

                // 2. Setup dynamic updates once inlets are ready
                var setupSync = function() {
                    if (!node.inlets) { setTimeout(setupSync, 50); return; }
                    
                    var allReady = true;
                    visibleInletAliases.forEach(function(alias) {
                        var inlet = node.inlets[alias];
                        if (!inlet || !inlet.event || typeof inlet.event.onValue !== 'function') allReady = false;
                    });

                    if (!allReady) { setTimeout(setupSync, 50); return; }

                    visibleInletAliases.forEach(function(alias) {
                        var inlet = node.inlets[alias];
                        var display = valDisplays[alias];
                        if (!display) return;

                        // Push initial text value to RPD inlet to update labels
                        if (!inlet.link && display.tagName === 'INPUT' && display.value !== undefined) {
                            inlet.receive(display.value);
                        }

                        inlet.event.onValue(function(val) {
                            var displayVal = val;
                            if (typeof val === 'object' || val === null) displayVal = "0";
                            if (String(displayVal).indexOf('[') === 0) displayVal = "0";

                            if (display.tagName === 'INPUT') {
                                if (document.activeElement !== display) display.value = displayVal;
                                
                                if (inlet.link) {
                                    display.style.color = "#0f9";
                                    display.style.fontWeight = "bold";
                                    display.readOnly = true;
                                } else {
                                    display.style.color = "#eee";
                                    display.style.fontWeight = "normal";
                                    display.readOnly = false;
                                }
                            } else {
                                // For spans (no_text)
                                display.innerText = displayVal;
                                if (inlet.link) {
                                    display.style.color = "#0f9";
                                    display.style.fontWeight = "bold";
                                } else {
                                    display.style.color = "#555";
                                }
                            }
                        });
                    });
                };
                setupSync();
            }

            try {
                var nodeElm = bodyElm.parentElement;
                while (nodeElm && !nodeElm.classList.contains('rpd-node')) {
                    nodeElm = nodeElm.parentElement;
                }
                if (nodeElm) {
                    nodeElm.classList.add('rpd-toolkit-' + toolkit);
                    if (element.description) {
                        nodeElm.setAttribute('title', element.description);
                    }
                }
            } catch(e) {}

            if (element.renderer && element.renderer.html) {
                element.renderer.html(bodyElm, node);
            }
        }
    });
});

String.prototype.replaceAll = function(search, replacement) {
    return this.replace(new RegExp(search, 'g'), replacement);
};

var mozziFlowReset = function() {
    mozziFlowContainer = [];
    mozziFlowClassContainer = [];
    mozziFlowClassConnection = [];
    mozziFlowCount = {};
    mozziFlowPos = {};
};

var exportSpec = {
    'network/add-patch': function(update) {
        mozziFlowRoot = (update.patch);
        var patch = update.patch;
        return [ 'network/add-patch', patch.id, encodeURIComponent(patch.name) ];
    },
    'patch/add-node': function(update) {
        var node = update.node;
        espAddToContainer(node);
        return [ 'patch/add-node', node.patch.id, node.id, node.type, encodeURIComponent(node.def.title) ];
    },
    'patch/remove-node': function(update) {
        espDeleteFromContainer(update.node);
        return [ 'patch/remove-node', update.patch.id, update.node.id ];
    },
    'node/add-inlet': function(update) {
        var inlet = update.inlet;
        espAddInletToContainer(inlet);
        return [ 'node/add-inlet', update.node.id, inlet.id, inlet.type, inlet.alias, encodeURIComponent(inlet.def.label) ];
    },
    'node/add-outlet': function(update) {
        var outlet = update.outlet;
        espAddOutletToContainer(outlet);
        return [ 'node/add-outlet', update.node.id, outlet.id, outlet.type, outlet.alias, encodeURIComponent(outlet.def.label) ];
    },
    'node/move': function(update) {
        return [ 'node/move', update.node.id ].concat(update.position);
    },
    'outlet/connect': function(update) {
        espAddToConnection(update);
        return [ 'outlet/connect', update.outlet.id, update.inlet.id, update.link.id ];
    },
    'outlet/disconnect': function(update) {
        espDeleteConnection(update);
        return [ 'outlet/disconnect', update.outlet.id, update.link.id ];
    },
    'inlet/update': function(update) {
        espUpdateInletValue(update);
        return [ 'inlet/update' ];
    },
    'outlet/update': function(update) {
        espUpdateOutletValue(update);
        return [ 'outlet/update' ];
    }
};

var lowCaseFirst = function(string) { return string.charAt(0).toLowerCase() + string.slice(1); };

var espUpdateNodePosition = function(update) {
    var nodeId = update.node.id;
    var pos = { x: update.position[0], y: update.position[1] };
    mozziFlowPos[nodeId] = pos;
    // CRITICAL: Sync with main container
    var node = _.findWhere(mozziFlowContainer, {nodeid: nodeId});
    if (node) node.nodeposition = pos;
};

var espAddInletToContainer = function(inlet) {
    var node_out = _.findWhere(mozziFlowContainer, {nodeid: inlet.node.id});
    if (!node_out) return;
    if (inlet.alias === "") return;
    var exists = false;
    for(var i=0; i<node_out.nodeinlet.length; i++) { if(node_out.nodeinlet[i].id === inlet.id) exists = true; }
    if(!exists) node_out.nodeinlet.push({ id: inlet.id, type: inlet.type, alias: inlet.alias, value: inlet.alias });
};

var espAddOutletToContainer = function(outlet) {
    var node_out = _.findWhere(mozziFlowContainer, {nodeid: outlet.node.id});
    if (!node_out) return;
    if (outlet.alias === "") return;
    var exists = false;
    for(var i=0; i<node_out.nodeoutlet.length; i++) { if(node_out.nodeoutlet[i].id === outlet.id) exists = true; }
    if(!exists) node_out.nodeoutlet.push({ id: outlet.id, type: outlet.type, alias: outlet.alias, value: outlet.alias });
};

var espUpdateInletValue = function(node) {
    var node_in = _.findWhere(mozziFlowContainer, {nodeid: node.inlet.node.id});
    if (!node_in || !node.inlet.alias) return;
    var name = node.inlet.alias.toLowerCase();
    if(node.value === "") delete node_in.nodeinletvalue[name];
    else node_in.nodeinletvalue[name] = [node.inlet.id, node.value];
};

var espUpdateOutletValue = function(node) {
    var node_out = _.findWhere(mozziFlowContainer, {nodeid: node.outlet.node.id});
    if (!node_out || !node.outlet.alias) return;
    var name = node.outlet.alias.toLowerCase();
    if(node.value === "") delete node_out.nodeoutletvalue[name];
    else node_out.nodeoutletvalue[name] = [node.outlet.id, node.value];
};

var espAddToConnection = function(node) {
    var node_in = _.findWhere(mozziFlowContainer, {nodeid: node.inlet.node.id});
    var node_out = _.findWhere(mozziFlowContainer, {nodeid: node.outlet.node.id});
    if (!node_in || !node_out) return;
    mozziFlowClassConnection.push({
        linkid: node.link.id, inletid: node.inlet.id, outletid: node.outlet.id, nodeid: node.link.id,
        inlet_class_alias: node_in.nodevariable, inlet_class: node_in.nodeclass, inlet_alias: node.link.inlet.alias,
        outlet_class_alias: node_out.nodevariable, outlet_class: node_out.nodeclass, outlet_alias: node.link.outlet.alias,
        node_in_id: node_in.nodeid, node_out_id: node_out.nodeid
    });
};

var espDeleteConnection = function(node) { mozziFlowClassConnection = _.filter(mozziFlowClassConnection, function(el) { return el.nodeid !== node.link.id; }); };

var espAddToContainer = function(node) {
    var node_prop = _.findWhere(NodeLibrary, {nodetype: node.type});
    if (!node_prop) return;
    var node_class = node_prop.nodeclass;
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
    var lines = code.split(/\r?\n/);
    var nodeMap = {}; var ioMap = {}; var connections = [];

    // PHASE 1: Create Nodes
    lines.forEach(function(line) {
        var parts = line.trim().split(' ');
        var cmd = parts[0];
        if (cmd === 'patch/add-node') {
            var id = parts[2], type = parts[3], title = parts.slice(4).join(' ').replace(/%20/g, ' ');
            var node = mozziFlowRoot.addNode(type, title);
            nodeMap[id] = node;
        } 
        else if (cmd === 'node/add-inlet' || cmd === 'node/add-outlet') {
            var nodeId = parts[1], ioId = parts[2], alias = parts[4], node = nodeMap[nodeId];
            if (node) {
                var target = (cmd === 'node/add-inlet') ? node.inlets : node.outlets;
                for (var key in target) {
                    var o = target[key];
                    if (key === alias || o.alias === alias || o.label === alias) { ioMap[ioId] = o; break; }
                }
            }
        }
        else if (cmd === 'node/move') {
            var id = parts[1], x = parseInt(parts[2]), y = parseInt(parts[3]);
            if (nodeMap[id]) nodeMap[id].move(x, y);
        }
        else if (cmd === 'node/update-inlet') {
            var id = parts[1], alias = parts[2], val = parts[3];
            var node = nodeMap[id];
            if (node && node.inlets[alias]) {
                node.inlets[alias].receive(val);
                // Directly sync UI input if it exists
                if (node._inputs && node._inputs[alias]) {
                    node._inputs[alias].value = val;
                }
            }
        }
        else if (cmd === 'node/set-data') {
            var id = parts[1];
            try {
                var rawData = parts.slice(2).join(' ');
                var decoded = atob(rawData);
                var data = JSON.parse(decoded);
                var node = nodeMap[id];
                if (node) {
                    node.data = data;
                    // Notify node that its data has been updated
                    if (node._onDataUpdate) node._onDataUpdate();
                }
            } catch(e) {
                console.error("Error loading node data for " + id, e);
            }
        }
        else if (cmd === 'outlet/connect') connections.push(parts);
    });

    // PHASE 2: Connections
    setTimeout(function() {
        connections.forEach(function(p) {
            var find = function(n, t, a) {
                var list = (t === 'in') ? n.inlets : n.outlets;
                for (var k in list) { var o = list[k]; if (k === a || o.alias === a || o.label === a) return o; }
                return null;
            };
            var out = ioMap[p[1]], ins = ioMap[p[2]];
            if (!out && p[1].includes(':')) { var parts = p[1].split(':'); if(nodeMap[parts[0]]) out = find(nodeMap[parts[0]], 'out', parts[1]); }
            if (!ins && p[2].includes(':')) { var parts = p[2].split(':'); if(nodeMap[parts[0]]) ins = find(nodeMap[parts[0]], 'in', parts[1]); }
            if (out && ins) try { out.connect(ins); } catch(e) {}
        });

        // PHASE 3: Force Layout Refresh
        setTimeout(function() {
            window.dispatchEvent(new Event('resize'));
            // If RPD has a force update for links, trigger it
            if (mozziFlowRoot && mozziFlowRoot.render) {
                // Some RPD versions use internal update cycles
            }
            // Small hack to force CSS recalculation
            var container = document.getElementById('rpd-canvas-container');
            if (container) {
                container.style.display = 'none';
                container.offsetHeight; // force reflow
                container.style.display = 'block';
            }
        }, 200);
    }, 150);
};

var NodeImportCpp = function (code) {
    var code_import = code.trim();
    
    // 1. Check if it's already raw text
    if (code_import.indexOf('v2.') === 0) {
        // Continue to import
    } else {
        // 2. Try to find and decode Base64 tags
        var start_tag = "--BEGINMOZZIFLOWPATCH--", stop_tag = "--ENDMOZZIFLOWPATCH--";
        var start_index = code_import.indexOf(start_tag);
        if (start_index !== -1) {
            start_index += start_tag.length;
            var last_index = code_import.indexOf(stop_tag);
            code_import = atob(code_import.substr(start_index, last_index - start_index).replace(/\s/g, ''));
        }
    }

    if (code_import.indexOf('v2.') === 0) {
        // HARD RESET: Close current patch and clear canvas
        if (mozziFlowRoot) {
            try { mozziFlowRoot.close(); } catch(e) { console.warn("Patch close error", e); }
        }
        
        var container = document.getElementById('rpd-canvas-container');
        container.innerHTML = ''; 
        mozziFlowReset();
        
        // Re-init RPD renderer and patch
        Rpd.renderNext('html', container, { style: 'quartz', fullPage: false });
        mozziFlowRoot = Rpd.addPatch('root');
        
        // Re-init Palette to point to the NEW patch
        if (typeof initAnchoredPalette === 'function') {
            document.getElementById('node-palette').innerHTML = '<div class="palette-header">Mozzi Nodes</div>';
            initAnchoredPalette(mozziFlowRoot);
        }

        importPlainNetwork(code_import);
    }
};

var NodeToPlainNetwork = function() {
    var output = "v2.1.1\n";
    output += "network/add-patch root root\npatch/open root\n";
    
    // 1. Nodes and Data
    mozziFlowContainer.forEach(function(node) {
        // Add Node
        output += "patch/add-node root " + node.nodeid + " " + node.nodetype + " " + node.nodedesc + "\n";
        
        // Add Position
        var pos = mozziFlowPos[node.nodeid] || node.nodeposition || {x:0, y:0};
        output += "node/move " + node.nodeid + " " + Math.floor(pos.x) + " " + Math.floor(pos.y) + "\n";
        
        // Add Inlet Values (Constants/Parameters)
        if (node.rpdNode && node.rpdNode.inlets) {
            Object.keys(node.rpdNode.inlets).forEach(function(alias) {
                var inlet = node.rpdNode.inlets[alias];
                var val = null;
                
                // Priority 1: Check reliable storage (mozziFlowContainer wrapper)
                if (node.nodeinletvalue && node.nodeinletvalue[alias.toLowerCase()]) {
                    val = node.nodeinletvalue[alias.toLowerCase()][1];
                } 
                // Priority 2: Fallback to RPD object (often [pool] or stale)
                else if (inlet.value !== undefined && inlet.value !== null) {
                    val = inlet.value;
                }

                if (val !== null && val !== undefined && !inlet.link) {
                    output += "node/update-inlet " + node.nodeid + " " + alias + " " + val + "\n";
                }
            });
        }

        // Add Custom Data (Base64) - For Samples/Huffman
        if (node.rpdNode && node.rpdNode.data && Object.keys(node.rpdNode.data).length > 0) {
            try {
                var dataStr = btoa(JSON.stringify(node.rpdNode.data));
                output += "node/set-data " + node.nodeid + " " + dataStr + "\n";
            } catch(e) {}
        }
    });

    // 2. Connections
    mozziFlowClassConnection.forEach(function(link) {
        // USE NODE IDs for reliable connection restoration
        output += "outlet/connect " + link.node_out_id + ":" + link.outlet_alias + " " +
                  link.node_in_id + ":" + link.inlet_alias + "\n";
    });

    return output;
};

var NodeToMozziCpp = function() {
    if (typeof NodeToMozziCppInternal === 'function') return NodeToMozziCppInternal();
    return "// Exporter: Please ensure mozziexport.js is loaded.";
};

var NodeToCPPDownload = function() {
    var code = NodeToMozziCpp();
    var blob = new Blob([code], {type: "text/plain;charset=utf-8"});
    var fileName = "MozziSketch_" + (new Date().getTime()) + ".ino";
    
    var downloadLink = document.createElement("a");
    downloadLink.download = fileName;
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null) {
        downloadLink.href = window.webkitURL.createObjectURL(blob);
    } else {
        downloadLink.href = window.URL.createObjectURL(blob);
        downloadLink.onclick = function(event) { document.body.removeChild(event.target); };
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }
    downloadLink.click();
};

Rpd.events.filter(function(update) { return exportSpec[update.type]; }).onValue(function(update) {
    exportSpec[update.type](update);
    if (update.type === 'node/move') espUpdateNodePosition(update);
});

var editPatchSource = function() {
    if (typeof modalOpen !== "undefined" && modalOpen === 1) return;
    if (typeof modalOpen !== "undefined") modalOpen = 1;

    // Get current code state
    var currentCode = NodeToPlainNetwork();

    vex.dialog.open({
        message: "Patch Source Code Editor (Edit and Click Load)",
        showCloseButton: true,
        buttons: [
            Object.assign({}, vex.dialog.buttons.YES, { text: "Load / Update" }),
            Object.assign({}, vex.dialog.buttons.NO, { text: "Cancel" })
        ],
        input: [
            "<style>",
                ".vex-custom-field-wrapper { margin: 1em 0; }",
                ".vex-custom-field-wrapper > label { display: inline-block; margin-bottom: .2em; }",
            "</style>",
            "<div class=\"vex-custom-field-wrapper\">",
                "<div class=\"vex-custom-input-wrapper\">",
                    "<textarea id=\"patch-source-editor\" rows=\"20\" cols=\"80\" style=\"font-size: 0.7em; font-family: monospace; border: 1px solid #444; background: #111; color: #0f9; width: 100%;\">" + currentCode + "</textarea>",
                "</div>",
            "</div>"
        ].join(""),
        beforeClose: function() {
            if (typeof modalOpen !== "undefined") modalOpen = 0;
        },
        onSubmit: function(event) {
            event.preventDefault();
            event.stopPropagation();
            var newCode = document.getElementById("patch-source-editor").value;
            if (newCode) {
                NodeImportCpp(newCode.trim());
            }
            this.close();
        },
        callback: function(data) {
            // Handled in onSubmit
        }
    });
};

