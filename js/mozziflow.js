// =============================================================================
// MOZZI CORE INFRASTRUCTURE (v5.5 Unified Architecture)
// =============================================================================

var NodeLibrary = [];

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

var lowCaseFirst = function(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
};

// --- TECHNICAL TYPE REGISTRY ---
var MOZZI_TYPES = {
    'mozziflow/bool':     { cpp: 'bool',     color: '#ffffff' },
    'mozziflow/int8_t':   { cpp: 'int8_t',   color: '#00ff99' },
    'mozziflow/uint8_t':  { cpp: 'uint8_t',  color: '#00cc7a' },
    'mozziflow/int16_t':  { cpp: 'int16_t',  color: '#3399ff' },
    'mozziflow/uint16_t': { cpp: 'uint16_t', color: '#0066ff' },
    'mozziflow/int32_t':  { cpp: 'int32_t',  color: '#ff33cc' },
    'mozziflow/uint32_t': { cpp: 'uint32_t', color: '#cc0099' },
    'mozziflow/float':    { cpp: 'float',    color: '#ffff00' },
    'mozziflow/sfix8':    { cpp: 'SFix<7,0>',   color: '#00ffcc' },
    'mozziflow/sfix16':   { cpp: 'SFix<15,0>',  color: '#00ccff' },
    'mozziflow/sfix16_8': { cpp: 'SFix<7,8>',   color: '#ff6633' },
    'mozziflow/sfix32_16':{ cpp: 'SFix<15,16>', color: '#ee3300' },
    'mozziflow/ufix16_16':{ cpp: 'UFix<16,16>', color: '#ffcc00' },
    'mozziflow/any':      { cpp: 'int32_t',  color: '#888888' }
};

// --- RPD CORE SETUP & PALETTE ---
var d3 = d3 || d3_tiny;
var NodeList = RpdUtils.NodeList;
var getNodeTypesByToolkit = RpdUtils.getNodeTypesByToolkit;

function initAnchoredPalette(patch) {
    var bodyElm = document.getElementById('node-palette');
    var nodeTypes = Rpd.allNodeTypes;
    var nodeEsp = {};
    for (var key in nodeTypes) {
        // Only include our unified toolkit nodes
        if (key.indexOf("mozziflow/") === 0) {
            nodeEsp[key] = nodeTypes[key];
        }
    }
    
    // Custom Grouping Logic for Palette
    var categories = {};
    var catOrder = ["wave", "lfo", "filter", "modifier", "signal", "math", "logic", "input", "output", "ch32x035", "custom"];
    
    catOrder.forEach(function(c) { categories[c] = []; });

    Object.keys(nodeEsp).forEach(function(fullName) {
        var nodeDef = nodeEsp[fullName];
        var cat = nodeDef.category || "other";
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push({ fullName: fullName, name: nodeDef.title || fullName.split('/')[1] });
    });

    var nodeList = new NodeList({
        getPatch: function() { return patch; },
        buildList: function() {
            var listElements = [];
            d3.select(bodyElm).append('dl').call(function(dl) {
                  Object.keys(categories).forEach(function(catName) {
                      if (categories[catName].length === 0) return;
                      dl.append('dt').attr('class', 'rpd-palette-category').text(catName.toUpperCase());
                      dl.append('dd').append('ul').call(function(ul) {
                            categories[catName].forEach(function(item) {
                                ul.append('li').call(function(li) {
                                      var elmData = { def: { fullName: item.fullName, toolkit: 'mozziflow' }, element: li };
                                      li.data(elmData);
                                      li.attr('class', 'rpd-palette-item rpd-category-' + catName);
                                      li.append('span').attr('class', 'rpd-nodelist-typename').text(item.name);
                                      listElements.push(elmData);
                                  })
                            });
                        });
                  });
              });
            return listElements;
        },
        createSearchInput: function() { return d3.select(bodyElm).append('input').attr('type', 'text').attr('placeholder', 'Search...'); },
        createClearSearchButton: function() { return d3.select(bodyElm).append('a').attr('href', '#').text('x'); },
        clearSearchInput: function(searchInput) { searchInput.node().value = ''; },
        recalculateSize: function() {},
        markSelected: function(elmData) { elmData.element.classed('rpd-nodelist-selected', true); },
        markDeselected: function(elmData) { elmData.element.classed('rpd-nodelist-selected', false); },
        markAdding: function(elmData) { elmData.element.classed('rpd-nodelist-add-effect', true); },
        markAdded: function(elmData) { elmData.element.classed('rpd-nodelist-add-effect', false); },
        setVisible: function(elmData) { elmData.element.style('display', 'list-item'); },
        setInvisible: function(elmData) { elmData.element.style('display', 'none'); }
    });
    nodeList.addOnClick(); nodeList.addSearch(); nodeList.addCtrlSpaceAndArrows();
}

// --- REGISTER CHANNEL TYPES (Unified Toolkit) ---
Object.keys(MOZZI_TYPES).forEach(function(type) {
    Rpd.channeltype(type, {
        readonly: false,
        accept: function() { return true; }, // Intra-toolkit connection is always true
        adapt: function(val) { return val; }
    });
    Rpd.channelrenderer(type, 'html', {});
});

// --- UI UTILS ---
var MozziUI = {
    refreshNode: function(node) {
        if (node && node.on_refresh) {
            node.on_refresh();
        }
    }
};

if (typeof global !== 'undefined') {
    global.MOZZI_TYPES = MOZZI_TYPES;
    global.MozziUI = MozziUI;
    global.NodeLibrary = NodeLibrary;
}