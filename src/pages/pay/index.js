import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtList, AtListItem } from 'taro-ui'
import './index.less'
import global from '../../global';
import { formatCurrency } from '../../common/util';
import * as $api from '../../service/api'

export default class PayIndex extends Component {
  config = {
    navigationBarTitleText: '支付'
  }

  constructor() {
    super(...arguments)
    this.state = {
      payParams: {
        // 支付提交参数
        params: {},
        // 支付信息
        detail: {},
      },
      timerId: null,
      leftTime: 15 * 60,
      // 支付方式
      method: '1',
      payMethods: []
    }
  }

  componentWillMount () {

  }

  componentDidMount () {

  }

  componentWillUnmount () {
    if (this.state.timerId) {
      clearInterval(this.state.timerId)
    }
  }

  componentDidShow () {
    const payParams = global.data.payParams
    const balance = global.appUserInfo.balance

    let methodBalance = { label: '余额支付', value: '1', desc: '剩余余额' + formatCurrency(balance, 2) }
    if (balance < payParams.params.totalFee) {
      methodBalance.desc += ',不足以支付'
      methodBalance.disabled = true
    }

    if (global.ENV == 'ALIPAY') {
      this.setState({
        method: methodBalance.disabled ? '3' : '1',
        payMethods: [
          methodBalance,
          { label: '支付宝支付', value: '3' },
        ]
      })
    }
    if (global.ENV == 'WEAPP') {
      this.setState({
        method: methodBalance.disabled ? '2' : '1',
        payMethods: [
          methodBalance,
          { label: '微信支付', value: '2' }
        ]
      })
    }

    this.setState({
      payParams,
    })

    this.startCountdown()
  }

  /**
   * 开启倒计时
   */
  startCountdown() {
    let timerId = setInterval(() => {
      this.setState({
        leftTime: this.state.leftTime - 1
      })
    }, 1000)
    this.setState({
      timerId,
    })
  }
  // 格式化剩余时间
  getFormatTime(time) {
    let min = Math.floor(time / 60)
    let sec = time % 60
    return `${min}分${sec}秒`
  }

  handleMethodChange(value, disabled) {
    if (disabled) {
      return false
    }
    this.setState({
      method: value
    })
  }

  toPay() {
    const { payParams, method } = this.state

    switch (method) {
      case 1:
      case '1':
        // 余额支付
        switch (payParams.detail.type) {
          case 'gift':

            break;

          default:
            break;
        }
        break;
      case 2:
      case '2':
        // 微信支付
        switch (payParams.detail.type) {
          case 'gift':
            // 微信支付礼物接口
            $api.getGiftPayMap(payParams.params).then(res => {
              Taro.requestPayment(res.data).then(success => {
                Taro.showModal({
                  title: '支付成功',
                  content: JSON.stringify(success),
                  showCancel: false,
                })
              }).catch((err) => {
                Taro.showModal({
                  title: '支付失败',
                  content: JSON.stringify(err),
                  showCancel: false,
                })
              })
            })
            break;

          default:
            break;
        }
        break;
      case 3:
      case '3':
        // 支付宝支付
        switch (payParams.detail.type) {
          case 'gift':
            $api.getGiftPayMap(payParams.params).then(data => {
              if (data.success) {
                my.tradePay({
                  // 调用统一收单交易创建接口（alipay.trade.create），获得返回字段支付宝交易号trade_no
                  tradeNO: data.data.paySign || 'data.data.trade_no',
                  success: (res) => {
                    my.alert({
                      content: JSON.stringify(res),
                    });
                  },
                  fail: (res) => {
                    my.alert({
                      content: JSON.stringify(res),
                    });
                  }
                });
              }
            })
            break;

          default:
            break;
        }
        break;
      default:
        break;
    }
  }

  render() {
    const { leftTime, payParams, payMethods, method } = this.state

    return (
      <View className='page page-has-btns'>
        <View className='countdown'>请在{this.getFormatTime(leftTime)}内完成支付，超时将自动取消</View>

        <AtList>
          <AtListItem title={payParams.detail.title} />
          <AtListItem title={payParams.detail.subtitle} extraText={formatCurrency(payParams.params.totalFee, 2) + '元'} />
          {
            payParams.detail.discountPrice && <AtListItem title={payParams.detail.discountTitle} extraText={formatCurrency(payParams.detail.discountPrice, 2) + '元'} />
          }
        </AtList>
        <View className='text-title text-9'>选择支付方式</View>
        <View className='basic-list'>
          <View className='basic-list-group'>
            {
              payMethods.map((item, index) => {
                return (
                  <View key={index} className='basic-list-item' hoverClass='hover-class' onClick={this.handleMethodChange.bind(this, item.value, item.disabled)}>
                    <View className='basic-list-item-label'>{item.label}<Text className='desc text-9'>{item.desc}</Text></View>
                    <View className='basic-list-item-content'>
                      {
                        !item.disabled && <View className={method == item.value ? 'base-checkbox base-checkbox-checked' : 'base-checkbox'}></View>
                      }
                    </View>
                  </View>
                )
              })
            }
          </View>
        </View>
        <View className='bottom-box'>
          <View className='price'>实际支付： <Text className='currency'>{formatCurrency(payParams.params.totalFee, 2)}元</Text></View>
          <View className='btn-pay' onClick={this.toPay}>立即支付</View>
        </View>
      </View>
    )
  }
}
