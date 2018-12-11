import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import * as $api from '../../service/api'
import socket from '../../service/socket'
import global from '../../global'
import ChatContent from '../../components/ChatContent'
import DoctorCard from '../../components/DoctorCard'
import './chatroom.less'

export default class index extends Component {
  config = {
    navigationBarTitleText: '免费咨询'
  }

  constructor() {
    super(...arguments)

    this.state = {
      loading: true,
      managerStatus: false,
      managerId: '',
      managerInfo: {},
      // 列表数据
      list: [],
    }
  }

  componentWillMount () {
    socket.onMessage((msgs) => {
      // 接收到新消息的时候，追加消息
      if (msgs instanceof Array) {
        this.appendMsg(msgs)
      }
    })

    // URL参数，个案师ID
    const managerId = this.$router.params.id
    if (managerId) {
      this.setState({
        managerId
      })
    }
  }

  componentDidMount () {

  }

  componentWillUnmount () {

  }

  // onShow
  componentDidShow () {
    this.initChatData()
  }

  componentDidHide () { }

  async initChatData() {
    const userInfo = global.appUserInfo
    const { managerId } = this.state

    const [ managerData, chatData ] = await Promise.all([
      // 请求个案师信息
      $api.getManagerInfoById(managerId),
      // 请求对话列表
      $api.getChatContents({
        contactsId: managerId,
        userId: userInfo.id
      }),
    ])

    if (managerData.success && chatData.success) {
      this.setState({
        managerInfo: managerData.data,
        list: chatData.data,
        loading: false
      })
      // 修改标题
      Taro.setNavigationBarTitle({
        title: `免费咨询 - ${managerData.data.name}`
      })
    } else {
      this.setState({
        loading: false
      })
    }
  }

  // socket追加新消息
  appendMsg(msg) {
    const { list, managerId } = this.state
    const msgLen = list.length

    msg.forEach(item => {
      if (item.senderId == managerId) {
        list.push(item)
      }
    })
    if (msgLen == list.length) {
      return
    }
    this.setState({
      list,
    })
  }

  render() {
    const { managerInfo, managerStatus, loading, list } = this.state
    const currentUser = global.appUserInfo

    return (
      <View className='page chat-page'>
        {
          loading ? <View className='loading-page'>LOADING...</View> :
          <View>
            <DoctorCard doctor={managerInfo}></DoctorCard>
            <View className='chat-msg-list'>
              {
                list.map(item => {
                  const user = item.senderId == currentUser.id ? currentUser : managerInfo
                  return (
                    <ChatContent key={item.id} msg={item} user={user} showName={false}></ChatContent>
                  )
                })
              }
            </View>
            <View className='input-box'>{managerStatus ? '是' : '否'}</View>
          </View>
        }

      </View>
    )
  }
}
