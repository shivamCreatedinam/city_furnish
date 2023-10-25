import React, { Component } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import { isiPhoneX } from '../../utility/Utils';
import AppToast from '../../genriccomponents/appToast/AppToast'
import Modal from "react-native-modal";
import resources from '../../../res'

const CREDIT_SCORE_REQUIRE = 0
const KYC_REQUIRE = 1
const AUTO_PAYMENT_REQUIRE = 2

function KycViewModal(props) {
    const { visibleModal, onPressBackDrop } = props
    return (
        <Modal
            avoidKeyboard
            animationOutTiming={0}
            onBackdropPress={() => onPressBackDrop()}
            onRequestClose={() => onPressBackDrop()}
            isVisible={visibleModal === 'bottom'}
            style={styles.bottomModal}
        >
            {renderViewTypes(props)}
        </Modal>
    )
}

function renderViewTypes(props) {
    const { titlemodel, descriptionModel, onClickPickType, orderItem, onPressBackDrop } = props
    console.log("orderItem",orderItem);
    return (

        <View style={{
            borderRadius: 8,
            alignItems: 'flex-start', 
            marginHorizontal: 15,
            bottom: 24,
            backgroundColor: "rgba(255,255,255,0.8)"
        }}>
            <View style={{margin:10}}>
                <Text style={{
                    color: resources.colors.appColor,
                    fontSize: 20,
                    fontFamily: resources.fonts.bold,
                }}>
                    {titlemodel}
                </Text>
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
            <View style={{ height: 1, width: '100%', backgroundColor: resources.colors.inputLabel }} />
            {orderItem && orderItem.state == KYC_REQUIRE ? <TouchableOpacity style={{ height: 55, width: '100%', alignItems: 'center', justifyContent: 'center' }}
             onPress={() => { onClickPickType('add_documents') }}>
                <Text style={{
                    color: resources.colors.textBlack,
                    fontSize: 20,
                    fontFamily: resources.fonts.medium,
                }}>
                    KYC Documents
              </Text>
            </TouchableOpacity> : <TouchableOpacity style={{ height: 55, width: '100%', alignItems: 'center', justifyContent: 'center' }}
             onPress={() => { onClickPickType('edit_documents') }}>
                <Text style={{
                    color: resources.colors.textBlack,
                    fontSize: 20,
                    fontFamily: resources.fonts.medium,
                }}>
                    Resubmit KYC Documents
              </Text>
            </TouchableOpacity> }
            {orderItem.isUpfrontPayment ? null : <React.Fragment>
                <View style={{ height: 1, width: '100%', backgroundColor: resources.colors.inputLabel }} />
                <TouchableOpacity 
                    style={[styles.btnStyle, 
                        orderItem.isUpfrontPayment ? { backgroundColor: '#ccc' } : { }
                    ]}
                    onPress={() => { 
                        orderItem.isUpfrontPayment ? AppToast("Please Upload KYC Documents First!") : onClickPickType('autopay') 
                    }}
                    disabled={orderItem.isUpfrontPayment ? true : false}
                    >
                    <Text style={{
                        color: resources.colors.textBlack,
                        fontSize: 20,
                        fontFamily: resources.fonts.medium,
                    }}>
                        Setup Autopay
                </Text>
                </TouchableOpacity>
            </React.Fragment>}
            <View style={{ height: 1, width: '100%', backgroundColor: resources.colors.inputLabel }} />
            <TouchableOpacity style={{ height: 55, width: '100%', alignItems: 'center', justifyContent: 'center' }}
                onPress={() => { onPressBackDrop() }}>
                <Text style={{
                    color: resources.colors.red,
                    fontSize: 21,
                    fontFamily: resources.fonts.medium,
                }}>
                    Cancel
              </Text>
            </TouchableOpacity>
            <View style={{ height: 1, backgroundColor: resources.colors.inputLabel }} />
        </View>

    )
}

export { KycViewModal };

const styles = StyleSheet.create({
    bottomModal: {
        justifyContent: 'flex-end',
        margin: 0,
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
    btnStyle: {
        height: 55, 
        width: '100%', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: resources.colors.white
    }
})