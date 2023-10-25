import React, {Component, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  Linking,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import MaterialInput from '../../genriccomponents/input/MaterialInput';
import styles from './styles';
import Button from '../../genriccomponents/button/Button';
import resource from '../../../res';
import SocialLoginView from '../../genriccomponents/socialLogin/SocialLoginView';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import OTPInputView from '@twotalltotems/react-native-otp-input';

import {
  validateEmail,
  validateMobileNumber,
  focusTo,
  renderInputError,
  isPlatformIOS,
  myWidth,
} from '../../utility/Utils';
import {connect} from 'react-redux';
import APILoadingHOC from '../../genriccomponents/HOCS/APILoadingHOC';
import * as actions from '../../redux/actions/SigninAction';
import {
  hitSocialLoginApi,
  hitLinkedinApiToGetUser,
  hitDirectSocialLoginApi,
  hitFacebookApiToGetUser,
} from '../../redux/actions/SocialLoginAction';
//import {InitLinkedinLogin} from '../../utility/SocialLoginUtils';
import {
  configureGoogleSignin,
  initializeGoogleLogin,
  initializeFacebookLogin,
  LOGIN_TYPE,
} from '../../utility/SocialLoginUtils';
import AppUser from '../../utility/AppUser';
import AsyncStorageContaints from '../../utility/AsyncStorageConstants';
import {hitSendOtpApi} from '../../redux/actions/OtpAction';
import {
  CommonActions,
  StackActions,
  useNavigation,
} from '@react-navigation/native';
import {MyStatusBar} from '../../genriccomponents/header/HeaderAndStatusBar';
import {updateFcmTokenToServer} from '../../redux/actions/LogoutAction';
import {onUpdateCartBadgeCount} from '../../redux/actions/CartAction';
import {onUpdateWishlistBadgeCount} from '../../redux/actions/WishListAction';
import AppToast from '../../genriccomponents/appToast/AppToast';
import appleAuth, {
  AppleButton,
  AppleAuthRequestOperation,
  AppleAuthRequestScope,
  AppleAuthCredentialState,
} from '@invertase/react-native-apple-authentication';
import DeviceInfo from 'react-native-device-info';
import {BASE_URL} from '../../apimanager/ApiEndpoint';
import WhatsAppLoginButton from '../../genriccomponents/WhatsappLoginButton/WhatsAppLoginButton';
import strings from '../../../res/constants/strings';
import {DoneReceiveOtpModal} from './DontReceiveOtpModal';
import resources from '../../../res';

const SigninScreen = props => {
  const navigation = useNavigation();
  const [emailOrMobile, set_emailOrMobile] = useState('');
  const [password, set_password] = useState('');
  const [fromOtpless, set_fromOtpless] = useState(false);
  const [updateEmail, set_updateEmail] = useState('');
  const [newFullName, set_newFullName] = useState('');
  const [countDown, set_countDown] = useState(30);
  const [otp, set_otp] = useState('');
  const [isPassVisible, set_isPassVisible] = useState(true);
  const [isMobileLogin, set_isMobileLogin] = useState(false);
  const [isLinkedinClicked, set_isLinkedinClicked] = useState(false);
  const [isOtpInputFIeldVisible, set_isOtpInputFIeldVisible] = useState(false);
  const [isGetOtpTextVisible, set_isGetOtpTextVisible] = useState(true);
  const [error, set_error] = useState({});
  const [isPasswordFocused, set_isPasswordFocused] = useState(false);
  const [isOtpSent, set_isOtpSent] = useState(false);
  const [emailFieldVisible, set_emailFieldVisible] = useState(false);
  const [saveEmailButton, set_saveEmailButton] = useState(false);
  const [isTimeVisible, set_isTimeVisible] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [isEmailView,setIsEmailView] = useState(false)
  const [isRefferalCodeScreen,setIsRefferalCodeScreen] = useState(false)
  const [saveResultData,setSaveResultData] = useState(null)
  const [emailList,setEmailList] = useState([])
  const emailRef = useRef();
  const otpRef = useRef();
  const saveEmailRef = useRef();
  const passwordRef = useRef();
  const linkedinRef = useRef();
  const intervalRef = useRef(null);

  // otpless login section
  useEffect(() => {
    console.log('this is running as well');
    const linkingEvent = Linking.addEventListener('url', handleDeepLink);
    Linking.getInitialURL().then(url => {
      if (url) {
        handleDeepLink({url});
      }
    });

    return () => null;
  }, [handleDeepLink]);

  const handleDeepLink = async url => {
    const newUrl = url.url;
    const waId = newUrl.slice(newUrl.indexOf('=') + 1);
    console.log(newUrl, waId);

    var myHeaders = new Headers();
    myHeaders.append('clientId', strings.clientId);
    myHeaders.append('clientSecret', strings.clientSecret);
    myHeaders.append('Content-Type', 'application/json');

    var raw = JSON.stringify({
      waId,
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
    };

    fetch('https://cityfurnish.authlink.me', requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status == 'SUCCESS') {
          return result.user.waNumber;
        } else {
        }
      })
      .then(number => {
        var formdata = new FormData();
        formdata.append('mobile_number', number.slice(2));

        var requestOptions = {
          method: 'POST',
          // headers: myHeaders,
          body: formdata,
          // redirect: 'follow',
        };

        fetch(`${BASE_URL}/v1/user/otpless_login`, requestOptions)
          .then(response => response.json())
          .then(result => {
            if (result.status_code == 200) {
              // const obj = new SigninScreen();
              // obj.saveFromAsynAndNavigate(result);
              saveFromAsynAndNavigate(result);
            } else if (result.data.status_code == '100') {
              //console.log("OOOOOOOO ::",result);
              // set_emailOrMobile(number.slice(2));
              // set_emailFieldVisible(true);
              setSaveResultData(result)
              setEmailList(result?.data?.data)
              //saveFromAsynAndNavigate(result);
              setIsEmailView(true)
              set_isOtpSent(false)
              //set_fromOtpless(true);
            } else {
              AppToast.showToast('Something went wrong');
            }
          })
          .catch(error => console.log('error', error));
      })
      .catch(error => console.log('error', error));
  };

  useEffect(() => {
    if (countDown < 1) {
      clearInterval(intervalRef.current);
      set_countDown(30);
      set_isTimeVisible(false);
    }
  }, [countDown]);

  const callbackToRemoveError = key => {
    if (error.hasOwnProperty(key)) {
      error[key] = '';

      set_error(error);
    }
  };


  const otplessEmailUpdate = () => {
    var formdata = new FormData();
    formdata.append('mobile_number', emailOrMobile);
    formdata.append('email', updateEmail);

    var requestOptions = {
      method: 'POST',
      // headers: myHeaders,
      body: formdata,
      // redirect: 'follow',
    };

    console.log(formdata);

    fetch(`${BASE_URL}/v1/user/otpless_login`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.status_code == 200) {
          saveFromAsynAndNavigate(result);
        } else if (result.data.status_code == '100') {
          // console.log(result);
          set_emailOrMobile(emailOrMobile);
          set_emailFieldVisible(true);
          set_fromOtpless(true);
        } else {
          console.log(result);
          AppToast('Something went wrong');
        }
      })
      .catch(error => console.log('error', error));
  };

  const onChangeEmail = text => {
    if (text.length >= 10) {
      if (validateMobileNumber(text)) {
        // this.setState({isMobileLogin: true, emailOrMobile: text});
        set_isMobileLogin(true);
        set_emailOrMobile(text);
      } else {
        set_isMobileLogin(false);
        set_emailOrMobile(text);
        set_isGetOtpTextVisible(false);
        set_isGetOtpTextVisible(true);
        set_otp('');
      }
    } else {
      set_isMobileLogin(false);
      set_emailOrMobile(text);
      set_isOtpInputFIeldVisible(false);
      set_isGetOtpTextVisible(true);
      set_otp('');
    }
  };

  const onChangeUpdateEmail = text => {
    let regex = new RegExp('[a-z0-9]+@[a-z0-9]+.[a-z]{2,3}');
    if (regex.test(text)) {
      set_saveEmailButton(true);
    }

    set_updateEmail(text);
  };

  const onPressGetOtp = () => {
    // const {emailOrMobile} = this.state;
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
          console.log(result);
          if (result.status_code == '200')
            // this.setState({
            //   isOtpSent: true,
            // });
            set_isOtpSent(true);
          startCountDown();
        })
        .catch(error => console.log('error', error));
    } else {
      AppToast('Please fill your Mobile number properly');
    }
  };

  const focusToNext = () => {
    // const {isMobileLogin} = this.state;
    if (isMobileLogin) {
      // focusTo(this.otpRef)
    } else {
      focusToNext(passwordRef);
    }
  };

  const onChangeOtp = text => {
    // this.setState({otp: text});
    set_otp(text);
  };

  const onChangeNewFullName = text => {
    // this.setState({newFullName: text});
    set_newFullName(text);
  };

  const saveFromAsynAndNavigate = async data => {
    
    const {toScreenName} = props;
    let appUsrObj = AppUser.getInstance();
    appUsrObj.token = data.data.access_token;
    appUsrObj.userId = data.data.id.toString();
    appUsrObj.userDetails = data.data;

    if (appUsrObj.userDetails) {
      appUsrObj.itemsIncartCount = parseInt(
        appUsrObj.userDetails.itemsIncartCount,
      );
      props.onUpdateCartBadgeCount(appUsrObj.itemsIncartCount);
      appUsrObj.wishlistCount = parseInt(
        appUsrObj.userDetails.WishlistItemsCount,
      );
      props.onUpdateWishlistBadgeCount(appUsrObj.wishlistCount);
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
        // oldest logic
        const resetAction = CommonActions.reset({
          index: 0,
          routes: [{name: 'SelectCityScreen'}],
        });
        props.navigation.dispatch(resetAction);

        // older logi
        // const resetAction = CommonActions.reset({
        //   index: 0,
        //   type: 'tab',
        //   routes: [{name: 'Cart'}],
        // });
        // props.navigation.dispatch(resetAction);

        // my logic
        // navigation.navigate('DashboardScreen');
        // console.log(props.navigation);
        // navigation.navigate('Cart');
        console.log('zees worked');
      } else {
        let obj = AppUser.getInstance();
        let token = obj.fcmToken;
        if (token) {
          props.updateFcmTokenToServer(token);
        }
        if (navigation.canGoBack()) navigation.pop();

        if (toScreenName.includes('ProductDetailScreen')) {
          let arr = toScreenName.split('_');
          let id = parseInt(arr[1]);
          navigation.navigate('ProductDetailScreen', {
            productId: id,
          });
        } else {
          navigation.navigate(toScreenName);
        }
      }
      AppToast('Login Successfully.!');
    } catch (e) {
      console.log('Error saving user details', e);
    }
  };

  const onPressVerifyOtp = () => {
    // const {emailOrMobile, otp} = this.state;
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
          console.log(result);
          if (result.status_code == '200') {
            AppToast(result.message);
            saveFromAsynAndNavigate(result);
          } else if (result.status_code == '400') {
            if (result.data.status_code == '100') {
              AppToast(result.data.message);
              // this.setState({
              //   emailFieldVisible: true,
              // });
              set_emailFieldVisible(true);
            } else AppToast(result.message);
            console.log(result.data.message);
          } else {
            AppToast(result.message);
          }
        })
        .catch(error => console.log('error', error));
    } else {
      AppToast('Please fill your Mobile number properly');
    }
  };

  const onSaveEmail = (email) => {
    // const {emailOrMobile, otp, updateEmail} = this.state;
    if (emailOrMobile.trim() != '' && emailOrMobile.trim().length == 10) {
      var formdata = new FormData();
      formdata.append('mobile_number', emailOrMobile);
      formdata.append('otp', otp);
      formdata.append('email', email ? email : updateEmail);

      var requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
      };

      fetch(`${BASE_URL}/v1/user/verifyotp_new`, requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(' :: 123 heres the result ::',result);
          if (result.status_code == '200') {
            AppToast(result.message);
            saveFromAsynAndNavigate(result);
            setSaveResultData(result)
            setIsRefferalCodeScreen(true)
            set_isOtpSent(false)
          } else if (result.status_code == '400') {
            if (result.data.status_code == '100') {
              // AppToast(result.data.message);
              // this.setState({
              //   emailFieldVisible: true,
              // });
              // set_emailFieldVisible(true);
              setSaveResultData(result)
              setEmailList(result.data.data)
              //saveFromAsynAndNavigate(result);
              setIsEmailView(true)
              set_isOtpSent(false)
            } else {
              setSaveResultData(result)
              AppToast(result.message)
              //saveFromAsynAndNavigate(result);
            };
          } else {
            setSaveResultData(result)
            //saveFromAsynAndNavigate(result);
            AppToast(result.message);
          }
        })
        .catch(error => console.log('error', error));
    } else {
      AppToast('Please fill your Mobile number properly');
    }
  };

  const startCountDown = () => {
    // this.setState({
    //   isTimeVisible: true,
    // });
    set_isTimeVisible(true);
    intervalRef.current = setInterval(
      () => set_countDown(prevState => prevState - 1),
      1000,
    );
  };

  const gotoSelectCityAndReset = () => {
    const {toScreenName} = props;
    if (toScreenName == '') {
      props.navigation.navigate('SelectCityScreen');
    } else {
      props.navigation.pop();
    }
  };

  return (
    <View style={styles.fullScreen}>
      <MyStatusBar
        barStyle="dark-content"
        backgroundColor={resource.colors.white}
      />
      {/* <ImageBackground
        source={resource.images.splash_background}
        style={styles.backgroundImage}> */}
        <KeyboardAwareScrollView
          bounces={false}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}>

          {
            isRefferalCodeScreen == true ?
            <TouchableOpacity onPress={() => {setIsRefferalCodeScreen(false);setIsEmailView(true)}}  style={{padding: 18, marginTop: 50}}>
            <Image style={{width:20,height:20}} source={resources.images.icon_leftA} />
          </TouchableOpacity> 
            :
            isEmailView == true ? 
              <TouchableOpacity onPress={() => {set_isOtpSent(true);setIsEmailView(false)}}  style={{padding: 18, marginTop: 50}}>
                <Image style={{width:20,height:20}} source={resources.images.icon_leftA} />
              </TouchableOpacity> 
            : 
            isOtpSent == true ?
            <TouchableOpacity onPress={() => set_isOtpSent(false)} style={{padding: 18, marginTop: 50}}>
            <Image style={{width:20,height:20}} source={resources.images.icon_leftA} />
          </TouchableOpacity> 
            : null

          }


          {
            isRefferalCodeScreen == true ?

<View style={{marginLeft: 18,marginRight:18, marginTop: 0}}>
              <Text style={styles.titleText}>Want to claim a referral code?</Text>
              <Text style={styles.subTitleText}>
              Enter the referral code
              </Text>
            </View>
            :

          isEmailView == true ?

<View style={{marginLeft: 18,marginRight:18, marginTop: 0}}>
              <Text style={styles.titleText}>Your mobile number
is linked to {emailList?.length} email ids</Text>
              <Text style={styles.subTitleText}>
                Please select an email from the list below to continue
              </Text>
            </View>
          :
          isOtpSent == false ? (
            <View style={{padding:18, marginTop: 50}}>
              <Text style={styles.titleText}>Sign In</Text>
              <Text style={styles.subTitleText}>
                Tell us your mobile number
              </Text>
            </View>
          ) : (
            <View style={{marginLeft: 18,marginRight:18, marginTop: 0}}>
              <Text style={styles.titleText}>Enter a 5 digit OTP</Text>
              <Text
                style={
                  styles.subTitleText
                }>{`We sent a 5-digit OTP on +91-${emailOrMobile}`}</Text>
            </View>
          )}

          <View style={styles.container}>
            <View style={{marginBottom: 0}}>
              {
                isRefferalCodeScreen == true ?
                  <>
                  <MaterialInput
                    label={'Referral code'}
                    value={""}
                    onChangeText={onChangeEmail}
                    callbackToRemoveError={callbackToRemoveError}
                    //isGetOtpTextVisible={isMobileLogin && isGetOtpTextVisible}
                    //onPressGetOtp={onPressGetOtp}
                    reference={emailRef}
                    inputProps={{
                      maxLength: isMobileLogin ? 10 : 100,
                      autoCaptialize: 'none',
                      returnKeyType: 'next',
                    }}
                    onSubmitEditing={focusToNext}
                    isBorderGetOtpThick={true}
                    isGetOtpClickable={isTimeVisible}
                  />
<Button
                    btnStyle={[
                      styles.checkotBtnStyle,
                      {
                        marginTop: 0,
                        marginBottom: 0,
                        width: '100%',
                        alignSelf: 'center',
                        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',padding:10,
                        backgroundColor:'#C0C0C6'
                      },
                    ]}
                    rounded
                    btnText={'Claim and proceed'}
                    showRightIcon={true}
                    textStyle={{color: resource.colors.white}}
                    onPress={() => console.log("")}
                  ></Button>

                  <View style={{marginTop:20}}>
                    <Image source={resource.images.icon_hairLine} style={{width:myWidth-40,height:10}} />
                  </View>
                  <View style={{height: 20}} />

                  <Button
                    btnStyle={[
                      styles.checkotBtnStyle,
                      {
                        marginTop: 0,
                        marginBottom: 0,
                        width: '100%',
                        alignSelf: 'center',
                        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',padding:10,
                        
                      },
                    ]}
                    rounded
                    btnText={'Skip'}
                    showRightIcon={true}
                    textStyle={{color: resource.colors.white}}
                    onPress={() => {
                      saveFromAsynAndNavigate(saveResultData);
                    }}
                  ></Button>
                  </>
                :
              isEmailView == true ?
                <FlatList 
                  data={emailList}
                  ItemSeparatorComponent={() => {
                    return (
                      <>
                        <View style={{borderWidth:1,marginTop:15,borderColor:'#EDEDEE'}} />
                      </>
                    )
                  }}
                  renderItem={({item,index}) => {
                    return(
                      <>
                      <View style={{marginTop:20}}>
                        <TouchableOpacity onPress={() => {
                          set_updateEmail(item)
                          onSaveEmail(item)


                        } } style={styles.flexDirectionRow}>
                          <View>
                            <Text style={styles.emailText}>{item}</Text>
                          </View>
                          <View style={styles.centerClass}>
                            <Image source={resources.images.icon_rightA} style={{width:20,height:20}} />
                          </View>
                        </TouchableOpacity>
                        
                      </View>
                      </>
                    )
                  }}
                />

              :
              
              isOtpSent == false ? (
                <>
                  <MaterialInput
                    label={'Mobile Number'}
                    value={emailOrMobile}
                    onChangeText={onChangeEmail}
                    error={renderInputError('email', error)}
                    errorKey={'email'}
                    callbackToRemoveError={callbackToRemoveError}
                    //isGetOtpTextVisible={isMobileLogin && isGetOtpTextVisible}
                    //onPressGetOtp={onPressGetOtp}
                    reference={emailRef}
                    inputProps={{
                      maxLength: isMobileLogin ? 10 : 100,
                      autoCaptialize: 'none',
                      returnKeyType: 'next',
                    }}
                    onSubmitEditing={focusToNext}
                    isBorderGetOtpThick={true}
                    isGetOtpClickable={isTimeVisible}
                  />

                  <Button
                    btnStyle={[
                      styles.checkotBtnStyle,
                      {
                        marginTop: 0,
                        marginBottom: 0,
                        width: '100%',
                        alignSelf: 'center',
                        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',padding:10,
                        
                      },
                    ]}
                    rounded
                    btnText={'Request OTP'}
                    showRightIcon={true}
                    textStyle={{color: resource.colors.white}}
                    onPress={onPressGetOtp}
                  >

                  </Button>
                </>
              ) : null}

              {isOtpSent && (
                <View style={styles.loginContainer}>
                  <OTPInputView
                    style={{width: '100%', height: 80}}
                    pinCount={5}
                    // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                    // onCodeChanged = {code => { this.setState({code})}}
                    autoFocusOnLoad
                    codeInputFieldStyle={styles.underlineStyleBase}
                    codeInputHighlightStyle={styles.underlineStyleHighLighted}
                    onCodeFilled={code => {
                      console.log(`Code is ${code}, you are good to go!`);
                      //this.setState({otp: code});
                      set_otp(code);
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => setIsModal(true)}
                    style={{marginTop: 15, marginBottom: 15}}>
                    <Text
                      style={
                        styles.subTitleText1
                      }>{`Didn’t receive the OTP?`}</Text>
                  </TouchableOpacity>
                  
                </View>
              )}

              {/* {emailFieldVisible && (
                <MaterialInput
                  label={'Email *'}
                  value={updateEmail}
                  onChangeText={onChangeUpdateEmail}
                  error={renderInputError('saveEmail', error)}
                  errorKey={'saveEmail'}
                  callbackToRemoveError={callbackToRemoveError}
                  // saveEmail={saveEmailButton}
                  // onSaveEmail={onSaveEmail}
                  reference={saveEmailRef}
                  onSubmitEditing={focusToNext}
                  isBorderGetOtpThick={true}
                />
              )} */}

              {
              isEmailView == true || isRefferalCodeScreen == true ?
              null :
              isOtpSent == false ? (
                <>
                  
                  <View style={{marginTop:20}}>
                    <Image source={resource.images.icon_hairLine} style={{width:myWidth-40,height:10}} />
                  </View>
                  <View style={{height: 20}} />
                  <WhatsAppLoginButton />
                </>
              ) : null}

              {isTimeVisible && isOtpSent == true ? (
                <Text style={{alignSelf: 'center', marginBottom: 10}}>
                  00 : {countDown >= 10 ? countDown : `0${countDown}`}
                </Text>
              ) : null}

              {(fromOtpless || isOtpSent) && (
                <>
                <View style={{height:20}} />
                <Button
                  btnStyle={[
                    styles.checkotBtnStyle,
                    {
                      marginTop: 0,
                      marginBottom: 0,
                      width: '100%',
                      alignSelf: 'center',
                      justifyContent:'space-between',
                      flexDirection:'row',
                      padding:10,
                    },
                  ]}
                  rounded
                  btnText={'Verify OTP'}
                  showRightIcon={true}
                  textStyle={{color: resource.colors.white}}
                  onPress={fromOtpless ? otplessEmailUpdate : onSaveEmail}
                />
                </>
              )}
            </View>
          </View>
        </KeyboardAwareScrollView>
      {/* </ImageBackground> */}
      {isModal ? (
        <DoneReceiveOtpModal
          visibleModal={isModal}
          titlemodel={'Didn’t receive the OTP?'}
          onPressBackDrop={() => setIsModal(false)}
          onPressGetOtp={onPressGetOtp}
          onChangeMobileNumner={() => {
            set_isOtpSent(false);
            setIsModal(false);
            set_isTimeVisible(false);
          }}
        />
      ) : null}
    </View>
  );
};

