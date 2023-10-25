import React, { Component } from 'react'
import { Dimensions, Image, ImageBackground, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import resources from '../../../../res';
const windowWidth = Dimensions.get('window').width;
const Support = (props) => {
    return (
        <View style={{padding:20}}>
            <View style={{padding:24,backgroundColor:'white',borderRadius:12}}>
                <Text style={{fontSize:14,fontWeight:'500',marginLeft:5,marginTop:10,color:'#71717A',fontFamily:resources.fonts.regular}}>HELP & SUPPORT</Text>
                <Text style={{fontSize:18,fontWeight:'500',marginLeft:5,color:'#222222',fontFamily:resources.fonts.medium}}>Looking for an answer?</Text>
                <TouchableOpacity 
                    onPress={props.handleOnPress}
                    style={{marginTop:25,flexDirection:'row',alignItems:'center',justifyContent:'space-between',backgroundColor:'#48678B',width:'100%',padding:14,marginLeft:0,marginBottom:0,borderRadius:10}}
                >
                    <Text style={{color:'white',fontSize:16,fontWeight:'500',fontFamily:resources.fonts.medium}}>Reach out to us</Text>
                    <Image source={require('../../../../res/images/Image/right.png')}/>
            </TouchableOpacity>
            <View style={{position:"absolute",top:10,left:40,zIndex:1}}>
                    <Image source={require('../../../../res/images/Image/howItsWork.png')} style={{width:300,height:200}} />
                </View>
            </View>
            
        </View>
     
    )
}


export default Support

