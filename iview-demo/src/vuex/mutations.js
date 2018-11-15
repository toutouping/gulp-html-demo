import types from './mutation-types';

export const mutations = {
  [types.SAVE_LOGIN_USER] (state, user) {
    state.user = user;
  },
  [types.SAVE_THEME] (state, theme) {
    state.theme = theme;
  },
  [types.SAVE_IS_THEME_DARK] (state, theme) {
    state.isThemeDark = theme;
  }
};
