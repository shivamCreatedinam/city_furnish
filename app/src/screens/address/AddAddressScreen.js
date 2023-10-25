import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {connect} from 'react-redux';
import styles from './styles';
import resources from '../../../res';
import MaterialInput from '../../genriccomponents/input/MaterialInput';
import Button from '../../genriccomponents/button/Button';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {
  validateMobileNumber,
  renderInputError,
  focusTo,
  validatePostal,
  isPlatformIOS,
  MapAPIKey,
} from '../../utility/Utils';
import * as actions from '../../redux/actions/AddressAction';
import {Dropdown} from 'react-native-material-dropdown';
import AppToast from '../../genriccomponents/appToast/AppToast';
//import all the components we are going to use.
import Geolocation from '@react-native-community/geolocation';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
const latitudeDelta = 0.025;
const longitudeDelta = 0.025;
import Icon from 'react-native-vector-icons/FontAwesome';

class AddAddressScreen extends Component {
  static ROUTE_NAME = 'AddAddressScreen';
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
  componentDidMount() {
    this.fetchNonServiceablePostalCode();
    // this.requestLocationPermission();
  }

  fetchNonServiceablePostalCode = () => {
    this.props
      .getNonServiceablePostalCode()
      .then(data => {
        // console.log("getNonServiceablePostalCode", JSON.stringify(data));
        this.setState({
          nonServiceablePostalCode: data.data,
        });
      })
      .catch(error => {
        // console.log('getNonServiceablePostalCode error', error);
      });
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

  requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
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

  getOneTimeLocation = () => {
    AppToast('Getting Location. Please Wait.');
    Geolocation.getCurrentPosition(
      //Will give you the current location
      position => {
        //getting the Longitude from the location json
        const currentLongitude = JSON.stringify(position.coords.longitude);

        //getting the Latitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);

        var region = {
          latitudeDelta,
          longitudeDelta,
          latitude: parseFloat(currentLatitude),
          longitude: parseFloat(currentLongitude),
        };

        this.setState({
          showLoading: false,
          region: region,
          forceRefresh: Math.floor(Math.random() * 100),
        });
        this.getCurrentAddress();
      },
      error => {
        AppToast('We are not able to find you location, Please Enter Manually');
        // console.log('error.message', error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 10000,
      },
    );
  };

  naviagteToNavigation = () => {
    this.requestLocationPermission();
  };
  focusToNext = ref => {
    focusTo(ref);
  };
  onChangeName = text => {
    this.setState({fullName: text});
  };
  onChangeMobileNumber = text => {
    this.setState({mobileNumber: text});
  };
  onChangeAlternateMobileNumber = text => {
    this.setState({alternateMobileNumber: text});
  };
  onChangeAddress1 = text => {
    this.setState({addressLine1: text});
  };
  onChangeAddress2 = text => {
    this.setState({addressLine2: text});
  };
  onChangeCity = text => {
    this.setState({city: text});
  };
  onChangeState = text => {
    this.setState({state: text});
  };
  onChangePostalCode = text => {
    this.setState({postalCode: text});
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
      <View style={styles.fullScreen}>
        <KeyboardAwareScrollView
          style={{marginTop: 10}}
          bounces={false}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
          extraScrollHeight={100}>
          <View style={styles.container}>
            <View style={styles.mapBox}>
              <React.Fragment>
                <View style={styles.panelUpperOuter}>
                <MaterialInput
              label={resources.strings.FullName}
              value={fullName}
              onChangeText={this.onChangeName}
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
              label={resources.strings.MobileNumber}
              onChangeText={this.onChangeMobileNumber}
              value={mobileNumber}
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
              label={resources.strings.alternateMobileNumber}
              onChangeText={this.onChangeAlternateMobileNumber}
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
            <View style={styles.dashedBorder} />
                  <View
                    style={[
                      styles.panelHeaderOuter,
                      this.state.listViewDisplayed
                        ? styles.panelFillOuter
                        : styles.panelOuter,
                    ]}>
                    <GooglePlacesAutocomplete
                      currentLocation={true}
                      enableHighAccuracyLocation={true}
                      ref={c => (this.searchText = c)}
                      placeholder="Search for your location..."
                      minLength={2} // minimum length of text to search
                      autoFocus={false}
                      returnKeyType={'search'}
                      listViewDisplayed={this.state.listViewDisplayed}
                      fetchDetails={true}
                      renderDescription={row => row.description}
                      enablePoweredByContainer={false}
                      listUnderlayColor="lightgrey"
                      onPress={(data, details) => {
                        this.setState({
                          listViewDisplayed: false,
                          address: data.description,
                          currentLat: details.geometry.location.lat,
                          currentLng: details.geometry.location.lng,
                          region: {
                            latitudeDelta,
                            longitudeDelta,
                            latitude: details.geometry.location.lat,
                            longitude: details.geometry.location.lng,
                          },
                        });
                        this.searchText.setAddressText('');
                        this.goToInitialLocation(this.state.region);
                      }}
                      renderRow={rowData => {
                        const title = rowData.structured_formatting.main_text;
                        const address =
                          rowData.structured_formatting.secondary_text;
                        return (
                          <View>
                            <Text style={{fontSize: 14}}>{title}</Text>
                            <Text style={{fontSize: 14}}>{address}</Text>
                          </View>
                        );
                      }}
                      renderLeftButton={() => (
                        <View style={styles.searchIconOuter}>
                          <Icon
                            name="search"
                            size={20}
                            color={resources.colors.appColor}
                            type="ionicon"
                          />
                        </View>
                      )}
                      textInputProps={{
                        onChangeText: text => {
                          this.setState({listViewDisplayed: true});
                        },
                        paddingTop: 15,
                        placeholderTextColor: resources.colors.labelColor,
                      }}
                      getDefaultValue={() => {
                        return ''; // text input default value
                      }}
                      query={{
                        key: MapAPIKey,
                        language: 'en', // language of the results
                        components: 'country:ind',
                      }}
                      styles={{
                        textInputContainer: {
                          backgroundColor: '#fff',
                          height: 52,
                          // borderColor: resources.colors.appColor,
                          // borderWidth: 1,
                          borderRadius: 4,
                          // marginHorizontal: 15,
                          paddingTop: 2,
                          shadowColor: 'gba(0, 0, 0, 0.8)', // IOS
                          shadowOffset: {height: 1, width: 1}, // IOS
                          shadowOpacity: 0.6, // IOS
                          shadowRadius: 2, //IOS
                          elevation: 6, // Android
                        },
                        textInput: {
                          borderRadius: 20,
                          height: 38,
                          color: '#5d5d5d',
                          fontSize: 16,
                        },
                        description: {
                          color: 'black',
                          fontSize: 12,
                        },
                        predefinedPlacesDescription: {
                          color: 'black',
                        },
                        listView: {
                          zIndex: 999,
                          flex: 1,
                          position: isPlatformIOS ? '' : 'absolute',
                          marginTop: isPlatformIOS ? 0 : 48,
                          marginHorizontal: 2,
                          borderColor: resources.colors.appColor,
                          borderBottomWidth: isPlatformIOS ? 1 : 2,
                          backgroundColor: resources.colors.white,
                          borderBottomLeftRadius: 8,
                          borderBottomRightRadius: 8,
                          shadowColor: 'rgba(0,0,0, .9)', // IOS
                          shadowOffset: {height: 1, width: 1}, // IOS
                          shadowOpacity: 1, // IOS
                          // shadowRadius: 1, //IOS
                          elevation: 2, // Android
                          paddingRight: 15,
                        },
                      }}
                      nearbyPlacesAPI="GooglePlacesSearch"
                      GooglePlacesSearchQuery={{
                        rankby: 'distance',
                        types: 'building',
                      }}
                      filterReverseGeocodingByTypes={[
                        'locality',
                        'administrative_area_level_3',
                      ]}
                      debounce={200}
                    />
                  </View>
                
                  <View style={[styles.panelBtnHeaderOuter]}>
                    <TouchableOpacity
                      onPress={() => this.naviagteToNavigation()}
                      style={styles.panelMapButtonOuter1}>
                      <Text style={styles.mapBtnTextOuter1}>
                        <Icon
                          name="map-marker"
                          size={18}
                          color={"#257B57"}
                          type="fontawesome"
                        />{' '}
                        Use current location
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </React.Fragment>
            </View>
            

            <MaterialInput
              label={resources.strings.Addressline1}
              onChangeText={this.onChangeAddress1}
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
              label={resources.strings.Addressline2}
              onChangeText={this.onChangeAddress2}
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
                value={
                  this.state.city1 && this.state.city1.length > 0 ? '' : ''
                }
                dropdownPosition={-4}
                renderBase={props => (
                  <MaterialInput
                    isDropDownImageVisible={true}
                    label={resources.strings.City}
                    onChangeText={this.onChangeCity}
                    error={renderInputError('Cityerr', error)}
                    errorKey={'Cityerr'}
                    callbackToRemoveError={this.callbackToRemoveError}
                    value={city}
                    inputProps={{
                      autoCaptialize: 'none',
                      maxLength: 30,
                      returnKeyType: 'next',
                      editable: false,
                    }}
                    // reference={this.address2Ref}
                    // onSubmitEditing={() => this.focusToNext(this.cityRef)}
                  />
                )}
                error={renderInputError('Cityerr', error)}
              />
            </View>
            <MaterialInput
              label={resources.strings.State}
              onChangeText={this.onChangeState}
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
              label={resources.strings.Postalcode}
              onChangeText={this.onChangePostalCode}
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
                {isDefault ? (
                  <Image
                    source={resources.images.icn_selectedsaqure}
                    style={styles.defaultAddressimg}
                  />
                ) : (
                  <Image
                    source={resources.images.icn_unSelectedSqure}
                    style={styles.defaultAddressimg}
                  />
                )}
              </TouchableOpacity>

              <Text style={styles.defaultText}>
                {resources.strings.MAKE_DEFAULT_ADDRESS}
              </Text>
            </View>
          </View>
        </KeyboardAwareScrollView>
        {this.checkLoadingAndLoadLiting()}
        {/* <View style={styles.AddAddreesContainer}> */}
        <View style={styles.AddAddreesBtn}>
          <Button
            btnStyle={styles.buttonStyle}
            touchOpacityStyle={{}}
            rounded
            btnText={resources.strings.SAVE}
            onPress={this.addNewAddress}
          />
        </View>
        {/* </View> */}
      </View>
    );
  }
  callbackToRemoveError = key => {
    let {error} = this.state;
    if (error.hasOwnProperty(key)) {
      error[key] = '';
      this.setState({
        error: error,
      });
    }
  };
  checkLoadingAndLoadLiting = () => {
    if (this.state.showLoading) {
      return (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }}>
          <ActivityIndicator
            size="large"
            color={resources.colors.appColor}
            style={{}}
          />
        </View>
      );
    } else {
      return <View />;
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
  addNewAddress = () => {
    const isValid = this.validate();
    if (!isValid) {
      return;
    }
    this.state.showLoading = true;
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
          this.props.callback();
          this.clearData();
        });

        AppToast(data.message);
      })
      .catch(error => {
        // console.log('Error inside AddAddres', error);
      });
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
    if (
      alternateMobileNumber == '' ||
      alternateMobileNumber == undefined ||
      alternateMobileNumber == null
    ) {
      errorObject.alternateMobileerr =
        resources.strings.alternatePhoneCannotBeEmpty;
    } else if (alternateMobileNumber.trim() == '') {
      errorObject.alternateMobileerr =
        resources.strings.alternatePhoneCannotBeEmpty;
    } else if (alternateMobileNumber && alternateMobileNumber.length > 10) {
      errorObject.alternateMobileerr = resources.strings.phone10length;
    }
    if (addressLine1 == '') {
      errorObject.addressLine1err = resources.strings.addressCannotBeEmpty;
    } else if (addressLine1.length <= 4) {
      errorObject.addressLine1err = resources.strings.Flat5length;
    }
    if (addressLine2 == '') {
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
}

const mapStateToProps = state => {
  return {};
};
let container = connect(
  mapStateToProps,
  {...actions},
)(AddAddressScreen);
export default container;
