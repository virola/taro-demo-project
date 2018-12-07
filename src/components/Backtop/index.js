import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import './index.less'

export default class BackTop extends Component {
  render() {
    return (
      <View className='backtop' onClick={this.props.onClick}></View>
    )
  }
}
