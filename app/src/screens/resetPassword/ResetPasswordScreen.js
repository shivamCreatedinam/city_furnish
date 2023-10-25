import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux'
import styles from './styles'
import Header from '../../genriccomponents/header/HeaderAndStatusBar'
import Button from '../../genriccomponents/button/Button'
import MaterialInput from '../../genriccomponents/input/MaterialInput'
import resources from '../../../res';
import * as actions from '../../redux/actions/ResetPasswordAction'
import APILoadingHOC from "../../genriccomponents/HOCS/APILoadingHOC"
import AppToast from '../../genriccomponents/appToast/AppToast'

class ResetPasswordScreen extends Component {
    static ROUTE_NAME = "ResetPasswordScreen";
    constructor(props) {
        super(props)
        this.emailData = this.props.route.params && this.props.route.params.emailData ? this.props.route.params.emailData : "";
        this.fromMyAccountScreen = this.props.route.params && this.props.route.params.fromMyAccountScreen ? this.props.route.params.fromMyAccountScreen : false;
        this.state = {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
            isOldPassVisible: true,
            isNewPassVisible: true,
            isConfirmPassVisible: true,
            error: {},
            isOldPasswordFocused: false,
            isPasswordFocused: false,
            isCPasswordFocused: false,
        }
    }



    renderHeader = () => {
        return (
            <Header
                headerTitle={resources.strings.CHANGE_PASSWORD}
                onBackClick={this.onBackClick}

            />
        )
    }
    onPressOldPasswordEyeIcon = () => {
        this.setState({ isOldPassVisible: !this.state.isOldPassVisible })
    }

    onPressNewPasswordEyeIcon = () => {
        this.setState({ isNewPassVisible: !this.state.isNewPassVisible })
    }
    onPressConfirmPasswordEyeIcon = () => {
        this.setState({ isConfirmPassVisible: !this.state.isConfirmPassVisible })
    }
    renderInputError = (key) => {
        const { error } = this.state;
        if (!error) { return null; }
        const errorKeys = Object.keys(error);
        if (errorKeys == 0) { return null; }
        if (!errorKeys.includes(key)) { return null; }
        return error[key]
    };
    onSavePressed = () => {
        const isValid = this.validate();
        if (!isValid) {
            return;
        }
        const { oldPassword, newPassword, confirmPassword } = this.state;
        if (this.emailData) {
            if (this.fromMyAccountScreen) {
                if (oldPassword == newPassword) {
                    AppToast("Your old and new passwords are same")
                    return
                }

                this.props.hitResetPasswordApi(this.emailData, newPassword, confirmPassword, oldPassword)
                    .then((data) => {
                        AppToast(data.message)
                        this.onBackClick()
                    })
                    .catch((error) => {
                        AppToast(error)
                        console.log("Error inside Change Password", error)
                    });
            } else {
                this.props.hitResetPasswordApi(this.emailData, newPassword, confirmPassword, oldPassword)
                    .then((data) => {
                        AppToast(data.message)
                        this.props.navigation.navigate("SigninScreen")

                    })
                    .catch((error) => {
                        AppToast(error)
                        console.log("Error inside Change Password", error)
                    });
            }

        }

    }