// class SigninScreenClass extends Component {
//   static ROUTE_NAME = 'SigninScreen';
//   constructor(props) {
//     super(props);
//     this.state = {
//       emailOrMobile: '',
//       password: '',
//       otp: '',
//       isPassVisible: true,
//       isMobileLogin: false,
//       isLinkedinClicked: false,
//       isOtpInputFIeldVisible: false,
//       isGetOtpTextVisible: true,
//       error: {},
//       isPasswordFocused: false,

//       // for flow change
//       isOtpSent: false,
//       emailFieldVisible: false,
//       updateEmail: '',
//       saveEmailButton: false,
//       newFullName: '',
//       isTimeVisible: false,
//       countDown: 30,
//     };
//     this.emailRef = React.createRef();
//     this.otpRef = React.createRef();
//     this.saveEmailRef = React.createRef();
//     this.passwordRef = React.createRef();
//     this.linkedinRef = React.createRef();
//   }

//   /*
//    * In this method performing tasks once UI is loaded.
//    */
//   componentDidMount() {
//     configureGoogleSignin();
//   }

//   componentDidUpdate() {
//     if (this.state.countDown === 1) {
//       clearInterval(this.interval);
//       this.setState({
//         countDown: 30,
//         isTimeVisible: false,
//       });
//     }
//   }

