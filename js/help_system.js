// --- Advanced Full-Screen Help System ---

var helpSystemOpen = false;

function toggleHelp() {
    var overlay = document.getElementById('help-overlay');
    helpSystemOpen = !helpSystemOpen;
    
    if (helpSystemOpen) {
        overlay.classList.remove('hidden');
        renderHelpNodeList();
    } else {
        overlay.classList.add('hidden');
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
    searchInput.style.marginBottom = '10px';
    searchInput.style.width = '100%';
    
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
        var parts = node.nodetype.split('/');
        var cat = parts[0];
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push(node);
    });

    var order = ['input', 'wave', 'filter', 'signal', 'math', 'lfo', 'logic', 'output'];
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
            li.onclick = function() {
                listContainer.querySelectorAll('li').forEach(function(el) { el.classList.remove('rpd-nodelist-selected'); });
                li.classList.add('rpd-nodelist-selected');
                showHelpDetail(node);
            };
            ul.appendChild(li);
        });
        dd.appendChild(ul);
        dl.appendChild(dd);
    });
    listContainer.appendChild(dl);
}

function renderNodeMockup(node) {
    var cat = node.nodetype.split('/')[0];
    var title = node.rpdnode.title || node.nodetype;
    
    // RPD Channel Classes for native coloring
    var getChannelClass = function(typeStr) {
        if (!typeStr) return 'rpd-channel-type-mozziflow-generic';
        var cleanType = typeStr.replace('mozziflow/', '');
        return 'rpd-channel-type-mozziflow-' + cleanType;
    };

    // Use strict RPD structure: rpd-patch > rpd-node-box > table.rpd-node
    var html = '<div class="help-node-wrapper rpd-patch">'; 
    html += '<div class="rpd-node-box">'; 
    html += '<table class="rpd-node rpd-toolkit-' + cat + '">';
    html += '<thead class="rpd-title"><tr><th colspan="2">' + title + '</th></tr></thead>';
    html += '<tbody class="rpd-content"><tr>';
    
    // Inlets
    html += '<td class="rpd-inlets"><table>';
    Object.keys(node.rpdnode.inlets || {}).forEach(function(key) {
        var def = node.rpdnode.inlets[key];
        var cClass = getChannelClass(def.color || def.type);
        html += '<tr class="rpd-inlet ' + cClass + '"><td class="rpd-connector"></td><td class="rpd-name">' + key + '</td></tr>';
    });
    html += '</table></td>';

    // Outlets
    html += '<td class="rpd-outlets"><table>';
    Object.keys(node.rpdnode.outlets || {}).forEach(function(key) {
        var def = node.rpdnode.outlets[key];
        var cClass = getChannelClass(def.color || def.type);
        html += '<tr class="rpd-outlet ' + cClass + '"><td class="rpd-name">' + key + '</td><td class="rpd-connector"></td></tr>';
    });
    html += '</table></td>';

    html += '</tr></tbody></table></div></div>';
    return html;
}

function showHelpDetail(node) {
    var container = document.getElementById('help-detail-view');
    var h = node.help || { summary: node.description || "No description available.", usage: "", inlets: {}, outlets: {} };

    var html = '<div class="help-detail-container">';
    html += '<div class="help-detail-header"><h1>' + (node.rpdnode.title || node.nodetype) + '</h1></div>';
    html += '<div class="help-detail-body">';
    
    // Dynamic Preview
    html += renderNodeMockup(node);

    html += '<div class="help-detail-section"><h4>Description</h4><p>' + h.summary + '</p></div>';
    if (h.usage) html += '<div class="help-detail-section"><h4>How to use</h4><div class="help-detail-usage">' + h.usage + '</div></div>';

    var inlets = Object.keys(node.rpdnode.inlets || {});
    if (inlets.length > 0) {
        html += '<div class="help-detail-section"><h4>Inlets (Inputs)</h4><table class="help-io-table">';
        inlets.forEach(function(key) {
            var desc = (h.inlets && h.inlets[key]) ? h.inlets[key] : "Signal/Control input.";
            html += '<tr><td class="help-io-name">' + key + '</td><td class="help-io-desc">' + desc + '</td></tr>';
        });
        html += '</table></div>';
    }

    var outlets = Object.keys(node.rpdnode.outlets || {});
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
}
