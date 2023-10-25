import React, {Component} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Clipboard,
  ImageBackground,
} from 'react-native';
import styles from './styles';
import HeaderWithProfile from '../../genriccomponents/header/HeaderWithProfilePic';
import resources from '../../../res';
import * as actions from '../../redux/actions/ProductDetailsAction';
import APILoadingHOC from '../../genriccomponents/HOCS/APILoadingHOC';
import {connect} from 'react-redux';
import AppToast from '../../genriccomponents/appToast/AppToast';
import LinearGradient from 'react-native-linear-gradient';

const data = {
  offers: [
    {
      id: '13',
      top_text: '',
      price_text: '20% Discount',
      price_below_text: 'on your first order',
      coupon_code: 'RENT20',
      max_discount: '0',
      description: [
        'Flat 20% Off on Rent (up to Rs 3000)',
        'Applicable on furniture & appliances (except water purifiers)',
        'Applicable on tenure of 9 months and above',
      ],
      offer_text: '',
      position: '0',
      is_publish_wishlist: '0',
      status: 'Publish',
      created_at: '2022-11-24 12:55:00',
    },
    {
      id: '11',
      top_text: '',
      price_text: '15% Discount',
      price_below_text: 'on your first order',
      coupon_code: 'RENT15',
      max_discount: '0',
      description: [
        'Flat 15% Off on Rent (up to Rs 3000)',
        'Applicable on furniture & appliances (except water purifiers)',
        'Applicable on tenure of 6 months and above',
      ],
      offer_text: '',
      position: '5',
      is_publish_wishlist: '0',
      status: 'Publish',
      created_at: '2022-09-16 19:07:48',
    },
    {
      id: '10',
      top_text: '',
      price_text: '10% Discount',
      price_below_text: 'on your first order',
      coupon_code: 'WELCOME10',
      max_discount: '0',
      description: [
        'Flat 10% Off on Rent (up to Rs 3000)',
        'Applicable on furniture & appliances (except water purifiers)',
        'Applicable on all tenures',
      ],
      offer_text: '',
      position: '6',
      is_publish_wishlist: '0',
      status: 'Publish',
      created_at: '2021-09-23 12:24:51',
    },
    {
      id: '15',
      top_text: '',
      price_text: '10% Discount',
      price_below_text: 'on your first order',
      coupon_code: '',
      max_discount: '0',
      description: [
        'Flat 10% Off on Rent (up to Rs 3000)',
        'Applicable on furniture & appliances (except water purifiers)',
        'Applicable on all tenures',
      ],
      offer_text: '',
      position: '6',
      is_publish_wishlist: '0',
      status: 'Publish',
      created_at: '2021-09-23 12:24:51',
    },
  ],
  voucher: {
    id: '1',
    client_id: '858513',
    key_id: 'NRBKoxDEn1Q8ZaTBmhUtYYc17u6pgft1dMzEfCx2',
    reward: '2500',
    status: '1',
    post_url: 'https://thelogicalbanya.com',
    return_url: 'https://cityfurnish.com',
    partner_code: 'Cityfurnish',
    voucher_title: 'VOUCHER',
    voucher_label:
      'For All New Orders on Registering for Standing Instructions',
    steps_desc:
      '1.You will receive an email on successful order placement with link to redeem vouchers\r\n2.You can opt for multiple voucher up-to cumulative total amount specified above\r\n3.Voucher link will be active for 60 days from sent date',
  },
};

class UpFrontScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      getUpFrontList: [],
    };
  }
  componentDidMount() {
    this.initialData();
  }
  initialData = () => {
    this.props
      .hitGetOfferslApi()
      .then(data => {
        console.log('data.data.getUpFrontList', JSON.stringify(data.data));
        this.setState({
          getUpFrontList: data.data,
        });
      })
      .catch(error => {
        console.log('Error inside get offer', error);
      });
  };
  onBackClick = () => {
    this.props.navigation.goBack();
  };
  renderHeader = () => {
    return (
      <HeaderWithProfile
        headerTitle={resources.strings.OFFERS}
        isBackIconVisible={true}
        onBackClick={this.onBackClick}
        navigateProps={this.props.navigation}
        toRoute={'MyAccountScreen'}
      />
    );
  };

  copyCuponText = couponCode => {
    Clipboard.setString(couponCode);
    AppToast(resources.strings.COUPON_CODE_COPYIED);
  };

  upFrontList = ({item, index}) => {
    return (
      <View style={styles.imageThumbnail}>
        <LinearGradient
          colors={['rgba(239, 83, 78, 0.47)', 'white', 'white']}
          style={styles.linearGradient}
          start={{x: 0, y: 0.5}}
          end={{x: 1, y: 0.5}}>
          <View
            style={[
              styles.cell,
              item.coupon_code == '' && {alignItems: 'center'},
            ]}>
            <View
              style={{
                width: '50%',
                alignItems: 'center',
                paddingHorizontal: 6,
                marginBottom: 10,
              }}>
              <Text style={styles.flatOffer}>
                {item.price_text ? item.price_text : ''}
              </Text>
              <Text style={styles.belowText}>
                {item.price_below_text ? item.price_below_text : ''}
              </Text>
              {item.coupon_code != '' && (
                <>
                  <Text style={styles.couponText}>{'Discount'}</Text>
                  <View style={styles.dashedBorder}>
                    <View style={styles.couponCode}>
                      <Text style={styles.couponCodeText}>
                        {item.upfront_off ? item.upfront_off : item.coupon_code}
                        {item.upfront_off && item.upfront_off != null
                          ? 'OFF'
                          : ''}
                      </Text>
                    </View>

                    {item.coupon_code && item.coupon_code != null && (
                      <TouchableOpacity
                        style={styles.offerCode}
                        onPress={() => this.copyCuponText(item.coupon_code)}>
                        <Image
                          style={styles.copy}
                          source={resources.images.icn_copy}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </>
              )}
            </View>
            <Image
              style={{height: 131, width: 2}}
              source={resources.images.img_line}
              resizeMode={'stretch'}
            />
            <View style={styles.offerTextView} key={index}>
              {item.description != null &&
                item.description.length > 0 &&
                item.description.map((description, index) => (
                  <Text style={styles.couponDiscription}>- {description}</Text>
                ))}
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  };

  renderVoucher = () => {
    const {
      getUpFrontList: {voucher},
    } = this.state;

    return (
      <ImageBackground
        source={resources.images.bg_voucher}
        style={styles.imageBackView}
        resizeMode={'stretch'}>
        {voucher != undefined &&
        voucher.reward != undefined &&
        voucher.voucher_title != undefined ? (
          <View>
            <View style={{flexDirection: 'row'}}>
              <View style={{width: '50%'}}>
                <Image
                  source={resources.images.img_discount}
                  resizeMode={'cover'}
                />
              </View>
              <View
                style={{width: '50%', alignItems: 'flex-start', marginTop: 15}}>
                <Text style={styles.rewardAmount}>
                  ₹{voucher.reward ? voucher.reward : ''}
                </Text>
                <Text style={styles.rewardTitle}>
                  {voucher.voucher_title ? voucher.voucher_title : ''}
                </Text>
              </View>
            </View>
            <View style={{flexDirection: 'column', alignItems: 'center'}}>
              <Text style={styles.voucharLabel}>"{voucher.voucher_label}"</Text>
              <TouchableOpacity
                style={{width: 100, height: 30}}
                onPress={() =>
                  this.props.navigation.navigate('TermsAndCondition')
                }>
                <Text style={styles.knowMore}>{'Know More...'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View />
        )}
      </ImageBackground>
    );
  };
  render() {
    const {getUpFrontList} = this.state;

    return (
      <View style={styles.fullScreen}>
        {this.renderHeader()}
        <View style={styles.container}>
          <View style={{marginHorizontal: 20, marginTop: 20}}>
            <Text style={styles.findAnswerText}>
              {
                'upfront plans and get additional discount on your monthly rental'
              }
            </Text>
          </View>
          <FlatList
            data={getUpFrontList.offers}
            // data={data.offers}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this.upFrontList}
            ListFooterComponent={() => this.renderVoucher()}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {};
};
let container = connect(
  mapStateToProps,
  {...actions},
)(UpFrontScreen);
let loader = APILoadingHOC(container);

loader.getIntent = () => {
  return {
    routeName: UpFrontScreen.ROUTE_NAME,
  };
};
export default loader;
