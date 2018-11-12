<template>
  <div class="app">
    <template v-if="$route.name ==='login'">
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </template>
    <template v-if="$route.name !=='login'">
      <c-header></c-header>
      <div class="main-contain">
        <c-menu></c-menu>
        <div class="contain-wrapper">
          <div class="rumb" v-if="$route.meta.length > 0">
            <Breadcrumb separator="<b class='demo-breadcrumb-separator'>></b>">
              <!-- <BreadcrumbItem :to="{path: '/manage'}">首页</BreadcrumbItem> -->
              <BreadcrumbItem v-for="(item, index) in $route.meta" :key="index" :to="item.to">{{item.label}}</BreadcrumbItem>
            </Breadcrumb>
          </div>
          <router-view/>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import cHeader from 'views/header/header';
import cMenu from 'views/menu/menu';

export default {
  name: 'App',
  components: {
    cHeader,
    cMenu
  }
};
</script>

<style lang="stylus" scoped>
.app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  height: 100%;
  width: 100%;
  .main-contain {
    display: flex;
    text-align: left;
    padding-top: 55px;
    font-size: 0px;
    .contain-wrapper {
      position: relative;
      display: flex;
      flex-direction: column;
      width: calc(100vw - 160px);
      vertical-align: top;
      padding-left: 24px;
      font-size: 14px;
      min-height: 300px;
      height: calc(100vh - 55px);
      .rumb {
        height: 40px;
        line-height: 40px;
        .ivu-breadcrumb {
          color: #acb3bf;
        }
      }
    }
  }
}
body.theme-dark {
  .app {
    .contain-wrapper {
    }
  }
}
body.theme-light {
  .app {
    .contain-wrapper {
      background: #FFFFFF;
    }
  }
}
</style>
