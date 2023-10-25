import {View, Text} from 'react-native';
import React from 'react';

export default function UpFrontTenureExtensionScreen({route, navigation}) {
  const {id} = route.params;
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>{id}</Text>
    </View>
  );
}
