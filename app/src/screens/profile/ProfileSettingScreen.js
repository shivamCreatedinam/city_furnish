import React, { Component } from 'react';
import { View, KeyboardAvoidingView } from 'react-native';
import styles from './styles'
import HeaderWithProfilePic from '../../genriccomponents/header/HeaderWithProfilePic'
import Button from '../../genriccomponents/button/Button'
import MaterialInput from '../../genriccomponents/input/MaterialInput'
import resources from '../../../res';
import { connect } from 'react-redux'
import APILoadingHOC from "../../genriccomponents/HOCS/APILoadingHOC"
import * as actions from '../../redux/actions/ProfileAction'
import { hitSendOtpApi } from '../../redux/actions/OtpAction'
import { validateMobileNumber, validateEmail, isNumber } from '../../utility/Utils'
import AppToast from '../../genriccomponents/appToast/AppToast'

class ProfileSettingScreen extends Component {
    static ROUTE_NAME = "ProfileSettingScreen";
    constructor(props) {
        super(props)
        this.state = {
            name: "",
            originallyName: "",
            email: "",
            mobileNumber: "",
            isEmailVerified: false,
            isMobileVerified: false,
            registeredMobileNum: "",
            originallyNumberVerified: false,
            originallyEmailVerified: false,
            registeredEmail: "",
            isEmailFocused: false,
            isMobileFocused: false,
            error: {}
        }
    }
    componentDidMount() {
        this.getProfileData()
    }

    getProfileData = () => {
        this.props.hitGetProfileApi()
            .then((data) => {
                this.setData(data);
            })
            .catch((error) => {
                console.log("getProfileData error", error)
            });
    }
    setData = (data) => {
        this.setState({
            name: data.data.full_name,
            originallyName: data.data.full_name,
            email: data.data.email,
            registeredEmail: data.data.email,
            mobileNumber: data.data.phone_no,
            registeredMobileNum: data.data.phone_no,
            isEmailVerified: data.data.is_email_verified == "Yes" ? true : false,
            originallyEmailVerified: data.data.is_email_verified == "Yes" ? true : false,
            isMobileVerified: data.data.is_mobile_verified == "Yes" ? true : false,
            originallyNumberVerified: data.data.is_mobile_verified == "Yes" ? true : false,
        })
    }

    renderHeader = () => {
        return (
            <HeaderWithProfilePic
                headerTitle={resources.strings.PROFILE_SETTING}
                navigateProps={this.props.navigation}
                isBackIconVisible
                onBackClick={this.onBackClick} />
        )
    }

    render() {
        const { name, email, mobileNumber, isEmailVerified, isMobileVerified, isEmailFocused, isMobileFocused } = this.state
        return (
            <View style={styles.fullScreen}>
                {this.renderHeader()}
                <KeyboardAvoidingView>
                    <View style={styles.mainContainer}>
                        <MaterialInput
                            label={resources.strings.NAME}
                            value={name}
                            error={this.renderInputError("name")}
                            errorKey={"name"}
                            callbackToRemoveError={this.callbackToRemoveError}
                            onChangeText={this.onChangeNameText}
                            inputProps={{
                                autoCaptialize: 'none',
                                returnKeyType: 'next'
                            }} />
                        <MaterialInput
                            label={resources.strings.EMAIL_ADDRESS}
                            value={email}
                            error={this.renderInputError("email")}
                            errorKey={"email"}
                            callbackToRemoveError={this.callbackToRemoveError}
                            onChangeText={this.onChangeEmailText}
                            onPressVerify={this.onPressEmailVerify}
                            inputProps={{
                                autoCaptialize: 'none',
                                returnKeyType: 'next',
                                keyboardType: "email-address",
                                editable: isEmailVerified ? false : true
                            }}
                            isVerified={isEmailVerified}
                            isVerifedTextVisible
                            onFocus={this.onFoucusEmailField}
                            onBlur={this.onBlurrEmailField}
                            isBorderverifiedBtnThick={isEmailFocused}
                        />
                        <MaterialInput
                            label={resources.strings.MOBILE_NUMBER}
                            value={mobileNumber}
                            error={this.renderInputError("mobileNum")}
                            errorKey={"mobileNum"}
                            callbackToRemoveError={this.callbackToRemoveError}
                            onChangeText={this.onChangeMobileNumberText}
                            onPressVerify={this.onPressMobileNumberVerify}
                            inputProps={{
                                keyboardType: 'phone-pad',
                                autoCaptialize: 'none',
                                maxLength: 10,
                            }}
                            isVerified={isMobileVerified}
                            isVerifedTextVisible
                            onFocus={this.onFoucusMobileField}
                            onBlur={this.onBlurrMobileField}
                            isBorderverifiedBtnThick={isMobileFocused} />
                        <View style={styles.buttonContainer}>
                            <Button rounded btnText={resources.strings.SAVE}
                                btnStyle={{ borderRadius: 4 }}
                                onPress={() => { this.onSavePressed() }} />
                        </View>
                    </View>

                </KeyboardAvoidingView>
            </View>
        );
    }

