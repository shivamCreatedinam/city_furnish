import React from 'react';
import {View, Linking, Text, ImageBackground, BackHandler} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import HeaderWithProfilePic from '../../genriccomponents/header/HeaderWithProfilePic';
import Button from '../../genriccomponents/button/Button';
import resources from '../../../res';
import Icon from 'react-native-vector-icons/FontAwesome';
import AppToast from '../../genriccomponents/appToast/AppToast';
import {showMessage, hideMessage} from 'react-native-flash-message';
const HIGH_PRIORITY_UPDATE = 5; // Arbitrary, depends on how you handle priority in the Play Console

export default class InAppUpdateScreen extends React.Component {
  static ROUTE_NAME = 'InAppUpdateScreen';
  constructor(props) {
    super(props);
    this.appURL =
      this.props.route.params && this.props.route.params.appURL
        ? this.props.route.params.appURL
        : null;
    this.response =
      this.props.route.params && this.props.route.params.resp
        ? this.props.route.params.resp
        : {};
    this.state = {};
  }
  handleBackButton() {
    AppToast('Please update application to latest version first');
    return true;
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  updateNow = () => {
    Linking.canOpenURL(this.appURL).then(supported => {
      if (supported) {
        Linking.openURL(this.appURL);
      } else {
        console.log("Don't know how to open URI: " + this.appURL);
        this.props.navigation.navigate('Home');
      }
    });
  };

  updateLater = () => {
    this.props.navigation.navigate('Home');
  };

  renderHeader = () => {
    return (
      <HeaderWithProfilePic
        headerTitle={'App Update Available'}
        isBackIconVisible={false}
        isProfileIconVisible={false}
        changeColor={true}
        headerColor={resources.colors.appColor}
        statusBarColor={resources.colors.appColor}
        navigateProps={this.props.navigation}
        onBackClick={this.handleBackButton}
      />
    );
  };
  onBackClick = () => {
    this.props.navigation.goBack();
  };

  render() {
    return (
      <View style={[styles.fullScreen]}>
        {this.renderHeader()}
        <KeyboardAwareScrollView
          bounces={false}
          style={styles.fullScreen}
          keyboardShouldPersistTaps="never"
          showsVerticalScrollIndicator={false}>
          <View style={styles.fullScreen}>
            <ImageBackground
              source={resources.images.referral_background}
              style={[styles.backgroundImage]}
              resizeMode={'contain'}>
              <View style={styles.container}>
                {/* <Text style={styles.haveYourFriendText}>{'Update Cityfurnish?'.toUpperCase()}</Text> */}
                <Text style={styles.shareYourReferral}>
                  {
                    'Update your Cityfurnish app to get exclusive offers and exciting features !!'
                  }
                </Text>
                {/* <Icon name="download" size={33} color={resources.colors.white} type="fontawesome" style={styles.coinsIconStyle} />
                                <Text style={styles.coinsPriceText}>Need Update : {'YES'}</Text> */}

                <View style={styles.btnView}>
                  <Button
                    btnStyle={styles.buttonStyle}
                    touchOpacityStyle={styles.btnTouchStyle}
                    rounded
                    btnText={'Update Now'}
                    onPress={() => {
                      this.updateNow();
                    }}
                  />
                </View>
                {/* <View style={styles.btnView}>
                                    <Button
                                        btnStyle={styles.buttonLaterStyle}
                                        touchOpacityStyle={styles.btnTouchStyle}
                                        rounded btnText={'Update later'}
                                        onPress={() => { this.updateLater() }} />
                                </View> */}
              </View>
            </ImageBackground>
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}
