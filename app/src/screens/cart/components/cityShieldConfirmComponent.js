import {View, Text, Image} from 'react-native';
import React from 'react';
import resources from '../../../../res';
import styles from '../styles';
import {wp} from '../../../utility/Utils';
import Button from '../../../genriccomponents/button/Button';

const itemSpace = wp(24);

export default function CityShieldConfirmComponent(props) {
  const {events} = props;

  const renderBreakItem = (img, title) => {
    return (
      <View style={styles.cityshieldItem}>
        <Image source={img} style={styles.imgBreakHelp} resizeMode="contain" />
        <Text style={styles.txtBreakHelp}>{title}</Text>
      </View>
    );
  };
  return (
    <View style={{paddingHorizontal: wp(16), paddingVertical: wp(16)}}>
      <View style={styles.flexRow}>
        <Image source={resources.images.img_shield} style={styles.imgShield} />
        <Text style={styles.shieldHeaderTitle}>{'CITYSHIELD'}</Text>
      </View>
      <View style={{marginTop: itemSpace}}>
        <Text style={styles.txtCityshieldDetail}>
          {
            'City Shield gives you with peace of mind by providing accidental damage coverage at just ₹250 / month'
          }
        </Text>

        {renderBreakItem(
          resources.images.img_glass_break,
          'Scratches and dents',
        )}
        {renderBreakItem(
          resources.images.img_water,
          'Liquid spills and stains and dents',
        )}
        {renderBreakItem(resources.images.img_house_break, 'Broken furniture')}
        {renderBreakItem(resources.images.img_crack, 'Cracks, tears and more')}

        <Text style={[styles.shieldHeaderDetailTxt, {marginTop: itemSpace}]}>
          {'Get a damage waiver up to ₹70,000 with City Shield'}
        </Text>
      </View>
      <View style={{marginTop: itemSpace}}>
        <Button
          rounded
          btnText={'Continue with City Shield'}
          onPress={() => {
            events?.handleCloseAction();
          }}
          btnStyle={[styles.btnContinue]}
          showRightIcon={true}
          disableTouch={false}
        />
        <Button
          rounded
          btnText={'No, I want to risk damaging the furniture'}
          onPress={() => {
            events?.toggleCityShield(false)
            events?.handleCloseAction();
          }}
          btnStyle={[styles.btnContinue, styles.lnkButton]}
          showRightIcon={true}
          disableTouch={false}
          textStyle={styles.lnkButtonTxt}
          rightIconStyle={{tintColor: resources.colors.grayColor}}
          renderRight={() => (
            <Image
              source={resources.images.img_right_icon}
              style={{height: wp(18), height: wp(18)}}
            />
          )}
        />
      </View>
    </View>
  );
}
