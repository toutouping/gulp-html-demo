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
      option: null,
      trendChard: null
    };
  },
  mounted () {
    let ths = this;

    ths.myChart = echarts.init(this.$refs.trendChart);
    ths.option = ths._getOptions();
    ths.myChart.setOption(ths.option);
  },
  computed: {
    listenStageTheme () {
      return this.$store.state.isThemeDark;
    }
  },
  watch: {
    listenStageTheme: function (oldValue, newValue) {
      let ths = this;

      ths.option = ths._getOptions();
      ths.myChart.setOption(ths.option, true);
    }
  },
  methods: {
    _getMyTool (isFullScreen) {
      let ths = this;
      let theme = ths.$store.state.isThemeDark ? '_dark.png' : '_light.png';

      return {
        show: true,
        title: isFullScreen ? '切换为全屏' : '退出全屏',
        icon: isFullScreen ? 'image://static/img/outscreen' + theme : 'image://static/img/fullscreen' + theme,
        onclick: function () {
          ths.isFullScreen = !ths.isFullScreen;
          ths.option = ths.myChart.getOption();
          ths.option.toolbox[0].feature.myTool = ths._getMyTool(ths.isFullScreen);
          ths.$nextTick(function () {
            ths.myChart = null;
            ths.$refs.trendChart.innerHTML = '';
            ths.$refs.trendChart.removeAttribute('_echarts_instance_');
            ths.$refs.trendChart.removeAttribute('style');
            ths.myChart = echarts.init(ths.$refs.trendChart);
            ths.myChart.setOption(ths.option);
          }, 500);
        }
      };
    },
    _getOptions () {
      let ths = this;
      let isThemeDark = ths.$store.state.isThemeDark;

      return {
        title: {
          show: false
        },
        grid: {
          show: false
        },
        legend: [{
          type: 'plain',
          padding: [10, 0, 0, 0],
          textStyle: {
            color: isThemeDark ? '#ffffff' : '#333'
          }
        }],
        tooltip: {
          trigger: 'axis'
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
            myTool: ths._getMyTool(ths.isFullScreen),
            magicType: {
              type: ['line', 'bar']
            },
            saveAsImage: {}
          }
        },
        color: ['#67c23a', '#e6a23c', '#f56c6c', '#03B9FF', '#8c6ac4', '#f3a43b', '#26c0c0', '#e01f54', '#b5c334', '#fe8463', '#9bca63', '#fad860'],
        xAxis: {
          type: 'category',
          name: '时间/月',
          axisLine: {
            lineStyle: {
              color: isThemeDark ? '#ffffff' : '#333'
            }
          },
          axisLabel: {
            textStyle: {
              color: isThemeDark ? '#ffffff' : '#333'
            }
          },
          data: ['201801', '201802', '201803', '201804', '201805', '201806', '201807', '201808', '201809', '2018010', '2018011', '2018012']
        },
        yAxis: {
          type: 'value',
          name: '事件量/个',
          axisLine: {
            lineStyle: {
              color: isThemeDark ? '#ffffff' : '#333'
            }
          },
          splitLine: {
            lineStyle: {
              color: ['#41a4e2']
            }
          },
          axisLabel: {
            textStyle: {
              color: isThemeDark ? '#ffffff' : '#333'
            }
          }
        },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 100
          }
        ],
        series: [{
          name: '运行调度室',
          barMaxWidth: 30,
          data: [200, 150, 80, 120, 150, 80, 70, 110, 130, 200, 70, 130],
          type: 'bar'
        },
        {
          name: '400',
          barMaxWidth: 30,
          data: [120, 200, 150, 80, 80, 70, 70, 110, 130, 200, 150, 130],
          type: 'bar'
        },
        {
          name: '390',
          barMaxWidth: 30,
          data: [200, 150, 80, 70, 110, 130, 200, 120, 150, 80, 70, 130],
          type: 'bar'
        }]
      };
    }
  }
};
