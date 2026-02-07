// --- Advanced Full-Screen Help System (v2.0 Live Preview) ---

var helpSystemOpen = false;
var helpPatch = null;
var helpCanvasContainer = null;

function toggleHelp() {
    var overlay = document.getElementById('help-overlay');
    helpSystemOpen = !helpSystemOpen;
    
    if (helpSystemOpen) {
        overlay.classList.remove('hidden');
        renderHelpNodeList();
    } else {
        overlay.classList.add('hidden');
        if (helpPatch) { 
            // Cleanup help patch to free resources
            // mozziFlowRoot is the main one, we don't want to close it!
        }
    }
}

function renderHelpNodeList() {
    var listContainer = document.getElementById('help-nodes-list');
    listContainer.innerHTML = '';
    listContainer.classList.add('rpd-mozziflow-nodelist');

    var searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search nodes...';
    searchInput.className = 'help-search-input';
    
    searchInput.oninput = function() {
        var term = this.value.toLowerCase();
        var items = listContainer.querySelectorAll('li');
        items.forEach(function(item) {
            item.style.display = item.innerText.toLowerCase().indexOf(term) > -1 ? 'list-item' : 'none';
        });
    };
    
    listContainer.appendChild(searchInput);

    var categories = {};
    NodeLibrary.forEach(function(node) {
        var cat = node.category || "other";
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push(node);
    });

    var order = ['wave', 'lfo', 'filter', 'mixer', 'envelope', 'signal', 'casting', 'math', 'logic', 'input', 'output', 'ch32x035', 'custom'];
    var dl = document.createElement('dl');

    order.forEach(function(cat) {
        if (!categories[cat]) return;
        var dt = document.createElement('dt');
        dt.className = 'rpd-palette-category rpd-category-' + cat;
        dt.innerText = cat.toUpperCase();
        dl.appendChild(dt);

        var dd = document.createElement('dd');
        var ul = document.createElement('ul');
        categories[cat].forEach(function(node) {
            var li = document.createElement('li');
            li.className = 'help-node-item rpd-category-' + cat; 
            li.innerText = node.rpdnode.title || node.nodetype;
            li.onclick = (function(n, l){ 
                return function() {
                    listContainer.querySelectorAll('li').forEach(function(el) { el.classList.remove('rpd-nodelist-selected'); });
                    l.classList.add('rpd-nodelist-selected');
                    showHelpDetail(n);
                };
            })(node, li);
            ul.appendChild(li);
        });
        dd.appendChild(ul);
        dl.appendChild(dd);
    });
    listContainer.appendChild(dl);
}

function showHelpDetail(nodeDef) {
    var container = document.getElementById('help-detail-view');
    var h = nodeDef.help || { summary: nodeDef.description || "No description available.", usage: "", inlets: {}, outlets: {} };

    var html = '<div class="help-detail-container">';
    html += '<div class="help-detail-header"><h1>' + (nodeDef.rpdnode.title || nodeDef.nodetype) + '</h1></div>';
    html += '<div class="help-detail-body">';
    
    // Live Preview Area
    html += '<div class="help-preview-section">';
    html += '<h4>Live Preview</h4>';
    html += '<div id="help-node-canvas" class="help-canvas"></div>';
    html += '</div>';

    html += '<div class="help-detail-section"><h4>Description</h4><p>' + h.summary + '</p></div>';
    if (h.usage) html += '<div class="help-detail-section"><h4>How to use</h4><div class="help-detail-usage">' + h.usage + '</div></div>';

    // IO Tables
    var inlets = Object.keys(nodeDef.rpdnode.inlets || {});
    if (inlets.length > 0) {
        html += '<div class="help-detail-section"><h4>Inlets (Inputs)</h4><table class="help-io-table">';
        inlets.forEach(function(key) {
            var desc = (h.inlets && h.inlets[key]) ? h.inlets[key] : "Signal/Control input.";
            html += '<tr><td class="help-io-name">' + key + '</td><td class="help-io-desc">' + desc + '</td></tr>';
        });
        html += '</table></div>';
    }

    var outlets = Object.keys(nodeDef.rpdnode.outlets || {});
    if (outlets.length > 0) {
        html += '<div class="help-detail-section"><h4>Outlets (Outputs)</h4><table class="help-io-table">';
        outlets.forEach(function(key) {
            var desc = (h.outlets && h.outlets[key]) ? h.outlets[key] : "Signal output.";
            html += '<tr><td class="help-io-name">' + key + '</td><td class="help-io-desc">' + desc + '</td></tr>';
        });
        html += '</table></div>';
    }

    html += '</div></div>';
    container.innerHTML = html;

    // --- RPD Live Injection ---
    setTimeout(function() {
        var canvas = document.getElementById('help-node-canvas');
        if (!canvas) return;
        canvas.innerHTML = ''; // Clear previous preview
        
        // 1. Setup an isolated patch for help
        Rpd.renderNext('html', canvas, { style: 'quartz', fullPage: false });
        var hPatch = Rpd.addPatch('help');
        
        // 2. Add the node at 0,0
        var hNode = hPatch.addNode(nodeDef.nodetype, nodeDef.rpdnode.title || nodeDef.nodetype);
        hNode.move(0, 0);
        
        // 3. Apply initial data
        if (nodeDef.nodetype.includes('mux')) hNode.data.cfg_num_chips = 1;
        if (nodeDef.nodetype.includes('shift595')) hNode.data.cfg_num_chips = 1;
        
        // 4. Force refresh to show internal fields
        if (typeof MozziUI !== 'undefined' && MozziUI.refreshNode) {
            MozziUI.refreshNode(hNode);
        }

        // 5. Dynamic Height Adjustment
        var nodeElm = canvas.querySelector('.rpd-node');
        if (nodeElm) {
            var h = nodeElm.offsetHeight + 40; // Height + Padding
            canvas.style.height = h + 'px';
        }
    }, 100);
}