import React, { Component } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import Modal from "react-native-modal";
import resources from '../../../res';
import { isiPhoneX } from '../../utility/Utils';


function ShippimgAddressModal(props) {
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
    const { titlemodel } = props
    const { full_name, shipping_address } = props.data
    console.log(props.orderData)
    return (

        <View style={{
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            alignItems: 'flex-start', 
            marginHorizontal: 0,
            bottom: 0,
            backgroundColor: "white"
        }}>
              <TouchableOpacity onPress={() => { onPressBackDrop() }} style={styles.closeButton}>
                <Image source={require("../../../res/images/productDetail/close.png")} />
            </TouchableOpacity>
            <View style={styles.boxLayout}>
                
                <View style={{ height: 1, width: '10%', backgroundColor: resources.colors.inputLabel }} />
                <Text style={{
                    color: resources.colors.textBlack,
                    fontSize: 20,
                    lineHeight: isiPhoneX ? 20 : 20,
                    fontFamily: resources.fonts.medium,
                }}>
                    {titlemodel}
                </Text>

                <Text style={styles.nameText}>
                    {full_name}
                </Text>

                <View>
                    <Text style={styles.mobileText}>Mobile Number</Text>
                    <Text>9988776655</Text>
                </View>

                <View style={{marginTop:20}}> 
                    <Text style={styles.mobileText}>Email</Text>
                    <Text>test@gmail.com</Text>
                </View>

                <View style={{marginTop:20}}> 
                    <Text style={styles.mobileText}>Complete address</Text>
                    <Text>{shipping_address}</Text>
                </View>

               
            </View>
            
            
           
            <View style={{ height: 20, backgroundColor: resources.colors.inputLabel }} />
        </View>

    )
}

export { ShippimgAddressModal };

const styles = StyleSheet.create({
    bottomModal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    mobileText:{
        color:"#71717A",
        fontSize:12,
        fontWeight:'400',
        fontFamily:resources.fonts.regular
    },
    nameText:{
        fontSize:18,
        fontWeight:'500',
        fontFamily:resources.fonts.medium,
        color:'#45454A',
        marginTop:20,
        marginBottom:20
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
    },
    subTitleText:{
        color:'#9A9AA2',
        fontFamily : resources.fonts.regular,
        fontSize:14
      },
      divider1 : {
        height : StyleSheet.hairlineWidth,
        backgroundColor:'#DDDDDF',
        marginTop : 15,
        marginBottom:15,
        marginRight:20
      },
})