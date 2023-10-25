import React, { Component } from 'react'
import { View, Text, Image, BackHandler } from 'react-native'
import { connect } from 'react-redux'
import DatePicker from 'react-native-datepicker'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import Button from '../../../genriccomponents/button/Button'
import styles from './styles'
import MaterialInput from '../../../genriccomponents/input/MaterialInput'
import { renderInputError, focusTo } from '../../../utility/Utils'
import StepIndicator from 'react-native-step-indicator';
import HeaderWithProfile from '../../../genriccomponents/header/HeaderWithProfilePic'
import resources from '../../../../res'
import * as actions from '../../../redux/actions/DocumentAction'
import APILoadingHOC from "../../../genriccomponents/HOCS/APILoadingHOC"
import { customStyles } from '../../../utility/Utils'
import AppToast from '../../../genriccomponents/appToast/AppToast'
import { CreditQuestionsView } from '../../../genriccomponents/creditQuestion/CreditQuestionsView'

class CreditScore extends Component {
    static ROUTE_NAME = "CreditScore";
    constructor(props) {
        super(props);
        this.orderId = this.props.route.params && this.props.route.params.orderId ? this.props.route.params.orderId : 105616288;
        this.isUpfrontPayment = this.props.route.params && this.props.route.params.isUpfrontPayment ? this.props.route.params.isUpfrontPayment : false;
        this.isComingFromPaymentSucess = this.props.route.params && this.props.route.params.isComingFromPaymentSucess ? this.props.route.params.isComingFromPaymentSucess : false;
        this.state = {
            voterID: "",
            drivingLic: "",
            panNumber: "",
            dob: "",
            error: {},
            dobErr: false,
            currentPosition: 1,
            isCreditQuestionVisible: null,
            crifQues: {}
        }
        this.driveRef = React.createRef();
        this.panRef = React.createRef();
        this.dobRef = React.createRef();
    }



    componentDidMount() {
        if (this.isComingFromPaymentSucess) {
            BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        }

    }

    componentWillUnmount() {
        if (this.isComingFromPaymentSucess) {
            BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        }
    }

    handleBackButton() {
        AppToast("Please verify your credit score first")
        return true;
    }

