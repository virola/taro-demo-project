import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { fetch } from '../../service/ajax'
import EducationItem from '../../components/EducationItem'
import Authorize from '../../components/Authorize'
import global from '../../global'

import './index.less'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '壁虎E护'
  }

  constructor() {
    super(...arguments)
    this.state = {
      userInfo: global.appUserInfo,
      loading: true,
      // 首页宣教list
      pageNumber: 1,
      list: [],
      mainIcons: [
        {
          label: '免费咨询',
          url: 'http://wx.goalwisdom.net/static/img/client_home_consult@2x.png',
          path: '/chatList',
          hasNew: false,
          nums: 10,
        }, {
          label: '科室宣教',
          url: 'http://wx.goalwisdom.net/static/img/client_home_essay@2x.png',
          path: '/education',
          hasNew: false,
          nums: 5,
        }, {
          label: '健康问卷',
          url: 'http://wx.goalwisdom.net/static/img/client_home_quest@2x.png',
          path: '/healthQuestionsList',
          hasNew: false,
          nums: 5,
        }, {
          label: '预约床位',
          url: 'http://wx.goalwisdom.net/static/img/client_home_reserve@2x.png',
          path: '/sickbed',
          hasNew: false,
          nums: 0,
        }
      ]
    }
  }

  componentWillMount () {

  }

  componentDidMount () {
    const { pageNumber } = this.state
    fetch('patientUser/getFilterSystemHealthEducations', {
      pageSize: 10,
      pageNumber,
    }).then(res => {
      if (res.success) {
        this.setState({
          loading: false,
          list: res.data
        })
      } else {
        this.setState({
          loading: false
        })
      }
    })
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    const { userInfo, loading, list, mainIcons } = this.state
    const articleList = list.map(item => {
      return (
        <EducationItem image={item.image} title={item.title} key={item.id}></EducationItem>
      )
    })

    const userToken = localStorage.token || '';

    return (
      <View className='page'>
        {
          userToken ? '' : <Authorize isOpened></Authorize>
        }
        <View className='banner'>
          {
            userInfo.projectImage ?
            <View className='project'></View> :
            <View className='default'>
              <Image className='logo-img' src='http://web.bihuyihu.com/static/img/logo2.svg' />
              <View className='logo-text'>庇护您的健康</View>
            </View>
          }
          <View className='mask'>
            <Text className='mask-text'>{userInfo.hospitalName || '壁虎E护'}</Text>
          </View>
        </View>
        <View className='flex icon-wrap'>
          {
            mainIcons.map((item, index) => (
              <View className='main-icon' key={index}>
                <Image className='icon' src={item.url} />
                {
                  item.nums > 0 ? <View className='badge'>{item.nums}</View> : ''
                }
                <View className='label-title'>{item.label}</View>
              </View>
            ))
          }
        </View>
        <View className='view-point-banner'>
          <Text>锦囊</Text>
        </View>
        <View className='welcome-message'>Welcome!</View>
        <View loading={loading}>
          <Text>健康宣教</Text>
          <View className='list-wrap'>
            {articleList}
          </View>
        </View>
      </View>
    )
  }
}
