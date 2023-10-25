import React, { Component } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import { isiPhoneX, isPlatformIOS } from '../../utility/Utils';
import Modal from "react-native-modal";
import resources from '../../../res'
import { AddonsCategoryList } from '../category/subCategory/addonsCategory/AddonsCategoryList'
import NormalTenureSlider from '../../genriccomponents/slider/NormalTenureSlider';



function RentDurationModal(props) {
    const { visibleModal, onPressBackDrop } = props
    
    return (
        <Modal
            avoidKeyboard
            animationOutTiming={0}
            onBackdropPress={() => onPressBackDrop()}
            onRequestClose={() => onPressBackDrop()}
            isVisible={visibleModal}
            style={styles.bottomModal}
        >
           
            {renderViewTypes(props)}
        </Modal>
    )
}

function renderViewTypes(props) {
    const {onChangeTab, dataSet,defaultItem,onSliderCallback,serverData,rental_frequency_message,titlemodel, descriptionModel, onClickPickType, onPressBackDrop, productList, onAddonsMoveProduct } = props
    return (

        <View style={{
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            alignItems: 'center', 
            marginHorizontal: 0,
            bottom: 0,
            backgroundColor: "rgba(255,255,255,0.9)"
        }}>
              <TouchableOpacity onPress={() => { onPressBackDrop() }} style={styles.closeButton}>
                <Image source={require("../../../res/images/productDetail/close.png")} />
            </TouchableOpacity>
            <View style={styles.boxLayout}>
                {/* <Text style={{
                    color: resources.colors.appColor,
                    fontSize: 20,
                    fontFamily: resources.fonts.bold,
                }}>
                    {titlemodel}
                </Text> */}
                <View style={{ height: 1, width: '10%', backgroundColor: resources.colors.inputLabel }} />
                <Text style={{
                    color: resources.colors.textBlack,
                    fontSize: 20,
                    lineHeight: isiPhoneX ? 20 : 20,
                    fontFamily: resources.fonts.medium,
                }}>
                    {descriptionModel}
                </Text>
            </View>
            
            
            <NormalTenureSlider
                defaultItem={defaultItem}
                onSliderCallback={onSliderCallback}
                serverData={serverData}
                rental_frequency_message={rental_frequency_message}
                dataSet={dataSet}
                onChangeTab={onChangeTab}
            />
           
            {/* <TouchableOpacity style={{ height: 55, width: '100%', alignItems: 'center', justifyContent: 'center' }}
                onPress={() => { onPressBackDrop() }}>
                <Text style={{
                    color: resources.colors.red,
                    fontSize: 21,
                    fontFamily: resources.fonts.medium,
                }}>
                    Cancel
              </Text>
            </TouchableOpacity> */}
            <View style={{ height: 20, backgroundColor: resources.colors.inputLabel }} />
        </View>

    )
}

export { RentDurationModal };

const styles = StyleSheet.create({
    bottomModal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    closeButton : {
        backgroundColor : 'white',
        width:30,
        height:30,
        borderRadius:30/2,
        justifyContent:'center',
        alignItems:'center',
        position:'absolute',
        top : -40,
        right:16
    },
    featureLabel: {
        fontFamily: 'Gill Sans',
        fontSize: 15,
        height: 25,
        marginHorizontal: 10,
        marginTop: 4,
        color: resources.colors.BLACK_TEXT,
        fontWeight: '500',
    },
    categoryLabel: {
        fontFamily: 'Gill Sans',
        fontSize: 15,
        alignSelf: 'center',
        color: resources.colors.BLACK_TEXT,
        fontWeight: '500',
    },
    boxLayout: {
        margin: 16,
        shadowColor: "rgba(0, 0, 0, 0.2)",
        shadowOffset: {
            width: 1,
            height: 2,
        },
        shadowOpacity: 1,
        shadowRadius: 2,
        elevation: 5,
    },
    boxBottom: { 
        height: 2, 
        width: '100%', 
        backgroundColor: resources.colors.inputLabel,
        shadowColor: "rgba(0, 0, 0, 0.1)",
        shadowOffset: {
            width: 1,
            height: 2,
        },
        shadowOpacity: 1,
        shadowRadius: 2,
        elevation: 4,
    },
    productBox: {
        // flex: 1,
        height: 400,
        // marginHorizontal: 20,
        // marginBottom: 20,
    }
})