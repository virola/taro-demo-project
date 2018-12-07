import Taro from '@tarojs/taro'
import global from '../global'

let socketStatus = false;

function connectSocket() {
  const token = Taro.getStorageSync('token')
  if (global.ENV == 'ALIPAY') {
    my.connectSocket({
      url: global.socket + '?accessToken=' + token,
      success(res) {
        console.log('Socket已连接', res)
        socketStatus = true
      },
      fail(err) {
        console.log('Socket连接失败', err)
        socketStatus = false
      }
    });
  }
  if (global.ENV == 'WEAPP') {
    Taro.connectSocket({
      url: global.socket + '?accessToken=' + token,
      success: function () {
        console.log('connect success')
      }
    })
  }
}

/**
 * 开启一个 socket 通信
 * @param {*} successCallback 开启成功的回调
 */
function onMessage(successCallback) {
  if (global.ENV == 'ALIPAY') {
    my.onSocketMessage(res => {
      console.log('message', res)
      successCallback && successCallback(res)
    })
  }
  if (global.ENV == 'WEAPP') {
    wx.onSocketMessage(res => {
      console.log('message', res)
      successCallback && successCallback(res)
    })
  }

}

export default {
  /**
   * 创建一个socket连接
   */
  connectSocket,
  /**
   * 监听socket收消息事件
   */
  onMessage,

  /**
   * 获取socket连接状态
   */
  getStatus() {
    return socketStatus
  },

  /**
   * 页面onLoad时监听socket事件
   * @param {Function} msgCallback 收到消息时的回调
   */
  bindOnLoad(msgCallback) {
    my.onSocketClose(() => {
      console.info('连接已关闭！')
    });
    // 注意： 回调方法的注册在整个小程序启动阶段只要做一次，调多次会有多次回调
    my.onSocketOpen(() => {
      console.info('连接已打开！')
    });

    my.onSocketError(function(res){
      console.info('WebSocket 连接打开失败，请检查！', res);
    });

    // 注意： 回调方法的注册在整个小程序启动阶段只要做一次，调多次会有多次回调
    my.onSocketMessage((res) => {
      // console.info('收到数据！', res.data)
      if (res.data == 'error') {
        Taro.showToast({
          title: '网络出现问题，请重新登录'
        })
        Taro.navigateTo({
          url: '/pages/user/login'
        })
      } else {
        try {
          const data = JSON.parse(res.data)
          msgCallback && msgCallback(data)
        } catch (err) {
          // nothing
        }
      }
    });
  }
}

