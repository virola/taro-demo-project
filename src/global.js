import Taro from '@tarojs/taro'
import { getMyProject } from './service/api'

const appUserInfo = Taro.getStorageSync('userInfo') || null
const projectInfo = Taro.getStorageSync('projectInfo') || {}

const global = {
  // 正式环境
  // baseUrl: 'https://socket.bihuyihu.com/gwecs/',
  // socket: 'wss://socket.bihuyihu.com/gwecs/websocket',

  // 测试环境
  baseUrl: 'http://wxhd.goalwisdom.net/gwecs',
  socket: 'wss://socket.goalwisdom.net/gwecs/websocket',

  // 图片base地址
  imgBaseUrl: 'http://img.goalwisdom.net/',
  // static目录地址
  imgStaticUrl: 'http://wx.goalwisdom.net/static/mini-app/',
  imgAvatarDefault: 'http://wx.goalwisdom.net/static/img/init_header.png',
  imgCoverDefault: 'http://wx.goalwisdom.net/static/img/default_health.png',

  // 收到消息音乐
  musicGet: 'http://img.bihuyihu.com/sound/get.mp3',
  //发送消息音乐
  musicSend: 'http://img.bihuyihu.com/sound/send.mp3',

  ENV: Taro.getEnv(),

  // 存放公共变量
  data: {},

  // 公共用户信息变量
  userInfo: null,

  // 登录帐号的平台账户信息
  appUserInfo,
  // 登录帐号的科室信息
  projectInfo,

  // 小程序获取的授权码
  appcode: '',

  getUserInfo(event) {
    return new Promise((resolve, reject) => {
      if (global.userInfo) return resolve(global.userInfo);
      if (global.ENV == 'ALIPAY') {
        // 调用用户授权 api 获取用户信息
        my.getAuthCode({
          scopes: ['auth_user'],
          success: (code) => {
            global.appcode = code.authCode

            my.getAuthUserInfo({
              success: (res) => {
                global.userInfo = res
                resolve(global.userInfo)
              },
              fail: () => {
                reject(false)
              },
            });
          },
          fail: () => {
            reject(false)
          },
        });
      } else if (global.ENV == 'WEB') {
        resolve({})
      }
      if (global.ENV == 'WEAPP') {
        wx.login({
          success: res => {
            global.appcode = res.code
            // 微信中可以直接定义button获取用户信息
            if (event && event.detail.userInfo) {
              global.userInfo = event.detail.userInfo
              resolve(global.userInfo)
            } else {
              resolve(false)
            }

          }
        })
      }
    });
  },

  // 更新当前登录账户
  updateUserInfo(data, callback) {
    global.appUserInfo = data

    getMyProject().then(res => {
      if (res.success) {
        global.projectInfo = res.data
      }
      if (callback) {
        callback()
      }
    })
  },
}

/**
 * 全局公共变量
 */
export default global
