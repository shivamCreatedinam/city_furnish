import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import styles from './styles';
import resources from '../../../res';
import FloatingLabel from '../../genriccomponents/input/FloatingInput';
/**
 * @function
 *
 * This is a functional component to render a text imput with label on top.
 * @param {Object} props
 * @returns {XML} view.
 */
function MaterialInput(props) {
  const {
    label,
    onChangeText,
    value,
    error,
    inputStyles,
    errStyle,
    inputProps,
    onBackKeyPress,
    isPasswordEyeVisible,
    isPassVisible,
    onPressEyeIcon,
    onPressGetOtp,
    isGetOtpTextVisible,
    onSubmitEditing,
    reference,
    isVerified,
    isVerifedTextVisible,
    onPressVerify,
    isBorderGetOtpThick,
    onBlur,
    onFocus,
    isBorderEyeThick,
    isBorderverifiedBtnThick,
    isMobileVerifiedTxtVisible,
    isDropDownImageVisible,
    errorKey,
    callbackToRemoveError,
    height,
    isVerifyText,
    onPressVerifyOtp,
    saveEmail,
    onSaveEmail,
    isGetOtpClickable,
    placeholder=''
  } = props;

  let additionalLabel = checkAndGetVerifiedText(
    label,
    isVerifedTextVisible,
    isVerified,
  );
  return (
    <View>
      <View style={{flexDirection: 'row'}}>
        <FloatingLabel
          myRef={reference}
          value={value}
          autoCorrect={false}
          keyboardType={
            inputProps && inputProps.keyboardType
              ? inputProps.keyboardType
              : 'default'
          }
          enablesReturnKeyAutomatically={true}
          onChangeText={text => {
            onChangeText ? onChangeText(text) : () => {};
            callbackToRemoveError
              ? callbackToRemoveError(errorKey ? errorKey : '')
              : () => {};
          }}
          onSubmitEditing={onSubmitEditing ? onSubmitEditing : () => {}}
          returnKeyType={inputProps && inputProps.returnKeyType}
          style={[{backgroundColor: 'white', flex: 1}, inputStyles]}
          maxLength={inputProps && inputProps.maxLength}
          editable={inputProps && inputProps.editable}
          autoCapitalize={inputProps && inputProps.autoCaptialize}
          secureTextEntry={inputProps && inputProps.secureTextEntry}
          _onFocus={() => {
            onFocus && onFocus();
          }}
          _onBlur={() => {
            onBlur && onBlur();
          }}
          multiline={inputProps && inputProps.multiline}
          labelStyle={
            additionalLabel && additionalLabel == resources.strings.VERIFIED
              ? styles.verifiedTextStyle
              : additionalLabel &&
                additionalLabel == resources.strings.NOT_VERIFIED
              ? styles.notVerifiedTextStyle
              : {}
          }
          validText={additionalLabel ? additionalLabel : ''}
          placeholder={placeholder}
          >
          {label}
        </FloatingLabel>
        {isPasswordEyeVisible ? (
          <TouchableOpacity
            style={[
              isBorderEyeThick
                ? styles.borderBottomThick
                : styles.borderBottomThin,
            ]}
            onPress={onPressEyeIcon ? onPressEyeIcon : {}}>
            <Image
              source={
                isPassVisible
                  ? resources.images.icn_hide_password
                  : resources.images.icn_show_password
              }
            />
          </TouchableOpacity>
        ) : (
          <View />
        )}
        {isGetOtpTextVisible ? (
          <TouchableOpacity
            style={[
              isBorderGetOtpThick
                ? styles.borderBottomThick
                : styles.borderBottomThin,
            ]}
            disabled={isGetOtpClickable}
            onPress={onPressGetOtp ? onPressGetOtp : {}}>
            <Text style={[styles.txtGetOTP]}>{resources.strings.GET_OTP}</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}
        {saveEmail ? (
          <TouchableOpacity
            style={[
              isBorderGetOtpThick
                ? styles.borderBottomThick
                : styles.borderBottomThin,
            ]}
            onPress={onSaveEmail ? onSaveEmail : {}}>
            <Text style={styles.txtGetOTP}>{'Save'}</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}
        {isVerifyText ? (
          <TouchableOpacity
            style={[
              isBorderGetOtpThick
                ? styles.borderBottomThick
                : styles.borderBottomThin,
            ]}
            onPress={onPressVerifyOtp ? onPressVerifyOtp : {}}>
            <Text style={styles.txtGetOTP}>{'Verify'}</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}
        {isMobileVerifiedTxtVisible ? (
          <TouchableOpacity
            style={[
              isBorderGetOtpThick
                ? styles.borderBottomThick
                : styles.borderBottomThin,
            ]}
            disabled>
            <Text style={styles.txtGetOTP}>
              {resources.strings.mobileVerified}
            </Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}
        {isDropDownImageVisible ? (
          <View style={styles.isDropDown}>
            <Image
              style={styles.imgDropDown}
              source={resources.images.img_DropDown}
            />
          </View>
        ) : (
          <View />
        )}
        {checkAndGetVerifiedButton(
          isVerifedTextVisible,
          isVerified,
          onPressVerify,
          isBorderverifiedBtnThick,
        )}
      </View>
      {error ? (
        <Text
          style={[styles.errorText, errStyle]}
          numberOfLines={1}
          ellipsizeMode={'middle'}>
          {error}
        </Text>
      ) : (
        <View style={height ? {height: 6} : {height: 20}} />
      )}
    </View>
  );
}

function checkAndGetVerifiedText(label, isVerifedTextVisible, isVerified) {
  if (!isVerifedTextVisible) {
    return '';
  }
  if (isVerified) {
    return resources.strings.VERIFIED;
  } else {
    return resources.strings.NOT_VERIFIED;
  }
}
function checkAndGetVerifiedButton(
  isVerifedTextVisible,
  isVerified,
  onPressVerify,
  isBorderverifiedBtnThick,
) {
  if (!isVerifedTextVisible) {
    return <View />;
  }
  if (!isVerified) {
    return (
      <TouchableOpacity
        style={[
          isBorderverifiedBtnThick
            ? styles.borderBottomThick
            : styles.borderBottomThin,
        ]}
        onPress={onPressVerify ? onPressVerify : {}}>
        <Text style={styles.txtGetOTP}>{resources.strings.VERIFY}</Text>
      </TouchableOpacity>
    );
  } else {
    return <View />;
  }
}
export default MaterialInput;
