import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Share,
  Animated,
  StatusBar,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {CartViewModal} from '../../modal/CartViewModal';
import {AddonsViewModal} from '../../modal/AddonsViewModal';
import {LoginShowAlertModal} from '../../modal/LoginShowAlertModal';
import {
  hitGetOfferslApi,
  hitGetProductDetailApi,
  hitReviewListingApi,
} from '../../../redux/actions/ProductDetailsAction';
import {hitAddDeleteWishListApi} from '../../../redux/actions/WishListAction';
import {
  hitAddToCartApi,
  getCartDetailApi,
  deleteProductFromCartApi,
} from '../../../redux/actions/CartAction';
import {hitNotifyProductApi} from '../../../redux/actions/CategoryListingAction';
import ProductHorizontalView from '../../../genriccomponents/productView/boughtProduct/BoughtProduct';
import styles from './styles';
import resources from '../../../../res';
import ReviewComponent from '../../../genriccomponents/productView/review/Review';
import NormalTenureSlider from '../../../genriccomponents/slider/NormalTenureSlider';
import HorizontalImageView from '../../../genriccomponents/productView/horizontalImage/HorizontalImageView';
import HorizontalModalImage from '../../../genriccomponents/productView/horizontalModalImage/HorizontalModalImage';
import Button from '../../../genriccomponents/button/Button';
import {Dropdown} from 'react-native-material-dropdown';
import {
  checkIfUserIsLoggedIn,
  showSigninAlert,
  redirectToSign,
  myWidth,
} from '../../../utility/Utils';
import AppUser from '../../../utility/AppUser';
import {MyStatusBar} from '../../../genriccomponents/header/HeaderAndStatusBar';
import HeaderWithProfile from '../../../genriccomponents/header/HeaderWithProfilePic';
import APILoadingHOC from '../../../genriccomponents/HOCS/APILoadingHOC';
import ImageLoad from '../../../genriccomponents/image/ImageLoad';
import {onUpdateCartBadgeCount} from '../../../redux/actions/CartAction';
import AsyncStorageConstants from '../../../utility/AsyncStorageConstants';
import AsyncStorage from '@react-native-community/async-storage';
import {onUpdateWishlistBadgeCount} from '../../../redux/actions/WishListAction';
import {getEnabledPaymentInfo} from '../../../redux/actions/PaymentAction';
import AppToast from '../../../genriccomponents/appToast/AppToast';
import events from '../../../utility/Events';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons';
import ForwardIcon from 'react-native-vector-icons/MaterialIcons';
import analytics from '@react-native-firebase/analytics';

import TextLessMoreView from './TextLessMoreView';
import LinearGradient from 'react-native-linear-gradient';
import UserTosay from '../../home/views/UserTosay';
import Support from '../../home/views/Support';
import { RentDurationModal } from '../../modal/RentDurationModal';
import ThingsYouShouldComponents from '../../cart/ThingsYouShouldComponents';

