import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import './index.less'


class EducationItem extends Component {
  static defaultProps = {
    image: 'http://wx.goalwisdom.net/static/img/default_health.png'
  }

  render () {
    const { image, title, isExpert, isFree, hospitalName, readCount } = this.props

    return (
      <View className='flex edu-item'>
        <Image className='edu-img' src={image}></Image>
        <View className='edu-content'>
          <View className='title'>{title}</View>
          <View className='edu-labels'>
            {
              isExpert ? <Text className='edu-label expert-label'>专家</Text> : ''
            }
            {
              isFree ? '' : <Text className='edu-label recommend-label'>精选</Text>
            }
          </View>
          <View className='flex-between'>
            <View className='text-secondary'>{hospitalName}</View>
            <View className='text-secondary'>{readCount}</View>
          </View>
        </View>
      </View>
    )
  }
}

export default EducationItem
