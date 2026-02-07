// Quartz style patch for RPD - Enhanced with MozziFlow bit-depth coloring
(function(global) {
    "use strict";
    var Rpd = global.Rpd;
    Rpd.style('quartz', 'html', function(config) {
        var d3 = global.d3 || global.d3_tiny;
        var lastCanvas;
        var inletToConnector = {}, outletToConnector = {};
        function getPos(elm) { var bounds = elm.getBoundingClientRect(); return { x: bounds.left, y: bounds.top }; }
        return {
            edgePadding: { horizontal: 30, vertical: 20 },
            boxPadding:  { horizontal: 20, vertical: 30 },
            createCanvas: function(patch, parent) { 
                var elm = d3.select(document.createElement('div')).classed('rpd-patch', true).node();
                if (window.currentZoom) elm.style.zoom = window.currentZoom;
                lastCanvas = d3.select(elm);
                return { element: elm }; 
            },
            createNode: function(node, render, description, icon) {
                var nodeElm = d3.select(document.createElement('table'))
                                .attr('class', 'rpd-node node-id-' + (node.patchId || node.id));
                nodeElm.append('thead').attr('class', 'rpd-title').classed('rpd-drag-handle', true)
                       .call(function(thead) { thead.append('tr').attr('class', 'rpd-remove-button').append('th').text('x'); })
                       .call(function(thead) {
                            thead.append('tr').attr('class', 'rpd-header').append('th').attr('colspan', 3)
                                 .call(function(th) {
                                     if (icon) th.append('span').attr('class', 'rpd-icon').text(icon);
                                     th.append('span').attr('class', 'rpd-name').text(node.def.title || node.type);
                                     th.attr('title', description || node.type);
                                 });
                       });
                nodeElm.append('tbody').attr('class', 'rpd-content').call(function(tbody) {
                   tbody.append('tr')
                        .call(function(tr) { tr.append('td').attr('class', 'rpd-inlets').append('table').append('tbody').append('div').attr('class', 'rpd-inlets-target'); })
                        .call(function(tr) { tr.append('td').attr('class', 'rpd-body').append('table').append('tbody').append('tr').append('td').append('div').attr('class', 'rpd-process-target'); })
                        .call(function(tr) { tr.append('td').attr('class', 'rpd-outlets').append('table').append('tbody').append('div').attr('class', 'rpd-outlets-target'); })
                });
                return { element: nodeElm.node(), size: render.size ? { width: render.size.width || 70, height: render.size.height || 30 } : { width: 70, height: 30 } };
            },
            createInlet: function(inlet, render) {
                var inletElm = d3.select(document.createElement('tr')).attr('class', 'rpd-inlet')
                                 .call(function(tr) {
                                     // MozziFlow Color Hack: Read from definition or fallback to Library lookup
                                     var c = 'string';
                                     // Prioritize standard RPD type (e.g. 'mozziflow/int8' -> 'int8')
                                     if (inlet.def && inlet.def.type && inlet.def.type.indexOf('mozziflow/') === 0) {
                                         c = inlet.def.type.split('/')[1];
                                     }
                                     // Fallback to legacy 'color' prop
                                     else if (inlet.def && inlet.def.color) c = inlet.def.color;
                                     else if (global.NodeLibrary && inlet.node && inlet.node.type) {
                                         var def = global.NodeLibrary.find(function(n) { return n.nodetype === inlet.node.type; });
                                         if (def && def.rpdnode && def.rpdnode.inlets && def.rpdnode.inlets[inlet.alias]) {
                                            var idef = def.rpdnode.inlets[inlet.alias];
                                            if (idef.type && idef.type.indexOf('mozziflow/') === 0) c = idef.type.split('/')[1];
                                            else c = idef.color || 'string';
                                         }
                                     }
                                     tr.classed('rpd-channel-type-mozziflow-' + c, true);

                                     tr.append('td').attr('class', 'rpd-connector');
                                     tr.append('td').attr('class', 'rpd-value-holder').append('span').attr('class', 'rpd-value');
                                     tr.append('td').attr('class', 'rpd-name').text(inlet.def.label || inlet.alias);
                                 });
                inletToConnector[inlet.id] = inletElm.select('.rpd-connector');
                return { element: inletElm.node() };
            },
            createOutlet: function(outlet, render) {
                var outletElm = d3.select(document.createElement('tr')).attr('class', 'rpd-outlet')
                                  .call(function(tr) {
                                      var c = 'string';
                                      // Prioritize standard RPD type (e.g. 'mozziflow/int8' -> 'int8')
                                      if (outlet.def && outlet.def.type && outlet.def.type.indexOf('mozziflow/') === 0) {
                                          c = outlet.def.type.split('/')[1];
                                      }
                                      else if (outlet.def && outlet.def.color) c = outlet.def.color;
                                      else if (global.NodeLibrary && outlet.node && outlet.node.type) {
                                          var def = global.NodeLibrary.find(function(n) { return n.nodetype === outlet.node.type; });
                                          if (def && def.rpdnode && def.rpdnode.outlets && def.rpdnode.outlets[outlet.alias]) {
                                              var odef = def.rpdnode.outlets[outlet.alias];
                                              if (odef.type && odef.type.indexOf('mozziflow/') === 0) c = odef.type.split('/')[1];
                                              else c = odef.color || 'string';
                                          }
                                      }
                                      tr.classed('rpd-channel-type-mozziflow-' + c, true);

                                      tr.append('td').attr('class', 'rpd-connector');
                                      tr.append('td').attr('class', 'rpd-value-holder').append('span').attr('class', 'rpd-value');
                                      tr.append('td').attr('class', 'rpd-name').text(outlet.def.label || outlet.alias);
                                  });
                outletToConnector[outlet.id] = outletElm.select('.rpd-connector');
                return { element: outletElm.node() };
            },
            createLink: function(link) {
                var linkElm = d3.select(document.createElement('span')).attr('class', 'rpd-link').style('position', 'absolute').style('transform-origin', 'left top');
                return { element: linkElm.node(), rotate: function(x0, y0, x1, y1) {
                    var d = Math.sqrt(((x0 - x1) * (x0 - x1)) + ((y0 - y1) * (y0 - y1)));
                    var a = Math.atan2(y1 - y0, x1 - x0);
                    linkElm.style('left', x0 + 'px').style('top', y0 + 'px').style('width', Math.floor(d) + 'px').style('transform', 'rotateZ(' + a + 'rad)');
                }};
            },
            getInletPos: function(inlet) { 
                var conn = inletToConnector[inlet.id];
                if (!conn || !conn.node()) return {x:0, y:0};
                var p = getPos(conn.node()); return { x: p.x, y: p.y - 1 }; 
            },
            getOutletPos: function(outlet) { 
                var conn = outletToConnector[outlet.id];
                if (!conn || !conn.node()) return {x:0, y:0};
                var p = getPos(conn.node()); return { x: p.x, y: p.y - 1 }; 
            },
            getLocalPos: function(pos) { 
                if (!lastCanvas) return pos; 
                var cp = getPos(lastCanvas.node()); 
                var zoom = window.currentZoom || 1.0;
                return { 
                    x: (pos.x - cp.x) / zoom, 
                    y: ((pos.y - cp.y) - 1) / zoom 
                }; 
            },
            onPatchSwitch: function(patch, canvas) { 
                lastCanvas = d3.select(canvas); 
                if (window.currentZoom) canvas.style.zoom = window.currentZoom;
            }
        };
    });
})(this);