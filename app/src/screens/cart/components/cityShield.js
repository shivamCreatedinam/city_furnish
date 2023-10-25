import {View, Text, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import styles from '../styles';
import resources from '../../../../res';

const CityShield = props => {
  const {addedCityshield, handleCityshield, checkoutOrderDetails, fetchedData} = props;
  return (
    <View style={styles.cityShieldContainer}>
      <View style={styles.shieldHeader}>
        <View style={styles.flexRow}>
          <Image
            source={resources.images.img_shield}
            style={styles.imgShield}
          />
          <Text style={styles.shieldHeaderTitle}>{'CITYSHIELD'}</Text>
        </View>
        <Text style={styles.shieldHeaderDetailTxt}>
          {'Protect your appliances and furniture worth ₹70,000 '}
        </Text>
      </View>
      <View style={styles.shieldContent}>
        <View style={styles.priceView}>
          <View>
            <Text style={styles.offerPrice}>
            ₹{' '}
            {Object.keys(fetchedData).length === 0
                      ? checkoutOrderDetails.city_shield
                          .total_monthly_care_amount
                      : fetchedData.total_monthly_care_amount} / month
            </Text>
            <Text style={styles.orinalPrice}>
            ₹{' '}
            {Object.keys(fetchedData).length === 0
                      ? checkoutOrderDetails.city_shield
                          .total_monthly_actual_care_amount
                      : fetchedData.total_monthly_actual_care_amount} / month
            </Text>
          </View>
          <View style={styles.offerView}>
            <Image
              source={resources.images.img_percent}
              style={styles.imgPercent}
            />
            <Text style={styles.txtDiscountPercent}>
            {Object.keys(fetchedData).length === 0
                        ? checkoutOrderDetails.city_shield
                            .cf_care_percentage
                        : fetchedData.cf_care_percentage}
            </Text>
            <Text
              style={[styles.txtDiscountPercent, {textDecorationLine: 'none'}]}>
              {'OFF'}
            </Text>
          </View>
          <View>
            <TouchableOpacity
              style={[styles.btnRemove, !addedCityshield && styles.btnGreen]}
              onPress={() => handleCityshield()}>
              <Text
                style={[
                  styles.btnRemoveTxt,
                  !addedCityshield && styles.btnGreenText,
                ]}>
                {addedCityshield ? 'Remove' : 'Add'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.limitedPeriodOffer}>
          <Image source={resources.images.img_star} style={styles.imgStar} />
          <Text style={styles.txtLimitedPeriod}>LIMITED PERIOD OFFER</Text>
        </View>
      </View>
    </View>
  );
};

export default CityShield;
