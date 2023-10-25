import React from 'react';
import SpInAppUpdates, { UPDATE_TYPE, } from 'sp-react-native-in-app-updates';
import { View, Platform, Text, TouchableOpacity, Clipboard, Image, ImageBackground, Share } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import styles from './styles'
import HeaderWithProfilePic from '../../genriccomponents/header/HeaderWithProfilePic'
import Button from '../../genriccomponents/button/Button'
import resources from '../../../res'
import Icon from 'react-native-vector-icons/FontAwesome';
import { showMessage, hideMessage } from "react-native-flash-message";
const HIGH_PRIORITY_UPDATE = 5; // Arbitrary, depends on how you handle priority in the Play Console

export default class InAppUpdateScreen extends React.Component {
    static ROUTE_NAME = "InAppUpdateScreen";
    constructor(props) {
        super(props);
        this.appVersion = this.props.route.params && this.props.route.params.appVersion ? this.props.route.params.appVersion : {}
        this.state = {
            needsUpdate: false,
            otherData: null,
        };

        this.checkForUpdates = () => {
            this.checkUpdatesForVersionCode(this.appVersion)
        };

        this.checkUpdatesForVersionCode = (appCurrentVersion) => {
            this.inAppUpdates.checkNeedsUpdate({
                curVersion: appCurrentVersion
            }).then((result) => {
                this.setState({
                    needsUpdate: result.shouldUpdate,
                    otherData: result,
                }, () => {
                    const icon = (<Icon name="download" size={30} color={resources.colors.white} type="fontawesome" />);
                        showMessage({
                            message: 'Cityfurnish Update?',
                            description: 'no update available for Cityfurnish.',
                            duration: 2500,
                            type: "success",
                            icon: { icon: 'success', position: "left" },
                        });
                });
            });
        }

        this.onStatusUpdate = (status) => {
            const { 
            // status,
            bytesDownloaded, totalBytesToDownload, } = status;
            // do something
            console.log(`@@ ${JSON.stringify(status)}`);
        };

        this.inAppUpdates = new SpInAppUpdates();
    }

    startUpdating = () => {
        if (this.state.needsUpdate) {
            let updateType;
            if (Platform.OS === 'android' && this.state.otherData) {
                const otherData = this.state.otherData;
                updateType = otherData.updatePriority >= HIGH_PRIORITY_UPDATE
                    ? UPDATE_TYPE.IMMEDIATE
                    : UPDATE_TYPE.FLEXIBLE;
            }
            this.inAppUpdates.addStatusUpdateListener(this.onStatusUpdate);
            this.inAppUpdates.startUpdate({
                updateType, // android only, on iOS the user will be promped to go to your app store page
            });
        }
        else {
            showMessage({
                message: 'Cityfurnish Update?',
                description: "doesn't look like we need an update",
                duration: 2500,
                type: "success",
                icon: { icon: 'success', position: "left" },
            });
        }
    }

    renderHeader = () => {
        return (
            <HeaderWithProfilePic
                headerTitle={'Cityfurnish Update'}
                isBackIconVisible={false}
                isProfileIconVisible={false}
                changeColor={true}
                headerColor={styles.headerColor}
                statusBarColor={"#E24E4A"}
                navigateProps={this.props.navigation}
                onBackClick={this.onBackClick} />
        )
    }
    onBackClick = () => {
        this.props.navigation.goBack()
    }

    render() {
        const { needsUpdate } = this.state;
        return (
            <View style={styles.fullScreen}>
                {this.renderHeader()}
                <KeyboardAwareScrollView
                    bounces={false}
                    style={styles.fullScreen}
                    keyboardShouldPersistTaps="never"
                    showsVerticalScrollIndicator={false}>
                    <View style={styles.fullScreen}>


                        <ImageBackground source={resources.images.referral_background}
                            style={styles.backgroundImage} resizeMode={'contain'}>

                            <View style={styles.container}>
                                <Text style={styles.haveYourFriendText}>{'Update Cityfurnish?'.toUpperCase()}</Text>
                                <Text style={styles.shareYourReferral}>{'Cityfurnish recommends you to update application to latest version.'}</Text>
                                <Icon name="download" size={33} color={resources.colors.white} type="fontawesome" style={styles.coinsIconStyle} />
                                <Text style={styles.coinsPriceText}>Need Update : {needsUpdate ? 'YES' : 'NO'}</Text>
                                
                                <View style={styles.btnView}>
                                    <Button
                                        btnStyle={styles.buttonStyle}
                                        touchOpacityStyle={styles.btnTouchStyle}
                                        rounded btnText={'Check for updates'}
                                        onPress={() => { this.checkForUpdates() }} />
                                </View>
                                <View style={styles.btnView}>
                                    <Button
                                        disableTouch={true}
                                        btnStyle={needsUpdate ? styles.buttonStyle : styles.buttonDisabledStyle}
                                        touchOpacityStyle={styles.btnTouchStyle}
                                        rounded btnText={'Start Updating'}
                                        onPress={() => { needsUpdate ? this.startUpdating() : console.log("No Update") }} />
                                </View>
                            </View>
                        </ImageBackground>
                    </View>
                </KeyboardAwareScrollView>
            </View>
        )
    }
}