import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux';
import styles from './styles';
import resources from '../../../../res';
import MaterialInput from '../../../genriccomponents/input/MaterialInput';
import Button from '../../../genriccomponents/button/Button';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  renderInputError,
  focusTo,
  checkIfUserIsLoggedIn,
  showSigninAlert,
  validateEmail,
  razorpayKeyId,
} from '../../../utility/Utils';
import AppUser from '../../../utility/AppUser';
import * as actions from '../../../redux/actions/PaymentAction';
import PaymentService from '../../../utility/PaymentService';
// import PayUBizSdk from 'payu-non-seam-less-react';
import AppToast from '../../../genriccomponents/appToast/AppToast';
import AsyncStorage from '@react-native-community/async-storage';
import RazorpayCheckout from 'react-native-razorpay';
const FAILURE = 'failed';
class OneTimePayment extends Component {
  static ROUTE_NAME = 'WishListScreen';
  constructor(props) {
    super(props);
    this.fromRoute =
      this.props && this.props.fromRoute ? this.props.fromRoute : null;
    this.state = {
      customer_id: '',
      firstName: '',
      lastName: '',
      email: '',
      mobileNumber: '',
      amount: '',
      invoiceNo: '',
      Notes: '',
      error: {},
      cfCoin: '',
      isCoinRedeemd: false,
      userCoinBalance: 0,
      amountAfterCoinRedeemption: '',
      isLoading: true,
      paymentType: 'one_time',
      paymentFlag: 'Payu',
    };
    this.firstNameRef = React.createRef();
    this.lastNameRef = React.createRef();
    this.emailRef = React.createRef();
    this.amountRef = React.createRef();
    this.invoiceRef = React.createRef();
    this.notesRef = React.createRef();
  }

