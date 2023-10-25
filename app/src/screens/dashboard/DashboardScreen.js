import React, {Component} from 'react';
import {
  Image,
  Linking,
  Alert,
  AppState,
  PermissionsAndroid,
} from 'react-native';
import resources from '../../../res';
import * as actions from '../../redux/actions/SelectCityAction';
import {connect} from 'react-redux';
import APILoadingHOC from '../../genriccomponents/HOCS/APILoadingHOC';
import {
  isiPhoneX,
  isPlatformIOS,
  checkIfUserIsLoggedIn,
  showSigninAlert,
  getProductIdFromUrl,
  getNavigateUrl,
  getNavigateUrlCode,
  getCustomerFeedbackUrl,
  getCustomerPaymentParameters,
} from '../../utility/Utils';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import WishListScreen from '../wishList/WishlistScreen';
import HomeScreen from '../home/HomeScreen';
import CartScreen from '../cart/CartScreen';
import SearchScreen from '../search/SearchScreen';
import CategoryScreen from '../category/CategoryScreen';
import MyAccountScreen from '../MyAccount/MyAccountScreen';


import AsyncStorage from '@react-native-community/async-storage';
import {
  updateFcmTokenToServer,
  updateContactToServer,
} from '../../redux/actions/LogoutAction';
import {
  checkForAppUpdates,
  getCustomerPaymentUrl,
} from '../../redux/actions/HomeAction';

// import { ZohoSalesIQ } from 'react-native-zohosalesiq-mobilisten';

const Android_App_key =
  'BPK2YzzsJV8SqWcFenYpM3LiMt24mmp8iGMQHvfzyVgB8KSyE9w3q%2BppGWAU3Jd5Mq%2FjiKuw2v1lGn4j1pA4dA%3D%3D';
const android_access_key =
  'BiwZs%2F4HDO%2F6aHAaeCXX1Nljv9XCGoPmyx722%2Fylia%2FvVCCUIz8vDT5AkJW0RJME0PoUhBti0fdor7GzE8bLJhkeslO9obuAaGjxRcAZob9XOpx3gJzCax2RYRRDmlMaSYBv7afMKracv9lQtwghLRPCANC9LnQa';
const ios_app_key =
  'BPK2YzzsJV8SqWcFenYpM3LiMt24mmp8iGMQHvfzyVgB8KSyE9w3q%2BppGWAU3Jd5Mq%2FjiKuw2v1lGn4j1pA4dA%3D%3D';
const ios_access_key =
  'BiwZs%2F4HDO%2F6aHAaeCXX1Nljv9XCGoPmyx722%2Fylia%2FvVCCUIz8vDT5AkJW0RJME%2B73IDl9r0FLEeJ2VnwpICh%2Bv5uLJ8A%2BP8Ntn8PciS2BXOpx3gJzCax2RYRRDmlMaSYBv7afMKracv9lQtwghLRPCANC9LnQa';

import FCMServices from '../../utility/FCMServices';
import {
  NotificationsConstant,
  NotificationsScreen,
} from '../../utility/FCMServices';
import {
  CartIconWithBadge,
  WishlistIconWithBadge,
} from '../../genriccomponents/badge/CartBadge';
import AppToast from '../../genriccomponents/appToast/AppToast';
import AppUser from '../../utility/AppUser';
import DeviceInfo from 'react-native-device-info';
import ProductPage from '../../genriccomponents/subCategory/category/Product';

const Tab = createBottomTabNavigator();

