import React, { Component } from 'react';
import { View, Text, Image, Keyboard, ActivityIndicator, Linking, Platform } from 'react-native'
import styles from './styles'
import HeaderWithProfile from '../../genriccomponents/header/HeaderWithProfilePic'
import resources from '../../../res'
import MaterialInput from '../../genriccomponents/input/MaterialInput'
import { validateMobileNumber, validateEmail, renderInputError, focusTo } from '../../utility/Utils'
import Button from '../../genriccomponents/button/Button'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Dropdown } from 'react-native-material-dropdown'
import ProductHorizontalView from '../../genriccomponents/productView/boughtProduct/BoughtProduct'
import * as actions from '../../redux/actions/CorporateOrderAction'
import { connect } from 'react-redux';
import { TouchableOpacity } from 'react-native-gesture-handler';
import HorizontalImageView from '../../genriccomponents/productView/horizontalImage/HorizontalImageView'
import AppToast from '../../genriccomponents/appToast/AppToast'

class CorporateOrders extends Component {
    static ROUTE_NAME = "CorporateOrders"
    constructor(props) {
        super(props);
        this.state = {
            fullName: "",
            activeIndexHorizontal: 0,
            mobileNumber: "",
            city: "",
            email: "",
            message: "",
            total_Quantity: "",
            error: {},
            quantity: [{
                value: '10-50',
            }, {
                value: '50-100',
            }, {
                value: '100+',
            }],
            cityInit: "",
            selectCity: null,
            page: 0,
            limit: 6,
            corporateOrderDetails: [],
            allProduct: false,
            isLoading: true
        }
        this.fullNameRef = React.createRef();
        this.mobileRef = React.createRef();
        this.emailRef = React.createRef();
        this.cityRef = React.createRef();
        this.messageRef = React.createRef();

    }
    componentDidMount() {
        this.initialData()
    }
    initialData = () => {
        this.props.hitCorporateOrderDetailsApi()
            .then((data) => {
                this.setState({
                    corporateOrderDetails: data.data,
                    isLoading: false
                })
            }).catch((error) => {
                console.log(error)
            })
    }
    loadMoreData = () => {
        const { page, isPaginating, next } = this.state;
        if (next && !isPaginating) {

            this.setState({ isPaginating: true, page: page + 1 }, () => {
                setTimeout(() => {
                    const { page } = this.state;
                    this.proceedAddress(page, 10);
                    this.setState({ refreshing: false })
                }, 1000);
            });
        }
    };
    onBackClick = () => {
        this.props.navigation.goBack()
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
    onChangeMessage = (text) => {
        this.setState({ message: text })
    }
    onPressBack = () => {
        this.props.navigation.goBack()
    }
    renderHeader = () => {
        return (
            <HeaderWithProfile
                headerTitle={resources.strings.Corporate_Orders}
                isBackIconVisible={true}
                onBackClick={this.onBackClick}
                navigateProps={this.props.navigation}
                toRoute={"MyAccountScreen"}
            />
        )
    }
    viewAllProduct = () => {
        this.setState({ allProduct: true })
    }

    corporateNeed = () => {
        const { corporateOrderDetails } = this.state
        return <ProductHorizontalView
            productList={corporateOrderDetails.fulfilling_all_your_corporate_needs}
            label={resources.strings.FULL_FILL_CORPORATE_NEED}
            corporateData={true}
        />
    }

    dialCall = (phoneNumber) => {
        if (Platform.OS === 'android') {
            Linking.openURL(`tel:${phoneNumber}`)
        }
        else {
            Linking.openURL(`telprompt:${phoneNumber}`)
        }
    };
    customMadeProduct = () => {
        const { corporateOrderDetails } = this.state
        return (
            <View style={styles.customProduct}>
                <Text style={styles.customMadeText}>{resources.strings.CUSTOMMADEPRODUCT}</Text>
                <View style={styles.helplineDiscription}>
                    <View>
                        <Text style={styles.customMadeDiscription}>{resources.strings.CUSTOMPRODUCTDISCRIPTION}</Text>
                    </View>
                    <View style={styles.helpLineText}>
                        <Text style={styles.callStyle}>{resources.strings.CALL}</Text>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => { this.dialCall(corporateOrderDetails.call_number) }}>
                            <Text style={styles.helpLineNo}>{corporateOrderDetails.call_number}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Image source={resources.images.icn_HelpLine} style={styles.imgHelpLine} />
            </View>
        )
    }
    onActiveHorizontalItem = (index) => {
        this.setState({ activeIndexHorizontal: index })
    }
    allProduct = () => {
        const { corporateOrderDetails } = this.state;
        return (
            <HorizontalImageView
                data={corporateOrderDetails.our_projects ? corporateOrderDetails.our_projects.img : []}
                activeIndexHorizontal={this.state.activeIndexHorizontal}
                onSnapToItem={this.onActiveHorizontalItem} />
        )
    }