    callbackToRemoveError = (key) => {
        let { error } = this.state
        if (error.hasOwnProperty(key)) {
            error[key] = ""
            this.setState({
                error: error
            })
        }
    }
    onFoucusEmailField = () => {
        this.setState({
            isEmailFocused: true
        })
    }
    onBlurrEmailField = () => {
        this.setState({
            isEmailFocused: false
        })
    }
    onFoucusMobileField = () => {
        this.setState({
            isMobileFocused: true
        })
    }
    onBlurrMobileField = () => {
        this.setState({
            isMobileFocused: false
        })
    }
    onNumberVerified = () => {
        this.setState({
            isMobileVerified: true
        })
    }
    onEmailVerified = () => {
        this.setState({
            isEmailVerified: true
        })
    }
    onBackClick = () => {
        this.props.navigation.goBack()
    }
    onChangeNameText = (text) => {
        this.setState({ name: text })
    }
    onChangeEmailText = (text) => {
        this.setState({
            email: text,
            isEmailVerified: this.checkOldWithNewEmail(text)
        })
    }
    onChangeMobileNumberText = (text) => {
        this.setState(
            {
                mobileNumber: text,
                isMobileVerified: this.checkOldWithNewMobileNum(text)
            })
    }

    checkOldWithNewMobileNum = (newNum) => {
        const { registeredMobileNum, originallyNumberVerified } = this.state
        if (registeredMobileNum == "") {
            return false
        }
        if (registeredMobileNum === newNum && originallyNumberVerified) {
            return true
        } else {
            return false
        }
    }
    checkOldWithNewEmail = (newEmail) => {
        const { registeredEmail, originallyEmailVerified } = this.state
        if (registeredEmail == "") {
            return false
        }
        if (registeredEmail === newEmail && originallyEmailVerified) {
            return true
        } else {
            return false
        }
    }

    onSavePressed = () => {
        const isValid = this.validate();
        if (!isValid) { return; }
        const { name, originallyName, mobileNumber, registeredMobileNum, isMobileVerified } = this.state;

        if (name != originallyName && mobileNumber == registeredMobileNum) {
            this.callUpdateApi();
        }
        else if (name != originallyName && mobileNumber != registeredMobileNum && isMobileVerified) {
            this.callUpdateApi();
        }
        else if (name == originallyName && mobileNumber == registeredMobileNum) {
            this.callUpdateApi();
        }
        else if (name == originallyName && mobileNumber != registeredMobileNum && isMobileVerified) {
            this.callUpdateApi();
        } else {
            AppToast("Please verify your mobile number")
        }
    }

    callUpdateApi = () => {
        const { name, mobileNumber } = this.state
        this.props.hitUpdateProfileApi(name.trim(), mobileNumber.trim())
            .then((data) => {
                AppToast("Profile Updated Successfully")
            })
            .catch((error) => {
                console.log("error", error)
            });
    }
    onPressEmailVerify = () => {
        const { email } = this.state;
        this.props.hitVerifyEmailApi(email)
            .then((data) => {
                this.props.navigation.navigate("OtpScreen", { data: email, callback: this.onEmailVerified })
            })
            .catch((error) => {
                AppToast(error)
            });
    }
    onPressMobileNumberVerify = () => {
        const { mobileNumber } = this.state;
        if (mobileNumber.trim() != "" && validateMobileNumber(mobileNumber.trim())) {
            this.props.hitSendOtpApi(mobileNumber.trim(), false, false)
                .then((data) => {
                    this.props.navigation.navigate('OtpScreen', { data: mobileNumber, callback: this.onNumberVerified });
                }).catch((error) => {
                    AppToast(error)
                });
        }
        else {
            AppToast("Please enter valid Mobile number.");
        }
    }

    renderInputError = (key) => {
        const { error } = this.state;
        if (!error) { return null; }
        const errorKeys = Object.keys(error);
        if (errorKeys == 0) { return null; }
        if (!errorKeys.includes(key)) { return null; }
        return error[key]
    };

    validate = () => {
        const { name, mobileNumber, email } = this.state;
        let errorObject = {};
        if (name.trim() == "") {
            errorObject.name = resources.strings.nameCannotBeEmpty;
        } else if (name.trim().length > 20) {
            errorObject.name = resources.strings.name20length;
        }
        if (mobileNumber.trim() == "") {
            errorObject.mobileNum = resources.strings.phoneCannotBeEmpty;
        } else if (mobileNumber.trim().length > 10) {
            errorObject.mobileNum = resources.strings.phone10length;
        } else if (!validateMobileNumber(mobileNumber)) {
            errorObject.mobileNum = resources.strings.enterValidPhone;
        } else if (!isNumber(mobileNumber)) {
            errorObject.mobileNum = resources.strings.phoneFieldShouldBeNumber;
        }
        if (email.trim() == "") {
            errorObject.email = resources.strings.emailCannotBeEmpty;
        } else if (email.trim().length > 100) {
            errorObject.email = resources.strings.email100length;
        } else if (!validateEmail(email.trim())) {
            errorObject.email = resources.strings.enterValidEmail;
        }

        this.setState({ error: errorObject });
        return Object.keys(errorObject).length == 0;
    };
}

const mapStateToProps = (state) => {
    return {};
};
let container = connect(mapStateToProps, { ...actions, hitSendOtpApi })(ProfileSettingScreen);
let loader = APILoadingHOC(container);

loader.getIntent = () => {
    return {
        routeName: ProfileSettingScreen.ROUTE_NAME,
    };
};

export default loader;