//   componentWillUnmount() {
//     clearInterval(this.interval);
//   }

//   render() {
//     return (
//       <View style={styles.fullScreen}>
//         <MyStatusBar
//           barStyle="dark-content"
//           backgroundColor={resource.colors.white}
//         />
//         <ImageBackground
//           source={resource.images.splash_background}
//           style={styles.backgroundImage}>
//           <KeyboardAwareScrollView
//             bounces={false}
//             keyboardShouldPersistTaps="always"
//             showsVerticalScrollIndicator={false}>
//             <View style={{alignSelf: 'flex-end', backgroundColor: 'white'}}>
//               <TouchableOpacity
//                 onPress={this.gotoSelectCityAndReset}
//                 style={styles.skipBtn}>
//                 <Text style={styles.skipText}>{resource.strings.Skip}</Text>
//               </TouchableOpacity>
//             </View>
//             <View style={[styles.logoView, {marginBottom: 30}]}>
//               <Image source={resource.images.img_new_logo} />
//             </View>

//             <View style={styles.container}>
//               <View style={{marginBottom: 40}}>
//                 <WhatsAppLoginButton />
//                 <View style={{height: 50}} />
//                 <MaterialInput
//                   label={'Mobile Number'}
//                   value={this.state.emailOrMobile}
//                   onChangeText={this.onChangeEmail}
//                   error={renderInputError('email', this.state.error)}
//                   errorKey={'email'}
//                   callbackToRemoveError={this.callbackToRemoveError}
//                   isGetOtpTextVisible={
//                     this.state.isMobileLogin && this.state.isGetOtpTextVisible
//                   }
//                   onPressGetOtp={this.onPressGetOtp}
//                   reference={this.emailRef}
//                   inputProps={{
//                     maxLength: this.state.isMobileLogin ? 10 : 100,
//                     autoCaptialize: 'none',
//                     returnKeyType: 'next',
//                   }}
//                   onSubmitEditing={this.focusToNext}
//                   isBorderGetOtpThick={true}
//                   isGetOtpClickable={this.state.isTimeVisible}
//                 />

