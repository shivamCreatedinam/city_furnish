
import React from 'react'
import { View, FlatList, Text, RefreshControl, TouchableOpacity, ImageBackground, Image } from 'react-native'
import styles from './styles'
import resources from '../../../../../res'
import { getProductStatus } from '../normalCategory/NormalCategoryList'
import ImageLoad from '../../../../genriccomponents/image/ImageLoad'
import NetInfo from '@react-native-community/netinfo'
import { Card } from 'native-base'
const NORMAL = 0

function ComboCategoryList(props) {
    const { onPressItem, serverData, loadMoreData,
        isRefreshing, onRefresh, renderFooter, onPressFav, onPressNotifyMe } = props
    return (
        <View style={styles.MainContainer}>
            {serverData.length > 0 ?
                <FlatList
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
                            key={index}
                            onPressFav={onPressFav}
                            onPressNotifyMe={onPressNotifyMe}
                        />
                    }
                    onEndReached={loadMoreData}
                    onEndReachedThreshold={0.1}
                    ItemSeparatorComponent={renderSeparator()}
                    keyExtractor={(item, index) => index.toString()}
                    ListHeaderComponent={() => {
                        return(
                            <View style={styles.paddingClass}>
                  <Text style={styles.titleText}>Combos</Text>
              </View>
                        )
                    }}
                /> :
                <>
                {renderEmptyListView()}
                </>
            }
        </View>

    )
}
function renderSeparator() {
    <View style={{ width: '100%', backgroundColor: resources.colors.inputLabel, height: 0.5 }} />
}



function checkInternetAndCall(data, props) {
    const { onPressItem, key } = props;
    NetInfo.fetch().then(state => {
        if (!state.isConnected) {
            return
        } else {
            onPressItem(data.id, key)
        }
    });
}
function Item(props) {
    const { data, key, onPressFav } = props
    
    return (
        <View style={{marginLeft:10,marginRight:10}}
            key={data.id}>
            <TouchableOpacity onPress={() => { checkInternetAndCall(data, props) }} >
                <View style={styles.viewParent}>
                    <ImageLoad
                        borderColor={"#dddddd"}
                        borderTopLeftRadius={10}
                        borderTopRightRadius={10}
                        borderWidth={0.5}
                        customImagePlaceholderDefaultStyle={{ borderRadius: 10 }}
                        // imageStyle={[{ borderRadius: 10 },styles.border]}
                        source={data.image ? { uri: data.image } : resources.images.img_placeholer_small}
                        style={styles.productImage} resizeMode={'contain'} >

{
                                    data.product_label != "" ?
                                    <View style={{justifyContent:'center',alignContent:'center'}}>
                                        <Text style={{padding:4,backgroundColor: data.product_label == "New Launch" ? '#257B57' : "#5B48BF",width:'30%',height:30,fontWeight:'600',fontSize:12,color:'white',borderRadius:5,fontFamily:resources.fonts.regular,justifyContent:'center',alignItems:'center'}}>
                                            <Image source={require('../../../../../res/images/Image/newProduct.png')}/> {data.product_label}
                                        </Text>
                                    </View>
                                    : null
                                }

                        <View style={styles.cornerView}>
                            {data.product_state != NORMAL ? getProductStatus(data) : <View />}
                        </View>
                        
                            
                                
                            
                        
                    </ImageLoad>

                    

                    <View style={styles.subContainer}>
                        <View style={styles.subImageView}>
                            {getSubImages(data.subproduct_images)}
                        </View>
                        
                        

                        
                        
                        {/* <Text style={styles.includedText} ellipsizeMode={'tail'} numberOfLines={1}>
                            {data.subproduct_images && data.subproduct_images.length > 0 ? data.subproduct_images.length + " Items included" : ""}
                        </Text> */}
                        <View style={{height:10}} />

                    </View>
                    <View style={[styles.rowDirection, styles.spaceBtw, { borderWidth: 0,padding:10 }]}>
                            <View style={styles.titleContainer}>
                                <Text style={[styles.titleTextStyle, { borderWidth: 0 }]}
                                    ellipsizeMode={'tail'}
                                    numberOfLines={2}>{data.product_name}</Text>
                            </View>
                            <TouchableOpacity style={[styles.heartContainer, {
                                borderWidth: 0, marginTop: 0,
                                width: 25, height: 25, alignItems: 'flex-end',justifyContent:'center'
                            }]}
                                hitSlop={{ top: 10, left: 20, right: 20, bottom: 20 }}
                                onPress={() => { onPressFav(data.id, key) }}>
                                {data.isFavourite == 1 ? <Image source={resources.images.icn_wishlist_Select} style={styles.heartStyle} resizeMode={'contain'} />
                                    : <Image source={resources.images.icn_wishlist} style={styles.heartStyle} resizeMode={'contain'} />}
                            </TouchableOpacity>
                        </View>
                    <View style={styles.priceContainer}>
                            
                            <Text style={[styles.priceTextStyle]} numberOfLines={1} ellipsizeMode={"tail"}>
                                {'\u20B9'}{data.price ? data.price : ""}</Text>
                            <Text style={[styles.priceFreqTextStyle]} numberOfLines={1} ellipsizeMode={"tail"}>
                                {data.rental_frequency_type ? " / " + data.rental_frequency_type.toLowerCase() : ""}
                            </Text>
                            {data.saving_percentage && data.saving_percentage != null ? <Text style={styles.priceOffTextStyle}>
                                <Text style={styles.priceOffText}>{` (${data.saving_percentage}% OFF) `}</Text>
                            </Text> : null}
                        </View>
                        <View style={{marginLeft:10}}>
                            {data.strikeout_price ? <Text style={[styles.priceStrikeTextStyle]} numberOfLines={1} ellipsizeMode={"tail"}>
                                {'\u20B9'}{data.strikeout_price} / month</Text> : null}
                        </View>
                    <View style={[styles.deliveryView,{marginLeft:10}]}>
                                <View>
                                    <Image style={styles.image} source={require('../../../../../res/images/blackTruck.png')}/> 
                                </View>
                                <View style={{marginLeft:8}}>
                                    <Text style={{color:"#9A9AA2",fontFamily:resources.fonts.regular}}>{`Delivery by ${data.shipping}`}</Text>
                                </View>
                        </View>
                </View>
            </TouchableOpacity>
            <View style={styles.divider} />
        </View>
    )
}

