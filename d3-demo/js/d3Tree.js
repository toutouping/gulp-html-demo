'use strict';

d3.chart = d3.chart || {};

d3.chart.d3Tree = function() {
    var treeData = null;  // JSOn数据
    var tree; // 存放D3树
    var svg = null;
    var node = null;
    var scale = [];
    var zoomListener = null;
    var svgGroup = null;
    var dragListener = null;

    var totalNodes = 0; //总节点数
    var maxLabelLength = 0; // 记录名称的最大长度
    
    var linePx = 38; //  每一行像素高度

    // 拖拽时保存节点信息
    var selectedNode = null;
    var draggingNode = null;

    // panning variables
    var panSpeed = 200;
    var panBoundary = 20; // Within 20px from edges will pan when dragging.

    var i = 0;
    var duration = 750; //动画缓冲时间
    var root;

    // 设置图表大小
    var viewerWidth = $(document).width();  // 窗口宽度
    var viewerHeight = $(document).height(); // 窗口高度

    var dragStarted = false;
    var domNode = null;
    var nodes = [];
    var panTimer = null;
    var editServerTreeId = '';
    
    //这是编辑按钮
    var editTools = d3.select("#tree-container").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

    // 一个对角线生成器，只需要输入两个顶点坐标，即可生成一条贝塞尔曲线。
    var diagonal = d3.svg.diagonal()
        .projection(function(d) {
            return [d.y, d.x];
        });

    /**
     * Build the chart
     */
    function chart(){
        if (typeof(tree) === 'undefined') {
            // 定义一个集群图布局
            tree = d3.layout.tree()
                    .size([viewerHeight, viewerWidth]); // 设定尺寸，即转换后的各节点的坐标在哪一个范围内。

            visit(treeData, function(d) {
                totalNodes++;
                maxLabelLength = Math.max(d.name.length, maxLabelLength);
            }, function(d) {
                return d.children && d.children.length > 0 ? d.children : null;
            });

            sortTree();

            zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]) // 设置最大和最小缩放比例
                                                .on("zoom", zoom);

            // 定义容器的样式和事件
            var baseSvg = d3.select("#tree-container").append("svg")
                .attr("width", viewerWidth)
                .attr("height", viewerHeight)
                .attr("class", "overlay")
                .call(zoomListener)
                // .on("mousedown", function () {
                //     fadeUneditServer(1)();
                // });

            // Append a group which holds all nodes and which the zoom Listener can act upon.
            svgGroup = baseSvg.append("g");

            //定义跟节点
            root = treeData;
            root.x0 = viewerHeight / 2;
            root.y0 = 0;
            editServerTreeId = '';
            // Layout the tree initially and center on the root node.
            update(root);
            centerNode(root); // 居中根节点
        }else{
            //定义跟节点
            root = treeData;
            root.x0 = viewerHeight / 2;
            root.y0 = 0;
            editServerTreeId = '';
            // Layout the tree initially and center on the root node.
            update(root);
        }

    }
    
    // 递归遍历获取总节点数，以及名称最大的长度
    function visit(parent, visitFn, childrenFn) {
        if (!parent) return;

        visitFn(parent); // 计算总节点数，以及名称最大的长度

        var children = childrenFn(parent);
        if (children) {
            var count = children.length;
            for (var i = 0; i < count; i++) {
                visit(children[i], visitFn, childrenFn);
            }
        }
    }

    // 排序
    function sortTree() {
        tree.sort(function(a, b) {
            return b.name.toLowerCase() <= a.name.toLowerCase() ? 1 : -1;
        });
    }
    
    // 画节点
    function pan(domNode, direction) { // 动态收缩或者展开
        var speed = panSpeed;
        var translateX = 0;
        var translateY = 0;
        if (panTimer) {
            clearTimeout(panTimer);
            var translateCoords = d3.transform(svgGroup.attr("transform"));
            if (direction == 'left' || direction == 'right') {
                translateX = direction == 'left' ? translateCoords.translate[0] + speed : translateCoords.translate[0] - speed;
                translateY = translateCoords.translate[1];
            } else if (direction == 'up' || direction == 'down') {
                translateX = translateCoords.translate[0];
                translateY = direction == 'up' ? translateCoords.translate[1] + speed : translateCoords.translate[1] - speed;
            }
            var scaleX = translateCoords.scale[0];
            var scaleY = translateCoords.scale[1];
            scale = zoomListener.scale();
            svgGroup.transition().attr("transform", "translate(" + translateX + "," + translateY + ")scale(" + scale + ")");
            d3.select(domNode).select('g.node').attr("transform", "translate(" + translateX + "," + translateY + ")");
            zoomListener.scale(zoomListener.scale());
            zoomListener.translate([translateX, translateY]);
            panTimer = setTimeout(function() {
                pan(domNode, speed, direction);
            }, 50);
        }
    }

    // 焦点转移
    function zoom() {
        if (d3.event.sourceEvent.which !== 3) {
            svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        }
    }
    
    // 初始拖拽行为
    function initiateDrag(d, domNode) {
        draggingNode = d;
        d3.select(domNode).select('.ghostCircle').attr('pointer-events', 'none');
        d3.selectAll('.ghostCircle').attr('class', 'ghostCircle show');
        d3.select(domNode).attr('class', (data) => {
            return "node activeDrag " + data.type || '';
        });

        // 重新排序，将选中的元素放置前面
        svgGroup.selectAll("g.node").sort(function(a, b) {
            if (a.id != draggingNode.id) return 1;
            else return -1;
        });

        // 删除 子元素及其连接
        if (nodes.length > 1) {
            // 删除连接
            var links = tree.links(nodes);
            var nodePaths = svgGroup.selectAll("path.link")
                .data(links, function(d) {
                    return d.target.id;
                }).remove();

            // 删除子节点
            var nodesExit = svgGroup.selectAll("g.node")
                .data(nodes, function(d) {
                    return d.id;
                }).filter(function(d, i) {
                    if (d.id == draggingNode.id) {
                        return false;
                    }
                    return true;
                }).remove();
        }

        // 删除与父元素的连接
        var parentLink = tree.links(tree.nodes(draggingNode.parent));
        svgGroup.selectAll('path.link').filter(function(d, i) {
            if (d.target.id == draggingNode.id) {
                return true;
            }
            return false;
        }).remove();

        dragStarted = null;
    }

    // 节点拖拽行为
    dragListener = d3.behavior.drag()
        .on("dragstart", function(d) {
            if (d3.event.sourceEvent.which !== 1 || editServerTreeId !== '' || d.type !== 'server') { // 左键按下拖动
                return;
            }
            dragStarted = true;
            nodes = tree.nodes(d);
            d3.event.sourceEvent.stopPropagation();
        })
        .on("drag", function(d) {
            if (d3.event.sourceEvent.which !== 1 || editServerTreeId !== '' || d.type !== 'server') {
                return;
            }
            if (dragStarted) {
                domNode = this;
                initiateDrag(d, domNode);
            }

            // get coords of mouseEvent relative to svg container to allow for panning
            var relCoords = d3.mouse($('svg').get(0));
            if (relCoords[0] < panBoundary) {
                panTimer = true;
                pan(this, 'left');
            } else if (relCoords[0] > ($('svg').width() - panBoundary)) {

                panTimer = true;
                pan(this, 'right');
            } else if (relCoords[1] < panBoundary) {
                panTimer = true;
                pan(this, 'up');
            } else if (relCoords[1] > ($('svg').height() - panBoundary)) {
                panTimer = true;
                pan(this, 'down');
            } else {
                try {
                    clearTimeout(panTimer);
                } catch (e) {

                }
            }

            d.x0 += d3.event.dy;
            d.y0 += d3.event.dx;
            var node = d3.select(this);
            node.attr("transform", "translate(" + d.y0 + "," + d.x0 + ")");
            updateTempConnector();
        })
        .on("dragend", function(d) {
            if (d3.event.sourceEvent.which !== 1 || editServerTreeId !== '' || d.type !== 'server') {
                return;
            }
            var domNode = this;
            if (selectedNode) {
                // now remove the element from the parent, and insert it into the new elements children
                var index = draggingNode.parent.children.indexOf(draggingNode);
                if (index > -1) {
                    draggingNode.parent.children.splice(index, 1);
                }
                if (typeof selectedNode.children !== 'undefined' || typeof selectedNode._children !== 'undefined') {
                    if (selectedNode.children) {
                        selectedNode.children.push(draggingNode);
                    } else {
                        selectedNode._children.push(draggingNode);
                    }
                } else {
                    selectedNode.children = [];
                    selectedNode.children.push(draggingNode);
                }
                // Make sure that the node being added to is expanded so user can see added node is correctly moved
                expand(selectedNode);
                sortTree();
                endDrag();
                
                console.log("更新后的数据集合---" + root);
                
            } else {
                endDrag();
            }
        });

    // 拖拽结束
    function endDrag() {
        selectedNode = null;
        d3.selectAll('.ghostCircle').attr('class', 'ghostCircle');
        d3.select(domNode).attr('class', (data) => {
           return "node " + data.type || '';
        });

        // now restore the mouseover event or we won't be able to drag a 2nd time
        d3.select(domNode).select('.ghostCircle').attr('pointer-events', '');
        updateTempConnector();
        if (draggingNode !== null) {
            update(root);
            centerNode(draggingNode);
            draggingNode = null;
        }
    }

    // 折叠 _children 用于临时保存节点，供展开时使用
    function collapse(d) {
        if (d.children) {
            d._children = d.children;
            d._children.forEach(collapse);
            d.children = null;
        }
    }

    // 展开
    function expand(d) {
        if (d._children) {
            d.children = d._children;
            d.children.forEach(expand);
            d._children = null;
        }
    }

    // 进入圈内
    var overCircle = function(d) {
        if(d.type === 'colony') {
            selectedNode = d;
            updateTempConnector();
        }
    };

    // 圈外
    var outCircle = function(d) {
        if(d.type === 'colony') {
            selectedNode = null;
            updateTempConnector();
        }
    };

    // 生成个临时连接线
    var updateTempConnector = function() {
        var data = [];
        if (draggingNode !== null && selectedNode !== null) {
            // have to flip the source coordinates since we did this for the existing connectors on the original tree
            data = [{
                source: {
                    x: selectedNode.y0,
                    y: selectedNode.x0
                },
                target: {
                    x: draggingNode.y0,
                    y: draggingNode.x0
                }
            }];
        }
        var link = svgGroup.selectAll(".templink").data(data);

        link.enter().append("path")
            .attr("class", "templink")
            .attr("d", d3.svg.diagonal())
            .attr('pointer-events', 'none');

        link.attr("d", d3.svg.diagonal());

        link.exit().remove();
    };

    // 重新定位节点
    function centerNode(source, which) {
        if (which === 3 ) {
            return;
        }
        scale = zoomListener.scale();
        var x = -source.y0;
        var y = -source.x0;
        x = x * scale + viewerWidth / 2;
        y = y * scale + viewerHeight / 2;
        d3.select('g').transition()
            .duration(duration)
            .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
        zoomListener.scale(scale);
        zoomListener.translate([x, y]);
    }

    function hideChildren(d){
        if (d.children) {
            d._children = d.children;
            d.children = null;
        }
    }

    function showChildren(d){
        if (d._children) {
            d.children = d._children;
            d._children = null;
        }
    }

    // Toggle children function
    function toggleChildren(d) {
        if (d.children) {
            hideChildren(d);
        } else if (d._children) {
            showChildren(d);
        }
        return d;
    }

    // 点击节点
    function click(d) {
        // if (d3.event && d3.event.defaultPrevented) return; // click suppressed
        if(d3.event.which == 3 || editServerTreeId) return;
        d = toggleChildren(d);
        update(d);
        centerNode(d, d3.event && d3.event.which);
    }
    

    // 更新
    function update(source) {
        // Compute the new height, function counts total children of root node and sets tree height accordingly.
        // This prevents the layout looking squashed when new nodes are made visible or looking sparse when nodes are removed
        // This makes the layout more consistent.
        var levelWidth = [1];
        var childCount = function(level, n) {
            if (n.children && n.children.length > 0) {
                if (levelWidth.length <= level + 1) levelWidth.push(0);

                levelWidth[level + 1] += n.children.length;
                n.children.forEach(function(d) {
                    childCount(level + 1, d);
                });
            }
        };
        childCount(0, root);
        
        var newHeight = d3.max(levelWidth) * linePx;
        tree = tree.size([newHeight, viewerWidth]);

        // Compute the new tree layout.
        var nodes = tree.nodes(root).reverse(),
            links = tree.links(nodes);

        // Set widths between levels based on maxLabelLength.
        nodes.forEach(function(d) {
            d.y = (d.depth * (maxLabelLength * 10)); //maxLabelLength * 10px
            // alternatively to keep a fixed scale one can set a fixed depth per level
            // Normalize for fixed-depth by commenting out below line
            // d.y = (d.depth * 500); //500px per level.
        });

        // Update the nodes…
        node = svgGroup.selectAll("g.node")
            .data(nodes, function(d) {
                return d.id || (d.id = ++i);
            });

            
        /* .enter()首次拼接节点元素begin  */
        // 绘制所有节点
        var nodeEnter = node.enter().append("g")
            .call(dragListener)  //绑定拖拽事件
            .attr("class", (data) => {
            　　return "node " + data.type || '';
            })
            .attr("transform", function(d) {
                return "translate(" + source.y0 + "," + source.x0 + ")";
            })
            .on('mousedown', function (d) {
                if (d3.event.which !== 3 || d.type != "server" ) { return; } //鼠标右键
                d3.event.stopPropagation();
                // if (editServerTreeId !== d.treeId) {
                    // fadeUneditServer(0.1)(d); // 隐藏未点击的节点
                    // editServerTreeId = d.treeId;
                    // document.querySelector('#chart-content').dispatchEvent(
                    //     new CustomEvent("editServer", { "detail": d.treeId, bubbles: true, cancelable: true})
                    // );
                    // editServerTreeId = d.treeId;
                    showToolTip(d.treeId);
                // } else {
                    // editServerTreeId = '';
                    // fadeUneditServer(1)();
                    // document.querySelector('#chart-content').dispatchEvent(
                    //     new CustomEvent("unEditServer")
                    // );
                // }
            })
            .on('click', click);

        // 公司样式
        nodeEnter.filter('.company').append("circle")
            .attr('class', 'shape')
            .attr("r", 10);

        // 集群样式
        nodeEnter.filter('.colony').append("rect")
            .attr('class', 'shape')
            .attr('x', -10)
            .attr('y', -10)
            .attr('width', 20)
            .attr('height', 20);

        // 服务器样式
        nodeEnter.filter('.server').append("circle")
            .attr('class', 'shape')
            .attr("r", 10)

        // 属性
        nodeEnter.filter('.attribute').append("circle")
            .attr('class', 'shape')
            .attr("r", 3);

        // 拼接显示名称
        nodeEnter.append("text")
            .attr("x", function(d) {
                return d.children || d._children ? -20 : 10;
            })
            .attr("dy", ".35em")
            .attr('class', 'nodeText')
            .attr("text-anchor", function(d) {
                return d.children || d._children ? "end" : "start";
            })
            .text(function(d) {
                return d.name;
            })
            .style("fill-opacity", 0);
            
        // 增加提示范围圈
        nodeEnter.filter('.colony').append("circle")
            .attr('class', 'ghostCircle')
            .attr("r", 30)
            .style("fill", "red")
            .attr("opacity", 0.1) // change this to zero to hide the target area
            .attr('pointer-events', 'mouseover')
            .on("mouseover", function(node) {
                overCircle(node);
            })
            .on("mouseout", function(node) {
                outCircle(node);
            });

        /* .enter()首次拼接节点元素end  */

        /* 设置修改样式 begin */
        // Update the text to reflect whether node has children or not.
        node.select('text')
            .attr("x", function(d) {
                return d.children || d._children ? -20 : 10;
            })
            .attr("text-anchor", function(d) {
                return d.children || d._children ? "end" : "start";
            })
            .text(function(d) {
                return d.name;
            });

        // 公司样式
        node.filter(".company").select('.shape')
            .style('stroke', '#eb5355')
            .style("fill", function(d) {
                return d._children ? "#ee6666" : "#fff";
            });

        // 集群样式
        node.filter(".colony").select('.shape')
            .style('stroke', '#5CA083')
            .style("fill", function(d) {
                return d._children ? "#7FBBA1" : "#fff";
            });

        // 服务器样式
        node.filter(".server").select('.shape')
            .style('stroke', '#2c8ba4')
            .style("fill", function(d) {
                return d._children ? "#2c8ba4" : "#fff";
            });
        /* 设置样式 end */

        /* 节点变动后转移各节点到新的位置begin */
        var nodeUpdate = node.transition()
            .duration(duration)
            .attr("transform", function(d) {
                return "translate(" + d.y + "," + d.x + ")";
            });

        // Fade the text in
        nodeUpdate.select("text")
            .style("fill-opacity", 1);

        // Transition exiting nodes to the parent's new position.
        var nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function(d) {
                return "translate(" + source.y + "," + source.x + ")";
            })
            .remove();

        // nodeExit.select("circle") //？？？？？？？？？？？？？
           // .attr("r", 0);

        nodeExit.select("text")
            .style("fill-opacity", 0);

        // Update the links…
        var link = svgGroup.selectAll("path.link")
            .data(links, function(d) {
                return d.target.id;
            });

        // Enter any new links at the parent's previous position.
        link.enter().insert("path", "g")
            .attr("class", "link")
            .attr("d", function(d) {
                var o = {
                    x: source.x0,
                    y: source.y0
                };
                return diagonal({
                    source: o,
                    target: o
                });
            });

        // Transition links to their new position.
        link.transition()
            .duration(duration)
            .attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
            .duration(duration)
            .attr("d", function(d) {
                var o = {
                    x: source.x,
                    y: source.y
                };
                return diagonal({
                    source: o,
                    target: o
                });
            })
            .remove();

        // Stash the old positions for transition.
        nodes.forEach(function(d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });
        /* 节点变动后转移各节点到新的位置begin */
    }
    
    // 
    var showToolTip = function (id) {
        $('#tree-tool-tip').css({'opacity':'1','top': d3.event.offsetY - 3,'left': d3.event.offsetX+ 10});
        $('#tree-tool-tip li').attr('data-id', id);
    }

    // 
    var hideToolTip = function (id) {
        $('#tree-tool-tip').css({'opacity':'0','top': -100,'left': -100});
        $('#tree-tool-tip li').attr('data-id', '');
    }

    //  隐藏未选中服务
    var fadeUneditServer = function(opacity) {
        return function() {
            svgGroup.selectAll(".node")
                .transition()
                .style("opacity", function (d) {
                    if (d.treeId === editServerTreeId || (d.parent && d.parent.treeId === editServerTreeId)){
                        return 1;
                    } else {
                        return opacity;
                    }
                });
        };
    };

    var editServerChart = function(currentNode) {
        editServerTreeId = currentNode.treeId;
        // if(currentNode.parent) {
        //   expand(currentNode.parent);
        //   update(root);
        // }
        centerNode(currentNode);
        fadeUneditServer(0.1)();
    };

    var unEditServerChart = function() {
        fadeUneditServer(1)();
        editServerTreeId = '';
    };

    var focusNode = function(originalNode) {
        // var currentNode = svgGroup.selectAll("g.node")
        //    .filter(function(d, i) {
        //        if (d.treeId == treeId) {
        //            return true;
        //        }
        //        return false;
        //    });
        centerNode(originalNode);
    }

    chart.focusNode = focusNode;

    chart.unEditServerChart = unEditServerChart;

    chart.editServerChart = editServerChart;

    chart.diameter = function(value) {
        if (!arguments.length) return viewerWidth;
        viewerWidth = value;
        return chart;
    };

    chart.data = function(value) {
        if (!arguments.length) return treeData;
        treeData = value;
        return chart;
    };

    chart.fiterNameChange = function(currentNode) {
        click(currentNode);
    }

    return chart;
};
