import React, {Component} from 'react';
import {View, Text, Image, TextInput, ActivityIndicator} from 'react-native';
import HeaderWithProfilePic from '../../genriccomponents/header/HeaderWithProfilePic';
import Button from '../../genriccomponents/button/Button';
import resources from '../../../res';
import styles from './styles';
import * as actions from '../../redux/actions/InvoiceAction';
import {getHashForPayment} from '../../redux/actions/PaymentAction';
import {getEnabledPaymentInfo} from '../../redux/actions/PaymentAction';
import {connect} from 'react-redux';
import PaymentService from '../../utility/PaymentService';
// import PayUBizSdk from 'payu-non-seam-less-react';
import AppUser from '../../utility/AppUser';
import {razorpayKeyId} from '../../utility/Utils';
import APILoadingHOC from '../../genriccomponents/HOCS/APILoadingHOC';
import AppToast from '../../genriccomponents/appToast/AppToast';
import RazorpayCheckout from 'react-native-razorpay';

const FAILURE = 'failed';

class PayOutstandingScreen extends Component {
  constructor(props) {
    super(props);
    this.callback = this.props.route.params.callback
      ? this.props.route.params.callback
      : null;
    this.state = {
      redeemedCoins: '',
      invoiceId: this.props.route.params.invoiceId
        ? this.props.route.params.invoiceId
        : '',
      outstandingAmount: this.props.route.params.outstandingAmount
        ? this.props.route.params.outstandingAmount
        : '',
      isCoinRedeemd: false,
      coins_amount: this.props.route.params.coinsAmount
        ? this.props.route.params.coinsAmount
        : 0,
      isLoading: false,
      paymentType: 'one_time',
      paymentFlag: 'Razorpay',
    };
  }
  componentDidMount() {
    this.getPaymentInfoData();
  }
  getPaymentInfoData = () => {
    this.props
      .getEnabledPaymentInfo()
      .then(data => {
        this.setState({
          paymentFlag:
            data.paymentgateway != null ? data.paymentgateway : 'Payu',
        });
      })
      .catch(error => {
        console.log('getEnabledPaymentInfo error', error);
      });
  };
  onBackClick = () => {
    this.props.navigation.goBack();
  };
  renderHeader = () => {
    return (
      <HeaderWithProfilePic
        headerTitle={resources.strings.OUT_STANDING_PAYMENT}
        isBackIconVisible={true}
        isProfileIconVisible={false}
        isLogoutVisible={false}
        onBackClick={this.onBackClick}
        navigateProps={this.props.navigation}
      />
    );
  };
  onCfCoinRedeemedChange = text => {
    this.setState({
      redeemedCoins: text,
    });
  };
  render() {
    const {redeemedCoins, isCoinRedeemd} = this.state;
    return (
      <View style={styles.fullScreen}>
        {this.renderHeader()}
        <View style={{marginHorizontal: 25, marginVertical: 30}}>
          <View style={styles.rowDirectionCenter}>
            <Text style={styles.outStandingLabel}>Out standing amount : </Text>
            <Text style={styles.outstandingMoney}>
              ₹ {this.state.outstandingAmount}
            </Text>
          </View>
          <View style={[styles.rowDirectionCenter, {marginVertical: 10}]}>
            <Text style={styles.outStandingLabel}>Your CF coin balance : </Text>
            <Image
              style={styles.coinImage}
              source={resources.images.coins_icn}
            />
            <Text style={styles.totalCoins}>{this.state.coins_amount}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.outStandingLabel}>Coins to be redeemd :</Text>
            <TextInput
              numberOfLines={1}
              onChangeText={this.onCfCoinRedeemedChange}
              value={redeemedCoins}
              autoCaptialize="none"
              keyboardType={'number-pad'}
              returnKeyType="done"
              style={styles.coinsInputStyle}
              editable={!isCoinRedeemd ? true : false}
            />
          </View>
          <Button
            outlined
            touchOpacityStyle={{
              marginTop: 30,
              width: 150,
              alignSelf: 'center',
              height: 30,
              marginBottom: 100,
            }}
            btnStyle={{height: 30}}
            btnText={!isCoinRedeemd ? 'Redeem' : 'Remove'}
            textStyleOver={{color: resources.colors.textBlack}}
            onPress={
              !isCoinRedeemd
                ? this.onPressRedeeemCoins
                : this.onPressRemoveCoins
            }
          />

          <Button
            rounded
            btnText={'Pay now'}
            onPress={this.makePaymentOutStanding}
          />
        </View>
        {this.state.isLoading && this.showLoader()}
      </View>
    );
  }
  onPressRedeeemCoins = () => {
    const {invoiceId, redeemedCoins} = this.state;
    if (redeemedCoins == '') {
      AppToast('Please enter some coins');
      return;
    }
    let coins = parseInt(redeemedCoins);
    if (coins == 0) {
      AppToast('Please enter some coins');
      return;
    }
    this.props
      .hitRedeemInvoiceCoinsApi(invoiceId, redeemedCoins)
      .then(resp => {
        this.setState({
          outstandingAmount: resp.data.invoice_remaning_amount,
          isCoinRedeemd: true,
          coins_amount: resp.data.remaning_coins,
        });
      })
      .catch(err => {
        AppToast(err);
        console.log('Error while paying outstanding amount', err);
      });
  };

  onPressRemoveCoins = () => {
    this.props
      .hitRemoveInvoiceCoinsApi(this.state.invoiceId)
      .then(resp => {
        this.setState({
          redeemedCoins: '',
          outstandingAmount: resp.data.amount,
          coins_amount: resp.data.coins_amount,
          isCoinRedeemd: false,
        });
      })
      .catch(err => {
        console.log('Error while removing invoice coins', err);
      });
  };

  onPressPayment = () => {
    const {invoiceId, redeemedCoins} = this.state;
    let appUser = AppUser.getInstance();
    let fullname = appUser.userDetails.full_name;
    let email = appUser.userDetails.email;
    this.props
      .hitInvoicePayDueApi(invoiceId, redeemedCoins)
      .then(resp => {
        let data = resp.data;
        if (data.txnid) {
          this.getHashesFromServerAndConnectPayu(
            resp.data.amount,
            resp.data.txnid,
            resp.data.surl,
            resp.data.furl,
            fullname,
            email,
          );
        } else {
          AppToast('Payment done');
          this.goBackAndUpdateInvoice(true);
        }

        // this.setState({
        //     outstandingAmount: resp.data.amount,
        //     txnId: resp.data.txnid,
        //     sUrl: resp.data.surl,
        //     fUrl: resp.data.furl,
        //     isCoinRedeemd: true,
        //     coins_amount: resp.data.coins_amount
        // }, () => {
        //     setTimeout(() => {
        //         this.getHashesFromServerAndConnectPayu(resp.data.amount, resp.data.txnid,
        //             resp.data.surl,
        //             resp.data.furl,
        //             fullname, email);
        //     }, 500)
        // })
      })
      .catch(err => {
        console.log('Error while paying outstanding amount', err);
      });
  };
  getHashesFromServerAndConnectPayu = (
    amount,
    txnID,
    Surl,
    Furl,
    fullname,
    email,
  ) => {
    let amnt = amount.toString();
    let amountToBePaid = amnt.split('.')[0];
    let couponCodeToBeApplied = '';
    if (!fullname || !email) {
      Toast.show('Something went wrong!!');
      return;
    }
    this.props
      .getHashForPayment(
        amountToBePaid,
        fullname,
        email,
        txnID,
        couponCodeToBeApplied,
      )
      .then(resp => {
        // console.log(JSON.stringify(resp))
        let data = {
          amount: amountToBePaid,
          txnId: txnID,
          hashKey: resp.data.payment_source,
          merchantKey: resp.data.MERCHANT_KEY,
          address1: '',
          address2: '',
          city: '',
          offerKey: couponCodeToBeApplied,
          surl: Surl,
          furl: Furl,
        };
        let obj = new PaymentService(data);
        let parmas = obj.getParamsForPayu();
        let hashParams = obj.getAllHashesAsParam(resp.data);
        PayUBizSdk.makePayment(hashParams, parmas)
          .then(map => {
            // console.log("PayUBizSdk Response", 'Merchant Response \n' + map.merchant_response + '\n Payu Response \n' + map.payu_response);
            this.onPayemntResponse(JSON.parse(map.payu_response));
          })
          .catch(error => {
            this.goBackAndUpdateInvoice(false);
            // console.log("PayUBizSdk response", error.message);
          });
      })
      .catch(err => {
        console.log('error while fetching hash from server', err);
      });
  };
  onPayemntResponse = payu_response => {
    if (payu_response.unmappedstatus == FAILURE) {
      //payment failure
      this.goBackAndUpdateInvoice(false);
    } else {
      // payment success
      this.goBackAndUpdateInvoice(true);
    }
  };
  // Razorpay Integration
  makePaymentOutStanding = () => {
    // this.payment()
    if (this.state.paymentFlag == 'Razorpay') {
      this.paymentRazorpay();
    } else {
      this.onPressPayment();
    }
  };
  paymentRazorpay = () => {
    this.setState({isLoading: true});
    const {
      invoiceId,
      outstandingAmount,
      redeemedCoins,
      paymentType,
    } = this.state;
    let appUser = AppUser.getInstance();
    let fullname = appUser.userDetails.full_name;
    let email = appUser.userDetails.email;
    let mobileNumber = appUser.userDetails.mobile_number;
    this.props
      .hitOutStandingRazorpayPaymentApi(
        invoiceId,
        redeemedCoins,
        outstandingAmount,
      )
      .then(resp => {
        console.log('resp.data', resp.data);
        this.setState({isLoading: false});
        if (resp.data.zero_amount) {
          this.goBackAndUpdateInvoice(true);
        } else {
          let responseOrderAmount = resp.data.amount;
          this.props
            .hitCreateOutStandingRazorpayPaymentApi(
              fullname,
              email,
              mobileNumber,
              responseOrderAmount,
            )
            .then(response => {
              this.setState({isLoading: false});
              if (response.raz_order_id) {
                this.getHashesFromServerAndConnectRazorpay(
                  fullname,
                  email,
                  mobileNumber,
                  responseOrderAmount,
                  response.raz_order_id,
                  response.customer_id,
                  paymentType,
                );
              } else {
                this.goBackAndUpdateInvoice(false);
              }
            })
            .catch(err => {
              this.setState({isLoading: false});
              AppToast(err);
              console.log('Error while One time Payment', err);
            });
        }
      })
      .catch(err => {
        this.setState({isLoading: false});
        AppToast(err);
        console.log('Error while One time Payment Customer', err);
      });
  };
  convertIntegerWithINR = amount => {
    return amount * 100;
  };
  getHashesFromServerAndConnectRazorpay = (
    fullname,
    email,
    mobileNumber,
    amount,
    authRazorpayOrderID,
    customerId,
    paymentType,
  ) => {
    let amnt = amount.toString();
    let amountToBePaid = amnt.split('.')[0];
    let couponCodeToBeApplied = '';
    if (!fullname || !email) {
      Toast.show('Something went wrong!!');
      return;
    }
    try {
      var options = {
        description: resources.strings.razorpayPayOutStandingDescription,
        image: resources.strings.razorpayImageUrl,
        currency: resources.strings.razorpayCurrency,
        key: razorpayKeyId,
        amount: this.convertIntegerWithINR(parseInt(amountToBePaid)),
        name: resources.strings.razorpayTitle,
        order_id: authRazorpayOrderID, //Replace this with an order_id created using Orders API. Learn more at https://razorpay.com/docs/api/orders.
        prefill: {
          email: email,
          contact: mobileNumber,
          name: fullname,
        },
        theme: {color: resources.colors.razorpayColor},
        readonly: {
          email: false,
          contact: false,
          name: false,
        },
      };
      RazorpayCheckout.open(options)
        .then(data => {
          // handle success
          this.setState({isLoading: true});
          //razorpay_payment_id == transactionID
          //orderid  == dealCodeNumber
          //customer_id  == customerId
          //razpay_orderid ==  data.razorpay_order_id
          //signature == data.razorpay_signature
          //auth_raz_order_id == authRazorpayOrderID
          this.props
            .hitOutStandingRazorpayPaymentSuccessApi(
              data.razorpay_payment_id,
              data.razorpay_order_id,
              data.razorpay_signature,
              authRazorpayOrderID,
              amountToBePaid,
              paymentType,
            )
            .then(resp => {
              this.setState({isLoading: false});
              this.goBackAndUpdateInvoice(true);
            })
            .catch(err => {
              this.setState({isLoading: false});
              this.goBackAndUpdateInvoice(false);
              console.log('Error while PayoutStanding Payment', err);
            });
        })
        .catch(error => {
          // handle failure
          this.setState({isLoading: false});
          this.goBackAndUpdateInvoice(false);
          console.log(`Error: ${error.code} | ${error.description}`);
        });
    } catch (err) {
      AppToast('Payment not Initiated. try again later!');
      console.log('error while fetching hash from server', err);
    }
  };
  onRazorpayPayemntResponse = razorpay_payment_id => {
    if (razorpay_payment_id == null || razorpay_payment_id == '') {
      //payment failure
      this.goBackAndUpdateInvoice(false);
    } else {
      // payment success
      this.goBackAndUpdateInvoice(true);
    }
  };
  goBackAndUpdateInvoice = isSuccess => {
    if (isSuccess) {
      if (this.callback) {
        if (this.state.isCoinRedeemd) {
          let userDetails = AppUser.getInstance().userDetails;
          userDetails.cf_coins = this.state.coins_amount;
        }
        this.callback();
        AppToast('Payment done successfully');
        this.onBackClick();
      }
    } else {
      AppToast('Error while payment');
      this.onBackClick();
    }
  };
  showLoader = () => {
    return (
      <View style={styles.containerLoaderStyle}>
        <ActivityIndicator size="large" color={resources.colors.appColor} />
      </View>
    );
  };
}
const mapStateToProps = state => {
  return {};
};

let container = connect(
  mapStateToProps,
  {...actions, getHashForPayment, getEnabledPaymentInfo},
)(PayOutstandingScreen);
let loader = APILoadingHOC(container);
export default loader;
