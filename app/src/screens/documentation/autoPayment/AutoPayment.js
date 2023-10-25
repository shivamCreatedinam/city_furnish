import React, { Component } from 'react'
import { View, Text, FlatList, TouchableOpacity, Image,  ActivityIndicator, BackHandler } from 'react-native'
import styles from './styles'
import HeaderWithProfile from '../../../genriccomponents/header/HeaderWithProfilePic'
import Button from '../../../genriccomponents/button/Button'
import resources from '../../../../res'
import { razorpayKeyId, showSigninAlert, checkIfUserIsLoggedIn, customStyles, myWidth } from '../../../utility/Utils';
import StepIndicator from 'react-native-step-indicator';
import { connect } from 'react-redux'
import AppUser from '../../../utility/AppUser'
import APILoadingHOC from "../../../genriccomponents/HOCS/APILoadingHOC"
import * as actions from '../../../redux/actions/AutoPaymentAction'
import { getEnabledPaymentInfo } from '../../../redux/actions/PaymentAction'
import { getViewOrderDetailApi } from '../../../redux/actions/OrderAction'
import AppToast from '../../../genriccomponents/appToast/AppToast'
import RazorpayCheckout from 'react-native-razorpay';

class AutoPayment extends Component {
    static ROUTE_NAME = "AutoPayment";
    constructor(props) {
        super(props);
        this.orderId = this.props.route.params && this.props.route.params.orderId ? this.props.route.params.orderId : 105616288;
        this.isComingFromPaymentSucess = this.props.route.params && this.props.route.params.isComingFromPaymentSucess ? this.props.route.params.isComingFromPaymentSucess : false;
        this.state = {
            status: false,
            firstName: "",
            email: "",
            mobileNumber: "",
            amount: 0,
            currentPosition: 3,
            detailData: {},
            easypaymentArr: [],
            emandate: true,
            papernach: false,
            upi: false,
            skipOption: true,
            isLoading: true
        }
    }

    componentWillUnmount() {
        if (this.isComingFromPaymentSucess) {
            BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        } 
        // else {
        //     BackHandler.removeEventListener('hardwareBackPress', this.AutoPaymentDone());
        // }
    }

    handleBackButton() {
        AppToast("Please verify your Auto payment Mode first")
        // this.AutoPaymentDone();
        return true;
    }

    async componentDidMount() {
        await this.getDataLoading();
        if (this.isComingFromPaymentSucess) {
            BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        }
    }

    getDataLoading = async () => {
        await this.getPaymentInfoData();
        await this.getScheduledOrderData();
        this.loadOrderDetails();
        // check User loggedIn for Eazy Payment
        if(checkIfUserIsLoggedIn()){
            let userDetails = AppUser.getInstance().userDetails
            if (userDetails) {
                this.setState({
                    isLoading: false,
                    email: userDetails.email,
                    firstName: userDetails.full_name,
                    mobileNumber: userDetails.mobile_number,
                    userCoinBalance: userDetails.cf_coins
                })
            }
        } else {
            showSigninAlert("AutoPaymentScreen")
        }
    }
    getPaymentInfoData = () => {
        this.props.getEnabledPaymentInfo()
            .then((data) => {
                this.setState({
                    emandate: data.emandate != null ? data.emandate : false,
                    papernach: data.papernach != null ? data.papernach : true,
                    upi: data.upi != null ? data.upi : true,
                })
            })
            .catch((error) => {
                console.log("getEnabledPaymentInfo error", error)
            });
    }

    getScheduledOrderData = () => {
        this.props.getScheduledOrder()
            .then((data) => {
                this.setState({
                    easypaymentArr: data.easypaymentArr
                })
            })
            .catch((error) => {
                console.log("getScheduledOrder error", error)
            });
    }

    loadOrderDetails = () => {
        this.props.getViewOrderDetailApi(this.orderId)
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
        if (this.isComingFromPaymentSucess) {
            AppToast("Please Select Auto Payment Mode first")
        } else {
            // this.props.navigation.goBack()
            this.props.navigation.navigate("DocumentationScreen")
        }
    }
    renderHeader = () => {
        return (
            <HeaderWithProfile
                headerTitle={resources.strings.Documentation}
                isBackIconVisible
                navigateProps={this.props.navigation}
                onBackClick={this.onBackClick}
                toRoute={"MyAccountScreen"}
            />
        )
    }

    skipPaymenyFlow = () => {
        console.log("Skip")
        this.AutoPaymentDone();
    }

