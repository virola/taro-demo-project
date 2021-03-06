import Taro from '@tarojs/taro'
import global from '../global'

let socketStatus = false;

/**
 * 建立一个socket连接
 */
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
 * @param {*} msgCallback 收到消息时的回调
 */
function onMessage(msgCallback) {
  if (global.ENV == 'ALIPAY') {
    my.onSocketMessage(res => {
      const data = getFormatMsg(res)
      if (data) {
        msgCallback && msgCallback(data)
      }
    })
  }
  if (global.ENV == 'WEAPP') {
    wx.onSocketMessage(res => {
      const data = getFormatMsg(res)
      if (data) {
        msgCallback && msgCallback(data)
      }
    })
  }
}

/**
 * 格式化收到的socket消息
 * @param {*} res 收到的socket消息内容
 */
function getFormatMsg(res) {
  if (res.data == 'error') {
    Taro.showToast({
      title: '网络出现问题，请重新登录'
    })
    Taro.navigateTo({
      url: '/pages/user/login'
    })
    return false
  } else {
    try {
      const data = JSON.parse(res.data)
      return data
    } catch (err) {
      // nothing
      return false
    }
  }
}

export default {
  /**
   * 创建一个socket连接
   */
  connectSocket,

  /**
   * 开启一个 socket 通信
   * 注意： 回调方法的注册在整个小程序启动阶段只要做一次，调多次会有多次回调
   * @param {*} msgCallback 收到消息时的回调
   */
  onMessage,

  /**
   * socket丢失连接时自动重连
   */
  onCloseReconnect() {
    // 重连socket
    const reconnect = () => {
      console.info('连接已关闭！')
      socketStatus = false;
      connectSocket()
    }
    // 支付宝
    if (global.ENV == 'ALIPAY') {
      my.onSocketClose(() => {
        reconnect()
      })
    }
    // 微信
    if (global.ENV == 'WEAPP') {
      wx.onSocketClose(() => {
        reconnect()
      })
    }
  },

  /**
   * 获取socket连接状态
   */
  getStatus() {
    return socketStatus
  },

  /**
   * 页面onLoad时监听socket事件
   */
  bindOnLoad() {
    if (global.ENV == 'ALIPAY') {
      // 注意： 回调方法的注册在整个小程序启动阶段只要做一次，调多次会有多次回调
      my.onSocketOpen(() => {
        console.info('连接已打开！')
      });

      my.onSocketError(function(res){
        console.info('WebSocket 连接打开失败，请检查！', res);
      });

    }
  }
}

