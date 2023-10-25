import React, { Component } from 'react'
import { View, Text, FlatList, TouchableOpacity, Image, Linking } from 'react-native'
import styles from './styles'
import HeaderWithProfile from '../../genriccomponents/header/HeaderWithProfilePic'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Button from '../../genriccomponents/button/Button'
import MaterialInput from '../../genriccomponents/input/MaterialInput'
import resources from '../../../res'
import { checkIfUserIsLoggedIn } from '../../utility/Utils';
import { connect } from 'react-redux'
import AppUser from '../../utility/AppUser'
import APILoadingHOC from "../../genriccomponents/HOCS/APILoadingHOC"
import * as actions from '../../redux/actions/EazyPaymentAction'
import AppToast from '../../genriccomponents/appToast/AppToast'
import RazorpayCheckout from 'react-native-razorpay';
import { ScrollView } from 'react-native'

class EazyPaymentNACH extends Component {
    static ROUTE_NAME = "EazyPaymentNACH";
    constructor(props) {
        super(props);
        this.orderId = this.props.route.params && this.props.route.params.orderId ? this.props.route.params.orderId : null
        this.state = {
            firstName: "",
            email: "",
            mobileNumber: "",
            accountNumber: "", 
            ifscCode: "", 
            beneficiaryName: "",
            error: {},
            amount: 0,
            currentPosition: 1,
            isLoading: false
        }
    }

    componentDidMount() {
        // check User loggedIn for NACH
        if(checkIfUserIsLoggedIn()){
            let userDetails = AppUser.getInstance().userDetails
            if (userDetails) {
                this.setState({
                    email: userDetails.email,
                    firstName: userDetails.full_name,
                    mobileNumber: userDetails.mobile_number
                })
            }
        } else {
            this.onBackClick();
        }
    }

    onBackClick = () => {
        this.props.navigation.goBack()
    }
    renderHeader = () => {
        return (
            <HeaderWithProfile
                headerTitle={resources.strings.AUTO_PAY}
                isBackIconVisible
                navigateProps={this.props.navigation}
                onBackClick={this.onBackClick}
                navigateProps={this.props.navigation}
                toRoute={"MyAccountScreen"}
            />
        )
    }
    
    render() {
        const {accountNumber, ifscCode, beneficiaryName } = this.state;
        return (
            <View style={styles.fullScreen}>
                {this.renderHeader()}
                <View style={styles.btnContainer}>
                    {/* <Text style={styles.instructionBoldText}>{resources.strings.AutoPay}</Text> */}
                    <Text style={styles.instructionText}>{resources.strings.AutoPayDesc}</Text>
                    <View style={{ marginVertical: 12 }}>
                        <Text style={styles.textInstruction}>{resources.strings.SI_Instruction1}</Text>
                        <Text style={styles.textInstruction}>{resources.strings.SI_Instruction2}</Text>
                        <Text style={styles.textInstruction}>{resources.strings.SI_Instruction3}</Text>
                        <Text style={styles.textInstruction}>{resources.strings.SI_Instruction4}</Text>
                    </View>
                </View>
                <KeyboardAwareScrollView
                    keyboardShouldPersistTaps='handled'
                    showsVerticalScrollIndicator={false}
                    extraScrollHeight={100}>
                    <View style={styles.mainContainer}>
                        <View style={styles.nachContainer}>
                            <Text style={styles.instructionNachBoldText}>{'Bank Details'}</Text>
                            <Text style={styles.instructionNachText}>{resources.strings.NachDesc}</Text>
                        </View>
                        <MaterialInput
                            label={'Account Number*'}
                            value={accountNumber}
                            error={this.renderInputError("accountNumber")}
                            errorKey={"accountNumber"}
                            callbackToRemoveError={this.callbackToRemoveError}
                            onChangeText={this.onChangeAccountNumberText}
                            inputProps={{
                                keyboardType: 'phone-pad',
                                returnKeyType: 'next'
                            }} />
                        <MaterialInput
                            label={'IFSC Code*'}
                            value={ifscCode}
                            error={this.renderInputError("ifscCode")}
                            errorKey={"ifscCode"}
                            callbackToRemoveError={this.callbackToRemoveError}
                            onChangeText={this.onChangeIfscCodeText}
                            inputProps={{
                                autoCaptialize: 'none',
                                returnKeyType: 'next',
                            }}
                        />
                        <MaterialInput
                            label={'Beneficiary Name'}
                            value={beneficiaryName}
                            error={this.renderInputError("beneficiaryName")}
                            errorKey={"beneficiaryName"}
                            callbackToRemoveError={this.callbackToRemoveError}
                            onChangeText={this.onChangeBeneficiaryNameText}
                            inputProps={{
                                autoCaptialize: 'none'
                            }} />
                        <View style={styles.buttonContainer}>
                            <Button rounded btnText={resources.strings.SAVE}
                                btnStyle={{ borderRadius: 4 }}
                                onPress={() => { this.onSavePressed() }} />
                        </View>
                    </View>
                </KeyboardAwareScrollView>
                
            </View>
        )
    }

