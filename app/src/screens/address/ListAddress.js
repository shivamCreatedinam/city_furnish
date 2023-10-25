import React, {Component} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import styles from './styles';
import resources from '../../../res';
import Button from '../../genriccomponents/button/Button';
import {
  hitAddressListingApi,
  hitAddressDeleteApi,
  hitDefaultAddressApi,
} from '../../redux/actions/AddressAction';
import {getCartDetailApi} from '../../redux/actions/CartAction';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import AppToast from '../../genriccomponents/appToast/AppToast';
import {isPinOrFingerprintSet} from 'react-native-device-info';
import {isPlatformIOS} from '../../utility/Utils';

const YES = 'Yes';
const NO = 'No';

class ListAddress extends Component {
  static ROUTE_NAME = 'ListAddress';
  constructor(props) {
    super(props);
    this.state = {
      selectedType: '',
      page: 0,
      addressList: [],
      isPaginating: false,
      next: true,
      refreshing: false,
      make_default: 1,
      isLoading: true,
      grand_total: 0,
    };
  }
  componentDidFocus = () => {
    if (this.props.isComingFromBuyNow) {
      this.loadData();
    }
  };
  loadData = async () => {
    await this.props
      .getCartDetailApi()
      .then(data => {
        this.setState({
          grand_total: data.data.grand_total,
        });
      })
      .catch(error => {
        // console.log(error, 'error');
      });
  };
  async componentDidMount() {
    this.callListAddressApi();
    if (this.props.isComingFromBuyNow) {
      await this.loadData();
    }
  }
  callListAddressApi = () => {
    this.setState({page: 0, next: true}, () => {
      const {page} = this.state;
      this.props
        .hitAddressListingApi(page, 20)
        .then(data => {
          this.setState(
            {
              addressList: data.data,
              isLoading: false,
            },
            () => {
              // if (!isPlatformIOS) {
              if (
                data.data.length == 0 &&
                this.props.btnVisible &&
                !this.props.isCalled
              ) {
                this.props.moveToSecondPage();
              }
              // }
            },
          );
        })
        .catch(error => {
          this.setState({
            isLoading: false,
          });
          //   console.log('error inside list address', error);
        });
    });
  };

  loadMoreData = () => {
    const {page, isPaginating, next} = this.state;
    if (next && !isPaginating) {
      this.setState(
        {isPaginating: true, page: page + 1, refreshing: true},
        () => {
          setTimeout(() => {
            const {page} = this.state;
            this.proceedAddress(page, 20);
            this.setState({refreshing: false});
          }, 1000);
        },
      );
    }
  };
  proceedAddress = (page, isPaginating) => {
    const {addressList} = this.state;
    this.props
      .hitAddressListingApi(page, 20)
      .then(data => {
        {
          this.setState({
            addressList: [...addressList, ...data.data],
            isPaginating: false,
            next: data.data.length == 20,
            refreshing: false,
          });
        }
      })
      .catch(error => {
        // console.log('Address listing error', error);
        this.setState({isPaginating: false, refreshing: false});
      });
  };

  listAddressCell = ({item, index}) => {
    return (
      <View style={[styles.imageThumbnail, {marginBottom: 2, borderWidth: 0}]}>
        <View style={styles.row}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.chechbox]}
            onPress={() => this.selectedAddress(item.id)}>
             <Image
                source={resources.images.inc_small_pin}
                style={styles.chechboxImage}
              /> 
           
          </TouchableOpacity>
          <View style={[styles.cellStyle, {width: '70%'}]}>
            <Text style={styles.userNameText}>{`${item.full_name}    `}
              {
                item.primary == YES ?
                <Image
                  source={resources.images.inc_small_tag}
                  style={{width:50,height:20}}
                  resizeMode={'cover'}
                /> 
                : null
              }
              
            </Text>
            <Text
              style={styles.fontStyle}
              ellipsizeMode={'tail'}
              numberOfLines={3}>
              {item.address1 +
                ', ' +
                item.address2 +
                ', ' +
                item.city +
                ', ' +
                item.state +
                ' - ' +
                item.postal_code}
            </Text>

