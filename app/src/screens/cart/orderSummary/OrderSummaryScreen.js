import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  Switch,
  TouchableOpacity,
  Modal,
  Dimensions,
  Platform,
} from 'react-native';
import styles from './styles';
import HeaderWithProfile from '../../../genriccomponents/header/HeaderWithProfilePic';
import resources from '../../../../res';
import MaterialInput from '../../../genriccomponents/input/MaterialInput';
import {myWidth, razorpayKeyId} from '../../../utility/Utils';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Button from '../../../genriccomponents/button/Button';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions/PaymentAction';
import PaymentService from '../../../utility/PaymentService';
// import PayUBizSdk from 'payu-non-seam-less-react';
import AppUser from '../../../utility/AppUser';
import APILoadingHOC from '../../../genriccomponents/HOCS/APILoadingHOC';
import AsyncStorageConstants from '../../../utility/AsyncStorageConstants';
import AsyncStorage from '@react-native-community/async-storage';
import {
  onUpdateCartBadgeCount,
  getCartDetailApi,
} from '../../../redux/actions/CartAction';
import AppToast from '../../../genriccomponents/appToast/AppToast';
import RazorpayCheckout from 'react-native-razorpay';
import CheckBox from '@react-native-community/checkbox';
import NewCheckBox from 'react-native-check-box';
import ImageText from './ImageText';
import LittleSection from './LittleSection';
import {BASE_URL} from '../../../apimanager/ApiEndpoint';
import Icon from 'react-native-vector-icons/Ionicons';
import analytics from '@react-native-firebase/analytics';

const CREDIT_SCORE_REQUIRE = 0;
const KYC_REQUIRE = 1;
const AUTO_PAYMENT_REQUIRE = 2;

const IS_NATCH_KEY = 'is_nach'; //'is_nach' for Credit / Debit Card, 'normal_payment'  for netbanking and others
const NORMAL_PAYMENT_KEY = 'normal_payment';
const FAILURE = 'failed';

// https://rentofurniture.com/v1/cart/cityshield

class OrderSummaryScreen extends Component {
  static ROUTE_NAME = 'OrderSummaryScreen';
  constructor(props) {
    super(props);
    this.checkoutOrderDetails =
      this.props.route.params && this.props.route.params.checkoutOrderDetails
        ? this.props.route.params.checkoutOrderDetails
        : null;
    this.selectedAddress =
      this.props.route.params && this.props.route.params.selectedAddress
        ? this.props.route.params.selectedAddress
        : null;
    this.isComingFromBuyNow =
      this.props.route.params && this.props.route.params.isComingFromBuyNow
        ? this.props.route.params.isComingFromBuyNow
        : false;
    this.grandTotal =
      this.props.route.params && this.props.route.params.grandTotal
        ? this.props.route.params.grandTotal
        : 0;

    this.state = {
      toggleCheckBox: true,
      learnMore: false,
      alertModal: false,
      fetchedData: {},
      creditDebitMode: [
        {
          id: '1',
          cardIcon: resources.images.icn_card,
          cartTitle: resources.strings.CREDIT_DEBIT,
          isSelected: false,
        },
      ],
      paymentOtherModes: [
        {
          id: '2',
          cardIcon: resources.images.icn_netbanking,
          cartTitle: resources.strings.NET_BANKING,
          isSelected: false,
        },
        {
          id: '3',
          cardIcon: resources.images.icn_wallet,
          cartTitle: resources.strings.OTHER,
          isSelected: false,
        },
      ],
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
      redeemedCoins: '',
      whatappToggle: true,
      isGstSelected: false,
      gstNumber: '',
      companyName: '',
      standingInstructionToggle: false,
      isCoinRedeemed: false,
      selectedPaymentModeKey: 'other',
      dataAfterCoinsApplied: {},
      hideSItoggle: true,
      paymentFlag: 'Payu',

      upfront_categories: [],
      upfront_enabled: true,
      upfront_switch: false,
    };
  }
  componentDidMount() {
    // this.props.navigation.addListener('focus', () => this.componentDidFocus())
    this.componentDidFocus();
    this.getPaymentInfoData();
  }

  toggleCityShield = newValue => {
    let appUser = AppUser.getInstance();
    let token = appUser.token;
    let Userid = appUser.userId;

    let myHeaders = new Headers();
    myHeaders.append('authtoken', token);
    myHeaders.append('userid', Userid);

    var formdata = new FormData();
    formdata.append('is_care', newValue ? 1 : 0);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(`${BASE_URL}/v1/cart/cityshield`, requestOptions)
      .then(response => response.json())
      .then(result =>
        this.setState({
          fetchedData: result.data,
        }),
      )
      .then(() => console.log(this.state.fetchedData))
      .catch(error => console.log('error', error));
  };

  getPaymentInfoData = () => {
    this.props
      .getEnabledPaymentInfo()
      .then(data => {
        this.setState({
          paymentFlag:
            data.paymentgateway != null ? data.paymentgateway : 'Payu',
          upfront_categories: data.upfront_categories,
          upfront_enabled: data.upfront_enabled,
        });
      })
      .catch(error => {
        console.log('getEnabledPaymentInfo error', error);
      });
  };

  componentDidFocus = () => {
    // StatusBar.setBarStyle('dark-content');
    // StatusBar.setBackgroundColor(resources.colors.appColor);
    const {upfront_item_included} = this.checkoutOrderDetails;
    let upfront_api_call = false;
    if (upfront_item_included == 0) {
      this.setState({upfront_switch: false});
    } else if (upfront_item_included == 1) {
      upfront_api_call = true;
      this.setState({upfront_switch: true});
    } else if (upfront_item_included == 2) {
      this.setState({upfront_switch: true});
    }
    console.log('upfront_item_included', upfront_item_included);
    this.getOrderInfo(upfront_api_call);
  };

  getOrderInfo = async getUpfrontMode => {
    await this.props
      .getCartDetailApi(getUpfrontMode)
      .then(data => {
        this.checkoutOrderDetails = data.data;
        // console.log(data.data, 'new data');
      })
      .catch(error => {
        console.log(error, 'error');
      });
  };

  onBackClick = () => {
    this.props.navigation.goBack();
  };

