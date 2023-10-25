import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import res from '../../../res';
import NormalSnapSlider from './NormalSnapSlider';
import {isPlatformIOS} from '../../utility/Utils';
import resources from '../../../res';

const marks = [
  {value: 6, label: '6'},
  {value: 7, label: '7'},
  {value: 8, label: '8'},
  {value: 9, label: '9'},
  {value: 10, label: '10'},
  {value: 11, label: '11'},
  {value: 12, label: '12'},
  {value: 18, label: '18'},
  {value: 24, label: '24'},
];

function NormalTenureSlider(props) {
  const {
    rental_frequency_message,
    serverData,
    onSliderCallback,
    defaultItem,
    dataSet,
    onChangeTab
  } = props;
  // console.log(defaultItem,  " defaultItem")
  let localDefaultItem = 0;
  let lastIndex = serverData.length - 1;
  if (defaultItem > lastIndex) {
    localDefaultItem = lastIndex;
  } else {
    localDefaultItem = defaultItem;
  }

  

  const data = getFormatedArray(serverData);
  return serverData.length > 0 ? (
    <View>
        <View style={{backgroundColor:'#EFECE6',padding:12,borderRadius:20,width:'90%'}}>
          <View style={{flexDirection:'row',justifyContent:'space-between'}}>
            {
              dataSet?.map((item,index) => {
                if(item.active){
                  return(
                    <>
                      <View style={[styles.activeTab,{alignContent:'center'}]}>
                        <TouchableOpacity onPress={() => onChangeTab(index)}>
                          <Text style={{textAlign:'center',color:'white'}}>{item.monthName}</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )
                }else{
                  return(
                    <>
                      <TouchableOpacity onPress={() => onChangeTab(index)} style={{width:'25%',alignContent:'center',justifyContent:'center'}}>
                        <Text style={{textAlign:'center'}}>{item.monthName}</Text>
                      </TouchableOpacity>
                    </>
                  )
                }
                
              })
            }
          </View>
        </View>
        <View style={{backgroundColor:'#EFECE6',padding:12,borderRadius:20,marginTop:20}}>
            <View>
              <Text style={styles.titleText}>Rental details</Text>
            </View>
            <View style={styles.top}>
              <View style={styles.row}>
                <View>
                    <Image source={require("../../../res/images/productDetail/duration.png")} />
                </View>
                <View style={{marginLeft : 10}}>
                  <Text style={styles.lblText}>Duration</Text>
                  <Text style={styles.lblText1}>3+ months</Text>
                </View>
              </View>
            </View>
            <View style={styles.top}>
              <View style={styles.row}>
                <View>
                    <Image source={require("../../../res/images/productDetail/price.png")} />
                </View>
                <View style={{marginLeft : 10}}>
                  <Text style={styles.lblText}>Monthly Rent</Text>
                  <Text style={styles.lblText1}>₹709</Text>
                </View>
              </View>
            </View>
            <View style={styles.top}>
              <View style={styles.row}>
                <View>
                    <Image source={require("../../../res/images/productDetail/payment.png")} />
                </View>
                <View style={{marginLeft : 10}}>
                  <Text style={styles.lblText}>Security Deposit</Text>
                  <Text style={styles.lblText1}>₹0</Text>
                </View>
              </View>
            </View>
            <View style={styles.top}>
              <View style={styles.row}>
                <View>
                    <Image source={require("../../../res/images/productDetail/install.png")} />
                </View>
                <View style={{marginLeft : 10}}>
                  <Text style={styles.lblText}>One-time Installation charges</Text>
                  <Text style={styles.lblText1}>₹2,400</Text>
                </View>
              </View>
            </View>
        </View>
      {/* <Text
        style={{
          fontFamily: res.fonts.bold,
          color: '#3a3a3a',
          fontSize: 14,
          fontWeight: '500',
          marginTop: 10,
          marginBottom: isPlatformIOS ? 5 : 10,
          textAlign: 'center',
          marginLeft: -12,
        }}>
        {rental_frequency_message == undefined ||
        rental_frequency_message == '' ||
        rental_frequency_message == null
          ? 'How long do you want to rent this for? (Months)'
          : rental_frequency_message}
      </Text> */}
      {/* <NormalSnapSlider
        items={data}
        labelPosition="bottom"
        defaultItem={localDefaultItem}
        maximumTrackTintColor={res.colors.lightGreyTxt}
        minimumTrackTintColor={res.colors.appColor}
        thumbImage={res.images.img_slider_thumb}
        thumbTintColor={!isPlatformIOS ? res.colors.appColor : ''}
        // currentPosition={defaultItem ? defaultItem : serverData.length - 1}
        currentPosition={localDefaultItem}
        onSlidingComplete={value => {
          onSliderCallback(value);
        }}
      /> */}
    </View>
  ) : (
    renderEmptyListView()
  );
}
function renderEmptyListView() {
  return <View style={{height: 20}} />;
}
function getFormatedArray(serverData) {
  let arr = [];
  for (let index = 0; index < serverData.length; index++) {
    const element = serverData[index];
    arr.push({
      value: index,
      label: getMonthOnly(element.attr_name),
    });
  }
  return arr;
}

function getMonthOnly(string) {
  return string.substr(0, string.indexOf(' ')) + '+';
}
const styles = StyleSheet.create({
  sliderDot: {
    width: 18,
    height: 18,
    backgroundColor: res.colors.white,
    borderWidth: 5,
    borderColor: res.colors.appColor,
  },
  activeTab : {
    backgroundColor : "#2D9469",
    width:40,height:40,
    borderRadius:40/2,
    justifyContent:'center',alignItems:'center'
  },
  titleText :{
    fontSize : 18,
    fontWeight : '500',
    fontFamily: resources.fonts.bold,
  },
  top:{
    marginTop : 10
  },
  row:{
    flexDirection:'row'
  },
  lblText1 : {
    fontSize : 18,
    fontWeight : '500',
    fontFamily: resources.fonts.bold,
  },
  lblText:{
    fontSize : 14,
    fontWeight : '400',
    fontFamily: resources.fonts.bold,
  }
});
export default NormalTenureSlider;
