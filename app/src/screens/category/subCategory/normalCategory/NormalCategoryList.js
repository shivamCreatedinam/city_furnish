import React from 'react'
import { View, FlatList, Text, RefreshControl, TouchableOpacity, Image, ImageBackground } from 'react-native'
import styles from './styles'
import resources from '../../../../../res'
import CornerLabel from '../../../../genriccomponents/ribbon/CornerLabel'
import ImageLoad from '../../../../genriccomponents/image/ImageLoad'
import NetInfo from '@react-native-community/netinfo'
import PropTypes from "prop-types";
import HorizontalImageView from '../../../../genriccomponents/productView/horizontalImage/HorizontalImageView'

const NORMAL = 0
const OUT_OF_STOCK = 1
const TRENDING = 2
const NEW_LAUNCH = 3
const DISCOUNT = 4

// 1 - out of stock
// 2 - trending
// 3 - new launch
// 4 - discount

// and 0 is default value for all products

function NormalCategoryList(props) {
    const { onPressItem, serverData, loadMoreData,
        isRefreshing, onRefresh, renderFooter, onPressFav, customStyle, isSearchItem } = props
        
    return (
        <View style={[styles.MainContainer, customStyle]}>
            {serverData.length > 0 ?
                <FlatList
                    style={{ paddingHorizontal: 6,marginTop:8}}
                    showsVerticalScrollIndicator={false}
                    data={serverData}
                    ListFooterComponent={renderFooter}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={onRefresh}
                        />
                    }
                    renderItem={({ item, index }) =>
                        <Item
                            data={item}
                            onPressItem={onPressItem}
                            onPressHeart={onPressFav}
                            itemKey={index}
                            isSearchItem={isSearchItem}
                        />
                    }
                    onEndReached={loadMoreData}
                    //numColumns={2}
                    onEndReachedThreshold={0.1}
                    keyExtractor={(item, index) => index.toString()}
                /> :
                renderEmptyListView(isSearchItem)}
        </View>

    )
}


function checkInternetAndCall(data, props) {
    const { onPressItem } = props;
    NetInfo.fetch().then(state => {
        if (!state.isConnected) {
            return
        } else {
            onPressItem(data, data.is_frp)
        }
    });
}


