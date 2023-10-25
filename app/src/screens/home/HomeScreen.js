import React, {Component} from 'react';
import {
  View,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  Linking,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  SafeAreaView,
  ImageBackground,
} from 'react-native';

import {Dropdown} from 'react-native-material-dropdown';
import AppUser from '../../utility/AppUser';
import events from '../../utility/Events';
import HeaderWithLocation from '../../genriccomponents/header/HeaderWithLocation';
import HeaderWithChat from '../../genriccomponents/header/HeaderWithChat';
import OrderLabel from '../../genriccomponents/ribbon/OrderLabel';
import MaterialInput from '../../genriccomponents/input/MaterialInput';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import HorizontalBaannerImageView from '../../genriccomponents/productView/horizontalBannerImage/HorizontalBaannerImageView';
import resources from '../../../res';
import Modal from 'react-native-modal';
import styles from './styles';
import NetInfo from '@react-native-community/netinfo';
import {CategoriesView} from './views/CategoriesView';
import * as actions from '../../redux/actions/HomeAction';
import {hitAddressListingApi, setAddressList} from '../../redux/actions/AddressAction';
import {connect} from 'react-redux';
import Button from '../../genriccomponents/button/Button';
import {
  heightScale,
  isPlatformIOS,
  checkIfUserIsLoggedIn,
  myWidth,
  renderInputError,
  validateEmail,
} from '../../utility/Utils';
import ImageLoad from '../../genriccomponents/image/ImageLoad';
import AppToast from '../../genriccomponents/appToast/AppToast';
import ReviewComponent from '../../genriccomponents/productView/review/Review';
import {hitReviewListingApi} from '../../redux/actions/ProductDetailsAction';
import {hitInvoiceListingApi} from '../../redux/actions/InvoiceAction';
import {getViewOrderDetailApi} from '../../redux/actions/OrderAction';
import {
  hitFirstRunningOrderApi,
  hitChatBotQueryRequestApi,
} from '../../redux/actions/DocumentAction';
import {getCartDetailApi} from '../../redux/actions/CartAction';
import Icon from 'react-native-vector-icons/FontAwesome';
import SerchBox from './views/SerchBox';
import Rentfurniture from './views/Rentfurniture';
import Banner from './views/Banner';
import TrendingProduct from './views/TrendingProduct';
import HowItsWork from './views/HowItsWork';
import Cityfurnish from './views/Cityfurnish';
import UserTosay from './views/UserTosay';
import Support from './views/Support';
import Market from './views/Market';
import AsyncStorage from '@react-native-community/async-storage';

import ApiSingleton from '../../apimanager/ApiSingleton';
import ApiEndpoints,{ TRENDING_PRODUCT_API } from '../../apimanager/ApiEndpoint';
import { GET } from '../../apimanager/RequestMethods';
// import { LocalNotification, createChannelNotification } from '../../utility/LocalPushController'

// import messaging from '@react-native-firebase/messaging';
// import firebase from '@react-native-firebase/app';

const CREDIT_SCORE_REQUIRE = 0;
const KYC_REQUIRE = 1;
const AUTO_PAYMENT_REQUIRE = 2;

//kyc status
const KYC_IN_PROGRESS = 1;
const KYC_COMPLETE = 2;
const DELIVERY_SECHUDULE = 3;
const DELIVERED = 4;

//kyc state
const CREDIT_SCORE_STATE = 0;
const KYC_STATE = 1;
const AUTO_PAYMENT_STATE = 2;
const KYC_DOCS_UNDER_REVIEW_STATE = 3;

const NORMAL_PRODUCT_TYPE = 0;
const COMBO_PRODUCT_TYPE = 1;
const FRP_PRODUCT_TYPE = 2;

const LOAD_DATA_COUNT = 15;

class HomeScreen extends Component {
  static ROUTE_NAME = 'HomeScreen';
  constructor(props) {
    super(props);
    this.state = {
      activeIndexHorizontal: 0,
      isDone: false,
      currentSeletcedCity: '',
      serverData: {},
      isLoading: true,
      reviewData: [],
      activeIndex: 0,
      total_outstanding_amount: 0,
      coins_amount: 0,
      invoiceFlag: false,
      loggedIn: false,
      serviceRequestFlag: false,
      cartItemFlag: false,
      runningOrderList: {},
      showChatBot: false,
      isLoadingModal: false,
      firstName: '',
      chatName: '',
      chatMobile: '',
      chatEmail: '',
      chatDealCodeNumber: '',
      chatQuery: '',
      error: {},
      step1: true,
      step2: false,
      step3: false,
      productData: [],
      detailData: [],
      allProduct: false,
      selectedOrderId: '',
      orderRequestArr: [],
      selectedOrderDetails: {},
      homePageData : null,
      safety: [
        {
          id: '01',
          step: 'Sanitized Furniture and Appliances',
          desc:
            'Proper sanitization of our product is done before & after packing',
          img: resources.images.img_safety02,
        },
        {
          id: '02',
          step: 'Safe Delivery and Pickup',
          desc: 'Temp checks and protection gear is provided to the team',
          img: resources.images.img_safety03,
        },
        {
          id: '03',
          step: 'Safe & Hygienic Fulfillment Centers',
          desc: 'WHO safety guidelines are followed in our fulfillment centers',
          img: resources.images.img_safety04,
        },
        {
          id: '04',
          step: 'Contact Tracing',
          desc: 'Our team has Arogya Setu app for better safety and protection',
          img: resources.images.img_safety05,
        },
      ],
      benefits: [
        {
          id: '01',
          step: 'Free \n Delivery',
          img: resources.images.img_profit01,
        },
        {
          id: '02',
          step: 'Free \n Installation',
          img: resources.images.img_profit02,
        },
        {
          id: '03',
          step: 'Free \n Relocation',
          img: resources.images.img_profit05,
        },
        {
          id: '04',
          step: 'Mint \n Condition',
          img: resources.images.img_profit04,
        },
      ],
    };
    this.chatNameRef = React.createRef();
    this.chatMobileRef = React.createRef();
    this.chatEmailRef = React.createRef();
    this.chatDealCodeNumberRef = React.createRef();

    this.pageNumber = 1;
    this.showNotification = true;
    this.reviewRef = React.createRef();
    this.carouselRef = React.createRef();
  }

  renderHeader = () => {
    return (
      <HeaderWithLocation
        headerTitle={this.state.currentSeletcedCity}
        appLogoVisible={true}
        isBackIconVisible={false}
        isLogoutVisible={false}
        navigateProps={this.props.navigation}
        onClickLocation={this.onClickLocation}
      />
    );
  };

  onChatBotBackClick = () => {
    this.setState({
      step1: true,
      step2: false,
      step3: false,
    });
  };
  renderChatHeader = () => {
    return (
      <HeaderWithChat
        headerTitle={this.state.currentSeletcedCity}
        appLogoVisible={this.state.step2 || this.state.step3 ? false : true}
        isBackIconVisible={this.state.step2 || this.state.step3 ? true : false}
        isLogoutVisible={false}
        onBackClick={() => {
          this.state.step2 || this.state.step3
            ? this.onChatBotBackClick()
            : null;
        }}
        chatBotCloseModal={this.chatBotCloseModal}
      />
    );
  };

  onClickLocation = () => {
    this.checkInternetAndGotoScreenWithParams('SelectCityScreen', {
      fromRoute: 'HomeScreen',
      callback: this.onChangeCity,
    });
  };

  getReview = () => {
    this.props
      .hitReviewListingApi(8, 0)
      .then(data => {
        this.setState({reviewData: [...this.state.reviewData, ...data.data]});
      })
      .catch(error => {
        console.log(' error', error);
        // this.setState({ isPaginating: false })
      });
  };

