import Taro, { Component } from '@tarojs/taro'
import { View, Image, Button, Input } from '@tarojs/components'
import { post } from '../../service/ajax'
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

  handleInput (stateName, value) {
    this.setState({
      [stateName]: value
    })
  }

  async handleSubmit() {
    console.log('login')
    const { loginName, password } = this.state
    const res = await post('/patientUser/patientLogin', {
      loginName,
      password,
    }, 'form')
    if (res.success) {
      localStorage.setItem('token', res.msg)
      global.updateUserInfo(res.data)
      Taro.showToast({
        title: '登录成功!',
        icon: 'success',
      })
      Taro.navigateBack()
    }

  }

  render() {
    const loginName = localStorage.loginName || ''
    const password = localStorage.password || ''

    return (
      <View className='page page-login'>
        <View className='login'>
          <Image className='logo' src='http://img.bihuyihu.com/lizard-logo.svg'></Image>
          <View className='text-primary title'>用户登录</View>
          <View className='flex input-box'>
            <View className='icon-bg icon-bg-name'></View>
            <Input className='input' placeholderClass='placeholder-style' placeholder='请输入用户名' onChange={this.handleInput.bind(this, 'loginName')} value={loginName}></Input>
          </View>
          <View className='flex input-box'>
            <View className='icon-bg icon-bg-password'></View>
            <Input className='input' password placeholderClass='placeholder-style' placeholder='请输入密码' onChange={this.handleInput.bind(this, 'password')} value={password}></Input>
          </View>
          <Button className='btn' formType='submit' onClick={this.handleSubmit}>登录</Button>
        </View>
      </View>
    )
  }
}