  componentDidMount() {
    this.getPaymentInfoData();
    if (this.fromRoute == 'DashboardScreen') {
      this.getDataFromCustomerPayment();
      this.getDataFromAsyncStorageCustomerPayment();
    } else {
      this.getDataFromCustomerPayment();
    }
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

  getDataFromCustomerPayment = () => {
    this.setState({isLoading: false});
    let userDetails = AppUser.getInstance().userDetails;
    // console.log("user", userDetails)
    if (checkIfUserIsLoggedIn()) {
      this.props
        .getUpdateWalletAmount()
        .then(resp => {
          if (userDetails) {
            this.setState({
              email: userDetails.email,
              firstName: userDetails.full_name,
              mobileNumber: userDetails.mobile_number,
              userCoinBalance: resp.data
                ? resp.data.topup_amount
                : userDetails.cf_coins,
            });
          }
        })
        .catch(err => {
          console.log('Error while fetching update coins ', err);
          this.setDataWhenAnyError();
        });
    } else {
      this.setDataWhenAnyError();
    }
  };

  getDataFromAsyncStorageCustomerPayment = async () => {
    this.setState({isLoading: false});
    let userDetails = AppUser.getInstance().userDetails;
    try {
      // fetching Email
      let customerEmail = await AsyncStorage.getItem('@CUSTOMER_EMAIL');
      if (customerEmail !== null) {
        this.setState({email: customerEmail});
      }

      // fetching Invoice Number
      let customerInvoiveNumber = await AsyncStorage.getItem(
        '@CUSTOMER_INVOICE_NUMBER',
      );
      if (customerInvoiveNumber !== null) {
        this.setState({invoiceNo: customerInvoiveNumber});
      }

      // fetching Amount
      let customerAmount = await AsyncStorage.getItem('@CUSTOMER_AMOUNT');
      if (customerAmount !== null) {
        this.setState({amount: customerAmount});
      }

      // fetching Name
      let customerName = await AsyncStorage.getItem('@CUSTOMER_NAME');
      if (customerName !== null) {
        this.setState({firstName: customerName});
      }

      // fetching customer_id
      let customerCustomerId = await AsyncStorage.getItem(
        '@CUSTOMER_CUSTOMER_ID',
      );
      if (customerCustomerId !== null) {
        this.setState({customer_id: customerCustomerId});
      }

      // fetching mobileNumber
      this.setState({mobileNumber: userDetails.mobile_number});
    } catch (error) {
      // Error retrieving data
      console.log('Error retrieving data');
      // this.setDataWhenAnyError()
    }
  };

  setDataWhenAnyError = () => {
    let userDetails = AppUser.getInstance().userDetails;
    if (userDetails) {
      this.setState({
        email: userDetails.email,
        firstName: userDetails.full_name,
        mobileNumber: userDetails.mobile_number,
        userCoinBalance: userDetails.cf_coins,
      });
    }
  };

  focusToNext = ref => {
    focusTo(ref);
  };
  onChangeFirstName = text => {
    this.setState({firstName: text});
  };
  onChangeLastName = text => {
    this.setState({lastName: text});
  };
  onChangeEmail = text => {
    this.setState({email: text});
  };
  onChangeAmount = text => {
    this.setState({amount: text});
  };
  onChangeInvoice = text => {
    this.setState({invoiceNo: text});
  };
  onChangeNotes = text => {
    this.setState({Notes: text});
  };
  onCfCoinRedeemedChange = text => {
    this.setState({cfCoin: text});
  };

  render() {
    const {
      firstName,
      lastName,
      email,
      amount,
      invoiceNo,
      Notes,
      error,
      cfCoin,
      isCoinRedeemd,
      userCoinBalance,
    } = this.state;
    return (
      <View style={styles.fullScreen}>
        <KeyboardAwareScrollView
          bounces={false}
          // keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <MaterialInput
              label={resources.strings.FIRST_NAME}
              value={firstName}
              onChangeText={this.onChangeFirstName}
              error={renderInputError('firstNameErr', error)}
              errorKey={'firstNameErr'}
              callbackToRemoveError={this.callbackToRemoveError}
              inputProps={{
                autoCaptialize: 'none',
                returnKeyType: 'next',
                maxLength: 20,
                editable: checkIfUserIsLoggedIn() ? false : true,
              }}
              onSubmitEditing={() => this.focusToNext(this.firstNameRef)}
            />
            <MaterialInput
              label={resources.strings.LAST_NAME}
              onChangeText={this.onChangeLastName}
              value={lastName}
              error={renderInputError('lastNameErr', error)}
              errorKey={'lastNameErr'}
              callbackToRemoveError={this.callbackToRemoveError}
              inputProps={{
                autoCaptialize: 'none',
                maxLength: 10,
                returnKeyType: 'next',
              }}
              reference={this.firstNameRef}
              onSubmitEditing={() => this.focusToNext(this.lastNameRef)}
            />
            <MaterialInput
              label={resources.strings.EMAIL_REGISTERED}
              onChangeText={this.onChangeEmail}
              value={email}
              error={renderInputError('emailErr', error)}
              errorKey={'emailErr'}
              callbackToRemoveError={this.callbackToRemoveError}
              inputProps={{
                autoCaptialize: 'none',
                maxLength: 50,
                returnKeyType: 'next',
                editable: checkIfUserIsLoggedIn() ? false : true,
              }}
              reference={this.lastNameRef}
              onSubmitEditing={() => this.focusToNext(this.emailRef)}
            />
            <MaterialInput
              label={resources.strings.AMOUNT}
              onChangeText={this.onChangeAmount}
              value={amount}
              error={renderInputError('amountErr', error)}
              errorKey={'amountErr'}
              callbackToRemoveError={this.callbackToRemoveError}
              inputProps={{
                keyboardType: 'phone-pad',
                autoCaptialize: 'none',
                maxLength: 50,
                returnKeyType: 'done',
              }}
              reference={this.emailRef}
              onSubmitEditing={() => this.focusToNext(this.amountRef)}
            />

            <MaterialInput
              label={resources.strings.INVOICE}
              onChangeText={this.onChangeInvoice}
              error={renderInputError('invoiceErr', error)}
              errorKey={'invoiceErr'}
              callbackToRemoveError={this.callbackToRemoveError}
              value={invoiceNo}
              inputProps={{
                autoCaptialize: 'none',
                maxLength: 30,
                returnKeyType: 'next',
              }}
              reference={this.amountRef}
              onSubmitEditing={() => this.focusToNext(this.invoiceRef)}
            />
            <MaterialInput
              label={resources.strings.NOTES}
              onChangeText={this.onChangeNotes}
              error={renderInputError('notesErr', error)}
              errorKey={'notesErr'}
              callbackToRemoveError={this.callbackToRemoveError}
              value={Notes}
              inputProps={{
                autoCaptialize: 'none',
                maxLength: 30,
                returnKeyType: 'done',
              }}
              reference={this.invoiceRef}
            />

            {checkIfUserIsLoggedIn() ? (
              <View style={styles.cfCoinsStyle}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 14,
                  }}>
                  <Image source={resources.images.cf_coins} />
                  <Text style={styles.cfCoinText}>
                    {resources.strings.YOUR_CF_COINS}
                  </Text>
                  <Text style={styles.cfCoinBalance}> {userCoinBalance}</Text>
                </View>

                <MaterialInput
                  label={resources.strings.CF_COIN_REDEEMED}
                  onChangeText={this.onCfCoinRedeemedChange}
                  error={renderInputError('cfCoinsErr', error)}
                  errorKey={'cfCoinsErr'}
                  callbackToRemoveError={this.callbackToRemoveError}
                  value={cfCoin}
                  inputProps={{
                    keyboardType: 'phone-pad',
                    editable: !isCoinRedeemd ? true : false,
                    autoCaptialize: 'none',
                    returnKeyType: 'done',
                  }}
                  reference={this.stateRef}
                />
                <TouchableOpacity
                  onPress={
                    !isCoinRedeemd ? this.onRedeemCoins : this.onRemoveCoins
                  }
                  style={styles.RedeemBtn}>
                  <Text style={styles.redeemText}>
                    {!isCoinRedeemd
                      ? resources.strings.REDEEM
                      : resources.strings.REMOVE}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 14,
                }}>
                <Image source={resources.images.cf_coins} />
                <Text style={styles.cfCoinText}>
                  {resources.strings.YOUR_CF_COINS}
                </Text>
                <TouchableOpacity onPress={this.onPressCheckCoins}>
                  <Text style={styles.checkCoinsText}>: Login to check</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </KeyboardAwareScrollView>
        {/* <Text style={{ fontSize: 23 }}>{this.state.amountAfterCoinRedeemption}</Text> */}
        <View style={styles.proceedBtn}>
          <Button
            btnStyle={styles.buttonStyle}
            touchOpacityStyle={{}}
            rounded
            btnText={resources.strings.Proceed}
            onPress={this.makePaymentUpdated}
          />
        </View>

        {this.state.isLoading && this.showLoader()}
      </View>
    );
  }
  callbackToRemoveError = key => {
    let {error} = this.state;
    if (error.hasOwnProperty(key)) {
      error[key] = '';
      this.setState({
        error: error,
      });
    }
  };
  onPressCheckCoins = () => {
    showSigninAlert('MyAccountScreen');
  };
  onRedeemCoins = () => {
    const {cfCoin, amount} = this.state;
    if (amount == '') {
      AppToast('Please enter some amount');
      return;
    }
    if (cfCoin == '') {
      AppToast('Please enter some coins');
      return;
    }

    let coins = parseInt(cfCoin);
    if (coins == 0) {
      AppToast('Please enter some coins');
      return;
    }
    this.props
      .hitCustomerPaymentRedeemCoinsApi(amount, cfCoin)
      .then(resp => {
        console.log(resp);
        AppToast('Coins applied successfully');
        let data = resp.data;
        this.setState({
          isCoinRedeemd: true,
          userCoinBalance: data.remaning_coins,
          amountAfterCoinRedeemption: data.remaning_amount,
        });
      })
      .catch(err => {
        AppToast(err);
        console.log('Error while paying outstanding amount', err);
      });
  };
  onRemoveCoins = () => {
    this.props
      .hitCustomerPaymentRemoveCoinsApi()
      .then(resp => {
        console.log(resp);
        let data = resp.data;
        this.setState({
          isCoinRedeemd: false,
          userCoinBalance: data.coin_amount,
          cfCoin: '',
          amountAfterCoinRedeemption: '',
        });
      })
      .catch(err => {
        AppToast(err);
        console.log('Error while removing invoice coins', err);
      });
  };

  makePaymentUpdated = () => {
    const isValid = this.validate();
    if (!isValid) {
      return;
    }
    // this.payment()
    if (this.state.paymentFlag == 'Razorpay') {
      this.paymentRazorpay();
    } else {
      this.payment();
    }
  };
  paymentRazorpay = () => {
    this.setState({isLoading: true});
    const {
      firstName,
      lastName,
      email,
      mobileNumber,
      amount,
      invoiceNo,
      Notes,
      paymentType,
      amountAfterCoinRedeemption,
      cfCoin,
    } = this.state;
    let amountTopaid = '';
    if (amountAfterCoinRedeemption == '' && amountAfterCoinRedeemption != '0') {
      amountTopaid = amount;
    } else {
      amountTopaid = amountAfterCoinRedeemption;
    }
    let isSISelected = 0;
    this.props
      .hitCustomerOneTimeRazorpayPaymentApi(
        email,
        amountTopaid,
        cfCoin,
        firstName,
        lastName,
        invoiceNo,
        Notes,
        paymentType,
        isSISelected,
      )
      .then(resp => {
        this.setState({isLoading: false});
        if (resp.zero_amount) {
          this.goBackAndUpdate(true);
        } else {
          let responseName =
            resp.dataArr.ABC.firstname != null
              ? resp.dataArr.ABC.firstname
              : firstName;
          let responseEmail =
            resp.dataArr.ABC.email != null ? resp.dataArr.ABC.email : email;
          let responsePhone =
            resp.dataArr.ABC.phone != null
              ? resp.dataArr.ABC.phone
              : mobileNumber;
          // let responseOrderAmount = resp.dataArr.ABC.orderAmount != null ? resp.dataArr.ABC.orderAmount : amountTopaid;
          let responseOrderAmount = amountTopaid;
          this.props
            .hitCreateCustomerOneTimeRazorpayPaymentApi(
              responseName,
              responseEmail,
              responsePhone,
              responseOrderAmount,
            )
            .then(response => {
              this.setState({isLoading: false});
              if (response.raz_order_id) {
                this.getHashesFromServerAndConnectRazorpay(
                  responseName,
                  responseEmail,
                  responsePhone,
                  responseOrderAmount,
                  response.raz_order_id,
                  response.customer_id,
                  paymentType,
                );
              } else {
                this.goBackAndUpdate(false);
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
        description: resources.strings.razorpayDescription,
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
            .hitCustomerOneTimeRazorpayPaymentSuccessApi(
              data.razorpay_payment_id,
              data.razorpay_order_id,
              data.razorpay_signature,
              authRazorpayOrderID,
              amountToBePaid,
              paymentType,
            )
            .then(resp => {
              this.setState({isLoading: false});
              this.goBackAndUpdate(true);
            })
            .catch(err => {
              this.setState({isLoading: false});
              this.goBackAndUpdate(false);
              console.log('Error while One time Payment', err);
            });
        })
        .catch(error => {
          // handle failure
          this.setState({isLoading: false});
          this.goBackAndUpdate(false);
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
      this.goBackAndUpdate(false);
    } else {
      // payment success
      this.goBackAndUpdate(true);
    }
  };

  payment = () => {
    this.setState({isLoading: true});
    const {
      firstName,
      lastName,
      email,
      amount,
      invoiceNo,
      amountAfterCoinRedeemption,
      cfCoin,
    } = this.state;
    let amountTopaid = '';
    if (amountAfterCoinRedeemption == '' && amountAfterCoinRedeemption != '0') {
      amountTopaid = amount;
    } else {
      amountTopaid = amountAfterCoinRedeemption;
    }
    this.props
      .hitCustomerOneTimePaymentApi(
        firstName,
        lastName,
        email,
        'one_time',
        amount,
        cfCoin,
        invoiceNo,
      )
      .then(resp => {
        this.setState({isLoading: false});
        let data = resp.data;
        if (data.txnid) {
          this.getHashesFromServerAndConnectPayu(
            firstName,
            email,
            amountTopaid,
            data.txnid,
            data.surl,
            data.furl,
          );
        } else {
          this.goBackAndUpdate(true);
        }
      })
      .catch(err => {
        this.setState({isLoading: false});
        AppToast(err);
        console.log('Error while One time Payment', err);
      });
  };
  getHashesFromServerAndConnectPayu = (
    fullname,
    email,
    amount,
    txnID,
    Surl,
    Furl,
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
        let data = {
          env: resp.data.env,
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
          fullname: fullname,
          email: email,
          userCredentials: resp.data.user_credentials,
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
            this.goBackAndUpdate(false);
            console.log('PayUBizSdk response', error.message);
          });
      })
      .catch(err => {
        AppToast(err);
        console.log('error while fetching hash from server', err);
      });
  };
  onPayemntResponse = payu_response => {
    if (payu_response.unmappedstatus == FAILURE) {
      //payment failure
      this.goBackAndUpdate(false);
    } else {
      // payment success
      this.goBackAndUpdate(true);
    }
  };

  goBackAndUpdate = isSuccess => {
    if (isSuccess) {
      AppToast('Payment done successfully');
      if (this.state.isCoinRedeemd) {
        let userDetails = AppUser.getInstance().userDetails;
        userDetails.cf_coins = this.state.userCoinBalance;
      }
      this.reset();
    } else {
      AppToast('Error while payment');
    }
  };

  reset = () => {
    this.setState({
      amount: '',
      invoiceNo: '',
      Notes: '',
      error: {},
      cfCoin: '',
      isCoinRedeemd: false,
      amountAfterCoinRedeemption: '',
    });
  };
  validate = () => {
    const {firstName, amount, email} = this.state;

    let errorObject = {};
    if (firstName.trim() == '') {
      errorObject.firstNameErr = resources.strings.nameCannotBeEmpty;
    } else if (firstName.length > 20) {
      errorObject.firstNameErr = resources.strings.name20length;
    } else if (firstName.length <= 1) {
      errorObject.firstNameErr = resources.strings.name2length;
    }
    if (email.trim() == '') {
      errorObject.emailErr = resources.strings.emailCannotBeEmpty;
    } else if (email.trim().length > 100) {
      errorObject.emailErr = resources.strings.email100length;
    } else if (!validateEmail(email.trim())) {
      errorObject.emailErr = resources.strings.enterValidEmail;
    }

    if (amount.trim() == '') {
      errorObject.amountErr = resources.strings.amountCannotBeEmpty;
    }

    this.setState({error: errorObject});
    return Object.keys(errorObject).length == 0;
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

let OneTimePaymentContainer = connect(
  mapStateToProps,
  {...actions},
)(OneTimePayment);
export default OneTimePaymentContainer;