    onBackClick = () => {
        this.props.navigation.goBack()
    }
    onChangeOldText = (text) => {
        this.setState({ oldPassword: text })
    }
    onChangePasswordText = (text) => {
        this.setState({ newPassword: text })
    }
    onChangeConfirmPasswordText = (text) => {
        this.setState({ confirmPassword: text })
    }
    validate = () => {
        const { oldPassword, newPassword, confirmPassword } = this.state;
        let errorObject = {};
        if (this.fromMyAccountScreen) {
            if (oldPassword.trim() == "") {
                errorObject.oldPass = resources.strings.passwordCannotBeEmpty;
            } else if (oldPassword.trim().length < 6) {
                errorObject.oldPass = resources.strings.password6length;
            }
            else if (oldPassword.trim().length > 16) {
                errorObject.oldPass = resources.strings.password16length;
            }
        }



        if (newPassword.trim() == "") {
            errorObject.newPass = resources.strings.passwordCannotBeEmpty;
        } else if (newPassword.trim().length < 6) {
            errorObject.newPass = resources.strings.password6length;
        }
        else if (newPassword.trim().length > 16) {
            errorObject.newPass = resources.strings.password16length;
        }
        if (confirmPassword.trim() == "") {
            errorObject.confirmPass = resources.strings.passwordCannotBeEmpty;
        } else if (confirmPassword.trim().length < 6) {
            errorObject.confirmPass = resources.strings.password6length;
        }
        else if (confirmPassword.trim().length > 16) {
            errorObject.confirmPass = resources.strings.password16length;
        }
        if (newPassword != confirmPassword) {
            errorObject.confirmPass = resources.strings.MISMATCH_PASSWORD;
        }
        this.setState({ error: errorObject });
        return Object.keys(errorObject).length == 0;
    };
    render() {
        const { oldPassword, newPassword, confirmPassword, isOldPassVisible, isNewPassVisible,
            isConfirmPassVisible, isPasswordFocused, isOldPasswordFocused,
            isCPasswordFocused } = this.state
        return (
            <View style={styles.fullScreen}>
                {this.renderHeader()}
                <View style={{
                    flexDirection: 'column',
                    marginHorizontal: 20, marginTop: 20
                }}>
                    {(this.fromMyAccountScreen) && < MaterialInput
                        isPasswordEyeVisible
                        label={resources.strings.Current_PASSWORD}
                        error={this.renderInputError("oldPass")}
                        errorKey={"oldPass"}
                        callbackToRemoveError={this.callbackToRemoveError}
                        value={oldPassword}
                        onChangeText={this.onChangeOldText}
                        isPassVisible={isOldPassVisible}
                        inputProps={{
                            secureTextEntry: isOldPassVisible,
                            autoCaptialize: 'none',
                        }}
                        onPressEyeIcon={this.onPressOldPasswordEyeIcon}
                        onFocus={this.onFoucusOldPasswordField}
                        onBlur={this.onBlurrOldPasswordField}
                        isBorderEyeThick={isOldPasswordFocused} />
                    }
                    <MaterialInput
                        isPasswordEyeVisible
                        label={resources.strings.NEW_PASSWORD}
                        error={this.renderInputError("newPass")}
                        errorKey={"newPass"}
                        callbackToRemoveError={this.callbackToRemoveError}
                        value={newPassword}
                        onChangeText={this.onChangePasswordText}
                        isPassVisible={isNewPassVisible}
                        inputProps={{
                            secureTextEntry: isNewPassVisible,
                            autoCaptialize: 'none',
                        }}
                        onPressEyeIcon={this.onPressNewPasswordEyeIcon}
                        onFocus={this.onFoucusPasswordField}
                        onBlur={this.onBlurrPasswordField}
                        isBorderEyeThick={isPasswordFocused} />
                    <MaterialInput
                        isPasswordEyeVisible
                        label={resources.strings.CONFIRM_PASSWORD}
                        error={this.renderInputError("confirmPass")}
                        errorKey={"confirmPass"}
                        callbackToRemoveError={this.callbackToRemoveError}
                        value={confirmPassword}
                        onChangeText={this.onChangeConfirmPasswordText}
                        isPassVisible={isConfirmPassVisible}
                        inputProps={{
                            secureTextEntry: isConfirmPassVisible,
                            autoCaptialize: 'none',
                        }}
                        onPressEyeIcon={this.onPressConfirmPasswordEyeIcon}
                        onFocus={this.onFoucusCPasswordField}
                        onBlur={this.onBlurrCPasswordField}
                        isBorderEyeThick={isCPasswordFocused} />
                    <View style={styles.buttonContainer}>
                        <Button rounded btnText={resources.strings.SAVE}
                            onPress={() => { this.onSavePressed() }} />
                    </View>
                </View>
            </View>
        );
    }
    callbackToRemoveError = (key) => {
        let { error } = this.state
        if (error.hasOwnProperty(key)) {
            error[key] = ""
            this.setState({
                error : error
            })
        }
    }
    onFoucusOldPasswordField = () => {
        this.setState({
            isOldPasswordFocused: true
        })
    }

    onBlurrOldPasswordField = () => {
        this.setState({
            isOldPasswordFocused: false
        })
    }

    onFoucusPasswordField = () => {
        this.setState({
            isPasswordFocused: true
        })
    }

    onBlurrPasswordField = () => {
        this.setState({
            isPasswordFocused: false
        })
    }
    onFoucusCPasswordField = () => {
        this.setState({
            isCPasswordFocused: true
        })
    }
    onBlurrCPasswordField = () => {
        this.setState({
            isCPasswordFocused: false
        })
    }
}

const mapStateToProps = (state) => {
    return {};
};

let passwordContainer = connect(mapStateToProps, { ...actions })(ResetPasswordScreen);
let passwordWithLoader = APILoadingHOC(passwordContainer);

export default passwordWithLoader;