  checkInternetAndGotoScreenWithParams = (screen, params) => {
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        return;
      } else {
        this.props.navigation.navigate(screen, params);
      }
    });
  };

  

  onChangeCity = city => {
    this.setState({
      currentSeletcedCity: city,
    });
  };




  componentDidMount() {
    let obj = AppUser.getInstance();
    let event = obj.emitterInst;
    // event.setMaxListeners(1)
    event.on(events.MOVE_TO_CART, () => {
      this.props.navigation.navigate('Cart');
    });
    this.fetchHomeData();
    this.props.navigation.addListener('focus', () => this.componentDidFocus());
    this.getReview();
    // this.notficationData = obj.notif

    // check User loggedIn for Invoice Due
    if (checkIfUserIsLoggedIn()) {
      this.setState({loggedIn: true});
      let userDetails = AppUser.getInstance().userDetails;
      if (userDetails) {
        this.setState({
          firstName: userDetails.full_name,
          chatName: userDetails.full_name,
          chatEmail: userDetails.email,
          chatMobile: userDetails.mobile_number,
        });
      }
      this.loadRunningOrders();
      this.loadcartData();
      this.loadInvoiceDueInitially();
    }

    this.interval = setInterval(() => {
      this.moveCustomerSaysToFirstIndex();
    }, 800);
    this.getMyAddress()
  }

  getMyAddress = () => {
    this.props
        .hitAddressListingApi(0, 100)
        .then(data => {
          this.props.setAddressList(data.data)
        })
        .catch(error => {
          this.setState({
            isLoading: false,
          });
          //   console.log('error inside list address', error);
        });
  }

  onRefresh = async () => {
    this.setState({isLoading: true});
    if (checkIfUserIsLoggedIn()) {
      this.setState({loggedIn: true});
      let userDetails = AppUser.getInstance().userDetails;
      if (userDetails) {
        this.setState({
          firstName: userDetails.full_name,
          chatName: userDetails.full_name,
          chatEmail: userDetails.email,
          chatMobile: userDetails.mobile_number,
        });
      }
      await this.loadRunningOrders();
      await this.loadcartData();
      await this.loadInvoiceDueInitially();
    }
    setTimeout(() => {
      this.setState({isLoading: false});
    }, 500);
  };

  loadcartData = () => {
    this.props
      .getCartDetailApi()
      .then(data => {
        this.setState({
          productData: data.data.products,
          detailData: data.data,
          cartItemFlag: true,
          // allProduct: false,
        });
      })
      .catch(error => {
        console.log(error, 'error');
      });
  };

  loadRunningOrders = () => {
    this.props
      .hitFirstRunningOrderApi()
      .then(data => {
        if (data.data.length > 0) {
          let serviceRequest = data.data;
          this.setState({
            orderRequestArr: data.data,
            selectedOrderId: serviceRequest[0].dealCodeNumber,
            runningOrderList: serviceRequest[0],
            serviceRequestFlag: true,
          });
        }
      })
      .catch(error => {
        this.setState({serviceRequestFlag: false});
        console.log(error);
      });
  };

  loadInvoiceDueInitially = () => {
    this.props
      .hitInvoiceListingApi(this.pageNumber, LOAD_DATA_COUNT)
      .then(data => {
        this.setState({
          total_outstanding_amount: data.data.total_outstanding_amount,
          coins_amount: data.data.coins_amount,
          isLoading: false,
          invoiceFlag: data.data.total_outstanding_amount > 0 ? true : false,
        });
      })
      .catch(err => {
        this.setState({
          isLoading: false,
          invoiceFlag: false,
        });
        console.log(err);
      });
  };

  moveCustomerSaysToFirstIndex = () => {
    if (this.reviewRef && this.reviewRef.current) {
      this.reviewRef.current.snapToItem(1, true, true);
      clearInterval(this.interval);
    }
  };

  componentDidFocus = () => {
    // StatusBar.setBarStyle('dark-content');
    // StatusBar.setBackgroundColor(resources.colors.appColor);
    let city = AppUser.getInstance().selectedCityName;
    this.setState({
      currentSeletcedCity: city,
    });
  };

  fetchHomeData = async () => {
    this.props
      .hitGetHomeScreenData()
      .then(async (resp) => {
        this.setState({
          serverData: resp.data,
          isLoading: false,
        });
        
          await AsyncStorage.setItem(
            'HomePageData',
            JSON.stringify(resp.data),
          );
        
      })
      .catch(err => {
        this.setState({
          isLoading: false,
        });
        console.log('Error while fetching home data', err);
      });
  };

  payNowCartScreen = () => {
    this.props.navigation.navigate('Cart');
  };

  payNowAllOutStandingMoney = () => {
    // createChannelNotification();
    // LocalNotification('Cityfurnish002', 'CityMax : Rent Max, Pay Less!', 'https://rentofurniture.com/images/Artboard4copy21.png', 'Are you ready for a bomb drop? Launching CityMAX, get upto 15 products at INR 3999/- only!', 'Complete Furnishing Plan for Home', 'https://rentofurniture.com/images/Artboard4copy21.png', 'high', 'CityMax : Rent Max, Pay Less!', 'Are you ready for a bomb drop? Launching CityMAX, get upto 15 products at INR 3999/- only!', '');
    this.props.navigation.navigate('PayOutstandingScreen', {
      invoiceId: '',
      callback: this.onPaymentSuccess,
      outstandingAmount: this.state.total_outstanding_amount,
      coinsAmount: this.state.coins_amount,
    });
  };
  onPaymentSuccess = () => {
    this.props.navigation.navigate('InvoiceScreen');
  };

  safetyAllSteps = () => {
    const {safety} = this.state;
    return (
      <FlatList
        // style={{ marginTop: 10 }}
        data={safety}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={this.renderSafetySteps}
      />
    );
  };
  renderSafetySteps = ({item, index}) => {
    return (
      <View style={[styles.corporateCardContainer]}>
        <View
          style={{
            height: 110,
            width: 120,
            resizeMode: 'cover',
          }}>
          <ImageLoad
            style={styles.productImageStyle}
            topLeftBorderRadius={6}
            bottomLeftBorderRadius={6}
            customImagePlaceholderDefaultStyle={{
              borderTopLeftRadius: 6,
              borderBottomLeftRadius: 6,
            }}
            source={item.img ? item.img : resources.images.img_placeholer_small}
            resizeMode={'cover'}
          />
        </View>
        <View style={{flex: 1, marginHorizontal: 7, borderWidth: 0}}>
          <Text style={[styles.nameTextStyle, {borderWidth: 0}]}>
            {item.step}
          </Text>
          <Text style={[styles.descTextStyle]}>
            {item.desc ? item.desc : ''}
          </Text>
        </View>
      </View>
    );
  };

  benefitsAllSteps = () => {
    const {benefits} = this.state;
    return (
      <FlatList
        // style={{ marginTop: 10 }}
        data={benefits}
        keyExtractor={(item, index) => index.toString()}
        numColumns={4}
        renderItem={this.renderSteps}
        showsVerticalScrollIndicator={false}
      />
    );
  };
  renderSteps = ({item, index}) => {
    return (
      <React.Fragment>
        <View style={styles.viewUpperStep}>
          <View style={styles.viewStep}>
            <Image
              source={item.img}
              resizeMode={'contain'}
              style={styles.imageStep}
            />
          </View>
          <Text style={styles.textStep}>{item.step}</Text>
        </View>
      </React.Fragment>
    );
  };

  raisedQueryRequest = () => {
    if (checkIfUserIsLoggedIn()) {
      let userDetails = AppUser.getInstance().userDetails;
      if (userDetails) {
        this.setState({
          chatName: userDetails.full_name,
          chatEmail: userDetails.email,
          chatMobile: userDetails.mobile_number,
        });
      }
    }
    this.setState({
      step1: false,
      step2: true,
      step3: false,
      error: {},
    });
  };
  raisedOrderRequest = async () => {
    if (checkIfUserIsLoggedIn()) {
      if (!this.state.serviceRequestFlag) {
        await this.loadRunningOrders();
      }
      this.setState({
        step1: false,
        step2: false,
        step3: true,
        error: {},
      });
    } else {
      AppToast('You need to Login to access this feature.');
    }
  };
  viewOrder = orderId => {
    this.props.navigation.navigate('ViewOrder', {
      orderId: orderId,
    });
  };
  manageOrder = orderId => {
    // this.props.navigation.navigate('ManageOrderScreen', {
    //   orderId: orderId,
    // });
     this.props.navigation.navigate('MyOrder', {
      orderId: orderId,
    });
  };
  manageServiceRequest = orderId => {
    this.chatBotCloseModal();
    setTimeout(() => {
      this.props.navigation.navigate('ManageOrderScreen', {
        orderId: orderId,
      });
    }, 500);
  };

  statusResponse = item => {
    if (item.kyc_status == KYC_IN_PROGRESS) {
      if (item.state == CREDIT_SCORE_STATE) {
        return resources.strings.CREDIT_SCORE_STATE;
      } else if (item.state == KYC_STATE) {
        return resources.strings.KYC_STATE;
      } else if (item.state == AUTO_PAYMENT_STATE) {
        return resources.strings.AUTO_PAYMENT_STATE;
      } else if (item.state == KYC_DOCS_UNDER_REVIEW_STATE) {
        return resources.strings.KYC_DOCS_UNDER_REVIEW_STATE;
      } else {
        return resources.strings.KYC_STATE;
      }
    }
    if (item.kyc_status == KYC_COMPLETE) {
      return resources.strings.KYC_COMPLETE;
    }
    if (item.kyc_status == DELIVERY_SECHUDULE) {
      return resources.strings.DELIVERY_SECHUDULE;
    }
    if (item.kyc_status == DELIVERED) {
      return resources.strings.DELIVERED;
    }
  };
  FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: resources.colors.sepratorWhite,
        }}
      />
    );
  };

  toggleChatBot = () => {
    this.setState({
      showChatBot: !this.state.showChatBot,
      step1: true,
      step2: false,
      step3: false,
    });
  };
  chatBotCloseModal = () => {
    this.setState({
      showChatBot: false,
      step1: false,
      step2: false,
      step3: false,
    });
  };

  focusToNext = ref => {
    focusTo(ref);
  };
  onChangeName = text => {
    this.setState({chatName: text});
  };
  onChangeMobileNumber = text => {
    this.setState({chatMobile: text});
  };
  onChangeEmail = text => {
    this.setState({chatEmail: text});
  };
  onChangeDealCodeNumber = text => {
    this.setState({chatDealCodeNumber: text});
  };
  onChangeQuery = text => {
    this.setState({chatQuery: text});
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

  submitServiceRequest = () => {
    const isValid = this.validate();
    if (!isValid) {
      return;
    }
    this.setState({isLoadingModal: true});
    const {
      chatName,
      chatMobile,
      chatEmail,
      chatDealCodeNumber,
      chatQuery,
    } = this.state;
    this.props
      .hitChatBotQueryRequestApi(
        chatName,
        chatMobile,
        chatEmail,
        chatDealCodeNumber,
        chatQuery,
      )
      .then(resp => {
        console.log('chatresp', resp);
        if (resp.status) {
          this.setState({
            isLoadingModal: false,
            chatName: '',
            chatEmail: '',
            chatMobile: '',
            chatDealCodeNumber: '',
            chatQuery: '',
          });
          this.chatBotCloseModal();
          AppToast(
            'Thanks! you have Successfully Submited Your Request. Will come back to you.',
          );
        } else {
          this.setState({
            isLoadingModal: false,
          });
          AppToast(resp.message);
        }
      })
      .catch(error => {
        this.setState({isLoadingModal: false});
        AppToast('Error while submitting');
      });
  };
  validate = () => {
    const {
      chatName,
      chatMobile,
      chatEmail,
      chatDealCodeNumber,
      chatQuery,
    } = this.state;

    let errorObject = {};
    if (chatName.trim() == '') {
      errorObject.chatNameErr = resources.strings.nameCannotBeEmpty;
    } else if (chatName.length > 20) {
      errorObject.chatNameErr = resources.strings.name20length;
    } else if (chatName.length <= 1) {
      errorObject.chatNameErr = resources.strings.name2length;
    }
    if (chatEmail.trim() == '') {
      errorObject.chatEmailErr = resources.strings.emailCannotBeEmpty;
    } else if (chatEmail.trim().length > 100) {
      errorObject.chatEmailErr = resources.strings.email100length;
    } else if (!validateEmail(chatEmail.trim())) {
      errorObject.chatEmailErr = resources.strings.enterValidEmail;
    }

    if (chatMobile.trim() == '') {
      errorObject.chatMobileErr = 'Mobile Field is empty';
    }

    this.setState({error: errorObject});
    return Object.keys(errorObject).length == 0;
  };

  showAllProduct = () => {
    const {allProduct} = this.state;
    this.setState({allProduct: !allProduct});
  };
  renderProductCell = ({item, index}) => {
    // const isTrue = true;
    return (
      <View style={{flex: 1, marginHorizontal: 0}}>
        <View style={[item.is_frp ? styles.frpViewCard : '']}>
          <View
            style={[item.is_frp ? styles.frpImageViewCard : styles.viewCard]}>
            <ImageLoad
              style={[item.is_frp ? styles.frpImageStyle : styles.imageStyle]}
              topLeftBorderRadius={6}
              borderBottomLeftRadius={6}
              customImagePlaceholderDefaultStyle={{
                borderTopLeftRadius: 6,
                borderBottomLeftRadius: 6,
              }}
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
                    numberOfLines={1}>
                    {item.product_name}
                  </Text>
                </View>
              </View>
              <View style={[styles.valuesContainer, {borderWidth: 0}]}>
                <View style={{width: '60%', borderWidth: 0}}>
                  <Text style={styles.subTitleName}>{'Quantity'}</Text>
                  <Text style={styles.subTitleName}>
                    {item.rental_freq ? item.rental_freq + ' Rental' : ''}
                  </Text>
                  <Text style={styles.subTitleName}>
                    {'Refundable Deposit'}
                  </Text>
                  {item.is_frp ? (
                    <Text style={styles.subTitleName}>
                      {item.rental_freq
                        ? 'Net ' + item.rental_freq + ' Rental'
                        : ''}
                    </Text>
                  ) : (
                    <View />
                  )}
                  {item.is_frp ? (
                    <Text style={styles.subTitleName}>{'Additional Rent'}</Text>
                  ) : (
                    <View />
                  )}
                  {item.is_frp ? (
                    <Text style={styles.subTitleName}>{'Included Items'}</Text>
                  ) : (
                    <View />
                  )}
                </View>
                <View
                  style={{width: '3%', borderWidth: 0, marginHorizontal: 5}}>
                  <Text style={styles.subTitleName}>{':'}</Text>
                  <Text style={styles.subTitleName}>{':'}</Text>
                  <Text style={styles.subTitleName}>{':'}</Text>
                  {item.is_frp ? (
                    <Text style={styles.subTitleName}>{':'}</Text>
                  ) : (
                    <View />
                  )}
                  {item.is_frp ? (
                    <Text style={styles.subTitleName}>{':'}</Text>
                  ) : (
                    <View />
                  )}
                  {item.is_frp ? (
                    <Text style={styles.subTitleName}>{':'}</Text>
                  ) : (
                    <View />
                  )}
                </View>
                <View style={{width: '37%', borderWidth: 0}}>
                  <Text style={styles.subTitleName}>
                    {item.quantity ? item.quantity : ''} {'Item'}
                  </Text>
                  <Text style={styles.subTitleName}>
                    ₹ {item.price ? item.price : ''}
                  </Text>
                  <Text style={styles.subTitleName}>
                    ₹{' '}
                    {item.product_shipping_cost
                      ? item.product_shipping_cost
                      : ''}
                  </Text>
                  {item.is_frp ? (
                    <Text style={styles.subTitleName}>
                      ₹ {item.net_rent ? item.net_rent : ''}
                    </Text>
                  ) : (
                    <View />
                  )}
                  {item.is_frp ? (
                    <Text style={styles.subTitleName}>
                      ₹ {item.upgrades_rent ? item.upgrades_rent : ''}
                    </Text>
                  ) : (
                    <View />
                  )}
                  {item.is_frp ? (
                    <Text style={styles.subTitleName}>
                      {item.included_items.length
                        ? item.included_items.length
                        : ''}
                    </Text>
                  ) : (
                    <View />
                  )}
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };
  render3ProductCell = ({item, index}) => {
    if (index <= 2)
      return (
        <View style={{flex: 1, marginHorizontal: 0}}>
          <View style={[item.is_frp ? styles.frpViewCard : '']}>
            <View
              style={[item.is_frp ? styles.frpImageViewCard : styles.viewCard]}>
              <ImageLoad
                style={[item.is_frp ? styles.frpImageStyle : styles.imageStyle]}
                topLeftBorderRadius={6}
                borderBottomLeftRadius={6}
                customImagePlaceholderDefaultStyle={{
                  borderTopLeftRadius: 6,
                  borderBottomLeftRadius: 6,
                }}
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
                      numberOfLines={1}>
                      {item.product_name}
                    </Text>
                  </View>
                </View>
                <View style={[styles.valuesContainer, {borderWidth: 0}]}>
                  <View style={{width: '60%', borderWidth: 0}}>
                    <Text numberOfLines={1} style={styles.subTitleName}>
                      {'Quantity'}
                    </Text>
                    <Text numberOfLines={1} style={styles.subTitleName}>
                      {item.rental_freq ? item.rental_freq + ' Rental' : ''}
                    </Text>
                    <Text numberOfLines={1} style={styles.subTitleName}>
                      {'Refundable Deposit'}
                    </Text>
                    {item.is_frp ? (
                      <Text numberOfLines={1} style={styles.subTitleName}>
                        {item.rental_freq
                          ? 'Net ' + item.rental_freq + ' Rental'
                          : ''}
                      </Text>
                    ) : (
                      <View />
                    )}
                    {item.is_frp ? (
                      <Text numberOfLines={1} style={styles.subTitleName}>
                        {'Upgrade Rent'}
                      </Text>
                    ) : (
                      <View />
                    )}
                    {item.is_frp ? (
                      <Text numberOfLines={1} style={styles.subTitleName}>
                        {'Included Items'}
                      </Text>
                    ) : (
                      <View />
                    )}
                  </View>
                  <View
                    style={{width: '3%', borderWidth: 0, marginHorizontal: 5}}>
                    <Text style={styles.subTitleName}>{':'}</Text>
                    <Text style={styles.subTitleName}>{':'}</Text>
                    <Text style={styles.subTitleName}>{':'}</Text>
                    {item.is_frp ? (
                      <Text style={styles.subTitleName}>{':'}</Text>
                    ) : (
                      <View />
                    )}
                    {item.is_frp ? (
                      <Text style={styles.subTitleName}>{':'}</Text>
                    ) : (
                      <View />
                    )}
                    {item.is_frp ? (
                      <Text style={styles.subTitleName}>{':'}</Text>
                    ) : (
                      <View />
                    )}
                  </View>
                  <View style={{width: '37%', borderWidth: 0}}>
                    <Text style={styles.subTitleName}>
                      {item.quantity ? item.quantity : ''} {'Item'}
                    </Text>
                    <Text style={styles.subTitleName}>
                      ₹ {item.price ? item.price : ''}
                    </Text>
                    <Text style={styles.subTitleName}>
                      ₹{' '}
                      {item.product_shipping_cost
                        ? item.product_shipping_cost
                        : ''}
                    </Text>
                    {item.is_frp ? (
                      <Text style={styles.subTitleName}>
                        ₹ {item.net_rent ? item.net_rent : ''}
                      </Text>
                    ) : (
                      <View />
                    )}
                    {item.is_frp ? (
                      <Text style={styles.subTitleName}>
                        ₹ {item.upgrades_rent ? item.upgrades_rent : ''}
                      </Text>
                    ) : (
                      <View />
                    )}
                    {item.is_frp ? (
                      <Text style={styles.subTitleName}>
                        {item.included_items.length
                          ? item.included_items.length
                          : ''}
                      </Text>
                    ) : (
                      <View />
                    )}
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      );
  };

  onSelectOrderRequest = (value, index) => {
    console.log('orderId', value);
    this.setState({
      selectedOrderId: value,
      isLoadingModal: true,
    });
    this.props
      .getViewOrderDetailApi(value)
      .then(data => {
        this.setState({
          selectedOrderDetails: data.data,
          isLoadingModal: false,
        });
      })
      .catch(error => {
        console.log('error', error);
        this.setState({
          isLoadingModal: false,
        });
      });
  };

  setHomePageData = (data) => {
    this.setState({
      homePageData : data
    })
  }

  render() {
    const {
      isLoading,
      serverData,
      firstName,
      total_outstanding_amount,
      invoiceFlag,
      loggedIn,
      serviceRequestFlag,
      runningOrderList,
      cartItemFlag,
      detailData,
      allProduct,
      showChatBot,
      step1,
      step2,
      step3,
      chatName,
      chatMobile,
      chatEmail,
      chatDealCodeNumber,
      chatQuery,
      selectedOrderId,
      orderRequestArr,
      selectedOrderDetails,
      error,
    } = this.state;
    const {grand_total} = detailData;

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: "#F7F7F8",marginTop:0}}>
        {this.renderHeader()}
        {/* <StatusBar backgroundColor={'transparent'} barStyle={'dark-content'} /> */}
        {!isLoading ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={() => this.onRefresh()}
              />
            }>
            <Modal
              isVisible={this.state.showChatBot}
              // onBackButtonPress={this.chatBotCloseModal}
              style={styles.chatBotView}
              transparent={true}
              // onRequestClose={() => {this.chatBotCloseModal()}}
            >
              <View style={styles.chatBotfullScreenModal}>
                {this.renderChatHeader()}
                <View style={styles.actionOnChat}>
                  <ScrollView
                    style={step2 && {height: isPlatformIOS ? 375 : 390}}
                    showsVerticalScrollIndicator={false}>
                    <Text
                      style={styles.chatInfo}
                      numberOfLines={isPlatformIOS ? 3 : 2}
                      ellipsizeMode="tail">
                      {
                        'Please raised query to know your Service Request, Order Status and many more'
                      }
                    </Text>
                    {step1 && (
                      <View style={styles.step1}>
                        {/* <Button
                                                btnStyle={styles.buttonChatBotStyle}
                                                touchOpacityStyle={{}}
                                                rounded 
                                                btnText={'Raised Query Request'}
                                                onPress={()=> this.raisedQueryRequest()} /> */}

                        <TouchableOpacity
                          style={styles.chatMain}
                          onPress={() => this.raisedQueryRequest()}>
                          <React.Fragment>
                            <View style={{flexDirection: 'row'}}>
                              <Text style={[styles.chatBtn]}>
                                {'Need help to raised Query? Open Request'}
                              </Text>
                              {/* <Icon name="chevron-circle-right" size={14} color={resources.colors.charcoalGrey} type="ionicon" /> */}
                            </View>
                          </React.Fragment>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.chatMain}
                          onPress={() => this.raisedOrderRequest()}>
                          <React.Fragment>
                            <View style={{flexDirection: 'row'}}>
                              <Text style={[styles.chatBtn]}>
                                {'Need help to your order status? - View Order'}
                              </Text>
                              {/* <Icon name="chevron-circle-right" size={14} color={resources.colors.charcoalGrey} type="ionicon" /> */}
                            </View>
                          </React.Fragment>
                        </TouchableOpacity>
                      </View>
                    )}
                    {step2 && (
                      <View style={styles.step2}>
                        {this.state.isLoadingModal ? (
                          <View style={styles.containerLoaderStyle}>
                            <ActivityIndicator
                              size="large"
                              color={resources.colors.appColor}
                            />
                          </View>
                        ) : (
                          <React.Fragment>
                            <View style={styles.step2Container}>
                              <MaterialInput
                                style={{height: 36}}
                                label={resources.strings.ENTER_FULL_NAME}
                                value={chatName}
                                onChangeText={this.onChangeName}
                                error={renderInputError('chatNameErr', error)}
                                errorKey={'chatNameErr'}
                                callbackToRemoveError={
                                  this.callbackToRemoveError
                                }
                                inputProps={{
                                  returnKeyType: 'next',
                                  maxLength: 20,
                                }}
                                height={true}
                                onSubmitEditing={() =>
                                  this.focusToNext(this.chatMobileRef)
                                }
                              />
                              <MaterialInput
                                style={{height: 36}}
                                label={resources.strings.ENTER_MOBILE_NO}
                                onChangeText={this.onChangeMobileNumber}
                                value={chatMobile}
                                error={renderInputError('chatMobileErr', error)}
                                errorKey={'chatMobileErr'}
                                callbackToRemoveError={
                                  this.callbackToRemoveError
                                }
                                inputProps={{
                                  keyboardType: 'phone-pad',
                                  autoCaptialize: 'none',
                                  maxLength: 10,
                                  returnKeyType: 'done',
                                }}
                                height={true}
                                reference={this.chatMobileRef}
                                onSubmitEditing={() =>
                                  this.focusToNext(this.chatEmailRef)
                                }
                              />
                              <MaterialInput
                                style={{height: 36}}
                                label={resources.strings.ENTER_EMAIL}
                                onChangeText={this.onChangeEmail}
                                value={chatEmail}
                                error={renderInputError('chatEmailErr', error)}
                                errorKey={'chatEmailErr'}
                                callbackToRemoveError={
                                  this.callbackToRemoveError
                                }
                                inputProps={{
                                  keyboardType: 'email-address',
                                  autoCaptialize: 'none',
                                  maxLength: 50,
                                  returnKeyType: 'next',
                                }}
                                height={true}
                                reference={this.chatMobileRef}
                                onSubmitEditing={() =>
                                  this.focusToNext(this.chatDealCodeNumberRef)
                                }
                              />
                              <MaterialInput
                                style={{height: 36}}
                                label={resources.strings.ENTER_DEALCODE_NUMBER}
                                onChangeText={this.onChangeDealCodeNumber}
                                value={chatDealCodeNumber}
                                error={renderInputError(
                                  'chatDealCodeNumberErr',
                                  error,
                                )}
                                errorKey={'chatDealCodeNumberErr'}
                                callbackToRemoveError={
                                  this.callbackToRemoveError
                                }
                                inputProps={{
                                  keyboardType: 'email-address',
                                  autoCaptialize: 'none',
                                  maxLength: 50,
                                  returnKeyType: 'next',
                                }}
                                height={true}
                                reference={this.chatEmailRef}
                                onSubmitEditing={() =>
                                  this.focusToNext(this.chatQueryRef)
                                }
                              />
                              <MaterialInput
                                style={{height: 36}}
                                label={'Enter Query'}
                                onChangeText={this.onChangeQuery}
                                value={chatQuery}
                                inputProps={{
                                  maxLength: 50,
                                  returnKeyType: 'next',
                                }}
                                height={true}
                              />
                            </View>
                            <View style={styles.submitBtn}>
                              <Button
                                btnStyle={styles.buttonChatBotStyle}
                                touchOpacityStyle={{}}
                                rounded
                                btnText={resources.strings.SUBMIT}
                                onPress={() => {
                                  this.submitServiceRequest();
                                }}
                              />
                            </View>
                          </React.Fragment>
                        )}
                      </View>
                    )}
                    {step3 && (
                      <View style={styles.step3}>
                        {runningOrderList &&
                        runningOrderList != null &&
                        serviceRequestFlag ? (
                          <View style={styles.step3Main}>
                            <View
                              style={{
                                marginTop: 0,
                                alignItems: 'center',
                                alignContent: 'center',
                                alignSelf: 'center',
                              }}>
                              <View style={{width: 180}}>
                                <Dropdown
                                  animationDuration={1}
                                  rippleDuration={1}
                                  onChangeText={(value, index) => {
                                    this.onSelectOrderRequest(value, index);
                                  }}
                                  data={orderRequestArr.map(item => {
                                    return {value: item.dealCodeNumber};
                                  })}
                                  value={selectedOrderId}
                                  dropdownPosition={-4}
                                  renderBase={props => (
                                    <MaterialInput
                                      isDropDownImageVisible={true}
                                      label={resources.strings.ORDER_ID}
                                      value={selectedOrderId}
                                      inputProps={{
                                        editable: false,
                                      }}
                                    />
                                  )}
                                />
                              </View>
                              {this.state.isLoadingModal ? (
                                <View style={{}}>
                                  <ActivityIndicator
                                    size="large"
                                    color={resources.colors.appColor}
                                  />
                                </View>
                              ) : (
                                <Text style={styles.chatStep3Text}>
                                  {`Status of your order # ${
                                    // selectedOrderDetails && selectedOrderDetails.order_id && selectedOrderDetails.order_id != "" ? selectedOrderDetails.order_id : runningOrderList.dealCodeNumber
                                    selectedOrderId
                                  } placed on ${
                                    selectedOrderDetails &&
                                    selectedOrderDetails.order_date &&
                                    selectedOrderDetails.order_date != ''
                                      ? selectedOrderDetails.order_date
                                      : runningOrderList.created
                                  } is "${this.statusResponse(
                                    runningOrderList,
                                  )}"`}
                                </Text>
                              )}
                            </View>
                            <View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  marginTop: 15,
                                }}>
                                <View style={styles.submitBtn}>
                                  <Button
                                    btnStyle={styles.buttonChatBotStyle}
                                    touchOpacityStyle={{}}
                                    rounded
                                    btnText={'Service Request'}
                                    onPress={() => {
                                      this.manageServiceRequest(
                                        selectedOrderId,
                                      );
                                    }}
                                  />
                                </View>
                              </View>
                            </View>
                          </View>
                        ) : (
                          <View style={styles.containerLoaderStyle}>
                            <ActivityIndicator
                              size="large"
                              color={resources.colors.appColor}
                            />
                          </View>
                        )}
                      </View>
                    )}
                  </ScrollView>
                </View>
              </View>
            </Modal>
            {'topBanner' in serverData && (
              <View style={styles.topBanner}>
                {this.renderTopBannerViewWithBGImage()}
              </View>
            )}

            {'ribbonBanner' in serverData &&
            serverData.ribbonBanner.show_flag ? (
              <View style={styles.topRibbonBanner}>
                <View style={styles.topRibbonContainer}>
                  <Text
                    style={styles.ribbonName}
                    numberOfLines={2}
                    ellipsizeMode="tail">
                    {serverData.ribbonBanner.show_message}
                  </Text>
                </View>
              </View>
            ) : null}

            

            {/* <CategoriesView
              serverData={serverData.categories}
              onPressItem={this.onPressCategory}
            /> */}

            {/* {invoiceFlag && <View style={styles.InvoiceDue}>    
                            <View style={styles.buttonContainer}>
                                <View style={styles.footerStyle}>
                                    <Text style={styles.totalText}>{resources.strings.Total_InvoiceDue}</Text>
                                    <Text style={styles.totalValue}>₹ {total_outstanding_amount}/-</Text>
                                    <Button
                                        btnStyle={[styles.buttonStyle,
                                        {
                                            backgroundColor: invoiceFlag ?
                                                resources.colors.appColor :
                                                resources.colors.greyLight,
                                        }]}
                                        touchOpacityStyle={{}}
                                        rounded
                                        disableTouch={
                                            invoiceFlag ?
                                                false :
                                                true
                                        }
                                        btnText={resources.strings.Pay_Now}
                                        onPress={() => this.payNowAllOutStandingMoney()} />
                                </View>
                            </View>
                        </View>} */}

            {/* {'bottomBanner' in serverData &&
              this.renderOfferViewWithSmallImage()} */}

            {/* <View style={styles.safetyContainer}>
                            <Text style={styles.safetyText}>{resources.strings.SAFETY_RENTAl}</Text>
                            <Text style={styles.safetyDescText}>{resources.strings.SAFETY_DESC}</Text>
                            <View style={styles.seprator} />
                            <View style={{ marginTop: 8 }}>
                                {this.safetyAllSteps()}
                            </View>
                        </View> */}

            {/* {'offer' in serverData && this.renderOfferViewWithBGImage()} */}

            {/* {loggedIn &&
              cartItemFlag &&
              this.state.productData != null &&
              this.state.productData.length > 0 && (
                <View style={styles.cartSection}>
                  <View style={styles.loggedInContainer}>
                    {
                      <View style={styles.invoiceDue}>
                        <Text
                          style={styles.cartHeading}
                          numberOfLines={2}
                          ellipsizeMode="tail">{`${
                          this.state.productData.length
                        } ${
                          this.state.productData.length > 1 ? 'items' : 'item'
                        } in your cart`}</Text>
                        <Image
                          source={resources.images.img_dash_line}
                          style={{width: '100%', marginTop: 5}}
                          resizeMode={'cover'}
                        />
                        <View style={{flex: 1}}>
                          <View style={styles.cartItemSection}>
                            <View style={{marginTop: 0}}>
                              {this.state.productData != null &&
                                this.state.productData.length > 0 && (
                                  <FlatList
                                    showsVerticalScrollIndicator={false}
                                    data={this.state.productData}
                                    keyExtractor={(item, index) =>
                                      index.toString()
                                    }
                                    renderItem={
                                      allProduct
                                        ? this.renderProductCell
                                        : this.render3ProductCell
                                    }
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
                          </View>
                          <Image
                            source={resources.images.img_dash_line}
                            style={{width: '100%', marginTop: 8}}
                            resizeMode={'cover'}
                          />
                          <View style={styles.cartInnerBottom}>
                            <View
                              style={[
                                styles.rowInvoiceSection,
                                {width: '50%'},
                              ]}>
                              <Text
                                style={styles.cartTotal}
                                numberOfLines={2}
                                ellipsizeMode="tail">
                                {'Total'}
                              </Text>
                              <Text
                                style={styles.cartPrice}
                                numberOfLines={2}
                                ellipsizeMode="tail">
                                ₹ {grand_total ? grand_total : '0'}/-
                              </Text>
                            </View>
                            <View style={{width: '50%'}}>
                              <Button
                                btnStyle={[
                                  styles.buttonCartStyle,
                                  {
                                    backgroundColor: resources.colors.appColor,
                                    width: '100%',
                                  },
                                ]}
                                touchOpacityStyle={{}}
                                rounded
                                btnText={'Rent Now'}
                                textStyle={{color: resources.colors.white}}
                                onPress={() => this.payNowCartScreen()}
                              />
                            </View>
                          </View>
                        </View>
                      </View>
                    }
                  </View>
                </View>
              )} */}

            {/* <View style={styles.benefitsContainer}>
              <Text style={styles.benefitsText}>
                {resources.strings.BENEFITS_RENTAl}
              </Text>
              <Text style={styles.benefitsDescText}>
                {resources.strings.BENEFITS_DESC}
              </Text>
              {/* <View style={styles.seprator} />
              <View style={{marginVertical: 8}}>{this.benefitsAllSteps()}</View>
            </View> */}

            {/* <View>
              <ReviewComponent
                reference={this.reviewRef}
                label={resources.strings.CUSTOMER_SAY_TITLE}
                data={this.state.reviewData}
                onSnapToItem={this.onActiveItem}
                startingPosition={1}
              />
            </View> */}

            {/* {this.renderFrpPlanDescriptionView()}
            {this.renderExploreButton()} */}
          </ScrollView>
        ) : (
          <View style={{backgroundColor: 'pink'}} />
        )}
        {/* <TouchableOpacity
                        style={styles.floatingIcon}
                        onPress={() => { this.toggleChatBot() }}>
                        { showChatBot ? 
                            <Icon name='close' size={30} color={resources.colors.appColor} /> : 
                            <Icon name='wechat' size={30} color={resources.colors.appColor} />
                        }
                    </TouchableOpacity> */}
  {/* order status view */}
{loggedIn && (serviceRequestFlag || invoiceFlag) && (
              <View
                  style={{position:'absolute',bottom:0,width:'100%'}}
                >
                <View style={[styles.loggedInContainer,{padding:10}]}>
                  <React.Fragment>
                    <View style={styles.profileWithOrder}>
                      <View style={{flex: 1}}>
                        
                        {/* <View style={styles.profileWithOrderInner}>
                          <View style={styles.rowSection}>
                            <Text
                              style={styles.profileHiName}
                              numberOfLines={2}
                              ellipsizeMode="tail">
                              {'Hi, '}
                              <Text
                                style={styles.profileName}
                                numberOfLines={2}
                                ellipsizeMode="tail">
                                {firstName && firstName != ''
                                  ? firstName
                                  : 'Guest'}
                              </Text>{' '}
                            </Text>
                           
                          </View>
                         
                        </View> */}
                      </View>
                    </View>
                    <View style={styles.runningServiceRequest}>
                      {serviceRequestFlag &&
                        runningOrderList &&
                        runningOrderList != null && (
                          <View style={{flex: 1}}>
                            <React.Fragment>
                              {/* <TouchableOpacity
                                style={styles.btnMain}
                                onPress={() =>
                                  this.viewOrder(
                                    runningOrderList.dealCodeNumber,
                                  )
                                }>
                                <View style={{width: '60%', marginTop: 0}}>
                                  <Text style={styles.orderNumberText}>
                                    {`Status of your order # ${
                                      runningOrderList.dealCodeNumber
                                    } placed on ${
                                      runningOrderList.created
                                    } is "${this.statusResponse(
                                      runningOrderList,
                                    )}"`}
                                  </Text>
                                </View>
                                <View>
                                  <React.Fragment>
                                    <View style={{flexDirection: 'row'}}>
                                      <Text
                                        style={[
                                          styles.viewMore,
                                          {
                                            textAlign: 'center',
                                            marginTop: -1,
                                          },
                                        ]}>
                                        {'View Order'}
                                      </Text>
                                      <Icon
                                        name="chevron-circle-right"
                                        size={14}
                                        color={resources.colors.appColor}
                                        type="ionicon"
                                      />
                                    </View>
                                  </React.Fragment>
                                </View>
                              </TouchableOpacity> */}
                              {/* <Image
                                source={resources.images.img_dash_line}
                                style={{width: '100%', marginVertical: 15}}
                                resizeMode={'cover'}
                              /> */}
                              <TouchableOpacity
                                style={styles.btnMain}
                                onPress={() =>
                                  this.manageOrder(
                                    runningOrderList.dealCodeNumber,
                                  )
                                }
                                >
                                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                    <View style={{flexDirection:'row',width:'50%',marginTop:6}}>
                                      <View style={{justifyContent:'center'}}>
                                        <Image source={resources.images.icn_listIcon} style={{width:20,height:20}} />
                                      </View>
                                      <View style={{marginLeft:10,justifyContent:'center'}}>
                                        <Text style={{fontFamily:resources.fonts.regular}}>{`Order #${runningOrderList.dealCodeNumber}`}</Text>
                                      </View>
                                    </View>

                                    <View style={{justifyContent:'center',marginTop:7}}>
                                          <Image source={resources.images.icn_kycPending} style={{width:125,height:28}}  />
                                    </View>

                                </View>
                                {/* <View style={{width: '60%', marginTop: 0}}>
                                  <Text style={styles.orderNumberText}>
                                    {`Need help with your order?`}
                                  </Text>
                                </View> */}
                                {/* <View>
                                  <React.Fragment>
                                    <View style={{flexDirection: 'row'}}>
                                      <Text
                                        style={[
                                          styles.viewMore,
                                          {
                                            textAlign: 'center',
                                            marginTop: -1,
                                          },
                                        ]}>
                                        {'Service Request'}
                                      </Text>
                                      <Icon
                                        name="chevron-circle-right"
                                        size={14}
                                        color={resources.colors.appColor}
                                        type="ionicon"
                                      />
                                    </View>
                                  </React.Fragment>
                                </View> */}
                              </TouchableOpacity>
                              {/* {serviceRequestFlag && invoiceFlag && (
                                <Image
                                  source={resources.images.img_dash_line}
                                  style={{width: '100%', marginTop: 15}}
                                  resizeMode={'cover'}
                                />
                              )} */}
                            </React.Fragment>
                          </View>
                        )}
                    </View>
                  </React.Fragment>
                  {invoiceFlag && (
                    <View style={styles.invoiceDue}>
                      <View style={{flex: 1}}>
                        <View style={styles.invoiceDueInner}>
                          <View
                            style={[styles.rowInvoiceSection, {width: '65%'}]}>
                            <Text
                              style={styles.profileName}
                              numberOfLines={2}
                              ellipsizeMode="tail">
                              {resources.strings.Total_InvoiceDue}
                            </Text>
                            <Text
                              style={styles.invoicePayment}
                              numberOfLines={2}
                              ellipsizeMode="tail">
                              ₹ {total_outstanding_amount}/-
                            </Text>
                          </View>
                          <Button
                            btnStyle={[
                              styles.buttonOrderStyle,
                              {
                                backgroundColor: invoiceFlag
                                  ? resources.colors.appColor
                                  : resources.colors.greyLight,
                              },
                            ]}
                            touchOpacityStyle={{}}
                            rounded
                            disableTouch={invoiceFlag ? false : true}
                            btnText={resources.strings.Pay_Now}
                            onPress={() => this.payNowAllOutStandingMoney()}
                          />
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            )}
      </SafeAreaView>
    );
  }
  onActiveItem = index => {
    this.setState({activeIndex: index});
  };

  renderExploreButton = () => {
    return (
      <View style={{marginBottom: 20}}>
        {/* <Text numberOfLines={10}>{JSON.stringify(this.notficationData)}</Text> */}

        <Button
          btnStyle={{
            backgroundColor: resources.colors.frbCardBlue,
            width: 170,
            borderRadius: 8,
          }}
          touchOpacityStyle={{width: 170, alignSelf: 'center', borderRadius: 8}}
          btnText={'Explore'}
          onPress={this.onPressExplore}
        />
      </View>
    );
  };

  renderFrpPlanDescriptionView = () => {
    const {serverData} = this.state;
    return (
      <View style={{marginHorizontal: 20, borderWidth: 0}}>
        <Text
          style={{
            fontFamily: resources.fonts.regular,
            color: resources.colors.textBlack,
            fontSize: 19,
            fontWeight: '500',
            textAlign: 'center',
          }}>
          {serverData.frp.title}
        </Text>
        <Text
          style={{
            fontFamily: resources.fonts.regular,
            color: resources.colors.textBlack,
            fontSize: 13,
            textAlign: 'center',
            marginVertical: 10,
          }}>
          {serverData.frp.description}
        </Text>
        <Image
          style={{width: '100%', height: heightScale(200), borderWidth: 0}}
          source={{uri: serverData.frp.image}}
          resizeMode={'stretch'}
        />
      </View>
    );
  };

  renderCitymaxOffersSteps = ({item, index}) => {
    const {serverData} = this.state;
    let arr = serverData.bottomBanner.data;
    return (
      <View style={styles.imageItem} key={index}>
        <TouchableOpacity
          onPress={() => this.onPressFrpOfferText(item.priority)}>
          <ImageLoad
            style={styles.imageBoxBanner}
            borderRadius={8}
            customImagePlaceholderDefaultStyle={{
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
            }}
            borderWidth={0}
            source={
              item.bottom_banner_background
                ? {uri: item.bottom_banner_background}
                : resources.images.img_placeholer_large
            }
            resizeMode={'stretch'}>
            <View style={{marginHorizontal: 10, width: myWidth / 2}}>
              {item.title ? (
                <Text
                  style={{
                    color: resources.colors.white,
                    fontSize: item.priority == 1 ? 16 : isPlatformIOS ? 17 : 18,
                    lineHeight:
                      item.priority == 1
                        ? isPlatformIOS
                          ? 18
                          : 24
                        : isPlatformIOS
                        ? 19
                        : 26,
                    fontFamily: resources.fonts.bold,
                    marginTop: 6,
                  }}>
                  {item.title}
                </Text>
              ) : null}
              {item.body ? (
                <Text
                  style={{
                    color: resources.colors.white,
                    fontSize: item.priority == 1 ? 24 : isPlatformIOS ? 17 : 18,
                    lineHeight:
                      item.priority == 1
                        ? isPlatformIOS
                          ? 24
                          : 30
                        : isPlatformIOS
                        ? 19
                        : 26,
                    fontFamily: resources.fonts.bold,
                    marginTop: isPlatformIOS ? 8 : 2,
                  }}>
                  {item.body}
                </Text>
              ) : null}
              {item.description ? (
                <Text
                  style={{
                    color: resources.colors.white,
                    fontSize: 13,
                    fontFamily: resources.fonts.regular,
                    marginTop: 0,
                  }}>
                  {item.description}
                </Text>
              ) : null}
            </View>
          </ImageLoad>
        </TouchableOpacity>
      </View>
    );
  };

  renderOfferViewWithSmallImage = () => {
    const {serverData} = this.state;
    if (
      'bottomBanner' in serverData &&
      serverData.bottomBanner.data.length > 0
    ) {
      let arr = serverData.bottomBanner.data;
      if (!arr || arr.length == 0) {
        return (
          <View
            style={{
              height: 1,
              marginHorizontal: 20,
              marginVertical: 20,
            }}
          />
        );
      }
      return (
        <React.Fragment>
          <View style={styles.smallBanner}>
            <FlatList
              // style={{ marginTop: 10 }}
              data={arr}
              keyExtractor={(item, index) => index.toString()}
              numColumns={1}
              renderItem={this.renderCitymaxOffersSteps}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </React.Fragment>
      );
    }
  };

  onPressFrpOfferText = priority => {
    // redirection to App offer screen
    if (priority == 1) {
      const {serverData} = this.state;
      console.log('serverData.frp', serverData.frp);
      if (serverData.frp && serverData.frp.id) {
        let event = AppUser.getInstance().emitterInst;
        let data = {
          categoryId: serverData.frp.id,
          categoryTypeFromHome: FRP_PRODUCT_TYPE,
        };
        this.props.navigation.navigate('FrpCategoryScreen');
        setTimeout(() => {
          event.emit(
            events.GOTO_PARTICULAR_FRP_CATEGORY_FROM_HOME,
            JSON.stringify(data),
          );
        }, 700);
      } else {
        this.props.navigation.navigate('Category');
      }
    } else if (priority == 2) {
      return null;
    } else {
      this.props.navigation.navigate('Home');
    }
  };
  renderOfferViewWithBGImage = () => {
    const {serverData} = this.state;
    if (
      'offer' in serverData &&
      'data' in serverData.offer &&
      serverData.offer.data.length > 0
    ) {
      let arr = serverData.offer.data;
      if (!arr || arr.length == 0) {
        return (
          <View
            style={{
              height: 1,
              marginHorizontal: 20,
              marginVertical: 20,
            }}
          />
        );
      }
      return (
        <ImageLoad
          style={{
            height: 130,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            marginHorizontal: 20,
            marginVertical: 20,
          }}
          topLeftBorderRadius={8}
          topRightBorderRadius={8}
          customImagePlaceholderDefaultStyle={{
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
          borderWidth={2}
          source={
            serverData.offer.offer_background
              ? {uri: serverData.offer.offer_background}
              : resources.images.img_placeholer_large
          }
          resizeMode={'stretch'}>
          <View style={{marginHorizontal: 15}}>{this.getOfferText()}</View>
        </ImageLoad>
      );
    }
  };

  getOfferText = () => {
    const {serverData} = this.state;
    let views = [];
    let arr = serverData.offer.data;
    arr.sort((a, b) => parseFloat(a.priority) - parseFloat(b.priority));
    arr.forEach(element => {
      views.push(
        <TouchableOpacity
          onPress={() => this.onPressOfferText(element.redirect_url)}>
          <Text
            style={
              element.priority == 1
                ? {
                    color: resources.colors.appColor,
                    fontSize: 23,
                    fontFamily: resources.fonts.bold,
                    marginTop: 6,
                  }
                : element.priority == 2
                ? {
                    color: resources.colors.blueOffer,
                    fontSize: 18,
                    fontFamily: resources.fonts.bold,
                    marginTop: 6,
                  }
                : {
                    color: resources.colors.textBlack,
                    fontSize: 15,
                    fontFamily: resources.fonts.regular,
                    marginTop: 6,
                  }
            }>
            {element.title ? element.title : ''}
          </Text>
        </TouchableOpacity>,
      );
    });

    return views;
  };

  onPressOfferText = url => {
    // redirection to web app offer screen
    // Linking.canOpenURL(url).then(supported => {
    //     if (supported) {
    //         Linking.openURL(url);
    //     } else {
    //         AppToast("Unable to open URL");
    //     }
    // });

    // redirection to App offer screen
    this.props.navigation.navigate('OfferScreen');
  };

  onActiveHorizontalItem = index => {
    this.setState({activeIndexHorizontal: index});
  };

  onPressSliderAction = () => {
    console.log('onPressSliderAction', this.state.activeIndexHorizontal);
    switch (this.state.activeIndexHorizontal) {
      case 0:
        const {serverData} = this.state;
        console.log('serverData.frp', serverData.frp);
        if (serverData.frp && serverData.frp.id) {
          let event = AppUser.getInstance().emitterInst;
          let data = {
            categoryId: serverData.frp.id,
            categoryTypeFromHome: FRP_PRODUCT_TYPE,
          };
          this.props.navigation.navigate('FrpCategoryScreen');
          setTimeout(() => {
            event.emit(
              events.GOTO_PARTICULAR_FRP_CATEGORY_FROM_HOME,
              JSON.stringify(data),
            );
          }, 700);
        } else {
          this.props.navigation.navigate('Category');
        }
        break;
      case 1:
        this.props.navigation.navigate('Category');
        break;
      default:
        this.props.navigation.navigate('Category');
    }
  };

 


 renderItem = ({item, index}, parallaxProps) => {
    return (
      <View style={styles.item}>
        <ParallaxImage
          source={{uri: item.illustration}}
          containerStyle={styles.imageContainer}
          style={styles.image}
          parallaxFactor={0.4}
          {...parallaxProps}
        />
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
      </View>
    );
  };

  

  renderTopBannerViewWithBGImage = () => {
    const {serverData} = this.state;
    if ('topBanner' in serverData && serverData.topBanner.data.length > 0) {
      let arr = serverData.topBanner.data;
      if (!arr || arr.length == 0) {
        return (
          <View
            style={{
              height: 1,
              marginHorizontal: 5,
              marginVertical: 5,
            }}
          />
        );
      }
      
      return (
        <React.Fragment>
          <SerchBox
              headerTitle={this.state.currentSeletcedCity}
              navigateProps={this.props.navigation}
              onClickLocation={this.onClickLocation}
              homePageData={this.state.homePageData}
              showSearchBox={true}
          />
          {serverData.topBanner.top_banner_carousel  ? (
            <>
            <View style={styles.topImageContainer}>
              <HorizontalBaannerImageView
                data={serverData.topBanner.carousel_background}
                activeIndexHorizontal={this.state.activeIndexHorizontal}
                onSnapToItem={this.onActiveHorizontalItem}
                onPressSliderAction={() => {
                  this.onPressSliderAction();
                }}
                reference={this.carouselRef}
              />
            </View>
            
            {
              this.state.homePageData ?
                this.state.homePageData?.user_order_details != "" ?
                  <View style={{padding:16,backgroundColor:'#F7F7F8'}}>
                    <ImageBackground 
                      source={resources.images.icn_homePageView}
                      style={{width:myWidth,height:280}}
                    >
                        <View style={{justifyContent:'center'}}>
                          <Text style={{fontFamily:resources.fonts.regular,fontWeight:"500",color:"#45454A",marginLeft:20}}>{this.state.homePageData?.user_order_details?.title}</Text>

                          <View style={{marginTop:10,marginLeft:20}}>
                            <Text style={{color:'#71717A',fontFamily:resources.fonts.regular}}>
                            {this.state.homePageData?.user_order_details?.subtitle}
                            </Text>
                          </View>
                        </View>
                        
                    </ImageBackground>
                    </View>
                : null
              : null
            }
            
            <Rentfurniture label={'Rent furniture'} onPressItem={(data,index) => this.onPressCategory(data,index)} data={this.state.homePageData}/>
            
            <Banner showSearchBox={false} headerTitle={this.state.currentSeletcedCity} onClickLocation={this.onClickLocation} data={this.state.homePageData} navigation={this.props.navigation} cityMax={true}/>
            <Banner showSearchBox={false} headerTitle={this.state.currentSeletcedCity} onClickLocation={this.onClickLocation} data={this.state.homePageData} navigation={this.props.navigation} cityMax={false}/>
            
            <TrendingProduct navigation={this.props.navigation} setHomePageData={this.setHomePageData} />
            <Market data={this.state.homePageData}/>
            <View style={{height:20}}/>
            <HowItsWork navigation={this.props.navigation}/>
            <View style={{height:20}} />
            <Cityfurnish/>
            <View style={{height:20}} />
            <UserTosay data={this.state.homePageData}  />
            <Support/>
            
            <View style={{height:50}} />
            </>
          ) : (
            <ImageLoad
              style={styles.imageTopBoxBanner}
              borderRadius={0}
              customImagePlaceholderDefaultStyle={{
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
              }}
              borderWidth={0}
              source={
                serverData.topBanner.top_banner_background
                  ? {uri: serverData.topBanner.top_banner_background}
                  : resources.images.img_placeholer_large
              }
              resizeMode={'stretch'}>
              <View style={styles.bannerBoxDesign}>
                {this.getTopBannerText()}
                <Button
                  btnStyle={{
                    backgroundColor: resources.colors.frbCardBlue,
                    height: 32,
                    width: 140,
                    borderRadius: 4,
                    marginTop: 6,
                    alignSelf: 'center',
                  }}
                  touchOpacityStyle={{width: 170, borderRadius: 4}}
                  btnText={'Explore'}
                  onPress={() => this.onPressTopBannerText()}
                />
              </View>
            </ImageLoad>
          )}
        </React.Fragment>
      );
    }
  };

  getTopBannerText = () => {
    const {serverData} = this.state;
    let views = [];
    let arr = serverData.topBanner.data;
    arr.sort((a, b) => parseFloat(a.priority) - parseFloat(b.priority));
    arr.forEach(element => {
      views.push(
        <React.Fragment>
          <Text
            style={
              element.priority == 1
                ? {
                    color: resources.colors.appColor,
                    fontSize: 25,
                    fontFamily: resources.fonts.bold,
                    marginTop: 0,
                    textAlign: 'center',
                  }
                : element.priority == 2
                ? {
                    color: resources.colors.blueOffer,
                    fontSize: 14,
                    fontFamily: resources.fonts.bold,
                    marginTop: 6,
                  }
                : {
                    color: resources.colors.textBlack,
                    fontSize: 12,
                    fontFamily: resources.fonts.regular,
                    marginTop: 2,
                  }
            }>
            {element.title ? element.title : ''}
          </Text>
        </React.Fragment>,
      );
    });

    return views;
  };

  onPressTopBannerText = () => {
    // redirection to App offer screen
    this.props.navigation.navigate('Category');
  };
  onPressCategory = (item,index) => {
    console.log("item index ::",index)
    if (item.url) { 
      Linking.openURL(item.url)
        .then(data => {
          console.log('url open');
        })
        .catch(() => {
          console.log('Error while opening url');
        });
    } else {
      //    id = 27 home furniture
      let val = item.categoryType;
      let type =
        val == NORMAL_PRODUCT_TYPE
          ? NORMAL_PRODUCT_TYPE
          : val == COMBO_PRODUCT_TYPE
          ? COMBO_PRODUCT_TYPE
          : null;
      if (type == null) {
        AppToast('Something went wrong');
        return;
      }
      
      let event = AppUser.getInstance().emitterInst;
      let data = {
        categoryId: item.id,
        categoryTypeFromHome: type,
        categoryIndex : index,
        seoUrl : item.seourl,
        homePageIndex : 'home'
      };
      
      this.props.navigation.navigate('CategoryScreen');
      setTimeout(() => {
        event.emit(
          events.GOTO_PARTICULAR_CATEGORY_FROM_HOME,
          JSON.stringify(data),
        );
      }, 400);
    }
  };
  onPressExplore = () => {
    // this.setReminder("ansbdmanbdamsndbamsd")
    const {serverData} = this.state;
    if (serverData.frp && serverData.frp.id) {
      let event = AppUser.getInstance().emitterInst;
      let data = {
        categoryId: serverData.frp.id,
        categoryTypeFromHome: FRP_PRODUCT_TYPE,
      };
      this.props.navigation.navigate('Category');
      setTimeout(() => {
        event.emit(
          events.GOTO_PARTICULAR_FRP_CATEGORY_FROM_HOME,
          JSON.stringify(data),
        );
      }, 700);
    } else {
      this.props.navigation.navigate('Category');
    }
  };
  OrderSummaryScreen = () => {
    this.props.navigation.navigate('OrderSummaryScreen');
  };
}

const mapStateToProps = state => {
  return {};
};
const container = connect(
  mapStateToProps,
  {
    ...actions,
    hitReviewListingApi,
    hitInvoiceListingApi,
    hitFirstRunningOrderApi,
    hitChatBotQueryRequestApi,
    getViewOrderDetailApi,
    getCartDetailApi,
    hitAddressListingApi,
    setAddressList
  },
)(HomeScreen);

export default container;
