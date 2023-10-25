import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Clipboard, Image, ImageBackground, Share } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import styles from './styles'
import HeaderWithProfilePic from '../../genriccomponents/header/HeaderWithProfilePic'
import Button from '../../genriccomponents/button/Button'
import resources from '../../../res'
import { connect } from 'react-redux'
import APILoadingHOC from "../../genriccomponents/HOCS/APILoadingHOC"
import * as actions from '../../redux/actions/ReferralCodeAction'
import AppToast from '../../genriccomponents/appToast/AppToast'


class ReferralCodeScreen extends Component {
    static ROUTE_NAME = "ReferralCodeScreen";
    constructor(props) {
        super(props);
        this.state = {
            referralData: {},
            referralCode: {}
        }
    }
    componentDidMount() {
        this.loadData()
    }

    loadData = () => {
        this.props.getReferralCodeApi()
            .then((data) => {
                this.setState({
                    referralData: data.data.referral_setting,
                    referralCode: data.data.referral_code,
                })
            })
            .catch((error) => {
                console.log(error, "error")
            });
    }

    renderHeader = () => {
        return (
            <HeaderWithProfilePic
                headerTitle={resources.strings.REFFERAL_CODE}
                isBackIconVisible
                changeColor={true}
                headerColor={styles.headerColor}
                statusBarColor={"#E24E4A"}
                navigateProps={this.props.navigation}
                styleHeaderContainer={{backgroundColor:'white'}}
                onBackClick={this.onBackClick} />
        )
    }
    onBackClick = () => {
        this.props.navigation.goBack()
    }
    onSharePressed = () => {
       this.onShareClick()
    }
    onShareClick = () => {
        const {referralCode,referralData } = this.state
       
        if(referralCode.referral_code && referralData.amount){
            let msg = `${referralData.social_message}`
            Share.share({
                message: msg,
                url: "",
                title: 'Share'
            }, {
                // Android only:
                dialogTitle: 'Share',
                // iOS only:
                excludedActivityTypes: [
                    'com.apple.UIKit.activity.PostToTwitter'
                ]
            })
        }
       
    }
    copyCuponText = () => {
        const { referralCode } = this.state;
        Clipboard.setString(referralCode.referral_code)
        AppToast(resources.strings.COPIED_CODE_MSG)
    }
    render() {
        const { referralData, referralCode } = this.state;
        return (
            <View style={styles.fullScreen}>
                {this.renderHeader()}
                <KeyboardAwareScrollView
                    bounces={false}
                    style={styles.fullScreen}
                    keyboardShouldPersistTaps="never"
                    showsVerticalScrollIndicator={false}>
                    <View style={styles.fullScreen}>
                    <View style={styles.paddingClass}>
                    <Text style={styles.pageTitle}>Refer a friend</Text>
                    <Text style={styles.subTitle}>and save some money on your next order with cityfurnish coins</Text>
                    </View>
                        <View style={styles.paddingClass}>
                            <ImageBackground style={styles.backgroundImage}  source={resources.images.referral_back}>
                                <View style={styles.container}>
                                    <Text style={styles.haveYourFriendText}>{resources.strings.HAVE_YOUR_FRIEND_TEXT}</Text>
                                    <Text style={styles.shareYourReferral}>{resources.strings.SHARE_YOUR_REFERRAL_CODE}</Text>
                                </View>
                                <Text style={styles.yourRefeCodeText}>{resources.strings.YOUR_REFERRAL_CODE}</Text>
                                    <View style={styles.referralCodeStyle}>
                                        <Text style={styles.cuponTextStyle}>{referralCode.referral_code}</Text>
                                        
                                    </View>
                                    <TouchableOpacity style={styles.copyTextStyle} onPress={this.copyCuponText}>
                                            <Text style={styles.copyTextColor}>{resources.strings.COPY}</Text>
                                        </TouchableOpacity>

                                        <View style={styles.viewTitle}>
                                            <Text style={styles.subTitle}>You and your friend gets</Text>
                                            <Text style={styles.pageTitle1}>{parseInt(referralData.amount ? referralData.amount : 0)}</Text>
                                        </View>
                                        <View style={styles.btnView}>
                                    <Button
                                        btnStyle={styles.buttonStyle}
                                        touchOpacityStyle={styles.btnTouchStyle}
                                        rounded btnText={resources.strings.SHARE}
                                        onPress={() => { this.onSharePressed() }} />
                                </View>
                            </ImageBackground>
                        </View>
                        
                        {/* <ImageBackground source={resources.images.referral_background}
                            style={styles.backgroundImage} resizeMode={'contain'}>

                            <View style={styles.container}>
                                <Text style={styles.haveYourFriendText}>{resources.strings.HAVE_YOUR_FRIEND_TEXT.toUpperCase()}</Text>
                                <Text style={styles.shareYourReferral}>{resources.strings.SHARE_YOUR_REFERRAL_CODE}</Text>
                                <Image source={resources.images.coins_icn} style={styles.coinsIconStyle} resizeMode={'contain'} />
                                <Text style={styles.coinsPriceText}>{parseInt(referralData.amount ? referralData.amount : 0)} CF Coins</Text>
                                <Text style={styles.yourRefeCodeText}>{resources.strings.YOUR_REFERRAL_CODE}</Text>
                                <View style={styles.copyCodeContainer}>
                                    <View style={styles.referralCodeStyle}>
                                        <Text style={styles.cuponTextStyle}>{referralCode.referral_code}</Text>
                                    </View>
                                    <TouchableOpacity style={styles.copyTextStyle} onPress={this.copyCuponText}>
                                        <Text style={styles.copyTextColor}>{resources.strings.COPY}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.btnView}>
                                    <Button
                                        btnStyle={styles.buttonStyle}
                                        touchOpacityStyle={styles.btnTouchStyle}
                                        rounded btnText={resources.strings.SHARE}
                                        onPress={() => { this.onSharePressed() }} />
                                </View>
                            </View>
                        </ImageBackground> */}
                    </View>
                </KeyboardAwareScrollView>
            </View>
        );
    }
}
const mapStateToProps = (state) => {
    return {};
};
let container = connect(mapStateToProps, { ...actions })(ReferralCodeScreen);
let loader = APILoadingHOC(container);

loader.getIntent = () => {
    return {
        routeName: ReferralCodeScreen.ROUTE_NAME,
    };
};

export default loader;