function Item(props) {
    const { data, itemKey, onPressHeart, isSearchItem } = props
    let activeIndexHorizontal = 0
    
    return (
        <>
        <TouchableOpacity  onPress={() => {
                    checkInternetAndCall(data, props)
                }
                } style={styles.product}>
                    
                    <HorizontalImageView
                        data={data.images}
                        activeIndexHorizontal={activeIndexHorizontal}
                        onSnapToItem={(index) => {activeIndexHorizontal = index}}
                        // onPressHorizontalImageView={() => {
                        //     this.onPressHorizontalImageView();
                        // }}
                        //reference={this.carouselRef}
                        />
                    
                    

{
                                    data.product_label != "" ?
                                        <View style={{position:'absolute',top:10,width:"100%",marginLeft:0}}>
                                        <Text style={{padding:4,backgroundColor: data.product_label == "New Launch" ? '#257B57' : "#5B48BF",width:'30%',height:30,fontWeight:'600',fontSize:12,color:'white',borderRadius:5,fontFamily:resources.fonts.regular,justifyContent:'center',alignItems:'center'}}>
                                            <Image source={require('../../../../../res/images/Image/newProduct.png')}/> {data.product_label}
                                        </Text>
                                        </View>
                                    : null
                                }
        {/* <ImageBackground imageStyle={{ borderRadius: 5}} style={styles.imageMain} source={data.image ? { uri: data.image } : resources.images.img_placeholer_small}>
        {
                                    data.product_label != "" ?
                                    
                                        <Text style={{padding:4,backgroundColor: data.product_label == "New Launch" ? '#257B57' : "#5B48BF",width:'30%',height:30,fontWeight:'600',fontSize:12,color:'white',borderRadius:5,fontFamily:resources.fonts.regular,justifyContent:'center',alignItems:'center'}}>
                                            <Image source={require('../../../../../res/images/Image/newProduct.png')}/> {data.product_label}
                                        </Text>
                                    
                                    : null
                                }

            
        </ImageBackground> */}
        <View style={[styles.flex,{marginTop:10}]}>
            <View>
            <Text numberOfLines={2} style={styles.font}>
                            {data.product_name}
                        </Text>
            </View>
            <View>
            <TouchableOpacity
                        onPress={() => { onPressHeart(data.id, itemKey) }} style={{ alignSelf: 'flex-start' }}>
                        {data.isFavourite == 1 || data.isFavourite == true ? <Image source={resources.images.icn_wishlist_Select} style={styles.heartImageStyle} resizeMode={'contain'} />
                            : <Image source={resources.images.icn_wishlist} style={styles.heartImageStyle} resizeMode={'contain'} />}
                    </TouchableOpacity>
            </View>
        </View>
        <View style={[styles.flex,{marginTop:15}]}>
            <View>
            <Text style={styles.fontSize}>{'\u20B9'}{data.price ? data.price : ""} / month</Text>
                        {data.strikeout_price ? <Text style={[styles.price]} numberOfLines={1} ellipsizeMode={"tail"}>
                        {'\u20B9'}{data.strikeout_price}/{'month'}</Text> : null}
            </View>
            <View style={{backgroundColor:'#E3E1DC',justifyContent:'center',alignItems:'center',width:120,borderRadius:100,height:40}}>
                <View style={[styles.flex,{padding:5}]}>
                        <View>
                            <Image style={styles.image} source={require('../../../../../res/images/blackTruck.png')}/> 
                        </View>
                        <View>
                            <Text style={styles.time}>{data.shipping}</Text>
                        </View>
                </View>
            </View>
        </View>
        {/* <View style={styles.flex}>
            <View>
                <View style={styles.likeMain}>
                    <View style={{width:'80%'}}>
                        <Text numberOfLines={2} style={styles.font}>
                            {data.product_name}
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => { onPressHeart(data.id, itemKey) }} style={{ alignSelf: 'flex-start' }}>
                        {data.isFavourite == 1 || data.isFavourite == true ? <Image source={resources.images.icn_wishlist_Select} style={styles.heartImageStyle} resizeMode={'contain'} />
                            : <Image source={resources.images.icn_wishlist} style={styles.heartImageStyle} resizeMode={'contain'} />}
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonMain}>
                    <View>
                        <Text style={styles.fontSize}>{'\u20B9'}{data.price ? data.price : ""} / month</Text>
                        {data.strikeout_price ? <Text style={[styles.price]} numberOfLines={1} ellipsizeMode={"tail"}>
                        {'\u20B9'}{data.strikeout_price}/{'month'}</Text> : null}
                    </View>
                   <View style={styles.deliveryView}>
                        <View>
                            <Image style={styles.image} source={require('../../../../../res/images/blackTruck.png')}/> 
                        </View>
                        <View>
                            <Text style={styles.time}>4-5 days</Text>
                        </View>
                   </View>
                </View>
            </View>
        </View> */}
        <View style={{height:10}} />
    </TouchableOpacity>
        {/* <View
            style={[styles.cellStyle]}>
            <TouchableOpacity
                activeOpacity={0.5}
                style={[styles.viewCard]} onPress={() => {
                    checkInternetAndCall(data, props)
                }
                }>
                <ImageLoad
                    style={[styles.productImageStyle]}
                    topLeftBorderRadius={8}
                    topRightBorderRadius={8}
                    customImagePlaceholderDefaultStyle={{ borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
                    borderWidth={2}
                    source={data.image ? { uri: data.image } : resources.images.img_placeholer_small}
                    resizeMode={"stretch"} >
                    {!isSearchItem ? <View style={styles.cornerView}>
                        {data.product_state != NORMAL ? getProductStatus(data) : <View />}
                        <View style={{ width: 0.1 }} />
                        <TouchableOpacity
                            onPress={() => { onPressHeart(data.id, itemKey) }} style={{ alignSelf: 'flex-start' }}>
                            {data.isFavourite == 1 || data.isFavourite == true ? <Image source={resources.images.icn_wishlist_Select} style={styles.heartImageStyle} resizeMode={'contain'} />
                                : <Image source={resources.images.icn_wishlist} style={styles.heartImageStyle} resizeMode={'contain'} />}
                        </TouchableOpacity>
                    </View>
                        : null}

                </ImageLoad>
                <Text style={[styles.nameTextStyle]} numberOfLines={1} ellipsizeMode={"tail"}>{data.product_name}</Text>
                <View style={[styles.rowDirection, styles.viewPrice]}>
                    {data.strikeout_price ? <Text style={[styles.priceStrikeTextStyle]} numberOfLines={1} ellipsizeMode={"tail"}>
                        {'\u20B9'}{data.strikeout_price}{'/ month'}</Text> : null}
                    <Text style={[styles.priceTextStyle]} numberOfLines={1} ellipsizeMode={"tail"}>{'\u20B9'}{data.price ? data.price : ""}</Text>
                    <Text style={[styles.priceFreqTextStyle]} numberOfLines={1} ellipsizeMode={"tail"}>
                        {data.rental_frequency_type ? " / " + data.rental_frequency_type.toLowerCase() : ""}
                    </Text>
                    {data.saving_percentage && data.saving_percentage != null ? <Text style={styles.priceOffTextStyle}>
                        <Text style={styles.priceOffText}>{` (${data.saving_percentage}% OFF) `}</Text>
                    </Text> : null}
                </View>
            </TouchableOpacity>
        </View > */}
        </>
    )
}

