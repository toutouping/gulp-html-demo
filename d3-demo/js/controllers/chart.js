angular.module('ChartsApp').controller('chartCtrl', function ($scope,$window, bus, data) {
    'use strict';

    var container = angular.element(document.querySelector('#chart-content'));
    $scope.node = {};

    bus.on('updateData', function(data) {
        $scope.data = angular.copy(data);
    });

    $scope.filter = {
        filterName : ''
    };

    // 过滤搜索
    $scope.fiterNameChange = function() {
        var currentNode = null;
        if($scope.data.children && $scope.data.children.length > 0) {
            for(var i =0; i<$scope.data.children.length; i ++) {
                var tempList = null;
                if($scope.data.children[i]._children) {
                    for(var j =0; j<$scope.data.children[i]._children.length; j ++) {
                        var node = $scope.data.children[i]._children[j];
                        if($scope.filter.filterName === node.name) {
                            currentNode = node;
                        }
                    }
                }else {
                    for(var j =0; j<$scope.data.children[i].children.length; j ++) {
                        var node = $scope.data.children[i].children[j];
                        if($scope.filter.filterName === node.name) {
                            currentNode = node;
                        }
                    }
                }
            }
            if(currentNode) {
                // bus.emit('fiterNameChange', currentNode);
                $scope.originalNode = getNodeByTreeId(currentNode.treeId, $scope.data);
                $scope.node = formatNodeAttr($scope.originalNode);
                bus.emit('editServerChart', currentNode); // 至灰非编辑界面
            }else{
                $scope.node = null;
                bus.emit('unEditServerChart');
            }
        }
    };

    // 取消服务编辑
    $scope.cancelEditServer = function(treeId) {
        $scope.filter.filterName = '';
        $scope.node = {};
        bus.emit('unEditServerChart');
    };

    // 编辑服务器
    $scope.editNode = function(treeId, $event) {
        $event.preventDefault();
        var originalNode = getNodeByTreeId(treeId, $scope.data);
        var temNode = {
            children : [
                {name: $scope.node.product, type: "product"},
                {name: $scope.node.cpu, type: "cpu"},
                {name: $scope.node.mainBoard, type: "mainBoard"},
                {name: $scope.node.memory, type: "memory"},
            ],
            name: $scope.node.name,
            treeId: $scope.node.treeId,
            type: $scope.node.type
        };
        data.updateNodeById(treeId, temNode);
        $scope.node = {};
        data.emitRefresh();
       // focusNode(originalNode);
    };

    function focusNode(originalNode) {
        bus.emit('focusNode', originalNode);
    }

    $scope.addNode = function(treeId) {
        alert ("新增");
    }

    // 跳转至编辑服务界面
    $scope.toEditServer = function (event) {
        var treeId = $(event.currentTarget).attr('data-id');
        if (!treeId) {
            return;
        }
        $scope.originalNode = getNodeByTreeId(treeId, $scope.data);
        $scope.node = formatNodeAttr($scope.originalNode);
        bus.emit('editServerChart', $scope.originalNode); // 至灰非编辑界面
    }

    // 删除服务
    $scope.deleteServer = function (event, treeId) {
        if (!$window.confirm('Are you sure you want to delete that node?')) return;
        $scope.filter.filterName = '';
        $scope.node = {};
        data.removeNodeById($(event.currentTarget).attr('data-id') || treeId);
        data.emitRefresh();
    }

    var getEditServer = function(treeId) {
        $scope.originalNode = getNodeByTreeId(treeId, $scope.data);
        // $scope.parentNode = getParentNodeByTreeId();
        // var node = $scope.copy($scope.originalNode);
        // node.parentId = parentNode.treeId;
        $scope.node = formatNodeAttr($scope.originalNode);
    };

    var formatNodeAttr = function (attr) {
        var returnObj = {
            // parentId: attr.parentId,
            treeId: attr.treeId,
            name: attr.name,
            type: attr.type
        };

        var children = attr.children || attr._children;

        for (var i = 0; i < children.length; i ++) {
            var tempObj = children[i];
            switch (tempObj.type) {
                case "product":
                    returnObj.product = tempObj.name;
                    break;
                case "cpu":
                    returnObj.cpu = tempObj.name;
                    break;
                case "mainBoard":
                    returnObj.mainBoard = tempObj.name;
                    break;
                case "memory":
                    returnObj.memory = tempObj.name;
                    break;
            }
        }
        return returnObj;
    };

    var getParentNodeByTreeId = function(treeId, data) {
        data = data || jsonData;
        if (!data.children) return null;
        for (var i = data.children.length - 1; i >= 0; i--) {
            if (data.children[i].treeId === treeId) return data;
            var matchingNode = getParentNodeByTreeId(treeId, data.children[i]);
            if (matchingNode) return matchingNode;
        }
    };

    // Events
    container
        .on('editServer', function(event) { // 节点右键事件
           var editServerId = event.originalEvent && event.originalEvent.detail;
           getEditServer(editServerId);
           $scope.$digest();
        })
        .on('unEditServer', function(event) { // 节点右键事件
            $scope.filter.filterName = '';
            $scope.node = {};
            $scope.$digest();
         });;

    var getNodeByTreeId = function(treeId, data) {
        if (data.treeId === treeId) {
            return data;
        }
        if (!data.children && !data._children) return null;
        
        if (data.children) {
            for (var i = data.children.length - 1; i >= 0; i--) {
                var matchingNode = getNodeByTreeId(treeId, data.children[i]);
                if (matchingNode) return matchingNode;
            }
        }else {
            for (var i = data._children.length - 1; i >= 0; i--) {
                var matchingNode = getNodeByTreeId(treeId, data._children[i]);
                if (matchingNode) return matchingNode;
            }
        }
    };

    $(document).ready(function () {
        $(document).on("mousedown", function () {
            $('#tree-tool-tip').css({'opacity':'0','top': -100,'left': -100});
            $('#tree-tool-tip li').attr('data-id', '');
        });
    })
});