            <Text  onPress={() => this.editAddress(item)} style={{marginTop:10,textDecorationLine: 'underline',}}>
              Edit address
            </Text>
            {item.primary == YES ? (
              <Text style={styles.defaultTxt}></Text>
            ) : (
              <View />
            )}
          </View>
          {item.primary == YES ? (
            <View style={styles.viewEdit}>
              {/* <TouchableOpacity
                activeOpacity={0.7}
                style={styles.editTouchView}
                onPress={() => this.editAddress(item)}>
                <Image
                  source={resources.images.icn_addressEdit}
                  style={{width: 18, height: 18}}
                />
              </TouchableOpacity> */}
            </View>
          ) : (
            <View style={styles.viewEdit}>
              {/* <TouchableOpacity
                activeOpacity={0.7}
                style={styles.editTouchView}
                onPress={() => this.editAddress(item)}>
                <Image
                  source={resources.images.icn_addressEdit}
                  style={{width: 18, height: 18}}
                />
              </TouchableOpacity> */}

              <View style={styles.divider} />
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.editTouchView}
                onPress={() => this.deleteAddressOption(item.id)}>
                <Image
                  source={resources.images.icn_addressDelete}
                  style={{width: 18, height: 18}}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {this.props.btnVisible && (
          <Text
            style={{
              color: resources.colors.appColor,
              marginLeft: 20,
              fontFamily: resources.fonts.regular,
              marginBottom: 10,
              borderWidth: 0,
            }}>
            {item.warning}
          </Text>
        )}
      </View>
    );
  };

  editAddress = item => {
    this.props.navigation.navigation.navigate('EditAddressScreen', {
      itemList: {item: item},
      refrash: () => this.callListAddressApi(),
    });
  };
  deleteAddressOption = id => {
    Alert.alert(
      'Delete',
      'Are you want to delete this address',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('OK Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => this.deleteItem(id)},
      ],
      {cancelable: false},
    );
  };

  deleteAddress = id => {
    this.props
      .hitAddressDeleteApi(id)
      .then(data => {
        AppToast(data.message);
      })
      .catch(error => {
        // console.log('Error inside delete Address', error);
      });
  };
  deleteItem = id => {
    const {addressList} = this.state;

    let allItems = [...addressList];
    let addressItems = allItems.filter(item => item.id != id);
    this.setState({addressList: addressItems});
    this.deleteAddress(id);
  };
  selectedAddress = id => {
    const {addressList} = this.state;
    addressList.forEach(elem => {
      elem.primary = 'No';
      if (elem.id === id) {
        elem.primary = 'Yes';
      }
    });
    this.setState({addressList}, () => {
      this.markAddressAsDefault(id);
    });
  };
  markAddressAsDefault = id => {
    const {make_default} = this.state;
    this.props
      .hitDefaultAddressApi(make_default, id)
      .then(data => {
        // console.log(data.message);
      })
      .catch(error => {
        // console.log(error);
      });
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
        {this.state.isLoading ? this.ActivityIndicatorLoadingView() : <View />}
      </View>
    );
  }
  ActivityIndicatorLoadingView() {
    return (
      <ActivityIndicator
        color={resources.colors.appColor}
        size="large"
        style={styles.ActivityIndicatorStyle}
      />
    );
  }
  render() {
    const {addressList} = this.state;
    return (
      <View style={styles.fullScreen}>
        {addressList.length > 0 ? (
          <View style={styles.listAddressContainer}>
            <FlatList
              data={this.state.addressList}
              keyExtractor={(item, index) => index.toString()}
              renderItem={this.listAddressCell}
              onEndReached={this.loadMoreData}
              onEndReachedThreshold={0.1}
              ListFooterComponent={this.renderFooter}
              refreshing={this.state.refreshing}
              showsVerticalScrollIndicator={false}
            />
          </View>
        ) : (
          this.renderEmptyListView()
        )}
        {this.props.btnVisible ? (
          <View style={{marginVertical: 32}} />
        ) : (
          <View />
        )}
        {/* {this.props.btnVisible ? <View style={styles.AddAddreesBtn}>
                    <Button btnStyle={styles.buttonStyle}
                        touchOpacityStyle={{}}
                        rounded btnText={resources.strings.Proceed}
                        onPress={this.proceedAddresPress} />
                </View> : <View />} */}

        {this.props.btnVisible ? (
          <View style={styles.addressButtonContainer}>
            <View style={styles.addressFooterStyle}>
              {/* {this.props.isComingFromBuyNow ? <View style={styles.footerStyle}>
                            <Text style={styles.totalStyle}> ₹{this.state.grand_total} /-</Text>
                            <Text style={styles.descStyle} 
                                    onPress={() => {
                                        this.props.moveToCartPage()
                                    }} > {"View Details"} </Text>
                        </View> : <View style={styles.footerStyle}>
                            <Text style={styles.totalStyle}> ₹{this.props.checkoutOrderDetails.grand_total} /-</Text>
                            <Text style={styles.descStyle} 
                                    onPress={() => {
                                        this.props.moveToCartPage()
                                    }} > {"View Details"} </Text>
                        </View>} */}

              <View style={{marginRight: 0}}>
                <Button
                  btnStyle={[styles.proceedSection]}
                  touchOpacityStyle={{}}
                  rounded
                  btnText={resources.strings.Proceed}
                  onPress={this.proceedAddresPress}
                />
              </View>
            </View>
          </View>
        ) : (
          <View />
        )}
      </View>
    );
  }
  proceedAddresPress = () => {
    console.log(
      this.props.checkoutOrderDetails.total_renntal * 12,
      'checkout details',
    );
    const {addressList} = this.state;
    let primaryAddress = addressList.filter(item => {
      return item.primary == YES;
    });
    if (primaryAddress.length > 0) {
      let address = primaryAddress[0];

      if (address.warning == '') {
        const {navigation} = this.props;
        navigation.navigation.navigate('OrderSummaryScreen', {
          checkoutOrderDetails: this.props.checkoutOrderDetails,
          isComingFromBuyNow: this.props.isComingFromBuyNow,
          grandTotal: this.props.isComingFromBuyNow
            ? this.state.grand_total
            : this.props.checkoutOrderDetails.grand_total,
          selectedAddress: address,
          totalDeposit: this.props.checkoutOrderDetails.total_deposite,
        });
      } else {
        AppToast('Please select an address which belongs to selected city');
      }
    } else {
      // infomatory alert for user
      AppToast('Please select an address');
    }
  };

  renderFooter = () => {
    if (this.state.refreshing) {
      return (
        <ActivityIndicator size="large" color={resources.colors.appColor} />
      );
    } else {
      return null;
    }
  };
}
const mapStateToProps = state => {
  return {};
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      hitAddressListingApi,
      hitAddressDeleteApi,
      hitDefaultAddressApi,
      getCartDetailApi,
    },
    dispatch,
  );
}
let ListAddressContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ListAddress);
export default ListAddressContainer;
