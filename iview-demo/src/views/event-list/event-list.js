import api from 'api/index';

export default {
  data () {
    return {
      social: ['facebook', 'github'],
      lever: ['L1', 'L2', 'L3', 'L4', 'L5'],
      showImportModal: false,
      columnObject: [],
      seleColumnList: ['事件编号', '事件名称'],
      formItem: {
        c12: '',
        date: '',
        c14: '',
        c3: ['L5'],
        c27: '',
        c29: ''
      },
      columnsList: [],
      dataList: [
        {
          c1: 'NO23412341234123',
          c2: 18,
          c3: 'L2',
          c4: 'America',
          c5: 'New York',
          c6: 100000
        },
        {
          c1: 'NO23412341234123',
          c2: 18,
          c3: 'L3',
          c4: 'America',
          c5: 'New York',
          c6: 100000
        }
      ]
    };
  },
  created () {
    let ths = this;

    ths.columnObject = ths._initColumn();
    ths.columnsList = ths._getColumnList();
  },
  methods: {
    exportTableList () {
      api.exportTableListDemo().then((res) => {
        console.log(res);
      });
    },
    rowClassName (row, index) {
      return 'demo-table-info-row';
    },
    importCancel () {
      this.$Message.info('importCancel');
    },
    importConfirm () {
      this.$Message.info('importConfirm');
    },
    _getColumnList () {
      let ths = this;
      let result = [];

      for (let i = 0; i < ths.columnObject.length; i++) {
        let list = ths.columnObject[i].list;

        for (let j = 0; j < list.length; j++) {
          result.push(list[j]);
        }
      }
      result.push(
        {
          title: '操作',
          key: 'action',
          width: 100,
          fixed: 'right',
          align: 'center',
          render: (h, params) => {
            return h('Button', {
              props: {
                type: 'text',
                size: 'small'
              },
              class: 'edit-btn',
              on: {
                click: () => {
                  this.$router.push({path: '/eventList/eventEdit'});
                }
              }
            }, '编辑');
          }
        });
      return result;
    },
    _initColumn () {
      return [{
        category: '基本属性',
        list: [
          {
            title: '事件编号',
            width: 100,
            ellipsis: true,
            key: 'c1',
            fixed: 'left',
            checkDisabled: true
          },
          {
            title: '事件名称',
            width: 100,
            key: 'c2',
            fixed: 'left',
            checkDisabled: true
          },
          {
            title: '事件级别',
            width: 100,
            key: 'c3',
            fixed: 'left',
            render: (h, params) => {
              return h('span', {
                class: params.row.c3
              }, params.row.c3);
            }
          },
          {
            title: '发现时间',
            width: 100,
            key: 'c4',
            fixed: 'left'
          },
          {
            title: '发生时间',
            width: 100,
            key: 'c5'
          },
          {
            title: '定位时间',
            width: 100,
            key: 'c6'
          },
          {
            title: '业务影响时间',
            width: 120,
            key: 'c7'
          },
          {
            title: '事件登记人',
            width: 100,
            key: 'c8'
          },
          {
            title: '事件登记室组',
            width: 120,
            key: 'c9'
          },
          {
            title: '事件来源',
            width: 100,
            key: 'c10'
          },
          {
            title: '是否与开发有关',
            width: 120,
            key: 'c11'
          }
        ]
      },
      {
        category: '事件影响',
        list: [
          {
            title: '影响业务',
            width: 100,
            key: 'c12'
          },
          {
            title: '涉及系统top级别',
            width: 140,
            key: 'c13'
          },
          {
            title: '影响时长',
            width: 100,
            key: 'c14'
          },
          {
            title: '影响交易数',
            width: 100,
            key: 'c15'
          },
          {
            title: '影响系统可用率',
            width: 120,
            key: 'c16'
          },
          {
            title: '影响整体可用率',
            width: 120,
            key: 'c17'
          },
          {
            title: '影响性质',
            width: 100,
            key: 'c18'
          }
        ]
      },
      {
        category: '处理过程',
        list: [
          {
            title: '事件描述',
            width: 100,
            key: 'c19'
          },
          {
            title: '监控描述',
            width: 100,
            key: 'c20'
          },
          {
            title: '监控是否告警',
            width: 120,
            key: 'c21'
          },
          {
            title: '监控应报警内容',
            width: 120,
            key: 'c22'
          },
          {
            title: '处理过程',
            width: 100,
            key: 'c23'
          },
          {
            title: '应急操作',
            width: 100,
            key: 'c24'
          },
          {
            title: '处理人员',
            width: 100,
            key: 'c25'
          },
          {
            title: '处理室组',
            width: 100,
            key: 'c26'
          }
        ]
      }, {
        category: '事件原因',
        list: [
          {
            title: '引发原因',
            width: 100,
            key: 'c27'
          },
          {
            title: '根本原因',
            width: 100,
            key: 'c28'
          },
          {
            title: '原因团队',
            width: 100,
            key: 'c29'
          },
          {
            title: '原因个人',
            width: 100,
            key: 'c30'
          },
          {
            title: '原因占比',
            width: 100,
            key: 'c31'
          },
          {
            title: '涉及变更ID',
            width: 120,
            key: 'c32'
          },
          {
            title: '涉及变更类别',
            width: 120,
            key: 'c33'
          },
          {
            title: '涉及变更内容',
            width: 120,
            key: 'c34'
          },
          {
            title: '涉及变更人员',
            width: 120,
            key: 'c35'
          },
          {
            title: '原因分析',
            width: 100,
            key: 'c36'
          }
        ]
      }, {
        category: '整改措施',
        list: [
          {
            title: '整改类别',
            width: 100,
            key: 'c37'
          },
          {
            title: '整改措施',
            width: 100,
            key: 'c38'
          },
          {
            title: '责任人',
            width: 100,
            key: 'c39'
          },
          {
            title: '计划完成时间',
            width: 120,
            key: 'c40'
          },
          {
            title: '进展情况',
            width: 100,
            key: 'c41'
          },
          {
            title: '会签意见和情况',
            width: 120,
            key: 'c42'
          },
          {
            title: '反映共性问题',
            width: 120,
            key: 'c43'
          },
          {
            title: '改进方式',
            width: 100,
            key: 'c44'
          },
          {
            title: '说明',
            width: 100,
            key: 'c45'
          },
          {
            title: '最新状态',
            width: 100,
            key: 'c46'
          }
        ]
      }];
    }
  }
};
