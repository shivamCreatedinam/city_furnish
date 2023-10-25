import React, { Component } from 'react';
import { TextInput, View, Text, TouchableOpacity, Keyboard, AppState } from 'react-native';
import styles from './OtpStyle'
import Header from '../../genriccomponents/header/HeaderAndStatusBar'
import CustomButton from '../../genriccomponents/button/Button'
import strings from '../../../res/constants/strings';
import * as actions from '../../redux/actions/OtpAction'
import { hitVerifyAndLoginApi } from '../../redux/actions/SigninAction'
import { onUpdateCartBadgeCount } from '../../redux/actions/CartAction'
import { onUpdateWishlistBadgeCount } from '../../redux/actions/WishListAction'
import { updateFcmTokenToServer } from '../../redux/actions/LogoutAction'
import AsyncStorage from '@react-native-community/async-storage';
import AsyncStorageContaints from '../../utility/AsyncStorageConstants'
import APILoadingHOC from "../../genriccomponents/HOCS/APILoadingHOC";
import { connect } from 'react-redux';
import resources from '../../../res';
import { validateEmail, isPlatformIOS, getOtpFromText } from '../../utility/Utils'
import AppToast from '../../genriccomponents/appToast/AppToast'
import { CommonActions } from '@react-navigation/native';
import RNOtpVerify from 'react-native-otp-verify';
import AppUser from '../../utility/AppUser';



class OtpScreen extends Component {
    static ROUTE_NAME = "OtpScreen";

    constructor(props) {
        super(props);
        this.data = this.props.route.params && this.props.route.params.data;
        this.callback = this.props.route.params && this.props.route.params.callback ? this.props.route.params.callback : null
        this.callbackWithoutParam = this.props.route.params && this.props.route.params.callbackWithoutParam ? this.props.route.params.callbackWithoutParam : null
        this.isLoginType = this.props.route.params && this.props.route.params.isLogin ? this.props.route.params.isLogin : false
        this.isSignupType = this.props.route.params && this.props.route.params.isSignup ? this.props.route.params.isSignup : false
        this.isGoForwardToHome = this.props.route.params && this.props.route.params.isGoForwardToHome ? this.props.route.params.isGoForwardToHome : false
        this.state = {
            otp: ["", "", "", "", ""],
            current: 0,
            isTimerFinished: false,
            counter: 30,
        }
        this.interval = null;

        this.smsHashh = ""

        this.foregroundState = ""
        this.backgroundState = ""

        this.compMount = ""
    }


    componentDidMount() {
        this.compMount = "componentDidMount "
        this.startCounter()
        let obj = AppUser.getInstance()
        this.smsHashh = obj.smsHash
        console.log('SMSHashh :: ',this.smsHashh)
        if (!isPlatformIOS) {
            RNOtpVerify.getOtp()
                .then(p => RNOtpVerify.addListener(this.otpHandler))
                .catch(p => console.log(p));
        }
        AppState.addEventListener('change', this._handleAppStateChange);
    }
    _handleAppStateChange = (nextAppState) => {
        if (nextAppState === 'active') {
            // console.log('App has come to the foreground!')
            this.foregroundDate = new Date();
            var difference = (this.foregroundDate - this.backgroundDate) / 1000;
            // console.log("You waited: " + difference + " seconds");


            const { counter } = this.state
            if (counter > 0 && !isNaN(difference)) {
                let value = counter - parseInt(difference - 2)
                if (value > 0) {
                    this.setState({ counter: value });
                } else {
                    this.setState({ counter: 0 });
                }

            }

            // this.foregroundState = `active => ${difference} =>counter ${counter}`

        }
        else if (nextAppState === 'background') {
            // console.log('App has come to the background!')
            this.backgroundDate = new Date();
            // const { counter } = this.state
            // this.foregroundState = `background  =>counter ${counter}`
        }
    }
    componentWillUnmount() {

        clearInterval(this.interval);
        if (!isPlatformIOS) {
            RNOtpVerify.removeListener();
        }
        AppState.removeEventListener('change', this._handleAppStateChange);
    }


    otpHandler = (message) => {
        console.log('SMS :: ', message)
        let detectedOtp = getOtpFromText(message)
        this.setState({
            otp: detectedOtp
        }, () => {
            if (this.refs[4]) {
                this.refs[4].focus();
            }
        })


    }


