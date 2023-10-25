import React from 'react'
import { View, FlatList, Text, RefreshControl, TouchableOpacity, Image } from 'react-native'
import styles from './styles'
import resources from '../../../../../res'
import CornerLabel from '../../../../genriccomponents/ribbon/CornerLabel'
import ImageLoad from '../../../../genriccomponents/image/ImageLoad'
import Button from '../../../../genriccomponents/button/Button'
import NetInfo from '@react-native-community/netinfo'
import PropTypes from "prop-types";

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

function AddonsCategoryList(props) {
    const { onPressItem, serverData, loadMoreData,
        isRefreshing, onRefresh, renderFooter, onPressFav, customStyle, isSearchItem } = props
    return (
        <View style={[styles.MainContainer, customStyle]}>
            {serverData.length > 0 ?
                <FlatList
                    style={{ paddingHorizontal: 6,marginTop:0}}
                    showsVerticalScrollIndicator={false}
                    data={serverData}
                    ListFooterComponent={renderFooter}
                    // refreshControl={
                    //     <RefreshControl
                    //         refreshing={isRefreshing}
                    //         onRefresh={onRefresh}
                    //     />
                    // }
                    renderItem={({ item, index }) =>
                    <View style={{marginTop: 10}}>
                        <Item
                            data={item}
                            onPressItem={onPressItem}
                            onPressHeart={onPressFav}
                            itemKey={index}
                            isSearchItem={isSearchItem}
                        />
                    </View>
                    }
                    onEndReached={loadMoreData}
                    numColumns={2}
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
            onPressItem(data.id, data.is_frp)
        }
    });
}


function Item(props) {
    const { data, itemKey, onPressHeart, isSearchItem } = props
    return (
        <View
            style={[styles.cellStyle]}>
            <View style={[styles.viewCard]}>
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
                <View style={[styles.rowDirection, {marginTop: 6}]}>
                    <View style={[styles.rowDirection, styles.viewPrice]}>
                        <Text style={[styles.priceTextStyle]} numberOfLines={1} ellipsizeMode={"tail"}>{'\u20B9'}{data.price ? data.price : ""}</Text>
                        <Text style={[styles.priceFreqTextStyle]} numberOfLines={1} ellipsizeMode={"tail"}>{data.rental_frequency_type ? " / " + data.rental_frequency_type.toLowerCase() : ""}</Text>
                    </View>
                    <View style={styles.addTocart}>
                        <Button
                            btnStyle={[styles.buttonStyleAddToCart]}
                            touchOpacityStyle={{}}
                            outlined
                            textStyle={{color: resources.colors.appColor, fontSize: 14}}
                            btnText={'Add'}
                            onPress={() => {
                                checkInternetAndCall(data, props)
                            }} />
                    </View>
                </View>
            </View>
        </View >
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
                <Image source={resources.images.icn_searchimg}
                    // style={{ height: 100, width: 100 }}
                    resizeMode={'contain'}
                >

                </Image>
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



export { AddonsCategoryList }

AddonsCategoryList.prototype = {
    isSearchItem: PropTypes.bool
}

AddonsCategoryList.defaultProps = {
    isSearchItem: false,
};