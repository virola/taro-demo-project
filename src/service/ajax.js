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
  const url = options.url.indexOf('http') > -1 ? options.url : `${global.baseUrl}/${options.url}`
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

export default ajax;
