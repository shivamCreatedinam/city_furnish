import {View, Text, Image, StyleSheet} from 'react-native';
import React from 'react';
import styles from './styles';
import HeaderWithProfilePic from '../../../genriccomponents/header/HeaderWithProfilePic';
import resources from '../../../../res';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Button from '../../../genriccomponents/button/Button';

const CongratulationScreen = props => {
  const handleGoToHome = () => {
    props.navigation.goBack();
  };
  return (
    <View style={[styles.fullScreen]}>
      <KeyboardAwareScrollView
        contentContainerStyle={localStyle.scrollContainer}
        bounces={false}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Image
          source={resources.images.success}
          style={localStyle.imgSuccess}
        />
        <Text style={localStyle.txtCongratulation}>
          Congratulations! You have completed your KYC.
        </Text>
        <Text style={localStyle.txtDetail}>
          We will take 24-48 hours to verify your KYC and start processing your
          order.
        </Text>
      </KeyboardAwareScrollView>

      <View style={styles.submitView}>
        <Button
          rounded
          btnText={resources.strings.go_home}
          onPress={handleGoToHome}
          disableTouch={false}
          btnStyle={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
          }}
          showRightIcon={true}
          renderRight={() => <Image source={resources.images.house} />}
        />
      </View>
    </View>
  );
};

export default CongratulationScreen;

const localStyle = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgSuccess: {
    height: 200,
    width: 200,
  },
  txtCongratulation: {
    textAlign: 'center',
    fontSize: 18,
    fontFamily: resources.fonts.medium,
    fontWeight: '500',
    color: resources.colors.titleBlack,
    marginHorizontal: 55,
  },
  txtDetail: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: resources.fonts.regular,
    fontWeight: '400',
    color: '#9A9AA2',
    marginHorizontal: 10,
    marginTop: 10,
  },
});