//                 {this.state.isOtpSent && (
//                   <View style={styles.loginContainer}>
//                     <MaterialInput
//                       label={resource.strings.OTP}
//                       value={this.state.otp}
//                       onChangeText={this.onChangeOtp}
//                       error={renderInputError('otp', this.state.error)}
//                       errorKey={'otp'}
//                       callbackToRemoveError={this.callbackToRemoveError}
//                       isPassVisible={this.state.isPassVisible}
//                       // isVerifyText={
//                       //   !this.state.emailFieldVisible &&
//                       //   this.state.otp.length == 5
//                       // }
//                       // onPressVerifyOtp={this.onPressVerifyOtp}
//                       reference={this.otpRef}
//                       inputProps={{
//                         keyboardType: 'phone-pad',
//                         autoCaptialize: 'none',
//                         maxLength: 5,
//                         returnKeyType: 'done',
//                         editable: true,
//                       }}
//                     />
//                   </View>
//                 )}

//                 {this.state.emailFieldVisible && (
//                   <MaterialInput
//                     label={'Email *'}
//                     value={this.state.updateEmail}
//                     onChangeText={this.onChangeUpdateEmail}
//                     error={renderInputError('saveEmail', this.state.error)}
//                     errorKey={'saveEmail'}
//                     callbackToRemoveError={this.callbackToRemoveError}
//                     // saveEmail={this.state.saveEmailButton}
//                     // onSaveEmail={this.onSaveEmail}
//                     reference={this.saveEmailRef}
//                     onSubmitEditing={this.focusToNext}
//                     isBorderGetOtpThick={true}
//                   />
//                 )}