export function getProductStatus(data) {
    switch (data.product_state) {
        case OUT_OF_STOCK:
            return (
                <CornerLabel
                    cornerRadius={60}
                    style={{ backgroundColor: resources.colors.outOfStockRed, height: 20, paddingHorizontal: 10 }}>
                    Out of Stock
                </CornerLabel>
            )
        case TRENDING:
            return (
                <CornerLabel
                    cornerRadius={60}
                    style={{ backgroundColor: resources.colors.discountGreen, height: 20, paddingHorizontal: 10 }}>
                    Trending
                </CornerLabel>
            )
        case NEW_LAUNCH:
            return (
                <CornerLabel
                    cornerRadius={60}
                    style={{ backgroundColor: resources.colors.blueText, height: 20, paddingHorizontal: 10 }}>
                    New launch
                </CornerLabel>
            )
        case DISCOUNT:
            return (
                <CornerLabel
                    cornerRadius={60}
                    style={{ backgroundColor: resources.colors.discountGreen, height: 20, paddingHorizontal: 10 }}>
                    Discounted
                </CornerLabel>
            )
    }
}
function renderEmptyListView(isSearchItem) {
    if (isSearchItem) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                {/* <Image source={resources.images.icn_searchimg}
                     style={{ height: 100, width: 100 }}
                    resizeMode={'contain'}
                >

                </Image> */}
            </View>

        )
    } else {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {/* <Text>{"No Data found"}</Text> */}
            <Image source={resources.images.img_no_products_found}

                resizeMode={'contain'}
            >
            </Image>
            <View style={{ marginTop: 15 }}>
                <Text style={{ textAlign: 'center', fontSize: 14 , fontFamily: resources.fonts.regular}}>{"No product Found"}</Text>
            </View>
        </View>

        )
    }

}



export { NormalCategoryList }

NormalCategoryList.prototype = {
    isSearchItem: PropTypes.bool
}

NormalCategoryList.defaultProps = {
    isSearchItem: false,
};