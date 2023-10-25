import {View, Text, Switch, Image} from 'react-native';
import React, {useState} from 'react';
import resources from '../../../../res';
import MyTextInput from '../../../genriccomponents/input/MyTextInput';
import { wp } from '../../../utility/Utils';

const GSTComponent = (props) => {
  const {isGstSelected, gstNumber, handleGSTSelect, handleGSTNumberChange, companyName, handleCompanyChange} = props
  return (
    <View style={{marginHorizontal: 16, marginBottom: 25}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text
            style={{
              fontFamily: resources.fonts.medium,
              fontSize: 25,
              fontWeight: '500',
              color: resources.colors.titleBlack,
            }}>
            #
          </Text>
          <Text
            style={{
              fontFamily: resources.fonts.medium,
              fontSize: 16,
              fontWeight: '500',
              color: resources.colors.titleBlack,
              marginLeft: 10,
            }}>
            I have a GST number
          </Text>
        </View>
        <Switch
          trackColor={{false: '#E3E1DC', true: '#2D9469'}}
          thumbColor={'white'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => handleGSTSelect()}
          value={isGstSelected}
        />
      </View>
      {
        isGstSelected ? (
            <View style={{marginTop: 15}}>
                <MyTextInput
                    value={gstNumber}
                    editable={true}
                    onChangeText={handleGSTNumberChange}
                    autoCaptialize={'none'}
                    autoCorrect={false}
                    autoFocus={false}
                    underlineColorAndroid={'transparent'}
                    placeholder={'GST number'}
                    rightButtonProps={{
                      isShow: false,
                    }}
                    returnKeyType={'Next'}
                    keyboardType={"number-pad"}
                    maxLength={15}
                  />
                  <MyTextInput
                    value={companyName}
                    editable={true}
                    onChangeText={handleCompanyChange}
                    autoCaptialize={'none'}
                    autoCorrect={false}
                    autoFocus={false}
                    underlineColorAndroid={'transparent'}
                    placeholder={'Company name'}
                    rightButtonProps={{
                      isShow: false,
                    }}
                    containerStyle={{marginTop: wp(20)}}
                    returnKeyType={'done'}
                  />
            </View>
        ) :
        <View />
      }
    </View>
  );
};

export default GSTComponent;