    otpChangeHandler = (index, text) => {
        if (text === "" || text === " ") {
            if (this.state.current >= 0) {
                let newOtp = this.state.otp.map((item, loc) => {
                    if (loc === index) {
                        return "";
                    } else {
                        return item;
                    }
                })
                this.setState({
                    otp: newOtp,
                    current: (this.state.current === 0) ? this.state.current : this.state.current - 1,
                }, () => {
                    this.focusNextField(this.state.current)
                })
            }
        } else {
            let newOtp = this.state.otp.map((item, loc) => {
                if (loc === index) {
                    return text;
                } else {
                    return item;
                }
            })
            this.setState({
                otp: newOtp,
                current: (this.state.current < this.state.otp.length - 1) ? this.state.current + 1 : this.state.current,
            }, () => {
                this.focusNextField(this.state.current)
            })
        }

    }

    focusNextField(nextField) {
        // console.log("nextField   ",nextField,"   next  ",this.refs[nextField])
        this.refs[nextField].focus();
    }

    validate = () => {
        const code = this.state.otp;
        if (code[0] == "" || code[1] == "" || code[2] == "" || code[3] == "" || code[4] == "") {
            AppToast(strings.errorEnterOtp)
            return false;
        }
        return true;

    }
    submitHandler = () => {
        if (this.validate()) {
            const code = this.state.otp.join("");
            Keyboard.dismiss();
            if (validateEmail(this.data)) {
                this.props.hitVerifyEmailWithOtpApi(this.data, code)
                    .then(
                        (data) => {
                            this.onVerifyOtp_Success(data);
                        }
                    ).catch((error) => {
                        AppToast("Invalid OTP")
                        this.props.onVerifyOtpFailureAction(error)
                    });
            } else {
                if (this.isGoForwardToHome) {
                    this.props.hitVerifyAndLoginApi(this.data, code)
                        .then((data) => {
                            AppToast(data.message)
                            this.saveFromAsynAndNavigate(data)
                        })
                        .catch((error) => {
                            AppToast(error)
                        });
                } else {
                    this.props.hitVerifyOtpApi(this.data, code)
                        .then(
                            (data) => {
                                this.onVerifyOtp_Success(data);
                            }
                        ).catch((error) => {
                            AppToast("Invalid OTP")
                            this.props.onVerifyOtpFailureAction(error)
                        });
                }


            }
        }
    }

    onVerifyOtp_Success = (data) => {
        if (data.status_code == 200) {
            this.props.onVerifyOtpSuccessAction(data)
            AppToast(data.message);
            if (this.callback) {
                this.callback && this.callback(this.state.otp.join(""))
                this.navigate()
            } else if (this.callbackWithoutParam) {
                this.callbackWithoutParam()
            }

        }
    }
    sendOTP = () => {
        Keyboard.dismiss();
        if (validateEmail(this.data)) {
            this.props.hitSendOtpOnEmailApi(this.data)
                .then((data) => {
                    this.startCounter()
                }).catch((error) => {
                    AppToast(error)
                });

        } else {
            this.props.hitSendOtpApi(this.data, this.isLoginType, this.isSignupType)
                .then((data) => {
                    //AppToast(data.message);
                    this.startCounter()
                }).catch((error) => {
                    AppToast(error)
                });
        }

    }

    reSendOTP = () => {
        this.setState({
            counter: 30,
            isTimerFinished: !this.state.isTimerFinished,
            otp: ["", "", "", "", ""],
            current: 0,
        }, () => {
            this.sendOTP()
        })
    }


    navigate = () => {
        this.props.navigation.goBack();
    }

    renderHeader = () => {
        return (
            <View style={styles.navbarContainer}>
                <Header headerTitle={strings.VERIFY} onBackClick={this.navigate} />
            </View>
        )
    }

    onFinishCounter = () => {
        this.setState({
            isTimerFinished: !this.state.isTimerFinished
        })
    }


    cleanUp = () => {
        clearInterval(this.interval);
        this.onFinishCounter();
    }

    decreaseCounter = () => {
        if (this.state.counter === 0) {
            return this.cleanUp();
        }
        this.setState({ counter: this.state.counter - 1 });
    }

    startCounter = () => {
        this.interval = setInterval(this.decreaseCounter, 1000);

    }
    getCounter = () => {
        const { counter } = this.state
        let len = counter.toString().length;
        if (len > 1) {
            return counter
        } else {
            return '0' + counter
        }
    }


