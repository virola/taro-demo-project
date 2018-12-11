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
    return false
  }
  const method = options.method && options.method.toUpperCase() || 'GET'

  if (method == 'POST' || options.isLoading) {
    Taro.showLoading({
      content: '加载中...',
    })
  }

  const token = Taro.getStorageSync('token')

  const contentType = options.contentType && options.contentType == 'form' ? 'application/x-www-form-urlencoded' : 'application/json'
  let url = options.url.indexOf('http') > -1 ? options.url : `${global.baseUrl}${options.url}`

  if (token) {
    url += (url.indexOf('?') > -1 ? '&' : '?') + 'access_token=' + token
  }

  /**
   * {
        success: false,
        data: null,
        msg: '令牌失效，请重新登录',
        toLogin: true,
      }
   */
  return new Promise((resolve) => {
    Taro.request({
      url,
      method,
      data: options.data,
      header: { 'content-type': contentType },
    }).then(res => {
      if (method == 'POST' || options.isLoading) {
        Taro.hideLoading()
      }
      if (!res.data.success) {
        if (res.data.errorCode == '1003') {
          Taro.setStorageSync('token', '');
          resolve({
            success: false,
            data: null,
            msg: '令牌失效，请重新登录',
            toLogin: true,
          })
          Taro.showToast({
            title: '网络出现问题，请重新登录'
          })
          Taro.navigateTo({
            url: '/pages/user/login'
          })
          return;
        }
      }
      resolve(res.data)
    }).catch((err) => {
      if (method == 'POST' || options.isLoading) {
        Taro.hideLoading()
      }
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
export const fetch = (url, data = {}, showLoading = false) => {
  return ajax({
    url,
    data,
    showLoading
  });
};

/**
 * 导出一个通用post请求方法
 * @param {*} url URL
 * @param {*} data post参数
 * @param {Object} isForm 是否以表单形式提交数据
 * @param {Object} showLoading 是否显示Loading，默认是true
 */
export const post = (url, data = {}, { isForm = false, showLoading = true }) => {
  return ajax({
    url,
    data,
    method: 'POST',
    contentType: isForm ? 'form' : '',
    showLoading,
  });
};

export default ajax;
