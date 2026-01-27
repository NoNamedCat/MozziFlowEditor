var NodeLibrary = [];

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

var  lowCaseFirst = function(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}

// =============================================================================
// CORE RPD SETUP & PALETTE
// =============================================================================

var d3 = d3 || d3_tiny;
var NodeList = RpdUtils.NodeList;
var getNodeTypesByToolkit = RpdUtils.getNodeTypesByToolkit;

Rpd.nodedescription('mozziflow/nodelist', 'Add any node to active patch by type');

// Function to initialize the anchored palette
function initAnchoredPalette(patch) {
    var bodyElm = document.getElementById('node-palette');
    var nodeTypes = Rpd.allNodeTypes,
        nodeDescriptions = Rpd.allNodeDescriptions,
        nodeTypeIcons = Rpd.allNodeTypeIcons;

    var nodeEsp = {}
    for (var key in nodeTypes) {
        if (!key.includes("core") && !key.includes("nodelist")) {
            nodeEsp[key] = nodeTypes[key]
        }
    }

    var nodeTypesByToolkit = getNodeTypesByToolkit(nodeEsp);

    var nodeList = new NodeList({
        getPatch: function() { return patch; },
        buildList: function() {
            var listElements = [];
            d3.select(bodyElm).append('dl').call(function(dl) {
                  Object.keys(nodeTypesByToolkit).forEach(function(toolkit) {
                      dl.append('dt').attr('class', 'rpd-palette-category').text(toolkit.toUpperCase());
                      dl.append('dd').append('ul').call(function(ul) {
                            nodeTypesByToolkit[toolkit].types.forEach(function(nodeTypeDef) {
                                var nodeType = nodeTypeDef.fullName;
                                ul.append('li').call(function(li) {
                                      var elmData = { def: nodeTypeDef, element: li };
                                      li.data(elmData);
                                      li.attr('class', 'rpd-palette-item rpd-category-' + nodeTypeDef.toolkit);
                                      
                                      // FIX: Access description from the global RPD registry
                                      var realDef = nodeTypes[nodeType];
                                      if (realDef && realDef.description) {
                                          li.attr('title', realDef.description);
                                      } else if (nodeDescriptions[nodeType]) {
                                          li.attr('title', nodeDescriptions[nodeType]);
                                      }

                                      li.append('span').attr('class', 'rpd-nodelist-icon').text(nodeTypeIcons[nodeType] || String.fromCharCode(160));
                                      
                                      // Fix: Use prettier title from NodeLibrary if available
                                      var displayName = nodeTypeDef.name;
                                      if (typeof NodeLibrary !== 'undefined') {
                                          var libEntry = NodeLibrary.find(function(n) { return n.nodetype === nodeType; });
                                          if (libEntry && libEntry.rpdnode && libEntry.rpdnode.title) {
                                              displayName = libEntry.rpdnode.title;
                                          }
                                      }
                                      
                                      li.append('span').attr('class', 'rpd-nodelist-typename').text(displayName);
                                      
                                      listElements.push(elmData);
                                  })
                            });
                        });
                  });
              });
            return listElements;
        },
        createSearchInput: function() { return d3.select(bodyElm).append('input').attr('type', 'text').attr('placeholder', 'Search nodes...'); },
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

    nodeList.addOnClick();
    nodeList.addSearch();
    nodeList.addCtrlSpaceAndArrows();
}

// Basic String Channel Type
Rpd.channeltype('mozziflow/string', {
    readonly: false,
    accept: function(val) { return true; },
    adapt: function(val) { return (val); }
});

// New Float Channel Type
Rpd.channeltype('mozziflow/float_32', {
    readonly: false,
    accept: function(val) { return true; },
    adapt: function(val) { return parseFloat(val); }
});

Rpd.channelrenderer('mozziflow/string', 'html', {});
Rpd.channelrenderer('mozziflow/float_32', 'html', {});