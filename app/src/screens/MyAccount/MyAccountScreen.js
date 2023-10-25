import React, {Component} from 'react';
import {View, Text, Image, FlatList, TouchableOpacity} from 'react-native';
import styles from './styles';
import HeaderWithProfile from '../../genriccomponents/header/HeaderWithProfilePic';
import resources from '../../../res';
import {connect} from 'react-redux';
import APILoadingHOC from '../../genriccomponents/HOCS/APILoadingHOC';
import AppUser from '../../utility/AppUser';
import {CommonActions, StackActions} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import AsyncStorageConstants from '../../utility/AsyncStorageConstants';
import {
  onUserLogout,
  updateFcmTokenToServer,
} from '../../redux/actions/LogoutAction';
import {getEnabledPaymentInfo} from '../../redux/actions/PaymentAction';
import {
  optionsForLoggedInRazorpay,
  optionsForNotLoggedIn,
} from './MyAcountOptions';
import {checkIfUserIsLoggedIn, redirectToSign} from '../../utility/Utils';
import NetInfo from '@react-native-community/netinfo';
import FCMServices from '../../utility/FCMServices';
import AsyncStorageContaints from '../../utility/AsyncStorageConstants';
import Store from '../../redux/store/Store';
import {updateRouteNameForSkipSignin} from '../../redux/actions/SkipLoginAction';

class MyAccountScreen extends Component {
  static ROUTE_NAME = 'WishListScreen';
  constructor(props) {
    super(props);
    this.state = {
      enableScrollViewScroll: true,
      currentSeletcedCity: '',
      paymentFlag: 'Payu',
      siFlag: false,
      autoPayFlag: false,
    };
  }
  componentDidFocus = () => {
    // StatusBar.setBarStyle('dark-content');
    // StatusBar.setBackgroundColor(resources.colors.appColor);
  };
  componentDidMount() {
    this.getPaymentInfoData();
    this.props.navigation.addListener('focus', () => this.componentDidFocus());
    let city = AppUser.getInstance().selectedCityName;
    this.setState({
      currentSeletcedCity: city,
    });
  }

  getPaymentInfoData = () => {
    this.props
      .getEnabledPaymentInfo()
      .then(data => {
        this.setState({
          paymentFlag:
            data.paymentgateway != null ? data.paymentgateway : 'Payu',
          siFlag: data.siFlag != null ? data.siFlag : false,
          autoPayFlag: data.autoPayFlag != null ? data.autoPayFlag : false,
        });
      })
      .catch(error => {
        console.log('getEnabledPaymentInfo error', error);
      });
  };

  renderHeader = () => {
    return (
      <HeaderWithProfile
        headerTitle={resources.strings.MY_ACCOUNT}
        isBackIconVisible={true}
        isLogoutVisible={checkIfUserIsLoggedIn()}
        isLoginSignupVisible={!checkIfUserIsLoggedIn()}
        isProfileIconVisible={false}
        onClickLogout={this.onClickLogout}
        onBackClick={this.onBackClick}
        onClickLoginSignup={this.onClickLoginSignup}
      />
    );
  };

  onClickLoginSignup = () => {
    // redirectToSign('MyAccountScreen'); --> From utlis.js
    Store.dispatch(updateRouteNameForSkipSignin('MyAccountScreen'));
    const pushAction = StackActions.push('SigninScreen');
    this.props.navigation.dispatch(pushAction);
  };

