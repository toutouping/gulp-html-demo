angular.module('ChartsApp').directive('treeChart', function(bus) {
    'use strict';

    return {
        restrict: 'E',
        replace: true,
        template: '<div id="tree-container"></div>',
        scope:{
            data: '='
        },
        link: function(scope, element) {
            var chart = d3.chart.d3Tree();

            scope.$watch("data", function(data) {
                if (typeof (data) === 'undefined') {
                    return;
                }

                chart.diameter($(document).width() - 300).data(scope.data);
               
                d3.select(element[0])
                    .call(chart);
            });

            bus.on('focusNode', function(originalNode) {
                chart.focusNode(originalNode);
            });

            bus.on('editServerChart', function(currentNode) {
                chart.editServerChart(currentNode);
            });

            bus.on('unEditServerChart', function() {
                chart.unEditServerChart();
            });

            bus.on('fiterNameChange', function(nameFilter) {
                chart.fiterNameChange(nameFilter);
            });
        }
    };
});
