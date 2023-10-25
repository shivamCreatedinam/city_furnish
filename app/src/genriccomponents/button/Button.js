import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  TouchableHighlight,
  Image,
} from 'react-native';
import styles from './styles';
import resources from '../../../res';

const Button = ({
  solid,
  children,
  rounded,
  outlined,
  customStyle,
  btnText,
  onPress,
  btnStyle,
  textStyle,
  touchOpacityStyle,
  textStyleOver,
  disableTouch,
  showRightIcon = false,
  renderRight = undefined,
  uploaded,
  rightIconStyle = {}
}) => {
  let inlineStyle = [];
  inlineStyle = inlineStyle.concat(styles.defaultStyle);
  if (rounded) {
    inlineStyle = inlineStyle.concat(styles.roundBorder);
  }
  if (outlined) {
    inlineStyle = inlineStyle.concat(styles.outlined);
  }
  if (customStyle) {
    inlineStyle = inlineStyle.concat(customStyle);
  }
  if (solid) {
    inlineStyle = inlineStyle.concat(styles.solid);
  }
  if(uploaded) {
    inlineStyle = inlineStyle.concat(styles.uploaded);
  }

  btnStyle = btnStyle ? btnStyle : {};
  textStyle = textStyle ? textStyle : {};

  return (
    <TouchableHighlight
      disabled={disableTouch ? disableTouch : false}
      underlayColor="#ffffff"
      style={[
        touchOpacityStyle ? touchOpacityStyle : styles.styleTouchableView,
        {borderRadius: 8},
      ]}
      onPress={() => onPress()}
      activeOpacity={0.8}>
      <View
        style={[
          inlineStyle,
          btnStyle,
          disableTouch && !uploaded && {opacity: 0.5, backgroundColor: '#C0C0C6'},
        ]}>
        {children}
        <Text style={[styles.textStyle, textStyleOver, textStyle || {}]}>
          {btnText}
        </Text>
        {
            renderRight ? 
            renderRight() :
            showRightIcon && (
                <Image
                  source={resources.images.splash_right}
                  style={[{width: 20, height: 20, tintColor: resources.colors.white}, rightIconStyle]}
                />
              )
        }
      </View>
    </TouchableHighlight>
  );
};

export default Button;