  onBackClick = () => {
    this.props.navigation.goBack();
  };
  onClickLogout = () => {
    this.onPressLogout();
  };
  onEnableScroll = value => {
    this.setState({
      enableScrollViewScroll: value,
    });
  };
  renderProductCell = ({item, index}) => {
    return(
      <>
          <View style={styles.paddingView}>
            <Text style={styles.title}>{item.title}</Text>

            <View 
                
            style={{marginTop : 10}}
            >
              {
                item.subMenu?.map((sub,index) => {
                  return(
                    <>
                      <TouchableOpacity 
                        onPress={() => {
                          this.onPressItem(sub);
                        }}
                      style={[styles.directionRow,{marginTop:12,marginBottom:12}]}>
                        <View style={styles.rowDirection}>
                            <View>
                                <Image source={sub.image} style={styles.iconStyle} />
                            </View>
                            <View style={{marginLeft:10,justifyContent:'center'}}>
                                <Text style={styles.mainTitle}>{sub.title}</Text>
                            </View>
                        </View>
                        <View>
                            <Image source={resources.images.icn_profile_arrow}  style={styles.iconStyleArrow} />
                        </View>
                      </TouchableOpacity>
                      
                    </>
                  )
                })
              }
            </View>
          </View>
          <View style={styles.borderClass} />
      </>
    )
    // return (
    //   <TouchableOpacity
    //     style={styles.cardStyle}
        // onPress={() => {
        //   this.onPressItem(item);
        // }}
    //     activeOpacity={0.8}>
    //     <View style={styles.rowDirection}>
    //       <View style={styles.iconBackCon}>
    //         <Image source={item.image} style={styles.iconStyle} />
    //       </View>
    //       <Text style={styles.textStyle}>{item.title}</Text>
    //     </View>
    //     <View
    //       style={{
    //         flexDirection: 'row',
    //         alignItems: 'center',
    //         justifyContent: 'center',
    //       }}>
    //       {item.key == 'change_city' ? (
    //         <Text style={styles.textCityStyle}>
    //           {this.state.currentSeletcedCity}
    //         </Text>
    //       ) : null}
    //       <Image
    //         source={resources.images.inc_right_arrow}
    //         style={styles.arrowStyle}
    //       />
    //     </View>
    //   </TouchableOpacity>
    // );
  };
  onChangeCity = city => {
    this.setState({
      currentSeletcedCity: city,
    });
  };
  onPressItem = item => {
    switch (item.key) {
      case 'change_city':
        this.checkInternetAndGotoScreenWithParams('SelectCityScreen', {
          fromRoute: 'MyAccountScreen',
          callback: this.onChangeCity,
        });
        break;
      case 'profile_settings':
        this.checkInternetAndGotoScreen('ProfileSettingScreen');
        break;
      case 'shipping_address':
        this.checkInternetAndGotoScreen('AddressScreen');
        break;
      case 'referral_code':
        this.checkInternetAndGotoScreen('ReferralCodeScreen');
        break;
      case 'cityfurnish_coins':
        this.checkInternetAndGotoScreen('CfCoinsScreen');
        break;
      case 'documentation':
        // this.checkInternetAndGotoScreen("KycScreen")
        this.checkInternetAndGotoScreen('DocumentationScreen');
        break;
      case 'my_invoice':
        this.checkInternetAndGotoScreen('InvoiceScreen');
        break;
      case 'faq':
        this.checkInternetAndGotoScreen('FaqScreen');
        break;
      case 'privacy_policy':
        this.checkInternetAndGotoScreenWithParams('MiscellaneousScreen', {
          title: 'Privacy Policy',
          key: 'privacy-policy',
        });
        break;
      case 'terms_condition':
        this.checkInternetAndGotoScreenWithParams('MiscellaneousScreen', {
          title: 'Terms and Condition',
          key: 'terms-of-use',
        });
        break;
      case 'orders':
        this.checkInternetAndGotoScreen('MyOrder');
        break;
      case 'my_service_requests':
        this.checkInternetAndGotoScreen('MyServiceRequests');
        break;
      case 'my_notification':
        this.checkInternetAndGotoScreen('MyNotificationScreen');
        break;
      case 'auto_pay':
        this.checkInternetAndGotoScreen('EazyPaymentScreen');
        break;
      case 'change_password':
        this.goToChangePasswordScreen();
        break;
      case 'my_payments':
        this.checkInternetAndGotoScreen('MyPaymentScreen');
        break;
      case 'how_it_works':
        this.checkInternetAndGotoScreen('HowItWorksScreen');
        break;
      case 'contact_us':
        this.props.navigation.navigate('ContactUsScreen');
        break;
      case 'benefits':
        this.checkInternetAndGotoScreen('BenefitsScreen');
        break;
      case 'referral_code_not_loggedin':
        this.props.navigation.navigate('ReferWithoutLogin');
        break;
      case 'corporate_orders':
        this.checkInternetAndGotoScreen('CorporateOrders');
        break;
      case 'customer_payment':
        this.props.navigation.push('CustomerPayment', {
          fromRoute: 'MyAccountScreen',
        });
        break;
    }
  };
  checkInternetAndGotoScreen = screen => {
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        return;
      } else {
        this.props.navigation.navigate(screen);
      }
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

