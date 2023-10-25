import React from 'react';
import {View, Text, Image} from 'react-native';
import res from '../../../res';
import Button from '../../genriccomponents/button/Button';
import styles from './styles';

function FrpDetailCard(props) {
  const {data, onPressItem, selectedSliderIndex} = props;
  return (
    <View style={styles.cardView}>
      <View style={styles.centerView}>
        <Text style={styles.labelBold}>{data.product_name}</Text>
        <Text style={styles.labelBold1}>Best suited for a Studio apartment</Text>

        <Text style={styles.itemCount}>{data.item_quantity} products at just</Text>
        <Text style={styles.textPrice}>
          {'\u20B9'}
          <Text style={{fontFamily: res.fonts.bold, fontSize: 20}}>
            {data && data.tenure[selectedSliderIndex].attr_price}
          </Text>
          /- month
        </Text>
      </View>
     

      <View style={styles.centerView}>
        <Button
          rounded
          disableTouch={data.in_stock ? false : true}
          btnText={data.in_stock ? 'Select Plan' : 'Out of Stock'}
          btnStyle={[data.in_stock ? styles.btnInStock : styles.btnOutStock]}
          textStyleOver={{fontSize: 13}}
          onPress={() => {
            onPressItem(data, selectedSliderIndex);
          }}
        />
      </View>
    </View>
  );
}

export default FrpDetailCard;
