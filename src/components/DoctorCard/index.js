import Taro, { Component } from '@tarojs/taro'
import { View, Image, Button } from '@tarojs/components'
import { getImgUrl } from '../../common/util'

import './index.less'

/**
 * 免费咨询的时候医生的名片
 */
export default class DoctorCard extends Component {

  onAvatarClick(id) {
    Taro.navigateTo({
      url: '/pages/doctor/homepage?id=' + id
    })
  }

  onBtnClick(id) {
    Taro.navigateTo({
      url: '/pages/doctor/gift?id=' + id
    })
  }

  render() {
    const { weixinPictureUrl, headImage, name, hospitalName, id } = this.props.doctor
    const avatar = headImage ? headImage : weixinPictureUrl

    return (
      <View className='doctor-card'>
        <View className='avatar'>
          <Image className='avatar-img' src={getImgUrl(avatar)} onClick={this.onAvatarClick.bind(this, id)}></Image>
        </View>
        <View className='doctor-text'>
          <View className='doctor-name'>{name}</View>
          <View className='hospital-name'>{hospitalName}</View>
        </View>
        <View className='gift-btn'>
          <Button className='btn' onClick={this.onBtnClick.bind(this, id)}>感谢TA</Button>
        </View>
      </View>
    )
  }
}

DoctorCard.defaultProps = {
  doctor: {}
}

