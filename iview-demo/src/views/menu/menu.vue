<template> <!-- 首页头部 -->
  <div class="menu">
    <span class="expansion" @click="expanMenu"><Icon size="20" :type="showMenu ? 'ios-arrow-back' : 'ios-arrow-forward'" /></span>
    <transition name="fade">
      <Menu :active-name="$route.name.split('.')[0]" width="160px" v-show="showMenu" transiton="fade">
          <MenuItem name="eventList" to="/eventList">
            <Icon type="ios-medkit-outline" size="16"/>
            事件列表
          </MenuItem>
          <MenuItem name="eventTrend" to="/eventTrend">
            <Icon type="md-analytics" size="16"/>
            趋势图
          </MenuItem>
          <MenuItem name="eventRelation" to="/eventRelation">
            <Icon type="md-chatbubbles" size="16"/>
            拓扑图
          </MenuItem>
      </Menu>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data () {
    return {
      showMenu: true
    };
  },
  methods: {
    expanMenu: function () {
      this.showMenu = !this.showMenu;
    }
  }
};
</script>

<style lang="stylus" scoped>
  .menu {
    position: relative;
    display: inline-block;
    padding-top: 10px;
    height: calc(100vh - 55px);
    .fade-enter-active, .fade-leave-active {
      margin-left: 0px;
      transition: all 0.3s
    }
    .fade-enter, .fade-leave-active {
      margin-left: -160px;
      opacity: 0;
    }
    .expansion {
      position: absolute;
      right: -15px;
      text-align: center;
      top: 50%;
      display: inline-block;
      width: 15px;
      line-height: 60px;
      height: 60px;
      cursor: pointer;
      z-index: 1000;
      .ivu-icon {
        width: 100%;  
      }
    }
  }
  body.theme-dark {
    .menu {
      background: #1a4372;
    }
    .expansion {
      color: #f4f5f7;
      background: #0e2c4c;
    }
  }
  body.theme-light {
    .ivu-menu-light {
      background: #f1f4fa;
      &.ivu-menu-vertical {
        .ivu-menu-item-active:not(.ivu-menu-submenu), .ivu-menu-item:hover, .ivu-menu-submenu-title:hover {
          background: #fff;
          color: #3883f8;
        }
      }
    }
    .menu {
      background: #f1f4fa;
    }
    .expansion {
      color: #3883f8;
      background: #f1f4fa;
    }
  }
</style>