const anotherData = {
  addons: '',
  brand: 'Cityfurnish',
  category_id: '27,270',
  city_wise_quantity: null,
  colour: '',
  comment_count: null,
  coupon_codes: [
    {
      coupon_code: 'RENT20',
      description: 'Flat 20% Off on Rent (up to Rs 3000)',
    },
    {
      coupon_code: 'RENT15',
      description: 'Flat 15% Off on Rent (up to Rs 3000)',
    },
    {
      coupon_code: '',
      description: 'Flat 20% Off on Rent (up to Rs 3000)',
    },
    {
      coupon_code: 'RENT15',
      description: 'Flat 15% Off on Rent (up to Rs 3000)',
    },
    {
      coupon_code: 'RENT15',
      description: 'Flat 15% Off on Rent (up to Rs 3000)',
    },
  ],
  created: '2023-06-09 08:16:02',
  description: 'Insert description.  ',
  dimension: 'L x W : 78 Inches x 72 Inches',
  display_excerpt: null,
  excerpt: '',
  filter_tag: 'king_size_bed',
  free_delivery_and_setup_days:
    'Free Delivery and Setup within 72 hours after KYC completion',
  header_code_snippet:
    '<link rel="canonical" href="https://cityfurnish.com/things/4184/jade-king-size-double-bed-with-mattress" />',
  id: '4184',
  image: [
    'https://d3juy0zp6vqec8.cloudfront.net/images/product/Jade Bed with Mattress Look-1678781034-1679302793.png',
    'https://d3juy0zp6vqec8.cloudfront.net/images/product/Jade Bed Bedroom Look-1678781035.png',
    'https://d3juy0zp6vqec8.cloudfront.net/images/product/Jade Bed Frame Only Angled-1678781037.png',
    'https://d3juy0zp6vqec8.cloudfront.net/images/product/Jade Bed Frame Only-1678781039.png',
  ],
  image_video: [
    {
      id: 0,
      mediaType: 'image',
      url:
        'https://d3juy0zp6vqec8.cloudfront.net/images/product/Jade Bed with Mattress Look-1678781034-1679302793.png',
    },
    {
      id: 1,
      mediaType: 'image',
      url:
        'https://d3juy0zp6vqec8.cloudfront.net/images/product/Jade Bed Bedroom Look-1678781035.png',
    },
    {
      id: 2,
      mediaType: 'image',
      url:
        'https://d3juy0zp6vqec8.cloudfront.net/images/product/Jade Bed Frame Only Angled-1678781037.png',
    },
    {
      id: 3,
      mediaType: 'image',
      url:
        'https://d3juy0zp6vqec8.cloudfront.net/images/product/Jade Bed Frame Only-1678781039.png',
    },
  ],
  included_items: 2,
  installation_charge: '0',
  installation_description: null,
  isEnquireType: false,
  isFavourite: 0,
  is_addon: '0',
  is_bestselling: '0',
  is_frp: false,
  is_package: '1',
  is_sub_product: '0',
  is_subscription: '1',
  kyc_texts: [
    {
      img: 'https://cityfurnish.com/images/kyc-documents.png',
      txt: 'KYC Documents to be submitted before Delivery',
    },
    {
      img: 'https://cityfurnish.com/images/delivery-install.png',
      txt: 'Free Cancellation before Delivery',
    },
    {
      img:
        'https://cityfurnish.com/images/quality-products-in-mint-condiition.png',
      txt: 'All Products are in Mint Condition',
    },
  ],
  likes: null,
  list_name: null,
  list_value: null,
  material: 'Acacia Wood & Cotton Fabric',
  max_quantity: null,
  meta_description:
    'Rent Jade queen bed with mattress in Dlehi NCR, Bangalore, Mumbai. Free Delivery and Installation.',
  meta_keyword: '',
  meta_title: 'Jade queen bed with mattress on rent',
  min_tenure: '3 months',
  modified: '2023-05-08 10:09:47',
  option: null,
  package_discount: '0',
  price: '1138',
  price_range: null,
  product_label: 'Discount',
  product_name: 'Jade King Size Double Bed with Mattress	',
  product_order: '102.2',
  product_state: 4,
  purchasedCount: '26',
  quantity: '1000',
  recommended_product_details: [
    {
      id: '3793',
      image:
        'https://d3juy0zp6vqec8.cloudfront.net/images/product/thumb/1583907887_DSC0014 copy-min.jpg',
      price: '145',
      product_name: 'Alexa Bedside Table',
      rental_freq: 'month',
      rental_frequency_type: 'month',
    },
    {
      id: '3795',
      image:
        'https://d3juy0zp6vqec8.cloudfront.net/images/product/thumb/Alexa Study Table 1.png',
      price: '699',
      product_name: 'Alexa Study Table',
      rental_freq: 'month',
      rental_frequency_type: 'month',
    },
    {
      id: '3853',
      image:
        'https://d3juy0zp6vqec8.cloudfront.net/images/product/thumb/Pillow12.jpg',
      price: '30',
      product_name: 'Pillow',
      rental_freq: 'month',
      rental_frequency_type: 'month',
    },
    {
      id: '3856',
      image:
        'https://d3juy0zp6vqec8.cloudfront.net/images/product/thumb/Bedsheet4.jpg',
      price: '75',
      product_name: 'Double Bedsheet Set with Two Pillow Covers',
      rental_freq: 'month',
      rental_frequency_type: 'month',
    },
    {
      id: '3857',
      image:
        'https://d3juy0zp6vqec8.cloudfront.net/images/product/thumb/Cushions1.jpg',
      price: '150',
      product_name: 'Cushions - Set of 5',
      rental_freq: 'month',
      rental_frequency_type: 'month',
    },
    {
      id: '3866',
      image:
        'https://d3juy0zp6vqec8.cloudfront.net/images/product/thumb/Belle Side Table 1.png',
      price: '120',
      product_name: 'Belle Bedside Table',
      rental_freq: 'month',
      rental_frequency_type: 'month',
    },
    {
      id: '3888',
      image:
        'https://d3juy0zp6vqec8.cloudfront.net/images/product/thumb/Belle Wardrobe 1.png',
      price: '710',
      product_name: 'Belle Wardrobe',
      rental_freq: 'month',
      rental_frequency_type: 'month',
    },
    {
      id: '3889',
      image:
        'https://d3juy0zp6vqec8.cloudfront.net/images/product/thumb/Belle Drawer 1.png',
      price: '375',
      product_name: 'Belle Chest of Drawer',
      rental_freq: 'month',
      rental_frequency_type: 'month',
    },
    {
      id: '3891',
      image:
        'https://d3juy0zp6vqec8.cloudfront.net/images/product/thumb/Belle Bookshelf 1.png',
      price: '199',
      product_name: 'Belle Bookshelf',
      rental_freq: 'month',
      rental_frequency_type: 'month',
    },
  ],
  recommended_products: '3793,3795,3853,3856,3857,3866,3888,3889,3891',
  rental_freq: 'Monthly',
  rental_frequency_message: 'How long do you want to rent this for? (Months)',
  rental_frequency_type: 'month',
  sale_price: '1138',
  seller_product_id: '1678781034',
  seourl: 'jade-king-size-double-bed-with-mattress',
  ship_immediate: 'false',
  shipping: '7',
  shipping_cost: '1748',
  shipping_policies: '',
  shipping_type: null,
  short_url_id: '5289',
  sku: 'CFJADEKINGBED-01',
  slider_view: 'no',
  status: 'Publish',
  subproduct_quantity: 'a:2:{i:3895;s:1:"1";i:4182;s:1:"1";}',
  subproducts: [
    {
      brand: 'Kurlon / Coirfit / Duroflex/Sleepwell',
      colour: 'Assortd',
      dimension: 'L x W x T : 78 inches x 72 inches x 4 inches',
      id: '3895',
      image:
        'https://d3juy0zp6vqec8.cloudfront.net/images/product/thumb/King_bed_mattress1.jpg',
      material:
        '1-inch COIR(Hard side), 2-inch HARD FOAM(Supporting foam), 1-inch PU FOAM(32D-Soft area)',
      price: '400',
      product_name: 'King Size Double Bed Mattress',
      quantity: '1',
    },
    {
      brand: 'Cityfurnish',
      colour: 'Teak & Grey',
      dimension: 'L x W: 78 inches x 72 inches',
      id: '4182',
      image:
        'https://d3juy0zp6vqec8.cloudfront.net/images/product/thumb/Jade Bed Frame Only Angled-1678779838.png',
      material: 'Acacia Wood & Cotton Fabric',
      price: '1249',
      product_name: 'Jade King Size Double Bed',
      quantity: '1',
    },
  ],
  tax_cost: null,
  taxable_type: null,
  tenure: [
    {
      attr_name: '3 Months',
      attr_price: '1748',
      pid: '52019',
      product_id: '4184',
      shipping_deposit: 3496,
      strikeout_price: 0,
      upfront_description: [Array],
      upfront_title: 'Pay upfront & save more :',
    },
    {
      attr_name: '6 Months',
      attr_price: '1398',
      pid: '52020',
      product_id: '4184',
      shipping_deposit: 0,
      strikeout_price: '1748',
      upfront_description: [Array],
      upfront_title: 'Pay upfront & save more :',
    },
    {
      attr_name: '9 Months',
      attr_price: '1318',
      pid: '52021',
      product_id: '4184',
      shipping_deposit: 0,
      strikeout_price: '1748',
      upfront_description: [Array],
      upfront_title: 'Pay upfront & save more :',
    },
    {
      attr_name: '12 Months',
      attr_price: '1138',
      pid: '52022',
      product_id: '4184',
      shipping_deposit: 0,
      strikeout_price: '1748',
      upfront_description: [Array],
      upfront_title: 'Pay upfront & save more :',
    },
  ],
  threshold_quantity: '5',
  upfrontEnabled: true,
  user_id: '22',
  vendor_name: 'cityfurnish',
  web_link: null,
  web_url:
    'https://cityfurnish.com/things/4184/jade-king-size-double-bed-with-mattress',
  weight: 'L x W : 78 Inches x 72 Inches',
  you_might_also_like: '3892,3921,4182',
  you_might_also_like_details: [
    {
      id: '3892',
      image:
        'https://d3juy0zp6vqec8.cloudfront.net/images/product/thumb/vesta-king-bed-with-storage-1679296687.jpg',
      price: '1997',
      product_name: 'Vesta King Size Double Bed with Storage',
      rental_freq: 'month',
      rental_frequency_type: 'month',
    },
    {
      id: '3921',
      image:
        'https://d3juy0zp6vqec8.cloudfront.net/images/product/thumb/1584007109vesta_king_bed1.jpg',
      price: '1698',
      product_name: 'Vesta King Size Double Bed with Mattress',
      rental_freq: 'month',
      rental_frequency_type: 'month',
    },
    {
      id: '4182',
      image:
        'https://d3juy0zp6vqec8.cloudfront.net/images/product/thumb/Jade Bed Frame Only Angled-1678779838.png',
      price: '1249',
      product_name: 'Jade King Size Double Bed',
      rental_freq: 'month',
      rental_frequency_type: 'month',
    },
  ],
};

class ProductDetailScreen extends Component {
  static ROUTE_NAME = 'ProductDetailScreen';
  constructor(props) {
    super(props);
    this.productId =
      this.props.route.params && this.props.route.params.productId
        ? this.props.route.params.productId
        : 3934;
    this.state = {
      selectedDuration: null,
      selectedUpFront: null,
      activeIndexHorizontal: 0,
      activeIndex: 0,
      next: true,
      offers: [],
      productListData: [],
      subProducts: [],
      reviewData: [],
      isPaginating: false,
      page: 0,
      horizontalImageVideoData: [],
      horizontalImageData: [],
      heartFill: false,
      scrollY: new Animated.Value(0),
      durationData: [],
      isFavourite: null,
      kycTextData: [],
      boughtProductData: [],
      recommendedProductsData: [],
      offersTexts: [],
      height: null,
      selectedCityId: null,
      webUrl: '',
      isEnquireType: false,
      isLoading: true,
      includedItems: 0,

      loginShowAlert: null,
      pickOptionsVisible: null,
      is_frp: false,
      cartIdArray: [],
      is_cart_data: false,
      selectedSliderIndex: 0,

      showImageLoader: false,
      isModalVisible: false,

      detailData: [],
      isComingFromBuyNow: false,

      upfront_enabled: false,
      coupon_enabled: false,
      upfrontEnabled: false,
      upfront_payment: false,

      selectAddons: false,
      addonsOptionsVisible: null,
      tempIdState: '',
      rentDuratinModalVisible : false,
      sliderRentData:[
        {
          monthName : '3+',
          value : 3,
          id : 0,
          active : true
        },
        {
          monthName : '6+',
          value : 6,
          id : 1,
          active : false
        },
        {
          monthName : '9+',
          value : 9,
          id : 2,
          active : false
        },
        {
          monthName : '12+',
          value : 12,
          id : 3,
          active : false
        }
      ]
    };
    this.carouselRef = React.createRef();
    this.reviewRef = React.createRef();
    this.productScrollViewRef = React.createRef();
  }
  componentWillMount() {
    let appUser = AppUser.getInstance();
    let selectedCityId = appUser.selectedCityId;
    this.setState({selectedCityId: selectedCityId});
  }
  componentDidFocus = () => {
    // StatusBar.setBarStyle('light-content');
    // StatusBar.setBackgroundColor("transparent");
  };
  componentDidMount() {
    //this.props.navigation.addListener('focus', () => this.componentDidFocus())
    this.loadData();
    // this.getOffers()
    this.getConfigrationInfo();
    this.setState({page: 0}, () => {
      this.getReview(0, false);
    });

    this.interval = setInterval(() => {
      this.moveCustomerSaysToFirstIndex();
    }, 1500);
  }

