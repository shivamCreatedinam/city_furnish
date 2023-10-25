import React, { Component } from 'react'
import { View, Text, FlatList, TouchableOpacity, Image, Linking } from 'react-native'
import styles from './styles'
import HeaderWithProfile from '../../../genriccomponents/header/HeaderWithProfilePic'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Button from '../../../genriccomponents/button/Button'
import MaterialInput from '../../../genriccomponents/input/MaterialInput'
import resources from '../../../../res'
import { checkIfUserIsLoggedIn, customStyles, myWidth  } from '../../../utility/Utils';
import StepIndicator from 'react-native-step-indicator';
import { connect } from 'react-redux'
import AppUser from '../../../utility/AppUser'
import APILoadingHOC from "../../../genriccomponents/HOCS/APILoadingHOC"
import * as actions from '../../../redux/actions/AutoPaymentAction'
import { getViewOrderDetailApi } from '../../../redux/actions/OrderAction'
import AppToast from '../../../genriccomponents/appToast/AppToast'
import RazorpayCheckout from 'react-native-razorpay';
import { ScrollView } from 'react-native'

class AutoPaymentNACH extends Component {
    static ROUTE_NAME = "AutoPaymentNACH";
    constructor(props) {
        super(props);
        this.dealCodeNumber = this.props.route.params && this.props.route.params.orderId ? this.props.route.params.orderId : null
        this.isComingFromPaymentSucess = this.props.route.params && this.props.route.params.isComingFromPaymentSucess ? this.props.route.params.isComingFromPaymentSucess : false;
        this.state = {
            firstName: "",
            email: "",
            mobileNumber: "",
            accountNumber: "", 
            ifscCode: "", 
            beneficiaryName: "",
            error: {},
            detailData: {},
            amount: 0,
            currentPosition: 3,
            isLoading: false
        }
    }

    componentDidMount() {
        this.loadOrderDetails();
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
            showSigninAlert("AutoPaymentScreen")
        }
    }

    loadOrderDetails = () => {
        this.props.getViewOrderDetailApi(this.dealCodeNumber)
            .then((data) => {
                console.log("detailData",data.data)
                this.setState({
                    detailData: data.data,
                    isLoading: false
                })
            })
            .catch((error) => {
                console.log("error", error)
                this.setState({
                    isLoading: false
                })
            });
    }

    onBackClick = () => {
        this.props.navigation.goBack()
    }
    renderHeader = () => {
        return (
            <HeaderWithProfile
                headerTitle={resources.strings.Documentation}
                isBackIconVisible
                navigateProps={this.props.navigation}
                onBackClick={this.onBackClick}
                navigateProps={this.props.navigation}
                toRoute={"MyAccountScreen"}
            />
        )
    }

    renderStatus = () => {
        const { currentPosition } = this.state
        return (
            <StepIndicator
                customStyles={customStyles}
                currentPosition={currentPosition}
                renderStepIndicator={(state) => { return this.putTickIndicator(state) }}
                stepCount={4}

            />
        )
    }

    putTickIndicator = (state) => {
        switch (state.stepStatus) {
            case 'finished': {
                return <Image source={resources.images.icn_document_done} style={styles.iconStyle} />
            }
            case 'unfinished': {
                return <Image source={resources.images.icn_process_status} style={styles.iconStyle} />
            }
            case 'current': {
                return <Image source={resources.images.icn_document_pending} style={styles.iconStyle} />
            }
            default: {
                break
            }
        }
        return state
    }
    currentScreenName = () => {
        return <View style={styles.currentNameView}>
            <Text style={styles.currentNameText}>{resources.strings.AUTO_PAYMENT}</Text>
        </View>
    }

    generalInforamtion = () => {
        const { detailData } = this.state;
        const { full_name, order_date, order_id } = detailData
        return (
            <View style={styles.generalContainer}>
                <View style={styles.generatInformation}>
                    <Text style={styles.nameStyle}>{full_name ? full_name : ""}</Text>
                    <Text style={styles.thankYou}>{"Thank you for your order."}</Text>
                    <View style={styles.dashStyle} />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 13 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.orderIdStyle}>{"Order Id :"}</Text>
                            <Text style={styles.orderDetails}>{order_id ? order_id : ""}</Text>
                        </View>
                        <View>
                            <Text style={styles.orderDetails}>{order_date ? order_date : ""}</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
    
    render() {
        const {accountNumber, ifscCode, beneficiaryName } = this.state;
        return (
            <View style={styles.fullScreen}>
                {this.renderHeader()}
                {this.currentScreenName()}
                <View >
                    {this.renderStatus()}
                </View>

                {/* <View style={{marginTop: 10, flex: 1}}>
                    {this.generalInforamtion()}
                </View> */}

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
        this.props.hitAutoPaymentNACHRazorpayApi(this.dealCodeNumber, accountNumber, ifscCode, beneficiaryName)
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
let container = connect(mapStateToProps, { ...actions, getViewOrderDetailApi })(AutoPaymentNACH);
let loader = APILoadingHOC(container);

loader.getIntent = () => {
    return {
        routeName: AutoPaymentNACH.ROUTE_NAME,
    };
};
export default loader;