//                 {this.state.isTimeVisible && (
//                   <Text style={{alignSelf: 'center'}}>
//                     00 :{' '}
//                     {this.state.countDown > 10
//                       ? this.state.countDown
//                       : `0${this.state.countDown}`}
//                   </Text>
//                 )}

//                 {this.state.isOtpSent && (
//                   <Button
//                     btnStyle={[
//                       styles.checkotBtnStyle,
//                       {
//                         marginTop: 0,
//                         marginBottom: 0,
//                         width: '90%',
//                         alignSelf: 'center',
//                       },
//                     ]}
//                     rounded
//                     btnText={'Login'}
//                     onPress={this.onSaveEmail}
//                   />
//                 )}
//               </View>
//               {/* 
//               <Text style={styles.textSignInViaStyle}>
//                 {resource.strings.SIGN_IN_VIA}
//               </Text>
//               <SocialLoginView
//                 onClickFbLogin={this.onClickFbLogin}
//                 onClickGoogleLogin={this.onClickGoogleLogin}
//                 onClickLinkedinLogin={this.onClickLinkedinLogin}
//               />

//               {isPlatformIOS && (
//                 <AppleButton
//                   buttonStyle={AppleButton.Style.BLACK}
//                   buttonType={AppleButton.Type.SIGN_IN}
//                   style={{
//                     alignSelf: 'center',
//                     width: 200,
//                     height: 45,
//                   }}
//                   onPress={() => this.onAppleButtonPress()}
//                 />
//               )}

//               <View style={styles.layoutHorizontal}>
//                 <Text style={styles.dontHaveAccount}>
//                   {resource.strings.DONT_HAVE_ACCOUNT}
//                 </Text>
//                 <TouchableOpacity onPress={this.onPressSignUpText}>
//                   <Text style={styles.txtSignin}>
//                     {resource.strings.SIGN_UP}
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//               <InitLinkedinLogin
//                 onSuccess={this.onLinkedinLoginSuccess}
//                 refer={this.linkedinRef}
//               />

//               <Text style={styles.textAppVersion}>
//                 Version {DeviceInfo.getVersion()}
//               </Text> */}
//             </View>
//           </KeyboardAwareScrollView>
//         </ImageBackground>
//       </View>
//     );
//   }

//   callbackToRemoveError = key => {
//     let {error} = this.state;
//     if (error.hasOwnProperty(key)) {
//       error[key] = '';
//       this.setState({
//         error: error,
//       });
//     }
//   };

//   onAppleButtonPress = async () => {
//     // performs login request
//     const appleAuthRequestResponse = await appleAuth.performRequest({
//       requestedOperation: AppleAuthRequestOperation.LOGIN,
//       requestedScopes: [
//         AppleAuthRequestScope.EMAIL,
//         AppleAuthRequestScope.FULL_NAME,
//       ],
//     });
//     const {
//       user,
//       email,
//       nonce,
//       fullName,
//       identityToken,
//       realUserStatus /* etc */,
//     } = appleAuthRequestResponse;

