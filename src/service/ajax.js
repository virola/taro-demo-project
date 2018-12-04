import Taro from '@tarojs/taro'
import global from '../global'
/**
 * 通用ajax请求处理模块
 * @param {*} options 选项
 * {
 *  url: 'request-url',
 *  data: {},
 *  method: 'POST'
 * }
 */
const ajax = (options = {}) => {
  if (!options.url) {
    return;
  }
  Taro.showLoading({
    content: '加载中...',
  })
  const contentType = options.contentType && options.contentType == 'form' ? 'application/x-www-form-urlencoded' : 'application/json'
  const url = options.url.indexOf('http') > -1 ? options.url : `${global.baseUrl}${options.url}`
  // console.log(options);
  return new Promise((resolve) => {
    Taro.request({
      url,
      method: options.method && options.method.toUpperCase() || 'GET',
      data: options.data,
      header: { 'content-type': contentType, 'access_token': localStorage.token },
    }).then(res => {
      Taro.hideLoading()
      resolve(res.data)
    }).catch((err) => {
      Taro.hideLoading()
      resolve({
        success: false,
        data: null,
        msg: '网络请求发生错误，请稍候再试',
        err,
      })
    })
  })
};

/**
 * 导出一个fetch请求方法
 * @param {*} url URL
 * @param {*} data 请求参数
 */
export const fetch = (url, data = {}) => {
  return ajax({
    url,
    data,
  });
};

/**
 * 导出一个通用post请求方法
 * @param {*} url URL
 * @param {*} data post参数
 * @param {*} contentType 传输方式
 */
export const post = (url, data = {}, contentType = '') => {
  return ajax({
    url,
    data,
    method: 'POST',
    contentType,
  });
};

export default ajax;
