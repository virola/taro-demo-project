import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { AtCurtain } from 'taro-ui'

export default class Authorize extends Component {
  constructor () {
    super(...arguments)
    this.state = {
      isOpened: false,
    }
  }
  handleChange () {
    this.setState({
      isOpened: true
    })
  }
  onClose () {
    this.setState({
      isOpened: false
    })
  }

  // 获取用户授权
  authorize() {
    console.log('auth')
  }

  render() {
    return (
      <AtCurtain
        isOpened={this.state.isOpened}
        onClose={this.onClose.bind(this)}
      >
        <View className='reg-info'>
          <View className='icon-info'></View>
          <View className='title'>亲爱的用户，您暂未完善用户信息</View>
          <View>完善授权信息后就可以登入平台进行互动了！</View>
          <Button className='btn' onClick={this.authorize}>立即授权</Button>
        </View>
      </AtCurtain>
    )
  }
}