//     // console.log("appleAuthRequestResponse => ", JSON.stringify(appleAuthRequestResponse))
//     if (user == null) {
//       AppToast('Unable to fetch data');
//       return;
//     }
//     this.onDirectSocialClick(
//       user,
//       'apple',
//       fullName && fullName.givenName ? fullName.givenName : null,
//       email ? email : null,
//       null,
//     );
//     // this.props.hitAppleLoginResponseApi(appleAuthRequestResponse)
//     //     .then((resp) => {
//     //         Toast.show(JSON.stringify(appleAuthRequestResponse))
//     //     })
//     //     .catch(() => {

//     //     })
//   };

//   onFoucusPasswordField = () => {
//     this.setState({
//       isPasswordFocused: true,
//     });
//   };
//   onBlurrPasswordField = () => {
//     this.setState({
//       isPasswordFocused: false,
//     });
//   };

//   onPressSignUpText = () => {
//     this.props.navigation.navigate('SignupScreen');
//   };
//   onPressForgotPassword = () => {
//     const {emailOrMobile} = this.state;
//     if (
//       (emailOrMobile && validateEmail(emailOrMobile.trim())) ||
//       emailOrMobile == ''
//     ) {
//       this.props.navigation.navigate('ForgotPasswordScreen', {
//         emailData: emailOrMobile ? emailOrMobile.trim() : '',
//       });
//     } else {
//       AppToast(resource.strings.PleaseEnterEmail);
//     }
//   };

//   onOtpVerified = OTP => {
//     this.setState({
//       otp: OTP,
//       isOtpInputFIeldVisible: true,
//       isGetOtpTextVisible: false,
//     });
//   };
//   onSigninButtonPressed = () => {
//     const isValid = this.validate();
//     if (!isValid) {
//       return;
//     }
//     const {emailOrMobile, password, otp, isMobileLogin} = this.state;

//     if (!isMobileLogin) {
//       this.props
//         .hitUserLoginApi(emailOrMobile.trim().toLowerCase(), password)
//         .then(data => {
//           AppToast(data.message);
//           this.saveFromAsynAndNavigate(data);
//         })
//         .catch(error => {
//           AppToast(error);
//         });
//     } else {
//       this.props
//         .hitVerifyAndLoginApi(emailOrMobile.trim(), otp)
//         .then(data => {
//           AppToast(data.message);
//           this.saveFromAsynAndNavigate(data);
//         })
//         .catch(error => {
//           AppToast(error);
//         });
//     }
//   };
//   validate = () => {
//     const {emailOrMobile, password, otp, isMobileLogin} = this.state;
//     let errorObject = {};

//     if (!isMobileLogin) {
//       if (emailOrMobile.trim() == '') {
//         errorObject.email = resource.strings.emailCannotBeEmpty;
//       } else if (emailOrMobile.trim().length > 100) {
//         errorObject.email = resource.strings.email100length;
//       } else if (!validateEmail(emailOrMobile.trim())) {
//         errorObject.email = resource.strings.enterValidEmail;
//       }
//       if (password.trim() == '') {
//         errorObject.pass = resource.strings.passwordCannotBeEmpty;
//       } else if (password.length < 6) {
//         errorObject.pass = resource.strings.password6length;
//       } else if (password.length > 16) {
//         errorObject.pass = resource.strings.password16length;
//       }
//     } else {
//       if (otp.trim() == '') {
//         errorObject.otp = resource.strings.otpCannotBeEmpty;
//       } else if (otp.trim().length < 4) {
//         errorObject.otp = resource.strings.otp4length;
//       }
//     }

//     this.setState({error: errorObject});
//     return Object.keys(errorObject).length == 0;
//   };

//   onPressEyeIcon = () => {
//     this.setState({isPassVisible: !this.state.isPassVisible});
//   };

//   onChangePassword = text => {
//     this.setState({password: text});
//   };

//   onClickLinkedinLogin = () => {
//     this.linkedinRef.current.open();
//   };

//   onLinkedinLoginSuccess = token => {
//     // console.log("Linkedin success" + JSON.stringify(data))
//     // got token after success
//     if (token) {
//       this.props
//         .hitLinkedinApiToGetUser(token.access_token)
//         .then(data => {
//           console.log('LinkedinUser', JSON.stringify(data));
//           if (!data.id) {
//             AppToast('Unable to get data');
//             return;
//           }
//           this.onDirectSocialClick(
//             data.id,
//             'linkedin',
//             data.localizedFirstName && data.localizedLastName
//               ? data.localizedFirstName + ' ' + data.localizedLastName
//               : null,
//             data.email ? data.email : null,
//             data.mobile ? data.mobile : null,
//           );
//         })
//         .catch(error => {
//           AppToast(error);
//         });
//     }
//   };

//   // Material input methods
//   onChangeEmail = text => {
//     if (text.length >= 10) {
//       if (validateMobileNumber(text)) {
//         this.setState({isMobileLogin: true, emailOrMobile: text});
//       } else {
//         this.setState({
//           isMobileLogin: false,
//           emailOrMobile: text,
//           isOtpInputFIeldVisible: false,
//           isGetOtpTextVisible: true,
//           otp: '',
//         });
//       }
//     } else {
//       this.setState({
//         isMobileLogin: false,
//         emailOrMobile: text,
//         isOtpInputFIeldVisible: false,
//         isGetOtpTextVisible: true,
//         otp: '',
//       });
//     }
//   };

//   onChangeUpdateEmail = text => {
//     let regex = new RegExp('[a-z0-9]+@[a-z0-9]+.[a-z]{2,3}');
//     if (regex.test(text)) {
//       this.setState({
//         saveEmailButton: true,
//       });
//     }
//     this.setState({
//       updateEmail: text,
//     });
//   };

//   onPressGetOtp = () => {
//     const {emailOrMobile} = this.state;
//     if (emailOrMobile.trim() != '' && emailOrMobile.trim().length == 10) {
//       var formdata = new FormData();
//       formdata.append('mobile_number', emailOrMobile);

//       var requestOptions = {
//         method: 'POST',
//         body: formdata,
//         redirect: 'follow',
//       };

//       fetch(`${BASE_URL}/v1/user/sendotp_new`, requestOptions)
//         .then(response => response.json())
//         .then(result => {
//           console.log(result);
//           if (result.status_code == '200')
//             this.setState({
//               isOtpSent: true,
//             });
//           this.startCountDown();
//         })
//         .catch(error => console.log('error', error));
//     } else {
//       AppToast('Please fill your Mobile number properly');
//     }
//   };

