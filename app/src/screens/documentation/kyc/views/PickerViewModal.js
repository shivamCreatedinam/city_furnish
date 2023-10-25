import React, { Component } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import Modal from "react-native-modal";
import resources from '../../../../../res';

export const DOCUMENT = 1
export const IMAGE_PICK = 2
export const CAMERA = 3



function PickerViewModal(props) {
    const { visibleModal, onPressBackDrop } = props
    return (
        <Modal
            avoidKeyboard
            animationOutTiming={0}
            onBackdropPress={() => onPressBackDrop()}
            isVisible={visibleModal === 'bottom'}
            style={styles.bottomModal}
        >
            {renderPickTypes(props)}
        </Modal>
    )
}

function renderPickTypes(props) {
    const { onClickPickType, onPressBackDrop } = props
    return (

        <View style={{
            borderRadius: 8,

            alignItems: 'center', marginHorizontal: 10,
            bottom: 24,
            backgroundColor: "rgba(255,255,255,0.8)"
        }}>
            <TouchableOpacity style={{ height: 70, width: '100%', alignItems: 'center', justifyContent: 'center' }}
             onPress={() => { onClickPickType(DOCUMENT) }}>
                <Text style={{
                    color: resources.colors.textBlack,
                    fontSize: 22,
                    fontFamily: resources.fonts.medium,
                }}>
                    Documents
              </Text>
            </TouchableOpacity>
            <View style={{ height: 1, width: '100%', backgroundColor: resources.colors.inputLabel }} />
            <TouchableOpacity style={{ height: 70, width: '100%', alignItems: 'center', justifyContent: 'center' }}
             onPress={() => { onClickPickType(IMAGE_PICK)  }}>
                <Text style={{
                    color: resources.colors.textBlack,
                    fontSize: 22,
                    fontFamily: resources.fonts.medium,
                }}>
                    Choose from Library
              </Text>
            </TouchableOpacity>
            <View style={{ height: 1, width: '100%', backgroundColor: resources.colors.inputLabel }} />
            <TouchableOpacity style={{ height: 70, width: '100%', alignItems: 'center', justifyContent: 'center' }}
             onPress={() => { onClickPickType(CAMERA)  }}>
                <Text style={{
                    color: resources.colors.textBlack,
                    fontSize: 22,
                    fontFamily: resources.fonts.medium,
                }}>
                    Take Photo
              </Text>
            </TouchableOpacity>
            <View style={{ height: 1, width: '100%', backgroundColor: resources.colors.inputLabel }} />
            <TouchableOpacity style={{ height: 70, width: '100%', alignItems: 'center', justifyContent: 'center' }}
                onPress={() => { onPressBackDrop() }}>
                <Text style={{
                    color: resources.colors.red,
                    fontSize: 23,
                    fontFamily: resources.fonts.medium,
                }}>
                    Cancel
              </Text>
            </TouchableOpacity>
            <View style={{ height: 1, backgroundColor: resources.colors.inputLabel }} />
        </View>

    )
}

export { PickerViewModal };

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
})