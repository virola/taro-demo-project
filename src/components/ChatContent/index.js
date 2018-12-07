import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import './index.less'
import { formatChatTime, getImgUrl } from '../../common/util';
import global from '../../global'

/**
 * 聊天会话Card
 */
export default class ChatContent extends Component {
  render() {
    const {
      showName,
      msg,
      user
    } = this.props
    const { sendTime, senderId, message } = msg
    const { weixinPictureUrl, headImage, name } = user
    const isSelf = senderId == global.appUserInfo.id
    const avatar = headImage ? headImage : weixinPictureUrl

    return (
      <View className='chat-card'>
        <View className='time'>
          <Text className='time-text'>{formatChatTime(sendTime)}</Text>
        </View>
        <View className={isSelf ? 'message message-self' : 'message '}>
          <View className='avatar'>
            {
              showName ? <Text>{name}</Text> : ''
            }
            <Image className='avatar-img' src={getImgUrl(avatar)}></Image>
          </View>
          <View className='text'>{message}</View>
        </View>
      </View>
    )
  }
}

ChatContent.defaultProps = {
  showName: false,
  msg: {},
  user: {}
}
