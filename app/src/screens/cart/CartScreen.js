import React, {Component, version} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  BackHandler,
  Switch,
  ImageBackground,
} from 'react-native';
import HeaderWithProfile from '../../genriccomponents/header/HeaderWithProfilePic';
import IncludedProductComponent from '../../genriccomponents/productView/includedProduct/IncludedProduct';
import resources from '../../../res';
import * as actions from '../../redux/actions/CartAction';
import {connect} from 'react-redux';
import Button from '../../genriccomponents/button/Button';
import styles from './styles';
import ImageLoad from '../../genriccomponents/image/ImageLoad';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import NetInfo from '@react-native-community/netinfo';
import {onUpdateCartBadgeCount} from '../../redux/actions/CartAction';
import {
  getEnabledPaymentInfo,
  hitRedeemCoinsApi,
  hitCartCheckout,
  hitCartCheckoutRazorpay,
  hitCartCheckoutRazorpaySuccess
} from '../../redux/actions/PaymentAction';
import AppUser from '../../utility/AppUser';
import AsyncStorageConstants from '../../utility/AsyncStorageConstants';
import AsyncStorage from '@react-native-community/async-storage';
import AppToast from '../../genriccomponents/appToast/AppToast';
import SimpleToast from 'react-native-simple-toast';
import MaterialInput from '../../genriccomponents/input/MaterialInput';
import {
  enumCartActionType,
  enumOrderActionType,
  myWidth,
  razorpayKeyId,
  renderInputError,
  validateMobileNumber,
  wp,
} from '../../utility/Utils';
import {hitSendOtpApi} from '../../redux/actions/OtpAction';
import APILoadingHOC from '../../genriccomponents/HOCS/APILoadingHOC';
import {BASE_URL} from '../../apimanager/ApiEndpoint';
import AsyncStorageContaints from '../../utility/AsyncStorageConstants';
import {onUpdateWishlistBadgeCount} from '../../redux/actions/WishListAction';
import {updateFcmTokenToServer} from '../../redux/actions/LogoutAction';
import {CommonActions} from '@react-navigation/native';
import analytics from '@react-native-firebase/analytics';
import colors from '../../../res/colors';
import Cityfurnish from '../home/views/Cityfurnish';
import ThingsYouShouldComponents from './ThingsYouShouldComponents';
import PaymentDetails from '../paymentDetails/PaymentDetails';
import OrderSummaryScreen from '../cart/orderSummary/OrderSummaryScreen';
import CoinComponent from './components/coinComponent';
import CityShield from './components/cityShield';
import MyTextInput from '../../genriccomponents/input/MyTextInput';
import WhatsappNotificationComponent from './components/whatsappNotificationComponent';
import GSTComponent from './components/gstComponent';
import {ActivityIndicator} from 'react-native';
import {BottomUpModal} from '../order/components/BottomUpModal';
import RazorpayCheckout from 'react-native-razorpay';
import PaymentService from '../../utility/PaymentService';

const YES = 'Yes';
const NO = 'No';

const coupons = [
  {
    coupon_code: 'RENT20',
    h1_price: '20% Discount',
    h1_price_text: 'on your first order',
    description:
      'Flat 20% Off on Rent (up to Rs 3000), Applicable on furniture & appliances (except water purifiers)',
  },
  {
    coupon_code: 'RENT15',
    h1_price: '15% Discount',
    h1_price_text: 'on your first order',
    description:
      'Flat 15% Off on Rent (up to Rs 3000), Applicable on furniture & appliances (except water purifiers)',
  },
  {
    coupon_code: 'WELCOME10',
    h1_price: '10% Discount',
    h1_price_text: 'on your first order',
    description:
      'Flat 10% Off on Rent (up to Rs 3000), Applicable on furniture & appliances (except water purifiers)',
  },
  {
    coupon_code: '',
    h1_price: '10% Discount',
    h1_price_text: 'on your first order',
    description:
      'Flat 10% Off on Rent (up to Rs 3000), Applicable on furniture & appliances (except water purifiers)',
  },
];