    onChangeVoter = (text) => {
        this.setState({ voterID: text })
    }
    onChangeDriving = (text) => {
        this.setState({ drivingLic: text })
    }
    onChangePAN = (text) => {
        this.setState({ panNumber: text })
    }
    onBackClick = () => {
        if (this.isComingFromPaymentSucess) {
            AppToast("Please verify your credit score first")
        } else {
            this.props.navigation.goBack()
        }

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
            default: {
                break
            }
        }
        return state
    }
    currentScreenName = () => {

        return <View style={styles.currentNameView}>
            <Text style={styles.currentNameText}>{resources.strings.VERIFY_CREDIT_SCORE}</Text>
        </View>
    }

    render() {
        const { voterID, drivingLic, panNumber, dob, error, isCreditQuestionVisible } = this.state;
        var dateObj = new Date();
        var today = dateObj.setDate(dateObj.getDate() - 5475);
        var y = new Date(today)
        var cDate = y.getDate();
        var cMonth = y.getMonth() + 1;
        var cYear = y.getFullYear();
        var maxDate = cDate + "-" + cMonth + "-" + cYear;

        return (
            <View style={styles.mainContainer}>
                {this.renderHeader()}
                <KeyboardAwareScrollView>
                    {this.currentScreenName()}
                    {this.renderStatus()}
                    <View style={styles.subContainer}>
                        <View style={{ marginTop: 20 }}>
                            <Text style={styles.getCreditText}>{"Get your free credit score"}</Text>
                            <MaterialInput
                                label={resources.strings.VOTER_ID}
                                value={voterID}
                                onChangeText={this.onChangeVoter}
                                onSubmitEditing={() => focusTo(this.driveRef)}
                                inputProps={{
                                    returnKeyType: 'next',
                                    maxLength: 20,
                                }}
                            />
                            <MaterialInput
                                label={resources.strings.DRIVING_LIC}
                                value={drivingLic}
                                reference={this.driveRef}
                                onChangeText={this.onChangeDriving}
                                onSubmitEditing={() => focusTo(this.panRef)}
                                inputProps={{
                                    returnKeyType: 'next',
                                    maxLength: 16,
                                }}
                            />
                            <MaterialInput
                                label={resources.strings.PAN_NUMBER}
                                value={panNumber}
                                onChangeText={this.onChangePAN}
                                reference={this.panRef}
                                error={renderInputError("Pan", error)}
                                errorKey={"Pan"}
                                callbackToRemoveError={this.callbackToRemoveError}
                                onSubmitEditing={() => focusTo(this.dobRef)}
                                inputProps={{
                                    returnKeyType: 'next',
                                    maxLength: 10,
                                }}
                            />
                            <Text style={styles.lableStyle}>{resources.strings.DOB}</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <DatePicker
                                    style={{ width: "95%" }}
                                    date={dob}
                                    mode="date"
                                    placeholder={"DD-MM-YYYY"}
                                    maxDate={maxDate}
                                    // minDate={c}
                                    format="DD-MM-YYYY"
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    showIcon={false}
                                    customStyles={{
                                        dateInput: {
                                            height: 40,
                                            justifyContent: 'center',
                                            alignItems: 'flex-start',
                                            backgroundColor: resources.colors.white,
                                            borderWidth: 0,
                                            borderBottomWidth: 1,
                                            borderBottomColor: resources.colors.labelColor
                                        }
                                    }}
                                    onDateChange={(dob) => { this.setState({ dob: dob }) }}
                                />
                                <View style={styles.isDropDown}>
                                    <Image style={styles.imgDropDown} source={resources.images.img_DropDown}></Image>
                                </View>
                            </View>

                        </View>
                        <View style={{ flex: 1, marginTop: 15, marginBottom: 10 }}>
                            <Text style={styles.descriptionText}>{resources.strings.CREDIT_POLICY}</Text>
                        </View>


                    </View>
                </KeyboardAwareScrollView>
                <View style={styles.btnCon}>
                    <Button
                        rounded btnText={resources.strings.CHECK_CREDIT_SCORE}
                        onPress={() => this.checkScore()} />
                </View>

                {isCreditQuestionVisible ?
                    <CreditQuestionsView
                        onClickAnswer={this.onClickAnswer}
                        visibleModal={isCreditQuestionVisible}
                        onPressBackDrop={this.onPressBackDrop}
                        data={this.state.crifQues}
                        onSubmitCrifAnswer={this.onSubmitCrifAnswer} /> : <View />}
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
    onPressBackDrop = () => {
        this.setState({
            isCreditQuestionVisible: null
        })
    }

    onSubmitCrifAnswer = () => {
        const { crifQues } = this.state;

        const filtered = crifQues.optionsListNew.filter((item) => {
            if (item.isSelected) {
                return item
            }
        })
        console.log(filtered)
        if (filtered.length == 0) {
            AppToast("Please select any option.")
            return
        }


        this.props.hitCrifAnswerApi(crifQues.data.orderId,
            crifQues.data.reportId, crifQues.encode, filtered[0].ans, this.orderId)
            .then((resp) => {
                if (resp.message.includes('question')) {
                    const obj = this.manipulateData(resp.data);
                    this.setState({
                        crifQues: obj
                    })
                } else {
                    this.onPressBackDrop();
                    setTimeout(() => {
                        this.goToCheckCreditScore(resp.data)
                    }, 500)
                }
            })
            .catch((err) => {
                this.closeQuestionModalWith(err)
            })
    }

    closeQuestionModalWith = (message) => {
        this.onPressBackDrop();
        setTimeout(() => {
            AppToast(message)
        }, 500)
    }
    onClickAnswer = (selectedItem) => {
        const { crifQues } = this.state
        let arr1 = crifQues.optionsListNew.filter((item) => {
            if (selectedItem.ans == item.ans) {
                item.isSelected = true
            } else {
                item.isSelected = false;
            }
            return item;
        })

        let finalResult = {
            ...crifQues,
            optionsListNew: arr1
        }
        this.setState({
            crifQues: finalResult
        })
    }

    openCreditQuestionView = () => {
        this.setState({
            isCreditQuestionVisible: 'bottom'
        })
    }

    checkScore = () => {
        const { voterID, drivingLic, panNumber, dob } = this.state;
        const isValid = this.validate();
        if (!isValid) { return; }

        this.props.hitVerifyCreditScoreApi(voterID, drivingLic, panNumber, dob, this.orderId)
            .then((data) => {
                this.checkAndOpen(data)
            })
            .catch((error) => {
                AppToast(error)
                console.log(error, "error")
            });


    }
    manipulateData = (payload) => {
        let value = payload.data;
        let arr = value.optionsList;
        var result = arr.map(function (el) {
            var o = Object.assign({}, el);
            o.isSelected = false;
            o.ans = el.trim()
            return o;
        })
        let finalResult = {
            ...payload,
            optionsListNew: result
        }
        return finalResult

    }
    checkAndOpen = (data) => {

        if (data.message.includes("question")) {
            let crifData = this.manipulateData(data.data)
            this.setState({
                crifQues: crifData
            }, () => {
                this.openCreditQuestionView()
            })
        }
        else {
            this.goToCheckCreditScore(data.data)
        }

    }

    goToCheckCreditScore = (response) => {
        AppToast("Data successfully uploaded")
        this.props.navigation.navigate("CheckCreditScore", {
            orderId: this.orderId,
            isComingFromPaymentSucess: this.isComingFromPaymentSucess,
            isUpfrontPayment : this.isUpfrontPayment,
            creditScore: response.credit_score,
            descriptionText: response.score_comments
        })
    }

    validate = () => {
        const { voterID, drivingLic, panNumber, dob } = this.state;
        let errorObject = {};

        if (voterID == "" && drivingLic == "" && panNumber == "") {
            AppToast(resources.strings.PLEASE_ADD_ONE_ID)
            return
        }
        if (dob.trim() == "") {
            AppToast(resources.strings.PLEASE_SELECT_DATE)
            return
        }
        if (panNumber != "" && panNumber.length <= 5) {
            errorObject.Pan = resources.strings.enterValidPan
        }

        this.setState({ error: errorObject });
        return Object.keys(errorObject).length == 0;
    }
}
const mapStateToProps = (state) => {
    return {};
};
let container = connect(mapStateToProps, { ...actions, })(CreditScore);
let loader = APILoadingHOC(container);
export default loader;
