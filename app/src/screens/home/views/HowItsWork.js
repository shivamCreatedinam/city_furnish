import React, { Component } from 'react'
import { Dimensions, Image, ImageBackground, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import resources from '../../../../res';
const windowWidth = Dimensions.get('window').width;

const HowItsWork = (props) => {
    return (
       <View style={{width:"90%",backgroundColor:'white',marginTop:20,marginLeft:16,borderRadius:12}}>
        <View style={{padding:16}}>
        
            <Text style={{fontSize:14,fontWeight:'500',marginLeft:5,marginTop:0,color:'#71717A',fontFamily:resources.fonts.regular}}>HOW IT WORKS</Text>
            <Text style={{fontSize:18,fontWeight:'900',marginLeft:5,color:'#222222',fontFamily:resources.fonts.medium}}>You are just 3 steps away...</Text>
            <View style={{height:0}} />
            <ScrollView style={{marginTop:30}} horizontal={true} showsHorizontalScrollIndicator={false}>
                    <View style={{padding:10,width:'35%',height:190}}> 
                        <Image style={{width:80,height:60}} source={{uri:'https://d3juy0zp6vqec8.cloudfront.net/images/yellow-armchair.webp'}}/>
                        <View style={{flexDirection:'row',width:120}}>
                            <View>
                                <Text style={{color:'#48678B',fontFamily:resources.fonts.medium}}>
                                STEP 1
                                </Text>
                                <Text style={{fontSize:16,color:'#71717A',fontFamily:resources.fonts.regular,marginTop:10}}>
                                Select a product and tenure to start renting
                                </Text>
                                
                            </View>
                        </View>
                    </View>
                    <View style={{padding:10,width:'35%',height:190}}> 
                        <Image style={{width:80,height:60}} source={{uri:'https://d3juy0zp6vqec8.cloudfront.net/images/delivery-truck.webp'}}/>
                        <View style={{flexDirection:'row',width:140}}>
                            <View>
                                <Text style={{color:'#48678B',fontFamily:resources.fonts.medium}}>
                                STEP 2
                                </Text>
                                <Text style={{fontSize:16,color:'#71717A',fontFamily:resources.fonts.regular,marginTop:10}}>
                                Get items delivered and assembled within 72 hrs
                                </Text>
                                
                            </View>
                        </View>
                    </View>
                    <View style={{padding:10,width:'35%',height:190}}> 
                        <Image style={{width:80,height:60}} source={{uri:'https://d3juy0zp6vqec8.cloudfront.net/images/interior-set.webp'}}/>
                        <View style={{flexDirection:'row',width:150}}>
                            <View>
                                <Text style={{color:'#48678B',fontFamily:resources.fonts.medium}}>
                                STEP 3
                                </Text>
                                <Text style={{fontSize:16,color:'#71717A',fontFamily:resources.fonts.regular,marginTop:10}}>
                                Experience the firsthand magic of furniture
                                </Text>
                                
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <TouchableOpacity onPress={() => props.navigation.push("CategoryScreen")} style={{flexDirection:'row',justifyContent:'space-between',backgroundColor:'#48678B',width:'95%',padding:15,marginTop:20,borderRadius:10,marginLeft:10}}>
                    <Text style={{color:'white',fontSize:16,fontWeight:'500',fontFamily:resources.fonts.regular}}>Rent now</Text>
                    <Image source={require('../../../../res/images/Image/right.png')}/>
                </TouchableOpacity>
                
                <View style={{position:"absolute",top:40,left:40,zIndex:1}}>
                    <Image source={require('../../../../res/images/Image/howItsWork.png')} style={{width:300,height:200}} />
                </View>
                
        </View>
        
      </View> 
    )
}


export default HowItsWork
