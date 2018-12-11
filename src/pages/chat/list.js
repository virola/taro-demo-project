import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import * as $api from '../../service/api'
import { formatChatTime, getImgUrl } from '../../common/util'
import socket from '../../service/socket'

import './list.less'
import global from '../../global';

export default class index extends Component {
  config = {
    navigationBarTitleText: '免费咨询'
  }

  constructor() {
    super(...arguments)

    this.state = {
      loading: true,
      managerStatus: false,
      // 列表数据
      listData: {
        contacts: [],
        total: 0,
      },
    }
  }

  // onLoad
  componentWillMount () {
    this.getManagerStatus()
    socket.onMessage((msgs) => {
      // 接收到新消息的时候，重新请求聊天列表
      if (msgs instanceof Array) {
        this.getChatList()
      }
    })
  }

  componentDidMount () {

  }

  componentWillUnmount () {

  }

  componentDidShow () {
  }

  componentDidHide () { }

  /**
   * 获取聊天列表
   */
  async getChatList() {
    // 有完善个人信息的情况才去请求联系人列表和开启socket
    const chat = await $api.getChatList()
    if (chat.success) {
      this.setState({
        listData: chat.data,
        loading: false
      })
    }
  }

  /**
   * 查询个案师绑定状态
   */
  async getManagerStatus() {
    const res = await $api.getManagerStatus()
    if (res.success) {
      this.setState({
        managerStatus: res.data,
      })
      if (!res.data) {
        this.setState({
          loading: false
        })
      } else {
        this.getChatList()

        socket.connectSocket()
      }
    }
  }

  gotoChat(id = '', chatType = '') {
    switch (chatType) {
      case 'help':
        console.log('goto help')
        break
      case 'system':
        console.log('goto system')
        break
      default:
        Taro.navigateTo({
          url: '/pages/chat/chatroom?id=' + id
        })
    }

  }

  /**
   * 去完善信息
   */
  gotoRegInfo() {
    console.log('goto reg info')
  }

  render() {
    const { managerStatus, listData, loading } = this.state

    const helpData = listData.help && listData.help.length ? {
      ...listData.help[0],
      name: '求助',
      weixin_picture_url: global.imgStaticUrl + '/img/doctor_news_help.png',
      chatType: 'help',
    } : {}
    const sysData = listData.system ? {
      ...listData.system,
      name: '壁虎小助手',
      weixin_picture_url: global.imgStaticUrl + '/img/client_chat_bihuehu.png',
      chatType: 'system',
    } : {}

    const contacts = listData.contacts
    contacts.unshift(helpData)
    contacts.push(sysData)

    return (
      <View>
        {
          loading ?
          <View className='loading-page'>
            <Text className='text-secondary'>Loading...</Text>
          </View> :
          managerStatus ?
          <View>
            <View className='chat-list'>
              {
                contacts.map((item, i) => {
                  return (
                    <View key={i} className='flex chat-list-item' onClick={this.gotoChat.bind(this, item.UID, item.chatType)}>
                      <View className='chat-img flex-center'>
                        <Image className='chat-user-img' src={getImgUrl(item.weixin_picture_url)}></Image>
                      </View>
                      <View className='chat-content'>
                        <View className='chat-detail'>
                          <View className='chat-content-title text-ellipsis'>{item.name}</View>
                          { item.hospital_name ? <View className='chat-content-name text-ellipsis'>{item.hospital_name}</View> : '' }
                          <View className='chat-content-desc text-9 text-ellipsis'>{item.content}</View>
                        </View>
                      </View>
                      <View className='chat-num'>
                        {
                          item.nums > 0 ? <View className='badge'>{item.nums}</View> : ''
                        }
                      </View>
                      <View className='chat-time ft24 text-9'>{formatChatTime(item.created_time)}</View>
                    </View>
                  )
                })
              }
            </View>

          </View>
          :
          <View className='exception-info'>
            <View className='icon icon-info'></View>
            <View className='exception-info-title'>亲爱的用户，您尚未完善医生信息</View>
            <View className='exception-info-content'>完善医生信息后就可以与之进行互动了!</View>
            <View className='btn exception-info-btn' onClick={this.gotoRegInfo.bind(this)}>立即完善</View>
          </View>
        }
      </View>
    )
  }
}
