import React, { Component } from 'react'
import { View, StatusBar, Text, Keyboard } from 'react-native'
import APILoadingHOC from "../../genriccomponents/HOCS/APILoadingHOC";
import { connect } from 'react-redux';
import styles from './styles'
import HeaderWithProfile from '../../genriccomponents/header/HeaderWithProfilePic'
import resources from '../../../res'
import MaterialInput from '../../genriccomponents/input/MaterialInput'
import Button from '../../genriccomponents/button/Button'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { validateMobileNumber, validateEmail, renderInputError, focusTo } from '../../utility/Utils'
import * as actions from '../../redux/actions/AddressAction'
import AppToast from '../../genriccomponents/appToast/AppToast'

class OfiiceEnquiryScreen extends Component {
    static ROUTE_NAME = "OfiiceEnquiryScreen";
    constructor(props) {
        super(props);
        this.state = {
            fullName: "",
            mobileNumber: "",
            city: "",
            email: "",
            requirement: "",
            error: {},
        }
        this.fullNameRef = React.createRef();
        this.mobileRef = React.createRef();
        this.emailRef = React.createRef();
        this.cityRef = React.createRef();
        this.requirementRef = React.createRef();

    }
    componentDidMount() {
        this.props.navigation.addListener('focus', () => this.componentDidFocus())

    }
    componentDidFocus = () => {
        // StatusBar.setBarStyle('dark-content');
        // StatusBar.setBackgroundColor(resources.colors.appColor);
    }

    focusToNext = (ref) => {
        focusTo(ref)
    }
    onChangeName = (text) => {
        this.setState({ fullName: text })
    }
    onChangeMobileNumber = (text) => {
        this.setState({ mobileNumber: text })
    }
    onChangeEmail = (text) => {
        this.setState({ email: text })
    }

