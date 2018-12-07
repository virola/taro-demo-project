import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

export default class index extends Component {
  config = {
    navigationBarTitleText: '壁虎E护'
  }

  componentWillMount () {
    this.bindSocket()
  }

  componentDidMount () {

  }

  componentWillUnmount () {

  }

  componentDidShow () {

  }

  componentDidHide () { }

  bindSocket() {
    my.onSocketClose(() => {
      my.alert({content: '连接已关闭！'});
      // this.setState({
      //   sendMessageAbility: false,
      //   closeLinkAbility: false,
      // });
    });
    // 注意： 回调方法的注册在整个小程序启动阶段只要做一次，调多次会有多次回调
    my.onSocketOpen(() => {
      my.alert({content: '连接已打开！'});
      // this.setState({
      //   sendMessageAbility: true,
      //   closeLinkAbility: true,
      // });
    });

    my.onSocketError(function(res){
      my.alert('WebSocket 连接打开失败，请检查！' + res);
    });

    // 注意： 回调方法的注册在整个小程序启动阶段只要做一次，调多次会有多次回调
    my.onSocketMessage((res) => {
      console.log('message:', res)
      // my.alert({content: '收到数据！' + JSON.stringify(res)});
    });
  }

  render() {
    return (
      <View>
        <Text>聊天室</Text>
        <View>测试聊天socket</View>
      </View>
    )
  }
}