    render() {
        const { isTimerFinished } = this.state
        return (
            <View style={styles.fullScreen}>

                {this.renderHeader()}
                {/* 
                <Text>{this.foregroundState}</Text>
                <Text>{this.backgroundState}</Text>
                <Text>{this.compMount}</Text> */}


                <Text style={styles.text}>{strings.OtpSscreenText}</Text>
                <View style={styles.parentView}>

                    <View style={[styles.textContainer]}>

                        <Text style={styles.enterOtpText}>{strings.enterOtpText}</Text>
                        <Text style={styles.number}>{this.data ? this.data : ""}</Text>
                    </View>
                    <View style={styles.inputContainer}>
                        {this.state.otp.map((item, index) => {
                            return (<TextInput
                                key={index + "otp"}
                                ref={index}
                                value={item} 
                                maxLength={1} 
                                autoFocus={index == this.state.current}
                                style={styles.input} 
                                onChangeText={this.otpChangeHandler.bind(this, index)}
                                keyboardType={'phone-pad'}
                                returnKeyType={'done'}
                                textContentType="oneTimeCode"
                            />);
                        })}
                    </View>
                    <View style={styles.buttonContainer}>
                        <CustomButton rounded btnText={strings.VERIFY} onPress={this.submitHandler} />
                    </View>
                    <Text style={styles.timerStyles}> 00:{this.getCounter()} </Text>
                    <View style={styles.notRecievedContainer}>
                        <Text style={styles.notRecText}>{strings.DIDNT_RECIEVED_CODE}</Text>
                    </View>
                    <TouchableOpacity
                        disabled={!isTimerFinished}
                        onPress={this.reSendOTP}>
                        <View style={styles.resendContainer}>
                            <Text style={[styles.resend, { color: isTimerFinished ? resources.colors.txtGetOTP : resources.colors.labelColor }]}>{strings.RESEND_OTP}</Text>
                            <View style={styles.underline} />
                        </View>
                    </TouchableOpacity>

                </View>
            </View>
        );
    }


    saveFromAsynAndNavigate = async (data) => {
        // console.log("Login resp =>>", JSON.stringify(data))
        const { toScreenName } = this.props
        let appUsrObj = AppUser.getInstance();
        appUsrObj.token = data.data.access_token;
        appUsrObj.userId = data.data.id.toString();
        appUsrObj.userDetails = data.data;

        if (appUsrObj.userDetails) {
            appUsrObj.itemsIncartCount = parseInt(appUsrObj.userDetails.itemsIncartCount)
            this.props.onUpdateCartBadgeCount(appUsrObj.itemsIncartCount)
            appUsrObj.wishlistCount = parseInt(appUsrObj.userDetails.WishlistItemsCount)
            this.props.onUpdateWishlistBadgeCount(appUsrObj.wishlistCount)
        }

        const userToken = [AsyncStorageContaints.UserToken, data.data.access_token];
        const userId = [AsyncStorageContaints.UserId, data.data.id.toString()];
        const userDetails = [AsyncStorageContaints.UserData, JSON.stringify(data.data)];
        const itemsIncartCount = [AsyncStorageContaints.cartBadgeCount, appUsrObj.userDetails.itemsIncartCount];
        const itemsInWishlistCount = [AsyncStorageContaints.wishlistBadgeCount, appUsrObj.userDetails.WishlistItemsCount.toString()];

        try {
            await AsyncStorage.multiSet([userToken, userId, userDetails, itemsIncartCount, itemsInWishlistCount])
            if (toScreenName == "") {
                const resetAction = CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'SelectCityScreen' }],
                });
                this.props.navigation.dispatch(resetAction);
            }
            else {
                let obj = AppUser.getInstance()
                let token = obj.fcmToken
                if (token) {
                    this.props.updateFcmTokenToServer(token)
                }
                this.props.navigation.pop()

                if (toScreenName.includes("ProductDetailScreen")) {
                    let arr = toScreenName.split('_');
                    let id = parseInt(arr[1])
                    this.props.navigation.navigate("ProductDetailScreen", { productId: id })
                } else {
                    this.props.navigation.navigate(toScreenName)
                }

            }

        } catch (e) {
            console.log("Error saving user details", e);
        }
    }

}
const mapStateToProps = (state) => {
    const { toScreenName } = state.skipLoginReducer
    return { toScreenName: toScreenName };
};
let otpContainer = connect(mapStateToProps, {
    ...actions, hitVerifyAndLoginApi
    , onUpdateCartBadgeCount,
    onUpdateWishlistBadgeCount,
    updateFcmTokenToServer
})(OtpScreen);
let OtpWithLoader = APILoadingHOC(otpContainer);

OtpWithLoader.getIntent = () => {
    return {
        routeName: OtpScreen.ROUTE_NAME,
    };
};

export default OtpWithLoader;
