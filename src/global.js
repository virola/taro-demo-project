import Taro from '@tarojs/taro'

const global = {
  // 正式环境
  // baseUrl: 'https://socket.bihuyihu.com/gwecs/',
  // socket: 'wss://socket.bihuyihu.com/gwecs/websocket',

  // 测试环境
  baseUrl: 'http://wxhd.goalwisdom.net/gwecs/',
  socket: 'https://socket.goalwisdom.net/gwecs/websocket',

  // 图片base地址
  imgBaseUrl: 'http://img.goalwisdom.net',
  // token: '', // token放localStorage里去了

  // 收到消息音乐
  musicGet: 'http://img.bihuyihu.com/sound/get.mp3',
  //发送消息音乐
  musicSend: 'http://img.bihuyihu.com/sound/send.mp3',

  ENV: Taro.getEnv(),

  // 公共用户信息变量
  userInfo: null,

  // 平台账户信息
  appUserInfo: null,

  // 小程序获取的授权码
  appcode: '',

  getUserInfo() {
    return new Promise((resolve, reject) => {
      if (global.userInfo) resolve(global.userInfo);
      if (global.ENV == 'ALIPAY') {
        // 调用用户授权 api 获取用户信息
        my.getAuthCode({
          scopes: ['auth_user'],
          success: (code) => {
            // console.info(code);
            global.appcode = code.authCode
            // localStorage.setItem('authcode', code.authCode)

            my.getAuthUserInfo({
              success: (res) => {
                global.userInfo = res;
                resolve(global.userInfo);
              },
              fail: () => {
                reject({});
              },
            });
          },
          fail: () => {
            reject({});
          },
        });
      }
    });
  },

  // 更新当前登录账户
  updateUserInfo(data) {
    global.appUserInfo = data
  },
}

/**
 * 全局公共变量
 */
export default global
