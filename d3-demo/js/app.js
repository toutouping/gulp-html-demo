angular.module('ChartsApp', [])
    .run(function(data) {
        // 阻止浏览器右键菜单
        document.oncontextmenu = function () {
            return false
        }
        
        // 绑定数据到拓扑试图
        data.fetchJsonData().then(function (response) {
            console.log('data loaded');
        }, console.error);
    });