function getSubImages(data) {
    
    return (
        <>
            {
                data?.length > 1 ?
                    <View style={{backgroundColor:'#E3E1DC',padding:4,marginLeft:10,borderRadius:10}}>
                        <Text style={{fontSize:12,fontFamily:resources.fonts.regular}}>{`  ${data.length} items included  `}</Text>
                    </View>
                :
                null
            }
            
            <FlatList 
                data={data}
                horizontal={true}
                style={{marginTop:15,marginLeft:10}}
                renderItem={({item}) => {
                    return (
                        <>
                         <Image source={{ uri: item }} style={styles.moreImageStyle} resizeMode={'cover'} />
                        </>
                    )
                }}
            />
        </>
    )
    // let views = [];
    
    // if (data && data.length > 0) {
    //     let len = data.length
    //     if (len <= 2) {
    //         len = data.length
    //     } else {
    //         len = 2
    //     }
    //     for (let i = 0; i < len; i++) {
    //         views.push(
    //             <Image source={{ uri: data[i] }}
    //                 style={styles.moreImageStyle} resizeMode={'cover'} />
    //         )
    //     }
    //     if (data.length > 3) {
    //         views.push(

    //             <ImageBackground source={{ uri: data[2] }}
    //                 imageStyle={{ borderRadius: 6 }}
    //                 style={styles.plusImageStyle} resizeMode={'cover'} >
    //                 <View style={styles.plusViewStyle}>
    //                     <Text style={{ fontSize: 19, color: resources.colors.white, fontFamily: resources.fonts.regular }}>+{data.length - 2}</Text>
    //                 </View>
    //             </ImageBackground >



    //         )
    //     }
    // }
    // return views;

}
function renderEmptyListView() {
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

export { ComboCategoryList }