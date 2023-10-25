import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Switch,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import styles from './styles';
import HeaderWithProfile from '../../genriccomponents/header/HeaderWithProfilePic';
import resources from '../../../res';
import MaterialInput from '../../genriccomponents/input/MaterialInput';
import {renderInputError} from '../../utility/Utils';
import Button from '../../genriccomponents/button/Button';

class PaymentDetails extends Component {
  static ROUTE_NAME = 'WishListScreen';
  constructor(props) {
    super(props);
    this.state = {
      cfCoin: '',
      error: {},
      isWhatsAppNotif: false,
      isGst: false,
      isCardSelect: false,
      isExpende: false,
      isPaymentNotification: false,
      Data: [
        {
          imagePayment: resources.images.icn_card,
          paymentName: 'Credit/Debit Card',
          instruction:
            '- Get 100 CF coins and gift vouchers worth ₹ 2500 \n - No hassle of reminders and Payment Delays\n - Supported on selected card issuers / banks',
        },
        {
          imagePayment: resources.images.icn_netbanking,
          paymentName: 'Credit/Debit Card',
        },
        {
          imagePayment: resources.images.icn_netbanking,
          paymentName: 'Credit/Debit Card',
        },
      ],
    };
  }
  onPressBack = () => {
    this.props.navigation.goBack();
  };
  onChangeCoinValue = text => {
    this.setState({cfCoin: text});
  };
  onchangeWhatsAppNotification = value => {
    this.setState({isWhatsAppNotif: value});
  };
  onchangePaymentNotification = value => {
    this.setState({isPaymentNotification: value});
  };
  renderHeader = () => {
    return (
      <HeaderWithProfile
        headerTitle={resources.strings.cityfunishCoins}
        isBackIconVisible={true}
        onBackClick={this.onPressBack}
      />
    );
  };
  renderAmountCell = () => {
    return (
      <View style={styles.detailCard}>
        <View style={styles.orderCardContainer}>
          <View style={[styles.orderContainer, {flex: 1, borderWidth: 0}]}>
            <View>
              <Text style={styles.orderPropText}>{'Duration'}</Text>
              <Text style={styles.orderPropText}>{'Advance Rental'}</Text>
              <Text style={styles.orderPropText}>{'Refundable Deposite'}</Text>
              <Text style={styles.orderPropText}>{'Discount'}</Text>
              <Text style={styles.orderPropText}>{'Coins Redeemed'}</Text>
              <Text style={styles.orderPropText}>{'Delivery'}</Text>
            </View>
            <View>
              <Text style={styles.orderValuesText}>{':'}</Text>
              <Text style={styles.orderValuesText}>{':'}</Text>
              <Text style={styles.orderValuesText}>{':'}</Text>
              <Text style={styles.orderValuesText}>{':'}</Text>
              <Text style={styles.orderValuesText}>{':'}</Text>
              <Text style={styles.orderValuesText}>{':'}</Text>
            </View>
            <View>
              <Text style={styles.orderValuesText}>{'NA'}</Text>
              <Text style={styles.orderValuesText}>₹ {'NA'} /-</Text>
              <Text style={styles.orderValuesText}>₹ {'NA'} /-</Text>
              <Text style={styles.orderValuesText}>₹ {'0'} /-</Text>
              <Text style={styles.orderValuesText}>₹ {'0'} /-</Text>
              <Text style={styles.orderValuesText}>{'NA'}</Text>
            </View>
          </View>
          <View>
            <View style={styles.seprator1} />
            <View style={styles.totalContainer}>
              <Text style={[styles.totalTextStyle, {width: '56%'}]}>
                {'Total'}
              </Text>
              <Text style={[styles.totalTextStyle, {width: '4%'}]}>{':'}</Text>
              <Text
                style={[
                  styles.totalTextStyle,
                  {fontSize: 14, width: '40%', textAlign: 'right'},
                ]}>
                ₹ {'0'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };
  renderRedeemedCoin = () => {
    const {cfCoin, error} = this.state;
    return (
      <View>
        <View style={styles.coinView}>
          <Image
            style={{width: 33, height: 30}}
            source={resources.images.coins_icn}
          />
          <Text style={styles.cfCoinText}>Your CF Coins Balance</Text>
          <Text style={styles.cfCoinValue}>2382</Text>
        </View>
        <MaterialInput
          label={resources.strings.CF_COIN_REDEEMED}
          inputStyles={{marginTop: -15}}
          value={cfCoin}
          onChangeText={this.onChangeCoinValue}
          inputProps={{
            returnKeyType: 'next',
            maxLength: 20,
          }}
          onSubmitEditing={() => this.focusToNext(this.fullNameRef)}
        />
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Button
            btnStyle={styles.buttonStyle}
            textStyleOver={styles.redeemText}
            touchOpacityStyle={{}}
            rounded
            btnText={resources.strings.REMOVE}
            onPress={this.redeemAmount}
          />
        </View>

        <View style={{flexDirection: 'row'}}>
          <Text style={styles.redeemTextInstruction}>
            {
              '- Your Rental Payment Will Begin From The Date of Delivery \n- Once the order has been placed, you might be required to share few documents for KYC'
            }
            <TouchableOpacity>
              <Image
                style={{width: 14, height: 14, marginLeft: 5}}
                source={resources.images.icn_info}
              />
            </TouchableOpacity>
          </Text>
        </View>
      </View>
    );
  };
  redeemAmount = () => {
    alert('Redeemed');
  };
  renderWhatsAppNotification = () => {
    const {isWhatsAppNotif} = this.state;
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: 20,
          alignItems: 'center',
        }}>
        <Text style={styles.whatsAppNotifText}>
          Opt for whtsapp notification
        </Text>
        <Switch
          trackColor={{false: '#767577', true: resources.colors.bluish}}
          onValueChange={this.onchangeWhatsAppNotification}
          value={isWhatsAppNotif}
        />
      </View>
    );
  };
  checkGst = () => {
    const {isGst} = this.state;
    this.setState({
      isGst: !isGst,
    });
  };
  renderGstDetails = () => {
    const {isGst} = this.state;
    return (
      <View>
        <Text style={styles.gstDetailsText}>GST Details</Text>
        <View style={{flexDirection: 'row', marginVertical: 20}}>
          <TouchableOpacity onPress={() => this.checkGst()}>
            {isGst ? (
              <Image source={resources.images.icn_selectedsaqure} />
            ) : (
              <Image source={resources.images.icn_unSelectedSqure} />
            )}
          </TouchableOpacity>
          <Text style={styles.gstText}>I have GST Number</Text>
        </View>
      </View>
    );
  };
  cardSelect = () => {
    const {isCardSelect} = this.state;
    this.setState({
      isCardSelect: !isCardSelect,
    });
  };
  renderPaymentData = ({item, index}) => {
    const {isCardSelect, isExpende, isPaymentNotification} = this.state;
    const isExpanded = item.isExpand;
    console.log(item);

    return (
      <View>
        {isExpanded ? (
          <View>
            <View style={styles.imageThumbnail}>
              <Image
                style={{width: 36, height: 36, marginLeft: 8}}
                source={item.imagePayment}
              />
              <Text>{item.paymentName}</Text>
              <TouchableOpacity onPress={() => this.onPressMinus(index)}>
                <Image
                  style={{width: 18, height: 18, marginRight: 17}}
                  source={resources.images.icn_roundchecked}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={styles.whatsAppNotifText}>
                Opt for standing instruction
              </Text>
              <Switch
                trackColor={{false: '#767577', true: resources.colors.bluish}}
                onValueChange={this.onchangePaymentNotification}
                value={isPaymentNotification}
              />
            </View>
            <Text style={styles.instructionText}>{item.instruction}</Text>
          </View>
        ) : (
          <View>
            <View style={styles.imageThumbnail}>
              <Image
                style={{width: 36, height: 36, marginLeft: 8}}
                source={item.imagePayment}
              />
              <Text>{item.paymentName}</Text>
              <TouchableOpacity onPress={() => this.expendInvoiceCell(index)}>
                <Image
                  style={{width: 18, height: 18, marginRight: 17}}
                  source={resources.images.icn_roundCheck}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };
  reduceCell = () => {
    const {Data, isExpende, isCardSelect} = this.state;
    this.setState({Data, invoiceCellHeight: 49, isExpende: !isExpende});
  };
  expendInvoiceCell = index => {
    const {Data, isCardSelect} = this.state;
    this.setState({
      isCardSelect: !isCardSelect,
      Data: Data.map((item, i) => ({...item, isExpand: i === index})),
    });
  };
  onPressMinus = index => {
    const {Data, isCardSelect} = this.state;
    const isExpand = Data[index].isExpand;
    const newData = JSON.parse(JSON.stringify(Data));
    newData[index].isExpand = !isExpand;
    this.setState({Data: newData, isCardSelect: !isCardSelect});
  };
  renderPaymentMethod = () => {
    const {Data} = this.state;
    return (
      <View>
        <Text style={styles.gstDetailsText}> Payment Details</Text>
        <FlatList
          data={Data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={this.renderPaymentData}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  };

  render() {
    return (
      <View style={styles.mainContainer}>
        {this.renderHeader()}
        <KeyboardAwareScrollView>
          <View style={styles.flex1}>
            <Text style={styles.orderDetailsText}>
              {resources.strings.ORDER_DETAIL}
            </Text>

            {this.renderAmountCell()}
            {this.renderRedeemedCoin()}
            {this.renderWhatsAppNotification()}
            {this.renderGstDetails()}
            {this.renderPaymentMethod()}
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 33,
              }}>
              <Button
                btnStyle={styles.makePaymentButton}
                touchOpacityStyle={{}}
                rounded
                btnText={resources.strings.REMOVE}
                onPress={this.redeemAmount}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}
export default PaymentDetails;
