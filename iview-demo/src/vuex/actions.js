import types from './mutation-types';

const saveLoginUser = ({commit}, target) => {
  commit(types.SAVE_LOGIN_USER, target);
};

const saveTheme = ({commit}, target) => {
  commit(types.SAVE_THEME, target);
};

export {
  saveLoginUser,
  saveTheme
};
