import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import resources from '../../../res';
import styles from './styles'
import { connect } from 'react-redux';
import HeaderWithProfile from '../../genriccomponents/header/HeaderWithProfilePic'
import Button from '../../genriccomponents/button/Button'
import * as actions from '../../redux/actions/PaymentAction'
import Modal from 'react-native-modal';
import DatePicker from 'react-native-datepicker'
import { Dropdown } from 'react-native-material-dropdown';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import { getFormattedTime } from '../../utility/Utils'
import APILoadingHOC from '../../genriccomponents/HOCS/APILoadingHOC'
import AppToast from '../../genriccomponents/appToast/AppToast'

class MyPaymentScreen extends Component {
    static ROUTE_NAME = "MyPaymentScreen";
    constructor(props) {
        super(props)
        this.state = {
            invoiceList: {},
            invoiceCellHeight: "",
            isExpanded: false,
            isSelected: null,
            isLoading: true,
            startDate: "",
            endDate: "",
            formatData: "",
            formatResp: [
                {
                    value: 'pdf',

                }, {
                    value: 'excel',

                }]
        }
    }
    componentDidMount() {
        this.loadData()
    }

    loadData = () => {
        this.props.getMyPaymentsDetails()
            .then((data) => {
                this.setState({
                    invoiceList: data.data.payments,
                    isLoading: false
                })
            })
            .catch((error) => {
                console.log(error, "error")
            });
    }
    downloadStatement = () => {
        const { startDate, endDate, formatData, invoiceList } = this.state;
        if (Object.keys(invoiceList).length == 0) {
            AppToast("You do not have payment yet")
            return
        }

        if (startDate == "" || endDate == "" || formatData == "") {
            return AppToast("Please fill the above field.");
        } else if (startDate == null || endDate == null || formatData == null) {
            return AppToast("Please fill the above field.");
        } else {
            const type = formatData;
            const start = startDate;
            const end = endDate;
            this.clearData();
            setTimeout(() => {
                this.props.hitDownloadPaymentStatementApi(start, end, type)
                    .then((data) => {
                        let currentTime = getFormattedTime();
                        AppToast("Loading file..")
                        this.downloadFile(data.data.download_url, currentTime, type)
                    })
                    .catch((error) => {
                        AppToast("Error while downloading")
                        console.log(error, "error")
                    });
            }, 500);
        }
    }

    downloadFile = (fileURl, currentTime, type) => {
        let toFilePath = `${RNFS.DocumentDirectoryPath}/${currentTime}${type == 'pdf' ? `.pdf` : `.xls`}`
        RNFS.downloadFile({
            fromUrl: fileURl,
            toFile: toFilePath,
        }).promise.then((r) => {
            console.log(toFilePath)
            this.fileViewer(toFilePath)
        });
    }
    fileViewer = (path) => {
        FileViewer.open(path,
            {
                displayName: 'statement',
                showAppsSuggestions: true,
                showOpenWithDialog: true
            })
            .then(() => {
                console.log("file opend")
            })
            .catch(error => {
                console.log(error, "error in file opend")
                // error
            });
    }
    ActivityIndicatorLoadingView() {
        return (
            <ActivityIndicator
                color={resources.colors.appColor}
                size='large'
                style={styles.ActivityIndicatorStyle}
            />
        );
    }

