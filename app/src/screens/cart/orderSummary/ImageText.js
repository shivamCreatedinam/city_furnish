import React from 'react';
import {Dimensions, Image, Text, View} from 'react-native';

export default function ImageText({uri, text, height, width}) {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-start',
        width: Dimensions.get('screen').width / 4 - 10,
      }}>
      <Image
        source={uri}
        height={height ? height : 50}
        width={width ? width : 50}
        style={{height: height && height, width: width && width}}
      />
      <Text style={{textAlign: 'center', color: 'grey'}}>{text}</Text>
    </View>
  );
}
