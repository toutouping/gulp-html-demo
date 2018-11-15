import types from './mutation-types';

const saveLoginUser = ({commit}, target) => {
  commit(types.SAVE_LOGIN_USER, target);
};

const saveTheme = ({commit}, target) => {
  commit(types.SAVE_THEME, target);
};

const saveIsThemeDark = ({commit}, target) => {
  commit(types.SAVE_IS_THEME_DARK, target);
};

export {
  saveLoginUser,
  saveTheme,
  saveIsThemeDark
};
