// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from 'src/vuex/store.js';
import iView from 'iView';
import 'common/theme/index.less';
import 'common/stylus/index.styl';

Vue.config.productionTip = false;

Vue.use(iView, {
  transfer: true,
  size: 'small'
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: {App},
  template: '<App/>'
});
