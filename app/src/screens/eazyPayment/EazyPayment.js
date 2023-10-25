import React, { Component } from 'react'
import { View, Text, FlatList, TouchableOpacity, Image, RefreshControl } from 'react-native'
import styles from './styles'
import HeaderWithProfile from '../../genriccomponents/header/HeaderWithProfilePic'
import resources from '../../../res'
import { razorpayKeyId, showSigninAlert, checkIfUserIsLoggedIn } from '../../utility/Utils';
import { connect } from 'react-redux'
import AppUser from '../../utility/AppUser'
import APILoadingHOC from "../../genriccomponents/HOCS/APILoadingHOC"
import * as actions from '../../redux/actions/EazyPaymentAction'
import { getEnabledPaymentInfo } from '../../redux/actions/PaymentAction'
import AppToast from '../../genriccomponents/appToast/AppToast'
import RazorpayCheckout from 'react-native-razorpay';

class EazyPayment extends Component {
    static ROUTE_NAME = "EazyPayment";
    constructor(props) {
        super(props);
        this.state = {
            status: false,
            firstName: "",
            email: "",
            mobileNumber: "",
            amount: 0,
            currentPosition: 1,
            orderList: [],
            easypaymentArr: [],
            emandate: true,
            papernach: false,
            upi: false,
            isLoading: false
        }
    }

    async componentDidMount() {
        await this.getDataLoading();
    }

    getDataLoading = async () => {
        await this.getPaymentInfoData();
        await this.getScheduledOrderData();
        this.loadAllOrders();
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
            showSigninAlert("EazyPaymentScreen")
        }
    }

    refreshControlLoading = () => {
        this.setState({
            orderList: [],
            easypaymentArr: []
        })
        this.getDataLoading();
    }
    getPaymentInfoData = () => {
        this.props.getEnabledPaymentInfo()
            .then((data) => {
                this.setState({
                    emandate: data.emandate != null ? data.emandate : false,
                    papernach: data.papernach != null ? data.papernach : false,
                    upi: data.upi != null ? data.upi : false,
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
    loadAllOrders = () => {
        this.props.hitAllOrderApi()
            .then((data) => {
                this.setState({
                    orderList: data.data
                })
            }).catch((error) => {
                console.log(error)
            })
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

    renderMyOrder = ({ item, index }) => {
        const { emandate, upi, papernach, easypaymentArr } =  this.state;
        return (
            <View style={styles.cardStyle}>
                <View style={styles.leftHalfCon}  >
                    <View style={styles.rowDirection}>
                        <View style={styles.coloum}>
                            <Text style={styles.invoiceDetailsTitle}>{"Order Number"}</Text>
                            <Text style={styles.invoiceDetails}>{item.dealCodeNumber ? item.dealCodeNumber : "NA"}</Text>
                        </View>
                        <View style={styles.coloum}>
                            <Text style={styles.invoiceDetailsTitle}>{"Order Date"}</Text>
                            <Text style={styles.invoiceDetails}>{item.created ? item.created : "NA"}</Text>
                        </View>
                        <View style={styles.coloum}>
                            <Text style={styles.invoiceDetailsTitle}>{"Status"}</Text>
                            <Text style={[styles.invoiceDetails]}>{easypaymentArr.includes(item.dealCodeNumber) ? <Text style={[styles.invoiceSuccessDetails]}>{'Easy payment successfully setup'}</Text> : <Text style={[styles.invoiceFailDetails]}>{'Easy payment setup required'}</Text> }</Text>
                        </View>
                    </View> 
                </View>
                {easypaymentArr.includes(item.dealCodeNumber) ? <View /> : <View style={(emandate && upi && papernach) ? {marginTop: 10} : ((emandate && upi ) || (emandate && papernach) ||  (upi && papernach)) ? {marginTop: 25} : {marginTop : 45}}>
                    {(emandate || upi || papernach) && <Text style={styles.cardBoxText}>{"Select Auto Pay Mode"}</Text>}
                    <View style={[styles.btnMoreOption, { borderWidth: 0 }]}>
                        {emandate && <TouchableOpacity style={[styles.btnStyle, styles.btnWidth01]} onPress={() => this.eazyPaymenyFlow(item.dealCodeNumber, 'emandate')}>
                            <Text style={styles.viewOrder}>{"E-Mandate"}</Text>
                        </TouchableOpacity>}
                        {(parseInt(item.amount) < 2000 && upi) ? <TouchableOpacity style={[styles.btnStyle, styles.btnWidth01]} onPress={() => this.eazyPaymenyFlow(item.dealCodeNumber, 'upi')}>
                            <Text style={styles.viewOrder}>{"UPI"}</Text>
                        </TouchableOpacity> : <View style={{marginHorizontal : 10}} />}
                        {papernach && <TouchableOpacity style={[styles.btnStyle, styles.btnWidth01]} onPress={() => this.eazyPaymenyFlow(item.dealCodeNumber, 'paper_nach')}>
                            <Text style={styles.viewOrder}>{"Paper NACH"}</Text>
                        </TouchableOpacity>}
                    </View>
                </View>}
                
            </View>
        )
    }

    eazyPaymenyFlow = (orderId, paymentType) => {
        if(paymentType == 'paper_nach') {
            this.props.navigation.navigate("EazyPaymentNACHScreen", {
                orderId: orderId
            })
        } else {
            this.setState({ isLoading: true })
            const { firstName, email, mobileNumber, amount } = this.state
            this.props.hitEazyPaymentRazorpayApi(orderId, paymentType)
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
                //orderid  == dealCodeNumber
                //customer_id  == customerId
                //razpay_orderid ==  data.razorpay_order_id
                //signature == data.razorpay_signature
                //auth_raz_order_id == authRazorpayOrderID
                this.props.hitEazyPaymentRazorpaySuccessApi(data.razorpay_payment_id, data.razorpay_order_id, data.razorpay_signature, authRazorpayOrderID, customerId, paymentType )
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
            this.props.navigation.push("EazyPaymentScreen")
        } else {
            AppToast("Error while payment")
        }
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
    render() {
        const { orderList } = this.state;
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
                {orderList.length > 0 ? <View style={styles.container}>
                    <FlatList
                        refreshControl={!this.state.isLoading &&
                            <RefreshControl
                                isLoading={this.state.isLoading}
                                onRefresh={() => this.refreshControlLoading()} />
                        }
                        data={orderList}
                        renderItem={this.renderMyOrder}
                        // ItemSeparatorComponent={this.FlatListItemSeparator}
                        renderSectionFooter={this.renderFooter}
                    />
                </View> : this.renderEmptyScreen()}
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
let container = connect(mapStateToProps, { ...actions, getEnabledPaymentInfo })(EazyPayment);
let loader = APILoadingHOC(container);

loader.getIntent = () => {
    return {
        routeName: EazyPayment.ROUTE_NAME,
    };
};
export default loader;