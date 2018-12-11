import Taro, { Component } from '@tarojs/taro'
import { View, Image, Button, Input } from '@tarojs/components'
import * as $api from '../../service/api'
import global from '../../global'

import './login.less'

export default class Login extends Component {
  config = {
    navigationBarTitleText: '用户登录'
  }
  constructor () {
    super(...arguments)
    this.state = {
      loginName: '1234567890123456789',
      // 888888的md5大写
      password: '21218CCA77804D2BA1922C33E0151105',
    }
  }
  componentWillMount () {

  }

  componentDidMount () {

  }

  componentWillUnmount () {

  }

  componentDidShow () {
    const loginName = Taro.getStorageSync('loginName')
    const password = Taro.getStorageSync('password')
    if (loginName && password) {
      this.setState({
        loginName,
        password
      })
    }

  }

  handleInput (stateName, e) {
    this.setState({
      [stateName]: e.detail.value
    })
  }

  handleSubmit(e) {
    global.getUserInfo(e).then(async res => {
      console.log(res)
      if (!res) {
        Taro.showToast({
          title: '授权失败',
          icon: 'none'
        })
        return false
      }
      const { loginName, password } = this.state
      const loginData = await $api.login({
        loginName,
        password,
        nickName: res.nickName
      })
      if (loginData.success) {
        Taro.setStorageSync('token', loginData.msg)

        global.updateUserInfo(loginData.data, () => {
          Taro.showToast({
            title: '登录成功!',
          })
          if (global.ENV == 'WEB') {
            Taro.navigateTo({
              url: '/pages/index/index'
            })
          } else {
            Taro.navigateBack()
          }
        })
      }
    })


  }

  render() {
    const { loginName, password } = this.state

    return (
      <View className='page page-login'>
        <View className='login'>
          <Image className='logo' src='http://img.bihuyihu.com/lizard-logo.svg'></Image>
          <View className='text-primary login-title'>用户登录</View>
          <View className='flex input-box'>
            <View className='icon-bg icon-bg-name'></View>
            <Input className='input' placeholderClass='placeholder-style' placeholder='请输入用户名' onInput={this.handleInput.bind(this, 'loginName')} value={loginName}></Input>
          </View>
          <View className='flex input-box'>
            <View className='icon-bg icon-bg-password'></View>
            <Input className='input' password placeholderClass='placeholder-style' placeholder='请输入密码' onInput={this.handleInput.bind(this, 'password')} value={password}></Input>
          </View>
          {
            global.ENV == 'WEAPP' && <Button className='btn' formType='submit' open-type='getUserInfo' onGetUserInfo={this.handleSubmit}>登录</Button>
          }
          {
            global.ENV == 'ALIPAY' && <Button className='btn' onClick={this.handleSubmit}>登录</Button>
          }
        </View>
      </View>
    )
  }
}
