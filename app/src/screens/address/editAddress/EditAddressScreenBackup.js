import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, Keyboard } from 'react-native'
import APILoadingHOC from "../../../genriccomponents/HOCS/APILoadingHOC";
import { connect } from 'react-redux';
import styles from '../styles'
import HeaderWithProfile from '../../../genriccomponents/header/HeaderWithProfilePic'
import resources from '../../../../res'
import MaterialInput from '../../../genriccomponents/input/MaterialInput'
import Button from '../../../genriccomponents/button/Button'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { validateMobileNumber, renderInputError, focusTo, validatePostal } from '../../../utility/Utils'
import * as actions from '../../../redux/actions/AddressAction'
import { Dropdown } from 'react-native-material-dropdown';
import AppToast from '../../../genriccomponents/appToast/AppToast'

class EditAddressScreen extends Component {
    static ROUTE_NAME = "EditAddressScreen";
    constructor(props) {
        super(props);
        this.itemList = this.props.route.params && this.props.route.params.itemList;
        this.refrash = this.props.route.params && this.props.route.params.refrash;
        this.state = {
            fullName: "",
            mobileNumber: "",
            addressLine1: "",
            addressLine2: "",
            city: "",
            state: "",
            postalCode: "",
            error: {},
            isDefault: false,
            makeDefault: +false,
            country: "IN",
            shipId: 5,
            city1: [{
                value: 'Bangalore',
            }, {
                value: 'Delhi',
            }, {
                value: 'Gurgaon',
            }, {
                value: 'Hyderabad',
            }, {
                value: 'Mumbai',
            }, {
                value: 'Pune',
            }, {
                value: 'Ghaziabad',
            }, {
                value: 'Noida',
            }],
            cityInit: "",
            selectCity: null,
            ListAddress: []
        }
        this.fullNameRef = React.createRef();
        this.mobileRef = React.createRef();
        this.address1Ref = React.createRef();
        this.address2Ref = React.createRef();
        this.cityRef = React.createRef();
        this.stateRef = React.createRef();
        this.postalCodeRef = React.createRef();
    }
    componentDidMount() {
        this.setAddressData()
    }
    setAddressData = () => {
        const { item } = this.itemList
        this.setState({
            fullName: item.full_name,
            mobileNumber: item.phone,
            addressLine1: item.address1,
            addressLine2: item.address2,
            city: item.city,
            state: item.state,
            postalCode: item.postal_code,
            shipId: item.id,
            isDefault: item.primary == "Yes" ? true : false
        })
    }
    renderHeader = () => {
        return (
            <HeaderWithProfile
                headerTitle={resources.strings.Address}
                isBackIconVisible={true}
                onBackClick={this.onBackClick}
            />
        )
    }
    onBackClick = () => {
        this.props.navigation.goBack()
    }
    focusToNext = (ref) => {
        focusTo(ref)
    }
    onChangeName = (text) => {
        this.setState({ fullName: text })
    }
    onChangeMobileNumber = (text) => {
        this.setState({ mobileNumber: text })
    }
    onChangeAddress1 = (text) => {
        this.setState({ addressLine1: text })
    }
    onChangeAddress2 = (text) => {
        this.setState({ addressLine2: text })
    }
    onChangeCity = (text) => {
        this.setState({ city: text })
    }
    onChangeState = (text) => {
        this.setState({ state: text })
    }
    onChangePostalCode = (text) => {
        this.setState({ postalCode: text })
    }
    render() {
        const { fullName, mobileNumber, addressLine1, addressLine2, city, state, postalCode, error, isDefault } = this.state
        const { item } = this.itemList
        return (

            <View style={styles.fullScreen}>
                {this.renderHeader()}
                <KeyboardAwareScrollView
                    style={{ marginTop: 10 }}
                    bounces={false}
                    keyboardShouldPersistTaps="always"
                    showsVerticalScrollIndicator={false}
                    extraScrollHeight={100}>
                    <View style={styles.editContainer}>
                        <MaterialInput label={resources.strings.FullName}
                            value={fullName}
                            onChangeText={this.onChangeName}
                            error={renderInputError("nameerr", error)}
                            errorKey={"nameerr"}
                            callbackToRemoveError={this.callbackToRemoveError}
                            inputProps={{
                                returnKeyType: 'next',
                                maxLength: 20,

                            }}
                            onSubmitEditing={() => this.focusToNext(this.fullNameRef)}
                        >

                        </MaterialInput>
                        <MaterialInput
                            label={resources.strings.MobileNumber}
                            onChangeText={this.onChangeMobileNumber}
                            value={mobileNumber}
                            error={renderInputError("mobileerr", error)}
                            errorKey={"mobileerr"}
                            callbackToRemoveError={this.callbackToRemoveError}
                            inputProps={{
                                keyboardType: 'phone-pad',
                                autoCaptialize: 'none',
                                maxLength: 10,
                                returnKeyType: 'done',
                            }}
                            reference={this.fullNameRef}
                            onSubmitEditing={() => this.focusToNext(this.mobileRef)}
                        >
                        </MaterialInput>
                        <MaterialInput
                            label={resources.strings.Addressline1}
                            onChangeText={this.onChangeAddress1}
                            value={addressLine1}
                            error={renderInputError("addressLine1err", error)}
                            errorKey={"addressLine1err"}
                            callbackToRemoveError={this.callbackToRemoveError}
                            inputProps={{
                                autoCaptialize: 'none',
                                maxLength: 50,
                                returnKeyType: 'next',
                            }}
                            reference={this.mobileRef}
                            onSubmitEditing={() => this.focusToNext(this.address1Ref)}
                        >
                        </MaterialInput>
                        <MaterialInput
                            label={resources.strings.Addressline2}
                            onChangeText={this.onChangeAddress2}
                            value={addressLine2}
                            error={renderInputError("addressLine2err", error)}
                            errorKey={"addressLine2err"}
                            callbackToRemoveError={this.callbackToRemoveError}
                            onPressGetOtp={this.onPressGetOtp}
                            inputProps={{
                                autoCaptialize: 'none',
                                maxLength: 50,
                                returnKeyType: 'next',
                            }}
                            reference={this.address1Ref}
                            onSubmitEditing={() => this.focusToNext(this.address2Ref)}
                        >
                        </MaterialInput>
                        <View style={{ marginTop: -5 }}>
                            <Dropdown
                                animationDuration={1}
                                rippleDuration={1}
                                label="City *"
                                selectedItemColor={resources.colors.labelColor}
                                labelFontSize={14}
                                labelColor={resources.colors.labelColor}
                                textColor={resources.colors.labelColor}
                                renderBase={(props) => (

                                    <MaterialInput
                                        isDropDownImageVisible={true}
                                        label={resources.strings.City}
                                        onChangeText={this.onChangeCity}
                                        error={renderInputError("Cityerr", error)}
                                        errorKey={"Cityerr"}
                                        callbackToRemoveError={this.callbackToRemoveError}
                                        value={city}
                                        inputProps={{
                                            autoCaptialize: 'none',
                                            maxLength: 30,
                                            returnKeyType: 'next',
                                            editable: false
                                        }}
                                        reference={this.address2Ref}
                                        onSubmitEditing={() => this.focusToNext(this.cityRef)}
                                    >
                                    </MaterialInput>


                                )}
                                onChangeText={(val, i, d) => {
                                    this.setState({ selectCity: d[i], city: val })
                                    this.changeState(val)
                                }}
                                data={this.state.city1.map(item => ({
                                    value: item.value, ...item
                                }))}
                                value={this.state.city1 && this.state.city1.length > 0 ? item.city : ""}
                                inputContainerStyle={{ borderBottomColor: resources.colors.labelColor, borderBottomWidth: 1 }}
                                dropdownPosition={-4}
                            />
                        </View>
                        <MaterialInput
                            textColor={resources.colors.black}
                            baseColor={resources.colors.black}
                            selectedItemColor={resources.colors.black}
                            label={resources.strings.State}
                            onChangeText={this.onChangeState}
                            error={renderInputError("stateerr", error)}
                            errorKey={"stateerr"}
                            callbackToRemoveError={this.callbackToRemoveError}
                            value={state}
                            inputProps={{
                                autoCaptialize: 'none',
                                maxLength: 30,
                                returnKeyType: 'next',
                                editable: false
                            }}
                            reference={this.cityRef}
                            onSubmitEditing={() => this.focusToNext(this.stateRef)}
                        >
                        </MaterialInput>
                        <MaterialInput
                            label={resources.strings.Postalcode}
                            onChangeText={this.onChangePostalCode}
                            error={renderInputError("postalCodeerr", error)}
                            errorKey={"postalCodeerr"}
                            callbackToRemoveError={this.callbackToRemoveError}
                            value={postalCode}
                            inputProps={{
                                keyboardType: 'phone-pad',
                                autoCaptialize: 'none',
                                maxLength: 6,
                                returnKeyType: 'done',
                            }}
                            reference={this.address2Ref}
                        >
                        </MaterialInput>
                        <View style={styles.defaultAddress}>
                            <TouchableOpacity onPress={() => this.makeDefaultAddress()}>
                                {
                                    isDefault ? <Image source={resources.images.icn_selectedsaqure} style={styles.defaultAddressimg} /> :
                                        <Image source={resources.images.icn_unSelectedSqure} style={styles.defaultAddressimg} />
                                }
                            </TouchableOpacity>

                            <Text style={styles.defaultText}>
                                {resources.strings.MAKE_DEFAULT_ADDRESS}
                            </Text>
                        </View>

                    </View>
                </KeyboardAwareScrollView>

                <View style={styles.AddAddreesBtn}>
                    <Button btnStyle={styles.buttonStyle} touchOpacityStyle={{}} rounded btnText={resources.strings.SAVE} onPress={this.addNewAddress} />
                </View>
            </View>

        )
    }
    callbackToRemoveError = (key) => {
        let { error } = this.state
        if (error.hasOwnProperty(key)) {
            error[key] = ""
            this.setState({
                error : error
            })
        }
    }

