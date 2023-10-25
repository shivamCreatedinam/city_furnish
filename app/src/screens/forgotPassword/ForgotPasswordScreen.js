import React, { Component } from 'react';
import { View, Text, KeyboardAvoidingView } from 'react-native';
import styles from './styles'
import Header from '../../genriccomponents/header/HeaderAndStatusBar'
import Button from '../../genriccomponents/button/Button'
import MaterialInput from '../../genriccomponents/input/MaterialInput'
import resources from '../../../res';
import { validateEmail, renderInputError } from '../../utility/Utils'
import { hitSendOtpOnEmailApi } from '../../redux/actions/OtpAction'
import APILoadingHOC from "../../genriccomponents/HOCS/APILoadingHOC";
import { connect } from 'react-redux';
import AppToast from '../../genriccomponents/appToast/AppToast'

class ForgotPasswordScreen extends Component {
    static ROUTE_NAME = "ForgotPasswordScreen";
    constructor(props) {
        super(props)
        this.emailData = this.props.route.params.emailData ? this.props.route.params.emailData : "";
        this.state = {
            error: {},
            email: ""
        }
    }

    componentDidMount() {
        this.previousEmail()
    }
    previousEmail = () => {
        this.setState({
            email: this.emailData
        })
    }

    renderHeader = () => {
        return (
            <Header
                headerTitle={resources.strings.FORGOT_PASSWORD_TITLE}
                onBackClick={this.onBackClick}

            />
        )
    }

    render() {
        const { email, error } = this.state
        return (
            <View style={styles.fullScreen}>
                {this.renderHeader()}
                <KeyboardAvoidingView>
                    <View style={{ marginHorizontal: 20, marginTop: 20 }}>
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>{resources.strings.FORGOT_PASSWORD_INFO_TEXT}</Text>
                        </View>
                        <MaterialInput
                            label={resources.strings.Email}
                            inputProps={{
                                keyboardType: 'email-address',
                            }}
                            value={this.data ? this.data : email}
                            onChangeText={this.onChangeEmailText}
                            error={renderInputError("email", error)}
                            errorKey={"email"}
                            callbackToRemoveError={this.callbackToRemoveError} >

                        </MaterialInput>
                        <View style={styles.buttonContainer}>
                            <Button rounded btnText={resources.strings.SUBMIT}
                                onPress={() => { this.onContinuePressed() }} />
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
                error : error
            })
        }
    }
    onContinuePressed = () => {
        const isValid = this.validate();
        if (!isValid) {
            return;
        }
        const { email } = this.state;
        let e = email.trim().toLowerCase()
        if (validateEmail(e)) {
            this.props.hitSendOtpOnEmailApi(e)
                .then((data) => {
                    this.props.navigation.navigate('OtpScreen', { data: e, callbackWithoutParam: this.onOtpVerified });
                }).catch((error) => {
                    AppToast(error)
                });
        }
    }
    onOtpVerified = () => {
        const { email } = this.state;
        this.props.navigation.navigate("ResetPasswordScreen", { emailData: email.trim().toLowerCase() })
    }
    onBackClick = () => {
        this.props.navigation.goBack()
    }
    onChangeEmailText = (text) => {
        this.setState({ email: text })
    }
    validate = () => {
        const { email } = this.state
        let errorObject = {};
        if (email.trim() == "") {
            errorObject.email = resources.strings.emailCannotBeEmpty;
        } else if (email && email.trim().length > 100) {
            errorObject.email = resources.strings.email100length;
        } else if (!validateEmail(email && email.trim())) {
            errorObject.email = resources.strings.enterValidEmail;
        }
        this.setState({ error: errorObject });
        return Object.keys(errorObject).length == 0;
    }
}

const mapStateToProps = (state) => {
    return {};
};
let container = connect(mapStateToProps, { hitSendOtpOnEmailApi })(ForgotPasswordScreen);
let loader = APILoadingHOC(container);

loader.getIntent = () => {
    return {
        routeName: ForgotPasswordScreen.ROUTE_NAME,
    };
};

export default loader;


