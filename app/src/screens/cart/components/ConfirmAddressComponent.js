import {Image, Text, TouchableOpacity, View} from 'react-native';
import React, {Component} from 'react';
import {myWidth, wp} from '../../../utility/Utils';
import resources from '../../../../res';
import Button from '../../../genriccomponents/button/Button';
import styles from '../styles';

export class ConfirmAddressComponent extends Component {
  renderAddressWithTitle = (title, detail) => {
    return (
      <View style={{marginTop: wp(20)}}>
        <Text
          style={{
            fontFamily: resources.fonts.regular,
            fontWeight: '400',
            fontSize: wp(12),
            color: resources.colors.grayColor,
          }}>
          {title}
        </Text>
        <Text
          style={{
            marginTop: wp(4),
            fontFamily: resources.fonts.regular,
            fontWeight: '500',
            fontSize: wp(16),
            color: resources.colors.titleBlack,
          }}>
          {detail}
        </Text>
      </View>
    );
  };
  render() {
    const {data, events} = this.props;
    return (
      <View style={{paddingHorizontal: wp(16), paddingBottom: wp(16)}}>
        <Text
          style={{
            fontFamily: resources.fonts.regular,
            fontSize: wp(14),
            fontWeight: '400',
            color: resources.colors.grayColor,
          }}>
          Below address will be used for the delivery and installation for this
          order
        </Text>

        <Text
          style={{
            fontFamily: resources.fonts.medium,
            fontWeight: '600',
            fontSize: wp(18),
            color: resources.colors.titleBlack,
            marginTop: wp(20),
          }}>
          {data.full_name}
        </Text>
        {this.renderAddressWithTitle(
          'Mobile numbers',
          `${data.phone}, ${data.phone_alternate}`,
        )}
        {this.renderAddressWithTitle(
          'Complete address',
          `${data.address1} ${data.address2}`,
        )}
        <Text
          style={{
            fontFamily: resources.fonts.medium,
            fontWeight: '600',
            fontSize: wp(16),
            color: resources.colors.titleBlack,
            marginTop: wp(5),
          }}>{`${data.city}, ${data.state} ${data.postal_code}`}</Text>

        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: wp(20),
          }}
          onPress={() => events.handleChangeAddress()}>
          <Text
            style={{
              fontFamily: resources.fonts.medium,
              fontSize: 16,
              fontWeight: '500',
              color: resources.colors.appBlue,
            }}>
            Change address
          </Text>
          <Image
            source={resources.images.img_right_icon}
            style={{height: wp(16), width: wp(16), top: 1}}
          />
        </TouchableOpacity>
        <Button
          rounded
          btnText={'Confirm & Pay'}
          onPress={() => {
            events?.handleOrederPayment();
          }}
          btnStyle={[styles.btnSubmit, {width: myWidth - 32, marginTop: 0, }]}
          showRightIcon={true}
          disableTouch={false}
        />
      </View>
    );
  }
}

export default ConfirmAddressComponent;