    changeState = (city) => {
        this.props.hitStateCityApi(city)
            .then((data) => {
                this.setState({
                    state: data.data
                })
            }).catch((error) => {
                console.log("Error inside change state", error)
            })
    }
    makeDefaultAddress = () => {
        Keyboard.dismiss();
        const { isDefault } = this.state
        this.setState({
            isDefault: !isDefault,
        })
        {
            !isDefault ? this.setState({
                makeDefault: +true,
            }) : this.setState({
                makeDefault: +false,

            })
        }

    }
    addNewAddress = () => {
        const isValid = this.validate();
        if (!isValid) { return; }
        const { fullName, mobileNumber, addressLine1, addressLine2, city, country, postalCode, isDefault, shipId, state } = this.state

        this.props.hitAddAddressApi(fullName, addressLine1, addressLine2, city, state, country, mobileNumber, postalCode, +isDefault, shipId)
            .then((data) => {
                this.props.navigation.navigate("AddressScreen")
                AppToast(data.message)
                if (this.refrash) {
                    this.refrash()
                    this.props.navigation.navigate("AddressScreen")
                }

            })
            .catch((error) => {
                console.log("Error inside AddAddres", error)
            })

    }
    validate = () => {
        const { fullName,
            mobileNumber,
            addressLine1,
            state,
            postalCode } = this.state;
        let errorObject = {};
        if (fullName.trim() == "") {
            errorObject.nameerr = resources.strings.nameCannotBeEmpty;

        } else if (fullName.length > 20) {
            errorObject.nameerr = resources.strings.name20length;
        } else if (fullName.length <= 1) {
            errorObject.nameerr = resources.strings.name2length
        }
        if (mobileNumber.trim() == "") {
            errorObject.mobileerr = resources.strings.phoneCannotBeEmpty;
        } else if (mobileNumber && mobileNumber.length > 10) {
            errorObject.mobileerr = resources.strings.phone10length;
        }
        else if (!validateMobileNumber(mobileNumber)) {
            errorObject.mobileerr = resources.strings.enterValidPhone;
        }
        if (addressLine1 == "") {
            errorObject.addressLine1err = resources.strings.addressCannotBeEmpty;
        } else if (addressLine1 && addressLine1.length > 50) {
            errorObject.addressLine1err = resources.strings.AddressNotValid;
        } else if (addressLine1.length <= 4) {
            errorObject.addressLine1err = resources.strings.Address5length;
        }
        if (state == "") {
            errorObject.stateerr = resources.strings.StateCannotBeEmpty;
        }
        if (postalCode == "") {
            errorObject.postalCodeerr = resources.strings.postalCodeCannotBeEmpty;
        } else if (!validatePostal(postalCode)) {
            errorObject.postalCodeerr = resources.strings.postalCodeLength;
        }


        this.setState({ error: errorObject });
        return Object.keys(errorObject).length == 0;
    };

}

const mapStateToProps = (state) => {
    return {};
};
let container = connect(mapStateToProps, { ...actions })(EditAddressScreen);
let loader = APILoadingHOC(container);

loader.getIntent = () => {
    return {
        routeName: EditAddressScreen.ROUTE_NAME,
    };
};
export default loader;