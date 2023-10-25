import React from 'react'
import { View, FlatList, Text, TouchableOpacity } from 'react-native'
import styles from './styles'
import resources from '../../../../res';
import ImageLoad from '../../../genriccomponents/image/ImageLoad'
function ProductHorizontalView(props) {
    const { productList, labelStyles, label, customStyle, corporateData, onMoveProduct } = props;

    return (
        <View>

            <View style={[styles.mainContainer, customStyle]}>
                {
                    corporateData ? <Text style={[styles.corporateTitle, labelStyles]}>{label ? label : ""}</Text>
                        : <Text style={[styles.titleTextStyle, labelStyles]}>{label ? label : ""}</Text>
                }

                {/* {
                    removeButton ?
                        <TouchableOpacity style={styles.arrowContainer} onPress={props.onPress}>
                            <Text style={[styles.viewTextStyle, labelStyles]}>{viewLabel ? viewLabel : ""}</Text>
                            <Image source={resources.images.forward_icn} style={styles.forwardIconStyle} resizeMode={'contain'} />
                        </TouchableOpacity> :
                        <View>
                        </View>
                } */}

            </View>

            <View style={corporateData ? styles.marginLeftCorporate : styles.marginLeft}>
                <FlatList
                    data={productList ? productList : []}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item, index }) =>
                        <ProductCell
                            data={item}
                            itemKey={index}
                            onMoveProduct={onMoveProduct}
                            corporateData={corporateData}

                        />
                    }
                />
            </View>
        </View>
    );
}


function ProductCell(props) {
    const { data, corporateData, onMoveProduct } = props;

    return (
        corporateData ?
            <View style={[styles.corporateCardContainer]}>
                <View style={{
                    height: 100,
                    width: 150,
                }}>
                    <ImageLoad
                        style={styles.productImageStyle}
                        topLeftBorderRadius={6}
                        topRightBorderRadius={6}
                        customImagePlaceholderDefaultStyle={{ borderTopLeftRadius: 6, borderTopRightRadius: 6 }}
                        source={data.img ? { uri: data.img } : resources.images.img_placeholer_small} resizeMode={'cover'} />
                </View>
                <View style={[styles.short_Note]}>
                    <Text style={styles.titleView}>{data.title}</Text>
                    <Text style={styles.sort_Text}>{data.short_note} </Text>
                </View>
            </View> :
            <TouchableOpacity style={styles.cardCont} onPress={() => onMoveProduct(data.id)}>
                {/* <Image style={[styles.productImag, imageStyle]} source={data.image ? { uri: data.image } : resources.images.img_placeholer_small} resizeMode={'cover'} /> */}
                <ImageLoad
                    style={[styles.productImag]}
                    topLeftBorderRadius={6}
                    topRightBorderRadius={6}
                    customImagePlaceholderDefaultStyle={{ borderTopLeftRadius: 6, borderTopRightRadius: 6 }}
                    source={data.image ? { uri: data.image } : resources.images.img_placeholer_small}
                    resizeMode={'cover'} />
                <Text style={[styles.nameTextStyle]} numberOfLines={1} ellipsizeMode={"tail"}>{data.product_name}</Text>
                <View style={[styles.rowDirection]}>
                    <Text style={[styles.priceTextStyle]} numberOfLines={1} ellipsizeMode={"tail"}>₹ {data.price} /{data.rental_freq}</Text>
                    {/* <Text style={[styles.priceCrossTextStyle]} numberOfLines={1} ellipsizeMode={"tail"}>{priceLabel ? priceLabel : ""}</Text> */}
                </View>
            </TouchableOpacity>

    )
}

export default ProductHorizontalView;


