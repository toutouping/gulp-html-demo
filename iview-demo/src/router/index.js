import Vue from 'vue';
import Router from 'vue-router';
import eventList from 'views/event-list/event-list.vue';
import eventRelation from 'views/event-relation/event-relation.vue';
import eventTrend from 'views/event-trend/event-trend.vue';
import eventEdit from 'views/event-edit/event-edit.vue';
import login from 'views/login/login.vue';
import {getCookie} from 'common/js/cookie.js';
import store from 'src/vuex/store.js';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      meta: [{
        to: '/login',
        label: '拓扑图'
      }],
      component: login
    },
    {
      path: '/eventTrend',
      name: 'eventTrend',
      meta: [{
        to: '/eventTrend',
        label: '趋势图'
      }],
      component: eventTrend
    },
    {
      path: '/eventList',
      name: 'eventList',
      meta: [{
        to: '/eventList',
        label: '事件列表'
      }],
      component: eventList,
      children: [
        {
          path: '/eventList/eventEdit',
          name: 'eventList.eventEdit',
          meta: [{
            to: '/eventList',
            label: '事件列表'
          },
          {
            to: '/eventList/eventEdit',
            label: '编辑'
          }],
          component: eventEdit
        }
      ]
    },
    {
      path: '/eventRelation',
      name: 'eventRelation',
      meta: [{
        to: '/eventRelation',
        label: '拓扑图'
      }],
      component: eventRelation
    },
    {
      path: '*',
      redirect: {path: '/login'}
    }
  ]
});

router.beforeEach((to, from, next) => {
  let loginUser = getCookie('loginUser');

  if (loginUser) {
    loginUser = JSON.parse(loginUser);
    store.dispatch('saveLoginUser', loginUser);
  }

  if (to.name === 'login') {
    next();
  } else if (loginUser.userName) {
    next();
  } else {
    next({path: '/login'});
  }
});

export default router;
