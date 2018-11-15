function _parserDate (date) {
  return new Date(Date.parse(date.replace(/-/g, '/')));
}

function _pageLeftZero (str) {
  return ('00' + str).substr(str.length);
}

/**
 * formatDate
 * @param {*} date
 * @param {*} fmt
 */
export function formatDate (date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };

  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';

      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : _pageLeftZero(str));
    }
  }
  return fmt;
}

/**
 * getTimeInterval
 * @param {*} date
 * @param {*} seconds
 */
export function getTimeInterval (date, seconds) {
  let beginDate = _parserDate(formatDate(new Date(date.getTime() - seconds * 1000), 'yyyy-MM-dd hh:MM:ss'));
  let endDate = _parserDate(formatDate(date, 'yyyy-MM-dd'));

  return [beginDate, endDate];
}
