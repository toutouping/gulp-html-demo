import Vue from 'vue';
import Vuex from 'vuex';
import * as actions from './actions';
import * as getters from './getters';
import {mutations} from './mutations';

Vue.use(Vuex);

let state = {
  user: {
    userName: ''
  },
  isThemeDark: true
};

export default new Vuex.Store({
  state,
  actions,
  getters,
  mutations
});
