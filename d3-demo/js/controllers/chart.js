angular.module('ChartsApp').controller('chartCtrl', function ($scope, bus) {
    'use strict';

    var container = angular.element(document.querySelector('#chart-content'));
    $scope.node = {};

    bus.on('updateData', function(data) {
        $scope.data = angular.copy(data);
    });

    $scope.deleteServer = function(treeId) {
        $scope.node = {};
        bus.emit('unEditChart');
        alert ("删除：" + treeId);
    };

    $scope.editNode = function(treeId) {
        alert ("更新：" + treeId);
    };

    $scope.addNode = function(treeId) {
        alert ("新增");
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
            $scope.node = {};
            $scope.$digest();
         });;

    var getNodeByTreeId = function(treeId, data) {
        if (data.treeId === treeId) {
            return data;
        }
        if (!data.children) return null;
        for (var i = data.children.length - 1; i >= 0; i--) {
            var matchingNode = getNodeByTreeId(treeId, data.children[i]);
            if (matchingNode) return matchingNode;
        }
    };
});