//   focusToNext = () => {
//     const {isMobileLogin} = this.state;
//     if (isMobileLogin) {
//       // focusTo(this.otpRef)
//     } else {
//       this.focusToNext(this.passwordRef);
//     }
//   };

//   onChangeOtp = text => {
//     this.setState({otp: text});
//   };

//   onChangeNewFullName = text => {
//     this.setState({newFullName: text});
//   };

//   saveFromAsynAndNavigate = async data => {
//     const {toScreenName} = this.props;
//     let appUsrObj = AppUser.getInstance();
//     appUsrObj.token = data.data.access_token;
//     appUsrObj.userId = data.data.id.toString();
//     appUsrObj.userDetails = data.data;

//     if (appUsrObj.userDetails) {
//       appUsrObj.itemsIncartCount = parseInt(
//         appUsrObj.userDetails.itemsIncartCount,
//       );
//       this.props.onUpdateCartBadgeCount(appUsrObj.itemsIncartCount);
//       appUsrObj.wishlistCount = parseInt(
//         appUsrObj.userDetails.WishlistItemsCount,
//       );
//       this.props.onUpdateWishlistBadgeCount(appUsrObj.wishlistCount);
//     }

//     const userToken = [AsyncStorageContaints.UserToken, data.data.access_token];
//     const userId = [AsyncStorageContaints.UserId, data.data.id.toString()];
//     const userDetails = [
//       AsyncStorageContaints.UserData,
//       JSON.stringify(data.data),
//     ];
//     const itemsIncartCount = [
//       AsyncStorageContaints.cartBadgeCount,
//       appUsrObj.userDetails.itemsIncartCount,
//     ];
//     const itemsInWishlistCount = [
//       AsyncStorageContaints.wishlistBadgeCount,
//       appUsrObj.userDetails.WishlistItemsCount.toString(),
//     ];

//     try {
//       await AsyncStorage.multiSet([
//         userToken,
//         userId,
//         userDetails,
//         itemsIncartCount,
//         itemsInWishlistCount,
//       ]);
//       if (toScreenName == '') {
//         const resetAction = CommonActions.reset({
//           index: 0,
//           routes: [{name: 'Cart'}],
//         });
//         this.props.navigation.dispatch(resetAction);
//       } else {
//         let obj = AppUser.getInstance();
//         let token = obj.fcmToken;
//         if (token) {
//           this.props.updateFcmTokenToServer(token);
//         }
//         if (this.props.navigation.canGoBack()) this.props.navigation.pop();

//         if (toScreenName.includes('ProductDetailScreen')) {
//           let arr = toScreenName.split('_');
//           let id = parseInt(arr[1]);
//           this.props.navigation.navigate('ProductDetailScreen', {
//             productId: id,
//           });
//         } else {
//           this.props.navigation.navigate(toScreenName);
//         }
//       }
//     } catch (e) {
//       console.log('Error saving user details', e);
//     }
//   };

//   onPressVerifyOtp = () => {
//     const {emailOrMobile, otp} = this.state;
//     if (emailOrMobile.trim() != '' && emailOrMobile.trim().length == 10) {
//       var formdata = new FormData();
//       formdata.append('mobile_number', emailOrMobile);
//       formdata.append('otp', otp);

//       var requestOptions = {
//         method: 'POST',
//         body: formdata,
//         redirect: 'follow',
//       };

//       fetch(`${BASE_URL}/v1/user/verifyotp_new`, requestOptions)
//         .then(response => response.json())
//         .then(async result => {
//           console.log(result);
//           if (result.status_code == '200') {
//             AppToast(result.message);
//             this.saveFromAsynAndNavigate(result);
//           } else if (result.status_code == '400') {
//             if (result.data.status_code == '100') {
//               AppToast(result.data.message);
//               this.setState({
//                 emailFieldVisible: true,
//               });
//             } else AppToast(result.message);
//             console.log(result.data.message);
//           } else {
//             AppToast(result.message);
//           }
//         })
//         .catch(error => console.log('error', error));
//     } else {
//       AppToast('Please fill your Mobile number properly');
//     }
//   };

//   onSaveEmail = () => {
//     const {emailOrMobile, otp, updateEmail} = this.state;
//     if (emailOrMobile.trim() != '' && emailOrMobile.trim().length == 10) {
//       var formdata = new FormData();
//       formdata.append('mobile_number', emailOrMobile);
//       formdata.append('otp', otp);
//       formdata.append('email', updateEmail);

//       var requestOptions = {
//         method: 'POST',
//         body: formdata,
//         redirect: 'follow',
//       };

//       console.log(formdata, 'from onsave email');

//       fetch(`${BASE_URL}/v1/user/verifyotp_new`, requestOptions)
//         .then(response => response.json())
//         .then(result => {
//           console.log(result, 'heres the result');
//           if (result.status_code == '200') {
//             AppToast(result.message);
//             this.saveFromAsynAndNavigate(result);
//           } else if (result.status_code == '400') {
//             if (result.data.status_code == '100') {
//               AppToast(result.data.message);
//               this.setState({
//                 emailFieldVisible: true,
//               });
//             } else AppToast(result.message);
//           } else {
//             AppToast(result.message);
//           }
//         })
//         .catch(error => console.log('error', error));
//     } else {
//       AppToast('Please fill your Mobile number properly');
//     }
//   };

//   updateDetails = () => {
//     const {newFullName, updateEmail} = this.state;

//     let appUser = AppUser.getInstance();
//     let token = appUser.token;
//     let userid = appUser.userId;
//     let email =
//       appUser.userDetails.email == '' ? updateEmail : appUser.userDetails.email;
//     let oldName = appUser.userDetails.full_name;

//     console.log(
//       newFullName,
//       updateEmail,
//       oldName,
//       email,
//       'from update details',
//     );

//     let regex = new RegExp('[a-z0-9]+@[a-z0-9]+.[a-z]{2,3}');
//     if (regex.test(email)) {
//       var myHeaders = new Headers();
//       myHeaders.append('authtoken', token);
//       myHeaders.append('userid', userid);

//       var formdata = new FormData();
//       formdata.append('full_name', oldName == '' ? newFullName : oldName);
//       formdata.append('email', email == '' ? updateEmail : email);

//       var requestOptions = {
//         method: 'POST',
//         headers: myHeaders,
//         body: formdata,
//         redirect: 'follow',
//       };