    eazyPaymenyFlow = (orderId, paymentType) => {
        if(this.orderId) {
            if(paymentType == 'paper_nach') {
                this.props.navigation.navigate("AutoPaymentNACHScreen", {
                    orderId: this.orderId,
                    isComingFromPaymentSucess: this.isComingFromPaymentSucess
                })
            } else {
                this.setState({ isLoading: true })
                const { firstName, email, mobileNumber, amount } = this.state
                this.props.hitAutoPaymentRazorpayApi(this.orderId, paymentType)
                    .then((resp) => {
                        this.setState({ isLoading: false })
                        if (resp.raz_order_id) {
                            let responseName = resp.name != null ? resp.name : firstName
                            let responseEmail = resp.email != null ? resp.email : email
                            let responsePhoneNo = resp.phone_no != null ? resp.phone_no : mobileNumber
                            this.getHashesFromServerAndConnectRazorpay(responseName, responseEmail,responsePhoneNo, amount, resp.raz_order_id, resp.customer_id, paymentType)
                        } else {
                            this.goBackAndUpdate(false)
                        }
        
                    })
                    .catch((err) => {
                        this.setState({ isLoading: false })
                        AppToast(err)
                        console.log("Error while One time Payment", err)
                    })
            }
        } else {
            AppToast("Unable to get order number, Try Again Later!")
        }
    }
    
    convertIntegerWithINR = (amount) => {
        return amount*100;
    }
    getHashesFromServerAndConnectRazorpay = (responseName, responseEmail, responsePhoneNo, amount, authRazorpayOrderID, customerId, paymentType) => {
        let amnt = amount.toString();
        let amountToBePaid = amnt.split('.')[0];
        if (!responseName || !responseEmail) {
            Toast.show("Something went wrong!!")
            return
        }
        try {
            var options = {
                description: resources.strings.eazyRazorpayPaymentDescription,
                image: resources.strings.razorpayImageUrl,
                currency: resources.strings.razorpayCurrency,
                key: razorpayKeyId,
                amount: this.convertIntegerWithINR(parseInt(amountToBePaid)),
                name: resources.strings.razorpayTitle,
                order_id: authRazorpayOrderID,//Replace this with an order_id created using Orders API. Learn more at https://razorpay.com/docs/api/orders.
                customer_id: customerId,
                recurring: 1,
                prefill: {
                    email: responseEmail,
                    contact: responsePhoneNo,
                    name: responseName
                },
                theme: {color: resources.colors.razorpayColor},
                readonly: {
                    email: false,
                    contact: false,
                    name: false
                }
            };
            RazorpayCheckout.open(options).then((data) => {
                // handle success
                this.setState({ isLoading: true })
                //razorpay_payment_id == transactionID 
                //orderid  == this.orderId
                //customer_id  == customerId
                //razpay_orderid ==  data.razorpay_order_id
                //signature == data.razorpay_signature
                //auth_raz_order_id == authRazorpayOrderID
                this.props.hitAutoPaymentRazorpaySuccessApi(data.razorpay_payment_id, data.razorpay_order_id, data.razorpay_signature, authRazorpayOrderID, customerId, paymentType )
                    .then((resp) => {
                        this.setState({ isLoading: false })
                        this.goBackAndUpdate(true)
                    })
                    .catch((err) => {
                        this.setState({ isLoading: false })
                        this.goBackAndUpdate(false)
                        console.log("Error while One time Payment", err)
                    })
            }).catch((error) => {
                // handle failure
                this.setState({ isLoading: false })
                this.goBackAndUpdate(false)
                console.log(`Error: ${error.code} | ${error.description}`)
            });
        }
        catch(err) {
            AppToast('Payment not Initiated. try again later!')
            console.log("error while fetching hash from server", err)
        }
    }
    
    goBackAndUpdate = (isSuccess) => {
        if (isSuccess) {
            AppToast("Mandate registered successfully")
            // this.props.navigation.push("AutoPaymentScreen")
            this.AutoPaymentDone();
        } else {
            AppToast("Error while payment")
        }
    }
    AutoPaymentDone = () => {
        let count = 0
        if (this.isComingFromPaymentSucess) {
            count = 5
        } else {
            count = 4
        }
        this.props.navigation.pop(count)
        this.props.navigation.navigate("MyOrder")
    }
    FlatListItemSeparator = () => {
        return (
            <View style={styles.separatorStyle} />
        );
    }
    renderEmptyScreen = () => {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Image source={resources.images.img_no_order_found} />
                <Text style={{ textAlign: 'center', fontSize: 14, fontFamily: resources.fonts.regular }}>{"No Order found"}</Text>
            </View>

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
        const { detailData, easypaymentArr } = this.state;
        const { full_name, gst_number, order_date, order_id, company_name } = detailData
        return (
            <View style={styles.generalContainer}>
                <View style={styles.generatInformation}>
                    {order_id ? <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.orderIdStyle}>{"Order Id : "}</Text>
                        <Text style={styles.nameStyle}>{order_id ? order_id : ""}</Text>
                    </View> : <View />}
                    { order_date ? <View>
                        <Text style={styles.orderDetails}>{order_date ? order_date : ""}</Text>
                    </View> : <View /> }
                    {/* <Text style={styles.nameStyle}>{full_name ? full_name : ""}</Text>
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
                    </View> */}
                    {easypaymentArr.includes(this.orderId) ? <View style={{
                        textAlign: 'center',
                        alignContent: 'center',
                        alignItems: 'center',
                        marginTop: 20
                    }}>
                        <View style={styles.dashStyle} /> 
                        <Text style={styles.nameStatusStyle}>{"Status"}</Text>
                        <Text style={styles.thankYou}>
                            <Text style={[styles.invoiceSuccessDetails]}>{'Easy payment successfully setup'}</Text>
                        </Text>
                        {/* <Text style={styles.thankYou}>{easypaymentArr.includes(this.orderId) ? <Text style={[styles.invoiceSuccessDetails]}>{'Easy payment successfully setup'}</Text> : <Text style={[styles.invoiceFailDetails]}>{'Easy payment setup required'}</Text> }</Text> */}
                    </View> : <View /> }
                </View>
            </View>
        )
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