    listInvoiceCell = ({ item, index }) => {
        const isExpanded = item.isExpand
        return (
            <View
                key={item.invoice_number.toString()}
                style={styles.cardStyle}>
                <View style={styles.invoiceCell} >
                    {
                        isExpanded ?
                            <TouchableOpacity  style={styles.cellStyle} onPress={() => this.onPressMinus(index)}>
                                <View style={styles.cellStyle}>
                                    <View style={styles.invoiceCon}>
                                        <Text style={styles.invoiceExpendText}>{resources.strings.INVOICE_NUMBER} :</Text>
                                        <Text style={styles.invoiceExpendNumber}
                                            numberOfLines={1}
                                            ellipsizeMode={'tail'}
                                        >
                                            {item.invoice_number ? item.invoice_number : "NA"}</Text>
                                    </View>
                                    <View style={styles.plusMinusIcon}>
                                        
                                        <Image source={resources.images.icn_Minus} style={styles.minusIcon} resizeMode={'contain'} />

                                    </View>

                                </View>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity style={styles.cellStyle} onPress={() => this.expendInvoiceCell(index)}>
                                <View style={styles.cellStyle}>
                                    <View style={styles.invoiceCon}>
                                        <Text style={styles.invoiceText}>{resources.strings.INVOICE_NUMBER} :</Text>
                                        <Text style={styles.invoiceNumber}
                                            numberOfLines={1}
                                            ellipsizeMode={'tail'}>{item.invoice_number ? item.invoice_number : "NA"}</Text>
                                    </View>

                                    <View style={styles.plusMinusIcon}>
                                        {/* <TouchableOpacity  onPress={() => this.expendInvoiceCell(index)}> */}
                                        <Image source={resources.images.icn_Plus} style={styles.plusIcon} resizeMode={'contain'} />
                                        {/* </TouchableOpacity> */}
                                    </View>
                                </View>
                            </TouchableOpacity>
                    }
                </View >
                {
                    isExpanded ?
                        <View
                            key={"h_"}
                            style={styles.rowDirection}>
                            <View style={styles.coloum}>
                                <Text style={styles.invoiceDetailsTitle}>{"Invoice Date :"}</Text>
                                <Text style={styles.invoiceDetails}>{item.invoice_date ? item.invoice_date : "NA"}</Text>
                            </View>
                            <View style={styles.coloum}>
                                <Text style={styles.invoiceDetailsTitle}>{"Amount Paid :"}</Text>
                                <Text style={styles.invoiceDetails}>₹ {item.amount_paid ? item.amount_paid : "0"}</Text>
                            </View>
                            <View style={styles.coloum}>
                                <Text style={styles.invoiceDetailsTitle}>{"Payment Date :"}</Text>
                                <Text style={styles.invoiceDetails}>{item.payment_date ? item.payment_date : "NA"}</Text>
                            </View>
                            <View style={styles.coloum}>
                                <Text style={styles.invoiceDetailsTitle}>{"Payment Type :"}</Text>
                                <Text style={[styles.invoiceDetails]}>{item.payment_type ? item.payment_type : "NA"}</Text>
                            </View>
                        </View> : <View />
                }
            </View >
        )


    }

    reduceCell = () => {
        const { invoiceList, isExpanded } = this.state
        this.setState({ invoiceList, invoiceCellHeight: 49, isExpanded: !isExpanded })
    }
    expendInvoiceCell = (index) => {
        const { invoiceList } = this.state;
        this.setState({ invoiceList: invoiceList.map((item, i) => ({ ...item, isExpand: i === index })) });
    }
    onPressMinus = (index) => {
        const { invoiceList } = this.state;
        const isExpand = invoiceList[index].isExpand;
        const newData = JSON.parse(JSON.stringify(invoiceList));
        newData[index].isExpand = !isExpand;
        this.setState({ invoiceList: newData });
    }