    registerPaperNACHFlow = () => {
        this.setState({ isLoading: true })
        const { firstName, email, mobileNumber, accountNumber, ifscCode, beneficiaryName } = this.state
        this.props.hitEazyPaymentNACHRazorpayApi(this.orderId, accountNumber, ifscCode, beneficiaryName)
            .then((resp) => {
                this.setState({ isLoading: false })
                console.log("/ajxapi/register_papernach", JSON.stringify(resp))
                if (resp.raz_order_id) {
                    this.goBackAndUpdate(true)
                    let responseName = resp.name != null ? resp.name : firstName
                    let responseEmail = resp.email != null ? resp.email : email
                    let responsePhoneNo = resp.phone_no != null ? resp.phone_no : mobileNumber
                    let uploadLink = resp.upload_link != null ? resp.upload_link : 'https://www.google.com'
                    Linking.canOpenURL(uploadLink).then(supported => {
                        if (supported) {
                            this.setState({
                                accountNumber: '',
                                ifscCode: '',
                                beneficiaryName: ''
                            })
                            Linking.openURL(uploadLink);
                        } else {
                            console.log("Don't know how to open URI: " + uploadLink);
                        }
                    });
                } else {
                    this.goBackAndUpdate(false)
                }

            })
            .catch((err) => {
                this.setState({ isLoading: false })
                AppToast(err)
                console.log("Error while Paper NACH Payment", err)
            })
    }
    
    goBackAndUpdate = (isSuccess) => {
        if (isSuccess) {
            AppToast("Paper NACH form created successfully")
        } else {
            AppToast("Error while payment")
        }
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
    onChangeAccountNumberText = (text) => {
        this.setState({ accountNumber: text })
    }
    onChangeIfscCodeText = (text) => {
        this.setState({ ifscCode: text })
    }
    onChangeBeneficiaryNameText = (text) => {
        this.setState({ beneficiaryName: text })
    }

    onSavePressed = () => {
        const isValid = this.validate();
        if (!isValid) { return; }
        this.registerPaperNACHFlow();
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
        const { accountNumber, ifscCode, beneficiaryName } = this.state;
        let errorObject = {};
        if (accountNumber.trim() == "") {
            errorObject.accountNumber = resources.strings.accountNumberCannotBeEmpty;
        }
        if (ifscCode.trim() == "") {
            errorObject.ifscCode = resources.strings.ifscCodeCannotBeEmpty;
        }
        if (beneficiaryName.trim() == "") {
            errorObject.beneficiaryName = resources.strings.beneficiaryNameCannotBeEmpty;
        }

        this.setState({ error: errorObject });
        return Object.keys(errorObject).length == 0;
    };
}

const mapStateToProps = (state) => {
    return {};
};
let container = connect(mapStateToProps, { ...actions })(EazyPaymentNACH);
let loader = APILoadingHOC(container);

loader.getIntent = () => {
    return {
        routeName: EazyPaymentNACH.ROUTE_NAME,
    };
};
export default loader;