  getConfigrationInfo = async () => {
    await this.props
      .getEnabledPaymentInfo()
      .then(data => {
        this.setState({
          upfront_enabled: data.upfront_enabled,
          coupon_enabled: data.coupon_enabled,
          upfront_payment:
            data.upfront_payment != null ? data.upfront_payment : false,
        });
      })
      .catch(error => {
        console.log('getEnabledPaymentInfo error', error);
      });
  };
  moveCustomerSaysToFirstIndex = () => {
    if (this.reviewRef && this.reviewRef.current) {
      this.reviewRef.current.snapToItem(1, true, true);
      clearInterval(this.interval);
    }
  };
  getReview = (page, isPaginating) => {
    this.props
      .hitReviewListingApi(20, page)
      .then(data => {
        this.setState({
          reviewData: [...this.state.reviewData, ...data.data],
          isPaginating: false,
          next: data.data.length == 20,
        });
      })
      .catch(error => {
        console.log(' error', error);
        this.setState({isPaginating: false});
      });
  };

  loadMoreData = () => {
    const {page, isPaginating, next} = this.state;
    if (next && !isPaginating) {
      this.setState({isPaginating: true, page: page + 1}, () => {
        setTimeout(() => {
          const {page} = this.state;
          this.getReview(page, true);
        }, 1000);
      });
    }
  };

  loadData = () => {
    const {selectedCityId} = this.state;
    this.props
      .hitGetProductDetailApi(this.productId, selectedCityId)
      .then(data => {
        if (!data.data.product_name) {
          AppToast('No data Available for this product');
          this.onBackClick();
          return;
        }
        console.log('data data ::',JSON.stringify(data.data))
        this.setState({
          productListData: data.data,
          subProducts: data.data.subproducts,
          horizontalImageData: data.data.image,
          horizontalImageVideoData:
            'image_video' in data.data
              ? data.data.image_video
              : this.state.horizontalImageVideoData,
          isFavourite: data.data.isFavourite == 0 ? false : true,
          durationData: data.data.tenure,
          selectedDuration:
            data.data.tenure && data.data.tenure.length > 0
              ? data.data.tenure[data.data.tenure.length - 1]
              : null,
          selectedUpFront:
            data.data.tenure && data.data.tenure.length > 0
              ? data.data.tenure[data.data.tenure.length - 1]
              : null,
          kycTextData: data.data.kyc_texts,
          offersTexts: anotherData.coupon_codes,
          upfrontEnabled: data.data.upfrontEnabled,
          boughtProductData: data.data.you_might_also_like_details,
          recommendedProductsData: data.data.recommended_product_details,
          webUrl: data.data.web_url,
          isEnquireType: data.data.isEnquireType,
          isLoading: false,
          includedItems: data.data.included_items,
        });
      })
      .catch(error => {
        this.setState({
          isLoading: false,
        });
        console.log('error', error);
      });
  };

  renderKycTextView = () => {
    const {kycTextData} = this.state;
    const kycDataCount = [];
    for (let i = 0; i < kycTextData.length; i++) {
      let item = kycTextData[i];
      kycDataCount.push(
        <View key={i + 'kycKey'} style={styles.instructionContainer}>
          <View style={styles.iconTextContainer}>
            <Image
              source={{uri: item.img}}
              style={styles.iconStyle}
              resizeMode={'contain'}
            />
            <Text
              style={styles.instructionText}
              ellipsizeMode={'tail'}
              numberOfLines={1}>
              {item.txt}
            </Text>
          </View>
        </View>,
      );
    }
    return kycDataCount;
  };

  renderUpFrontPaymentView = () => {
    const {upfront_description} = this.state.selectedUpFront
      ? this.state.selectedUpFront
      : '';
    return (
      <React.Fragment>
        {upfront_description != null &&
          upfront_description.length > 0 &&
          upfront_description.map((description, index) => (
            <Text
              style={styles.monthlyRentEMIDesc}
              ellipsizeMode={'tail'}
              numberOfLines={3}>
              - {description.replace('INR', '₹')}
            </Text>
          ))}
      </React.Fragment>
    );
  };