    render() {
        const { fullName, mobileNumber, email, city, message, error, total_Quantity } = this.state;
        return (
            <View style={styles.fullScreen}>
                {this.renderHeader()}
                <KeyboardAwareScrollView
                    style={{ marginTop: 10 }}
                    // bounces={false}
                    keyboardShouldPersistTaps='handled'
                    showsVerticalScrollIndicator={false}
                    extraScrollHeight={100}>
                    <View style={styles.container}>
                        <View style={styles.corporateOrdersText}>
                            <Text style={styles.textCorporate}>
                                {resources.strings.Corporate_Orders}
                            </Text>
                        </View>
                        {/* <View style={styles.corporateDiscription}> */}
                        <Text style={styles.discriptionText}>{resources.strings.corporateDiscription}</Text>
                        {/* </View> */}
                        <View style={{ marginRight: -10 }}>
                            {this.corporateNeed()}
                        </View>
                        <Text style={styles.enquiry}>{resources.strings.ENQUIRY}</Text>
                        <Text style={styles.enquiryRequrement}>{resources.strings.ENQUIRY_REQUREMENT}</Text>
                        <MaterialInput label={resources.strings.NAME}
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
                            label={resources.strings.EMAIL_ADDRESS}
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
                            reference={this.fullNameRef}
                            onSubmitEditing={() => this.focusToNext(this.emailRef)}
                        >
                        </MaterialInput>
                        <MaterialInput
                            label={resources.strings.MOBILE_NUMBER}
                            onChangeText={this.onChangeMobileNumber}
                            value={mobileNumber}
                            error={renderInputError("mobileerr", error)}
                            errorKey={"mobileerr"}
                            callbackToRemoveError={this.callbackToRemoveError}
                            inputProps={{
                                keyboardType: 'phone-pad',
                                autoCaptialize: 'none',
                                maxLength: 10,
                                returnKeyType: 'next',
                            }}
                            reference={this.emailRef}
                            onSubmitEditing={() => this.focusToNext(this.mobileRef)}
                        >
                        </MaterialInput>
                        <MaterialInput
                            textColor={resources.colors.black}
                            label={resources.strings.CITY}
                            onChangeText={this.onChangeCity}
                            value={city}
                            error={renderInputError("Cityerr", error)}
                            errorKey={"Cityerr"}
                            callbackToRemoveError={this.callbackToRemoveError}
                            inputProps={{
                                autoCaptialize: 'none',
                                maxLength: 20,
                                returnKeyType: 'next',
                            }}
                            reference={this.mobileRef}
                            onSubmitEditing={() => this.focusToNext(this.cityRef)}
                        >
                        </MaterialInput>
                        <Dropdown
                            animationDuration={1}
                            rippleDuration={1}
                            inputContainerStyle={{ borderBottomColor: resources.colors.labelColor, borderBottomWidth: 1 }}
                            onChangeText={(val, i, d) => {
                                this.setState({ selectCity: d[i], total_Quantity: val },()=>{
                                    this.callbackToRemoveError("Quantityerr")
                                })

                            }}
                            data={this.state.quantity.map(item => ({
                                value: item.value, ...item
                            }))}
                            // value={this.state.quantity && this.state.quantity.length > 0 ? "" : ""}
                            dropdownPosition={-4}
                            renderBase={(props) => (
                                <MaterialInput
                                    isDropDownImageVisible={true}
                                    label={resources.strings.TOTAL_QUANTITY}
                                    onChangeText={this.onChangeCity}
                                    error={renderInputError("Quantityerr", error)}
                                    errorKey={"Quantityerr"}
                                    callbackToRemoveError={this.callbackToRemoveError}
                                    value={total_Quantity}
                                    inputProps={{
                                        editable: false,

                                    }}
                                >
                                </MaterialInput>


                            )}
                        />

                        <MaterialInput
                            label={resources.strings.MESSAGE}
                            onChangeText={this.onChangeMessage}
                            error={renderInputError("Messageerr", error)}
                            errorKey={"Messageerr"}
                            callbackToRemoveError={this.callbackToRemoveError}
                            value={message}
                            inputProps={{
                                autoCaptialize: 'none',
                                maxLength: 300,
                                returnKeyType: 'done',
                                multiline: true
                            }}
                            onSubmitEditing={() => { Keyboard.dismiss() }}
                            reference={this.cityRef}
                        >
                        </MaterialInput>
                        <View style={styles.submitBtn}>
                            <Button btnStyle={styles.buttonStyle} rounded btnText={resources.strings.SUBMIT} onPress={this.submitYourRequirement} />
                        </View>
                        {this.customMadeProduct()}
                        <Text style={styles.ourProject}>{resources.strings.OURPROJECT}</Text>
                        <View style={[styles.flatlistStyle, { backgroundColor: 'red' }]}>
                            {this.allProduct()}
                        </View>



                    </View>
                </KeyboardAwareScrollView>
                {this.state.isLoading ? this.ActivityIndicatorLoadingView() : <View />}
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
    ActivityIndicatorLoadingView() {
        return (
            <ActivityIndicator
                color={resources.colors.appColor}
                size='large'
                style={styles.ActivityIndicatorStyle}
            />
        );
    }
    submitYourRequirement = () => {

        const isValid = this.validate();
        if (!isValid) { return; }
        this.setState({
            isLoading: true
        }, () => {
            this.corporateOrder()
        })
    }
    corporateOrder = () => {
        const { fullName, mobileNumber, email, city, message, total_Quantity } = this.state;
        this.props.hitCorporateOrderApi(fullName, email, mobileNumber, total_Quantity, city, message)
            .then((data) => {
                AppToast(data.message)
                this.clearData()
            }).catch((err) => {
                this.setState({ isLoading: false })
            })
    }
    clearData = () => {
        this.setState({
            fullName: "",
            mobileNumber: "",
            city: "",
            email: "",
            message: "",
            total_Quantity: "",
            cityInit: "",
            isLoading: false
        })

    }
    validate = () => {

        const { fullName,
            mobileNumber,
            email,
            city,
            message,
            total_Quantity } = this.state;
        let errorObject = {};
        if (fullName.trim() == "") {
            errorObject.nameerr = resources.strings.nameCannotBeEmpty;
        } else if (fullName && fullName.trim().length > 20) {
            errorObject.nameerr = resources.strings.name20length;
        } else if (fullName && fullName.trim().length < 2) {
            errorObject.nameerr = resources.strings.CorporateName2length
        }
        if (mobileNumber && mobileNumber.trim() == "") {
            errorObject.mobileerr = resources.strings.phoneCannotBeEmpty;
        } else if (mobileNumber && mobileNumber.length > 10) {
            errorObject.mobileerr = resources.strings.phone10length;
        }
        else if (!validateMobileNumber(mobileNumber)) {
            errorObject.mobileerr = resources.strings.enterValidPhone;
        }
        if (email && email.trim() == "") {
            errorObject.Emailerr = resources.strings.emailCannotBeEmpty;
        } else if (email && email.trim().length > 100) {
            errorObject.Emailerr = resources.strings.email100length;
        } else if (!validateEmail(email && email.trim())) {
            errorObject.Emailerr = resources.strings.enterValidEmail;
        }
        if (city.trim() == "") {
            errorObject.Cityerr = resources.strings.cityCannotBeEmpty;
        } else if (city && city.trim().length < 2) {
            errorObject.Cityerr = resources.strings.CorporateCity2length
        }
        if (message && message.trim() == "") {
            errorObject.Messageerr = resources.strings.EMPTYMESSAGE;
        } else if (message.length <= 4) {
            errorObject.Messageerr = resources.strings.CorporateMessage5length
        }
        if (total_Quantity == "") {
            errorObject.Quantityerr = resources.strings.TotalQuantityEmpty
        }
        this.setState({ error: errorObject });
        return Object.keys(errorObject).length == 0;
    };
}

const mapStateToProps = (state) => {
    return {};
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
    }, dispatch);
}
let CorporateOrdersContainer = connect(mapStateToProps, { ...actions })(CorporateOrders);
export default CorporateOrdersContainer;