    onChangeCity = (text) => {
        this.setState({ city: text })
    }
    onChangeRequrement = (text) => {
        this.setState({ requirement: text })
    }
    onPressBack = () => {
        this.props.navigation.goBack()
    }
    renderHeader = () => {
        return (
            <HeaderWithProfile
                headerTitle={resources.strings.OFFICE_ENQUIRY}
                isBackIconVisible={true}
                isProfileIconVisible={false}
                isLogoutVisible={false}
                onBackClick={this.onPressBack}
                navigateProps={this.props.navigation}
            />
        )
    }
    render() {
        const { fullName, mobileNumber, email, city, requirement, error, } = this.state
        return (
            <View style={styles.fullScreen}>
                {this.renderHeader()}
                <KeyboardAwareScrollView
                    style={{ marginTop: 10 }}
                    bounces={false}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                // extraScrollHeight={100}
                >
                    <View style={styles.container}>
                        <MaterialInput label={resources.strings.ENTER_FULL_NAME}
                            value={fullName}
                            onChangeText={this.onChangeName}
                            error={renderInputError("nameerr", error)}
                            errorKey={"nameerr"}
                            callbackToRemoveError={this.callbackToRemoveError}
                            inputProps={{
                                returnKeyType: 'next',
                                maxLength: 20,
                            }}
                            onSubmitEditing={() => this.focusToNext(this.fullNameRef)}
                        >
                        </MaterialInput>
                        <MaterialInput
                            label={resources.strings.ENTER_MOBILE_NO}
                            onChangeText={this.onChangeMobileNumber}
                            value={mobileNumber}
                            error={renderInputError("mobileerr", error)}
                            errorKey={"mobileerr"}
                            callbackToRemoveError={this.callbackToRemoveError}
                            inputProps={{
                                keyboardType: 'phone-pad',
                                autoCaptialize: 'none',
                                maxLength: 10,
                                returnKeyType: 'done',
                            }}
                            reference={this.fullNameRef}
                            onSubmitEditing={() => this.focusToNext(this.mobileRef)}
                        >
                        </MaterialInput>
                        <MaterialInput
                            label={resources.strings.ENTER_EMAIL}
                            onChangeText={this.onChangeEmail}
                            value={email}
                            error={renderInputError("Emailerr", error)}
                            errorKey={"Emailerr"}
                            callbackToRemoveError={this.callbackToRemoveError}
                            inputProps={{
                                keyboardType: 'email-address',
                                autoCaptialize: 'none',
                                maxLength: 50,
                                returnKeyType: 'next',
                            }}
                            reference={this.mobileRef}
                            onSubmitEditing={() => this.focusToNext(this.emailRef)}
                        >
                        </MaterialInput>
                        <MaterialInput
                            textColor={resources.colors.black}
                            label={resources.strings.ENTER_CITY}
                            onChangeText={this.onChangeCity}
                            value={city}
                            error={renderInputError("Cityerr", error)}
                            errorKey={"Cityerr"}
                            callbackToRemoveError={this.callbackToRemoveError}
                            inputProps={{
                                autoCaptialize: 'none',
                                maxLength: 50,
                                returnKeyType: 'next',
                            }}
                            reference={this.emailRef}
                            onSubmitEditing={() => this.focusToNext(this.cityRef)}
                        >
                        </MaterialInput>
                        <MaterialInput
                            label={resources.strings.ENTER_REQUREMENT}
                            onChangeText={this.onChangeRequrement}
                            error={renderInputError("Requrementerr", error)}
                            errorKey={"Requrementerr"}
                            callbackToRemoveError={this.callbackToRemoveError}
                            value={requirement}
                            inputProps={{
                                autoCaptialize: 'none',
                                returnKeyType: 'done',
                                multiline: true
                            }}
                            reference={this.cityRef}
                            // onSubmitEditing={() => this.focusToNext(this.requirementRef)}
                            onSubmitEditing={() => { Keyboard.dismiss() }}
                        >
                        </MaterialInput>
                        <Text style={styles.minimuLabel}>Minimum 30 Characters</Text>
                    </View>
                </KeyboardAwareScrollView>

                <View style={styles.submitBtn}>
                    <Button btnStyle={styles.buttonStyle} touchOpacityStyle={{}} rounded btnText={resources.strings.SUBMIT}
                        onPress={this.submitYourRequirement} />
                </View>
            </View>

        )
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
    submitYourRequirement = () => {
        const isValid = this.validate();
        if (!isValid) { return; }
        const { fullName,
            mobileNumber,
            email,
            city,
            requirement,
        } = this.state;
        this.props.hitOfficeEnquiryApi(fullName, email, mobileNumber, city, requirement)
            .then((resp) => {
                AppToast(resp.message)
                this.onPressBack()
            })
            .catch((error) => {
                AppToast("Error while submitting")
            })
    }
    validate = () => {
        const { fullName,
            mobileNumber,
            email,
            city,
            requirement,
        } = this.state;
        let errorObject = {};
        if (fullName.trim() == "") {
            errorObject.nameerr = resources.strings.nameCannotBeEmpty;
        } else if (fullName && fullName.length > 20) {
            errorObject.nameerr = resources.strings.name20length;
        } else if (fullName && fullName.length <= 1) {
            errorObject.nameerr = resources.strings.name2length
        }
        if (mobileNumber.trim() == "") {
            errorObject.mobileerr = resources.strings.phoneCannotBeEmpty;
        } else if (mobileNumber && mobileNumber.length > 10) {
            errorObject.mobileerr = resources.strings.phone10length;
        }
        else if (!validateMobileNumber(mobileNumber)) {
            errorObject.mobileerr = resources.strings.enterValidPhone;
        }
        if (email.trim() == "") {
            errorObject.Emailerr = resources.strings.emailCannotBeEmpty;
        } else if (email && email.trim().length > 100) {
            errorObject.Emailerr = resources.strings.email100length;
        } else if (!validateEmail(email && email.trim())) {
            errorObject.Emailerr = resources.strings.enterValidEmail;
        }
        if (city.trim() == "") {
            errorObject.Cityerr = resources.strings.cityCannotBeEmpty;
        }
        if (requirement.trim() == "") {
            errorObject.Requrementerr = resources.strings.requrementCanNotBeEmpty;
        } else if (requirement && requirement.trim().length < 30) {
            errorObject.Requrementerr = resources.strings.requrementCanNotBeLessThan30;
        }
        this.setState({ error: errorObject });
        return Object.keys(errorObject).length == 0;
    };
}

const mapStateToProps = (state) => {
    return {};
};
let container = connect(mapStateToProps, { ...actions })(OfiiceEnquiryScreen);
let loader = APILoadingHOC(container);
loader.getIntent = () => {
    return {
        routeName: OfiiceEnquiryScreen.ROUTE_NAME,
    };
};
export default loader;

