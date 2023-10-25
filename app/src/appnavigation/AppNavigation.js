import React, {useEffect, useRef} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import analytics from '@react-native-firebase/analytics';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from '../screens/splash/SplashScreen';
import SignupScreen from '../screens/signup/SignupScreen';
import SigninScreen from '../screens/signin/SigninScreen';
import ForgotPasswordScreen from '../screens/forgotPassword/ForgotPasswordScreen';
import FeedbackScreen from '../screens/feedback/FeedbackScreen';
import ProfileSettingScreen from '../screens/profile/ProfileSettingScreen';
import ResetPasswordScreen from '../screens/resetPassword/ResetPasswordScreen';
import FilterScreen from '../screens/filter/FilterScreen';
import SortScreen from '../screens/sort/SortScreen';
import SelectCityScreen from '../screens/selectCity/SelectCityScreen';
import OtpScreen from '../screens/Otp/OtpScreen';
import OfflineNotice from '../genriccomponents/network/Network';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import ReferralCodeScreen from '../screens/referralCode/ReferralCodeScreen';
import EmailScreen from '../screens/signup/EmailScreen';
import ProductDetailScreen from '../screens/products/comboProduct/ProductDetailScreen';
import CategoryScreen from '../screens/category/CategoryScreen';
import FrpCategoryScreen from '../screens/frp/FrpCategoryScreen';
import HomeScreen from '../screens/home/HomeScreen';
import InAppUpdateScreen from '../screens/InAppUpdate/InAppUpdateScreen';
import WishlistScreen from '../screens/wishList/WishlistScreen';
import CartScreen from '../screens/cart/CartScreen';
import SearchScreen from '../screens/search/SearchScreen';
import AddressScreen from '../screens/address/AddressScreen';
import ListAddress from '../screens/address/ListAddress';
import AddAddressScreen from '../screens/address/AddAddressScreen';
import InvoiceScreen from '../screens/invoices/InvoiceScreen';
import CustomerPayment from '../screens/customerPayment/CustomerPayment';
import OneTimePayment from '../screens/customerPayment/onTimePayments/OneTimePayment';
import SiOnCredit from '../screens/customerPayment/siOnCredit/SiOnCredit';
import EditAddressScreen from '../screens/address/editAddress/EditAddressScreen';
import ManageOrderScreen from '../screens/order/ManageOrderScreen';
import ChangePaymentMode from '../screens/changePaymentMode/ChangePaymentMode';
import ThankYouScreen from '../screens/thankYou/ThankYouScreen';
import MyAccountScreen from '../screens/MyAccount/MyAccountScreen';
import OfiiceEnquiryScreen from '../screens/officeEnquiry/OfiiceEnquiryScreen';
import CorporateOrders from '../screens/corporateOrders/CorporateOrders';
import ContactUsScreen from '../screens/contactUs/ContactUsScreen';
import MyNotificationScreen from '../screens/myNotification/MyNotificationScreen';
import PaymentFailed from '../screens/paymentFailed/PaymentFailed';
import BenefitsScreen from '../screens/benefits/BenefitsScreen';
import OfferScreen from '../screens/offer/OfferScreen';
import UpFrontScreen from '../screens/upFront/UpFrontScreen';
import AddCfCoins from '../screens/cfCoins/AddCfCoin';
import CfCoinsScreen from '../screens/cfCoins/CfCoinsScreen';
import MyTransactionDebit from '../screens/myTransaction/MyTransactionDebit';
import MyTransactionCredit from '../screens/myTransaction/MyTransactionCredit';
import MyPaymentScreen from '../screens/myPayment/MyPayment';
import EazyPaymentScreen from '../screens/eazyPayment/EazyPayment';
import EazyPaymentNACHScreen from '../screens/eazyPayment/EazyPaymentNACH';
import MyOrder from '../screens/myOrder/MyOrder';
import ViewOrder from '../screens/viewOrder/ViewOrder';
import FrpProductSuggesionScreen from '../screens/frp/FrpProductSuggesionScreen';
import FixedRentalScreen from '../screens/frp/FixedRentalScreen';
import HowItWorksScreen from '../screens/howItWorks/HowItWorksScreen';
import TermsAndCondition from '../screens/termAndContition/TermsAndCondition';
import CreditScore from '../screens/documentation/creditScrore/CreditScrore';
import CheckCreditScore from '../screens/documentation/creditScrore/CheckCreditScore';
import AutoPaymentScreen from '../screens/documentation/autoPayment/AutoPayment';
import AutoPaymentNACHScreen from '../screens/documentation/autoPayment/AutoPaymentNACH';
import ReferWithoutLogin from '../screens/refferAFriendNotloggedin/ReferWithoutLogin';
import DocumentationScreen from '../screens/documentation/DocumentationScreen';
import KycScreen from '../screens/documentation/kyc/KycScreen';
import EditKycScreen from '../screens/documentation/kyc/EditKycScreen';
import MiscellaneousScreen from '../screens/Miscellaneous/MiscellaneousScreen';
import FaqScreen from '../screens/Miscellaneous/FaqScreen';
import OrderSummaryScreen from '../screens/cart/orderSummary/OrderSummaryScreen';
import PayOutstandingScreen from '../screens/invoices/PayOutstandingScreen';
import MyServiceRequests from '../screens/myOrder/MyServiceRequests';
import HowReferCoinsWorksScreen from '../screens/refferAFriendNotloggedin/howReferCoinsWork/HowReferCoinsWorksScreen';
import FaqScreenWithHtml from '../screens/Miscellaneous/FaqScreenWithHtml';
import EnterDetailsForAppleSignup from '../screens/signup/EnterDetailsForAppleSignup';
import UpFrontTenureExtensionScreen from '../screens/upFront/UpFrontTenureExtensionScreen';
import CityShieldExtension from '../screens/cityshieldextension/CityShieldExtension';
import ExplorerCombos from '../screens/combos';
import OnboardingScreen from '../screens/OnBoarding';
import CongratulationScreen from '../screens/documentation/kyc/CongratulationScreen';
import ProductPage from '../genriccomponents/subCategory/category/Product';
import OrderComplete from '../screens/order/OrderComplete';

