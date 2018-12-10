import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import global from '../../global'
import * as $api from '../../service/api'
import { getUserAvatar, formatCurrency } from '../../common/util'
import './gift.less'

export default class index extends Component {
  config = {
    navigationBarTitleText: '赠送祝福'
  }

  constructor() {
    super(...arguments)
    this.state = {
      managerId: null,
      managerInfo: {},
      // 选中的礼物
      activeIndex: 0,
      /**
       * 礼物金额配置
       */
      giftList: [
        {
          name: '玫瑰花',
          imgUrl: global.imgStaticUrl + '/img/client_consult_flower@2x.png',
          price: 500,
        },
        {
          name: '感谢信',
          imgUrl: global.imgStaticUrl + '/img/client_consult_letter@2x.png',
          price: 1000,
        },
        {
          name: '巧克力',
          imgUrl: global.imgStaticUrl + '/img/client_consult_chocolate@2x.png',
          price: 5000,
        },
        {
          name: '一束鲜花',
          imgUrl: global.imgStaticUrl + '/img/client_consult_bouquet@2x.png',
          price: 10000,
        },
        {
          name: '水果篮',
          imgUrl: global.imgStaticUrl + '/img/client_consult_fruit@2x.png',
          price: 20000,
        },
        {
          name: '锦旗',
          imgUrl: global.imgStaticUrl + '/img/client_consult_flag@2x.png',
          price: 50000,
        },
      ],
    }
  }

  componentWillMount () {
    this.setState({
      managerId: this.$router.params.id,
    })
  }

  componentDidMount () {
    this.getManagerInfo()
  }

  componentWillUnmount () {

  }

  componentDidShow () {

  }

  // 获取个案管理师信息
  async getManagerInfo() {
    const { managerId } = this.state
    Taro.showLoading()
    const res = await $api.getManagerInfoById(managerId)
    Taro.hideLoading();
    if (res.success) {
      this.setState({
        managerInfo: res.data
      })
    }
  }

  render() {
    const userInfo = global.appUserInfo
    const { managerInfo, giftList, activeIndex } = this.state
    const thanksIcon = global.imgStaticUrl + '/img/client_quest_thanks@2x.png'
    console.log(managerInfo)

    return (
      <View className='page'>
        <View className='common-header'>
          <View className='flex-item'>
            <View className='avatar'>
              <Image className='avatar-img' src={getUserAvatar(userInfo)}></Image>
            </View>
            <Text className='text-9 ft28'>{userInfo.name}</Text>
          </View>
          <View className='flex-item'>
            <View className='avatar'>
              <Image className='avatar-img' src={thanksIcon}></Image>
            </View>
            <Text className='ft28'>感谢</Text>
          </View>
          <View className='flex-item'>
            <View className='avatar'>
              <Image className='avatar-img' src={getUserAvatar(managerInfo)}></Image>
            </View>
            <Text className='text-9 ft28'>{managerInfo.name}</Text>
          </View>
        </View>
        <View className='flex gift-list'>
          {
            giftList.map((item, i) => {
              return (
                <View className={activeIndex == i ? 'gift-item selected' : 'gift-item'} key={i}>
                  <Image className='gift-img' src={item.imgUrl}></Image>
                  <View className='text-9'>{item.name}</View>
                  <View className='text-primary currency'>￥{formatCurrency(item.price)}</View>
                </View>
              )
            })
          }

        </View>
        <Text>感谢医生页面</Text>
        <View className='footer-btns'>
          <Button className='btn'>立即赠送</Button>
        </View>
      </View>
    )
  }
}
