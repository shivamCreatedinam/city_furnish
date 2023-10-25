import {
  View,
  Text,
  Image,
  PermissionsAndroid,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, {Component, useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import MaterialInput from '../../../genriccomponents/input/MaterialInput';
import resources from '../../../../res';
import {
  MapAPIKey,
  focusTo,
  isPlatformIOS,
  myOS,
  myWidth,
  renderInputError,
  validateMobileNumber,
  validatePostal,
  wp,
} from '../../../utility/Utils';
import AppToast from '../../../genriccomponents/appToast/AppToast';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {Dropdown} from 'react-native-material-dropdown';

const horizontalSpace = 16;
const latitudeDelta = 0.025;
const longitudeDelta = 0.025;
import Icon from 'react-native-vector-icons/FontAwesome';
import GooglePlacesInput from './GooglePlacesInput';
import {connect} from 'react-redux';
import {
  hitStateCityApi,
  hitAddAddressApi,
  changeAddressIndex,
  hitAddressListingApi, 
  setAddressList
} from '../../../redux/actions/AddressAction';
import Button from '../../../genriccomponents/button/Button';
import styles from '../styles';

class AddAddressComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mapFlag: false,
      locationStatus: '',
      region: {
        latitudeDelta,
        longitudeDelta,
        latitude: 12.840575,
        longitude: 77.651787,
      },
      listViewDisplayed: true,
      address: '',
      showAddress: false,
      currentLat: '',
      currentLng: '',
      forceRefresh: 0,
      addressDetails: {},

      fullName: '',
      mobileNumber: '',
      alternateMobileNumber: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      error: {},
      showLoading: false,
      isDefault: true,
      makeDefault: +true,
      country: 'IN',
      shipId: '',
      city1: [
        {
          value: 'Bangalore',
        },
        {
          value: 'Delhi',
        },
        {
          value: 'Gurgaon',
        },
        {
          value: 'Hyderabad',
        },
        {
          value: 'Mumbai',
        },
        {
          value: 'Pune',
        },
        {
          value: 'Ghaziabad',
        },
        {
          value: 'Noida',
        },
      ],
      nonServiceablePostalCode: [
        // '110085',' 500082'
      ],
      selectCity: null,
    };

    this.fullNameRef = React.createRef();
    this.mobileRef = React.createRef();
    this.address1Ref = React.createRef();
    this.address2Ref = React.createRef();
    this.cityRef = React.createRef();
    this.stateRef = React.createRef();
    this.postalCodeRef = React.createRef();
  }

  setAddressData = () => {
    const { item } = this.itemList
    console.log("item.address1",item.address1)
    if(item.address1 == "" || item.address1.length == 0) {
        this.requestLocationPermission();
    } else {
        this.setState({
            fullName: item.full_name,
            mobileNumber: item.phone,
            alternateMobileNumber: item.phone_alternate,
            addressLine1: item.address1,
            addressLine2: item.address2,
            city: item.city,
            state: item.state,
            postalCode: item.postal_code,
            shipId: item.id,
            isDefault: item.primary == "Yes" ? true : false,
        })
        // this.searchText.setAddressText(this.state.addressLine1);
    }
}

  onChangeTextBox = (key, value) => {
    this.setState({
      [key]: value,
    });
  };

  callbackToRemoveError = key => {
    let {error} = this.state;
    if (error.hasOwnProperty(key)) {
      error[key] = '';
      this.setState({
        error: error,
      });
    }
  };

  focusToNext = ref => {
    focusTo(ref);
  };

  requestLocationPermission = async () => {
    if (myOS === 'ios') {
      this.getOneTimeLocation();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Cityfurnish',
            message: 'This App needs to Access your location',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          //To Check, If Permission is granted
          this.getOneTimeLocation();
        } else {
          AppToast('Permission Denied by User, we will not proceed Fruther!!');
        }
      } catch (err) {
        console.warn('Warning', err);
      }
    }
  };
  naviagteToNavigation = () => {
    this.requestLocationPermission();
  };

  goToInitialLocation = region => {
    // console.log('addressRegion', region);
    let initialRegion = Object.assign({}, region);
    initialRegion['latitudeDelta'] = 0.005;
    initialRegion['longitudeDelta'] = 0.005;
    this.getCurrentAddress();
  };

  getCurrentAddress = () => {
    fetch(
      'https://maps.googleapis.com/maps/api/geocode/json?address=' +
        this.state.region.latitude +
        ',' +
        this.state.region.longitude +
        '&key=' +
        MapAPIKey,
    )
      .then(response => response.json())
      .then(responseJson => {
        // console.log('Address Location', JSON.stringify(responseJson));
        this.setAddressFieldAutoPopulate(responseJson);
      });
  };

  setAddressFieldAutoPopulate = responseJson => {
    let getAddressInfo = responseJson.results[0].formatted_address;
    let addressLength = getAddressInfo.split(',');
    let count = addressLength.length;
    let postcode = '';
    let address = '';
    let country = addressLength[count - 1];
    let state = addressLength[count - 2];
    let city = addressLength[count - 3];

    let formattedAddress = responseJson.results[0].formatted_address;
    let formattedAddressLength = formattedAddress.split(',');
    if (formattedAddressLength.length > 3) {
      for (let i = 0; i < count - 3; i++) {
        address += addressLength[i] + ',';
      }
    } else {
      address = '';
    }
    var pos = address.lastIndexOf(','),
      withoutComma = '';
    address = address.slice(0, pos) + withoutComma + address.slice(pos + 1);

    for (const component of responseJson.results[1].address_components) {
      // @ts-ignore remove once typings fixed
      const componentType = component;

      switch (componentType.types[0]) {
        case 'postal_code': {
          postcode = component.long_name;
          break;
        }

        case 'locality': {
          city = component.long_name;
          break;
        }

        case 'administrative_area_level_1': {
          state = component.long_name;
          break;
        }

        case 'country': {
          country = component.long_name;
          break;
        }
      }
    }

    // check city Validation
    city = this.cityValidationCondition(city);

    if (!this.cityExists(city)) {
      AppToast(resources.strings.cityCannotBeDelivered);
      return false;
    } else if (this.postalCodeExists(postcode)) {
      AppToast(resources.strings.postalCodeCannotBeDelivered);
      return false;
    } else {
      this.setState({
        address: address,
        addressLine2: address,
        city: city,
        state: state,
        postalCode: postcode,
        addressDetails: responseJson,
        mapFlag: true,
      });
    }
  };

  cityExists = city => {
    let caseCity = city.toLowerCase();
    return this.state.city1.some(function(el) {
      return caseCity.includes(el.value.toLowerCase());
    });
  };
  postalCodeExists = postalCode => {
    return this.state.nonServiceablePostalCode.some(function(el) {
      return postalCode.includes(el);
    });
  };

  cityValidationCondition = city => {
    if (city.includes('Bangalore') || city.includes('Bengaluru')) {
      return 'Bangalore';
    } else if (city.includes('Delhi') || city.includes('New Delhi')) {
      return 'Delhi';
    } else if (city.includes('Gurgaon') || city.includes('Gurugram')) {
      return 'Gurgaon';
    } else if (city.includes('Bombay') || city.includes('Mumbai')) {
      return 'Mumbai';
    } else if (
      city.includes('Gautam Buddh Nagar') ||
      city.includes('Greater Noida')
    ) {
      return 'Noida';
    } else if (city.includes('Hyderabad') || city.includes('Secunderabad')) {
      return 'Hyderabad';
    } else {
      return city;
    }
  };

  changeState = city => {
    this.props
      .hitStateCityApi(city)
      .then(data => {
        this.setState(
          {
            state: data.data,
          },
          () => {
            this.callbackToRemoveError('stateerr');
          },
        );
      })
      .catch(error => {
        // console.log('Error inside change state', error);
      });
  };

  clearData = () => {
    this.setState({
      fullName: '',
      mobileNumber: '',
      alternateMobileNumber: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      error: {},
    });
  };

  validate = () => {
    const {
      fullName,
      mobileNumber,
      alternateMobileNumber,
      addressLine1,
      addressLine2,
      address,
      city,
      state,
      postalCode,
    } = this.state;
    let errorObject = {};
    if (fullName.trim() == '') {
      errorObject.nameerr = resources.strings.nameCannotBeEmpty;
    } else if (fullName.length > 20) {
      errorObject.nameerr = resources.strings.name20length;
    } else if (fullName.length <= 1) {
      errorObject.nameerr = resources.strings.name2length;
    }
    if (
      mobileNumber == '' ||
      mobileNumber == undefined ||
      mobileNumber == null
    ) {
      errorObject.mobileerr = resources.strings.phoneCannotBeEmpty;
    } else if (mobileNumber.trim() == '') {
      errorObject.mobileerr = resources.strings.phoneCannotBeEmpty;
    } else if (mobileNumber && mobileNumber.length > 10) {
      errorObject.mobileerr = resources.strings.phone10length;
    } else if (!validateMobileNumber(mobileNumber)) {
      errorObject.mobileerr = resources.strings.enterValidPhone;
    }
    if (!Boolean(alternateMobileNumber)) {
      errorObject.alternateMobileerr =
        resources.strings.alternatePhoneCannotBeEmpty;
    } else if (alternateMobileNumber.trim() == '') {
      errorObject.alternateMobileerr =
        resources.strings.alternatePhoneCannotBeEmpty;
    } else if (alternateMobileNumber && alternateMobileNumber.length > 10) {
      errorObject.alternateMobileerr = resources.strings.phone10length;
    }
    if (!Boolean(addressLine1)) {
      errorObject.addressLine1err = resources.strings.addressCannotBeEmpty;
    } else if (addressLine1.length <= 4) {
      errorObject.addressLine1err = resources.strings.Flat5length;
    }
    if (!Boolean(addressLine2)) {
      errorObject.addressLine2err = resources.strings.addressCannotBeEmpty2;
    } else if (addressLine2.length <= 4) {
      errorObject.addressLine2err = resources.strings.Address5length;
    }
    if (city == '') {
      errorObject.Cityerr = resources.strings.cityCannotBeEmpty;
    }
    if (state == '') {
      errorObject.stateerr = resources.strings.StateCannotBeEmpty;
    }
    if (postalCode == '') {
      errorObject.postalCodeerr = resources.strings.postalCodeCannotBeEmpty;
    } else if (!validatePostal(postalCode)) {
      errorObject.postalCodeerr = resources.strings.postalCodeLength;
    } else if (this.postalCodeExists(postalCode)) {
      errorObject.postalCodeerr = resources.strings.postalCodeCannotBeDelivered;
    }

    this.setState({error: errorObject});
    return Object.keys(errorObject).length == 0;
  };

  addNewAddress = () => {
    const isValid = this.validate();
    if (!isValid) {
      return;
    }
    this.setState({
      showLoading: true,
    });
    const {
      fullName,
      mobileNumber,
      alternateMobileNumber,
      addressLine1,
      addressLine2,
      city,
      country,
      postalCode,
      makeDefault,
      shipId,
      state,
    } = this.state;

    this.props
      .hitAddAddressApi(
        fullName,
        addressLine1,
        addressLine2,
        city,
        state,
        country,
        mobileNumber,
        alternateMobileNumber,
        postalCode,
        makeDefault,
        shipId,
      )
      .then(data => {
        this.setState({showLoading: false}, () => {
          this.props.changeAddressIndex(0);
          this.clearData();
        });

        AppToast(data.message);
        this.props.events.handleCloseAction()
      })
      .catch(error => {
        // console.log('Error inside AddAddres', error);
      });
  };

  makeDefaultAddress = () => {
    const {isDefault} = this.state;
    this.setState({
      isDefault: !isDefault,
    });
    {
      !isDefault
        ? this.setState({
            makeDefault: +true,
          })
        : this.setState({
            makeDefault: +false,
          });
    }
  };

  getMyAddress = () => {
    this.props
        .hitAddressListingApi(0, 100)
        .then(data => {
          this.props.setAddressList(data.data)
        })
        .catch(error => {
          this.setState({
            isLoading: false,
          });
          //   console.log('error inside list address', error);
        });
  }

  renderDashBorder = () => {
    return (
      <Image
        source={resources.images.img_dash_line}
        style={{height: 1, width: '100%'}}
      />
    );
  };

  render() {
    const {
      fullName,
      mobileNumber,
      alternateMobileNumber,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      error,
      isDefault,
    } = this.state;
    return (
      <KeyboardAwareScrollView
        style={{borderWidth: 0}}
        contentContainerStyle={{
          width: myWidth - horizontalSpace * 2,
          marginHorizontal: wp(horizontalSpace),
        }}
        // bounces={false}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={{flex: 1, paddingBottom: 30}}>
          <MaterialInput
            placeholder={resources.strings.FullName}
            value={fullName}
            onChangeText={text => this.onChangeTextBox('fullName', text)}
            error={renderInputError('nameerr', error)}
            errorKey={'nameerr'}
            callbackToRemoveError={this.callbackToRemoveError}
            inputProps={{
              returnKeyType: 'next',
              maxLength: 20,
            }}
            onSubmitEditing={() => this.focusToNext(this.fullNameRef)}
          />
          <MaterialInput
            placeholder={resources.strings.MobileNumber}
            value={mobileNumber}
            onChangeText={text => this.onChangeTextBox('mobileNumber', text)}
            error={renderInputError('mobileerr', error)}
            errorKey={'mobileerr'}
            callbackToRemoveError={this.callbackToRemoveError}
            inputProps={{
              keyboardType: 'phone-pad',
              autoCaptialize: 'none',
              maxLength: 10,
              returnKeyType: 'done',
            }}
            reference={this.fullNameRef}
            onSubmitEditing={() => this.focusToNext(this.mobileRef)}
          />
          <MaterialInput
            placeholder={resources.strings.alternateMobileNumber}
            onChangeText={text =>
              this.onChangeTextBox('alternateMobileNumber', text)
            }
            value={alternateMobileNumber}
            error={renderInputError('alternateMobileerr', error)}
            errorKey={'alternateMobileerr'}
            callbackToRemoveError={this.callbackToRemoveError}
            inputProps={{
              keyboardType: 'phone-pad',
              autoCaptialize: 'none',
              maxLength: 10,
              returnKeyType: 'done',
            }}
            reference={this.mobileRef}
            onSubmitEditing={() => this.focusToNext(this.alternateMobileRef)}
          />
          {this.renderDashBorder()}
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 15,
              marginBottom: 15,
            }}
            // onPress={() => this.naviagteToNavigation()}
          >
            <Image
              source={resources.images.pin_green}
              style={{heigh: 15, width: 15}}
            />
            <Text
              style={{
                fontSize: 14,
                fontFamily: resources.fonts.medium,
                fontWeight: '500',
                color: resources.colors.uploadedText,
                marginLeft: 10,
              }}>
              Use my current location
            </Text>
          </TouchableOpacity>

          <GooglePlacesInput />

          <MaterialInput
            placeholder={resources.strings.Addressline1}
            onChangeText={text => this.onChangeTextBox('addressLine1', text)}
            value={addressLine1}
            error={renderInputError('addressLine1err', error)}
            errorKey={'addressLine1err'}
            callbackToRemoveError={this.callbackToRemoveError}
            inputProps={{
              autoCaptialize: 'none',
              maxLength: 50,
              returnKeyType: 'next',
            }}
            reference={this.alternateMobileRef}
            onSubmitEditing={() => this.focusToNext(this.address1Ref)}
          />

          <MaterialInput
            placeholder={resources.strings.Addressline2}
            onChangeText={text => this.onChangeTextBox('addressLine2', text)}
            value={addressLine2}
            error={renderInputError('addressLine2err', error)}
            errorKey={'addressLine2err'}
            callbackToRemoveError={this.callbackToRemoveError}
            inputProps={{
              autoCaptialize: 'none',
              maxLength: 100,
              returnKeyType: 'next',
            }}
            reference={this.address1Ref}
            onSubmitEditing={() => this.focusToNext(this.address2Ref)}
          />

          <View>
            <Dropdown
              animationDuration={1}
              rippleDuration={1}
              inputContainerStyle={{
                borderBottomColor: resources.colors.labelColor,
                borderBottomWidth: 1,
              }}
              onChangeText={(val, i, d) => {
                this.setState({selectCity: d[i], city: val}, () => {
                  this.callbackToRemoveError('Cityerr');
                });
                this.changeState(val);
              }}
              data={this.state.city1.map(item => ({
                value: item.value,
                ...item,
              }))}
              value={this.state.city1 && this.state.city1.length > 0 ? '' : ''}
              dropdownPosition={-4}
              renderBase={props => (
                <View style={{marginTop: 20}}>
                  <View
                    style={{
                      height: 50,
                      width: '100%',
                      borderWidth: 1,
                      paddingHorizontal: 15,
                      borderRadius: 10,
                      borderColor: resources.colors.borderDot,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <TextInput
                      value={city || resources.strings.City}
                      editable={false}
                      style={{color: resources.colors.grayColor}}
                    />
                    <Image
                      source={resources.images.img_DropDown}
                      style={{height: 10, width: 10}}
                    />
                  </View>
                  {error ? (
                    <Text
                      style={{
                        color: 'red',
                        height: 20,
                        fontFamily: resources.fonts.regular,
                      }}
                      numberOfLines={1}
                      ellipsizeMode={'middle'}>
                      {renderInputError('Cityerr', error)}
                    </Text>
                  ) : (
                    <View style={height ? {height: 6} : {height: 20}} />
                  )}
                </View>
              )}
              error={renderInputError('Cityerr', error)}
            />
          </View>

          <MaterialInput
            placeholder={resources.strings.State}
            onChangeText={text => this.onChangeTextBox('state', text)}
            error={renderInputError('stateerr', error)}
            errorKey={'stateerr'}
            callbackToRemoveError={this.callbackToRemoveError}
            value={state}
            inputProps={{
              autoCaptialize: 'none',
              maxLength: 30,
              returnKeyType: 'next',
              editable: false,
            }}
            reference={this.cityRef}
            onSubmitEditing={() => this.focusToNext(this.stateRef)}
          />
          <MaterialInput
            placeholder={resources.strings.Postalcode}
            onChangeText={text => this.onChangeTextBox('postalCode', text)}
            error={renderInputError('postalCodeerr', error)}
            errorKey={'postalCodeerr'}
            callbackToRemoveError={this.callbackToRemoveError}
            value={postalCode}
            inputProps={{
              keyboardType: 'phone-pad',
              autoCaptialize: 'none',
              maxLength: 6,
              returnKeyType: 'done',
            }}
            
            reference={this.stateRef}
          />
          <View style={styles.defaultAddress}>
            <TouchableOpacity onPress={() => this.makeDefaultAddress()}>
              <Image
                source={
                  isDefault
                    ? resources.images.icn_selectedsaqure
                    : resources.images.icn_unSelectedSqure
                }
                style={styles.defaultAddressimg}
              />
            </TouchableOpacity>

            <Text style={styles.defaultText}>
              {resources.strings.MAKE_DEFAULT_ADDRESS}
            </Text>
          </View>
          <Button
            rounded
            btnText={resources.strings.save_address}
            onPress={() => {
              this.addNewAddress();
              // events?.submitDiscription();
            }}
            btnStyle={styles.btnSubmit}
            showRightIcon={true}
            disableTouch={false}
          />
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

export default connect(
  null,
  {hitStateCityApi, hitAddAddressApi, changeAddressIndex, hitAddressListingApi, setAddressList},
)(AddAddressComponent);
