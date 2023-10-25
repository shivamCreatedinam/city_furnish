import {Text, View, Image} from 'react-native';
import React, {Component} from 'react';
import styles from './styles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {myHeight, myWidth, wp} from '../../utility/Utils';
import HeaderWithProfilePic from '../../genriccomponents/header/HeaderWithProfilePic';
import {StackActions} from '@react-navigation/native';
import resources from '../../../res';
import Button from '../../genriccomponents/button/Button';
let horizontalSpace = 16;

const RenderKYCPendingDetail = () => {
  const renderItem = txt => {
    return (
      <View style={{flexDirection: 'row', marginTop: wp(12)}}>
        <View style={styles.dotView} />
        <Text style={styles.kycPendingDetailTxt}>{txt}</Text>
      </View>
    );
  };
  return (
    <View style={styles.ocDetailContainer}>
      <Text style={styles.txtNextStepForYou}>Next steps for you...</Text>
      {renderItem('Please verify your KYC within next 48 hours.')}
      {renderItem(
        'Once your KYC is verified, we will be delivering your order within 72 hours',
      )}
    </View>
  );
};
const RenderPaymentFail = () => {
  return (
    <View style={styles.ocDetailContainer}>
      <Text style={styles.txtPaymentFailDetail}>
        {
          'If any amount has been deducted from your account, it will be refunded back within 7 business days. Please note that, your money will be safely refunded.'
        }
      </Text>
    </View>
  );
};
const RenderPaymentSuccess = () => {
  return (
    <View style={styles.ocDetailContainer}>
      <Text style={styles.txtPaymentFailDetail}>
        {
          'We will ship your order soon. You can track your order by clicking on the button below.'
        }
      </Text>
    </View>
  );
};

export class OrderComplete extends Component {

    constructor(props) {
        super(props)
        this.state ={
            orderStatus: 'kyc_pending'
        }
    }

  onBackClick = () => {
    this.props.navigation.dispatch(
      StackActions.replace('Home', {test: 'Test Params'}),
    );
  };

  render() {
    let img = resources.images.success;
    let title = '';
    let renderDetailView = null;
    let buttonText = '';
    let rightIcon = () => (
      <Image
        source={resources.images.splash_right}
        style={[{width: 20, height: 20, tintColor: resources.colors.white}]}
      />
    );
    let onPress = () => null

    switch (this.state.orderStatus) {
      case 'kyc_pending': {
        img = resources.images.success;
        title = 'We have received your payment';
        renderDetailView = <RenderKYCPendingDetail />;
        buttonText = 'Verify your KYC';
        onPress = () => this.setState({orderStatus: 'payment_fail'})
        break;
      }
      case 'payment_fail': {
        img = resources.images.success;
        title =
          'Oops! Your payment couldn’t be processed. \n\nPlease try again.';
        renderDetailView = <RenderPaymentFail />;
        buttonText = 'Try again';
        onPress = () => this.setState({orderStatus: 'payment_success'})
        break;
      }
      case 'payment_success': {
        img = resources.images.success;
        title = 'We have received your payment';
        renderDetailView = <RenderPaymentSuccess />;
        buttonText = 'Track your order';
        onPress = () => this.setState({orderStatus: 'kyc_pending'})
        rightIcon = () => (
          <Image
            source={resources.images.img_house_outline}
            style={[
              {width: 20, height: 20, tintColor: resources.colors.white},
            ]}
          />
        );
        break;
      }
    }
    return (
      <View style={styles.orderCompleteContainer}>
        <KeyboardAwareScrollView
          style={{borderWidth: 0}}
          contentContainerStyle={{
            marginHorizontal: wp(horizontalSpace),
            justifyContent: 'center',
            height: myHeight - 80,
          }}
          // bounces={false}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Image source={img} style={styles.imgSuccessOC} />
          <Text style={styles.txtOCtitle}>{title}</Text>
          {renderDetailView}
        </KeyboardAwareScrollView>
        <View style={styles.ocActionButtonContianer}>
          <Button
            btnStyle={styles.btnOCActionButton}
            touchOpacityStyle={{}}
            rounded
            textStyle={{color: resources.colors.white}}
            btnText={buttonText}
            onPress={onPress}
            showRightIcon={false}
            renderRight={rightIcon}
          />
        </View>
      </View>
    );
  }
}

export default OrderComplete;