    render() {
        const { detailData , emandate, upi, papernach, skipOption, easypaymentArr } = this.state;
        return (
            <View style={styles.fullScreen}>
                {this.renderHeader()}
                {this.currentScreenName()}
                <View >
                    {this.renderStatus()}
                </View>
                <Text style={styles.selectAutoPayText}>{resources.strings.AutoPayDesc}</Text>

                <View style={{
                    marginTop: 20, 
                    flex: 1,
                    alignContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center'
                }}>
                    {this.generalInforamtion()}
                </View>
                <View style={styles.btnContainer}>
                    <Text style={styles.instructionText}>{resources.strings.AutoPayDesc}</Text>
                    <View style={{ marginVertical: 12 }}>
                        <Text style={styles.textInstruction}>{resources.strings.SI_Instruction1}</Text>
                        <Text style={styles.textInstruction}>{resources.strings.SI_Instruction2}</Text>
                        <Text style={styles.textInstruction}>{resources.strings.SI_Instruction3}</Text>
                    </View>
                </View>

                {/* <View style={styles.AddAddreesContainer}> */}
                {easypaymentArr.includes(this.orderId) ? <View style={styles.AddSkipBtn}>
                    <View style={[styles.btnSkipOptionButton, { borderWidth: 0 }]}>
                        {skipOption && <TouchableOpacity style={[styles.skipStyleBottom, {width: myWidth - 25,}]} onPress={() => this.skipPaymenyFlow()}>
                            <Text style={styles.viewSkipBottom}>{"Skip"}</Text>
                        </TouchableOpacity>}
                    </View>
                </View> : 
                <View style={styles.AddAutoPayBtn}>
                    <View style={(emandate && upi && papernach) ? {marginTop: 5} : ((emandate && upi ) || (emandate && papernach) ||  (upi && papernach)) ? {marginTop: 5} : {marginTop : 5}}>
                    {(emandate || upi || papernach) && <Text style={styles.cardBoxText}>{"Select Auto Pay Mode"}</Text>}
                        <View style={[styles.btnMoreOptionButton, { borderWidth: 0 }]}>
                            {emandate && <TouchableOpacity style={[styles.btnStyleBottom, (emandate && upi && papernach) ? {width: myWidth/3 - 50} : ((emandate && upi ) || (emandate && papernach) ||  (upi && papernach)) ? {width: myWidth/2 - 70} : {width: myWidth - 120}]} onPress={() => this.eazyPaymenyFlow(this.orderId, 'emandate')}>
                                <Text style={styles.viewOrderBottom}>{"E-Mandate"}</Text>
                            </TouchableOpacity>}
                            {upi ? <TouchableOpacity style={[styles.btnStyleBottom, (emandate && upi && papernach) ? {width: myWidth/3 - 50} : ((emandate && upi ) || (emandate && papernach) ||  (upi && papernach)) ? {width: myWidth/2 - 70} : {width: myWidth - 120}]} onPress={() => this.eazyPaymenyFlow(this.orderId, 'upi')}>
                                <Text style={styles.viewOrderBottom}>{"UPI"}</Text>
                            </TouchableOpacity> : <View />}
                            {papernach && <TouchableOpacity style={[styles.btnStyleBottom, (emandate && upi && papernach) ? {width: myWidth/3 - 50} : ((emandate && upi ) || (emandate && papernach) ||  (upi && papernach)) ? {width: myWidth/2 - 70} : {width: myWidth - 120}]} onPress={() => this.eazyPaymenyFlow(this.orderId, 'paper_nach')}>
                                <Text style={styles.viewOrderBottom}>{"Paper NACH"}</Text>
                            </TouchableOpacity>}
                            {skipOption && <TouchableOpacity style={[styles.skipStyleBottom, {width: 75}]} onPress={() => this.skipPaymenyFlow()}>
                                <Text style={styles.viewSkipBottom}>{"Skip"}</Text>
                            </TouchableOpacity>}
                        </View>
                    </View>
                </View>}
                {/* </View> */}
            </View>
        )
    }
    renderFooter = () => {
        return (
            <View style={{ height: 25, backgroundColor: 'red' }} />
        )
    }
}

const mapStateToProps = (state) => {
    return {};
};
let container = connect(mapStateToProps, { ...actions, getEnabledPaymentInfo, getViewOrderDetailApi })(AutoPayment);
let loader = APILoadingHOC(container);

loader.getIntent = () => {
    return {
        routeName: AutoPayment.ROUTE_NAME,
    };
};
export default loader;