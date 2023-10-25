import React, { Component } from 'react';
import { View } from 'react-native'
import { Dropdown } from 'react-native-material-dropdown'
import styles from './styles'
import HeaderWithProfile from '../../genriccomponents/header/HeaderWithProfilePic'
import resources from '../../../res'
import MaterialInput from '../../genriccomponents/input/MaterialInput'
import Button from '../../genriccomponents/button/Button'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { connect } from 'react-redux';
import * as actions from '../../redux/actions/PaymentAction'
import APILoadingHOC from '../../genriccomponents/HOCS/APILoadingHOC'
import AppToast from '../../genriccomponents/appToast/AppToast'

class ChangePaymentMode extends Component {
    constructor(props) {
        super(props);
        this.orderId = this.props.route.params.orderId ? this.props.route.params.orderId : null
        this.state = {
            allPaymentModes: [],
            paymentMode: "",
            description: "",
            currentServiceType: "",
            currentPaymentMode: ""
        }
    }
    componentDidMount() {
        this.loadData()
    }
    loadData = () => {
        if (this.orderId) {
            this.props.getAllChangePaymentModesApi(this.orderId)
                .then((resp) => {
                    console.log(JSON.stringify(resp))
                    let data = resp.data;
                    this.setState({
                        currentServiceType: data.service_request_type[0].name,
                        currentPaymentMode: data.current_payment_mode.attribute[0],
                        allPaymentModes: data.available_payment_mode.attribute
                    })
                })
                .catch((err) => {
                    console.log("Error while getting all payment modes ", err)
                })
        } else {
            AppToast("Unable to get order id")
        }

    }

    renderHeader = () => {
        return (
            <HeaderWithProfile
                headerTitle={resources.strings.CHANGE_PAYMENT_MODE}
                isBackIconVisible={true}
                onBackClick={this.onBackClick}
                navigateProps={this.props.navigation}
            />
        )
    }

    onBackClick = () => {
        this.props.navigation.goBack()
    }
    onChangeDescription = (text) => {
        this.setState({ description: text })
    }
    onChangePaymentMode = (text) => {
        this.setState({ paymentMode: text })
    }
    render() {
        const { description,
            currentServiceType,
            currentPaymentMode,
            paymentMode,
            allPaymentModes } = this.state


        return (
            <View style={styles.fullScreen}>
                {this.renderHeader()}
                <KeyboardAwareScrollView
                    bounces={false}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}>


                <View style={styles.container}>
                    <MaterialInput label={resources.strings.SERVICES_REQUEST_TYPE}
                        value={currentServiceType}
                        onChangeText={() => { }}
                        inputProps={{
                            editable: false
                        }}
                    />

                    <MaterialInput label={resources.strings.CURRENT_PAYMENT_MODE}
                        value={currentPaymentMode}
                        onChangeText={() => { }}
                        inputProps={{
                            editable: false
                        }}
                    />
                    <Dropdown
                        onChangeText={(val, i, d) => { this.onChangePaymentMode(val) }}
                        data={allPaymentModes.map(val => { return { value: val } })}
                        value={paymentMode || 'Select'}
                        dropdownPosition={-5}
                        renderBase={(props) => (
                            <MaterialInput
                                isDropDownImageVisible={true}
                                label={resources.strings.NEW_PAYMENT_MODE}
                                onChangeText={this.onChangePaymentMode}
                                value={paymentMode}
                                inputProps={{
                                    autoCaptialize: 'none',
                                    editable: false
                                }}
                            >
                            </MaterialInput>
                        )}
                    />

                    <MaterialInput label={resources.strings.DESCRIPTION}
                        value={description}
                        onChangeText={this.onChangeDescription}
                        inputProps={{
                            maxLength: 300,
                            returnKeyType: 'done',
                            multiline: true
                        }}
                    ></MaterialInput>

                </View>
                </KeyboardAwareScrollView>

                <View style={styles.submitBtn}>
                    <Button btnStyle={styles.buttonStyle}
                        touchOpacityStyle={{}}
                        rounded
                        btnText={resources.strings.SUBMIT}
                        onPress={this.submitDiscription} />
                </View>
            </View>
        )
    }

    isValid = () => {
        const { paymentMode } = this.state
        if (paymentMode == "") {
            return false
        }
        return true
    }
    submitDiscription = () => {
        if (!this.isValid()) {
            AppToast("Please select payment mode")
            return
        }
        const { paymentMode, currentPaymentMode, description } = this.state
        this.props.hitChangePaymentModesApi(this.orderId,
            currentPaymentMode,
            paymentMode, description)
            .then((resp) => {
                AppToast(resp.message)
                this.onBackClick()
                // console.log("ChangePaymentModes => ", JSON.stringify(resp))
            })
            .catch((err) => {
                AppToast(err)
                this.onBackClick()
                // console.log("Error while changing the payment mode ", err)
            })
    }

}

const mapStateToProps = (state) => {
    return {};
};
let container = connect(mapStateToProps, { ...actions })(ChangePaymentMode);
let loader = APILoadingHOC(container)
export default loader;