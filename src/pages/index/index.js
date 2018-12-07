import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtList, AtListItem } from 'taro-ui'
import * as $api from '../../service/api'
import EducationItem from '../../components/EducationItem'
import Authorize from '../../components/Authorize'
import Backtop from '../../components/Backtop'
import global from '../../global'

import './index.less'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '壁虎E护'
  }

  constructor() {
    super(...arguments)
    this.state = {
      userInfo: {},
      projectInfo: {},
      loading: false,
      // 首页宣教list
      pageNumber: 0,
      totalPage: 1,
      list: [],
      showMore: true,
      mainIcons: [
        {
          label: '免费咨询',
          url: 'http://wx.goalwisdom.net/static/img/client_home_consult@2x.png',
          path: '/pages/chat/list',
          hasNew: false,
          nums: 0,
        }, {
          label: '科室宣教',
          url: 'http://wx.goalwisdom.net/static/img/client_home_essay@2x.png',
          path: '/pages/education/recieved',
          hasNew: false,
          nums: 0,
        }, {
          label: '健康问卷',
          url: 'http://wx.goalwisdom.net/static/img/client_home_quest@2x.png',
          path: '/pages/survey/index',
          hasNew: false,
          nums: 0,
        }, {
          label: '预约床位',
          url: 'http://wx.goalwisdom.net/static/img/client_home_reserve@2x.png',
          path: '/pages/sickbed',
          hasNew: false,
          nums: 0,
        }
      ]
    }
  }

  componentWillMount () {
    // console.log('onLaunch')
  }

  componentDidMount () {
    // console.log('onLoad')
  }

  componentWillUnmount () {
    // console.log('onUnload')
  }

  componentDidShow () {
    // console.log('onShow')
    if (localStorage.token) {
      this.onAuthorized()
    }
  }

  componentDidHide () {
    // console.log('onHide')
  }

  // 页面下拉到底部
  onReachBottom() {
    const { pageNumber, totalPage } = this.state
    if (totalPage > pageNumber) {
      this.getList(true)
    }
  }

  // 点击入口
  clickEntry(path) {
    Taro.navigateTo({
      url: path
    })
  }

  gotoKepu() {
    Taro.navigateTo({
      url: '/pages/education/index'
    })
  }

  // 登录授权之后
  async onAuthorized() {
    const res = await $api.getUserInfo()
    if (res.success) {
      global.updateUserInfo(res.data, () => {
        this.setState({
          userInfo: global.appUserInfo,
          projectInfo: global.projectInfo,
          pageNumber: 0,
        })
        this.getList()
        this.getMsgs()
      })
    }
  }

  // 返回顶部
  handleBacktop() {
    Taro.pageScrollTo({
      scrollTop: 0,
      duration: 500
    })
  }

  async getMsgs() {
    const { mainIcons } = this.state
    const res = await $api.getUnreadMsgs()
    if (res.success) {
      global.data.signs = res.data

      mainIcons[0].nums = global.data.signs.messageSign
      mainIcons[1].nums = global.data.signs.educationSign
      mainIcons[2].nums = global.data.signs.questionnaireSign

      this.setState({
        mainIcons,
      })
    }
  }

  // 请求页面数据
  // append是否追加数据
  async getList(append = false) {
    const { pageNumber, totalPage, loading, list } = this.state
    if (pageNumber + 1 > totalPage) {
      return false
    }
    if (loading) {
      return false
    }
    this.setState({
      loading: true
    })
    const res = await $api.getSystemEduList({
      pageSize: 10,
      pageNumber: pageNumber + 1,
    })
    if (res.success) {
      let dataList = res.data.dataList
      if (append) {
        dataList = list.concat(dataList)
      }
      this.setState({
        loading: false,
        list: dataList,
        pageNumber: res.data.pageNo,
        totalPage: res.data.totalPage,
        // 是否加载更多
        showMore: (res.data.pageNo < res.data.totalPage)
      })
    } else {
      this.setState({
        loading: false
      })
    }
  }

  render () {
    const { userInfo, projectInfo, loading, list, mainIcons, showMore } = this.state
    const articleList = list.map(item => {
      return (
        <EducationItem image={item.image} key={item.id} item={item}></EducationItem>
      )
    })

    // const userToken = localStorage.token || '';

    return (
      <View className='page'>
        {
          userInfo.id ? '' : <Authorize isOpened onLogin={this.onAuthorized.bind(this)}></Authorize>
        }
        <View className='banner'>
          {
            projectInfo.image ?
            <View
              className='project-img'
              style={
                { backgroundImage: `url(${global.imgBaseUrl + projectInfo.image})` }
              }
            /> :
            <View className='default'>
              <Image className='logo-img' src='http://web.bihuyihu.com/static/img/logo2.svg' />
              <View className='logo-text'>庇护您的健康</View>
            </View>
          }
          <View className='mask'>
            <Text className='mask-text'>{projectInfo.hospitalName || '壁虎E护'}</Text>
          </View>
        </View>
        <View className='flex icon-wrap'>
          {
            mainIcons.map((item, index) => (
              <View className='main-icon' key={index} onClick={this.clickEntry.bind(this, item.path)}>
                <Image className='icon' src={item.url} />
                {
                  item.nums > 0 ? <View className='badge'>{item.nums}</View> : ''
                }
                <View className='label-title'>{item.label}</View>
              </View>
            ))
          }
        </View>
        <View>
          <AtList>
            <AtListItem className='home-title' title='健康科普' extraText='查看全部' arrow='right' onClick={this.gotoKepu.bind(this)} />
          </AtList>
          <View className='bg-white list-wrap'>
            {articleList}
          </View>
          <View className='show-more text-secondary'>
            {
              loading ?
                <Text className='text-secondary'>正在加载中...</Text>
                : (showMore ? '- 加载更多 -' : '- END -')
            }
          </View>
        </View>
        <Backtop onClick={this.handleBacktop.bind(this)}></Backtop>
      </View>
    )
  }
}
