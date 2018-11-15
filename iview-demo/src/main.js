// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import Element from 'element-ui'; // 引入element-ui组件
import store from 'src/vuex/store.js';
import iView from 'iView';
import 'common/theme/index.less';
import 'common/stylus/index.styl';

Vue.config.productionTip = false;

Vue.use(iView, {
  transfer: true,
  size: 'small'
});
Vue.use(Element, {// 注册Element组件
  // i18n: (key, value) => i18n.t(key, value)
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: {App},
  template: '<App/>'
});
