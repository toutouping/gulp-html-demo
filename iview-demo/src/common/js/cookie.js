/**
 * 读取cookie
 * @param {*} name
 */
export const getCookie = function (name) {
  let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
  let arr = document.cookie.match(reg);

  if (arr) {
    return unescape(arr[2]);
  } else {
    return null;
  }
};

/**
 * 设置 cookie
 * @param {*} cname
 * @param {*} cvalue
 * @param {*} exMinutes
 */
export const setCookie = function (cname, cvalue, exMinutes) {
  let d = new Date();
  let expires;

  d.setTime(d.getTime() + (exMinutes * 60 * 1000));
  expires = 'expires=' + d.toUTCString();
  document.cookie = cname + '=' + cvalue + ';' + expires;
};

/**
 * 清除cookie
 * @param {*} cname
 */
export const clearCookie = function (cname) {
  setCookie(cname, '', -1);
};
