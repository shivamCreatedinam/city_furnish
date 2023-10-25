import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
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
} from '../../utility/Utils';
import * as actions from '../../redux/actions/AddressAction';
import {Dropdown} from 'react-native-material-dropdown';
import AppToast from '../../genriccomponents/appToast/AppToast';

class AddAddressScreen extends Component {
  static ROUTE_NAME = 'WishListScreen';
  constructor(props) {
    super(props);
    this.state = {
      fullName: '',
      mobileNumber: '',
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
  focusToNext = ref => {
    focusTo(ref);
  };
  onChangeName = text => {
    this.setState({fullName: text});
  };
  onChangeMobileNumber = text => {
    this.setState({mobileNumber: text});
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
              reference={this.mobileRef}
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
                maxLength: 50,
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
        // console.log("Error inside change state", error)
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
        // console.log("Error inside AddAddres", error)
      });
  };
  validate = () => {
    const {
      fullName,
      mobileNumber,
      addressLine1,
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
    if (mobileNumber.trim() == '') {
      errorObject.mobileerr = resources.strings.phoneCannotBeEmpty;
    } else if (mobileNumber && mobileNumber.length > 10) {
      errorObject.mobileerr = resources.strings.phone10length;
    } else if (!validateMobileNumber(mobileNumber)) {
      errorObject.mobileerr = resources.strings.enterValidPhone;
    }
    if (addressLine1 == '') {
      errorObject.addressLine1err = resources.strings.addressCannotBeEmpty;
    } else if (addressLine1 && addressLine1.length > 50) {
      errorObject.addressLine1err = resources.strings.AddressNotValid;
    } else if (addressLine1.length <= 4) {
      errorObject.addressLine1err = resources.strings.Address5length;
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