    FlatListItemSeparator = () => {
        return (
            <View style={styles.seperator} />
        );
    }
    renderEmptyListView() {
        return (
            <View style={{
                flex: 1,
                alignItems: 'center', justifyContent: 'center',
            }}>
                <Image source={resources.images.icn_emptyPayment}
                    // style={{ height: 100, width: 100 }}
                    resizeMode={'contain'}
                >
                </Image>
                <Text style={{
                    fontFamily: resources.fonts.regular,
                    marginVertical: 15, color: resources.colors.labelColor
                }}>{"No payment found"}</Text>
            </View>
        )
    }
    onPressBack = () => {
        this.props.navigation.goBack()
    }
    renderHeader = () => {
        return (
            <HeaderWithProfile
                headerTitle={resources.strings.MY_PAYMENT}
                isBackIconVisible
                onBackClick={this.onPressBack}
                navigateProps={this.props.navigation}
            />
        )
    }
    render() {
        const { invoiceList } = this.state
        return (
            <View style={styles.mainContainer}>
                {this.renderHeader()}
                <Modal isVisible={this.state.isModalVisible} onBackdropPress={this.toggleModal}
                    style={styles.view}>
                    {this.DefaultModalContent()}
                </Modal>
                {this.state.isLoading ? this.ActivityIndicatorLoadingView() : <View style={{ flex: 1 }}>
                    {
                        invoiceList && invoiceList.length > 0 ? <FlatList
                            data={invoiceList}
                            keyExtractor={(item, index) => { index.toString() }}
                            renderItem={this.listInvoiceCell}
                            showsVerticalScrollIndicator={false}
                            ItemSeparatorComponent={this.FlatListItemSeparator}
                        /> : this.renderEmptyListView()
                    }
                    <View style={styles.btnContainer}>
                        <View style={styles.btnStyle}>
                            <Button
                                rounded btnText={resources.strings.DOWNLOAD_STATEMENT}
                                onPress={this.toggleModal} />
                        </View>
                    </View>
                </View>}
            </View>
        );
    }
    toggleModal = () => {
        const { isModalVisible, invoiceList } = this.state;
        if (Object.keys(invoiceList).length == 0 && !isModalVisible) {
            AppToast("You do not have paymnets yet")
            return
        }
        this.setState({ isModalVisible: !this.state.isModalVisible });
    };
    clearData = () => {
        this.setState({
            startDate: "",
            endDate: "",
            formatData: "",
            isModalVisible: !this.state.isModalVisible
        })
    }
    DefaultModalContent = () => {
        const { startDate, endDate } = this.state
        return (
            <View style={styles.content} >
                <View style={{ height: 60, flexDirection: 'row', justifyContent: "space-between", alignItems: 'center' }}>
                    <View style={{ width: 0.1 }} />
                    <Text style={styles.statementText}>{"Download Statement"}</Text>
                    <TouchableOpacity style={{
                        justifyContent: 'flex-start',
                        width: 25, height: 25,
                        alignItems: 'flex-end',
                    }}
                        onPress={this.toggleModal}>
                        <Image source={resources.images.inc_small_cross}
                            style={{ height: 18, width: 18 }} />
                    </TouchableOpacity>
                </View>
                <View style={styles.seperator1} />
                <Text style={styles.lableStyle}>{"From Date"}</Text>
                <DatePicker
                    style={{ width: "100%" }}
                    date={startDate}
                    mode="date"
                    placeholder={"YYYY-MM-DD"}
                    format="YYYY-MM-DD"
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
                    onDateChange={(startDate) => { this.setState({ startDate: startDate }) }}
                />
                <Text style={styles.lableStyle}>{"To Date"}</Text>
                <DatePicker
                    style={{ width: "100%" }}
                    date={endDate}
                    mode="date"
                    placeholder={"YYYY-MM-DD"}
                    format="YYYY-MM-DD"
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
                    onDateChange={(endDate) => { this.setState({ endDate: endDate }) }}
                />
                <Text style={styles.lableStyle}>{"Statement Format"}</Text>
                <Dropdown
                    containerStyle={styles.input}
                    inputContainerStyle={{ borderBottomColor: resources.colors.labelColor, borderBottomWidth: 1 }}
                    onChangeText={(val, i, d) => {
                        this.setState({ formatData: val })
                    }}
                    data={this.state.formatResp.map(item => ({
                        value: item.value, ...item
                    }))}
                    // value={this.state.formatResp && this.state.formatResp.length > 0 ? "" : ""}
                    dropdownPosition={3}
                />
                <View style={{ paddingBottom: 20 }}>
                    <Button
                        rounded btnText={"Download"}
                        onPress={() => this.downloadStatement()} />
                </View>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {};
};
let container = connect(mapStateToProps, { ...actions })(MyPaymentScreen);
let loader = APILoadingHOC(container)
export default loader;