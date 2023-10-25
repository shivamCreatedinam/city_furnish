import React, { Component } from 'react';
import { View, ImageBackground, StyleSheet } from 'react-native'
import res from '../../../res'
class ThankYouScreen extends Component {


    render() {

        return (
            <View style={{ flex: 1 }}>
                <ImageBackground source={res.images.img_placeholer_large} style={{ flex: 1 }} resizeMode={'stretch'}>
                </ImageBackground>
            </View>
        )
    }


}
export default ThankYouScreen

