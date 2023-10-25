import React, { Component, useEffect, useState } from 'react'
import { Image, ImageBackground, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import {getTrendingProductApi} from '../../../redux/actions/ProductDetailsAction'
import ApiEndpoint, { BASE_URL } from '../../../apimanager/ApiEndpoint'
import resources from '../../../../res'
import AppUser from '../../../utility/AppUser'


const TrendingProduct = (props) => {
    const [productData,setProductData] = useState([])
    useEffect(() =>{
        getTrendingProduct()
    },[])

    getTrendingProduct = () => {
        let city = AppUser?.getInstance()?.selectedCityId
        
        props.getTrendingProductApi(city)
        .then(data => {
            let dataTrending = []
            if(data?.data){
                props.setHomePageData(data?.data)
            }
            if(data?.data?.trendingProducts){
                Object.keys(data.data.trendingProducts).map((tp) => {
                    data?.data?.trendingProducts[tp].map((Obj) => {
                        dataTrending.push(Obj)
                    })
                })
                setProductData(dataTrending)
            }
        })
        .catch(error => {
          
        });
        
    }

    return (
      <View style={{padding:10}}>
        <Text style={{fontSize:18,fontWeight:'500',marginLeft:5,marginTop:10}}>Trending products</Text>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                {
                    productData?.map((val,i) =>{
                        let getFileName = val?.image?.split(",")
                        let imageUrl = `https://d3juy0zp6vqec8.cloudfront.net/images/product/${getFileName[0]}`.replace(',','')
                        
                        return(
                            <TouchableOpacity onPress={() => props.navigation.navigate('ProductDetailScreen', {
                                productId: val.id,
                              })} style={{padding:10,width:150,height:250}}>
                            <ImageBackground imageStyle={{ borderRadius: 5}} style={{width:140,height:120,flexDirection:'row'}} source={ imageUrl ? {uri:imageUrl} : resources.images.img_placeholer_small }>

                                {
                                    val.product_label != "" ?
                                    <Text style={{padding:2,backgroundColor: val.product_label == "New Launch" ? '#257B57' : "#5B48BF",width:'75%',height:'20%',fontWeight:'600',fontSize:12,color:'white',borderRadius:5}}>
                                        <Image source={require('../../../../res/images/Image/newProduct.png')}/> {val.product_label}
                                    </Text>
                                    : null
                                }
                                
                            </ImageBackground>
                            <View style={{flexDirection:'row',marginTop:10,justifyContent:'space-between'}}>
                                <View style={{width:120,height:50}}>
                                    {
                                        val.product_name?.length >= 14? 
                                        <Text numberOfLines={2} style={{color:'#9A9AA2'}}>
                                            {`${val.product_name} \n`}
                                        </Text>
                                        :
                                        <Text numberOfLines={2} style={{color:'#9A9AA2'}}>
                                        {val.product_name}
                                    </Text>
                                    }
                                    
                                    <Text style={{fontSize:16}}>₹{val.product_sale_price} / month</Text>
                                    <Text style={{color:'#9A9AA2',textDecorationLine: 'line-through', textDecorationStyle: 'solid'}}>₹{val.price} / month</Text>
                                </View>
                                <TouchableOpacity onPress={() => alert("hello")}>
                                    <Image  source={require('../../../../res/images/Image/like.png')}/>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity> 
                        )
                    })
                }
            
           
        </ScrollView>
      </View>
    )
}

const mapStateToProps = state => {
    return {};
  };
  let container = connect(
    mapStateToProps,
    {
      getTrendingProductApi
    },
  )(TrendingProduct);
export default container
