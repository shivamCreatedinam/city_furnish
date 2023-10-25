import {
  View,
  Text,
  Modal,
  Image,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import React from 'react';
import {Icon} from 'react-native-vector-icons/Ionicons';
import styles from './styles';
import ImageText from '../cart/orderSummary/ImageText';
import MaterialInput from '../../genriccomponents/input/MaterialInput';

const Label = ({text}) => {
  return <Text style={{fontSize: 15}}>{text}</Text>;
};

const FakeInput = ({text}) => {
  return (
    <View
      style={{
        height: 40,
        width: '100%',
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 5,
        justifyContent: 'center',
        paddingHorizontal: 10,
        marginTop: 5,
      }}>
      <Text>{text}</Text>
    </View>
  );
};

export default function CityShieldExtension({route, navigation}) {
  const {id} = route.params;
  return (
    <ScrollView
      style={{
        flex: 1,
        marginTop: StatusBar.currentHeight,
        padding: 10,
        backgroundColor: 'white',
      }}>
      <View style={{marginBottom: 15, marginTop: 10}}>
        <Label text="Full Name" />
        <FakeInput text="John Doe" />
      </View>
      <View style={{marginBottom: 15}}>
        <Label text="Registered Email" />
        <FakeInput text="anubhavnahata45@gmail.com" />
      </View>
      <View style={{marginBottom: 5}}>
        <Label text="Order Id" />
        <FakeInput text={`#${id}`} />
      </View>
      {/* light blue background */}
      <View
        style={{
          backgroundColor: '#e6f2ff',
          paddingLeft: 8,
          borderRadius: 5,
          paddingVertical: 10,
          marginBottom: 30,
        }}>
        <Text>Order Date : 2023-May-19</Text>
      </View>
      <View style={{marginBottom: 5}}>
        <Label text="Amount (in Rs.)" />
        <FakeInput text={`6528`} />
      </View>

      {/* small i tag text as a hyperlink */}
      <Text
        style={{
          fontSize: 12,
          marginLeft: 5,
          textDecorationLine: 'underline',
          textDecorationColor: 'blue',
          color: '#3e688e',
        }}>
        See how this amount is calculated
      </Text>
    </ScrollView>
  );
}