//       fetch(`${BASE_URL}/v1/user/updateuserdetail`, requestOptions)
//         .then(response => response.json())
//         .then(result => {
//           if (result.status_code == 200) this.saveFromAsynAndNavigate(result);
//         })
//         .catch(error => console.log('error', error));
//     } else {
//       AppToast('Please fill the details properly');
//     }
//   };

//   startCountDown = () => {
//     this.setState({
//       isTimeVisible: true,
//     });
//     this.interval = setInterval(
//       () => this.setState(prevState => ({countDown: prevState.countDown - 1})),
//       1000,
//     );
//   };

//   onDirectSocialClick = (
//     social_login_id,
//     login_type,
//     socialName,
//     socialEmail,
//     socialMobile,
//   ) => {
//     this.props
//       .hitDirectSocialLoginApi(
//         social_login_id,
//         login_type,
//         socialName,
//         socialEmail,
//         socialMobile,
//       )
//       .then(data => {
//         console.log('onDirectSocialClick', data);
//         AppToast(data.message);
//         this.saveFromAsynAndNavigate(data);
//       })
//       .catch(error => {
//         AppToast(error);
//       });
//   };
//   /*
//    * This method callled on Facebook button pressed and initialize Facebook login process.
//    */
//   onClickFbLogin = () => {
//     initializeFacebookLogin(this.onSuccessFacebookLogin);
//   };

//   /*
//    * Callback when Faceboook login success.
//    */
//   onSuccessFacebookLogin = token => {
//     console.log('onSuccessFacebookLogin', token);
//     // got token after success
//     if (token) {
//       this.props
//         .hitFacebookApiToGetUser(token.accessToken)
//         .then(data => {
//           console.log('FacebookUser', JSON.stringify(data));
//           if (!data.id) {
//             AppToast('Unable to get data');
//             return;
//           }
//           this.onDirectSocialClick(
//             data.id,
//             'facebook',
//             data.name ? data.name : null,
//             data.email ? data.email : null,
//             data.mobile ? data.mobile : null,
//           );
//         })
//         .catch(error => {
//           console.log('error in facebook' + error);
//         });
//     }
//   };

//   /*
//    * This method callled on Google button pressed and initialize Google login process.
//    */
//   onClickGoogleLogin = () => {
//     initializeGoogleLogin(this.onSuccessGoogleLogin);
//   };

//   /*
//    * Callback when Google login success.
//    */
//   onSuccessGoogleLogin = (currentUser, token) => {
//     // console.log("Current => ", JSON.stringify(currentUser))
//     if (!currentUser.user) {
//       AppToast('Unable to get data');
//       return;
//     }
//     let googleUser = currentUser.user;
//     this.onDirectSocialClick(
//       currentUser.user.id,
//       'google',
//       googleUser.name ? googleUser.name : null,
//       googleUser.email ? googleUser.email : null,
//       null,
//     );
//   };

//   saveFromAsynAndNavigate = async data => {
//     console.log('Login resp =>>', JSON.stringify(data));
//     const {toScreenName} = this.props;
//     let appUsrObj = AppUser.getInstance();
//     appUsrObj.token = data.data.access_token;
//     appUsrObj.userId = data.data.id.toString();
//     appUsrObj.userDetails = data.data;

//     if (appUsrObj.userDetails) {
//       appUsrObj.itemsIncartCount = parseInt(
//         appUsrObj.userDetails.itemsIncartCount,
//       );
//       this.props.onUpdateCartBadgeCount(appUsrObj.itemsIncartCount);
//       appUsrObj.wishlistCount = parseInt(
//         appUsrObj.userDetails.WishlistItemsCount,
//       );
//       this.props.onUpdateWishlistBadgeCount(appUsrObj.wishlistCount);
//     }

//     const userToken = [AsyncStorageContaints.UserToken, data.data.access_token];
//     const userId = [AsyncStorageContaints.UserId, data.data.id.toString()];
//     const userDetails = [
//       AsyncStorageContaints.UserData,
//       JSON.stringify(data.data),
//     ];
//     const itemsIncartCount = [
//       AsyncStorageContaints.cartBadgeCount,
//       appUsrObj.userDetails.itemsIncartCount,
//     ];
//     const itemsInWishlistCount = [
//       AsyncStorageContaints.wishlistBadgeCount,
//       appUsrObj.userDetails.WishlistItemsCount.toString(),
//     ];

//     try {
//       await AsyncStorage.multiSet([
//         userToken,
//         userId,
//         userDetails,
//         itemsIncartCount,
//         itemsInWishlistCount,
//       ]);
//       if (toScreenName == '') {
//         const resetAction = CommonActions.reset({
//           index: 0,
//           routes: [{name: 'SelectCityScreen'}],
//         });
//         this.props.navigation.dispatch(resetAction);
//       } else {
//         let obj = AppUser.getInstance();
//         let token = obj.fcmToken;
//         if (token) {
//           this.props.updateFcmTokenToServer(token);
//         }
//         this.props.navigation.pop();

//         if (toScreenName.includes('ProductDetailScreen')) {
//           let arr = toScreenName.split('_');
//           let id = parseInt(arr[1]);
//           this.props.navigation.navigate('ProductDetailScreen', {
//             productId: id,
//           });
//         } else {
//           this.props.navigation.navigate(toScreenName);
//         }
//       }
//     } catch (e) {
//       console.log('Error saving user details', e);
//     }
//   };
//   gotoSelectCityAndReset = () => {
//     const {toScreenName} = this.props;
//     if (toScreenName == '') {
//       this.props.navigation.navigate('SelectCityScreen');
//     } else {
//       this.props.navigation.pop();
//     }
//   };
// }

const mapStateToProps = state => {
  const {toScreenName} = state.skipLoginReducer;
  return {toScreenName: toScreenName};
};
let container = connect(
  mapStateToProps,
  {
    ...actions,
    hitSocialLoginApi,
    hitLinkedinApiToGetUser,
    hitDirectSocialLoginApi,
    hitFacebookApiToGetUser,
    hitSendOtpApi,
    updateFcmTokenToServer,
    onUpdateCartBadgeCount,
    onUpdateWishlistBadgeCount,
  },
)(SigninScreen);
let loader = APILoadingHOC(container);

loader.getIntent = () => {
  return {
    routeName: 'SigninScreen',
  };
};

export default loader;
