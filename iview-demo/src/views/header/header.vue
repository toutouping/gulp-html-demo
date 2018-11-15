<template> <!-- 首页头部 -->
  <header class="header">
    <a href="" class="logo-content">事件管理平台</a>
    <div class="user">
      <Dropdown>
        <a href="javascript:void(0)">
          <Icon type="ios-contact" size="22" class="icon"/>{{getLoginUser.userName}}<Icon type="ios-arrow-down" class="icon"></Icon>
        </a>
        <DropdownMenu slot="list">
          <DropdownItem @click.native="changeSkin" name="chageSkin"><Icon type="ios-shirt-outline" size="18" style="margin-right: 5px" />皮肤切换</DropdownItem>
          <DropdownItem @click.native="logout" name="logOut"><Icon type="ios-log-out" size="18" style="margin-right: 5px" />退出</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  </header>
</template>

<script type="text/ecmascript-6">
  import store from 'src/vuex/store.js';
  import {mapActions, mapGetters} from 'vuex';

  export default {
    data () {
      return {
        themeDark: store.state.isThemeDark,
        showMenuFlag: true,
        loginUser: null
      };
    },
    mounted () {
    },
    computed: {
      ...mapGetters([
        'getLoginUser'
      ])
    },
    methods: {
      ...mapActions([
        'saveLoginUser',
        'saveIsThemeDark'
      ]),
      logout () {
        this.saveLoginUser({});
        this.$router.push({path: '/login'});
      },
      changeSkin () {
        this.themeDark = !this.themeDark;
        this.saveIsThemeDark(this.themeDark);
        document.body.className = this.themeDark ? 'theme-dark' : 'theme-light';
      }
    }
  };
</script>

<style lang="stylus" scoped>
  .header {
    position: fixed;
    text-align: left;
    top: 0;
    z-index: 1020;
    box-sizing: border-box;
    padding: 0 20px;
    width: 100%;
    height: 55px;
    line-height: 55px;
    background: #245893;
    box-shadow: 0 0 15px #1c385e;
    .logo-content {
      font-size: 18px;
      color: #f9f9f9;
      font-weight: bold;
      text-decoration: none;
      .logo {
        margin-right: 5px;
      }
    }
    .user {
      position: absolute;
      top: 0px;
      right: 30px;
      height: 55px;
      line-height: 55px;
      .icon {
        padding: 0 5px;  
      }
    }
  }
</style>
