import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { AtCurtain } from 'taro-ui'
import global from '../../global'

import './index.less'

export default class Authorize extends Component {
  constructor () {
    super(...arguments)
    this.state = {
      isOpened: true,
    }
  }
  open () {
    this.setState({
      isOpened: true
    })
  }
  onClose () {
    this.setState({
      isOpened: false
    })

    if (this.props.onClose) {
      this.props.onClose()
    }
  }

  // 获取用户授权
  authorize() {
    const that = this;
    global.getUserInfo().then(res => {
      console.log(res)
      const token = Taro.getStorageSync('token')
      if (!token) {
        Taro.navigateTo({
          url: '/pages/user/login'
        })
      } else {
        Taro.showToast({
          title: `${res.nickName}, 欢迎回来！`
        })
        that.setState({
          isOpened: false
        })
        if (that.props.onLogin) {
          that.props.onLogin()
        }
      }
    })
  }

  render() {
    return (
      <AtCurtain
        isOpened={this.state.isOpened}
        onClose={this.onClose.bind(this)}
      >
        <View className='reg-info flex-center flex-column'>
          <View className='icon-info'></View>
          <View className='title'>亲爱的用户，您暂未完善用户信息</View>
          <View>完善授权信息后就可以登入平台进行互动了！</View>
          <Button className='btn' onClick={this.authorize}>立即授权</Button>
        </View>
      </AtCurtain>
    )
  }
}
