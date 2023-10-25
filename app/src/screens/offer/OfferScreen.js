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
class OfferScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      getOfferList: [],
    };
  }
  componentDidMount() {
    this.initialData();
  }
  initialData = () => {
    this.props
      .hitGetOfferslApi()
      .then(data => {
        this.setState({
          getOfferList: data.data,
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

  offerList = ({item, index}) => {
    return (
      <View style={styles.imageThumbnail}>
        <View style={styles.cell}>
          <View
            style={{
              width: '50%',
              alignItems: 'center',
              marginBottom: 10,
            }}>
            <Text style={styles.flatOffer}>
              {item.price_text ? item.price_text : ''}
            </Text>
            <Text style={styles.belowText}>
              {item.price_below_text ? item.price_below_text : ''}
            </Text>
            <Text style={styles.couponText}>
              {resources.strings.COUPON_CODE}
            </Text>
            <View style={styles.dashedBorder}>
              <View style={styles.couponCode}>
                <Text style={styles.couponCodeText}>
                  {item.coupon_code ? item.coupon_code : 'NA'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.offerCode}
                onPress={() => this.copyCuponText(item.coupon_code)}>
                <Image style={styles.copy} source={resources.images.icn_copy} />
              </TouchableOpacity>
            </View>
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
      </View>
    );
  };
  renderVoucher = () => {
    const {
      getOfferList: {voucher},
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
    const {getOfferList} = this.state;

    return (
      <View style={styles.fullScreen}>
        {this.renderHeader()}
        <View style={styles.container}>
          <View style={{marginHorizontal: 20, marginTop: 20}}>
            <Text style={styles.findAnswerText}>
              {resources.strings.OFFER_JUST_FOR_YOU}
            </Text>
          </View>
          <FlatList
            data={getOfferList.offers}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this.offerList}
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
)(OfferScreen);
let loader = APILoadingHOC(container);

loader.getIntent = () => {
  return {
    routeName: OfferScreen.ROUTE_NAME,
  };
};
export default loader;