import AsyncStorage from '@react-native-community/async-storage';

const Stack = createStackNavigator();
function AppNavigation() {
  const navigationRef = useRef();
  const routeNameRef = useRef();
  // let isInitialRoute = ""
  // useEffect(async () => {
  //    isInitialRoute = "OnboardingScreen"
  //   const value = await AsyncStorage.getItem('CityList');
  //     if (value !== null) {
  //       isInitialRoute = "SplashScreen"
  //     }
  // },[])


  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() =>
        (routeNameRef.current = navigationRef.current.getCurrentRoute().name)
      }
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.current.getCurrentRoute().name;
        const trackScreenView = async () => {
          // Your implementation of analytics goes here!

          await analytics().logScreenView({
            screen_name: currentRouteName,
            screen_class: currentRouteName,
          });
        };

        if (previousRouteName !== currentRouteName) {
          // Replace the line below to add the tracker from a mobile analytics SDK
          trackScreenView(currentRouteName);
        }
        
        // Save the current route name for later comparison
        routeNameRef.current = currentRouteName;
      }}>


      <Stack.Navigator
        initialRouteName="SplashScreen"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name={'OnboardingScreen'} component={OnboardingScreen} />  
        <Stack.Screen name={'FaqScreen'} component={FaqScreen} />
        <Stack.Screen name={'ExplorerCombos'} component={ExplorerCombos} />
        <Stack.Screen name={'CheckCreditScore'} component={CheckCreditScore} />
        <Stack.Screen name={'CreditScore'} component={CreditScore} />
        <Stack.Screen
          name={'AutoPaymentScreen'}
          component={AutoPaymentScreen}
        />
        <Stack.Screen
          name={'AutoPaymentNACHScreen'}
          component={AutoPaymentNACHScreen}
        />
        <Stack.Screen name={'MyPaymentScreen'} component={MyPaymentScreen} />
        <Stack.Screen
          name={'EazyPaymentScreen'}
          component={EazyPaymentScreen}
        />
        <Stack.Screen
          name={'EazyPaymentNACHScreen'}
          component={EazyPaymentNACHScreen}
        />
        <Stack.Screen
          name={'MyTransactionCredit'}
          component={MyTransactionCredit}
        />
        <Stack.Screen
          name={'MyTransactionDebit'}
          component={MyTransactionDebit}
        />
        <Stack.Screen
          name={'FrpProductSuggesionScreen'}
          component={FrpProductSuggesionScreen}
        />
        <Stack.Screen name={'CfCoinsScreen'} component={CfCoinsScreen} />
        <Stack.Screen name={'MyAccountScreen'} component={MyAccountScreen} />
        <Stack.Screen
          name={'ProductDetailScreen'}
          component={ProductDetailScreen}
        />
        <Stack.Screen
          name={'ReferralCodeScreen'}
          component={ReferralCodeScreen}
        />
        <Stack.Screen name={'DashboardScreen'} component={DashboardScreen} />
        <Stack.Screen name={'FilterScreen'} component={FilterScreen} />
        <Stack.Screen
          name={'ResetPasswordScreen'}
          component={ResetPasswordScreen}
        />
        <Stack.Screen
          name={'ProfileSettingScreen'}
          component={ProfileSettingScreen}
        />
        <Stack.Screen name={'SplashScreen'} component={SplashScreen} />
        <Stack.Screen name={'SignupScreen'} component={SignupScreen} />
        <Stack.Screen name={'SigninScreen'} component={SigninScreen} />
        <Stack.Screen
          name={'ForgotPasswordScreen'}
          component={ForgotPasswordScreen}
        />
        <Stack.Screen name={'FeedbackScreen'} component={FeedbackScreen} />
        <Stack.Screen name={'SortScreen'} component={SortScreen} />
        <Stack.Screen name={'SelectCityScreen'} component={SelectCityScreen} />
        <Stack.Screen name={'OtpScreen'} component={OtpScreen} />
        <Stack.Screen name={'EmailScreen'} component={EmailScreen} />
        <Stack.Screen name={'CategoryScreen'} component={CategoryScreen} />
        <Stack.Screen name={'Products'} component={ProductPage} />
        <Stack.Screen
          name={'FrpCategoryScreen'}
          component={FrpCategoryScreen}
        />
        <Stack.Screen name={'HomeScreen'} component={HomeScreen} />
        <Stack.Screen name={'Home'} component={HomeScreen} />
        <Stack.Screen
          name={'InAppUpdateScreen'}
          component={InAppUpdateScreen}
        />
        <Stack.Screen name={'WishlistScreen'} component={WishlistScreen} />
        <Stack.Screen name={'CartScreen'} component={CartScreen} />
        <Stack.Screen name={'SearchScreen'} component={SearchScreen} />
        <Stack.Screen name={'AddressScreen'} component={AddressScreen} />
        <Stack.Screen name={'ListAddress'} component={ListAddress} />
        <Stack.Screen name={'AddAddressScreen'} component={AddAddressScreen} />
        <Stack.Screen name={'InvoiceScreen'} component={InvoiceScreen} />
        <Stack.Screen name={'CustomerPayment'} component={CustomerPayment} />
        <Stack.Screen name={'OneTimePayment'} component={OneTimePayment} />
        <Stack.Screen name={'SiOnCredit'} component={SiOnCredit} />
        <Stack.Screen
          name={'EditAddressScreen'}
          component={EditAddressScreen}
        />
        <Stack.Screen
          name={'ManageOrderScreen'}
          component={ManageOrderScreen}
        />
        <Stack.Screen
          name={'ChangePaymentMode'}
          component={ChangePaymentMode}
        />
        <Stack.Screen name={'ThankYouScreen'} component={ThankYouScreen} />
        <Stack.Screen name={'AddCfCoins'} component={AddCfCoins} />
        <Stack.Screen
          name={'OfiiceEnquiryScreen'}
          component={OfiiceEnquiryScreen}
        />
        <Stack.Screen name={'CorporateOrders'} component={CorporateOrders} />
        <Stack.Screen name={'ContactUsScreen'} component={ContactUsScreen} />
        <Stack.Screen
          name={'MyNotificationScreen'}
          component={MyNotificationScreen}
        />
        <Stack.Screen name={'PaymentFailed'} component={PaymentFailed} />
        <Stack.Screen name={'BenefitsScreen'} component={BenefitsScreen} />
        <Stack.Screen name={'OfferScreen'} component={OfferScreen} />
        <Stack.Screen name={'UpFrontScreen'} component={UpFrontScreen} />
        <Stack.Screen
          name={'UpFrontTenureExtension'}
          component={UpFrontTenureExtensionScreen}
        />
        <Stack.Screen
          name={'CityShieldExtension'}
          component={CityShieldExtension}
        />
        <Stack.Screen name={'MyOrder'} component={MyOrder} />
        <Stack.Screen name={'ViewOrder'} component={ViewOrder} />
        <Stack.Screen
          name={'FixedRentalScreen'}
          component={FixedRentalScreen}
        />
        <Stack.Screen name={'HowItWorksScreen'} component={HowItWorksScreen} />
        <Stack.Screen
          name={'TermsAndCondition'}
          component={TermsAndCondition}
        />
        <Stack.Screen
          name={'ReferWithoutLogin'}
          component={ReferWithoutLogin}
        />
        <Stack.Screen
          name={'DocumentationScreen'}
          component={DocumentationScreen}
        />
        <Stack.Screen name={'KycScreen'} component={KycScreen} />
        <Stack.Screen name={'EditKycScreen'} component={EditKycScreen} />
        <Stack.Screen
          name={'MiscellaneousScreen'}
          component={MiscellaneousScreen}
        />
        <Stack.Screen
          name={'OrderSummaryScreen'}
          component={OrderSummaryScreen}
        />
        <Stack.Screen
          name={'PayOutstandingScreen'}
          component={PayOutstandingScreen}
        />
        <Stack.Screen
          name={'MyServiceRequests'}
          component={MyServiceRequests}
        />
        <Stack.Screen
          name={'HowReferCoinsWorksScreen'}
          component={HowReferCoinsWorksScreen}
        />
        <Stack.Screen
          name={'FaqScreenWithHtml'}
          component={FaqScreenWithHtml}
        />
        <Stack.Screen
          name={'EnterDetailsForAppleSignup'}
          component={EnterDetailsForAppleSignup}
        />
        <Stack.Screen name={'CongratulationScreen'} component={CongratulationScreen} />
        <Stack.Screen
          name={'OrderComplete'}
          component={OrderComplete}
        />
      </Stack.Navigator>
      <OfflineNotice />
    </NavigationContainer>
  );
}
export default AppNavigation;