  renderUpFrontView = () => {
    const {upfront_title, upfront_description, upfront_sub_description} = this
      .state.selectedUpFront
      ? this.state.selectedUpFront
      : '';
    return (
      <View style={[styles.imageThumbnail, {marginBottom: 2, borderWidth: 0}]}>
        <LinearGradient
          colors={['rgba(239, 83, 78, 0.20)', 'white', 'white']}
          style={styles.linearGradient}
          start={{x: 0, y: 0.5}}
          end={{x: 1, y: 0.5}}
          locations={[0, 0.7, 0.9]}>
          <View style={styles.row}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.chechbox]}
              onPress={() =>
                console.log('upfrontTexts Selected', upfront_title)
              }>
              <Image
                source={resources.images.icn_roundchecked}
                style={styles.chechboxImage}
              />
            </TouchableOpacity>
            <View style={[styles.cellStyle, {width: '80%'}]}>
              {upfront_title && upfront_title != null ? (
                <Text style={styles.userNameText}>{upfront_title}</Text>
              ) : null}
              {upfront_description != null &&
                upfront_description.length > 0 &&
                upfront_description.map((description, index) => (
                  <Text
                    style={styles.fontStyle}
                    ellipsizeMode={'tail'}
                    numberOfLines={3}>
                    - {description.replace('INR', '₹')}
                  </Text>
                ))}
              <Text style={styles.defaultTxt}>{upfront_sub_description}</Text>
            </View>
            <View style={styles.viewEdit}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.editTouchView}
                onPress={() => this.upFrontScreen()}>
                {/* <Image source={resources.images.icn_addressEdit}
                                    style={{ width: 18, height: 18 }} /> */}
                <ForwardIcon
                  style={[{textAlign: 'center'}]}
                  name={'arrow-forward-ios'}
                  size={20}
                  color={resources.colors.appColor}
                />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  };

  renderOffersView = () => {
    const {offersTexts} = this.state;
    console.log(offersTexts, 'offersTexts');
    const offerTextCount = [];
    for (let i = 0; i < 4; i++) {
      let item = offersTexts[i];
      offerTextCount.push(
        <View key={i + 'keyOffer'} style={[styles.wrapCoupanText]}>
          {item.coupon_code == '' ? (
            <Text
              style={styles.discountText}
              ellipsizeMode={'tail'}
              numberOfLines={1}>
              {item.description}
            </Text>
          ) : (
            <Text
              style={styles.discountText}
              ellipsizeMode={'tail'}
              numberOfLines={1}>
              {item.description}:
            </Text>
          )}
          <Text
            style={styles.cuponCodeText}
            ellipsizeMode={'tail'}
            numberOfLines={1}>
            {item.coupon_code}
          </Text>
        </View>,
      );
    }
    return offerTextCount;
  };

  renderIncludedItemView = () => {
    const {subProducts} = this.state;
    const productsCountData = [];
    for (let i = 0; i < subProducts.length; i++) {
      let item = subProducts[i];
      let imageIndex = i == 0 ? resources.images.c1 : resources.images.c2
      productsCountData.push(
        <View key={i + 'includeKey'} style={{paddingHorizontal: 12,marginTop : 15}}>
          <View style={styles.rowDirection}>
            
            <View style={[styles.columnDirection, {flex: 1, marginLeft: 8}]}>
              {item.product_name == null || item.product_name == '' ? (
                <View />
              ) : (
                <>
                <Image source={imageIndex} style={{height:25,width:25}} />
                <View  style={{height:8}} />
                <Text
                  style={styles.includeTitleTextStyle}
                  ellipsizeMode={'tail'}
                  numberOfLines={1}>
                  {item.product_name}
                </Text>

                <Text
                  style={styles.priceTextStyle}
                >
                  ₹{item.price} / month
                </Text>

                <Text style={styles.buttonLabelStyle}>
                  View details
                </Text>
                </>
              )}
              {/* <View style={styles.rowDirection}>
                {item.brand == null || item.brand == '' ? (
                  <View />
                ) : (
                  <Text style={[styles.subTitleTextStyle]}>
                    {resources.strings.BRAND_TEXT}
                  </Text>
                )}
                {item.brand == null || item.brand == '' ? (
                  <View />
                ) : (
                  <Text
                    style={[styles.subTitleValueStyle]}
                    ellipsizeMode={'tail'}
                    numberOfLines={2}>
                    {item.brand}
                  </Text>
                )}
              </View> */}
              {/* <View style={styles.rowDirection}>
                {item.quantity == null || item.quantity == '' ? (
                  <View />
                ) : (
                  <Text style={styles.subTitleTextStyle}>
                    {resources.strings.QUANTITY_TEXT}
                  </Text>
                )}
                {item.quantity == null || item.quantity == '' ? (
                  <View />
                ) : (
                  <Text
                    style={styles.subTitleValueStyle}
                    ellipsizeMode={'tail'}
                    numberOfLines={2}>
                    {item.quantity}
                  </Text>
                )}
              </View> */}
              {/* <View style={styles.rowDirection}>
                {item.dimension == null || item.dimension == '' ? (
                  <View />
                ) : (
                  <Text style={[styles.subTitleTextStyle]}>
                    {resources.strings.SIZE_TEXT}
                  </Text>
                )}
                {item.dimension == null || item.dimension == '' ? (
                  <View />
                ) : (
                  <Text
                    style={[styles.subTitleValueStyle]}
                    ellipsizeMode={'tail'}
                    numberOfLines={2}>
                    {item.dimension}
                  </Text>
                )}
              </View> */}
              {/* <View style={styles.rowDirection}>
                {item.material == null || item.material == '' ? (
                  <View />
                ) : (
                  <Text style={[styles.subTitleTextStyle]}>
                    {resources.strings.MATERIAL_TEXT}
                  </Text>
                )}
                {item.material == null || item.material == '' ? (
                  <View />
                ) : (
                  <Text
                    style={[styles.subTitleValueStyle]}
                    ellipsizeMode={'tail'}
                    numberOfLines={2}>
                    {item.material}
                  </Text>
                )}
              </View> */}
              {/* <View style={styles.rowDirection}>
                {item.colour == null || item.colour == '' ? (
                  <View />
                ) : (
                  <Text style={[styles.subTitleTextStyle]}>
                    {resources.strings.COLOR_TEXT}
                  </Text>
                )}
                {item.colour == null || item.colour == '' ? (
                  <View />
                ) : (
                  <Text
                    style={[styles.subTitleValueStyle]}
                    ellipsizeMode={'tail'}
                    numberOfLines={2}>
                    {item.colour}
                  </Text>
                )}
              </View> */}
            </View>
            <View
              style={{
                borderWidth: 0,
                width: 80,
                height: 80,
                borderRadius: 6,
                justifyContent:'center',
                marginRight : 15
              }}>
              <Image
                source={
                  item.image
                    ? {uri: item.image}
                    : resources.images.img_placeholer_small
                }
                style={styles.productImage}
                resizeMode={'stretch'}
              />
            </View>
            <View style={{position:'absolute',right:20,top:70}}>
              <Image source={resources.images.addButton} style={{height:26,width:63}} />
            </View>
          </View>
          <View style={styles.seperator} />
        </View>,
      );
    }
    return productsCountData;
  };
  nextPage = index => {
    if (this.carouselRef && this.carouselRef.current) {
      this.carouselRef.current.snapToItem(index, true, true);
    }
  };
  renderImages = ({item, index}) => {
    return (
      <TouchableOpacity onPress={() => this.nextPage(index)}>
        <ImageLoad
          style={[styles.moreProductImages]}
          borderRadius={6}
          customImagePlaceholderDefaultStyle={{borderRadius: 6}}
          source={item ? {uri: item} : resources.images.img_placeholer_small}
          resizeMode={'cover'}
        />
      </TouchableOpacity>
    );
  };
  renderModalImages = ({item, index}) => {
    if (item.mediaType === 'image') {
      return (
        <TouchableOpacity onPress={() => this.nextPage(index)}>
          <ImageLoad
            style={[styles.moreModalProductImages]}
            borderRadius={6}
            customImagePlaceholderDefaultStyle={{borderRadius: 6}}
            source={
              item && item.url
                ? {uri: item.url}
                : resources.images.img_placeholer_small
            }
            resizeMode={'cover'}
          />
        </TouchableOpacity>
      );
    } else if (item.mediaType === 'video') {
      return (
        <TouchableOpacity onPress={() => this.nextPage(index)}>
          <ImageLoad
            style={[styles.moreModalProductImages]}
            borderRadius={6}
            customImagePlaceholderDefaultStyle={{borderRadius: 6}}
            source={
              item && item.media_url
                ? {uri: item.media_url}
                : resources.images.img_placeholer_small
            }
            resizeMode={'cover'}
          />
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  };
  onBackClick = () => {
    this.props.navigation.goBack();
  };
  storeWishlistCountData = async data => {
    let obj = AppUser.getInstance();
    obj.wishlistCount = data;
    this.props.onUpdateWishlistBadgeCount(data);
    try {
      await AsyncStorage.setItem(
        AsyncStorageConstants.wishlistBadgeCount,
        data.toString(),
      );
    } catch (e) {
      // saving error
      console.log('error', e);
    }
  };

  onPressCartIcon = () => {
    this.props.navigation.pop();
    this.props.navigation.navigate('CartScreen');
  };

  onPressAddDeleteWishlist = () => {
    if (checkIfUserIsLoggedIn()) {
      const {isFavourite} = this.state;
      this.props
        .hitAddDeleteWishListApi(this.productId)
        .then(data => {
          this.setState(
            {
              isFavourite: !isFavourite,
            },
            () => {
              let event = AppUser.getInstance().emitterInst;
              event.emit(
                events.UPDATE_CATEGORY_SCREEN_PRODUCT_LIST,
                this.productId,
              );
              this.storeWishlistCountData(data.data.WishlistItemsCount);
            },
          );
          AppToast(data.message);
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      showSigninAlert(`ProductDetailScreen_${this.productId}`);
    }
  };
  onShareClick = () => {
    Share.share(
      {
        message: `Rent awesome furniture and appliances from Cityfurnish Now !! ${
          this.state.webUrl ? this.state.webUrl : ''
        }`,
        url: this.state.webUrl ? this.state.webUrl : '',
        title: 'Share',
      },
      {
        // Android only:
        dialogTitle: 'Share',
        // iOS only:
        excludedActivityTypes: ['com.apple.UIKit.activity.PostToTwitter'],
      },
    );
  };
  getHeaderBackgroundColor = () => {
    const {scrollY} = this.state;
    return scrollY.interpolate({
      inputRange: [0, 140],
      outputRange: ['rgba(0,0,0,0.1)', 'rgb(239,83,78)'],
      extrapolate: 'clamp',
      useNativeDriver: true,
    });
  };
  onLayoutChange = event => {
    var {height} = event.nativeEvent.layout;
    this.setState({height: height});
  };
  OfferScreen = () => {
    this.props.navigation.navigate('OfferScreen');
  };
  upFrontScreen = () => {
    this.props.navigation.navigate('UpFrontScreen');
  };

  onSliderCallback = index => {
    this.setState(
      {
        selectedSliderIndex: index,
      },
      () => {
        this.setState({
          selectedDuration: this.state.durationData[
            this.state.selectedSliderIndex
          ],
          selectedUpFront: this.state.durationData[
            this.state.selectedSliderIndex
          ],
        });
      },
    );
  };

  onPressHorizontalImageView = () => {
    const {horizontalImageVideoData} = this.state;
    if (horizontalImageVideoData.length > 0) {
      this.setState({
        isModalVisible: true,
        showImageLoader: true,
      });
    } else {
      console.log('No Extra Image found');
    }
  };

  toggleImageModal = () => {
    this.setState({
      isModalVisible: false,
      showImageLoader: false,
    });
  };

  onPressBack = () => {
    this.setState({
      isModalVisible: false,
      showImageLoader: false,
    });
  };

  showLoader = () => {
    return (
      <View style={styles.containerLoaderStyle}>
        <ActivityIndicator size="large" color={resources.colors.appColor} />
      </View>
    );
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{fontFamily: resources.fonts.regular}} />
        </View>
      );
    }
    const {
      activeIndexHorizontal,
      productListData,
      subProducts,
      horizontalImageData,
      horizontalImageVideoData,
      isFavourite,
      height,
      isEnquireType,
      includedItems,
      selectAddons,
    } = this.state;
    const {
      product_name,
      you_might_also_like,
      shipping_cost,
      recommended_products,
      free_delivery_and_setup_days,
      product_state,
      dimension,
      brand,
      material,
      colour,
      rental_freq,
      rental_frequency_message,
      installation_charge,
      installation_description,
      description,
    } = productListData;
    const {attr_name, attr_price, strikeout_price, shipping_deposit} = this
      .state.selectedDuration
      ? this.state.selectedDuration
      : null;
    let saving_percentage = Math.round(
      ((strikeout_price - attr_price) / strikeout_price) * 100,
    );
    const step = 1 / (2 * height);
      
    return (
      <React.Fragment>
        <Modal
          isVisible={this.state.isModalVisible}
          onBackButtonPress={this.toggleImageModal}
          animationIn={'slideInRight'}
          animationOut={'slideOutRight'}
          style={styles.view}
          onRequestClose={() => {
            this.toggleImageModal();
          }}>
          <View style={styles.fullScreenModal}>
            {/* <HeaderWithProfile
                            headerTitle={resources.strings.PRODUCT_IMAGES}
                            isBackIconVisible={true}
                            onBackClick={this.onPressBack}
                            navigateProps={this.props.navigation}
                            isProfileIconVisible={false}
                            toRoute={"Home"}
                        /> */}
            <View style={[styles.backBtnBox]}>
              <TouchableOpacity
                onPress={() => this.toggleImageModal()}
                style={[styles.backBtnCont]}
                hitSlop={{top: 10, left: 20, right: 20, bottom: 10}}>
                <Icon
                  style={[{textAlign: 'center'}]}
                  name={'md-close'}
                  size={28}
                  color={resources.colors.appColor}
                />
              </TouchableOpacity>
            </View>
            {horizontalImageVideoData.length > 0 &&
            this.state.showImageLoader ? (
              <React.Fragment>
                {/* <View style={styles.marginModalHor}> */}
                <View style={styles.horizontalModalTopImageContainer}>
                  <View style={styles.horizontalModalImageContainer}>
                    <HorizontalModalImage
                      data={horizontalImageVideoData}
                      activeIndexHorizontal={activeIndexHorizontal}
                      onSnapToItem={this.onActiveHorizontalItem}
                      reference={this.carouselRef}
                    />
                  </View>
                </View>
                <View style={styles.flatlistModalMargin}>
                  <FlatList
                    data={horizontalImageVideoData}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    renderItem={this.renderModalImages}
                  />
                </View>
                {/* </View> */}
              </React.Fragment>
            ) : (
              this.showLoader()
            )}
          </View>
        </Modal>
        <View style={styles.mainContainer}>
          <MyStatusBar
            backgroundColor={'transparent'}
            barStyle="light-content"
          />
          <View style={[styles.headerStyle]}>
            <View style={styles.flex1} onLayout={this.onLayoutChange}>
              {height ? (
                <View style={{flex: 1, alignSelf: 'stretch'}}>
                  {Array.from({length: 2 * height})
                    .fill(1)
                    .map((v, i) => {
                      return (
                        <View
                          key={i + 'key'}
                          style={{
                            backgroundColor: resources.colors.black,
                            opacity: 1 - i * step,
                            height: 0.8,
                          }}
                        />
                      );
                    })}
                </View>
              ) : (
                <View />
              )}
              <View style={styles.headerContainer}>
                <TouchableOpacity onPress={this.onBackClick}>
                  <Image
                    source={resources.images.icn_back_white}
                    style={styles.backIconStyle}
                    resizeMode={'contain'}
                  />
                </TouchableOpacity>
                <View style={[styles.shareContainer]}>
                  <TouchableOpacity
                    onPress={this.onPressCartIcon}
                    style={{flexDirection: 'row'}}>
                    <Image
                      source={resources.images.icn_cartProduct}
                      style={styles.iconCartHeader}
                      resizeMode={'contain'}
                    />
                    <View
                      style={[
                        styles.viewCartBadge,
                        {backgroundColor: resources.colors.appColor},
                      ]}>
                      <Text style={styles.badgeCart}>
                        {this.props.cartReducer
                          ? this.props.cartReducer.cartBadgeCount
                          : '0'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <View style={styles.space} />
                  <TouchableOpacity
                    onPress={this.onPressAddDeleteWishlist}
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    {isFavourite ? (
                      <Image
                        source={resources.images.red_heart_icn}
                        style={styles.iconStyleHeader}
                        resizeMode={'contain'}
                      />
                    ) : (
                      <Image
                        source={resources.images.icn_white_heart}
                        style={styles.iconStyleHeader}
                        resizeMode={'contain'}
                      />
                    )}
                  </TouchableOpacity>
                  <View style={styles.space} />
                  <TouchableOpacity onPress={this.onShareClick}>
                    <Image
                      source={resources.images.icn_share1}
                      style={styles.iconStyle}
                      resizeMode={'contain'}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
          <Animated.ScrollView
            style={styles.mainContainer}
            ref={this.productScrollViewRef}
            overScrollMode={'always'}
            // style={{ zIndex: 10 }}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={Animated.event([
              {
                nativeEvent: {contentOffset: {y: this.state.scrollY}},
              },
            ])}>
            <View style={styles.marginHor}>
              <View style={styles.horizontalImageContainer}>
                <HorizontalImageView
                  data={this.state.horizontalImageData}
                  activeIndexHorizontal={activeIndexHorizontal}
                  onSnapToItem={this.onActiveHorizontalItem}
                  onPressHorizontalImageView={() => {
                    this.onPressHorizontalImageView();
                  }}
                  reference={this.carouselRef}
                />
              </View>
              <Text
                style={styles.titleTextStyle}
                ellipsizeMode={'tail'}
                numberOfLines={1}>
                {product_name ? product_name : ''}
              </Text>
              <View style={styles.flatlistMargin}>
                <FlatList
                  data={horizontalImageData}
                  keyExtractor={(item, index) => index.toString()}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  renderItem={this.renderImages}
                />
              </View>
              {subProducts.length > 0 ? (
                <View />
              ) : (
                <></>
              )}
            </View>

{/*         
<View style={{flexDirection:'row',justifyContent:'flex-start',padding:16}}>
                    <View>
                    <Text>{`4.2    ${'\u2B24'}  `}</Text>
                    </View>
                    <View>
                    <Text style={{textDecorationLine: 'Underline'}}>{`19 Reviews    ${'\u2B24'}  `}</Text>
                    </View>
                    <View>
                    <Text>{`Delivery in 4-5 days`}</Text>
                    </View>
                    
                </View>   */}
                <View  style={styles.divider1}/>   

                <View style={{marginLeft : 16}}>
                  {
                    brand ?
                    <View style={styles.rowDirection}>
                      <View style={styles.centerClass}>
                      <Image source={require("../../../../res/images/productDetail/brand.png")} style={styles.imageIcon} />
                      </View>
                      <View style={[styles.centerClass,styles.leftClass]}>
                        <Text style={styles.titleTextStyle1}>Brand</Text>
                        <Text style={styles.subTitleTextStyle1}>{brand}</Text>
                      </View>
                    </View>
                    : null
                  }
                  {
                    dimension ?
                    <View style={[styles.rowDirection,styles.marginTop]}>
                      <View style={styles.centerClass}>
                      <Image source={require("../../../../res/images/productDetail/size.png")} style={styles.imageIcon} />
                      </View>
                      <View style={[styles.centerClass,styles.leftClass]}>
                        <Text style={styles.titleTextStyle1}>Size</Text>
                        <Text style={styles.subTitleTextStyle1}>{dimension}</Text>
                      </View>
                    </View>
                    : null
                  }
                  {
                    material ?
                    <View style={[styles.rowDirection,styles.marginTop]}>
                    <View style={styles.centerClass}>
                    <Image source={require("../../../../res/images/productDetail/material.png")} style={styles.imageIcon} />
                    </View>
                    <View style={[styles.centerClass,styles.leftClass]}>
                      <Text style={styles.titleTextStyle1}>Material</Text>
                      <Text style={styles.subTitleTextStyle1}>{material}</Text>
                    </View>
                  </View>
                 : null
                  }
                  
                </View> 
                {
                  brand || material || dimension ?
                    <View  style={styles.divider1}/> 
                  : null
                }
                
                {
                  description == null || description == "" ? 
                  null
                  :
                  <>
                  {
                    description ?
                      <View>
                        <Text style={styles.description}>
                          {description}
                        </Text>
                        <View  style={styles.divider1}/> 
                      </View>
                    : null
 
                  }

                  
                
                  </>
                }
                
            {/* <View style={styles.priceBoxContainer}> */}
              {/* <View style={styles.priceContainer}>
                                <View style={styles.monthlyRentBoxContainer}>
                                    <Text style={styles.monthlyUpfrontRentText} ellipsizeMode={'tail'}>
                                        {rental_freq + ' Rent'}
                                    </Text>
                                    <View style={styles.priceInnerBox}>
                                        {strikeout_price > 0 ? <Text style={[styles.upfrontPriceStrikeOutText, {fontFamily: resources.fonts.regular}]}>
                                            ₹{strikeout_price}{' '}
                                        </Text> : null}
                                        <Text style={styles.upfrontPriceText} ellipsizeMode={'tail'} numberOfLines={2}>
                                             ₹{attr_price ? attr_price : "NA"}/-
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.emiBox}>
                                    {this.renderUpFrontPaymentView()}
                                </View>
                            </View> */}

                      
              {/* <View style={styles.priceContainerWithoutDesign}>
                <View style={styles.priceInnerBoxWithoutDesign}>
                  <Text
                    style={[styles.upfrontPriceText, {textAlign: 'center'}]}
                    ellipsizeMode={'tail'}
                    numberOfLines={2}>
                    ₹ {attr_price ? attr_price : 'NA'}{' '}
                  </Text>
                  {strikeout_price > 0 ? (
                    <Text
                      style={[
                        styles.upfrontPriceStrikeOutText,
                        {fontFamily: resources.fonts.regular},
                      ]}>
                      ₹{strikeout_price}
                    </Text>
                  ) : null}
                  {saving_percentage && saving_percentage > 0 ? (
                    <Text
                      style={[
                        styles.OffTextStyle,
                        {backgroundColor: '#67AF7B'},
                      ]}>
                      {` ${saving_percentage}% OFF `}
                    </Text>
                  ) : null}
                </View>
                <Text style={styles.monthlyRentText} ellipsizeMode={'tail'}>
                  {rental_freq + ' Rent'}
                </Text>
              </View> */}
              {/* {(installation_charge > 0 && installation_charge !="") && <React.Fragment >
                                <View style={styles.spaceView} />
                                <View style={styles.priceInstallationContainer}>
                                    <Text style={[styles.priceText, { color: resources.colors.textBlack, top: 6 }]} ellipsizeMode={'tail'} numberOfLines={2}>₹ {installation_charge ? installation_charge : "NA"}/-</Text>
                                    <Text style={styles.monthlyRentText} ellipsizeMode={'tail'}>
                                        {'Installation Charge'}{'\n'}<Text style={styles.monthlyRentTextDesc} ellipsizeMode={'tail'}>{'( Collected at time of Installation )'}</Text>
                                    </Text>
                                </View>
                            </React.Fragment>} */}
              {/* <React.Fragment>
                <View style={styles.spaceView} />
                {installation_charge > 0 && installation_charge != '' ? (
                  <View style={styles.priceRefundableContainer}>
                    <Text
                      style={[
                        styles.priceText,
                        {color: resources.colors.textBlack, top: 6},
                      ]}
                      ellipsizeMode={'tail'}
                      numberOfLines={2}>
                      ₹ {shipping_cost}/-
                    </Text>
                    <Text
                      style={styles.monthlyRentText}
                      ellipsizeMode={'tail'}
                      numberOfLines={2}>
                      {'Refundable Deposit'}
                    </Text>
                  </View>
                ) : (
                  <React.Fragment>
                    {shipping_deposit != null ? (
                      <View style={styles.priceRefundableContainer}>
                        <Text
                          style={[
                            styles.priceText,
                            {color: resources.colors.textBlack, top: 6},
                          ]}
                          ellipsizeMode={'tail'}
                          numberOfLines={2}>
                          ₹ {shipping_deposit}/-
                        </Text>
                        <Text
                          style={styles.monthlyRentText}
                          ellipsizeMode={'tail'}
                          numberOfLines={2}>
                          {'Refundable Deposit'}
                        </Text>
                      </View>
                    ) : shipping_cost != null ? (
                      <View style={styles.priceRefundableContainer}>
                        <Text
                          style={[
                            styles.priceText,
                            {color: resources.colors.textBlack, top: 6},
                          ]}
                          ellipsizeMode={'tail'}
                          numberOfLines={2}>
                          ₹ {shipping_cost}/-
                        </Text>
                        <Text
                          style={styles.monthlyRentText}
                          ellipsizeMode={'tail'}
                          numberOfLines={2}>
                          {'Refundable Deposit'}
                        </Text>
                      </View>
                    ) : (
                      <View />
                    )}
                  </React.Fragment>
                )}
              </React.Fragment> */}
            {/* </View> */}
            {/* <View style={styles.installationBox}> */}
              {/* {installation_charge > 0 && installation_charge != '' && (
                <React.Fragment>
                  <Text style={styles.installationText} ellipsizeMode={'tail'}>
                    {'Installation Charge '}
                    <Text
                      style={styles.installationTextPrice}
                      ellipsizeMode={'tail'}>
                      ₹ {installation_charge}
                    </Text>
                    {' Collected at time of Installation'}
                  </Text>
                </React.Fragment>
              )} */}
              {/* <Text style={styles.freeDeliveryText}>
                {free_delivery_and_setup_days}
              </Text> */}
            {/* </View> */}
            {this.state.upfront_enabled &&
            this.state.upfrontEnabled &&
            this.state.upfront_payment ? (
              <View style={styles.listUpFrontContainer}>
                {this.renderUpFrontView()}
              </View>
            ) : (
              <View />
            )}
           
            <View style={{marginLeft : 16}}>
            <Text style={{fontWeight : "500",fontSize:18,color:'#222222',fontFamily:resources.fonts.medium}}>Offers for you</Text>
            </View>
            {this.state.coupon_enabled && this.state.offersTexts.length > 0 ? (
              <>
                <FlatList 
                  data={this.state.offersTexts}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  
                  renderItem={({item,index}) => {
      
                    return(
                      <>
                        <View style={{padding : 10}}>
                        <Image 
                          source={require("../../../../res/images/offer.jpeg")}

                        />
                        <View style={{position:'absolute',top:30,left:100,justifyContent:'center'}}>
                          <Text style={{color:'white'}}>{item.description}</Text>
                          <Text style={{color:'white',fontWeight:'bold'}}>{`Use Code ${item.coupon_code}`}</Text>
                        </View>
                        </View>
                      </>
                    )
                  }}

                />
                   <TouchableOpacity onPress={() => this.props.navigation.push('OfferScreen')} style={{marginLeft : 16,flexDirection:'row'}}>
                      <View style={{justifyContent:'center'}}>
                        <Text style={{fontWeight : "500",color:"#222222",fontFamily:resources.fonts.medium,fontSize:16}}>All Offers </Text>
                      </View>
                      <View style={{justifyContent:'center'}}>
                        <Image source={require("../../../../res/images/productDetail/v6-icon.png")} style={{width:15,height:15}} />
                      </View>
                    </TouchableOpacity>
              </>
            ) : (
              <View />
            )}
            {subProducts.length > 0 ? (
              <Text style={styles.titleTextStyle}>
                {/* {includedItems ? includedItems : subProducts.length}{' '}
                {resources.strings.ITEM_INCLUDE} */}
                Complete the look
              </Text>
            ) : (
              <View />
            )}
            {subProducts.length > 0 ? this.renderIncludedItemView() : <View />}
            {/* <View style={{padding:16}}>
              {
                <Image 
                  source={resources.images.TestimonlalsSection}
                  style={{width:'100%'}}
                />
              }
            </View> */}
            <ThingsYouShouldComponents type={"detailpage"} />
            
            {/* <View style={{marginTop:10}}>
              {this.renderKycTextView()}
            </View> */}

           
            
            {/* {you_might_also_like == null || you_might_also_like == '' ? (
              <View />
            ) : (
              <ProductHorizontalView
                productList={this.state.boughtProductData}
                label={resources.strings.PEOPLE_BOUGHT_TITLE}
                onMoveProduct={this.onMoveProduct}
                viewLabel={resources.strings.VIEW_ALL_TEXT}
                removeButton={true}
              />
            )} */}

            {/* {recommended_products == null || recommended_products == '' ? (
              <View />
            ) : (
              <ProductHorizontalView
                productList={this.state.recommendedProductsData}
                label={resources.strings.RECOMMENDED_PRODUT_TITLE}
                onMoveProduct={this.onMoveProduct}
                viewLabel={resources.strings.VIEW_ALL_TEXT}
                removeButton={true}
              />
            )} */}

            {/* {
              this.state.reviewData ?
<View style={styles.reviewContainer}>
            <View style={{marginTop : 15}}>
              <UserTosay data={this.state.reviewData}  />
            </View>
              <ReviewComponent
                label={resources.strings.CUSTOMER_SAY_TITLE}
                data={this.state.reviewData}
                onSnapToItem={this.onActiveItem}
                reference={this.reviewRef}
                startingPosition={1}
                reachEnd={this.loadMoreData}
              />
            </View>
              : null
            } */}
            
            <View style={{marginTop : 10,marginBottom:100}}>
              <Support />
            </View>
          </Animated.ScrollView>
          <View style={styles.cartButtonContainer}>
            
              {/* <Text style={styles.chooseDuration}>{resources.strings.CHOOSE_DURATION_TEXT}</Text>
                            <View style={styles.dropDownView}>
                                <Dropdown
                                    // disabled={product_state == 1 ? true : false}
                                    itemTextStyle={{ fontWeight: '600' }}
                                    labelTextStyle={{ fontWeight: '600' }}
                                    onChangeText={(val, i, d) => {
                                        this.setState({ selectedDuration: d[i] }, () => {
                                            this.scrollScrollViewToTop()
                                        })
                                    }
                                    }
                                    data={this.state.durationData.map(item => ({ value: item.attr_name, ...item }))}
                                    textColor={"rgb(53,64,82)"}
                                    selectedItemColor={"rgb(53,64,82)"}
                                    fontSize={14}
                                    textColor={"#354052"}
                                    inputContainerStyle={{

                                        borderBottomWidth: 0
                                    }}
                                    containerStyle={styles.dropDownContainer}
                                    dropdownPosition={this.state.durationData.length == 1 ? 2 : 4}
                                    value={this.state.durationData && this.state.durationData.length > 0 ? this.state.durationData[0].attr_name : ""}
                                />
                            </View> */}

              {/* {selectAddons && (
                <Button
                  btnStyle={[
                    styles.buttonStyleAddons,
                    {width: myWidth / 2 - 20},
                  ]}
                  touchOpacityStyle={{}}
                  outlined
                  textStyle={{color: resources.colors.appColor}}
                  btnText={'Select Addons'}
                  onPress={() => this.selectAddonsCall()}
                />
              )} */}

              
                <View>
                  <Text>
                    <Text style={styles.footerText}>{`₹709 `}</Text>
                    <Text style={styles.footerText1}>/ month</Text>
                  </Text>
                  <TouchableOpacity 
                    onPress={() => {
                      this.setState({
                        rentDuratinModalVisible : true
                      })
                    }}
                    style={[styles.rowDirection,{marginTop:5}]}>
                    <View>
                      <Image source={require("../../../../res/images/productDetail/calender.png")} />
                    </View>
                    <View>
                      <Text style={styles.subTitleTextStyle1}>{`  12 months`}</Text>
                    </View>
                    <View style={{justifyContent:'center'}}>
                        <Image source={require("../../../../res/images/productDetail/v6-icon.png")} style={{width:13,height:13}} />
                      </View>
                  </TouchableOpacity>
                </View>
                  <View>
                  <Button
                btnStyle={
                   styles.buttonStyleAddToCart
                }
                touchOpacityStyle={{}}
                // outlined
                rounded
                textStyle={{color: resources.colors.white}}
                // textStyle={{color: '#3a3a3a'}}
                btnText={
                  isEnquireType
                    ? resources.strings.ENQUIRY_NOW
                    : product_state == 1
                    ? resources.strings.NOTIFY_ME
                    : resources.strings.ADD_TO_CART
                }
                onPress={() => {
                  isEnquireType
                    ? this.goToEnquireScreen()
                    : product_state == 1
                    ? this.notifyBtn()
                    : this.addToCart(true);
                }}
              />
                  </View>
                
              

              {/* <Button
                                btnStyle={[styles.buttonStyleBuyNow,
                                    {
                                        width: isEnquireType ? myWidth - 30 : product_state == 1 ? myWidth - 30 : myWidth / 2 - 20
                                    }]}
                                touchOpacityStyle={{}}
                                rounded
                                btnText={
                                    isEnquireType ? resources.strings.ENQUIRY_NOW : product_state == 1 ? resources.strings.NOTIFY_ME : resources.strings.BUY_NOW
                                }
                                onPress={() => { isEnquireType ? this.goToEnquireScreen() : product_state == 1 ? this.notifyBtn() : this.buyNow() }} /> */}
            
          </View>

          {
            this.state.rentDuratinModalVisible ? 
              <RentDurationModal 
                titlemodel={'Cityfurnish'}
                descriptionModel={
                  'For how many months would you like to rent this?'
                }
                onClickPickType={this.onClickAddonsType}
                visibleModal={this.state.rentDuratinModalVisible}
                
                onAddonsMoveProduct={this.onAddonsMoveProduct}
                onPressBackDrop={this.onPressBackDrop}
                defaultItem={this.state.durationData.length}
                onSliderCallback={this.onSliderCallback}
                serverData={this.state.durationData}
                rental_frequency_message={rental_frequency_message}
                dataSet={this.state.sliderRentData}
                onChangeTab={(index) => {
                  let data = this.state.sliderRentData
                  
                  data.find((item) => {
                    if (item.id !== this.state.sliderRentData[index].id) {
                      item.active = false;
                    } else {
                      item.active = true;
                    }
                  });
                  this.setState({
                    sliderRentData : data
                  })
                }}
                  
              />
            : null
          }
          {/* {this.state.addonsOptionsVisible ? (
            <AddonsViewModal
              titlemodel={'Cityfurnish'}
              descriptionModel={
                'Select Add Ons, You might be interested in... '
              }
              onClickPickType={this.onClickAddonsType}
              visibleModal={this.state.addonsOptionsVisible}
              productList={this.state.recommendedProductsData}
              onAddonsMoveProduct={this.onAddonsMoveProduct}
              onPressBackDrop={this.onPressBackDrop}
            />
          ) : (
            <View />
          )} */}

          {this.state.pickOptionsVisible ? (
            <CartViewModal
              titlemodel={'Cityfurnish'}
              descriptionModel={
                'Only one Citymax plan can be ordered at a  time. Please remove rest of the products from cart and place their order separately. '
              }
              onClickPickType={this.onClickPickType}
              visibleModal={this.state.pickOptionsVisible}
              onPressBackDrop={this.onPressBackDrop}
            />
          ) : (
            <View />
          )}

          {/* {this.state.durationData && this.state.durationData.length > 1 && (
            <View style={styles.tenureSliderBoxContainer}>
              <NormalTenureSlider
                defaultItem={this.state.durationData.length}
                onSliderCallback={this.onSliderCallback}
                serverData={this.state.durationData}
                rental_frequency_message={rental_frequency_message}
              />
            </View>
          )} */}

          {this.state.loginShowAlert ? (
            <LoginShowAlertModal
              titlemodel={resources.strings.APP_NAME}
              descriptionModel={resources.strings.youNeedLogin}
              onClickLoginShowAlerPicktType={this.onClickLoginShowAlerPicktType}
              visibleModal={this.state.loginShowAlert}
              onPressBackDrop={this.onPressBackDrop}
            />
          ) : (
            <View />
          )}
        </View>
      </React.Fragment>
    );
  }

  scrollScrollViewToTop = () => {
    if (this.productScrollViewRef && this.productScrollViewRef.current) {
      this.productScrollViewRef.current.getNode().scrollTo(0);
    }
  };

  goToEnquireScreen = () => {
    if (checkIfUserIsLoggedIn()) {
      this.props.navigation.navigate('OfiiceEnquiryScreen');
    } else {
      showSigninAlert(`ProductDetailScreen`);
    }
  };

  notifyBtn = () => {
    const {selectedCityId} = this.state;
    if (checkIfUserIsLoggedIn()) {
      this.props
        .hitNotifyProductApi(this.productId, selectedCityId)
        .then(data => {
          AppToast(data.message);
        })
        .catch(error => {
          AppToast(error);
        });
    } else {
      showSigninAlert(`ProductDetailScreen_${this.productId}`);
    }
  };
  onMoveProduct = product_id => {
    this.props.navigation.push('ProductDetailScreen', {productId: product_id});
  };

  onAddonsMoveProduct = product_id => {
    this.setState({selectAddons: false});
    this.onPressBackDrop();
    this.props.navigation.push('ProductDetailScreen', {productId: product_id});
  };

  showPickerOptions = () => {
    console.log('select images');
    this.setState({
      pickOptionsVisible: 'bottom',
      loginShowAlert: null,
    });
  };
  onPressBackDrop = () => {
    this.setState({
      pickOptionsVisible: null,
      loginShowAlert: null,
      addonsOptionsVisible: null,
      rentDuratinModalVisible : false
      
    });
  };

  onClickLoginShowAlerPicktType = type => {
    this.setState({
      loginShowAlert: null,
      pickOptionsVisible: null,
    });
    setTimeout(() => {
      switch (type) {
        case 'ok':
          // Go to Login Screen
          redirectToSign(`ProductDetailScreen_${this.productId}`);
          break;
        default:
          break;
      }
    }, 500);
  };

  onClickAddonsType = type => {
    this.setState({
      loginShowAlert: null,
      pickOptionsVisible: null,
      addonsOptionsVisible: null,
    });
  };

  onClickPickType = type => {
    this.setState({
      loginShowAlert: null,
      pickOptionsVisible: null,
    });
    setTimeout(() => {
      switch (type) {
        case 'go_to_cart':
          // Go to Cart
          let event = AppUser.getInstance().emitterInst;
          this.props.navigation.pop();
          event.emit(events.MOVE_TO_CART, 'trigger');
          break;
        case 'remove':
          // Remove Product from cart:
          this.deleteProduct(this.state.cartIdArray);
          break;
        default:
          break;
      }
    }, 500);
  };

  selectAddonsCall = async () => {
    console.log('selectAddonsCall');
    this.setState({
      addonsOptionsVisible: 'bottom',
    });
  };

  buyNow = async () => {
    if (checkIfUserIsLoggedIn()) {
      this.setState({
        isComingFromBuyNow: true,
      });
      await this.loadCartDetailsData();
      if (this.state.is_cart_data && this.state.is_frp) {
        this.setState({
          pickOptionsVisible: 'bottom',
        });
      } else {
        this.addToCartAction();
      }
    } else {
      this.setState({
        loginShowAlert: 'bottom',
      });
      // showSigninAlert(`ProductDetailScreen_${this.productId}`)
    }
  };

  addToCart = async selectAddons => {
    if (checkIfUserIsLoggedIn()) {
      this.setState({
        isComingFromBuyNow: false,
      });
      await this.loadCartDetailsData();
      if (this.state.is_cart_data && this.state.is_frp) {
        this.setState({
          pickOptionsVisible: 'bottom',
        });
      } else {
        this.addToCartAction(selectAddons);
      }
    } else {
      const temp_user_id = await AsyncStorage.getItem('@temp_user_id');
      if (temp_user_id == null) {
        let rnumber = Math.round(Date.now() * (Math.random() * 1000));
        let rnstring = rnumber.toString();
        await AsyncStorage.setItem('@temp_user_id', rnstring.substring(0, 9));
        this.setState({
          tempIdState: rnstring.substring(0, 9),
        });
        this.addToCartAction(selectAddons);
      } else {
        const savedTempUserId = await AsyncStorage.getItem('@temp_user_id');
        console.log(savedTempUserId);
        this.setState({
          tempIdState: savedTempUserId,
        });
        this.addToCartAction(selectAddons);
      }
    }
  };

  deleteProduct = cartIdArray => {
    cartIdArray.map(index => {
      if (index.cart_id != undefined && index.cart_id != null) {
        return this.props
          .deleteProductFromCartApi(index.cart_id)
          .then(data => {
            AppToast(data.message);

            // add item in cart
            this.addToCartAction();
          })
          .catch(error => {
            console.log(error, 'error');
          });
      }
    });
  };

  addToCartAction = async (selectAddons = false) => {
    const {
      selectedCityId,
      isComingFromBuyNow,
      detailData,
      recommendedProductsData,
      tempIdState,
    } = this.state;
    const attribute_value = this.state.selectedDuration
      ? this.state.selectedDuration.pid
      : this.state.durationData[0].pid;

    // await analytics().logEvent(
    //   Platform.OS == 'android' ? 'add_to_cart_android' : 'add_to_cart_ios',
    //   {
    //     id: this.productId,
    //     name: 'data.products[0]',
    //     brand: 'Cityfurnish',
    //     list_position: 1,
    //     category: Platform.OS == 'android' ? 'android' : 'iOS',
    //     quantity: 'data.products[0]',
    //     price: 'data.products[0]',
    //   },
    // );

    this.props
      .hitAddToCartApi(
        this.productId,
        1,
        attribute_value,
        selectedCityId,
        tempIdState,
      )
      .then(async data => {
        await analytics().logEvent(
          Platform.OS == 'android' ? 'add_to_cart_android' : 'add_to_cart_ios',
          {
            id: this.productId,
            name: data.data.products[0]?.product_name,
            brand: 'Cityfurnish',
            list_position: 1,
            category: Platform.OS == 'android' ? 'android' : 'iOS',
            quantity: data.data.products[0]?.quantity,
            price: data.data.products[0]?.price,
          },
        );

        let value = data.data.itemsIncartCount;
        this.storeCartCountData(value);
        this.storeWishlistCountData(data.data.WishlistItemsCount);
        AppToast(data.message);
        if (recommendedProductsData && recommendedProductsData.length > 0) {
          this.setState({selectAddons: selectAddons});
        }
        if (isComingFromBuyNow) {
          this.navigateToAddressScreen();
        }
      })
      .catch(error => {
        // AppToast(error);
        console.log('error box running', error);
      });
  };

  navigateToAddressScreen = async () => {
    const {isComingFromBuyNow, detailData} = this.state;
    await this.loadCartDetailsData();
    this.props.navigation.navigate('AddressScreen', {
      isProceedBtnVisible: true,
      isProfileIconVisible: false,
      checkoutOrderDetails: detailData,
      isComingFromBuyNow: isComingFromBuyNow,
    });
  };

  loadCartDetailsData = async () => {
    await this.props
      .getCartDetailApi()
      .then(data => {
        console.log('data.data.grand_total', data.data.grand_total);
        this.setState({detailData: data.data});
        if ('products' in data.data && data.data.products.length > 0) {
          let let_is_frp = false;
          let cartFrpItem = data.data.products.filter(item => {
            if (item.is_frp || item.is_frp == true || item.is_frp == 'true') {
              let_is_frp = true;
              return {cart_id: item.cart_id};
            }
          });

          this.setState({
            is_frp: let_is_frp,
            cartIdArray: cartFrpItem,
            is_cart_data: true,
          });
        } else {
          this.setState({
            is_cart_data: false,
          });
        }
      })
      .catch(error => {
        console.log(error, 'error');
        this.setState({
          is_cart_data: false,
        });
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

  onActiveItem = index => {
    this.setState({activeIndex: index});
  };
  onActiveHorizontalItem = index => {
    this.setState({activeIndexHorizontal: index});
  };
}

const mapStateToProps = state => {
  return {
    cartReducer: state.cartReducer,
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      hitAddDeleteWishListApi,
      hitGetOfferslApi,
      hitGetProductDetailApi,
      hitReviewListingApi,
      hitAddToCartApi,
      deleteProductFromCartApi,
      getCartDetailApi,
      hitNotifyProductApi,
      onUpdateCartBadgeCount,
      onUpdateWishlistBadgeCount,
      getEnabledPaymentInfo,
    },
    dispatch,
  );
}
let Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProductDetailScreen);
let loader = APILoadingHOC(Container);
loader.getIntent = () => {
  return {
    routeName: ProductDetailScreen.ROUTE_NAME,
  };
};
export default loader;