  renderFooter = () => {
    return (
      <>
       <TouchableOpacity 
                        onPress={() => {
                          this.onPressLogout();
                        }}
                      style={[styles.directionRow,{marginTop:12,marginBottom:12,padding:16}]}>
                        <View style={styles.rowDirection}>
                            <View>
                                <Image source={resources.images.icn_profile_logout} style={styles.iconStyle} />
                            </View>
                            <View style={{marginLeft:10,justifyContent:'center'}}>
                                <Text style={styles.mainTitle}>{'Logout'}</Text>
                            </View>
                        </View>
                        <View style={{justifyContent:'center'}}>
                            <Image source={resources.images.icn_profile_arrow}  style={styles.iconStyleArrow} />
                        </View>
                      </TouchableOpacity>
      </>
    );
  };
  render() {
    const {paymentFlag, autoPayFlag} = this.state;
    return (
      <View style={styles.flex1}>
        {this.renderHeader()}
        {/* <View
          style={{backgroundColor: resources.colors.appColor, height: 20}}
        /> */}
        {/* <View style={styles.appBackground} /> */}
        
          <FlatList
            showsVerticalScrollIndicator={false}
            data={
              !checkIfUserIsLoggedIn()
                ? optionsForNotLoggedIn
                : optionsForLoggedInRazorpay(paymentFlag, autoPayFlag)
            }
            keyExtractor={(item, index) => index.toString()}
            renderItem={this.renderProductCell}
            scrollEnabled={true}
            bounces={true}
            ListFooterComponent={this.renderFooter}
          />
        
      </View>
    );
  }
  goToChangePasswordScreen = () => {
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        return;
      } else {
        let userDetails = AppUser.getInstance().userDetails;
        if (userDetails && userDetails.email) {
          this.props.navigation.navigate('ResetPasswordScreen', {
            emailData: userDetails.email.trim().toLowerCase(),
            fromMyAccountScreen: true,
          });
        }
      }
    });
  };
  onPressLogout = async () => {
    try {
      // FCMServices.getInstance().unRegister();
      // this.props.updateFcmTokenToServer("0")

      AsyncStorage.getAllKeys()
        .then(keys => {
          if (keys != '@temp_user_id') AsyncStorage.multiRemove(keys);
        })
        .then(() => console.log('success'));

      let appUsrObj = AppUser.getInstance();
      appUsrObj.token = undefined;
      appUsrObj.userId = undefined;
      appUsrObj.userDetails = undefined;
      appUsrObj.selectedCityId = undefined;
      appUsrObj.selectedCityName = undefined;
      appUsrObj.itemsIncartCount = undefined;
      this.props.onUserLogout();
      const resetAction = CommonActions.reset({
        index: 0,
        routes: [{name: 'SigninScreen'}],
      });
      this.props.navigation.dispatch(resetAction);
    } catch (error) {
      console.log('Error while logging out', error);
    }
  };
}

const mapStateToProps = state => {
  return {};
};
let container = connect(
  mapStateToProps,
  {onUserLogout, updateFcmTokenToServer, getEnabledPaymentInfo},
)(MyAccountScreen);
// let loader = APILoadingHOC(container);

// loader.getIntent = () => {
//   return {
//     routeName: MyAccountScreen.ROUTE_NAME,
//   };
// };

export default container;
