import React from 'react';
import {Text, View} from 'react-native';

export default function LittleSection({heading, contents}) {
  return (
    <View style={{marginVertical: 10}}>
      <Text style={{color: '#444444', fontSize: 15, fontWeight: 'bold'}}>
        {heading}
      </Text>
      {contents.map((item, index) => {
        return (
          <Text key={index} style={{color: 'grey', textAlign: 'left'}}>
            - {item}
          </Text>
        );
      })}
    </View>
  );
}
