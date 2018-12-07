import global from '../global';

/**
 * 将 Date 转化为指定格式的String
 * 月(M)、日(DD)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * eg:
 * dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss.S') ==> 2006-07-02 08:09:04.423
 * dateFormat(new Date(), 'YYYY-MM-DD E HH:mm:ss') ==> 2009-03-10 二 20:09:04
 * dateFormat(new Date(), 'YYYY-MM-DD EE HH:mm:ss') ==> 2009-03-10 周二 08:09:04
 * dateFormat(new Date(), 'YYYY-MM-DD EEE HH:mm:ss') ==> 2009-03-10 星期二 08:09:04
 * dateFormat(new Date(), 'YYYY-M-d h:m:s.S') ==> 2006-7-2 8:9:4.18
 */
export function dateFormat(datetime, fmt = 'YYYY-MM-DD EE') {
  const tmpDate = new Date(datetime);
  const o = {
    'M+': tmpDate.getMonth() + 1, //月份
    'D+': tmpDate.getDate(), //日
    'h+': tmpDate.getHours() % 12 == 0 ? 12 : tmpDate.getHours() % 12, //小时
    'H+': tmpDate.getHours(), //小时
    'm+': tmpDate.getMinutes(), //分
    's+': tmpDate.getSeconds(), //秒
    'q+': Math.floor((tmpDate.getMonth() + 3) / 3), //季度
    S: tmpDate.getMilliseconds(), //毫秒
  };
  const week = {
    '0': '日',
    '1': '一',
    '2': '二',
    '3': '三',
    '4': '四',
    '5': '五',
    '6': '六',
  };
  if (/(Y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (tmpDate.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length > 1 ? (RegExp.$1.length > 2 ? '星期' : '周') : '') + week[tmpDate.getDay() + '']);
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
    }
  }
  return fmt;
}

/**
 * 将 Date 转换成时间轴形式的格式化文本
 * 今天的时间则是 HH:mm， 昨天： 昨天， 昨天之前的 yYYYY-MM-DD
 * @param {Date} datetime 日期对象或日期格式的文本
 */
export function formatChatTime(datetime) {
  const tmpDate = new Date(datetime)
  const today = new Date()
  today.setHours(0)
  today.setMinutes(0)
  today.setSeconds(0)
  today.setMilliseconds(0)

  const yesterday = today.getTime() - 24 * 3600 * 1000
  const startOfYear = new Date()
  startOfYear.setMonth(0)
  startOfYear.setDate(1)
  startOfYear.setHours(0)
  startOfYear.setMinutes(0)
  startOfYear.setSeconds(0)
  startOfYear.setMilliseconds(0)

  if (today.getTime() <= tmpDate) {
    return tmpDate.getHours() + ':' + tmpDate.getMinutes()
  } else if (yesterday <= tmpDate) {
    return '昨天 ' + tmpDate.getHours() + ':' + tmpDate.getMinutes()
  } else if (tmpDate < startOfYear) {
    // return dateFormat(tmpDate, 'YYYY/MM/DD')
  }

  return dateFormat(tmpDate, 'YYYY/MM/DD')
}

/**
 * 获取图片完整地址
 * @param {String} imgUrl 图片路径
 */
export const getImgUrl = imgUrl => {
  if (!imgUrl) {
    return '';
  }
  return imgUrl.indexOf('http') > -1 ? imgUrl : global.imgBaseUrl + imgUrl;
};

/**
 * 千分位格式化数字
 * @param {Number} value 要格式化的数字
 * @param {Number} float 小数点位
 */
export const numerial = (value = 0, float = 0) => {
  if (typeof value === 'string') {
    return value;
  }
  let num = value.toFixed(float).toString();
  const regex = /(-?\d+)(\d{3})/;

  while (regex.test(num)) {
    num = num.replace(regex, '$1,$2');
  }
  return num;
};