class CartScreen extends Component {
  static ROUTE_NAME = 'CartScreen';
  constructor(props) {
    super(props);
    this.state = {
      productData: [],
      detailData: [],
      kycTextData: [],
      couponData: [],
      couponCode: '',
      remove: false,
      allProduct: false,
      allOffer: false,
      couponDescription: '',
      upfront_enabled: false,
      coupon_enabled: false,
      offersTexts: coupons,
      // for material input
      emailOrMobile: '',
      password: '',
      otp: '',
      isPassVisible: true,
      isMobileLogin: false,
      isLinkedinClicked: false,
      isOtpInputFIeldVisible: false,
      isGetOtpTextVisible: true,
      error: {},
      isPasswordFocused: false,
      isOtpSent: false,
      emailFieldVisible: false,
      updateEmail: '',
      saveEmailButton: false,
      newFullName: '',
      isTimeVisible: false,
      countDown: 30,
      coinEnabled: false,
      isLoading: false,
      isEnableWhatsappNotification: false,
      actionData: {
        show: false,
        selectedIndex: 0,
        modalType: enumOrderActionType,
        data: null,
        events: null,
      },
      addedCityshield: true,
      fetchedData: {},
      isCoinRedeemed: false,
      redeemedCoins: '',
      dataAfterCoinsApplied: {},
      whatappToggle: true,
      isGstSelected: false,
      gstNumber: '',
      companyName: '',
      paymentFlag: 'Payu',
      upfront_categories: [],
      upfront_enabled: true,
      standingInstructionToggle: false,
      selectedPaymentModeKey: 'other',
      upfront_switch: false,
    };
    this.includedProductRef = React.createRef();
    this.emailRef = React.createRef();
    this.saveEmailRef = React.createRef();
    this.fullNameRef = React.createRef();
    this.otpRef = React.createRef();
    this.passwordRef = React.createRef();
    this.linkedinRef = React.createRef();
    this.isComingFromBuyNow = false
  }
  async componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackClick);
    this.props.navigation.addListener('focus', () => this.componentDidFocus());
    this.getConfigrationInfo();
    this.getPaymentInfoData();
  }


  componentDidUpdate() {
    if (this.state.countDown === 1) {
      clearInterval(this.interval);
      this.setState({
        countDown: 30,
        isTimeVisible: false,
      });
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackClick);
    clearInterval(this.interval);
  }
  componentDidFocus = () => {
    // StatusBar.setBarStyle('dark-content');
    // StatusBar.setBackgroundColor(resources.colors.appColor);
    this.loadData();
    this.setState({allProduct: false, allOffer: false});
  };

  getConfigrationInfo = async () => {
    await this.props
      .getEnabledPaymentInfo()
      .then(data => {
        this.setState({
          upfront_enabled: data.upfront_enabled,
          coupon_enabled: data.coupon_enabled,
        });
      })
      .catch(error => {
      });
  };
  loadData = () => {
    this.setState({
      isLoading: true,
    });
    this.props
      .getCartDetailApi()
      .then(data => {
        const coupon = data?.data?.coupon_array?.filter(item => item.coupon_code === data.data.appliedCoupon)
        const {upfront_item_included} = data.data;
        this.setState({
          productData: data.data.products,
          detailData: data.data,
          couponData: data.data.coupon_array,
          couponCode: data.data.appliedCoupon,
          isLoading: false,
          couponDescription: coupon?.length > 0 ? coupon[0].description : '',
          upfront_switch : upfront_item_included === 0 ? false : upfront_item_included === 1 ? true : true,
          remove:
            data.data.appliedCoupon &&
            data.data.appliedCoupon != '' &&
            data.data.appliedCoupon != null
              ? true
              : false,
             
          // allProduct: false, allOffer: false
        });
      })
      .catch(error => {
        this.setState({
          isLoading: false,
        });
      });
  };
  onBackClick = () => {
    const {productData} = this.state;
    let is_navigate_frp = false;
    productData.map(item => {
      if (item.is_frp) {
        is_navigate_frp = true;
        return false;
      } else {
        return false;
      }
    });
    if (is_navigate_frp) {
      this.props.navigation.push('FixedRentalScreen', {
        routeTo: 'cart',
      });
    }
    if (this.props.navigation.canGoBack()) this.props.navigation.goBack();
    else this.props.navigation.navigate('Home');
  };

  renderHeader = () => {
    const {
      available_cf_coins,
      dataAfterCoinsApplied,
      isCoinRedeemed,
    } = this.state.detailData;
    return (
      <HeaderWithProfile
        headerTitle={resources.strings.CART}
        isBackIconVisible={true}
        navigateProps={this.props.navigation}
        onBackClick={this.onBackClick}
        toRoute={'MyAccountScreen'}
        // headerColor={{justifyContent: 'flex-start'}}
        renderRightView={() => {
          return (
            <CoinComponent
              coin={
                isCoinRedeemed
                  ? remain_wallet_amount
                  : available_cf_coins
                  ? available_cf_coins
                  : '0'
              }
            />
          );
        }}
      />
    );
  };
  deleteProduct = async cart_id => {
    const {productData} = this.state;
    this.props
      .deleteProductFromCartApi(cart_id)
      .then(data => {
        this.setState(
          {
            productData: productData.filter(item => item.cart_id != cart_id),
          },
          () => {
            let value = data.data.itemsIncartCount;
            this.storeCartCountData(value);

            // try {
            //     AsyncStorage.multiRemove([AsyncStorageConstants.citymaxProduct])
            // } catch (e) {
            // }

            this.props
              .getCartDetailApi()
              .then(data => {
                this.setState({
                  productData: data.data.products,
                  detailData: data.data,
                  couponData: data.data.coupon_array,
                });
              })
              .catch(error => {
              });
          },
        );
        AppToast(data.message);
      })
      .catch(error => {
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
    }
  };

  renderProductCell = ({item, index}) => {
    // const isTrue = true;
    return (
      <View style={styles.productContainer}>
        <View style={[, item.is_frp ? styles.frpViewCard : '']}>
          <View
            style={[item.is_frp ? styles.frpImageViewCard : styles.viewCard]}>
            <ImageLoad
              style={[item.is_frp ? styles.frpImageStyle : styles.imageStyle]}
              // topLeftBorderRadius={6}
              // borderBottomLeftRadius={6}
              // customImagePlaceholderDefaultStyle={{
              //   borderTopLeftRadius: 6,
              //   borderBottomLeftRadius: 6,
              // }}
              source={
                item.image
                  ? {uri: item.image}
                  : resources.images.img_placeholer_small
              }
              resizeMode={'stretch'}
            />
            <View style={styles.cardContainer}>
              <View style={styles.titleContainer}>
                <View style={{flex: 1}}>
                  <Text
                    style={styles.titleName}
                    ellipsizeMode={'tail'}
                    numberOfLines={2}>
                    {item.product_name}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => this.deleteProduct(item.cart_id)}
                  style={{height: 20, width: 20, alignItems: 'flex-end'}}>
                  <Image
                    source={resources.images.inc_small_delete}
                    style={styles.crossStyle}
                  />
                </TouchableOpacity>
              </View>
              <View style={[styles.valuesContainer, {borderWidth: 0}]}>
                <View>
                  <Text numberOfLines={1} style={styles.valueTitleText}>
                    {'Quantity'}
                  </Text>
                  <Text style={styles.valueText}>
                    {item?.quantity + 'item'}
                  </Text>
                </View>
                <View>
                  <Text numberOfLines={1} style={styles.valueTitleText}>
                    {item.rental_freq ? item.rental_freq + ' Rental' : ''}
                  </Text>
                  <Text style={styles.valueText}>
                    {'₹ ' + item?.price + '/month'}
                  </Text>
                </View>
              </View>
              <View style={[styles.valuesContainer, {borderWidth: 0}]}>
                <View>
                  <Text numberOfLines={1} style={styles.valueTitleText}>
                    {'Refundable Deposit'}
                  </Text>
                  <Text style={styles.valueText}>
                    {item.product_shipping_cost
                      ? '₹ ' + item.product_shipping_cost
                      : ''}
                  </Text>
                </View>
                {item.is_frp ? (
                  <View>
                    <Text numberOfLines={1} style={styles.valueTitleText}>
                      {item.rental_freq
                        ? 'Net ' + item.rental_freq + ' Rental'
                        : ''}
                    </Text>
                    <Text style={styles.valueText}>
                      ₹ {item.net_rent ? item.net_rent : ''}
                    </Text>
                  </View>
                ) : null}
              </View>
              {item.is_frp ? (
                <View style={[styles.valuesContainer, {borderWidth: 0}]}>
                  <View>
                    <Text numberOfLines={1} style={styles.valueTitleText}>
                      {'Upgrade Rent'}
                    </Text>
                    <Text style={styles.valueText}>
                      ₹ {item.upgrades_rent ? item.upgrades_rent : ''}
                    </Text>
                  </View>
                  <View>
                    <Text numberOfLines={1} style={styles.valueTitleText}>
                      {'Included Items'}
                    </Text>
                    <Text style={styles.valueText}>
                      {item.included_items.length
                        ? item.included_items.length
                        : ''}
                    </Text>
                  </View>
                </View>
              ) : null}
              {item.is_frp ? (
                <View style={[styles.valuesContainer, {borderWidth: 0}]}>
                  <Text numberOfLines={1} style={styles.valueTitleText}>
                    {'Included Items'}
                  </Text>
                  <Text style={styles.valueText}>
                    {item.included_items.length
                      ? item.included_items.length
                      : ''}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
          {item.is_frp && (
            <React.Fragment>
              {'included_items' in item && item.included_items.length > 0 && (
                <View style={[styles.includedItemsBox]}>
                  <Text style={styles.summerText}>
                    {item.included_items.length} Item(s) Included
                  </Text>
                  <IncludedProductComponent
                    reference={this.includedProductRef}
                    data={item.included_items}
                    startingPosition={1}
                  />
                </View>
              )}
            </React.Fragment>
          )}
        </View>
      </View>
    );
  };
  render3ProductCell = ({item, index}) => {
    if (index <= 2)
      return (
        <View style={styles.productContainer}>
          <View style={[item.is_frp ? styles.frpViewCard : '']}>
            <View
              style={[item.is_frp ? styles.frpImageViewCard : styles.viewCard]}>
              <ImageLoad
                style={[item.is_frp ? styles.frpImageStyle : styles.imageStyle]}
                topLeftBorderRadius={12}
                borderBottomLeftRadius={12}
                topRightBorderRadius={12}
                borderBottomRightRadius={12}
                customImagePlaceholderDefaultStyle={{
                  borderTopLeftRadius: 6,
                  borderBottomLeftRadius: 6,
                }}
                source={
                  item.image
                    ? {uri: item.image}
                    : resources.images.img_placeholer_small
                }
                // resizeMode={'stretch'}
              />
              <View style={styles.cardContainer}>
                <View style={styles.titleContainer}>
                  <View style={{flex: 1}}>
                    <Text
                      style={styles.titleName}
                      ellipsizeMode={'tail'}
                      numberOfLines={2}>
                      {item.product_name}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => this.deleteProduct(item.cart_id)}
                    style={{
                      height: 20,
                      width: 20,
                      alignItems: 'flex-end',
                    }}>
                    <Image
                      source={resources.images.inc_small_delete}
                      style={styles.crossStyle}
                    />
                  </TouchableOpacity>
                </View>
                <View style={[styles.valuesContainer, {borderWidth: 0}]}>
                  <View>
                    <Text numberOfLines={1} style={styles.valueTitleText}>
                      {'Quantity'}
                    </Text>
                    <Text style={styles.valueText}>
                      {item?.quantity + 'item'}
                    </Text>
                  </View>
                  <View>
                    <Text numberOfLines={1} style={styles.valueTitleText}>
                      {'Rent'}
                      {/* {item.rental_freq ? item.rental_freq + ' Rental' : ''} */}
                    </Text>
                    <Text style={styles.valueText}>
                      {'₹ ' + item?.price + '/month'}
                    </Text>
                  </View>
                </View>
                <View style={[styles.valuesContainer, {borderWidth: 0}]}>
                  <View>
                    <Text numberOfLines={1} style={styles.valueTitleText}>
                      {'Deposit'}
                      {/* {'Refundable Deposit'} */}
                    </Text>
                    <Text style={styles.valueText}>
                      {item.product_shipping_cost
                        ? '₹ ' + item.product_shipping_cost
                        : ''}
                    </Text>
                  </View>
                  {item.is_frp ? (
                    <View>
                      <Text numberOfLines={1} style={styles.valueTitleText}>
                        {item.rental_freq
                          ? 'Net ' + item.rental_freq + ' Rental'
                          : ''}
                      </Text>
                      <Text style={styles.valueText}>
                        ₹ {item.net_rent ? item.net_rent : ''}
                      </Text>
                    </View>
                  ) : null}
                </View>
                {item.is_frp ? (
                  <View style={[styles.valuesContainer, {borderWidth: 0}]}>
                    <View>
                      <Text numberOfLines={1} style={styles.valueTitleText}>
                        {'Upgrade Rent'}
                      </Text>
                      <Text style={styles.valueText}>
                        ₹ {item.upgrades_rent ? item.upgrades_rent : ''}
                      </Text>
                    </View>
                    <View>
                      <Text numberOfLines={1} style={styles.valueTitleText}>
                        {'Included Items'}
                      </Text>
                      <Text style={styles.valueText}>
                        {item.included_items.length
                          ? item.included_items.length
                          : ''}
                      </Text>
                    </View>
                  </View>
                ) : null}
                {item.is_frp ? (
                  <View style={[styles.valuesContainer, {borderWidth: 0}]}>
                    <Text numberOfLines={1} style={styles.valueTitleText}>
                      {'Included Items'}
                    </Text>
                    <Text style={styles.valueText}>
                      {item.included_items.length
                        ? item.included_items.length
                        : ''}
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>
            {item.is_frp && (
              <React.Fragment>
                {'included_items' in item && item.included_items.length > 0 && (
                  <View style={[styles.includedItemsBox]}>
                    <Text style={styles.summerText}>
                      {item.included_items.length} Item(s) Included
                    </Text>
                    <IncludedProductComponent
                      reference={this.includedProductRef}
                      data={item.included_items}
                      startingPosition={1}
                    />
                  </View>
                )}
              </React.Fragment>
            )}
          </View>
        </View>
      );
  };

  hitRedeemCoins = (coins, isRedeeming) => {
    const {upfront_switch, detailData} = this.state;
    const {upfront_item_included} = detailData;
    let upfrontEnabled = upfront_switch && upfront_item_included == 1 ? 1 : 0;

    this.props
      .hitRedeemCoinsApi(coins, upfrontEnabled)
      .then(resp => {
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
      });
  };

  getTotalPayable = () => {
    const {fetchedData, addedCityshield, detailData, isCoinRedeemed, dataAfterCoinsApplied} = this.state

    const cityShieldObj = addedCityshield
    ? detailData.city_shield
    : detailData.without_city_shield;

    return Object.keys(fetchedData).length === 0
                  ? cityShieldObj.total_grand_final_rent
                  : fetchedData.total_grand_final_rent -
                    (isCoinRedeemed ? dataAfterCoinsApplied.wallet_amount : 0)
  }

  renderOrderDeatail = () => {
    const {
      detailData,
      productData,
      addedCityshield,
      fetchedData,
      isCoinRedeemed,
      dataAfterCoinsApplied
    } = this.state;
    const {
      total_renntal,
      total_deposite,
      total_gst,
      grand_total,
      discount_amount,
      duration,
      delivery,
      products,
      upfornt_emi_message
    } = detailData;
    const {emi_message, emi_response_flag} = detailData;
    let is_no_cost_emi = false;
    productData.map(item => {
      if (item.is_frp) {
        is_no_cost_emi = true;
        return false;
      } else {
        return false;
      }
    });
    let tenure_duration = parseInt(duration.replace(' Months', ''));

    const cityShieldObj = addedCityshield
      ? detailData.city_shield
      : detailData.without_city_shield;

    return (
      <>
        <View style={styles.detailCard1}>
          <Text style={[styles.orderText]}>
            {resources.strings.ORDER_DETAIL}
          </Text>
          <View style={styles.detailCard}>
            <View style={styles.orderItem}>
              <Text style={styles.orderPropText}>{'Duration'}</Text>
              <Text style={styles.orderValuesText}>
                {duration ? duration : 'NA'}
              </Text>
            </View>
            <View style={styles.orderItem}>
              <Text style={styles.orderPropText}>
                {products.length > 0 ? products[0].rental_freq + ' Rental' : ''}
              </Text>
              <Text style={styles.orderValuesText}>
                {'₹ '}
                {Object.keys(fetchedData).length === 0
                  ? cityShieldObj.total_final_rent
                  : fetchedData.total_final_rent}
              </Text>
            </View>
            <View style={styles.orderItem}>
              <Text style={styles.orderPropText}>{'Refundable Deposit'}</Text>
              <Text style={styles.orderValuesText}>
                ₹{' '}
                {Object.keys(fetchedData).length === 0
                  ? cityShieldObj.security_deposite
                  : fetchedData.security_deposite}
              </Text>
            </View>
            <View style={styles.orderItem}>
              <Text style={styles.orderPropText}>{'Taxes'}</Text>
              <Text style={styles.orderValuesText}>
                ₹{' '}
                {Object.keys(fetchedData).length === 0
                  ? cityShieldObj.total_gst
                  : fetchedData.total_gst}
              </Text>
            </View>
            <View style={styles.orderItem}>
              <Text style={styles.orderPropText}>{'Discount'}</Text>
              <Text
                style={[styles.orderValuesText, styles.orderValuesTextGreen]}>
                - ₹{' '}
                {Object.keys(fetchedData).length === 0
                  ? cityShieldObj.discount_amount
                  : fetchedData.discount_amount}
              </Text>
            </View>

            <View style={styles.orderItem}>
              <Text style={styles.orderPropText}>{'Delivery'}</Text>
              <Text
                style={[styles.orderValuesText, styles.orderValuesTextGreen]}>
                {delivery ? delivery : 'NA'}
              </Text>
            </View>
            <Image
              source={resources.images.img_dot_line}
              style={styles.imgDotLine}
            />
            <View style={styles.orderItem}>
              <Text style={styles.orderPropText}>{'City Coins redeemed'}</Text>
              <Text
                style={[styles.orderValuesText, styles.orderValuesTextGreen]}>
                - ₹{' '}
                {this.state.isCoinRedeemed
                  ? this.state.dataAfterCoinsApplied.wallet_amount
                  : 0}
              </Text>
            </View>
            <Image
              source={resources.images.img_dot_line}
              style={styles.imgDotLine}
            />
            {addedCityshield && (
              <View style={styles.orderItem}>
                <View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      source={resources.images.img_shield}
                      style={{height: 18, width: 18}}
                    />
                    <Text
                      style={{
                        fontFamily: resources.fonts.medium,
                        fontSize: 12,
                        fontWeight: '700',
                        color: resources.colors.green_2D9469,
                        marginLeft: 2,
                        fontStyle: 'italic',
                      }}>
                      {'CITYSHIELD'}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontFamily: resources.fonts.regular,
                      fontWeight: '400',
                      fontSize: 12,
                      color: resources.colors.gray_9A9AA2,
                      marginTop: 4,
                    }}>
                    {cityShieldObj.tenure +
                      ` months x ₹${
                        Object.keys(fetchedData).length === 0
                          ? cityShieldObj.total_monthly_care_amount
                          : fetchedData.total_monthly_care_amount
                      }`}
                  </Text>
                </View>
                <Text
                  style={[styles.orderValuesText, styles.orderValuesTextGreen]}>
                  ₹{' '}
                  {Object.keys(fetchedData).length === 0
                    ? cityShieldObj.total_final_care_amount
                    : fetchedData.total_final_care_amount}
                </Text>
              </View>
            )}
            {addedCityshield && (
              <Image
                source={resources.images.img_dot_line}
                style={styles.imgDotLine}
              />
            )}

            <View style={[styles.orderItem, {marginBottom: 0}]}>
              <Text style={styles.orderPropText}>{'Total Payable'}</Text>
              <Text style={[styles.orderValuesText]}>
                {'₹ '}
                {this.getTotalPayable()}
              </Text>
            </View>
          </View>
        </View>

        {!is_no_cost_emi && !emi_response_flag ? (
          <View style={styles.noEMIContainer}>
            <Image
              source={resources.images.inc_small_emi}
              style={styles.imgEMI}
            />
            <Text style={styles.txtEMI}>
            {upfornt_emi_message
            ? upfornt_emi_message
            : `No cost EMI of Rs ${isCoinRedeemed
              ? (
                  dataAfterCoinsApplied
                    .total_after_wallet_discount / tenure_duration
                ).toFixed(2)
              : cityShieldObj.total_grand_final_rent
              ? (cityShieldObj.total_grand_final_rent / tenure_duration).toFixed(2)
              : '0'} / month for ${duration} Months also available at the checkout`}
            </Text>
          </View>
        ) : (
          <View style={{marginBottom: 20}} />
        )}
      </>
    );
  };
  renderPaymentOfferView = () => {
    const data = [
      {
        id: 0,
        title: 'Get upto Rs.750 Cashback',
        subtitle: 'Pay using via Mobikwik wallet at the time of checkout',
        linkText: 'Terms & conditions',
      },
      {
        id: 1,
        title: 'Get upto Rs.750 Cashback',
        subtitle: 'Pay using via Mobikwik wallet at the time of checkout',
        linkText: 'Terms & conditions',
      },
      {
        id: 2,
        title: 'Get upto Rs.750 Cashback',
        subtitle: 'Pay using via Mobikwik wallet at the time of checkout',
        linkText: 'Terms & conditions',
      },
    ];
    return (
      <View style={{marginVertical: 20}}>
        <Text style={[styles.orderText, {marginHorizontal: 16}]}>
          {'Payment offers'}
        </Text>
        <FlatList
          contentContainerStyle={{marginTop: 20}}
          data={data}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({item, index}) => {
            return (
              <View style={styles.paymentContianer}>
                <View style={{flex: 1}}>
                  <Text style={styles.paymentOfferTitle}>{item.title}</Text>
                  <Text style={styles.paymentOfferSubtitle} numberOfLines={2}>
                    {item.subtitle}
                  </Text>
                </View>
                <Text style={styles.paymentOfferTerms}>{item.linkText}</Text>
                <Image
                  source={resources.images.img_ellipse_left}
                  style={styles.imgEllipseLeft}
                  resizeMode="contain"
                />
                <Image
                  source={resources.images.img_ellipse_right}
                  style={styles.imgEllipseRight}
                  resizeMode="contain"
                />
              </View>
            );
          }}
        />
      </View>
    );
  };
  renderKycTextView = () => {
    return (
      <View style={styles.instructionContainer}>
        <View style={styles.kycTextContainer}>
          <Image
            source={resources.images.kyc_icn}
            style={styles.iconStyle}
            resizeMode={'contain'}
          />
          <Text
            style={styles.instructionText}
            ellipsizeMode={'tail'}
            numberOfLines={1}>
            {resources.strings.KYC_VERIFY_TEXT}
          </Text>
        </View>
        <View style={styles.kycTextContainer}>
          <Image
            source={resources.images.delivery_icn}
            style={styles.iconTruck}
            resizeMode={'contain'}
          />
          <Text
            style={styles.instructionText}
            ellipsizeMode={'tail'}
            numberOfLines={1}>
            {resources.strings.CANCELLATION_TEXT}
          </Text>
        </View>
        <View style={styles.kycTextContainer}>
          <Image
            source={resources.images.quality_icn}
            style={styles.iconStyle}
            resizeMode={'contain'}
          />
          <Text
            style={styles.instructionText}
            ellipsizeMode={'tail'}
            numberOfLines={1}>
            {resources.strings.ALL_CONDITION_TEXT}
          </Text>
        </View>
      </View>
    );
  };

  renderServices = () => {
    return (
      <View style={styles.serviceCon}>
        <View style={styles.columnDirection}>
          <View style={styles.iconTextContainer}>
            <Image
              source={resources.images.icn_truck}
              style={styles.serviceIcon}
              resizeMode={'contain'}
            />
            <Text style={styles.instructionText}>
              {resources.strings.FREE_DELIVERY}
            </Text>
          </View>
          <View style={styles.iconTextContainer}>
            <Image
              source={resources.images.icn_relocation}
              style={styles.serviceIcon}
              resizeMode={'contain'}
            />
            <Text style={styles.instructionText}>
              {resources.strings.FREE_RELOCATION}
            </Text>
          </View>
          <View style={styles.iconTextContainer}>
            <Image
              source={resources.images.quality_icn}
              style={styles.serviceIcon}
              resizeMode={'contain'}
            />
            <Text style={styles.instructionText}>
              {resources.strings.MINT_CONDITION}
            </Text>
          </View>
        </View>
        <View style={styles.space} />
        <View style={styles.columnDirection}>
          <View style={styles.iconTextContainer}>
            <Image
              source={resources.images.icn_upgrade}
              style={styles.serviceIcon}
              resizeMode={'contain'}
            />
            <Text style={styles.instructionText}>
              {resources.strings.FREE_UPGRADE}
            </Text>
          </View>
          <View style={styles.iconTextContainer}>
            <Image
              source={resources.images.icn_damage}
              style={styles.serviceIcon}
              resizeMode={'contain'}
            />
            <Text style={styles.instructionText}>
              {resources.strings.DAMAGE_WAIVER}
            </Text>
          </View>
          <View style={styles.iconTextContainer}>
            <Image
              source={resources.images.icn_installation}
              style={styles.serviceIcon}
              resizeMode={'contain'}
            />
            <Text style={styles.instructionText}>
              {resources.strings.FREE_INSTALLATION}
            </Text>
          </View>
        </View>
      </View>
    );
  };
  onPressApplyCode = code => {
    if (Boolean(code)) {
      this.props
        .applyCouponCodeApi(code)
        .then(data => {
          this.setState({
            remove: true,
            couponCode: code,
            couponDescription: data.data.description,
          });
          if (data.status_code == 200) {
            this.loadData();
          }
          AppToast(data.message);
        })
        .catch(error => {
          AppToast(error);
        });
    } else {
      // AppToast("Please Remove the existing coupon before applying the other coupon.")
      SimpleToast.show(
        'Please Remove the existing coupon before applying the other coupon.',
        SimpleToast.LONG,
      );
    }
  };
  onPressRemoveCode = code => {
    const {remove, couponCode} = this.state;
    if (couponCode == null || couponCode == '') {
      // AppToast("Please Enter code")
      SimpleToast.show('Please Enter code', SimpleToast.SHORT);
    } else {
      if (remove == false) {
        this.props
          .applyCouponCodeApi(code)
          .then(data => {
            this.setState({
              remove: true,
              couponCode: code,
              couponDescription: data.data.description,
            });
            if (data.status_code == 200) {
              this.loadData();
            }
            AppToast(data.message);
          })
          .catch(error => {
            AppToast('Please Enter valid code');
          });
      } else {
        this.props
          .deleteCouponCodeApi(code)
          .then(data => {
            this.setState({couponCode: '', remove: false});
            if (data.status_code == 200) {
              this.loadData();
            }
            AppToast(data.message);
          })
          .catch(error => {
            AppToast(error);
          });
      }
    }
  };
  renderOfferView = ({item, index}) => {
    const {couponData} = this.state;
    return (
      <View style={styles.grayBackground}>
        <View style={styles.offerTextButtonCon}>
          <View style={styles.rowTextCon}>
            <View style={styles.rowDirection}>
              <Text
                style={styles.boldTextStyle}
                ellipsizeMode={'tail'}
                numberOfLines={1}>
                {item.h1_price ? item.h1_price : ''}
              </Text>
              <Text
                style={styles.mediumTextStyle}
                ellipsizeMode={'tail'}
                numberOfLines={2}>
                {item.h1_price_text ? item.h1_price_text : ''}
              </Text>
            </View>
            <Text
              style={styles.offerTextStyle}
              ellipsizeMode={'tail'}
              numberOfLines={3}>
              {item.description ? item.description : ''}
            </Text>
          </View>
          <Button
            disableTouch={
              item.coupon_code == this.state.couponCode ? true : false
            }
            btnStyle={[
              item.coupon_code == this.state.couponCode
                ? styles.normalButton
                : styles.buttonStyle,
            ]}
            textStyleOver={[
              item.coupon_code == this.state.couponCode
                ? styles.normalTextStyle
                : styles.btnTextStyle,
            ]}
            rounded
            btnText={item.coupon_code ? item.coupon_code : ''}
            onPress={() => {
              this.onPressApplyCode(item.coupon_code ? item.coupon_code : '');
            }}
          />
        </View>
        {index == couponData.length - 1 ? (
          <View />
        ) : (
          <View style={styles.seprator} />
        )}
      </View>
    );
  };
  render3OfferView = () => {
    return (
      <>
        {this.state.detailData?.coupon_array?.length > 0 && (
          <FlatList
            keyExtractor={({item, index}) => "coupen_code_"+index}
            contentContainerStyle={{marginVertical: wp(20)}}
            data={this.state.detailData.coupon_array}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({item, index}) => {
              return (
                <ImageBackground
                  source={resources.images.inc_offers}
                  resizeMode="cover"
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: myWidth - 35,
                    marginLeft: 16,
                    paddingVertical: 25,
                  }}>
                  <View
                    style={{
                      marginHorizontal: 25,
                      flex: 0.8,
                    }}>
                    <Text
                      style={{
                        flex: 1,
                        fontFamily: resources.fonts.regular,
                        fontWeight: '400',
                        fontSize: 12,
                        color: resources.colors.purple_CCC5F4,
                      }}
                      numberOfLines={2}>
                      {item.description}
                    </Text>
                    <Text
                      style={{
                        marginTop: 8,
                        fontFamily: resources.fonts.medium,
                        fontWeight: '500',
                        fontSize: 16,
                        color: resources.colors.white,
                      }}>{`Use Code ${item.coupon_code}`}</Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      borderRadius: 20,
                      marginRight: 15,
                      backgroundColor: resources.colors.white,
                    }}
                    onPress={() => this.onPressApplyCode(item.coupon_code ? item.coupon_code : '')}
                    >
                    <Text
                      style={{
                        marginHorizontal: 14,
                        marginVertical: 9,
                        color: resources.colors.gray_222222,
                        fontWeight: '500',
                        fontFamily: resources.fonts.medium,
                        fontSize: 14,
                        color: resources.colors.gray_222222,
                      }}>
                      APPLY
                    </Text>
                  </TouchableOpacity>
                </ImageBackground>
              );
            }}
          />
        )}
      </>
    );
    // return (
    //   <View style={styles.grayBackground}>
    //     <View style={styles.offerTextButtonCon}>
    //       <View style={styles.rowTextCon}>
    //         <View style={styles.rowDirection}>
    //           <Text
    //             style={styles.boldTextStyle}
    //             ellipsizeMode={'tail'}
    //             numberOfLines={1}>
    //             {item.h1_price ? item.h1_price : ''}
    //           </Text>
    //           <Text
    //             style={styles.mediumTextStyle}
    //             ellipsizeMode={'tail'}
    //             numberOfLines={2}>
    //             {item.h1_price_text ? item.h1_price_text : ''}
    //           </Text>
    //         </View>
    //         <Text
    //           style={styles.offerTextStyle}
    //           ellipsizeMode={'tail'}
    //           numberOfLines={3}>
    //           {item.description ? item.description : ''}
    //         </Text>
    //       </View>
    //       <Button
    //         disableTouch={
    //           item.coupon_code == this.state.couponCode ? true : false
    //         }
    //         btnStyle={[
    //           item.coupon_code == this.state.couponCode
    //             ? styles.normalButton
    //             : styles.buttonStyle,
    //           item.coupon_code == '' && {
    //             backgroundColor: colors.white,
    //             borderColor: colors.white,
    //           },
    //         ]}
    //         touchOpacityStyle={{}}
    //         textStyleOver={[
    //           item.coupon_code == this.state.couponCode
    //             ? styles.normalTextStyle
    //             : styles.btnTextStyle,
    //         ]}
    //         rounded
    //         btnText={item.coupon_code ? item.coupon_code : ''}
    //         onPress={() => {
    //           this.onPressApplyCode(item.coupon_code ? item.coupon_code : '');
    //         }}
    //       />
    //     </View>
    //     {index == this.state.couponData.length - 1 ? (
    //       <View />
    //     ) : (
    //       <View style={styles.seprator} />
    //     )}
    //   </View>
    // );
  };

  noDataFound = () => {
    AppToast(resources.strings.ADD_PRODUCT_MSG);
  };
  renderEmptyScreen = () => {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Image
          source={resources.images.img_empty_cart}
          resizeMode={'contain'}
        />
        <View style={{marginTop: 15}}>
          <Text style={{textAlign: 'center', fontSize: 14}}>
            {resources.strings.NO_PRODUCT_FOUND}
          </Text>
          <Text style={{textAlign: 'center'}}>
            {"Looks like you haven't choosen product yet."}
          </Text>
        </View>
      </View>
    );
  };
  showAllProduct = () => {
    const {allProduct} = this.state;
    this.setState({allProduct: !allProduct});
  };
  showAllOffer = () => {
    this.setState({allOffer: true});
  };

  // Material input methods
  onChangeEmail = text => {
    if (text.length >= 10) {
      if (validateMobileNumber(text)) {
        this.setState({isMobileLogin: true, emailOrMobile: text});
      } else {
        this.setState({
          isMobileLogin: false,
          emailOrMobile: text,
          isOtpInputFIeldVisible: false,
          isGetOtpTextVisible: true,
          otp: '',
        });
      }
    } else {
      this.setState({
        isMobileLogin: false,
        emailOrMobile: text,
        isOtpInputFIeldVisible: false,
        isGetOtpTextVisible: true,
        otp: '',
      });
    }
  };

  onChangeUpdateEmail = text => {
    let regex = new RegExp('[a-z0-9]+@[a-z0-9]+.[a-z]{2,3}');
    if (regex.test(text)) {
      this.setState({
        saveEmailButton: true,
      });
    }
    this.setState({
      updateEmail: text,
    });
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

  onPressGetOtp = () => {
    const {emailOrMobile} = this.state;
    if (emailOrMobile.trim() != '' && emailOrMobile.trim().length == 10) {
      var formdata = new FormData();
      formdata.append('mobile_number', emailOrMobile);

      var requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
      };

      fetch(`${BASE_URL}/v1/user/sendotp_new`, requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result.status_code == '200')
            this.setState({
              isOtpSent: true,
            });
          this.startCountDown();
        })
        .catch(error => null);
    } else {
      AppToast('Please fill your Mobile number properly');
    }
  };

  focusToNext = () => {
    const {isMobileLogin} = this.state;
    if (isMobileLogin) {
      // focusTo(this.otpRef)
    } else {
      this.focusToNext(this.passwordRef);
    }
  };

  onChangeOtp = text => {
    this.setState({otp: text});
  };

  onChangeNewFullName = text => {
    this.setState({newFullName: text});
  };

  saveFromAsynAndNavigate = async data => {
    const {toScreenName} = this.props;
    let appUsrObj = AppUser.getInstance();
    appUsrObj.token = data.data.access_token;
    appUsrObj.userId = data.data.id.toString();
    appUsrObj.userDetails = data.data;

    if (appUsrObj.userDetails) {
      appUsrObj.itemsIncartCount = parseInt(
        appUsrObj.userDetails.itemsIncartCount,
      );
      this.props.onUpdateCartBadgeCount(appUsrObj.itemsIncartCount);
      appUsrObj.wishlistCount = parseInt(
        appUsrObj.userDetails.WishlistItemsCount,
      );
      this.props.onUpdateWishlistBadgeCount(appUsrObj.wishlistCount);
    }

    const userToken = [AsyncStorageContaints.UserToken, data.data.access_token];
    const userId = [AsyncStorageContaints.UserId, data.data.id.toString()];
    const userDetails = [
      AsyncStorageContaints.UserData,
      JSON.stringify(data.data),
    ];
    const itemsIncartCount = [
      AsyncStorageContaints.cartBadgeCount,
      appUsrObj.userDetails.itemsIncartCount,
    ];
    const itemsInWishlistCount = [
      AsyncStorageContaints.wishlistBadgeCount,
      appUsrObj.userDetails.WishlistItemsCount.toString(),
    ];

    try {
      await AsyncStorage.multiSet([
        userToken,
        userId,
        userDetails,
        itemsIncartCount,
        itemsInWishlistCount,
      ]);
      if (toScreenName == '') {
        const resetAction = CommonActions.reset({
          index: 0,
          routes: [{name: 'Cart'}],
        });
        this.props.navigation.dispatch(resetAction);
      } else {
        let obj = AppUser.getInstance();
        let token = obj.fcmToken;
        if (token) {
          this.props.updateFcmTokenToServer(token);
        }
        if (this.props.navigation.canGoBack()) this.props.navigation.pop();

        if (toScreenName.includes('ProductDetailScreen')) {
          let arr = toScreenName.split('_');
          let id = parseInt(arr[1]);
          this.props.navigation.navigate('ProductDetailScreen', {
            productId: id,
          });
        } else {
          this.props.navigation.navigate(toScreenName);
        }
      }
    } catch (e) {
    }
  };

  onPressVerifyOtp = () => {
    const {emailOrMobile, otp} = this.state;
    if (emailOrMobile.trim() != '' && emailOrMobile.trim().length == 10) {
      var formdata = new FormData();
      formdata.append('mobile_number', emailOrMobile);
      formdata.append('otp', otp);

      var requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
      };

      fetch(`${BASE_URL}/v1/user/verifyotp_new`, requestOptions)
        .then(response => response.json())
        .then(async result => {
          if (result.status_code == '200') {
            AppToast(result.message);
            this.saveFromAsynAndNavigate(result);
          } else if (result.status_code == '400') {
            if (result.data.status_code == '100') {
              AppToast(result.data.message);
              this.setState({
                emailFieldVisible: true,
              });
            } else AppToast(result.message);
          } else {
            AppToast(result.message);
          }
        })
        .catch(error => null);
    } else {
      AppToast('Please fill your Mobile number properly');
    }
  };

  onSaveEmail = () => {
    const {emailOrMobile, otp, updateEmail} = this.state;
    if (emailOrMobile.trim() != '' && emailOrMobile.trim().length == 10) {
      var formdata = new FormData();
      formdata.append('mobile_number', emailOrMobile);
      formdata.append('otp', otp);
      formdata.append('email', updateEmail);

      var requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
      };


      fetch(`${BASE_URL}/v1/user/verifyotp_new`, requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result.status_code == '200') {
            AppToast(result.message);
            this.saveFromAsynAndNavigate(result);
          } else if (result.status_code == '400') {
            if (result.data.status_code == '100') {
              AppToast(result.data.message);
              this.setState({
                emailFieldVisible: true,
              });
            } else AppToast(result.message);
          } else {
            AppToast(result.message);
          }
        })
        .catch(error => null);
    } else {
      AppToast('Please fill your Mobile number properly');
    }
  };

  updateDetails = () => {
    const {newFullName, updateEmail} = this.state;

    let appUser = AppUser.getInstance();
    let token = appUser.token;
    let userid = appUser.userId;
    let email =
      appUser.userDetails.email == '' ? updateEmail : appUser.userDetails.email;
    let oldName = appUser.userDetails.full_name;

    let regex = new RegExp('[a-z0-9]+@[a-z0-9]+.[a-z]{2,3}');
    if (regex.test(email)) {
      var myHeaders = new Headers();
      myHeaders.append('authtoken', token);
      myHeaders.append('userid', userid);

      var formdata = new FormData();
      formdata.append('full_name', oldName == '' ? newFullName : oldName);
      formdata.append('email', email == '' ? updateEmail : email);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow',
      };

      fetch(`${BASE_URL}/v1/user/updateuserdetail`, requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result.status_code == 200) this.saveFromAsynAndNavigate(result);
        })
        .catch(error => null);
    } else {
      AppToast('Please fill the details properly');
    }
  };

  startCountDown = () => {
    this.setState({
      isTimeVisible: true,
    });
    this.interval = setInterval(
      () => this.setState(prevState => ({countDown: prevState.countDown - 1})),
      1000,
    );
  };
  onChangeWhatsappNotification = () => {
    this.setState({
      whatappToggle: !this.state.whatappToggle,
    });
  };

  handleChangeAddress = () => {
    this.setState({
      actionData: {
        show: true,
        selectedIndex: 0,
        modalType: enumCartActionType.address_list,
        data: null,
        events: {
          handleCloseAction: () => this.handleCloseAction(),
          handleAddAddress: () => this.handleAddAddress(),
        },
      },
    });
    // const {detailData} = this.state;
    // NetInfo.fetch().then(state => {
    //   if (state.isConnected) {
    //     this.props.navigation.navigate('AddressScreen', {
    //       isProceedBtnVisible: true,
    //       isProfileIconVisible: true,
    //       checkoutOrderDetails: detailData,
    //     });
    //   }
    // });
  };

  handleAddAddress = () => {
    this.setState({
      actionData: {
        show: true,
        selectedIndex: 0,
        modalType: enumCartActionType.add_address,
        data: null,
        events: {
          handleCloseAction: () => this.handleCloseAction(),
        },
      },
    });
  };

  renderAddress = () => {
    const city = AppUser.getInstance().selectedCityName;
    const defaultAddress =
      this.props.addressList?.filter(
        item => item.primary?.toString()?.toLowerCase() === 'yes',
      ) || [];
    return (
      <View
        style={[styles.rowDirection, {padding: 10, backgroundColor: 'white'}]}>
        <View>
          <Image source={resources.images.pin_green} />
        </View>
        <View style={[styles.rowDirection, {alignItems: 'center', flex: 1}]}>
          <Text style={styles.cityName}>{city}</Text>
          {defaultAddress.length > 0 ? (
            <Text
              onPress={() => {
                this.handleChangeAddress();
              }}
              style={[styles.addAddressLnk, {flex: 1}]}
              numberOfLines={1}>{`  | ${defaultAddress[0].address1 +
              ',' +
              defaultAddress[0].address2 +
              ',' +
              defaultAddress[0].city}`}</Text>
          ) : (
            <Text
              onPress={() => {
                this.handleAddAddress();
              }}
              style={[
                styles.addAddressLnk,
                {flex: 1},
              ]}>{`  | Add Address`}</Text>
          )}
          <Image
            source={
              defaultAddress.length > 0
                ? resources.images.img_arrow_down
                : resources.images.img_right_icon
            }
            style
          />
        </View>
      </View>
    );
  };

  handleCloseAction = () => {
    const actionData = JSON.parse(JSON.stringify(this.state.actionData));
    actionData.show = false;
    actionData.selectedIndex = 0;
    actionData.modalType = null;
    actionData.data = null;
    actionData.events = null;
    this.setState({actionData});
  };

  handleOrderPayment = () => {
    // this.state.detailData.city_shield.total_monthly_rent <
    // this.state.detailData.order_min_amt
    //   ? this.showToast()
    //   : this.onPaymentFlow()
    this.handleCloseAction()
    this.props.navigation.navigate('OrderComplete')
  }

  onPaymentFlow = () => {
    if (this.state.paymentFlag == 'Razorpay') {
      this.onPressProceedRazorpay();
    } else {
      //Not in use please refer OrderSummeryScreen
      // this.onPressProceed();
    }
  };

  
  onPayemntResponse = (payu_response, checkoutResp) => {
    if (payu_response.unmappedstatus == FAILURE) {
      this.onFailurePayment();
    } else {
      // payment success
      this.storeCartCountData('0');
      // this.checkCredit(checkoutResp);
    }
  };

  getPrimaryAddress = () => {
    const {addressList} = this.props
   const primaryAddress = addressList.filter(item =>item.primary == YES);
    return primaryAddress.length > 0 ? primaryAddress[0] : null
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

  onPressProceedRazorpay = () => {
    const {detailData, isCoinRedeemed, dataAfterCoinsApplied} = this.state
    
    const {upfront_item_included} = detailData;
    let amountToBePaid = this.getTotalPayable();
    let totalAmount = amountToBePaid.toString();
    totalAmount = totalAmount.split('.')[0];

    const selectedAddress = this.getPrimaryAddress();

    if (selectedAddress && selectedAddress?.id) {
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
        addedCityshield,
      } = this.state;
      let appUser = AppUser.getInstance();
      let fullname = appUser.userDetails.full_name;
      let email = appUser.userDetails.email;
      let mobileNumber = appUser.userDetails.mobile_number;
      let isWhatsappOPT = whatappToggle ? '1' : '0';
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
          selectedAddress.id,
          gstNumber,
          companyName,
          email,
          redeemedCoins,
          addedCityshield,
          detailData.city_shield.total_final_care_amount,
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
                selectedAddress,
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
            });
        })
        .catch(err => {
          AppToast(err);
          // AppToast("Something went wrong. Please try again later!")
        });
    } else {
    }
  };

  onFailurePayment = () => {
    AppToast('Error while payment');
    // go to cart screen if failure
    this.props.navigation.navigate('DashboardScreen');
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
        amount: amount,
        // amount: this.convertIntegerWithINR(parseInt(amount)),
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
      
      if (normalOrRecurring == 'recurring_payment') {
        options.customer_id = customerId;
        options.recurring = 1;
      }
      RazorpayCheckout.open(options)
        .then(async data => {
          const { fetchedData, detailData} = this.state;

          await analytics().logEvent(
            Platform.OS == 'android' ? 'purchase_android' : 'purchase_ios',
            {
              id: data.razorpay_order_id,
              value: fetchedData.total_grand_final_rent,
              currency: 'INR',
              tax:
                Object.keys(fetchedData).length === 0
                  ? detailData.city_shield.total_gst
                  : fetchedData.total_gst,
              shipping: 0.0,
              items: detailData.products,
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
                this.onRazorpayPayemntResponse(
                  data,
                  data.razorpay_payment_id,
                  checkoutResp,
                );
              })
              .catch(err => {
                this.onFailurePayment();
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
                this.onRazorpayPayemntResponse(
                  data,
                  data.razorpay_payment_id,
                  checkoutResp,
                );
              })
              .catch(err => {
                this.onFailurePayment();
 version              });
          }
        })
        .catch(error => {
          // handle failure
          this.onFailurePayment();
        });
    } catch (err) {
      this.onFailurePayment();
    }
  };

  onRazorpayPayemntResponse = (data, razorpay_payment_id, checkoutResp) => {
    if (razorpay_payment_id == null || razorpay_payment_id == '') {
      this.onFailurePayment();
    } else {
      // payment success

      this.storeCartCountData('0');
      this.checkCredit(checkoutResp);
    }
  };

  showToast = () => {
    AppToast(
      `Your minimum Monthly Rental amount should be Rs. ${
        this.state.detailData.order_min_amt
      } Please add more products to proceed with the order.`,
    );
  };

  handleConfirmAddress = () => {
    this.setState({
      actionData: {
        show: true,
        selectedIndex: 0,
        modalType: enumCartActionType.confirm_address,
        data: this.getPrimaryAddress(),
        events: {
          handleCloseAction: () => this.handleCloseAction(),
          handleOrederPayment: () => this.handleOrderPayment(),
          handleChangeAddress: () => this.handleChangeAddress()
        },
      },
    });
  }

  onClickProceedBtn = () => {
    const {addressList} = this.props;
    let primaryAddress = addressList.filter(item => {
      return item.primary == YES;
    });
    if (primaryAddress.length > 0) {
      let address = primaryAddress[0];

      if (address.warning == '') {
        const {navigation} = this.props;
        

        this.state.detailData.city_shield.total_monthly_rent <
        this.state.detailData.order_min_amt
          ? this.showToast()
          : this.handleConfirmAddress()

        // navigation.navigate('OrderSummaryScreen', {
        //   checkoutOrderDetails: this.state.detailData,
        //   isComingFromBuyNow: false,
        //   grandTotal: this.state.grand_total,
        //   selectedAddress: address,
        //   totalDeposit: this.state.detailData.total_deposite,
        // });
      } else {
        AppToast('Please select an address which belongs to selected city');
      }
    } else {
      // infomatory alert for user
      AppToast('Please select an address');
    }
  };

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
      .then(result => {
        this.setState(
          {
            fetchedData: result.data,
          },
          () => {
            this.loadData();
          },
        );
      })
      .then(() => null)
      .catch(error => null);
  };

  handleCityshield = () => {
    if (!this.state.addedCityshield) {
      this.toggleCityShield(!this.state.addedCityshield);
      this.setState({
        addedCityshield: !this.state.addedCityshield,
      });
    } else {
      const actionData = JSON.parse(JSON.stringify(this.state.actionData));
      actionData.show = true;
      actionData.selectedIndex = 0;
      actionData.modalType = enumCartActionType.cityshield;
      actionData.data = null;
      (actionData.events = {
        handleCloseAction: () => this.handleCloseAction(),
        toggleCityShield: value => {
          this.setState({
            addedCityshield: value,
          });
          this.toggleCityShield(value);
        },
      }),
        this.setState({actionData});
    }
  };

  handleGSTSelect = () => {
    this.setState({
      isGstSelected: !this.state.isGstSelected,
      gstNumber: '',
      companyName: ''
    })
  }

  handleGSTNumberChange = (gstNumber) => {
    this.setState({
      gstNumber
    })
  }
  handleCompanyChange = (companyName) => {
    this.setState({
      companyName
    })
  }

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
      });
  };

  render() {
    const {
      detailData: {
        grand_total,
        available_cf_coins,
        city_shield,
        without_city_shield,
      },
      couponCode,
      remove,
      productData,
      allProduct,
      allOffer,
      actionData,
      addedCityshield,
      isCoinRedeemed,
      dataAfterCoinsApplied,
      fetchedData,
      detailData,
      isGstSelected,
      gstNumber,
      companyName,
    } = this.state;
    const cityShieldObj = addedCityshield ? city_shield : without_city_shield;

    let is_coupon_frp = true;
    productData.map(item => {
      if (item.is_frp) {
        is_coupon_frp = false;
        return true;
      } else {
        return false;
      }
    });
    let appUser = AppUser.getInstance();
    let Userid = appUser.userId;

    const remeedPoint = isCoinRedeemed
      ? dataAfterCoinsApplied.remain_wallet_amount
      : available_cf_coins
      ? available_cf_coins
      : 0;

    return (
      <View style={styles.mainContainer}>
        {this.renderHeader()}
        {this.renderAddress()}
        {productData && productData.length > 0 ? (
          <KeyboardAwareScrollView
            style={styles.flex1}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <View style={{marginTop: 0}}>
              {(Userid == '' || Userid == undefined) && (
                <View style={styles.loginContainer}>
                  <MaterialInput
                    label={resources.strings.EMAIL_OR_MOBILE}
                    value={this.state.emailOrMobile}
                    onChangeText={this.onChangeEmail}
                    error={renderInputError('email', this.state.error)}
                    errorKey={'email'}
                    callbackToRemoveError={this.callbackToRemoveError}
                    isGetOtpTextVisible={
                      this.state.isMobileLogin && this.state.isGetOtpTextVisible
                    }
                    onPressGetOtp={this.onPressGetOtp}
                    reference={this.emailRef}
                    inputProps={{
                      maxLength: this.state.isMobileLogin ? 10 : 100,
                      autoCaptialize: 'none',
                      returnKeyType: 'next',
                    }}
                    onSubmitEditing={this.focusToNext}
                    isBorderGetOtpThick={true}
                    isGetOtpClickable={this.state.isTimeVisible}
                  />
                </View>
              )}

              {this.state.isOtpSent && (
                <View style={styles.loginContainer}>
                  <MaterialInput
                    label={resources.strings.OTP}
                    value={this.state.otp}
                    onChangeText={this.onChangeOtp}
                    error={renderInputError('otp', this.state.error)}
                    errorKey={'otp'}
                    callbackToRemoveError={this.callbackToRemoveError}
                    isPassVisible={this.state.isPassVisible}
                    isVerifyText={
                      !this.state.emailFieldVisible &&
                      this.state.otp.length == 5
                    }
                    onPressVerifyOtp={this.onPressVerifyOtp}
                    reference={this.otpRef}
                    inputProps={{
                      keyboardType: 'phone-pad',
                      autoCaptialize: 'none',
                      maxLength: 5,
                      returnKeyType: 'done',
                      editable: true,
                    }}
                  />
                </View>
              )}

              {/* {Userid != '' &&
                (appUser.userDetails != undefined &&
                  appUser.userDetails.full_name == '') && (
                  <View style={styles.loginContainer}>
                    <MaterialInput
                      label={'Full Name *'}
                      value={this.state.newFullName}
                      onChangeText={this.onChangeNewFullName}
                      error={renderInputError('saveEmail', this.state.error)}
                      errorKey={'saveEmail'}
                      callbackToRemoveError={this.callbackToRemoveError}
                      // saveEmail={this.state.saveEmailButton}
                      // onSaveEmail={this.onSaveEmail}
                      reference={this.fullNameRef}
                      isBorderGetOtpThick={true}
                    />
                  </View>
                )} */}

              {/* {Userid == '' && ( */}
              {/* {(this.state.emailFieldVisible ||
                (Userid != '' &&
                  (appUser.userDetails != undefined &&
                    appUser.userDetails.email == ''))) && (
                <View style={styles.loginContainer}>
                  <MaterialInput
                    label={'Email *'}
                    value={this.state.updateEmail}
                    onChangeText={this.onChangeUpdateEmail}
                    error={renderInputError('saveEmail', this.state.error)}
                    errorKey={'saveEmail'}
                    callbackToRemoveError={this.callbackToRemoveError}
                    // saveEmail={this.state.saveEmailButton}
                    // onSaveEmail={this.onSaveEmail}
                    reference={this.saveEmailRef}
                    onSubmitEditing={this.focusToNext}
                    isBorderGetOtpThick={true}
                  />
                </View>
              )} */}

              {this.state.isTimeVisible && (
                <Text style={{alignSelf: 'center'}}>
                  00 :{' '}
                  {this.state.countDown > 10
                    ? this.state.countDown
                    : `0${this.state.countDown}`}
                </Text>
              )}

              {/* {(this.state.emailFieldVisible ||
                (Userid != '' &&
                  (appUser.userDetails != undefined &&
                    appUser.userDetails.email == '')) ||
                (Userid != '' &&
                  (appUser.userDetails != undefined &&
                    appUser.userDetails.full_name == ''))) && (
                <View>
                  <Button
                    btnStyle={[
                      styles.checkotBtnStyle,
                      {
                        marginTop: 0,
                        marginBottom: 0,
                        width: '90%',
                        alignSelf: 'center',
                      },
                    ]}
                    rounded
                    btnText={this.state.emailFieldVisible ? 'Login' : 'Save'}
                    onPress={
                      this.state.emailFieldVisible
                        ? this.onSaveEmail
                        : this.updateDetails
                    }
                  />
                </View>
              )} */}

              {this.state.productData != null &&
                this.state.productData.length > 0 && (
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={this.state.productData}
                    extraData={this.state.productData}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={
                      allProduct
                        ? this.renderProductCell
                        : this.render3ProductCell
                    }
                    ItemSeparatorComponent={() => (
                      <View style={styles.borderView} />
                    )}
                  />
                )}
              {allProduct ? (
                <View />
              ) : (
                <TouchableOpacity
                  style={{}}
                  onPress={() => this.showAllProduct()}>
                  {this.state.productData.length > 3 ? (
                    <Text style={styles.viewMoreText}>
                      {'View More Products'}
                    </Text>
                  ) : (
                    <View />
                  )}
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.borderView} />

            <CityShield
              addedCityshield={this.state.addedCityshield}
              handleCityshield={this.handleCityshield}
              fetchedData={this.state.fetchedData}
              checkoutOrderDetails={this.state.detailData}
            />

            {appUser.userDetails != undefined && Userid && (
              <View style={styles.borderView} />
            )}

            {appUser.userDetails != undefined &&
            Userid &&
            this.state.coupon_enabled ? (
              <View style={styles.couponContainer}>
                <Text style={styles.couponContainerTitle}>
                  {resources.strings.APPLY_CODE1}
                </Text>
                <View style={{marginHorizontal: 16, marginTop: 20}}>
                  <MyTextInput
                    value={couponCode}
                    editable={remove ? false : true}
                    onChangeText={couponCode =>
                      this.setState({couponCode: couponCode})
                    }
                    autoCaptialize={'none'}
                    autoCorrect={false}
                    autoFocus={false}
                    underlineColorAndroid={'transparent'}
                    placeholder={'Enter coupon code'}
                    rightButtonProps={{
                      text: 'APPLY',
                      onPress: () => {
                        productData && productData.length > 0
                          ? this.onPressRemoveCode(couponCode)
                          : this.noDataFound();
                      },
                      isShow: true,
                    }}
                  />
                </View>

                {remove ? (
                  <View style={styles.applyCoupenTextContainer}>
                  <Text style={styles.appliedText}>
                    {this.state.couponDescription}
                  </Text>
                  <TouchableOpacity style={styles.btnClose} onPress={() => this.onPressRemoveCode(this.state.couponCode)}>
                    <Image source={resources.images.img_clear_offer} style={{ height: 10, width: 10, tintColor: 'white'}}/>
                  </TouchableOpacity>
                </View>
                ) : (
                 <View />
                )}
                {this.render3OfferView()}

                <View style={styles.borderView} />
                <View style={{marginVertical: 15, marginHorizontal: 16}}>
                  <View style={styles.directionRow}>
                    <View style={styles.rowDirection}>
                      <View>
                        <Image
                          source={resources.images.inc_coin}
                          style={{width: 36, height: 36}}
                        />
                      </View>
                      <View style={{marginLeft: 10}}>
                        <Text
                          style={{
                            color: resources.colors.titleBlack,
                            fontSize: 18,
                            fontWeight: '500',
                            fontFamily: resources.fonts.medium,
                          }}>
                          Use Cityfurnish coins
                        </Text>
                        <Text
                          style={{
                            marginTop: 3,
                            color: resources.colors.gray_9A9AA2,
                            fontWeight: '400',
                            fontFamily: resources.fonts.regular,
                            fontSize: 14,
                          }}>
                          {`Available: ${remeedPoint}`}
                        </Text>
                      </View>
                    </View>
                    <View style={{justifyContent: 'center'}}>
                      <Switch
                        trackColor={{false: '#E3E1DC', true: '#2D9469'}}
                        thumbColor={'white'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={value => {
                          if (parseInt(remeedPoint) > 0) {
                            this.setState(
                              {coinEnabled: !this.state.coinEnabled},
                              () => {
                                if (value) {
                                  this.hitRedeemCoins(remeedPoint, true);
                                } else {
                                  this.hitRedeemCoins(0, false);
                                }
                              },
                            );
                          } else {
                            AppToast("You don't have Cityfurnish coins");
                          }
                        }}
                        value={this.state.coinEnabled}
                      />
                    </View>
                  </View>
                </View>
                {/* {this.state.couponData != null &&
                        this.state.couponData.length > 0 && (
                          <FlatList
                            style={{paddingBottom: 10}}
                            showsVerticalScrollIndicator={false}
                            data={this.state.couponData}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={this.render3OfferView}
                          />
                      )} */}

                {allOffer ? (
                  <View />
                ) : (
                  <TouchableOpacity
                    style={{}}
                    onPress={() => this.showAllOffer()}>
                    {this.state.couponData.length > 3 ? (
                      <Text style={styles.viewMoreText}>
                        {'View More Offer'}
                      </Text>
                    ) : (
                      <View />
                    )}
                  </TouchableOpacity>
                )}
                <View style={styles.borderView} />
              </View>
            ) : (
              <View />
            )}

            {this.renderOrderDeatail()}

            <View style={styles.borderView} />

            {this.renderPaymentOfferView()}

            <View style={styles.borderView} />

            <ThingsYouShouldComponents />

            <View style={styles.borderView} />
            <WhatsappNotificationComponent
              isEnableWhatsappNotification={
                this.state.whatappToggle
              }
              onChangeWhatsappNotification={this.onChangeWhatsappNotification}
            />
            <GSTComponent isGstSelected={isGstSelected} gstNumber={gstNumber} 
            handleGSTSelect={this.handleGSTSelect}
            handleGSTNumberChange={this.handleGSTNumberChange}
            handleCompanyChange={this.handleCompanyChange}
            companyName={companyName}
            />
            <View style={styles.borderView} />
            <Cityfurnish />

            <View style={styles.marginHorizontal}>
              {/* {appUser.userDetails != undefined &&
                appUser.userDetails.email != '' &&
                appUser.userDetails.full_name != '' &&
                Userid != '' &&
                Userid != undefined &&
                this.renderKycTextView()}
              {appUser.userDetails != undefined &&
                appUser.userDetails.email != '' &&
                appUser.userDetails.full_name != '' &&
                Userid != '' &&
                Userid != undefined && (
                  <Text style={styles.freeServiceText}>
                    {resources.strings.FREE_SERVICES}
                  </Text>
                )}
              {appUser.userDetails != undefined &&
              appUser.userDetails.email != '' &&
              appUser.userDetails.full_name != '' &&
              Userid != '' &&
              Userid != undefined ? (
                this.renderServices()
              ) : (
                <View style={styles.serviceCon} />
              )} */}
            </View>

            <View style={{height: 100}} />
          </KeyboardAwareScrollView>
        ) : this.state.isLoading == false && this.state.productData == '' ? (
          this.renderEmptyScreen()
        ) : (
          <View style={{marginTop: 40}}>
            <ActivityIndicator color={resources.colors.appBlue} />
          </View>
        )}
        {grand_total != undefined ? (
          <View style={styles.cartButtonContainer}>
            <View style={styles.footerStyle}>
              {/* <Button
                  btnStyle={styles.checkotBtnStyle}
                  rounded
                  btnText={'Event'}
                  onPress={async () =>
                    await analytics().logEvent('basket', {
                      id: 3745092,
                      item: 'mens grey t-shirt',
                      description: ['round neck', 'long sleeved'],
                      size: 'L',
                    })
                  }
                /> */}
              <Text style={styles.totalStyle}>
                {'₹ '}
                {this.getTotalPayable()}
              </Text>
              <Text style={styles.chooseDuration}>
                {'View detailed bill'}{' '}
                <Image
                  source={resources.images.img_right_icon}
                  style={{height: 15, width: 15, tintColor: '#257B57'}}
                />
              </Text>
            </View>
            <View style={{marginRight: 20}}>
              <Button
                btnStyle={styles.checkotBtnStyle}
                touchOpacityStyle={{}}
                rounded
                textStyle={{color: resources.colors.white}}
                btnText={resources.strings.proceed_to_pay}
                onPress={this.onClickProceedBtn}
              />
            </View>
          </View>
        ) : null}
        {actionData.show && (
          <BottomUpModal
            visibleModal={actionData.show}
            modalType={actionData.modalType}
            onPressBackDrop={this.handleCloseAction}
            data={actionData.data}
            events={actionData.events}
          />
        )}
      </View>
    );
  }
}

const mapStateToProps = state => {
  const {toScreenName} = state.skipLoginReducer;
  const {addressList} = state.addressReducer;
  return {toScreenName: toScreenName, addressList};
};
let container = connect(
  mapStateToProps,
  {
    ...actions,
    onUpdateCartBadgeCount,
    getEnabledPaymentInfo,
    hitSendOtpApi,
    onUpdateWishlistBadgeCount,
    updateFcmTokenToServer,
    hitRedeemCoinsApi,
    hitCartCheckout,
    hitCartCheckoutRazorpay,
    hitCartCheckoutRazorpaySuccess
  },
)(CartScreen);

let loader = APILoadingHOC(container);

loader.getIntent = () => {
  return {
    routeName: CartScreen.ROUTE_NAME,
  };
};

export default container;
