import React from 'react'
import { View, FlatList, RefreshControl, TouchableOpacity, Text, Image, ImageBackground } from 'react-native'
import styles from './styles'
import resource from '../../../../res/'
import Button from '../../../genriccomponents/button/Button'
import resources from '../../../../res/'
import ImageLoad from '../../../genriccomponents/image/ImageLoad'
import CornerLabel from '../../../genriccomponents/ribbon/CornerLabel'

const NORMAL = 0
const OUT_OF_STOCK = 1
const TRENDING = 2
const NEW_LAUNCH = 3
const DISCOUNT = 4

function WishListItem(props) {
    const { onPressItem, serverData, loadMoreData,
        isRefreshing, onRefresh, onPressDeleteItem, renderFooter, onPressAddToCart } = props
    return (
        <View style={styles.mainContainer}>
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
                        <Item data={item}
                            itemKey={index}
                            onPressItem={onPressItem}
                            onPressDeleteItem={props.onPressDeleteItem}
                            onPressAddToCart={onPressAddToCart} />
                    }
                    onEndReached={loadMoreData}
                    //numColumns={2}
                    onEndReachedThreshold={0.1}
                    keyExtractor={(item, index) => index.toString()}
                /> :
                renderEmptyListView(props)}
        </View>

    )
}
function Item(props) {
    const { onPressItem, data, itemKey, onPressDeleteItem, onPressAddToCart } = props
    
    return (
        <>
        <View style={styles.product}>
        <ImageBackground 
            imageStyle={{ borderRadius: 5}} 
            style={styles.imageMain} 
            source={data.image ? { uri: data.image ? data.image : "" } : resources.images.img_placeholer_small}
        >
            <Text style={styles.productImage}>
                <Image source={require('../../../../res/images/Image/newProduct.png')}/>NEW LAUNCH
            </Text>
            {/* {
                                    data?.product_label != "" ?
                                    
                                        <Text style={{padding:4,backgroundColor: data.product_label == "New Launch" ? '#257B57' : "#5B48BF",width:'30%',height:30,fontWeight:'600',fontSize:12,color:'white',borderRadius:5,fontFamily:resources.fonts.regular,justifyContent:'center',alignItems:'center'}}>
                                            <Image source={require('../../../../res/images/Image/newProduct.png')}/> {data.product_label}
                                        </Text>
                                    
                                    : null
                                } */}
        </ImageBackground>
        <View style={[styles.flex,{marginTop:10}]}>
            <View>
            <Text numberOfLines={2} style={styles.font}>
                            {data.product_name}
                        </Text>
            </View>
            <View>
           
            </View>
        </View>
        <View style={[styles.flex,{marginTop:15}]}>
            <View>
            <Text style={styles.fontSize}>{'\u20B9'}{data.price ? data.price : ""} / month</Text>
                    <Text style={[styles.price]} numberOfLines={1} ellipsizeMode={"tail"}>
                        {'\u20B9'}{"100"}/{'month'}</Text>
            </View>
            <View style={{backgroundColor:'#E3E1DC',justifyContent:'center',alignItems:'center',width:120,borderRadius:100,height:40}}>
                <View style={[styles.flex,{padding:5}]}>
                        <View>
                            <Image style={styles.image} source={require('../../../../res/images/blackTruck.png')}/> 
                        </View>
                        <View>
                            <Text style={styles.time}>{'4-5 Days'}</Text>
                        </View>
                </View>
            </View>
        </View>
        {/* <View style={styles.flex}>
            <View>
                <View style={styles.likeMain}>
                    <Text style={styles.font}>
                        {data.product_name}
                    </Text>
                    <TouchableOpacity>
                        <Image width={70} height={70} source={require('../../../../res/images/Image/likeRed.png')}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonMain}>
                    <View>
                        <Text style={styles.fontSize}>{`₹${data.price ? data.price : ""} / month`}</Text>
                        <Text style={styles.price}>₹729 / month</Text>
                    </View>
                   <TouchableOpacity style={styles.button}>
                        <Image style={styles.image} source={require('../../../../res/images/blackTruck.png')}/> 
                        <Text style={styles.time}>{`4-5 days`}</Text>
                   </TouchableOpacity>
                </View>
            </View>
        </View> */}
        <View style={styles.mainButton}>
            <TouchableOpacity onPress={() => props.onPressDeleteItem(data.product_id, itemKey)} style={styles.removeButton}>
                <Text style={styles.remove}>Remove</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onPressAddToCart(data.product_id, itemKey, data.isComboCategory)} style={styles.addButton}>
                <Text style={styles.add}>Add to cart</Text>
            </TouchableOpacity>
        </View>
    </View>
        {/* <View style={[styles.cellStyle]}>
            <ImageLoad style={[styles.imageThumbnail]}
                topLeftBorderRadius={8}
                topRightBorderRadius={8}
                customImagePlaceholderDefaultStyle={{ borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
                source={data.image ? { uri: data.image ? data.image : "" } : resources.images.img_placeholer_small}
                resizeMode={'cover'} >
                <View style={styles.cornerView}>
                    {data.product_state == OUT_OF_STOCK ? getCornerRibbon() : <View />}
                    <TouchableOpacity style={styles.viewDelete} onPress={() => props.onPressDeleteItem(data.product_id, itemKey)}>
                        <Image source={resource.images.img_delete} style={styles.heartImageStyle} resizeMode={'contain'} />
                    </TouchableOpacity>
                </View>

            </ImageLoad>
            <Text style={[styles.nameTextStyle, { borderWidth: 0 }]} numberOfLines={1} ellipsizeMode={"tail"}>{data.product_name}</Text>
            <View style={{ flexDirection: 'row', marginHorizontal: 7, borderWidth: 0 }}>
                <Text style={styles.priceTextStyle} >
                    Start from ₹
                </Text>
                <Text style={[styles.priceTextStyle, { fontFamily: resources.fonts.bold }]} numberOfLines={1} ellipsizeMode={"tail"}>
                    {data.price ? data.price : ""}
                </Text> */}
                {/* <Text style={styles.priceTextStyle} numberOfLines={1} ellipsizeMode={"tail"}>
                    / month
                </Text> */}
                {/* <Text style={styles.priceTextStyle} numberOfLines={1} ellipsizeMode={"tail"}>
                    {data.rental_frequency_type ? " / " + data.rental_frequency_type.toLowerCase() : ""}
                </Text>
            </View>
            <Button outlined btnText={"Move to Cart"}
                touchOpacityStyle={styles.viewOfButton}
                textStyleOver={styles.textBtn}
                btnStyle={styles.btnStyle}
                onPress={() => onPressAddToCart(data.product_id, itemKey, data.isComboCategory)} />
        </View > */}
        </>
    )
}

function getCornerRibbon() {
    return (
        <CornerLabel
            cornerRadius={60}
            style={{ backgroundColor: resource.colors.outOfStockRed, height: 20, paddingHorizontal: 10 }}>
            Out of Stock
        </CornerLabel>
    )
}

function renderEmptyListView(props) {
    return (
        <View >
           <View style={styles.productEmpaty}>
            <Image width={70} height={70} style={styles.images} source={require('../../../../res/images/Image/heart.png')}/>
            <Text style={styles.text}>Haven’t made any wish yet?</Text>
            <Text style={styles.texts}>Explore our products and put the one’s you like in the Wishlist</Text>
            <TouchableOpacity onPress={() => props.navigation.navigate('CategoryScreen')} style={styles.explorButton}>
                    <Text style={styles.explor}>Explore products</Text>
            </TouchableOpacity>
        </View>
        </View>
    )
}

export { WishListItem }