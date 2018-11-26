import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
// import ajax from '../../service/ajax'

export default class Login extends Component {
  render() {
    return (
      <View className='page page-login'>
        <View className='login'>
          <Text>Login</Text>
        </View>
      </View>
    )
  }
}
