import React, { Component } from 'react'
import { Dimensions, Image, ScrollView, Text, View } from 'react-native'
import resources from '../../../../res';
import styles from '../../cart/styles';

const Cityfurnish = () => {
    return (
      <View style={{}}>
        <Text style={styles.freeServiceHeaderTitle}>Why Cityfurnish?</Text>
        <ScrollView contentContainerStyle={{marginTop:24}} horizontal={true} showsHorizontalScrollIndicator={false}>
            <View style={styles.freeServiceItem}>
                <Image style={styles.freeServiceImage} source={require('../../../../res/images/Image/freeShoping.png')}/>
                <Text style={styles.txtFreeServiceTitle}>{"Free\nshipping"}</Text>
                <Text style={styles.txtFreeServiceDetail} numberOfLines={4}>Get your furniture delivered to your doorstep with no extra shipping cost</Text>
            </View>
            <View style={styles.freeServiceItem}>
                <Image style={styles.freeServiceImage} source={require('../../../../res/images/Image/freeIns.png')}/>
                <Text style={styles.txtFreeServiceTitle} >{"Free\ninstallation"}</Text>
                <Text style={styles.txtFreeServiceDetail} numberOfLines={4}>No need to pay for furniture assembly. We will install your furniture for free</Text>
            </View>
            <View style={styles.freeServiceItem}>
                <Image style={styles.freeServiceImage} source={require('../../../../res/images/Image/freeRelo.png')}/>
                <Text style={styles.txtFreeServiceTitle} >{"Free\nrelocation"}</Text>
                <Text style={styles.txtFreeServiceDetail} numberOfLines={4}>Planning to relocate? We’ll help you relocate your furniture for free</Text>
            </View>
            <View style={styles.freeServiceItem}>
                <Image style={styles.txtFreeServiceTitle} source={require('../../../../res/images/Image/mint.png')}/>
                <Text style={styles.txtFreeServiceTitle} >{"Mint\nnew products"}</Text>
                <Text style={styles.txtFreeServiceDetail} numberOfLines={4}>Assured products. You'll be renting furniture that looks & feels brand new</Text>
            </View>
        </ScrollView>
      </View>
    )
}


export default Cityfurnish
