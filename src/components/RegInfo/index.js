import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { AtCurtain, AtButton } from 'taro-ui'
import './index.less'

export default class RegInfo extends Component {

  // 获取用户授权
  authorize() {

  }

  render() {
    return (
      <View>
        <AtCurtain
          isOpened={this.state.isOpened}
          onClose={this.onClose.bind(this)}
        >
          <View className='reg-info'>
            <View className='icon-info'></View>
            <View className='title'>亲爱的用户，您暂未完善用户信息</View>
            <View>完善医生信息后就可以与之进行互动了！</View>
            <Button className='btn' onClick={this.authorize}>立即授权</Button>
          </View>
        </AtCurtain>
      </View>
    )
  }
}
