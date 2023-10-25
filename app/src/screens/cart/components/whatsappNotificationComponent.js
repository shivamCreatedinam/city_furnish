import { View, Image, Text, Switch } from 'react-native'
import React from 'react'
import resources from '../../../../res'

const WhatsappNotificationComponent = (props) => {
  const {isEnableWhatsappNotification, onChangeWhatsappNotification} = props
  return (
    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 16, marginTop: 20, marginBottom: 20}}>
        <View style={{flexDirection: 'row', flex: 1}}>
            <Image source={resources.images.img_whatsapp} style={{height: 25, width: 25}} />
            <View style={{marginLeft: 12, flex: 1}}>
                <Text style={{fontFamily: resources.fonts.medium, fontSize: 16, fontWeight: '600', color: resources.colors.titleBlack}}>Whatsapp notifications</Text>
                <Text numberOfLines={2} style={{fontFamily: resources.fonts.regular, fontSize: 12, fontWeight: '400', color: resources.colors.gray_9A9AA2}}>We don’t spam. We only send notifications related to your order.</Text>
            </View>
        </View>
        <Switch
                trackColor={{false: '#E3E1DC', true: '#2D9469'}}
                thumbColor={'white'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => onChangeWhatsappNotification()}
                value={isEnableWhatsappNotification}
        />
      
    </View>
  )
}

export default WhatsappNotificationComponent