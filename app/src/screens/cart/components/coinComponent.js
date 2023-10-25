import { View, Text, Image } from 'react-native'
import React from 'react'
import styles from "../styles"
import resources from '../../../../res'

const CoinComponent = (props) => {
  return (
    <View style={styles.coinContainer}>
    <View style={styles.coinContent}>
      <Image source={resources.images.inc_coin}  style={styles.imgCoin} />
      <Text style={styles.coinTxt}>{props.coin}</Text>
    </View>
  </View>  
  )
}

export default CoinComponent