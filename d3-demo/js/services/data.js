

angular.module('ChartsApp').service('data', function ($http, $q, bus) {
    'use strict';

    var jsonData;

    /**
     * 从json文件中获取数据
     * @returns {Promise}
     */
    var fetchJsonData = function () {
        if (typeof (jsonData) !== 'undefined') {
            return $q.when(jsonData);
        }

        return $http.get("data3.json").success(function(data) {
            setJsonData(data);
            return data;
        });
    };

    var emitRefresh = function() {
        bus.emit('updateData', jsonData);
    };

    /**
     * Get the tree object
     */
    var getJsonData = function () {
        return jsonData;
    };

    /**
     * Set the tree object
     */
    var setJsonData = function (data) {
        jsonData = data;
        emitRefresh();
    };

    /**
     * 根据节点名称获取节点数据
     * @param {*} name 
     * @param {*} data 
     */
    var getNodeByName = function(name, data) {
        data = data || jsonData;
        if (data.name === name) {
            return data;
        }
        if (!data.children) return null;
        for (var i = data.children.length - 1; i >= 0; i--) {
            var matchingNode = getNodeByName(name, data.children[i]);
            if (matchingNode) return matchingNode;
        }
    };

    /**
     * 根据节点名称获取父节点数据
     * @param {*} name 
     * @param {*} data 
     */
    var getParentNodeById = function(treeId, data) {
        data = data || jsonData;
        var child = data.children || data._children;
        if (!child) return null;
        for (var i = child.length - 1; i >= 0; i--) {
            if (child[i].treeId === treeId) return data;
            var matchingNode = getParentNodeById(treeId, child[i]);
            if (matchingNode) return matchingNode;
        }
    };

    /**
     * 根据节点名称获取父节点数据
     * @param {*} name 
     * @param {*} data 
     */
    var getParentNodeByName = function(name, data) {
        data = data || jsonData;
        if (!data.children) return null;
        for (var i = data.children.length - 1; i >= 0; i--) {
            if (data.children[i].name === name) return data;
            var matchingNode = getParentNodeByName(name, data.children[i]);
            if (matchingNode) return matchingNode;
        }
    };

    /**
     * 根据节点名称获取节点数据
     * @param {*} treeId 
     * @param {*} data 
     */
    var getNodeById = function(treeId, data) {
        data = data || jsonData;
        if (data.treeId === treeId) {
            return data;
        }
        if (!data.children && !data._children) return null;
        var child = data.children || data._children;
        for (var i = child.length - 1; i >= 0; i--) {
            var matchingNode = getNodeById(treeId, child[i]);
            if (matchingNode) return matchingNode;
        }
    };

    /**
     * 更新节点信息
     */
    var updateNodeById = function(treeId, updateNode) {
        var node = getNodeById(treeId);
        for (var i in updateNode) {
            if (updateNode.hasOwnProperty(i) && i !== 'children' && i !== '_children') {
                node[i] = updateNode[i];
            }
        }
    };
    /**
     * 更新依赖节点名称
     * @param {String} treeId
     * @param {String} newId
     * @param {Object} cursor
     */
    var updateDependenciesById = function(treeId, newId, cursor) {
        cursor = cursor || jsonData;

        updateNodeDependencyById(treeId, newId, cursor);
        var child = cursor.children || cursor._children;
        if(typeof(child) !== 'undefined' && child.length) {
            child.forEach(function (child) {
                updateDependenciesById(treeId, newId, child);
            });
        }
    };

    /**
     * 移除依赖节点
     */
    var removeDependenciesById = function(treeId) {
        updateDependenciesById(treeId);
    };


    /**
     * 更新或者移除依赖节点
     * @param {String} treeId
     * @param {String} newId
     * @param {Object} node
     */
    var updateNodeDependencyById = function(treeId, newId, node) {
        if (typeof(node.dependsOn) === 'undefined') {
            return;
        }
        var pos = node.dependsOn.indexOf(treeId);
        if (pos === -1) return;
        if (newId) {
            // rename dependency
            node.dependsOn[pos] = newId;
        } else {
            // remove dependency
            node.dependsOn.splice(pos, 1);
        }
    };

    /**
     * 更新或者移除依赖节点
     * @param {String} name
     * @param {String} newName
     * @param {Object} node
     */
    var updateNodeDependency = function(name, newName, node) {
        if (typeof(node.dependsOn) === 'undefined') {
            return;
        }
        var pos = node.dependsOn.indexOf(name);
        if (pos === -1) return;
        if (newName) {
            // rename dependency
            node.dependsOn[pos] = newName;
        } else {
            // remove dependency
            node.dependsOn.splice(pos, 1);
        }
    };

    /**
     * 增加子节点
     */
    var addNode = function(name, newNode) {
        newNode = newNode || { name: 'New node' };
        var node = getNodeByName(name);
        if (!node.children) {
            node.children = [];
        }
        node.children.push(newNode);
    };

    /**
     * 移除节点
     */
    var removeNodeById = function(treeId) {
        var parentNode = getParentNodeById(treeId);
        if (!parentNode) return false;

        if (!parentNode.children && !parentNode._children) return null;
        var childList = parentNode.children || parentNode._children;

        for (var i = 0, length = childList.length; i < length; i++) {
            var child = childList[i];
            if (child.treeId === treeId) {
                // we're in the final Node
                // remove the node (and children) from dependencies
                 getBranchIds(child).map(updateDependenciesById);
                // remove the node
                if(parentNode.children) {
                    return parentNode.children.splice(i, 1);
                }else{
                    return parentNode._children.splice(i, 1);
                }
                
            }
        }
    };

    /**
     * 移除节点
     */
    var removeNode = function(name) {
        var parentNode = getParentNodeByName(name);
        if (!parentNode) return false;
        for (var i = 0, length = parentNode.children.length; i < length; i++) {
            var child = parentNode.children[i];
            if (child.name === name) {
                // we're in the final Node
                // remove the node (and children) from dependencies
                getBranchNames(child).map(removeDependencies);
                // remove the node
                return parentNode.children.splice(i, 1);
            }
        }
    };

    /**
     * 移动节点
     */
    var moveNode = function(nodeName, newParentNodeName) {
        var removedNodes = removeNode(nodeName);
        if (!removedNodes || removedNodes.length === 0) return false;
        addNode(newParentNodeName, removedNodes[0]);
    };

    
    /**
     * 根据节点名称获取节点集合
     */
    var getBranchIds = function(node) {
        var ids = [node.treeId];
        var child = node.children || node._children;
        if (child) {
            child.forEach(function(child) {
                ids = ids.concat(getBranchIds(child));
            });
        }
        return ids;
    };

    /**
     * 根据节点名称获取节点集合
     */
    var getBranchNames = function(node) {
        var names = [node.name];
        if (node.children) {
            node.children.forEach(function(child) {
                names = names.concat(getBranchNames(child));
            });
        }
        return names;
    };

    return {
        fetchJsonData: fetchJsonData,
        updateNodeById: updateNodeById,
        removeNodeById: removeNodeById,
        getJsonData: getJsonData,
        setJsonData: setJsonData,
        emitRefresh: emitRefresh,
        getNodeByName: getNodeByName,
        addNode: addNode,
        removeNode: removeNode,
        moveNode: moveNode
    };
});
