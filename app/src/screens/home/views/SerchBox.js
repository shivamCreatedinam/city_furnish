import React, { Component } from 'react'
import { View,Text, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native'
import resources from '../../../../res'
import ImageLoad from '../../../genriccomponents/image/ImageLoad'

const SerchBox = (props) => {
    return (
      <View style={styles.boxColor}>
        {/* <View style={styles.Header}>
            
            <TouchableOpacity>
            <Image source={require('../../../../res/images/Image/logo.png')}/>
            <TouchableOpacity onPress={() => props.onClickLocation()} style={{flexDirection:'row'}}>
                <View style={{justifyContent:'center'}}>
                    <Image style={{width:18,height:18}} source={require('../../../../res/images/Image/location.png')}/>
                </View>
                <View style={{marginLeft:10}}>
                    <Text style={{fontSize:18,fontWeight:'bold'}}>{props.headerTitle}</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => props.navigateProps.push('CartScreen')}>
                <Image source={require('../../../../res/images/Image/cart.png')}/>
            </TouchableOpacity>
            </TouchableOpacity>
            
        </View> */}
        {
            props.showSearchBox ?
        <View style={styles.input}>
            <TouchableOpacity>
                <Image source={require('../../../../res/images/Image/search.png')}/>
            </TouchableOpacity>
            <TextInput name='search' style={{fontFamily:resources.fonts.regular,fontSize:14,width:'100%'}} onFocus={() => props.navigateProps.push("SearchScreen",{data:props?.homePageData})} placeholder='What are you looking for?'/>
        </View>
            : null
        }
        
      </View>
    )
}

const styles = StyleSheet.create({
Header:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    marginBottom:15
},
input:{
    flexDirection:'row',
    alignItems:'center',
    borderColor:'#DDDDDF',
    borderWidth:1,
    borderRadius:10,
    paddingLeft:12,
    
},
boxColor:{
    backgroundColor:'#FFFFFF',
    padding:12
}
})


export default SerchBox