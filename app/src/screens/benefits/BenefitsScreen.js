import React, { Component } from 'react';
import { View, Text, FlatList, Image } from 'react-native'
import styles from './styles'
import resources from '../../../res'
import HeaderWithProfile from '../../genriccomponents/header/HeaderWithProfilePic'

class BenefitsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [
                {

                    "product_name": "Free Delivery",
                    "seourl": "We guarantee that high-quality products can be delivered to you in the fastest time possible without any additional charges.",
                    "image": resources.images.img_Benefit1
                }, {

                    "product_name": "Free Upgrade",
                    "seourl": "Tired of the same product? Then upgrade to try another, new design and enjoy the changes!",
                    "image": resources.images.img_Benefit2
                }, {

                    "product_name": "Free Relocation",
                    "seourl": "You are eligible for the free relocation of your furniture. We'll relocate your rented products for free.",
                    "image": resources.images.img_Benefit3
                }, {

                    "product_name": "Damage Waiver",
                    "seourl": "Don't fret over normal wear and tear while you use our products on rent. You have got that covered.",
                    "image": resources.images.img_Benefit4
                }, {

                    "product_name": "Free Installation",
                    "seourl": "The installation will be free of cost. We will facilitate Installation & Demo at the time of delivery or at your convenience.",
                    "image": resources.images.img_Benefit5
                }, {

                    "product_name": "Mint Condition",
                    "seourl": "Quality matters to you, and for us also! That's why we do a strict quality-check for every product before delivery. All our products on rentals are in premium quality.",
                    "image": resources.images.img_Benefit6
                }
            ],

        }
    }
   

    onBackClick = () => {
        this.props.navigation.goBack()
    }
    contacUsList = ({ item, index }) => {
        return (
            (index % 2) ?
                <View style={styles.imageThumbnail}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }} >
                        <View style={{ marginHorizontal: 10, marginVertical: 5, flex: 1 }}>
                            <Text style={styles.mainText} >{item.product_name}</Text>
                            <Text style={styles.dataText}>{item.seourl}</Text>
                        </View>
                        <View >
                            <Image style={{ width: 120, height: 100, }} source={item.image} />
                        </View>
                    </View>
                </View> :
                <View style={styles.imageThumbnail}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }} >
                        <View >
                            <Image style={{ width: 120, height: 100, }} source={item.image} />
                        </View>
                        <View style={{ marginHorizontal: 10, marginVertical: 5, flex: 1 }}>
                            <Text style={styles.mainText} >{item.product_name}</Text>
                            <Text style={styles.dataText}>{item.seourl}</Text>
                        </View>

                    </View>
                </View>
        );
    }
  
    renderHeader = () => {
        return (
            <HeaderWithProfile
                headerTitle={resources.strings.BENEFITS}
                isBackIconVisible={true}
                onBackClick={this.onBackClick}
                navigateProps={this.props.navigation}
            />
        )
    }
    render() {
        return (
            <View style={styles.fullScreen}>
                {this.renderHeader()}
                <View style={styles.container}>
                    <FlatList
                        data={this.state.products}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={this.contacUsList}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>
        )
    }
}
export default BenefitsScreen