  renderHeader = () => {
    return (
      <HeaderWithProfile
        headerTitle={resources.strings.ORDER_SUMMARY}
        isBackIconVisible
        isProfileIconVisible={false}
        navigateProps={this.props.navigation}
        onBackClick={this.onBackClick}
      />
    );
  };
  render() {
    const {products} = this.checkoutOrderDetails;
    let is_cfcoins_frp = true;
    products.map(item => {
      if (item.is_frp) {
        is_cfcoins_frp = false;
        return true;
      } else {
        return false;
      }
    });

    let grand_total = 0;
    if (this.isComingFromBuyNow) {
      grand_total = this.grandTotal;
    } else {
      grand_total = this.checkoutOrderDetails.grand_total;
    }

    console.log(products);

    return (
      <View style={styles.fullScreen}>
        {this.renderHeader()}
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          extraScrollHeight={100}>
          {/* cityshield */}

          <View style={styles.parentContainer}>
            <Text style={styles.textOrderDetails}>
              {resources.strings.ORDER_DETAIL}
            </Text>
            <View style={styles.lineStyle} />

            <View
              style={[
                styles.upfrontBox,
                {
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  width: '100%',
                },
              ]}>
              {/* First line */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 6,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={require('../../../../res/images/cityshield.png')}
                    height={45}
                    width={45}
                    style={{marginRight: 5}}
                  />
                  <Text style={{fontWeight: 'bold'}}>City Shield</Text>
                </View>
                {Platform.OS == 'android' ? (
                  <CheckBox
                    tintColors={{true: '#3e688e', false: '#3e688e'}}
                    value={this.state.toggleCheckBox}
                    boxType="square"
                    onCheckColor="#3e688e"
                    // onFillColor="#3e688e"
                    onTintColor="#3e688e"
                    tintColor="#3e688e"
                    onValueChange={newValue => {
                      console.log(newValue);
                      if (newValue) {
                        this.toggleCityShield(newValue);
                        this.setState({
                          toggleCheckBox: newValue,
                        });
                      } else {
                        this.setState({
                          alertModal: true,
                        });
                      }
                    }}
                  />
                ) : (
                  <NewCheckBox
                    isChecked={this.state.toggleCheckBox}
                    onClick={() => {
                      if (!this.state.toggleCheckBox) {
                        this.toggleCityShield(!this.state.toggleCheckBox);
                        this.setState({
                          toggleCheckBox: !this.state.toggleCheckBox,
                        });
                      } else {
                        this.setState({
                          alertModal: true,
                        });
                      }
                    }}
                    checkedCheckBoxColor="#3e688e"
                    checkBoxColor="#3e688e"
                  />
                )}
              </View>

              {/* second line */}
              <View
                style={{
                  // flexDirection:
                  //   Dimensions.get('screen').width <= 390 ? 'column' : 'row',
                  flexDirection: 'row',
                  marginBottom: 6,
                  justifyContent: 'flex-start',
                  width: '100%',
                  // backgroundColor: 'red',
                  flexWrap: 'wrap',
                  alignSelf: 'flex-start',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    // width: '45%',
                    justifyContent: 'flex-start',
                    marginRight: 6,
                    marginBottom: 6,
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      textDecorationLine: 'line-through',
                      color: 'grey',
                      alignItems: 'center',
                      marginRight: 6,
                    }}>
                    ₹{' '}
                    {Object.keys(this.state.fetchedData).length === 0
                      ? this.checkoutOrderDetails.city_shield
                          .total_monthly_actual_care_amount
                      : this.state.fetchedData.total_monthly_actual_care_amount}
                  </Text>
                  <Text
                    style={{
                      fontWeight: '900',
                      color: 'black',
                      fontSize: 13,
                    }}>
                    ₹{' '}
                    {Object.keys(this.state.fetchedData).length === 0
                      ? this.checkoutOrderDetails.city_shield
                          .total_monthly_care_amount
                      : this.state.fetchedData.total_monthly_care_amount}
                    /month
                  </Text>
                </View>

                <View
                  style={{
                    // backgroundColor: 'grey',
                    flexDirection: 'row',
                    // justifyContent: 'space-around',
                    width: '54%',
                  }}>
                  <View
                    style={{
                      backgroundColor: 'rgba(62, 104, 142, 0.21)',
                      paddingHorizontal: 6,
                      borderRadius: 3,
                      marginRight: 6,
                      alignItems: 'center',
                      justifyContent: 'center',
                      // width: '33%',
                    }}>
                    <Text
                      style={{
                        color: '#3e688e',
                        textAlignVertical: 'center',
                        fontSize: Dimensions.get('screen').fontScale * 12,
                      }}>
                      {Object.keys(this.state.fetchedData).length === 0
                        ? this.checkoutOrderDetails.city_shield
                            .cf_care_percentage
                        : this.state.fetchedData.cf_care_percentage}
                      % Off
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: 'rgba(239, 65, 48, 0.21)',
                      borderRadius: 3,
                      // width: '60%',
                      flexDirection: 'row',
                    }}>
                    <Text
                      style={{
                        color: '#ef4130',
                        borderRadius: 3,
                        textAlignVertical: 'center',
                        paddingHorizontal: 6,
                        fontSize: Dimensions.get('screen').fontScale * 12,
                        // flex: 1,
                      }}>
                      Limited period offer
                    </Text>
                    {console.log(Dimensions.get('screen').width)}
                  </View>
                </View>
              </View>

              {/* Third line */}
              <Text
                style={{
                  marginBottom: 6,
                  fontSize: Dimensions.get('screen').fontScale * 12,
                  // fontSize: 12,
                }}>
                Say goodbye to damage worries with City Shield. Protect your
                appliances and furniture worth ₹70,000 with just a click.
              </Text>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    learnMore: true,
                  });
                }}>
                <Text
                  style={{
                    textDecorationLine: 'underline',
                    color: '#527799',
                  }}>
                  Learn More
                </Text>
              </TouchableOpacity>
            </View>

            {/* Alert modal */}
            <Modal
              visible={this.state.alertModal}
              // visible={true}
              animationType="fade"
              transparent={true}>
              <View
                style={{
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <View
                  style={{
                    // height: Dimensions.get('window').height / 1.8,
                    width: '96%',
                    padding: 10,
                    backgroundColor: 'white',
                    borderRadius: 5,
                    justifyContent: 'center',
                  }}>
                  {/* First line of Modal */}
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: 10,
                      width: '100%',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Image
                        source={require('../../../../res/images/cityshield.png')}
                        height={45}
                        width={45}
                        style={{marginRight: 5}}
                      />
                      <Text style={{fontWeight: 'bold', fontSize: 21}}>
                        City Shield
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({
                          alertModal: !this.state.alertModal,
                        });
                      }}>
                      <Icon name="close" size={20} color={'black'} />
                    </TouchableOpacity>
                  </View>
                  <View
                    style={[
                      styles.lineStyle,
                      {
                        width: '100%',
                        borderColor: 'grey',
                        borderWidth: 0.5,
                        marginBottom: 30,
                      },
                    ]}
                  />

                  <Text style={{color: 'grey'}}>
                    Peace of mind is just a click away - opt for City Shield
                    today and get covered for accidental damages at ONLY ₹
                    {Object.keys(this.state.fetchedData).length === 0
                      ? this.checkoutOrderDetails.city_shield
                          .total_monthly_care_amount
                      : this.state.fetchedData.total_monthly_care_amount}
                    / month!
                  </Text>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingHorizontal: 10,
                      overflow: 'hidden',
                      marginVertical: 20,
                    }}>
                    <ImageText
                      uri={require('../../../../res/images/sofa.png')}
                      text={'Scratches & Dents'}
                      height={40}
                      width={40}
                    />
                    <ImageText
                      uri={require('../../../../res/images/spills.png')}
                      text={'Liquid spills & stains '}
                      height={40}
                      width={40}
                    />
                    <ImageText
                      uri={require('../../../../res/images/chair.png')}
                      text={'Broken furniture '}
                      height={40}
                      width={40}
                    />
                    <ImageText
                      uri={require('../../../../res/images/almirah.png')}
                      text={'Cracks, tears & more'}
                      height={40}
                      width={40}
                    />
                  </View>
                  <Text
                    style={{
                      textAlign: 'center',
                      marginBottom: 10,
                      color: 'grey',
                      fontWeight: 'bold',
                      fontSize: 18,
                    }}>
                    Get a damage waiver up to ₹70,000 with City Shield
                  </Text>

                  {/* Line */}
                  <View
                    style={[
                      styles.lineStyle,
                      {
                        width: '100%',
                        borderColor: 'grey',
                        borderWidth: 0.5,
                        marginVertical: 10,
                      },
                    ]}
                  />
                  <View
                    style={{
                      padding: 10,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: '#444444',
                        width: '60%',
                        alignSelf: 'center',
                        padding: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 5,
                        flexDirection: 'row',
                      }}
                      activeOpacity={1}
                      onPress={() => {
                        this.setState({
                          alertModal: !this.state.alertModal,
                        });
                      }}>
                      <Text
                        style={{
                          color: 'white',
                          textAlign: 'center',
                          flex: 1,
                          flexWrap: 'wrap',
                        }}>
                        Continue with City Shield
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        marginTop: 3,
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row',
                      }}
                      activeOpacity={1}
                      onPress={() => {
                        this.toggleCityShield(!this.state.toggleCheckBox);
                        this.setState({
                          toggleCheckBox: !this.state.toggleCheckBox,
                          alertModal: !this.state.alertModal,
                        });
                      }}>
                      <Text
                        style={{
                          textDecorationLine: 'underline',
                          color: '#527799',
                          flex: 1,
                          textAlign: 'center',
                          flexWrap: 'wrap',
                        }}>
                        No, I wanna risk damaging the furniture & Appliances
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            {/* Learn more modal */}
            <Modal visible={this.state.learnMore} animationType="slide">
              <View style={{flex: 1, padding: 10}}>
                {/* First line of Modal */}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 6,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Image
                      source={require('../../../../res/images/cityshield.png')}
                      height={45}
                      width={45}
                      style={{marginRight: 5}}
                    />
                    <Text style={{fontWeight: 'bold', fontSize: 21}}>
                      City Shield
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        learnMore: false,
                      });
                    }}>
                    <Icon name="close" size={20} color={'black'} />
                  </TouchableOpacity>
                </View>
                <View
                  style={[
                    styles.lineStyle,
                    {width: '100%', borderColor: 'grey', borderWidth: 0.5},
                  ]}
                />

                <Text style={{color: 'grey'}}>
                  Peace of mind is just a click away - opt for City Shield today
                  and get covered for accidental damages at ONLY ₹
                  {Object.keys(this.state.fetchedData).length === 0
                    ? this.checkoutOrderDetails.city_shield
                        .total_monthly_care_amount
                    : this.state.fetchedData.total_monthly_care_amount}
                  / month!
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 10,
                    overflow: 'hidden',
                    marginVertical: 20,
                  }}>
                  <ImageText
                    uri={require('../../../../res/images/sofa.png')}
                    text={'Scratches & Dents'}
                    height={50}
                    width={50}
                  />
                  <ImageText
                    uri={require('../../../../res/images/spills.png')}
                    text={'Liquid spills & stains '}
                    height={50}
                    width={50}
                  />
                  <ImageText
                    uri={require('../../../../res/images/chair.png')}
                    text={'Broken furniture '}
                    height={50}
                    width={50}
                  />
                  <ImageText
                    uri={require('../../../../res/images/almirah.png')}
                    text={'Cracks, tears & more'}
                    height={50}
                    width={50}
                  />
                </View>
                <Text
                  style={{
                    textAlign: 'center',
                    marginBottom: 10,
                    color: 'grey',
                    fontWeight: 'bold',
                    fontSize: 18,
                  }}>
                  Get a damage waiver up to ₹70,000 with City Shield
                </Text>

                <TouchableOpacity
                  style={{
                    backgroundColor: '#444444',
                    width: '50%',
                    alignSelf: 'center',
                    marginVertical: 10,
                    padding: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 5,
                  }}
                  activeOpacity={1}
                  onPress={() => {
                    this.toggleCityShield(!this.state.toggleCheckBox);
                    this.setState({
                      toggleCheckBox: !this.state.toggleCheckBox,
                      learnMore: !this.state.learnMore,
                    });
                  }}>
                  <Text style={{color: 'white'}}>
                    {this.state.toggleCheckBox
                      ? 'Remove City Shield'
                      : 'Continue with City Shield'}
                  </Text>
                </TouchableOpacity>

                {/* Line */}
                <View
                  style={[
                    styles.lineStyle,
                    {
                      width: '100%',
                      borderColor: 'grey',
                      borderWidth: 0.5,
                      marginVertical: 10,
                    },
                  ]}
                />

                <LittleSection
                  heading="What is covered?"
                  contents={[
                    'Damages due to normal wear and tear',
                    'Scratches and dents on the product(s)',
                    'Liquid spills and food stains on the upholstery or product surfaces',
                    'Cracks and tears to the product(s)',
                    'Bugs and fungus damaging the product(s)',
                    'And more',
                  ]}
                />
                <LittleSection
                  heading="What is covered?"
                  contents={[
                    'Damages voluntarily caused or worsened, with sharp objects, hand or power tools, cigarette butts, or other such abuse',
                    'Burglary or theft of the product(s)',
                  ]}
                />
              </View>
            </Modal>

            {this.renderOrderDetail()}
            {is_cfcoins_frp && this.renderCfCoinBalanceView()}
            {this.renderGstView()}
            {/* {this.renderPaymentMethods()} */}
            {/* {this.state.paymentFlag == 'Razorpay' ? this.renderRecurringPaymentMethods() : this.renderPaymentMethods()} */}

            {/* <Button
                            touchOpacityStyle={{ marginVertical: 10 }}
                            rounded
                            btnText={resources.strings.MAKE_PAYMENT}
                            onPress={this.onPaymentFlow}
                        /> */}
          </View>
        </KeyboardAwareScrollView>
        <View style={styles.addressButtonContainer}>
          <View style={styles.addressFooterStyle}>
            {/* {<View style={styles.footerStyle}>
                            <Text style={styles.totalStyle}> ₹{this.state.isCoinRedeemed ? this.state.dataAfterCoinsApplied.total_after_wallet_discount : grand_total ? grand_total : "0"} /-</Text>
                            <Text style={styles.descStyle} 
                                    onPress={() => {
                                        console.log("Order Summary Screen")
                                    }} > {"View Details"} </Text>
                        </View>} */}

            <View style={{marginRight: 0}}>
              <Button
                btnStyle={[styles.proceedSection]}
                touchOpacityStyle={{}}
                rounded
                btnText={resources.strings.MAKE_PAYMENT}
                onPress={
                  this.checkoutOrderDetails.city_shield.total_monthly_rent <
                  this.checkoutOrderDetails.order_min_amt
                    ? this.showToast
                    : this.onPaymentFlow
                }
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
  isValid = () => {
    const {
      selectedPaymentModeKey,
      isGstSelected,
      gstNumber,
      companyName,
    } = this.state;
    if (selectedPaymentModeKey == '') {
      AppToast('Please select one payment mode');
      return false;
    }
    if (isGstSelected) {
      if (gstNumber == '') {
        AppToast('Please enter GST number');
        return false;
      }
      if (companyName == '') {
        AppToast('Please enter Company name');
        return false;
      }
      return true;
    }
    return true;
  };
  onPaymentFlow = () => {
    if (this.state.paymentFlag == 'Razorpay') {
      this.onPressProceedRazorpay();
    } else {
      this.onPressProceed();
    }
  };

  showToast = () => {
    AppToast(
      `Your minimum Monthly Rental amount should be Rs. ${
        this.checkoutOrderDetails.order_min_amt
      } Please add more products to proceed with the order.`,
    );
  };

  onPressProceed = () => {
    if (this.selectedAddress && this.selectedAddress.id) {
      if (!this.isValid()) {
        return;
      }
      const {
        whatappToggle,
        standingInstructionToggle,
        selectedPaymentModeKey,
        gstNumber,
        companyName,
        redeemedCoins,
        toggleCheckBox,
      } = this.state;
      let appUser = AppUser.getInstance();
      let fullname = appUser.userDetails.full_name;
      let email = appUser.userDetails.email;
      let isWhatsappOPT = whatappToggle ? '1' : '0';
      let isSI_OPT =
        selectedPaymentModeKey == IS_NATCH_KEY
          ? standingInstructionToggle
            ? '1'
            : '0'
          : '0';

      this.props
        .hitCartCheckout(
          selectedPaymentModeKey,
          isWhatsappOPT,
          isSI_OPT,
          this.selectedAddress.id,
          gstNumber,
          companyName,
          email,
          redeemedCoins,
          toggleCheckBox,
          this.checkoutOrderDetails.city_shield.total_final_care_amount,
        )
        .then(resp => {
          // console.log("response checkout => ", resp)
          this.getHashesFromServerAndConnectPayu(
            this.selectedAddress,
            resp.data,
            email,
            fullname,
            isSI_OPT,
          );
        })
        .catch(err => {
          console.log('error while cart checkout', err);
          AppToast(err);
        });
    } else {
      console.log('Unable to fetch Address id');
    }
  };

  onPressProceedRazorpay = () => {
    // const { grand_total } = this.checkoutOrderDetails;
    console.log('this one runs');
    const {upfront_item_included} = this.checkoutOrderDetails;
    let grand_total = 0;
    if (this.isComingFromBuyNow) {
      grand_total = this.grandTotal;
    } else {
      grand_total = this.checkoutOrderDetails.grand_total;
    }
    let amountToBePaid = this.state.isCoinRedeemed
      ? this.state.dataAfterCoinsApplied.total_after_wallet_discount
      : grand_total;
    let totalAmount = amountToBePaid.toString();
    totalAmount = totalAmount.split('.')[0];

    if (this.selectedAddress && this.selectedAddress.id) {
      if (!this.isValid()) {
        return;
      }
      const {
        whatappToggle,
        standingInstructionToggle,
        selectedPaymentModeKey,
        gstNumber,
        companyName,
        redeemedCoins,
        upfront_switch,
        toggleCheckBox,
      } = this.state;
      let appUser = AppUser.getInstance();
      let fullname = appUser.userDetails.full_name;
      let email = appUser.userDetails.email;
      let mobileNumber = appUser.userDetails.mobile_number;
      let isWhatsappOPT = whatappToggle ? '1' : '0';
      // let isSI_OPT = selectedPaymentModeKey == IS_NATCH_KEY ? standingInstructionToggle ? '1' : '0' : '0'
      let isSI_OPT = standingInstructionToggle ? '1' : '0'; // ie 1 == recurring and 0 == normal Payment

      let paymentType = selectedPaymentModeKey;
      let normalOrRecurring = standingInstructionToggle
        ? 'recurring_payment'
        : 'normal_payment';

      this.props
        .hitCartCheckout(
          selectedPaymentModeKey,
          isWhatsappOPT,
          isSI_OPT,
          this.selectedAddress.id,
          gstNumber,
          companyName,
          email,
          redeemedCoins,
          toggleCheckBox,
          this.checkoutOrderDetails.city_shield.total_final_care_amount,
        )
        .then(resp => {
          let cartResp = resp.data;
          let dealCodeNumber = cartResp.order_id
            ? cartResp.order_id
            : 1671974194;
          let upfrontEnabled =
            upfront_switch && upfront_item_included == 1 ? 1 : 0;
          this.props
            .hitCartCheckoutRazorpay(
              dealCodeNumber,
              upfrontEnabled,
              normalOrRecurring,
              paymentType,
            )
            .then(async response => {
              this.getHashesFromServerAndConnectRazorpay(
                this.selectedAddress,
                cartResp,
                email,
                fullname,
                mobileNumber,
                isSI_OPT,
                totalAmount,
                response.raz_order_id,
                response.customer_id,
                dealCodeNumber,
                paymentType,
                normalOrRecurring,
              );
            })
            .catch(err => {
              this.onFailurePayment();
              console.log('Error while Order Payment', err);
            });
        })
        .catch(err => {
          console.log('error while cart checkout', err);
          AppToast(err);
          // AppToast("Something went wrong. Please try again later!")
        });
    } else {
      console.log('Unable to fetch Address id');
    }
  };
  convertIntegerWithINR = fee => {
    return fee * 100;
  };
  getHashesFromServerAndConnectRazorpay = (
    address,
    checkoutResp,
    email,
    fullname,
    mobileNumber,
    isSI_OPT,
    amount,
    authRazorpayOrderID,
    customerId,
    dealCodeNumber,
    paymentType,
    normalOrRecurring,
  ) => {
    let couponCodeToBeApplied = '';
    console.log(fullname, 'fullname', email);
    if (!fullname || !email) {
      AppToast('Something went wrong!!');
      return;
    }
    try {
      var options = {
        description: resources.strings.razorpayOrderDescription,
        image: resources.strings.razorpayImageUrl,
        currency: resources.strings.razorpayCurrency,
        key: razorpayKeyId,
        amount: this.convertIntegerWithINR(parseInt(amount)),
        name: resources.strings.razorpayTitle,
        order_id: authRazorpayOrderID, //Replace this with an order_id created using Orders API. Learn more at https://razorpay.com/docs/api/orders.
        prefill: {
          email: email,
          contact: mobileNumber,
          name: fullname,
        },
        readonly: {
          email: false,
          contact: false,
          name: false,
        },
        theme: {color: resources.colors.razorpayColor},
      };
      console.log(options, 'opt');
      if (normalOrRecurring == 'recurring_payment') {
        options.customer_id = customerId;
        options.recurring = 1;
      }
      RazorpayCheckout.open(options)
        .then(async data => {
          const {products} = this.checkoutOrderDetails;

          await analytics().logEvent(
            Platform.OS == 'android' ? 'purchase_android' : 'purchase_ios',
            {
              id: data.razorpay_order_id,
              value: this.state.fetchedData.total_grand_final_rent,
              currency: 'INR',
              tax:
                Object.keys(this.state.fetchedData).length === 0
                  ? this.checkoutOrderDetails.city_shield.total_gst
                  : this.state.fetchedData.total_gst,
              shipping: 0.0,
              items: products,
            },
          );

          if (normalOrRecurring == 'normal_payment') {
            this.props
              .hitCartCheckoutRazorpaySuccess(
                data.razorpay_payment_id,
                dealCodeNumber,
                customerId,
                data.razorpay_order_id,
                data.razorpay_signature,
                authRazorpayOrderID,
              )
              .then(resp => {
                console.log(resp, 'another payments response');
                this.onRazorpayPayemntResponse(
                  data,
                  data.razorpay_payment_id,
                  checkoutResp,
                );
              })
              .catch(err => {
                this.onFailurePayment();
                console.log('Error while Order Payment', err);
              });
          } else {
            this.props
              .hitCartCheckoutRazorpaySuccessRecurring(
                data.razorpay_payment_id,
                dealCodeNumber,
                customerId,
                data.razorpay_signature,
                authRazorpayOrderID,
                paymentType,
              )
              .then(resp => {
                console.log(resp, 'recurr resp');
                this.onRazorpayPayemntResponse(
                  data,
                  data.razorpay_payment_id,
                  checkoutResp,
                );
              })
              .catch(err => {
                this.onFailurePayment();
                console.log('Error while Order Payment', err);
              });
          }
        })
        .catch(error => {
          // handle failure
          this.onFailurePayment();
          console.log('Json Error:', JSON.stringify(error));
        });
    } catch (err) {
      this.onFailurePayment();
      console.log('error while fetching hash from server', err);
    }
  };

  onRazorpayPayemntResponse = (data, razorpay_payment_id, checkoutResp) => {
    console.log(data, 'from payment raz response');
    if (razorpay_payment_id == null || razorpay_payment_id == '') {
      this.onFailurePayment();
    } else {
      // payment success

      this.storeCartCountData('0');
      this.checkCredit(checkoutResp);
    }
  };
  getHashesFromServerAndConnectPayu = (
    address,
    checkoutResp,
    email,
    fullname,
    isSI_OPT,
  ) => {
    // const { grand_total } = this.checkoutOrderDetails;
    let grand_total = 0;
    if (this.isComingFromBuyNow) {
      grand_total = this.grandTotal;
    } else {
      grand_total = this.checkoutOrderDetails.grand_total;
    }
    let amountToBePaid = this.state.isCoinRedeemed
      ? this.state.dataAfterCoinsApplied.total_after_wallet_discount
      : grand_total;

    let finalAmount = amountToBePaid.toString();
    finalAmount = finalAmount.split('.')[0];
    let couponCodeToBeApplied = '';
    if (!fullname || !email) {
      AppToast('Something went wrong!!');
      return;
    }
    this.props
      .getHashForPayment(
        finalAmount,
        fullname,
        email,
        checkoutResp.txnid,
        couponCodeToBeApplied,
        isSI_OPT,
      )
      .then(resp => {
        console.log('env', resp.data);
        let data = {
          env: resp.data.env,
          amount: finalAmount,
          txnId: resp.data.txnid,
          hashKey: resp.data.payment_source,
          merchantKey: resp.data.MERCHANT_KEY,
          address1: address.address1,
          address2: address.address2,
          city: address.city,
          offerKey: couponCodeToBeApplied,
          surl: checkoutResp.surl,
          furl: checkoutResp.furl,
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
            this.onPayemntResponse(JSON.parse(map.payu_response), checkoutResp);
          })
          .catch(error => {
            console.log('error while payment', JSON.stringify(error));
            this.onFailurePayment();
          });
      })
      .catch(err => {
        console.log('error while fetching hash from server', err);
      });
  };

  storeCartCountData = async data => {
    let obj = AppUser.getInstance();
    obj.itemsIncartCount = parseInt(data);
    this.props.onUpdateCartBadgeCount(parseInt(data));
    try {
      await AsyncStorage.setItem(AsyncStorageConstants.cartBadgeCount, data);
    } catch (e) {
      // saving error
      console.log('error', e);
    }
  };

  onPayemntResponse = (payu_response, checkoutResp) => {
    if (payu_response.unmappedstatus == FAILURE) {
      this.onFailurePayment();
    } else {
      // payment success
      this.storeCartCountData('0');
      this.checkCredit(checkoutResp);
    }
  };
  onFailurePayment = () => {
    AppToast('Error while payment');
    // go to cart screen if failure
    this.props.navigation.navigate('DashboardScreen');
  };
  checkCredit = item => {
    const {upfront_switch} = this.state;
    const {upfront_item_included, duration} = this.checkoutOrderDetails;
    let tenure_duration = parseInt(duration.replace(' Months', ''));
    let isUpfrontPayment =
      upfront_switch && upfront_item_included == 1 ? true : false;

    // make changes here
    if (item.state == CREDIT_SCORE_REQUIRE) {
      if (tenure_duration == 3 || tenure_duration == 6) {
        this.props.navigation.navigate('CreditScore', {
          orderId: item.order_id,
          isComingFromPaymentSucess: true,
          isUpfrontPayment: isUpfrontPayment,
        });
      } else {
        this.props.navigation.navigate('KycScreen', {
          orderId: item.order_id,
          creditScore: item.credit_card_score,
          isComingFromPaymentSucess: true,
          isUpfrontPayment: isUpfrontPayment,
        });
      }
    } else if (item.state == KYC_REQUIRE) {
      this.props.navigation.navigate('KycScreen', {
        orderId: item.order_id,
        creditScore: item.credit_card_score,
        isComingFromPaymentSucess: true,
        isUpfrontPayment: isUpfrontPayment,
      });
    } else if (item.state == AUTO_PAYMENT_REQUIRE) {
      if (isUpfrontPayment) {
        this.props.navigation.navigate('MyOrder');
      } else {
        this.props.navigation.navigate('AutoPaymentScreen', {
          orderId: item.dealCodeNumber,
          isComingFromPaymentSucess: true,
        });
      }
    } else {
      if (tenure_duration == 3 || tenure_duration == 6) {
        this.props.navigation.navigate('CreditScore', {
          orderId: item.order_id,
          isComingFromPaymentSucess: true,
          isUpfrontPayment: isUpfrontPayment,
        });
      } else {
        this.props.navigation.navigate('KycScreen', {
          orderId: item.order_id,
          creditScore: item.credit_card_score,
          isComingFromPaymentSucess: true,
          isUpfrontPayment: isUpfrontPayment,
        });
      }
    }
  };
  renderPaymentMethods = () => {
    const {
      creditDebitMode,
      standingInstructionToggle,
      paymentOtherModes,
    } = this.state;

    return (
      <View style={[styles.viewPaymentMethods]}>
        <Text style={styles.textGstDetails}>
          {resources.strings.PAYMENT_METHOD}
        </Text>
        <Text style={styles.textChoosePaymentMethod}>
          {resources.strings.ChoosePaymentMethod}
        </Text>
        {this.renderCardOption(creditDebitMode)}

        {creditDebitMode[0].isSelected && !this.state.hideSItoggle ? (
          <View>
            <View
              style={[
                styles.rowDirection,
                styles.whatappToggleStyle,
                {marginTop: 15},
              ]}>
              <Text style={styles.whatappToggleText}>
                {resources.strings.OPT_FOR_STANDING_INSTRUCTION}
              </Text>
              <Switch
                onValueChange={this.toggleSwitchForSI}
                value={standingInstructionToggle}
                trackColor={{
                  false: resources.colors.labelColor,
                  true: resources.colors.BLUE_LIGHT,
                }}
                thumbColor={resources.colors.BLUE}
              />
            </View>

            <View style={{marginVertical: 15}}>
              <Text style={styles.textInstruction}>
                {resources.strings.SI_Instruction1}
              </Text>
              <Text style={styles.textInstruction}>
                {resources.strings.SI_Instruction2}
              </Text>
              <Text style={styles.textInstruction}>
                {resources.strings.SI_Instruction3}
              </Text>
            </View>
          </View>
        ) : null}
        {this.renderCardOption(paymentOtherModes)}
      </View>
    );
  };

  renderCardOption = paymentModes => {
    let views = [];
    paymentModes.forEach(mode => {
      views.push(
        <View
          key={mode.cartTitle + '__' + mode.id}
          style={[styles.rowDirection, styles.containerHeight]}>
          <TouchableOpacity
            // style={{ backgroundColor: 'pink' }}
            onPress={() => this.onSelectedPaymentMode(mode.cartTitle, mode.id)}>
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

  renderRecurringPaymentMethods = () => {
    const {standingInstructionToggle, recurringPaymentModes} = this.state;
    return (
      <View style={[styles.viewPaymentMethods]}>
        <Text style={styles.textGstDetails}>
          {resources.strings.PAYMENT_METHOD}
        </Text>
        <Text style={styles.textChoosePaymentMethod}>
          {resources.strings.ChoosePaymentMethod}
        </Text>
        {this.renderRecurringCardOption(recurringPaymentModes)}

        {recurringPaymentModes[0].isSelected ||
        recurringPaymentModes[1].isSelected ||
        recurringPaymentModes[2].isSelected ? (
          <View>
            <View
              style={[
                styles.rowDirection,
                styles.whatappToggleStyle,
                {marginTop: 15},
              ]}>
              <Text style={styles.whatappToggleText}>
                {resources.strings.OPT_FOR_STANDING_INSTRUCTION}
              </Text>
              <Switch
                onValueChange={this.toggleSwitchForSI}
                value={standingInstructionToggle}
                trackColor={{
                  false: resources.colors.labelColor,
                  true: resources.colors.BLUE_LIGHT,
                }}
                thumbColor={resources.colors.BLUE}
              />
            </View>

            <View style={{marginVertical: 15}}>
              <Text style={styles.textInstruction}>
                {resources.strings.SI_Instruction1}
              </Text>
              <Text style={styles.textInstruction}>
                {resources.strings.SI_Instruction2}
              </Text>
              <Text style={styles.textInstruction}>
                {resources.strings.SI_Instruction3}
              </Text>
            </View>
          </View>
        ) : null}
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

  onSelectedPaymentMode = (cardTitle, cardId) => {
    const {creditDebitMode, paymentOtherModes} = this.state;
    if (creditDebitMode[0].id == cardId) {
      let arr = creditDebitMode.filter(item => {
        item.isSelected = !item.isSelected;
        return item;
      });
      let arr1 = paymentOtherModes.filter(item => {
        item.isSelected = false;
        return item;
      });
      this.setState({
        creditDebitMode: arr,
        paymentOtherModes: arr1,
        selectedPaymentModeKey: arr[0].isSelected ? IS_NATCH_KEY : '',
      });
    } else {
      let arr1 = paymentOtherModes.filter(item => {
        if (cardId == item.id) {
          item.isSelected = !item.isSelected;
        } else {
          item.isSelected = false;
        }
        return item;
      });
      let arr = creditDebitMode.filter(item => {
        item.isSelected = false;
        return item;
      });
      this.setState({
        creditDebitMode: arr,
        paymentOtherModes: arr1,
        selectedPaymentModeKey:
          arr1[0].isSelected || arr1[1].isSelected ? NORMAL_PAYMENT_KEY : '',
      });
    }
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
        : 'other',
    });
  };

  renderGstView = () => {
    return (
      <View style={[styles.viewGST]}>
        <View style={[styles.rowDirection, styles.whatappToggleStyle]}>
          <Text style={styles.whatappToggleText}>
            {resources.strings.OPT_FOR_WHATSAPP}
          </Text>
          <Switch
            onValueChange={this.toggleSwitch}
            value={this.state.whatappToggle}
            trackColor={{
              false: resources.colors.labelColor,
              true: resources.colors.BLUE_LIGHT,
            }}
            thumbColor={resources.colors.BLUE}
          />
        </View>
        <Text style={styles.textGstDetails}>
          {resources.strings.GST_DETAILS}
        </Text>
        <TouchableOpacity
          style={{borderWidth: 0, flexDirection: 'row', width: myWidth / 2}}
          onPress={() =>
            this.setState({isGstSelected: !this.state.isGstSelected})
          }>
          {this.state.isGstSelected ? (
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
          <Text style={[styles.textIhaveGst]}>
            {resources.strings.I_HAVE_GST}
          </Text>
        </TouchableOpacity>
        {this.state.isGstSelected ? (
          <View style={{marginTop: 12}}>
            <MaterialInput
              label={resources.strings.GST_NUMBER}
              value={this.state.gstNumber}
              onChangeText={this.onChangeGstNumber}
              inputProps={{
                returnKeyType: 'next',
              }}
            />
            <MaterialInput
              label={resources.strings.COMPANY_NAME}
              value={this.state.companyName}
              onChangeText={this.onChangeCompanyName}
              inputProps={{
                returnKeyType: 'done',
              }}
            />
          </View>
        ) : null}
      </View>
    );
  };

  onChangeCompanyName = value => {
    this.setState({
      companyName: value,
    });
  };
  onChangeGstNumber = value => {
    this.setState({
      gstNumber: value,
    });
  };
  GSTsetSelection = () => {
    this.setState({
      isGstSelected: !this.state.isGstSelected,
    });
  };
  renderCfCoinBalanceView = () => {
    const {available_cf_coins} = this.checkoutOrderDetails;
    return (
      <View style={styles.cfBalanceView}>
        <View style={styles.coinsView}>
          <Image source={resources.images.coins_icn} />
          <View style={styles.rowDirection}>
            <Text style={styles.textCFBalance}>Your CF Coins Balance </Text>
            <Text style={styles.textTotalCoins}>
              {this.state.isCoinRedeemed
                ? this.state.dataAfterCoinsApplied.remain_wallet_amount
                : available_cf_coins
                ? available_cf_coins
                : '0'}
            </Text>
          </View>
        </View>
        <Text style={styles.textcfCoinLabel}>
          {resources.strings.CF_COIN_REDEEMED}
        </Text>
        <TextInput
          onChangeText={this.onCfCoinRedeemedChange}
          value={this.state.redeemedCoins}
          autoCaptialize="none"
          keyboardType={'number-pad'}
          returnKeyType="done"
          style={styles.coinsInput}
          editable={!this.state.isCoinRedeemed}
        />
        <Button
          btnStyle={styles.btnStyle}
          touchOpacityStyle={styles.btnTouchStyle}
          onPress={
            !this.state.isCoinRedeemed
              ? this.onPressRedeemCFcoins
              : this.onPressRemoveCFcoins
          }
          outlined
          textStyleOver={{color: resources.colors.appColor}}
          btnText={
            !this.state.isCoinRedeemed
              ? resources.strings.REDEEM
              : resources.strings.REMOVE
          }
        />
        <View style={{marginTop: 20, marginBottom: 12}}>
          <Text style={styles.textInstruction}>
            {resources.strings.paymentInstruction1}
          </Text>
          {/* <Text style={[styles.textInstruction, { marginBottom: 0 }]}>
                        {resources.strings.paymentInstruction2}
                    </Text> */}
          <View style={styles.rowDirection}>
            <Text style={styles.textInstruction}>
              {resources.strings.paymentInstruction2}
            </Text>
          </View>
        </View>
      </View>
    );
  };
  toggleSwitch = value => {
    this.setState({
      whatappToggle: value,
    });
  };
  toggleSwitchForSI = value => {
    this.setState({
      standingInstructionToggle: value,
    });
  };
  onPressRemoveCFcoins = () => {
    this.hitRedeemCoins(0, false);
  };
  onPressRedeemCFcoins = () => {
    const {redeemedCoins} = this.state;
    if (redeemedCoins != '') {
      this.hitRedeemCoins(redeemedCoins, true);
    } else {
      AppToast('Please enter some coins');
    }
  };

  hitRedeemCoins = (coins, isRedeeming) => {
    const {upfront_switch} = this.state;
    const {upfront_item_included} = this.checkoutOrderDetails;
    let upfrontEnabled = upfront_switch && upfront_item_included == 1 ? 1 : 0;

    this.props
      .hitRedeemCoinsApi(coins, upfrontEnabled)
      .then(resp => {
        console.log(JSON.stringify(resp));
        if (isRedeeming) {
          this.setState({
            isCoinRedeemed: true,
            dataAfterCoinsApplied: resp.data,
          });
        } else {
          this.setState({
            redeemedCoins: '',
            isCoinRedeemed: false,
            dataAfterCoinsApplied: resp.data,
          });
        }
      })
      .catch(err => {
        AppToast(err);
        this.setState({
          redeemedCoins: '',
          isCoinRedeemed: false,
        });
        console.log('Error while coins redeemption');
      });
  };
  onCfCoinRedeemedChange = text => {
    this.setState({
      redeemedCoins: text,
    });
  };
  applyUpfrontPayment = async () => {
    await this.getOrderInfo(!this.state.upfront_switch);
    this.setState({
      upfront_switch: !this.state.upfront_switch,
    });
  };

  calculateGst = value => {
    return value * 0.18;
  };

  calculateDiscount = (finalvalue, maxValue) => {
    if (finalvalue == 0 && maxValue == 0) return 0;
    if (finalvalue > maxValue) return maxValue;
    else return finalvalue.toFixed(2);
  };

  calculateGrandTotal = (totalRental, refundable, gst) => {
    return Math.round(
      parseFloat(totalRental) + parseFloat(gst) + parseFloat(refundable),
    );
  };

  renderOrderDetail = () => {
    if (!this.checkoutOrderDetails) {
      return null;
    }
    const {
      upfront_item_included,
      total_renntal,
      saving_amount,
      saving_percentage,
      total_deposite,
      monthly_renntal,
      maxDiscount,
      advance_renntal,
      total_gst,
      discount_amount,
      duration,
      delivery,
      products,
    } = this.checkoutOrderDetails;

    let grand_total = 0;
    if (this.isComingFromBuyNow) {
      grand_total = this.grandTotal;
    } else {
      grand_total = this.checkoutOrderDetails.grand_total;
    }

    const {
      emi_message,
      emi_response_flag,
      upfornt_emi_message,
    } = this.checkoutOrderDetails;
    let is_no_cost_emi = false;
    products.map(item => {
      if (item.is_frp) {
        is_no_cost_emi = true;
        return false;
      } else {
        return false;
      }
    });
    let tenure_duration = parseInt(duration.replace(' Months', ''));
    let final_discount_amount = discount_amount * tenure_duration;
    return (
      <React.Fragment>
        {upfront_item_included == 1 ? (
          <React.Fragment>{null}</React.Fragment>
        ) : upfront_item_included == 2 ? (
          <View style={styles.upfrontBox}>
            <View style={[styles.orderRowContainer, {flex: 1, borderWidth: 0}]}>
              <View style={styles.cellStyle}>
                <Text
                  style={styles.fontStyle}
                  ellipsizeMode={'tail'}
                  numberOfLines={
                    3
                  }>{`- Offer applicable on Combos, Home furniture and Appliances only except AC`}</Text>
              </View>
            </View>
          </View>
        ) : null}
        {this.state.upfront_switch && upfront_item_included == 1 ? (
          <React.Fragment>
            <View style={styles.detailCard}>
              <View style={styles.orderCardContainer}>
                <View
                  style={[styles.orderContainer, {flex: 1, borderWidth: 0}]}>
                  <View>
                    <Text style={styles.orderPropText}>{'Duration'}</Text>
                    <Text style={styles.orderPropText}>
                      {/* {console.log(price)} */}
                      {`Rental`} ( ₹{' '}
                      {Object.keys(this.state.fetchedData).length === 0
                        ? this.checkoutOrderDetails.city_shield
                            .total_monthly_rent
                        : this.state.fetchedData.total_monthly_rent}{' '}
                      * {this.checkoutOrderDetails.city_shield.tenure})
                    </Text>
                    {this.state.toggleCheckBox && (
                      <Text style={styles.orderPropText}>
                        {`City Shield`} (₹{' '}
                        {Object.keys(this.state.fetchedData).length === 0
                          ? this.checkoutOrderDetails.city_shield
                              .total_monthly_care_amount
                          : this.state.fetchedData
                              .total_monthly_care_amount}{' '}
                        * {this.checkoutOrderDetails.city_shield.tenure})
                      </Text>
                    )}
                    <Text
                      style={[
                        styles.orderPropText,
                        {color: resources.colors.green},
                      ]}>{`Discount`}</Text>
                    <Text style={styles.orderPropText}>{'Total Rental'}</Text>
                    <Text style={styles.orderPropText}>
                      {'Refundable Deposit'}
                    </Text>
                    <Text style={styles.orderPropText}>{'Taxes'}</Text>

                    <Text
                      style={[
                        styles.orderPropText,
                        {color: resources.colors.green},
                      ]}>
                      {'Coin Redeemed'}
                    </Text>
                    <Text style={styles.orderPropText}>
                      {'Delivery & Installation'}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.orderValuesText}>{':'}</Text>
                    <Text style={styles.orderValuesText}>{':'}</Text>
                    {this.state.toggleCheckBox && (
                      <Text style={styles.orderValuesText}>{':'}</Text>
                    )}
                    <Text style={styles.orderValuesText}>{':'}</Text>
                    <Text style={styles.orderValuesText}>{':'}</Text>
                    <Text style={styles.orderValuesText}>{':'}</Text>
                    <Text style={styles.orderValuesText}>{':'}</Text>
                    <Text style={styles.orderValuesText}>{':'}</Text>
                    <Text style={styles.orderValuesText}>{':'}</Text>
                  </View>
                  <View>
                    <Text style={styles.orderValuesText}>
                      {duration ? duration : 'NA'}
                    </Text>
                    <Text style={styles.orderValuesText}>
                      ₹{' '}
                      {Object.keys(this.state.fetchedData).length === 0
                        ? this.checkoutOrderDetails.city_shield.total_final_rent
                        : this.state.fetchedData.total_final_rent}
                      /-
                    </Text>
                    {this.state.toggleCheckBox && (
                      <Text
                        style={[
                          styles.orderValuesText,
                          {
                            fontFamily: resources.fonts.bold,
                          },
                        ]}>
                        ₹{' '}
                        {Object.keys(this.state.fetchedData).length === 0
                          ? this.checkoutOrderDetails.city_shield
                              .total_final_care_amount
                          : this.state.fetchedData.total_final_care_amount}
                        /-
                      </Text>
                    )}
                    <Text
                      style={[
                        styles.orderValuesText,
                        {
                          color: resources.colors.green,
                          fontFamily: resources.fonts.bold,
                        },
                      ]}>
                      - ₹{' '}
                      {Object.keys(this.state.fetchedData).length === 0
                        ? this.checkoutOrderDetails.city_shield.discount_amount
                        : this.state.fetchedData.discount_amount}
                      /-
                    </Text>
                    {/*  */}
                    <Text style={styles.orderValuesText}>
                      ₹{' '}
                      {Object.keys(this.state.fetchedData).length === 0
                        ? this.checkoutOrderDetails.city_shield
                            .total_rent_after_discount
                        : this.state.fetchedData.total_rent_after_discount}
                      /-
                    </Text>
                    <Text style={[styles.orderValuesText]}>
                      ₹{' '}
                      {Object.keys(this.state.fetchedData).length === 0
                        ? this.checkoutOrderDetails.city_shield
                            .security_deposite
                        : this.state.fetchedData.security_deposite}{' '}
                      /-
                    </Text>
                    <Text style={styles.orderValuesText}>
                      ₹{' '}
                      {Object.keys(this.state.fetchedData).length === 0
                        ? this.checkoutOrderDetails.city_shield.total_gst
                        : this.state.fetchedData.total_gst}{' '}
                      /-
                    </Text>
                    <Text
                      style={[
                        styles.orderValuesText,
                        {color: resources.colors.green},
                      ]}>
                      - ₹{' '}
                      {this.state.isCoinRedeemed
                        ? this.state.dataAfterCoinsApplied.wallet_amount
                        : 0}{' '}
                      /-
                    </Text>
                    <Text style={styles.orderValuesText}>
                      {delivery ? delivery : 'NA'}
                    </Text>
                  </View>
                </View>
                <View>
                  {/* <View style={styles.seprator1} /> */}
                  <View style={styles.totalContainer}>
                    <Text
                      style={[
                        styles.totalTextStyle,
                        {width: '58%', borderWidth: 0},
                      ]}>
                      {'Total'}
                    </Text>
                    <Text style={[styles.totalTextStyle, {width: '2%'}]}>
                      {':'}
                    </Text>
                    <Text
                      style={[
                        styles.totalTextStyle,
                        {
                          fontSize: 14,
                          width: '40%',
                          borderWidth: 0,
                          textAlign: 'right',
                        },
                      ]}>
                      ₹
                      {this.state.isCoinRedeemed
                        ? //? this.state.dataAfterCoinsApplied
                          //        .total_after_wallet_discount
                          (Object.keys(this.state.fetchedData).length === 0
                            ? this.checkoutOrderDetails.city_shield
                                .total_grand_final_rent
                            : this.state.fetchedData.total_grand_final_rent) -
                          this.state.dataAfterCoinsApplied.wallet_amount
                        : Object.keys(this.state.fetchedData).length === 0
                        ? this.checkoutOrderDetails.city_shield
                            .total_grand_final_rent
                        : this.state.fetchedData.total_grand_final_rent}
                    </Text>
                  </View>
                </View>
                {/* {console.log(this.checkoutOrderDetails.total_gst, 'check out')} */}
                <View style={{marginBottom: 10}}>
                  <View style={{flexDirection: 'row', marginHorizontal: 50}}>
                    <View
                      style={{
                        backgroundColor: 'rgba(54,69,79,0.4)',
                        height: 1,
                        flex: 1,
                        alignSelf: 'center',
                      }}
                    />
                    <Text
                      style={{
                        alignSelf: 'center',
                        paddingHorizontal: 5,
                        fontSize: 12,
                        fontFamily: resources.fonts.bold,
                        color: resources.colors.appColor,
                      }}>
                      OR
                    </Text>
                    <View
                      style={{
                        backgroundColor: 'rgba(54,69,79,0.4)',
                        height: 1,
                        flex: 1,
                        alignSelf: 'center',
                      }}
                    />
                  </View>
                  {/* <Text style={[styles.emiTextStyle]}>Pay {emi_tenure ? emi_tenure : 'NA'} month's no cost EMI of Rs {emi_amount ? emi_amount : "NA"}/month</Text> */}
                  {/* <Text style={[styles.emiTextStyle]}>Pay no cost EMI of Rs {emi_amount ? emi_amount : "NA"} / month for {emi_tenure ? emi_tenure : 'NA'} Months</Text> */}
                  <Text
                    style={[styles.emiTextStyle, {backgroundColor: '#5f939a'}]}>
                    {upfornt_emi_message
                      ? upfornt_emi_message
                      : `Pay no cost EMI of Rs ${
                          this.state.isCoinRedeemed
                            ? (
                                this.state.dataAfterCoinsApplied
                                  .total_after_wallet_discount / tenure_duration
                              ).toFixed(2)
                            : grand_total
                            ? (grand_total / tenure_duration).toFixed(2)
                            : '0'
                        } / month for ${duration}`}
                  </Text>
                </View>

                {is_no_cost_emi && emi_response_flag && (
                  <View style={{marginBottom: 10}}>
                    <View style={{flexDirection: 'row', marginHorizontal: 50}}>
                      <View
                        style={{
                          backgroundColor: 'rgba(54,69,79,0.4)',
                          height: 1,
                          flex: 1,
                          alignSelf: 'center',
                        }}
                      />
                      <Text
                        style={{
                          alignSelf: 'center',
                          paddingHorizontal: 5,
                          fontSize: 12,
                          fontFamily: resources.fonts.bold,
                          color: resources.colors.appColor,
                        }}>
                        OR
                      </Text>
                      <View
                        style={{
                          backgroundColor: 'rgba(54,69,79,0.4)',
                          height: 1,
                          flex: 1,
                          alignSelf: 'center',
                        }}
                      />
                    </View>
                    {/* <Text style={[styles.emiTextStyle]}>Pay {emi_tenure ? emi_tenure : 'NA'} month's no cost EMI of Rs {emi_amount ? emi_amount : "NA"}/month</Text> */}
                    {/* <Text style={[styles.emiTextStyle]}>Pay no cost EMI of Rs {emi_amount ? emi_amount : "NA"} / month for {emi_tenure ? emi_tenure : 'NA'} Months</Text> */}
                    <Text style={[styles.emiTextStyle]}>
                      {emi_message ? emi_message : 'Pay no cost EMI'}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            {/* <View style={styles.detailSavingCard}>
                                <View style={[styles.saveRowContainer, { flex: 1, borderWidth: 0 }]}>
                                    <View style={[{ flex : 1}]}>
                                        <Text style={styles.userNameText} ellipsizeMode={'tail'} numberOfLines={3}>
                                            {'Your total savings'}
                                        </Text>
                                    </View>
                                    <View style={{}}>
                                        <Text style={[styles.userNameText, {color: 'green'}]} ellipsizeMode={'tail'} numberOfLines={3}>
                                            ₹ {saving_amount ? saving_amount :'0'}
                                        </Text>
                                    </View>
                                </View>
                            </View> */}
          </React.Fragment>
        ) : (
          <View style={styles.detailCard}>
            <View style={styles.orderCardContainer}>
              <View style={[styles.orderContainer, {flex: 1, borderWidth: 0}]}>
                <View>
                  <Text style={styles.orderPropText}>{'Duration'}</Text>
                  <Text style={styles.orderPropText}>
                    {products.length > 0
                      ? products[0].rental_freq + ' Rental'
                      : ''}
                  </Text>
                  <Text style={styles.orderPropText}>
                    {'Refundable Amount'}
                  </Text>
                  <Text style={styles.orderPropText}>{'Taxes'}</Text>
                  <Text style={styles.orderPropText}>{'Discount'}</Text>
                  <Text style={styles.orderPropText}>{'Coin Redeemed'}</Text>
                  <Text style={styles.orderPropText}>{'Delivery'}</Text>
                </View>
                <View>
                  <Text style={styles.orderValuesText}>{':'}</Text>
                  <Text style={styles.orderValuesText}>{':'}</Text>
                  <Text style={styles.orderValuesText}>{':'}</Text>
                  <Text style={styles.orderValuesText}>{':'}</Text>
                  <Text style={styles.orderValuesText}>{':'}</Text>
                  <Text style={styles.orderValuesText}>{':'}</Text>
                  <Text style={styles.orderValuesText}>{':'}</Text>
                </View>
                <View>
                  <Text style={styles.orderValuesText}>
                    {duration ? duration : 'NA'}
                  </Text>
                  <Text style={styles.orderValuesText}>
                    ₹ {total_renntal ? total_renntal : '0'} /-
                  </Text>
                  <Text style={styles.orderValuesText}>
                    ₹ {total_deposite ? total_deposite : '0'} /-
                  </Text>
                  <Text style={styles.orderValuesText}>
                    ₹{' '}
                    {this.state.isCoinRedeemed
                      ? this.state.dataAfterCoinsApplied.after_less_wallet_gst
                      : total_gst
                      ? total_gst
                      : '0'}{' '}
                    /-
                  </Text>
                  <Text style={styles.orderValuesText}>
                    ₹ {discount_amount ? discount_amount : '0'} /-
                  </Text>
                  <Text
                    style={[
                      styles.orderValuesText,
                      {color: resources.colors.appColor},
                    ]}>
                    - ₹{' '}
                    {this.state.isCoinRedeemed
                      ? this.state.dataAfterCoinsApplied.wallet_amount
                      : 0}{' '}
                    /-
                  </Text>
                  <Text style={styles.orderValuesText}>
                    {delivery ? delivery : 'NA'}
                  </Text>
                </View>
              </View>
              <View>
                {/* <View style={styles.seprator1} /> */}
                <View style={styles.totalContainer}>
                  <Text
                    style={[
                      styles.totalTextStyle,
                      {width: '58%', borderWidth: 0},
                    ]}>
                    {'Total'}
                  </Text>
                  <Text style={[styles.totalTextStyle, {width: '2%'}]}>
                    {':'}
                  </Text>
                  <Text
                    style={[
                      styles.totalTextStyle,
                      {
                        fontSize: 14,
                        width: '40%',
                        borderWidth: 0,
                        textAlign: 'right',
                      },
                    ]}>
                    ₹{' '}
                    {this.state.isCoinRedeemed
                      ? this.state.dataAfterCoinsApplied
                          .total_after_wallet_discount
                      : grand_total
                      ? grand_total
                      : '0'}
                  </Text>
                </View>
              </View>

              {is_no_cost_emi && emi_response_flag && (
                <View style={{marginBottom: 10}}>
                  <View style={{flexDirection: 'row', marginHorizontal: 50}}>
                    <View
                      style={{
                        backgroundColor: 'rgba(54,69,79,0.4)',
                        height: 1,
                        flex: 1,
                        alignSelf: 'center',
                      }}
                    />
                    <Text
                      style={{
                        alignSelf: 'center',
                        paddingHorizontal: 5,
                        fontSize: 12,
                        fontFamily: resources.fonts.bold,
                        color: resources.colors.appColor,
                      }}>
                      OR
                    </Text>
                    <View
                      style={{
                        backgroundColor: 'rgba(54,69,79,0.4)',
                        height: 1,
                        flex: 1,
                        alignSelf: 'center',
                      }}
                    />
                  </View>
                  {/* <Text style={[styles.emiTextStyle]}>Pay {emi_tenure ? emi_tenure : 'NA'} month's no cost EMI of Rs {emi_amount ? emi_amount : "NA"}/month</Text> */}
                  {/* <Text style={[styles.emiTextStyle]}>Pay no cost EMI of Rs {emi_amount ? emi_amount : "NA"} / month for {emi_tenure ? emi_tenure : 'NA'} Months</Text> */}
                  <Text style={[styles.emiTextStyle]}>
                    {emi_message ? emi_message : 'Pay no cost EMI'}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
      </React.Fragment>
    );
  };
}

const mapStateToProps = state => {
  return {};
};
let container = connect(
  mapStateToProps,
  {...actions, onUpdateCartBadgeCount, getCartDetailApi},
)(OrderSummaryScreen);
let loader = APILoadingHOC(container);
export default loader;
