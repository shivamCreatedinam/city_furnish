import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import styles from '../onTimePayments/styles';
import resources from '../../../../res';
import MaterialInput from '../../../genriccomponents/input/MaterialInput';
import Button from '../../../genriccomponents/button/Button';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  myWidth,
  renderInputError,
  focusTo,
  checkIfUserIsLoggedIn,
  validateEmail,
  razorpayKeyId,
} from '../../../utility/Utils';
import AppUser from '../../../utility/AppUser';
import PaymentService from '../../../utility/PaymentService';
// import PayUBizSdk from 'payu-non-seam-less-react';
import * as actions from '../../../redux/actions/PaymentAction';
import AppToast from '../../../genriccomponents/appToast/AppToast';
import RazorpayCheckout from 'react-native-razorpay';

const FAILURE = 'failed';
class SiOnCredit extends Component {
  static ROUTE_NAME = 'SiOnCredit';
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      mobileNumber: '',
      amount: '',
      invoiceNo: '',
      Notes: '',
      error: {},
      recurringPaymentModes: [
        {
          id: '1',
          cardIcon: resources.images.icn_card,
          cartTitle: resources.strings.CREDIT_DEBIT,
          isSelected: false,
        },
        {
          id: '2',
          cardIcon: resources.images.icn_wallet,
          cartTitle: resources.strings.NET_BANKING,
          isSelected: false,
        },
        {
          id: '3',
          cardIcon: resources.images.icn_netbanking,
          cartTitle: resources.strings.UPI,
          isSelected: false,
        },
      ],
      selectedPaymentModeKey: '',
      paymentFlag: 'Razorpay',
    };
    this.firstNameRef = React.createRef();
    this.lastNameRef = React.createRef();
    this.emailRef = React.createRef();
    this.amountRef = React.createRef();
    this.invoiceRef = React.createRef();
  }

  componentDidMount() {
    this.getPaymentInfoData();
    let userDetails = AppUser.getInstance().userDetails;
    if (userDetails) {
      this.setState({
        email: userDetails.email,
        firstName: userDetails.full_name,
        mobileNumber: userDetails.mobile_number,
      });
    }
  }

  getPaymentInfoData = () => {
    this.props
      .getEnabledPaymentInfo()
      .then(data => {
        this.setState({
          paymentFlag:
            data.paymentgateway != null ? data.paymentgateway : 'Razorpay',
        });
      })
      .catch(error => {
        console.log('getEnabledPaymentInfo error', error);
      });
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
  callbackToRemoveError = key => {
    let {error} = this.state;
    if (error.hasOwnProperty(key)) {
      error[key] = '';
      this.setState({
        error: error,
      });
    }
  };

  renderRecurringPaymentMethods = () => {
    const {recurringPaymentModes} = this.state;
    return (
      <View style={[styles.viewPaymentMethods]}>
        <Text style={styles.textGstDetails}>
          {resources.strings.PAYMENT_METHOD}
        </Text>
        <Text style={styles.textChoosePaymentMethod}>
          {resources.strings.ChoosePaymentMethod}
        </Text>
        {this.renderRecurringCardOption(recurringPaymentModes)}
      </View>
    );
  };
  renderRecurringCardOption = paymentModes => {
    let views = [];
    paymentModes.forEach(mode => {
      views.push(
        <View
          key={mode.cartTitle + '__' + mode.id}
          style={[styles.rowDirection, styles.containerHeight]}>
          <TouchableOpacity
            // style={{ backgroundColor: 'pink' }}
            onPress={() =>
              this.onSelectedRecurringPaymentMode(mode.cartTitle, mode.id)
            }>
            <View
              style={[
                styles.creditCardView,
                styles.rowDirection,
                {borderWidth: 0, width: myWidth - 40},
              ]}>
              <View style={[styles.rowDirection]}>
                <Image
                  source={mode.cardIcon}
                  style={styles.iconStyle}
                  resizeMode={'contain'}
                />
                <Text style={styles.cardNameStyle}>{mode.cartTitle}</Text>
              </View>
              {mode.isSelected ? (
                <Image
                  source={resources.images.icn_selectedsaqure}
                  style={{width: 20, height: 20, paddingVertical: 2}}
                />
              ) : (
                <Image
                  source={resources.images.icn_unSelectedSqure}
                  style={{width: 20, height: 20, paddingVertical: 2}}
                />
              )}
            </View>
          </TouchableOpacity>
        </View>,
      );
    });
    return views;
  };
  onSelectedRecurringPaymentMode = (cardTitle, cardId) => {
    const {recurringPaymentModes} = this.state;
    let arr1 = recurringPaymentModes.filter(item => {
      if (cardId == item.id) {
        item.isSelected = !item.isSelected;
      } else {
        item.isSelected = false;
      }
      return item;
    });
    this.setState({
      recurringPaymentModes: arr1,
      selectedPaymentModeKey: arr1[0].isSelected
        ? 'card'
        : arr1[1].isSelected
        ? 'emandate'
        : arr1[2].isSelected
        ? 'upi'
        : '',
    });
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
    } = this.state;

    return (
      <View style={styles.fullScreen}>
        <KeyboardAwareScrollView
          bounces={false}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            {this.renderRecurringPaymentMethods()}
            <MaterialInput
              label={resources.strings.FIRST_NAME}
              value={firstName}
              onChangeText={this.onChangeFirstName}
              error={renderInputError('firstNameErr', error)}
              errorKey={'firstNameErr'}
              callbackToRemoveError={this.callbackToRemoveError}
              inputProps={{
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
                returnKeyType: 'done',
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
          </View>
        </KeyboardAwareScrollView>

        <View style={styles.proceedBtn}>
          <Button
            btnStyle={styles.buttonStyle}
            touchOpacityStyle={{}}
            rounded
            btnText={resources.strings.Proceed}
            onPress={this.onPressProceed}
          />
        </View>
      </View>
    );
  }

  onPressProceed = () => {
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
    const {
      firstName,
      lastName,
      email,
      mobileNumber,
      amount,
      invoiceNo,
      Notes,
      selectedPaymentModeKey,
    } = this.state;
    let isSISelected = 1;
    this.props
      .hitCustomerOneTimeRazorpayPaymentApi(
        email,
        amount,
        firstName,
        lastName,
        invoiceNo,
        Notes,
        selectedPaymentModeKey,
        isSISelected,
      )
      .then(resp => {
        this.setState({isLoading: false});
        this.props
          .hitCreateCustomerOneTimeRazorpayPaymentApiRecurring(
            firstName,
            email,
            mobileNumber,
            amount,
            selectedPaymentModeKey,
          )
          .then(response => {
            this.setState({isLoading: false});
            if (response.raz_order_id) {
              this.getHashesFromServerAndConnectRazorpay(
                firstName,
                email,
                mobileNumber,
                amount,
                response.raz_order_id,
                response.customer_id,
                selectedPaymentModeKey,
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
      })
      .catch(err => {
        AppToast(err);
        console.log('Error while One time Payment', err);
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
    orderID,
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
        order_id: orderID, //Replace this with an order_id created using Orders API. Learn more at https://razorpay.com/docs/api/orders.
        customer_id: customerId,
        recurring: 1,
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
          this.props
            .hitCustomerOneTimeRazorpayPaymentSuccessApi(
              data.razorpay_payment_id,
              orderID,
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
    const {firstName, lastName, email, amount, invoiceNo} = this.state;
    this.props
      .hitCustomerOneTimePaymentApi(
        firstName,
        lastName,
        email,
        'enach',
        amount,
        '',
        invoiceNo,
      )
      .then(resp => {
        let data = resp.data;
        if (data.txnid) {
          this.getHashesFromServerAndConnectPayu(
            firstName,
            email,
            amount,
            data.txnid,
            data.surl,
            data.furl,
          );
        } else {
          this.goBackAndUpdate(true);
        }
      })
      .catch(err => {
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
          fullname: fullname,
          email: email,
          userCredentials: resp.data.user_credentials,
        };
        let obj = new PaymentService(data);
        let parmas = obj.getParamsForPayu();
        let hashParams = obj.getAllHashesAsParam(resp.data);
        PayUBizSdk.makePayment(hashParams, parmas)
          .then(map => {
            console.log(
              'PayUBizSdk Response',
              'Merchant Response \n' +
                map.merchant_response +
                '\n Payu Response \n' +
                map.payu_response,
            );
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
    });
  };
  validate = () => {
    const {selectedPaymentModeKey, firstName, amount, email} = this.state;

    let errorObject = {};
    if (selectedPaymentModeKey == '') {
      AppToast('Please select one payment mode');
      return false;
    }
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
}

const mapStateToProps = state => {
  return {};
};

let container = connect(
  mapStateToProps,
  {...actions},
)(SiOnCredit);
export default container;

// export default SiOnCredit;
