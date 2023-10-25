import React, { Component } from 'react'
import { Dimensions, Image, ScrollView, Text, View } from 'react-native'
import resources from '../../../res'
import styles from './styles'

const itemSpace = 25
const ThingsYouShouldComponents = (props) => {
    
    if(props?.type == "detailpage"){
        return (
                <View style={styles.thingsContainer}>
                    <Text style={styles.thingsTitleText}>Things you should know</Text>
                    <View style={styles.thingsItem}>
                        <Image source={resources.images.inc_small_all}  style={styles.imgThings} />
                            <Text style={styles.txtThingsItem}>{`KYC Documents to be submitted before Delivery`}</Text>
                    </View>
                    <View style={styles.thingsItem}>
                            <Image source={resources.images.inc_small_freecan} style={styles.imgThings} />
                            <Text style={styles.txtThingsItem}>{`Free Cancellation before Delivery`}</Text>
                    </View>
                    <View style={styles.thingsItem}>
                            <Image source={resources.images.inc_small_freeins} style={styles.imgThings} />
                            <Text style={styles.txtThingsItem}>{`Free installation *`}</Text>
                    </View>
                    <View style={styles.thingsItem}>
                            <Image source={resources.images.inc_small_allpro} style={styles.imgThings} />
                            <Text style={styles.txtThingsItem}>{`All Products are in Mint Condition`}</Text>
                    </View>
                   
                </View>
            )
    }else{
        return (
                <View style={styles.thingsContainer}>
                    <Text style={styles.thingsTitleText}>Things you should know</Text>
                    <View style={styles.thingsItem}>
                        <Image source={resources.images.inc_small_all}  style={styles.imgThings} />
                            <Text style={styles.txtThingsItem}>{`KYC Documents to be submitted before Delivery`}</Text>
                    </View>
                    <View style={styles.thingsItem}>
                            <Image source={resources.images.inc_small_freecan} style={styles.imgThings} />
                            <Text style={styles.txtThingsItem}>{`Free Cancellation before Delivery`}</Text>
                    </View>
                    <View style={styles.thingsItem}>
                            <Image source={resources.images.inc_small_freeins} style={styles.imgThings} />
                            <Text style={styles.txtThingsItem}>{`Free installation *`}</Text>
                    </View>
                    <View style={styles.thingsItem}>
                            <Image source={resources.images.inc_small_allpro} style={styles.imgThings} />
                            <Text style={styles.txtThingsItem}>{`All Products are in Mint Condition`}</Text>
                    </View>
                    <View style={styles.thingsItem}>
                            <Image source={resources.images.inc_small_internal} style={styles.imgThings} />
                            <Text style={styles.txtThingsItem}>{`Your rental payment and tenure will begin from the date of delivery`}</Text>
                    </View>
                    <View style={styles.thingsItem}>
                            <Image source={resources.images.inc_small_orderplace} style={styles.imgThings} />
                            <Text style={styles.txtThingsItem}>{`Once the order has been placed, you might be required to share a few documents for KYC`}</Text>
                    </View>
                </View>
            )
    }    
    
}


export default ThingsYouShouldComponents
