import React, { Component } from 'react'
import { View, Text, Image } from 'react-native'
import RNSpeedometer from 'react-native-speedometer'
import StepIndicator from 'react-native-step-indicator';
import HeaderWithProfile from '../../../genriccomponents/header/HeaderWithProfilePic'
import resources from '../../../../res'
import * as actions from '../../../redux/actions/DocumentAction'
import { connect } from 'react-redux'
import Button from '../../../genriccomponents/button/Button'
import styles from './styles'
import APILoadingHOC from "../../../genriccomponents/HOCS/APILoadingHOC"
import { customStyles } from '../../../utility/Utils'

class CheckCreditScore extends Component {
    static ROUTE_NAME = "CheckCreditScore";
    constructor(props) {
        super(props);
        this.orderId = this.props.route.params && this.props.route.params.orderId ? this.props.route.params.orderId : 548816763;
        this.isUpfrontPayment = this.props.route.params && this.props.route.params.isUpfrontPayment ? this.props.route.params.isUpfrontPayment : false;
        this.isComingFromPaymentSucess = this.props.route.params && this.props.route.params.isComingFromPaymentSucess ? this.props.route.params.isComingFromPaymentSucess : false;
        this.creditScore = this.props.route.params && this.props.route.params.creditScore ? this.props.route.params.creditScore : null;
        this.descriptionText = this.props.route.params && this.props.route.params.descriptionText ? this.props.route.params.descriptionText : "";

        this.state = {
            data: {},
            // data: {
            //     credit_score: "300",
            //     order_id: "548816763",
            //     id: '1',
            //     user_id: "66812"
            // },
            // isLoading: true,
            currentPosition: 1
        }
    }

    componentDidMount() {
        // this.loadData()
    }
    // loadData = () => {
    //     this.props.getKYCScoreApi()
    //         .then((data) => {
    //             this.setState({ data: data.data, isLoading: false })
    //         })
    //         .catch((error) => {
    //             this.setState({
    //                 isLoading: false
    //             })
    //             console.log(error, "error")
    //         });
    // }
    onBackClick = () => {
        this.props.navigation.goBack()
    }
    renderHeader = () => {
        return (
            <HeaderWithProfile
                headerTitle={resources.strings.Documentation}
                isBackIconVisible={true}
                isProfileIconVisible={false}
                onBackClick={this.onBackClick}
                navigateProps={this.props.navigation}
                toRoute={"MyAccountScreen"}
            />
        )
    }
    renderStatus = () => {
        const { currentPosition } = this.state

        return (
            <StepIndicator
                customStyles={customStyles}
                currentPosition={currentPosition}
                renderStepIndicator={(state) => { return this.putTickIndicator(state) }}
                stepCount={4}

            />
        )
    }

    putTickIndicator = (state) => {
        switch (state.stepStatus) {
            case 'finished': {
                return <Image source={resources.images.icn_document_done} style={styles.iconStyle} />
            }
            case 'unfinished': {
                return <Image source={resources.images.icn_process_status} style={styles.iconStyle} />
            }
            case 'current': {
                return <Image source={resources.images.icn_document_pending} style={styles.iconStyle} />
            }
            default:
        }
        return state
    }
    currentScreenName = () => {

        return <View style={styles.currentNameView}>
            <Text style={styles.currentNameText}>{resources.strings.VERIFY_CREDIT_SCORE}</Text>
        </View>


    }

    renderCreditScoreView = (value) => {
        // const { data } = this.state
        if (this.state.isLoading) {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontFamily: resources.fonts.regular }}>Loading..</Text>
                </View>
            )
        }

        if (value == 0) {
            return (
                <View style={styles.subContainer}>
                    <View style={{ height: 250, marginTop: 50, justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={resources.images.img_zero} style={{ width: 150, height: 150 }} />
                    </View>
                    <View style={styles.seperator} />
                    {/* style={styles.boxStyle} */}

              
                    <View style={styles.boxStyle} >
                        <Image source={resources.images.icn_large_coins}
                            style={{ marginHorizontal: 10 }}
                            resizeMode={"contain"} />
                        <Text style={styles.scoreText}>
                            {this.descriptionText ? this.descriptionText : "No credit score found"}
                        </Text>
                    </View>

                </View>
            )
        } else {
            return (
                <View style={styles.subContainer}>
                    <View style={{ height: 250, marginTop: 50 }}>
                        <RNSpeedometer
                            defaultValue={parseInt(value)}
                            value={parseInt(value)}
                            size={300}
                            minValue={0}
                            maxValue={900}
                        />
                    </View>
                    <View style={styles.seperator} />
                    <View style={{ flex: 1 }}>
                        <View style={styles.boxStyle}>
                            <Image source={resources.images.icn_large_coins} style={{ marginLeft: 20 }} resizeMode={"contain"} />
                            <View style={styles.textCon}>
                                <View style={styles.rowDirection}>
                                    <Text style={styles.scoreText}>{"Your Credit Score is"}</Text>
                                    <Text style={styles.coinsValue}>{value}</Text>
                                </View>
                                <Text>{this.descriptionText ? this.descriptionText : "No credit score found"}</Text>
                            </View>
                        </View>
                    </View>

                </View>
            )
        }
    }
    render() {
        // const { data } = this.state
        // const value = data.credit_score ? data.credit_score : 0

        const value = this.creditScore ? this.creditScore : 0

        return (
            <View style={styles.mainContainer}>
                {this.renderHeader()}
                {this.currentScreenName()}
                {this.renderStatus()}
                {this.renderCreditScoreView(value)}
                <View style={styles.btnCon}>
                    <Button
                        rounded btnText={resources.strings.NEXT}
                        onPress={() => { this.kycScreen() }} />
                </View>
            </View>
        )
    }
    kycScreen = () => {
        const { data } = this.state
        // const value = data.credit_score ? data.credit_score : 0
        const value = this.creditScore ? this.creditScore : 0
        if (this.orderId) {
            this.props.navigation.navigate("KycScreen", {
                creditScore: value,
                orderId: this.orderId,
                isComingFromPaymentSucess: this.isComingFromPaymentSucess,
                isUpfrontPayment : this.isUpfrontPayment
            })
        }

    }
}
const mapStateToProps = (state) => {
    return {};
};
let container = connect(mapStateToProps, { ...actions, })(CheckCreditScore);
let loader = APILoadingHOC(container);
export default loader;
