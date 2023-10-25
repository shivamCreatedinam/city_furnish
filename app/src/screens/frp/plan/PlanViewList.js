import React from "react"
import { View, Text, FlatList,Image } from "react-native"
import styles from './styles'
import FrpDetailCard from '../../../genriccomponents/frpCard/FrpDetailCard'
import NetInfo from '@react-native-community/netinfo'
import resources from "../../../../res"


function checkInternetAndCall(data, selectedIndex, props,index) {
    const { onPressItem } = props;
    NetInfo.fetch().then(state => {
        if (!state.isConnected) {
            return
        } else {
            onPressItem(data, selectedIndex,index)
        }
    });
}

function PlanViewList(props) {
    const { serverData, selectedSliderIndex } = props;
    return (
        <View style={[styles.mainContainer, props.customStyle ? props.customStyle : {}]}>
            {serverData.length > 0 ?
                <FlatList
                    style={{ width: '100%' }}
                    showsHorizontalScrollIndicator={false}
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                    data={serverData}
                    renderItem={({ item, index }) =>
                        <FrpDetailCard
                            data={item}
                            itemKey={index}
                            onPressItem={() => { checkInternetAndCall(item, selectedSliderIndex, props,index) }}
                            selectedSliderIndex={selectedSliderIndex}
                        />
                    }
                    numColumns={1}
                    keyExtractor={(item, index) => index.toString()}
                /> :
                renderEmptyListView()}
        </View>
    )
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
export default PlanViewList