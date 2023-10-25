import {FlatList, Text, TouchableOpacity, View, Image, TouchableWithoutFeedback} from 'react-native';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import resources from '../../../../res';
import styles from '../styles';
import {checkNotch, wp} from '../../../utility/Utils';
import {hitDefaultAddressApi, setAddressList} from '../../../redux/actions/AddressAction'

const YES = 'Yes';
const NO = 'No';

export class AddressListComponent extends Component {

  setDefaultAddress = id => {
    const addressList = JSON.parse(JSON.stringify(this.props.addressList));
    addressList.forEach(elem => {
      elem.primary = 'No';
      if (elem.id === id) {
        elem.primary = 'Yes';
      }
    });
    this.props.setAddressList(addressList)
    this.props.events.handleCloseAction()
    this.props
      .hitDefaultAddressApi(1, id)
      .then(data => {
      })
      .catch(error => {
      });
  };

  renderAddressItem = ({item, index}) => {
    return (
      <TouchableOpacity style={styles.addressItem} onPress={() => {
        if(item.primary == NO){
          this.setDefaultAddress(item.id)
        }else {
          this.props.events.handleCloseAction()
        }
        }}>
        <Image
          source={resources.images.inc_small_pin}
          style={styles.imgAddressPin}
        />
        <View style={styles.addressItemRightView}>
          <View style={styles.addressItemRightTopView}>
            <View style={styles.addressItemRightTopViewTextContainer}>
              <Text style={styles.txtName}>{item.full_name}</Text>
              {item.primary == YES && (
                <Text style={styles.defaultTag}>Default</Text>
              )}
            </View>
            <View style={styles.addressItemActionButtonContainer}>
                <Image
                  source={resources.images.img_right_icon}
                  style={styles.imgActionButton}
                />
            </View>
          </View>
          <View style={styles.addressItemCenterView}>
            <Text numberOfLines={2} style={styles.txtAddress1}>
              {item.address1 + ', ' + item.address2}
            </Text>
            <Text numberOfLines={2} style={styles.txtAddress2}>
              {item.city + ', ' + item.state + ' - ' + item.postal_code}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.editAddressView}
            activeOpacity={0.7}
            onPress={() => this.editAddress(item)}>
            <Text style={styles.txtEditAddress}>Edit Address</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  renderEmptyListView() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Image
          source={resources.images.img_no_address_found}
          resizeMode={'contain'}
        />
        <Text style={{fontSize: 14, fontFamily: resources.fonts.regular}}>
          {resources.strings.NO_ADDRESS_FOUND}
        </Text>
      </View>
    );
  }
  render() {
    return (
      <KeyboardAwareScrollView
        style={{marginTop: 10, borderWidth: 0}}
        bounces={false}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <FlatList
          scrollEnabled={false}
          data={this.props.addressList}
          extraData={this.props}
          renderItem={this.renderAddressItem}
          keyExtractor={(item, index) => 'address_' + index}
          ItemSeparatorComponent={() => (
            <View style={[styles.borderView, {marginBottom: 20}]} />
          )}
          ListEmptyComponent={this.renderEmptyListView}
        />
        <View style={{ height: checkNotch() ? 80 : 80,}}></View>
         <View
          style={{
            position: 'absolute',
            bottom: 0,
            backgroundColor: 'white',
            width: '100%',
            height: checkNotch() ? 80 : 60,
            paddingHorizontal: 16,
            borderTopColor: resources.colors.borderDot,
            borderTopWidth: 1, 
            justifyContent: 'center'
          }}>
          <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', }} onPress={() => this.props.events.handleAddAddress()}>
            <Text style={{fontFamily: resources.fonts.medium, fontSize: 16, fontWeight: '500', color: resources.colors.appBlue}}>Add new Address</Text>
            <Image source={resources.images.img_right_icon} style={{height: wp(16), width: wp(16), top: 1}} />
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

const mapStateToProps = state => {
  const {addressList} = state.addressReducer;
  return {addressList};
};

export default connect(mapStateToProps, {
  hitDefaultAddressApi, setAddressList
})(AddressListComponent);
