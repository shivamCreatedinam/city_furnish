import React from "react"
import { View, Text, Image, TouchableOpacity, ImageBackground } from "react-native"
import styles from './styles'
import resources from "../../../res";
import NetInfo from '@react-native-community/netinfo'

function checkInternetAndCall(data, props) {
    const { onPressItem } = props;
    NetInfo.fetch().then(state => {
        if (!state.isConnected) {
            return
        } else {
            onPressItem(data)
        }
    });
}



function FrpProductHolder(props) {
    const { data,onRemoveItem } = props;
    return (
        <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.viewProductHolder,]} onPress={() => { checkInternetAndCall(data,props) }}>
            {data.selectedImgUrl ?
                <ImageBackground style={styles.imgCover}
                    resizeMode='cover'
                    imageStyle={{ borderRadius: 6 }}
                    source={{ uri: data.selectedImgUrl }}>
                    <TouchableOpacity style={{alignSelf:'flex-end',width:20,height:20,alignItems:'center',justifyContent:'center'}} onPress={()=>{onRemoveItem(data)}}>
                        <Image style={{ width: 15, height: 15,  }}
                            source={resources.images.inc_small_cross} />
                    </TouchableOpacity>

                </ImageBackground>
                :
                <View style={styles.viewHolder}>
                    <Image style={{ width: 25, height: 25 }}
                        source={data.icon ? { uri: data.icon } : resources.images.img_placeholer_small} />
                    <Text style={styles.textProduct}
                        ellipsizeMode='tail' numberOfLines={1}>
                        {data.name}
                    </Text>

                </View>}
        </TouchableOpacity>
    )
}

export default FrpProductHolder;