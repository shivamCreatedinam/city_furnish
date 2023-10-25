import React, { Component } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Linking } from 'react-native'
import styles from './styles'
import HeaderWithProfile from '../../genriccomponents/header/HeaderWithProfilePic'
import resources from '../../../res'
import { checkIfUserIsLoggedIn, showSigninAlert } from '../../utility/Utils'
import NetInfo from '@react-native-community/netinfo'
const SUPPORT_MOBILE = 918066084700  // Cityfunish support mobile number
const SUPPORT_EMAIL = 'mailto:hello@cityfurnish.com' // Cityfunish support email address
const SUPPORT_WHAATSAPP_MOBILE = 917428279052 // Cityfunish  whatsapp support mobile number

class ContactUsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contactUsData: [{
                image: resources.images.icn_services,
                mainText: 'Raise a Service Request',
                dataText: 'Log request against your order from My Account section',
                id: 0
            }, {
                image: resources.images.icn_phone,
                mainText: 'Phone',
                dataText: '080-66084700 ( 09:00AM - 09:00PM )',
                id: 1
            }, {
                image: resources.images.icn_email,
                mainText: 'Email',
                dataText: 'hello@cityfurnish.com',
                id: 2
            },
            // {
            //     image: resources.images.icn_whatsapp,
            //     mainText: 'WhatsApp',
            //     dataText: 'Click here to contact us directly on WhatsApp',
            //     id: 3
            // }
            ],

        }
    }
    onBackClick = () => {
        this.props.navigation.goBack()
    }
    renderHeader = () => {
        return (
            <HeaderWithProfile
                headerTitle={resources.strings.CONTACT_US}
                isBackIconVisible={true}
                onBackClick={this.onBackClick}
                navigateProps={this.props.navigation}
            />
        )
    }
    sendOnWhatsApp = () => {
        let msg = "";
        let url = 'whatsapp://send?text=' + msg + '&phone=' + SUPPORT_WHAATSAPP_MOBILE;
        Linking.openURL(url).then((data) => {
            console.log('WhatsApp Opened');
        }).catch(() => {
            alert('Make sure Whatsapp installed on your device');
        });
    }
    dialCall = (item) => {
        switch (item.id) {
            case 0:
                this.checkInternetAndGotoScreen("MyOrder")
                break;
            case 1:
                if (Platform.OS === 'android') {
                    Linking.openURL(`tel:${SUPPORT_MOBILE}`)
                }
                else {
                    Linking.openURL(`telprompt:${SUPPORT_MOBILE}`)
                }
                break;
            case 2:
                Linking.openURL(SUPPORT_EMAIL)
                break;
            case 3:
                this.sendOnWhatsApp()
                break;
        }
    };

    checkInternetAndGotoScreen = (screen) => {
        if (checkIfUserIsLoggedIn()) {
            NetInfo.fetch().then(state => {
                if (!state.isConnected) {
                    // SimpleToast.show("Please check your internet")
                    return
                } else {
                    this.props.navigation.navigate(screen)
                }
            });
        } else {
            showSigninAlert("ContactUsScreen")
        }
    }

    contacUsList = ({ item, index }) => {
        return (

            <TouchableOpacity
                style={styles.imageThumbnail}
                onPress={() => this.dialCall(item)} >
                <View style={styles.cell}>
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                        <View style={styles.imageStyle}>
                            <Image style={{ width: 48, height: 48, }} source={item.image ? item.image : resources.images.img_placeholer_small} />
                        </View>
                        <View style={{ justifyContent: 'center', flex: 1, marginRight: 3 }}>
                            <Text style={styles.mainText}>{item.mainText}</Text>
                            <Text style={styles.dataText}>{item.dataText}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
    render() {
        return (
            <View style={styles.fullScreen}>
                {this.renderHeader()}
                <View style={{ marginHorizontal: 20, marginTop: 5 }}>
                    <Text style={styles.findAnswerText}>{resources.strings.CAN_NOT_FIND_ANSWER}</Text>
                    <Text style={styles.proposalText}>{resources.strings.FILL_FREE_CONTACT_US}</Text>
                </View>
                <View style={styles.container}>
                    <FlatList
                        data={this.state.contactUsData}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={this.contacUsList}

                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>
        )
    }


}
export default ContactUsScreen