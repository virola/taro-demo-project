import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

export default class index extends Component {
  config = {
    navigationBarTitleText: '壁虎E护'
  }

  constructor() {
    super(...arguments)
    this.state = {}
  }

  componentWillMount () {

  }

  componentDidMount () {

  }

  componentWillUnmount () {

  }

  componentDidShow () {

  }

  render() {
    return (
      <View>
        <Text>医生主页</Text>
      </View>
    )
  }
}
