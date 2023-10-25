import React, { Component } from 'react';
import { View, Text, ImageBackground } from 'react-native'
import styles from './styles'
import { MyStatusBar } from '../../genriccomponents/header/HeaderWithProfilePic'
import resources from '../../../res'
import Header from '../../genriccomponents/header/HeaderAndStatusBar'
class PaymentFailed extends Component {
    
    render() {
        return (
            <View style={styles.fullScreen}>
                <MyStatusBar barStyle={'dark-content'} />
                <View style={styles.container}>
                    <ImageBackground style={{ flex: 1 }} source={resources.images.img_placeholer_large} />
                </View>
                <View style={{ position: 'absolute',  bottom: 0, left: 0, right: 0, height: 300 }}>
                    <View style ={{justifyContent:'center',flexDirection:'column'}}>
                        <Text style={{textAlign:'center',fontFamily:resources.fonts.medium,fontSize:48,color:resources.colors.appColor}}>Ooppss!</Text>
                        <Text style={{textAlign:'center',fontFamily:resources.fonts.medium,fontSize:24,color:resources.colors.timerColor,marginBottom:10}}>Something went wrong.</Text>
                        <Text style={{textAlign:'center',fontFamily:resources.fonts.regular,fontSize:16,color:resources.colors.timerColor,marginHorizontal:40}}>Please wait while we redirect you to the next step.</Text>
                    </View>

                </View>

            </View>
        )
    }
}
export default PaymentFailed