class DashboardScreen extends Component {
  static ROUTE_NAME = 'DashboardScreen';
  constructor(props) {
    super(props);
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this.handleOpenURL);
  }
  getInitialURLAndRedirectAccordingly = async () => {
    if (Platform.OS === 'android') {
      Linking.getInitialURL().then(url => {
        if (url) {
          this.navigateToDeepLink(url);
        }
      });
    }
    Linking.addEventListener('url', this.handleOpenURL);
  };
  handleOpenURL = event => {
    this.navigateToDeepLink(event.url);
  };
  navigateToDeepLink = async url => {
    if (url) {
      let id = getProductIdFromUrl(url);
      let new_navigate_url = url.split('/')[3];
      if (
        id &&
        new_navigate_url !== 'upfront_tenure_extension' &&
        new_navigate_url !== 'city_shield'
      ) {
        this.props.navigation.navigate('ProductDetailScreen', {
          productId: id,
        });
        console.log(new_navigate_url, 'new');
      } else {
        let navigate_url = url.split('/')[3];
        // console.log('navigate_url', navigate_url);
        if (navigate_url === 'upfront_tenure_extension') {
          this.props.navigation.navigate('UpFrontTenureExtension', {id});
        } else if (navigate_url === 'city_shield') {
          this.props.navigation.navigate('CityShieldExtension', {id});
        } else if (navigate_url === 'customerpayment') {
          let code = getNavigateUrlCode('q', url);
          this.customerPaymentRedirect(url, code);
        } else if (navigate_url === 'purchases') {
          this.props.navigation.navigate('MyOrder');
        } else if (navigate_url === 'auto-pay' || navigate_url === 'autopay') {
          this.props.navigation.navigate('EazyPaymentScreen');
        } else if (navigate_url === 'documentation') {
          this.props.navigation.navigate('DocumentationScreen');
        } else {
          navigate_url = getCustomerFeedbackUrl(url);
          if (navigate_url === 'fb' || navigate_url === 'feedback') {
            this.props.navigation.navigate('FeedbackScreen', {
              feedbackURL: url,
            });
          }
        }
      }
    }
  };

  customerPaymentRedirect = async (url, code) => {
    try {
      this.props
        .getCustomerPaymentUrl(code)
        .then(async resp => {
          let paramsData = getCustomerPaymentParameters(
            resp.full_url && resp.full_url != null ? resp.full_url : url,
          );
          for (var key of Object.keys(paramsData)) {
            'email' in paramsData
              ? await AsyncStorage.setItem(
                  '@CUSTOMER_EMAIL',
                  paramsData['email'],
                )
              : '';
            'invoice_number' in paramsData
              ? await AsyncStorage.setItem(
                  '@CUSTOMER_INVOICE_NUMBER',
                  paramsData['invoice_number'],
                )
              : '';
            'amount' in paramsData
              ? await AsyncStorage.setItem(
                  '@CUSTOMER_AMOUNT',
                  paramsData['amount'],
                )
              : '';
            'name' in paramsData
              ? await AsyncStorage.setItem('@CUSTOMER_NAME', paramsData['name'])
              : '';
            'customer_id' in paramsData
              ? await AsyncStorage.setItem(
                  '@CUSTOMER_CUSTOMER_ID',
                  paramsData['customer_id'],
                )
              : '';
            console.log(key + ' => ' + paramsData[key]);
          }
        })
        .catch(err => {
          console.log('Error while customer payment', err);
        });
    } catch (err) {
      console.log('Getting Error to fetch URL', err);
    } finally {
      this.props.navigation.navigate('CustomerPayment', {
        fromRoute: 'DashboardScreen',
      });
    }
  };

  componentDidMount() {
    this.getInitialURLAndRedirectAccordingly();
    let obj = FCMServices.getInstance(this.FCMServiceCallback);
    obj.register(this.onRegister, this.onNotification, this.onOpenNotification);

    // Uncomment this to check app updates
    this.checkForAppUpdates();

    // get user contact
    if (checkIfUserIsLoggedIn()) {
      // this.getUserContactWithPremission();
    }

    
  }

  
  contactsFilter = contacts => {
    if (contacts != null && contacts.length > 0) {
      let contactObj = {};
      let cts = [];
      contacts.filter(contact => {
        if (contact.phoneNumbers != null && contact.phoneNumbers.length > 0) {
          let n1 = '';
          contact.phoneNumbers.filter(number => {
            let num = number.number;
            contact.emailAddresses.filter(email => {
              if (n1 != num) {
                n1 = num;
                if (email != null && email.email != null) {
                  let cObj = {};
                  cObj['name'] =
                    contact.givenName +
                    ' ' +
                    (contact.givenName != contact.familyName
                      ? contact.familyName
                      : '');
                  cObj['email'] = email ? (email.email ? email.email : '') : '';
                  cObj['contact_no'] = num;
                  cts.push(cObj);
                }
              }
            });
          });
        }
      });

      let userId = AppUser.getInstance().userId;
      contactObj.customer_id = userId;
      contactObj.contacts = cts;
      return contactObj;
    }
    return null;
  };

  // fetchContacts = () => {
  //   try {
  //     Contacts.getAll().then(contacts => {
  //       // contacts returned
  //       let numberWithName = this.contactsFilter(contacts);
  //       let stringifyContact = JSON.stringify(numberWithName);
  //       console.log('stringifyContactuser', stringifyContact);
  //       if (numberWithName != null) {
  //         this.updateContactDetails(stringifyContact);
  //       }
  //     });
  //   } catch (err) {
  //     console.log('getting error from fetching user contact');
  //   }
  // };

  updateContactDetails = contact => {
    this.props
      .updateContactToServer(contact)
      .then(resp => {
        console.log(resp.message);
      })
      .catch(err => {
        console.log('Error while updating Contact', err);
      });
  };

  checkForAppUpdates = () => {
    console.log('this is running');
    this.props
      .checkForAppUpdates()
      .then(resp => {
        if (isPlatformIOS) {
          this.checkUpdatesForiOS(resp);
        } else {
          this.checkUpdatesForAndroid(resp);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  showUpdatePopUp = (resp, url) => {
    Alert.alert(
      'Update Cityfurnish?',
      'Cityfurnish recommends you to update application to latest version.',
      [
        {
          text: 'Update',
          onPress: () => {
            Linking.openURL(url);
          },
        },
      ],
      {cancelable: resp.force_update == '0' ? true : false},
    );
  };
  checkUpdatesForAndroid = resp => {
    let appVersion = DeviceInfo.getVersion();
    console.log(appVersion, 'av', resp.data);
    if (appVersion != resp.data.app_v) {
      let URL =
        'app_update_url_android' in resp.data &&
        resp.data.app_update_url_android != ''
          ? resp.data.app_update_url_android
          : 'market://details?id=com.cityfurnish';
      console.log(
        'app_force_update_android',
        resp.data.app_force_update_android,
      );
      if (
        'app_force_update_android' in resp.data &&
        resp.data.app_force_update_android == 0
      ) {
        this.showUpdatePopUp(resp.data, URL);
      } else if (
        'app_force_update_android' in resp.data &&
        resp.data.app_force_update_android == 1
      ) {
        // this.props.navigation.navigate('InAppUpdateScreen', {
        //   resp: resp.data,
        //   appURL: URL,
        // });
      } else {
        this.showUpdatePopUp(resp.data, URL);
      }
    }
  };
  checkUpdatesForiOS = resp => {
    let appVersion = DeviceInfo.getVersion();
    if (appVersion != resp.data.app_v_ios) {
      console.log(appVersion, 'av', resp.data);
      let URL =
        'app_update_url_ios' in resp.data && resp.data.app_update_url_ios != ''
          ? resp.data.app_update_url_ios
          : 'https://apps.apple.com/us/app/cityfurnish/id1526271477';
      if (
        'app_force_update_ios' in resp.data &&
        resp.data.app_force_update_ios == 0
      ) {
        this.showUpdatePopUp(resp.data, URL);
      } else if (
        'app_force_update_ios' in resp.data &&
        resp.data.app_force_update_ios == 1
      ) {
        // this.props.navigation.navigate('InAppUpdateScreen', {
        //   resp: resp.data,
        //   appURL: URL,
        // });
      } else {
        this.showUpdatePopUp(resp.data, URL);
      }
    }
  };
  showUpdatePopUpiOS = (resp, url) => {
    Alert.alert(
      'Update Cityfurnish?',
      'Cityfurnish recommends you to update application to latest version.',
      [
        {
          text: 'Update',
          onPress: () => {
            Linking.openURL(url);
          },
        },
      ],
      {cancelable: resp.force_update_ios == '0' ? true : false},
    );
  };
  FCMServiceCallback = () => {};

  updateFCMToken = fcmToken => {
    this.props
      .updateFcmTokenToServer(fcmToken)
      .then(resp => {
        console.log(resp.message);
      })
      .catch(err => {
        AppToast(err);
        console.log('Error while updating FCM token', err);
      });
  };
  onRegister = fcmToken => {
    if (checkIfUserIsLoggedIn()) {
      this.updateFCMToken(fcmToken);
    }
  };
  onNotification = notification => {
    //FOREGROUND  Notification
    // console.log("FCM  onNotification", notification)

    // comment on 7 Jun in trigger automatically
    this.handleNotificationsClick(notification);
  };
  onOpenNotification = notification => {
    //Background Notification
    // console.log("FCM  onOpenNotification", notification)

    this.handleNotificationsClick(notification);
  };

  render() {
    return (
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = focused
                ? resources.images.icn_home_selected
                : resources.images.icn_home;
            } else if (route.name === 'Products') {
              iconName = focused
                ? resources.images.icn_category_select
                : resources.images.icn_category;
            } else if (route.name === 'Search') {
              iconName = focused
                ? resources.images.icn_search_Selected
                : resources.images.icn_search;
            } else if (route.name === 'Wishlist') {
              return (
                <WishlistIconWithBadge
                  name={
                    focused
                      ? resources.images.icn_wishlist_Select
                      : resources.images.icn_wishlist
                  }
                  tintColor={color}
                />
              );
            } else if (route.name === 'Profile') {
              iconName = focused
                ? resources.images.icn_profile_setting
                : resources.images.icn_profile_setting;
            }
            return (
              <Image
                source={iconName}
                resizeMode={'contain'}
                style={{
                  width: isPlatformIOS ? 25 : 25,
                  height: isPlatformIOS ? 25 : 25,
                  borderWidth: 0,
                  tintColor: color,
                }}
              />
            );
          },
        })}
        tabBarOptions={{
          style: {height: isiPhoneX ? 85 : 57, paddingVertical: 5},
          tabStyle: {height: isiPhoneX ? 55 : 45, backgroundColor: 'white'},
          activeTintColor: 'black',
          inactiveTintColor: 'gray',
          labelStyle: {fontFamily: resources.fonts.regular, fontSize: 12},
        }}>
        <Tab.Screen name="Home" component={HomeScreen} />
        {/* <Tab.Screen name="Products" component={CategoryScreen} /> */}
        <Tab.Screen name="Products" component={ProductPage} />
        {/* <Tab.Screen name="Search" component={SearchScreen} /> */}
        <Tab.Screen
          name="Wishlist"
          component={WishListScreen}
          listeners={({navigation, route}) => ({
            tabPress: e => {
              if (!checkIfUserIsLoggedIn()) {
                // Prevent default action
                e.preventDefault();
                showSigninAlert('Wishlist');
              }
              // Do something with the `navigation` object
              //navigation.navigate('AnotherPlace');
            },
          })}
        />
        <Tab.Screen
          name="Profile"
          component={MyAccountScreen}
          listeners={({navigation, route}) => ({
            tabPress: e => {
              // if (!checkIfUserIsLoggedIn()) {
              //   // Prevent default action
              //   e.preventDefault();
              //   showSigninAlert('Cart');
              // }
            },
          })}
        />
      </Tab.Navigator>
    );
  }

  checkUpdatesFromPushNotification = url => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
        this.props.navigation.navigate('Home');
      }
    });
  };

  handleNotificationsClick = notification => {
    if (!notification.data) {
      return;
    }
    console.log('Bipass', notification.data);
    let type = notification.data.type;
    let screen_name = notification.data.screen_name;
    if (type == 1 || type == '1') {
      let screen_url = '';
      if (screen_name === 'UpdateApp') {
        if (isPlatformIOS) {
          screen_url = 'https://apps.apple.com/us/app/cityfurnish/id1526271477';
          this.checkUpdatesFromPushNotification(screen_url);
        } else {
          screen_url = 'market://details?id=com.cityfurnish';
          this.checkUpdatesFromPushNotification(screen_url);
        }
      } else {
        screen_url = notification.data.screen_url;
        this.checkUpdatesFromPushNotification(screen_url);
      }
    } else if (
      (type == 0 || type == '0') &&
      NotificationsScreen.includes(screen_name)
    ) {
      if (
        'product_id' in notification.data &&
        notification.data.product_id !== ''
      ) {
        let id = notification.data.product_id;
        this.props.navigation.navigate(screen_name, {productId: id});
      } else {
        this.props.navigation.navigate(screen_name);
      }
    } else {
      this.props.navigation.navigate('Home');
    }
    // switch (type) {
    //     case NotificationsConstant.HOME_SCREEN:

    //         break;
    //     case NotificationsConstant.MY_PURCHASE_ORDER_SCREEN:
    //         this.props.navigation.navigate("MyOrder")
    //         break;
    //     case NotificationsConstant.MY_SERVICE_REQUEST_LISTING:
    //         this.props.navigation.navigate("MyServiceRequests")
    //         break;
    //     case NotificationsConstant.PRODUCT_DETAIL_SCREEN:
    //         let id = notification.data.product_id
    //         this.props.navigation.navigate("ProductDetailScreen",
    //             { productId: id })
    //         break;
    //     case NotificationsConstant.OFFER_SCREEN:
    //         this.props.navigation.navigate("OfferScreen")
    //         break;
    //     case NotificationsConstant.CART_SCREEN:
    //         this.props.navigation.navigate("Cart")
    //         break;
    //     case NotificationsConstant.CF_COIN_SCREEN:
    //         this.props.navigation.navigate("CfCoinsScreen")
    //         break;
    //     case NotificationsConstant.INVOICE_SCREEN:
    //         this.props.navigation.navigate("InvoiceScreen")
    //         break;
    //     default:
    //         console.log("Unknown screen type", type)
    // }
  };
}
const mapStateToProps = state => {
  return {};
};
let container = connect(
  mapStateToProps,
  {
    ...actions,
    updateFcmTokenToServer,
    updateContactToServer,
    checkForAppUpdates,
    getCustomerPaymentUrl,
  },
)(DashboardScreen);
let loader = APILoadingHOC(container);

loader.getIntent = () => {
  return {
    routeName: DashboardScreen.ROUTE_NAME,
  };
};

export default loader;
