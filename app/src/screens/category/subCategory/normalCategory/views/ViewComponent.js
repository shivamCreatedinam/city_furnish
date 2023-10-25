
import React from 'react'
import { View, Text, Image, TouchableOpacity, ImageBackground } from 'react-native'
import styles from './styles'
import resources from '../../../../../../res'
const ProductCell = (props) => {
    const { customStyle, imageStyle, isHeartSelected, priceLabel } = props;
    return (
        <View style={[styles.cellStyle, customStyle]}>
            <TouchableOpacity style={[styles.imageThumbnail]} onPress={props.onPress}>
                <ImageBackground style={[styles.productImageStyle, imageStyle]} source={resources.images.img_placeholer_large} resizeMode={'stretch'} >
                    <TouchableOpacity onPress={props.onPressHeartIcon}>
                        {isHeartSelected ? <Image source={{ uri: props.src }} style={styles.heartImageStyle} resizeMode={'contain'} />
                            : <Image source={{ uri: props.src }} style={styles.heartImageStyle} resizeMode={'contain'} />}
                    </TouchableOpacity>
                </ImageBackground>
                <Text style={[styles.nameTextStyle]} numberOfLines={1} ellipsizeMode={"tail"}>{props.productData.product_name} </Text>
                <View style={[styles.rowDirection]}>
                    <Text style={[styles.priceTextStyle]} numberOfLines={1} ellipsizeMode={"tail"}>₹{props.productData.price}</Text>
                    <Text style={[styles.priceCrossTextStyle]} numberOfLines={1} ellipsizeMode={"tail"}>{priceLabel ? priceLabel : ""}</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}
export default ProductCell;