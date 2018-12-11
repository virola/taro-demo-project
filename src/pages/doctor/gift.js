import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Button, Textarea } from '@tarojs/components'
import { AtInputNumber } from 'taro-ui'
import global from '../../global'
import * as $api from '../../service/api'
import { getUserAvatar, formatCurrency } from '../../common/util'
import './gift.less'

export default class DoctorGift extends Component {
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
      blessing: '',
      number: 1,
      /**
       * 礼物金额配置
       */
      giftList: [
        {
          name: '玫瑰花',
          imgUrl: global.imgStaticUrl + '/img/client_consult_flower.png',
          price: 500,
          type: 'ROSE',
        },
        {
          name: '感谢信',
          imgUrl: global.imgStaticUrl + '/img/client_consult_letter.png',
          price: 1000,
          type: 'LETTER',
        },
        {
          name: '巧克力',
          imgUrl: global.imgStaticUrl + '/img/client_consult_chocolate.png',
          price: 5000,
          type: 'CHOCOLATE',
        },
        {
          name: '一束鲜花',
          imgUrl: global.imgStaticUrl + '/img/client_consult_bouquet.png',
          price: 10000,
          type: 'FLOWERS',
        },
        {
          name: '水果篮',
          imgUrl: global.imgStaticUrl + '/img/client_consult_fruit.png',
          price: 20000,
          type: 'FRUITS',
        },
        {
          name: '锦旗',
          imgUrl: global.imgStaticUrl + '/img/client_consult_flag.png',
          price: 50000,
          type: 'BANNER',
        },
      ],
    }
  }

  componentWillMount () {
    this.setState({
      managerId: this.$router.params.id,
    })
  }

  // onReady
  componentDidMount () {
    this.getManagerInfo()
  }

  componentWillUnmount () {

  }

  // onShow
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

  // 选择礼物
  selectGift(index) {
    this.setState({
      activeIndex: index,
    })
  }

  handleNumberChange(value) {
    this.setState({
      number: value
    })
  }
  handleBlessingChange (e) {
    this.setState({
      blessing: e.detail.value
    })
  }

  // 去支付购买
  gotoPay() {
    const { activeIndex, giftList, blessing, managerInfo, number } = this.state
    let blessText = `非常感谢${managerInfo.name}老师的照顾和指导，仁心仁术，万分感谢！`
    if (blessing) {
      blessText = blessing
    }

    // 公共变量中存储支付参数
    global.data.payParams = {
      params: {
        openid: global.appUserInfo.openid,
        price: giftList[activeIndex].price,
        number,
        type: giftList[activeIndex].type,
        blessing: blessText,
        managerId: managerInfo.id,
        totalFee: giftList[activeIndex].price * number,
      },
      detail: {
        // 支付类型
        type: 'gift',
        title: '赠送礼物',
        subtitle: '赠送' + giftList[activeIndex].name,
      }
    }
    Taro.navigateTo({
      url: '/pages/pay/index'
    })
  }

  render() {
    const userInfo = global.appUserInfo
    const { managerInfo, giftList, activeIndex, blessing, number } = this.state
    const thanksIcon = global.imgStaticUrl + '/img/client_quest_thanks.png'
    const defaultBlessing = `非常感谢${managerInfo.name}老师的照顾和指导，仁心仁术，万分感谢！`

    return (
      <View className='page page-has-btns'>
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
                <View className={activeIndex == i ? 'gift-item selected' : 'gift-item'} key={i} onClick={this.selectGift.bind(this, i, item.price)}>
                  <Image className='gift-img' src={item.imgUrl}></Image>
                  <View className='text-9'>{item.name}</View>
                  <View className='text-primary currency'>￥{formatCurrency(item.price)}</View>
                </View>
              )
            })
          }
        </View>
        <View className='basic-list'>
          <View className='basic-list-item'>
            <View>所选礼物数量</View>
            <View>
            <AtInputNumber
              min={0}
              step={1}
              value={number}
              onChange={this.handleNumberChange.bind(this)}
            />
            </View>
          </View>
        </View>
        <View>
          <View className='text-title'>传达心意，写祝福语</View>
          <View className='textarea-box'>
            <Textarea className='textarea' maxlength='50' placeholder={defaultBlessing} value={blessing} onBlur={this.handleBlessingChange.bind(this)}></Textarea>
          </View>
        </View>
        <View className='footer-btns'>
          <Button className='btn' onClick={this.gotoPay}>立即赠送</Button>
        </View>
      </View>
    )
  }
}
