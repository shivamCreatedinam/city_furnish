import React, { Component } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import Modal from "react-native-modal";
import resources from '../../../res';
import { isiPhoneX } from '../../utility/Utils';




function PaymentSUmmaryModal(props) {
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
    const { duration, delivery, grand_total, total_deposite, total_gst, discount_amount, total_renntal, coins_redeemed, products,
        is_upfront, savings, saving_percent, monthly_renntal, advance_renntal,shipping_address,order_date } = props.data

    return (

        <View style={{
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            
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

                

                <View style={{marginTop:20}}>
                    <View style={styles.row}>
                        <View>
                            <Text style={styles.labelText}>Duration</Text>
                        </View>
                        <View>
                            <Text style={styles.labelText1}>₹{duration}</Text>
                        </View>
                    </View>
                </View>

                <View style={{marginTop:20}}>
                    <View style={styles.row}>
                        <View>
                            <Text style={styles.labelText}>Advance Monthly Rental</Text>
                        </View>
                        <View>
                            <Text style={styles.labelText1}>₹{total_renntal ? total_renntal : "0"}</Text>
                        </View>
                    </View>
                </View>

                <View style={{marginTop:20}}>
                    <View style={styles.row}>
                        <View>
                            <Text style={styles.labelText}>Refundable Deposit</Text>
                        </View>
                        <View>
                            <Text style={styles.labelText1}>₹{total_deposite}</Text>
                        </View>
                    </View>
                </View>


                <View style={{marginTop:20}}>
                    <View style={styles.row}>
                        <View>
                            <Text style={styles.labelText}>Taxes</Text>
                        </View>
                        <View>
                            <Text style={styles.labelText1}>₹{total_gst}</Text>
                        </View>
                    </View>
                </View>

                <View style={{marginTop:20}}>
                    <View style={styles.row}>
                        <View>
                            <Text style={styles.labelText}>Discount</Text>
                        </View>
                        <View>
                            <Text style={styles.labelText2}>₹{discount_amount}</Text>
                        </View>
                    </View>
                </View>

                <View style={{marginTop:20}}>
                    <View style={styles.row}>
                        <View>
                            <Text style={styles.labelText}>Delivery</Text>
                        </View>
                        <View>
                            <Text style={styles.labelText2}>{delivery}</Text>
                        </View>
                    </View>
                </View>

                <View style={{marginTop:20}}>
                    <View style={styles.row}>
                        <View>
                            <Text style={styles.labelText}>City Coins redeemed</Text>
                        </View>
                        <View>
                            <Text style={styles.labelText2}>₹{coins_redeemed}</Text>
                        </View>
                    </View>
                </View>


                <View style={{marginTop:20}}>
                    <View style={styles.row}>
                        <View>
                            <Text style={styles.labelText}>Total amount paid</Text>
                        </View>
                        <View>
                            <Text style={styles.labelText1}>₹{grand_total}</Text>
                        </View>
                    </View>
                </View>

               
            </View>
            
            
           
            <View style={{ height: 20, backgroundColor: "white" }} />
        </View>

    )
}

export { PaymentSUmmaryModal };

const styles = StyleSheet.create({
    bottomModal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    labelText:{
        color:'#71717A',
        fontSize:14,
        fontWeight:'500',
        fontFamily:resources.fonts.medium
    },
    labelText1:{
        color:'#222222',
        fontSize:14,
        fontWeight:'500',
        fontFamily:resources.fonts.medium
    },
    labelText2:{
        color:'#257B57',
        fontSize:14,
        fontWeight:'500',
        fontFamily:resources.fonts.medium
    },
    row:{
        flexDirection:'row',
        justifyContent:'space-between'
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