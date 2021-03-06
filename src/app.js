import Taro, { Component } from '@tarojs/taro'
import Index from './pages/index'
import './app.less'

if (process.env.TARO_ENV === 'weapp') {
  // 微信小程序需要这个依赖包
  require('@tarojs/async-await')
}

class App extends Component {

  config = {
    pages: [
      'pages/index/index',
      'pages/user/login',
      'pages/education/index',
      'pages/mine/index',
      'pages/chat/list',
      'pages/chat/chatroom',
      'pages/doctor/homepage',
      'pages/doctor/gift',
      'pages/education/recieved',
      'pages/pay/index'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: '壁虎E护',
      navigationBarTextStyle: 'black',
      defaultTitle: '壁虎E护'
    },
    tabBar: {
      textColor: '#999',
      selectedColor: '#2fd996',
      backgroundColor: '#ffffff',
      // 支付宝
      items: [
        {
          pagePath: 'pages/index/index',
          name: '首页',
          icon: 'img/client_tab_home_unselected.png',
          activeIcon: 'img/client_tab_home_selected.png'
        },
        {
          pagePath: 'pages/education/index',
          name: '科普',
          icon: 'img/client_tab_eassy_unselected.png',
          activeIcon: 'img/client_tab_eassy_selected.png'
        },
        {
          pagePath: 'pages/mine/index',
          name: '我的',
          icon: 'img/client_tab_user_unselected.png',
          activeIcon: 'img/client_tab_user_selected.png'
        }
      ],
      // 微信
      list: [
        {
          pagePath: 'pages/index/index',
          text: '首页',
          iconPath: 'img/client_tab_home_unselected.png',
          selectedIconPath: 'img/client_tab_home_selected.png'
        },
        {
          pagePath: 'pages/education/index',
          text: '科普',
          iconPath: 'img/client_tab_eassy_unselected.png',
          selectedIconPath: 'img/client_tab_eassy_selected.png'
        },
        {
          pagePath: 'pages/mine/index',
          text: '我的',
          iconPath: 'img/client_tab_user_unselected.png',
          selectedIconPath: 'img/client_tab_user_selected.png'
        }
      ]
    }
  }

  componentDidMount () {
  }

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
