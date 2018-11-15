import echarts from 'echarts';
import {mapState} from 'vuex';

export default {
  data () {
    return {
      period: ['2016-01-01', '2016-02-15'],
      groupName: '1',
      isFullScreen: false,
      groupList: [{
        value: '1',
        label: '运行调度室'
      }, {
        value: '2',
        label: '400'
      }, {
        value: '3',
        label: '390'
      }, {
        value: '4',
        label: '安全室'
      }],
      restaurants: [],
      state3: '',
      viewData: [],
      categories: [
        {
          name: '招行'
        },
        {
          name: '室组'
        },
        {
          name: '原因'
        },
        {
          name: '责任人'
        }
      ],
      data: [
        {
          id: 0,
          name: '招行',
          symbol: 'diamond',
          category: 0,
          draggable: false,
          des: '',
          x: 500,
          y: 300,
          fixed: true,
          symbolSize: 80
        }
      ],
      links: [
        {
          source: 0,
          target: 1,
          name: '室组',
          des: ''
        }
      ],
      myChart: null
    };
  },
  methods: {
    _getMyTool () {
      let ths = this;
      let theme = ths.$store.state.isThemeDark ? '_dark.png' : '_light.png';

      return {
        show: true,
        title: ths.isFullScreen ? '切换为全屏' : '退出全屏',
        icon: ths.isFullScreen ? 'image://static/img/outscreen' + theme : 'image://static/img/fullscreen' + theme,
        onclick: function () {
          let option = ths.myChart.getOption();

          ths.isFullScreen = !ths.isFullScreen;
          option.toolbox[0].feature.myTool = ths._getMyTool(ths.isFullScreen);
          // let option = ths._getOptions(ths.categories, ths.data, ths.links);
          ths.$nextTick(function () {
            ths.$refs.relationChart.innerHTML = '';
            ths.$refs.relationChart.removeAttribute('_echarts_instance_');
            ths.$refs.relationChart.removeAttribute('style');
            ths.myChart = echarts.init(ths.$refs.relationChart);
            ths.myChart.setOption(option);
            ths._bindEvent();
          }, 500);
        }
      };
    },
    getLinks () {
      var links = [
        {
          source: 0,
          target: 1,
          name: '室组',
          des: ''
        },
        {
          source: 0,
          target: 2,
          name: '室组',
          des: ''
        },
        {
          source: 0,
          target: 3,
          name: '室组',
          des: ''
        },
        {
          source: 0,
          target: 4,
          name: '室组',
          des: ''
        },
        {
          source: 0,
          target: 5,
          name: '室组',
          des: ''
        },
        {
          source: 1,
          target: 6,
          name: '原因',
          des: ''
        },
        {
          source: 1,
          target: 7,
          name: '原因',
          des: ''
        },
        {
          source: 1,
          target: 8,
          name: '原因',
          des: ''
        },
        {
          source: 1,
          target: 9,
          name: '原因',
          des: ''
        },
        {
          source: 2,
          target: 10,
          name: '原因',
          des: ''
        },
        {
          source: 6,
          target: 11,
          name: '原因',
          des: ''
        },
        {
          source: 4,
          target: 12,
          name: '原因',
          des: ''
        },
        {
          source: 5,
          target: 13,
          name: '原因',
          des: ''
        },
        {
          source: 8,
          target: 14,
          name: '责任人',
          des: ''
        },
        {
          source: 9,
          target: 14,
          name: '责任人',
          des: ''
        },
        {
          source: 13,
          target: 14,
          name: '责任人',
          des: ''
        },
        {
          source: 12,
          target: 15,
          name: '责任人',
          des: ''
        },
        {
          source: 12,
          target: 14,
          name: '责任人',
          des: ''
        },
        {
          source: 7,
          target: 17,
          name: '责任人',
          des: ''
        },
        {
          source: 8,
          target: 16,
          name: '责任人',
          des: ''
        },
        {
          source: 9,
          target: 17,
          name: '责任人',
          des: ''
        }
      ];

      return links;
    },
    getData () {
      var option = [
        {
          id: 0,
          name: '招行',
          symbol: 'diamond',
          category: 0,
          fixed: true,
          x: 500,
          y: 300,
          des: '',
          symbolSize: 80
        },
        {
          id: 1,
          name: '运行调度室',
          category: 1,
          symbol: 'diamond',
          des: '',
          symbolSize: 60
        },
        {
          id: 2,
          name: '400',
          symbol: 'diamond',
          category: 1,
          des: '',
          symbolSize: 60
        },
        {
          id: 3,
          name: '390',
          symbol: 'diamond',
          category: 1,
          des: '',
          symbolSize: 60
        },
        {
          id: 4,
          name: '网络室',
          symbol: 'diamond',
          category: 1,
          des: '',
          symbolSize: 60
        },
        {
          id: 5,
          name: '安全室',
          symbol: 'diamond',
          category: 1,
          des: '',
          symbolSize: 60
        },
        {
          id: 6,
          name: '原因',
          category: 2,
          des: '6',
          symbolSize: 60
        },
        {
          id: 7,
          name: '原因',
          category: 2,
          des: '7',
          symbolSize: 60
        },
        {
          id: 8,
          name: '原因',
          category: 2,
          des: '8',
          symbolSize: 60
        },
        {
          id: 9,
          name: '原因',
          category: 2,
          des: '9',
          symbolSize: 60
        },
        {
          id: 10,
          name: '原因',
          category: 2,
          des: '10',
          symbolSize: 60
        },
        {
          id: 11,
          name: '原因',
          category: 2,
          des: '11',
          symbolSize: 60
        },
        {
          id: 12,
          name: '原因',
          category: 2,
          des: '12',
          symbolSize: 60
        },
        {
          id: 13,
          name: '原因',
          category: 2,
          des: '13',
          symbolSize: 60
        },
        {
          id: 14,
          name: '小明',
          category: 3,
          des: '14',
          symbolSize: 40
        },
        {
          id: 15,
          name: 'X名',
          category: 3,
          des: '15',
          symbolSize: 40
        },
        {
          id: 16,
          name: 'X华',
          category: 3,
          des: '16',
          symbolSize: 40
        },
        {
          id: 17,
          name: '张晓',
          category: 3,
          des: '17',
          symbolSize: 40
        }
      ];

      return option;
    },
    _getOptions (categories, viewData, links) {
      let ths = this;
      let isThemeDark = ths.$store.state.isThemeDark;

      return {
        title: {
          text: '事件拓扑图',
          show: false,
          padding: 10,
          textStyle: {
            color: isThemeDark ? '#ffffff' : '#333',
            subtextStyle: {
              color: isThemeDark ? '#ffffff' : '#333'
            }
          }
        },
        backgroundColor: {
          type: 'radial',
          x: 0.5,
          y: 0.7,
          r: 1,
          colorStops: [{
            offset: 0, color: isThemeDark ? '#2065ac' : '#ffffff'
          }, {
            offset: 1, color: isThemeDark ? '#153c70' : '#ffffff'
          }],
          globalCoord: false
        },
        toolbox: {
          show: true,
          iconStyle: {
            borderColor: isThemeDark ? '#ffffff' : '#333'
          },
          feature: {
            myTool: ths._getMyTool(),
            restore: {},
            saveAsImage: {}
          }
        },
        color: ['#67c23a', '#e6a23c', '#f56c6c', '#03B9FF', '#8c6ac4', '#f3a43b', '#26c0c0', '#e01f54', '#b5c334', '#fe8463', '#9bca63', '#fad860'],
        tooltip: {
          formatter: function (x) {
            return x.data.des;
          }
        },
        legend: [{
          type: 'plain',
          padding: [10, 0, 0, 0],
          // selectedMode: 'single',
          data: ths.categories.map(function (a) {
            return {
              name: a.name
            };
          }),
          textStyle: {
            color: isThemeDark ? '#ffffff' : '#333'
          }
        }],
        series: [
          {
            type: 'graph',
            layout: 'force',
            roam: true,
            hoverAnimation: false,
            focusNodeAdjacency: false,
            symbol: 'circle',
            symbolSize: 80,
            edgeSymbol: ['circle', 'arrow'],
            edgeSymbolSize: [4, 10],
            draggable: true,
            force: {
              repulsion: 1000,
              gravity: 0,
              edgeLength: [50, 100]
            },
            itemStyle: {
              normal: {
                borderColor: 'rgba(255,255,255, 1)',
                borderWidth: 1
              }
            },
            lineStyle: {
              width: 2,
              color: 'target',
              shadowBlur: 0,
              opacity: 1,
              curveness: 0
            },
            edgeLabel: {
              normal: {
                textStyle: {
                  color: '#529ff5',
                  fontSize: 12
                },
                show: true,
                formatter: function (x) {
                  return x.data.name;
                }
              }
            },
            emphasis: {
              itemStyle: {
                borderWidth: 3,
                borderColor: 'rgba(255,255,255, 0.8)'
              },
              lineStyle: {
                width: 3
              }
            },
            label: {
              normal: {
                color: isThemeDark ? '#ffffff' : '#333',
                show: true
              }
            },
            categories: categories,
            data: viewData,
            links: links
          }
        ]
      };
    },
    _bindEvent () {
      let ths = this;

      ths.myChart.on('mouseup', function (p) {
        if (p.data.category !== 0) {
          p.data.fixed = true;
          p.data.x = p.event.offsetX;
          p.data.y = p.event.offsetY;
          ths.myChart.setOption(ths.myChart.getOption());
        }
      });

      ths.myChart.on('dblClick', function (p) {
        if (p.data.value) {
          p.data.value = false;
          ths.myChart.setOption(ths.myChart.getOption());
        } else {
          p.data.value = true;
          // ths.myChart.setOption(ths.myChart.getOption());
          ths.myChart.setOption(ths._getOptions(ths.categories, ths.getData(), ths.getLinks()));
        }
      });
    }
  },
  mounted () {
    let ths = this;

    // ths.data = ths.getData();
    // ths.links = ths.getLinks();
    ths.myChart = echarts.init(this.$refs.relationChart);
    ths.myChart.setOption(ths._getOptions(ths.categories, ths.data, ths.links));
    ths._bindEvent();
  },
  computed: {
    listenStageTheme () {
      return this.$store.state.isThemeDark;
    }
  },
  watch: {
    listenStageTheme: function (oldValue, newValue) {
      let ths = this;

      ths.myChart.setOption(ths._getOptions(ths.categories, ths.data, ths.links), true);
    }
  }
};
