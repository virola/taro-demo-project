import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import global from '../../global'
import './index.less'

class EducationItem extends Component {
  static defaultProps = {
    addGlobalClass: true,
    item: {
      coverImage: global.imgCoverDefault
    }
  }

  render () {
    const { coverImage, title, expertEducation, free, departmentName, readCount, paidCount, hasVideo } = this.props.item
    let imgUrl = global.imgCoverDefault
    if (coverImage) {
      imgUrl = coverImage.indexOf('http') > -1 ? coverImage : (global.imgBaseUrl + coverImage)
    }

    return (
      <View className='edu-item'>
        <View className='edu-img-wrap'>
          <Image className='edu-img' src={imgUrl}></Image>
          {
            hasVideo ?
            <View className='video-mask'>
              <View className='icon-video-play'></View>
            </View>
            : ''
          }
        </View>

        <View className='edu-content'>
          <View className='title'>{title}</View>
          <View className='edu-labels'>
            {
              expertEducation ? <Text className='edu-label expert-label'>专家</Text> : ''
            }
            {
              free ? '' : <Text className='edu-label recommend-label'>精选</Text>
            }
          </View>
          <View className='flex-between'>
            <View className='ft24 text-secondary'>{departmentName}</View>
            <View className='ft24 text-secondary'>阅读 {free ? readCount : paidCount}</View>
          </View>
        </View>
      </View>
    )
  }
}

export default EducationItem
