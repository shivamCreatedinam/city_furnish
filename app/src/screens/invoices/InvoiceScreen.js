import React, { Component } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Image, Linking } from 'react-native';
import HeaderWithProfilePic from '../../genriccomponents/header/HeaderWithProfilePic'
import Button from '../../genriccomponents/button/Button'
import resources from '../../../res';
import styles from './styles'
import * as actions from '../../redux/actions/InvoiceAction';
import { connect } from 'react-redux';
import { isiPhoneX, } from '../../utility/Utils';
// import APILoadingHOC from '../../genriccomponents/HOCS/APILoadingHOC'

const LOAD_DATA_COUNT = 15

class InvoiceScreen extends Component {
    static ROUTE_NAME = "InvoiceScreen";
    constructor(props) {
        super(props)
        this.state = {
            invoiceList: [],
            isExpende: false,
            total_outstanding_amount: 0,
            isRefreshing: false,
            showLoading: true,
            next: true,
            coins_amount: 0
        }
        this.pageNumber = 1;
    }

    componentDidMount() {
        this.loadDataInitially()
    }
    loadDataInitially = () => {
        // let data = [{
        //     "invoice_id": "246710000521320288",
        //     "invoice_number": "INV-17309hgfhgccnbcnjhghghjgjhgjhb3",
        //     "order_number": "1439200230",
        //     "amount": 3190,
        //     "invoice_date": "2020-06-02",
        //     "status": "PaymentDone",
        //     "invoice_url": "https: \/\/zohosecurepay.com\/books\/cityfurnish\/secure?CInvoiceID=2-64752d13135842b19ae6fc1dfdffd3927185c51bfbaf7ae5b12c09848de23e7add0776f031cc4b77a44f80c37ff2870575548d66d88ccabba9e734460f00f854a489615aa926242e",
        //     "transaction_date": "2020 - 06 - 02 13: 56: 39"
        // },
        // {
        //     "invoice_id": "246710000521320288",
        //     "invoice_number": "INV-17309hg3",
        //     "order_number": "1439200230",
        //     "amount": 3190,
        //     "invoice_date": "2020-06-02",
        //     "status": "PaymentDone",
        //     "invoice_url": "https: \/\/zohosecurepay.com\/books\/cityfurnish\/secure?CInvoiceID=2-64752d13135842b19ae6fc1dfdffd3927185c51bfbaf7ae5b12c09848de23e7add0776f031cc4b77a44f80c37ff2870575548d66d88ccabba9e734460f00f854a489615aa926242e",
        //     "transaction_date": "2020 - 06 - 02 13: 56: 39"
        // }]
        // this.setState({
        //     invoiceList: data,
        //     showLoading: false
        // })
        this.props.hitInvoiceListingApi(this.pageNumber, LOAD_DATA_COUNT)
            .then((data) => {
                let arr = data.data.invoices.map((item) => ({ ...item, isExpended: false }))
                this.setState({
                    total_outstanding_amount: data.data.total_outstanding_amount,
                    coins_amount: data.data.coins_amount,
                    invoiceList: [...this.state.invoiceList, ...arr],
                    showLoading: false
                })

            })
            .catch((err) => {
                this.setState({
                    showLoading: false
                })
                console.log(err)
            })
    }

    handleLoadMore = () => {
        if (!this.state.showLoading && this.state.next) {
            this.pageNumber = this.pageNumber + 1; // increase page by 1
            this.loadMoreData(); // method for API call 
        }
    };
    loadMoreData = () => {
        if (this.pageNumber > 2) {
            return
        }
        this.setState({
            showLoading: true
        })

        this.props.hitInvoiceListingApi(this.pageNumber, LOAD_DATA_COUNT)
            .then((data) => {
                //adding the new data with old one available in Data Source of the List
                let arr = data.data.invoices.map((item) => ({ ...item, isExpended: false }))
                this.setState({
                    total_outstanding_amount: data.data.total_outstanding_amount,
                    invoiceList: [...this.state.invoiceList, ...arr],
                    coins_amount: data.data.coins_amount,
                    showLoading: false,
                    next: data.data.invoices.length == LOAD_DATA_COUNT ? true : false
                })
            })
            .catch((err) => {
                this.setState({
                    showLoading: false
                })
                console.log(err)
            })
    }
    onRefresh = () => {
        const { invoiceList } = this.state
        while (invoiceList.length > 0) {
            invoiceList.pop();
        }
        this.pageNumber = 1
        this.setState({
            showLoading: true
        })
        this.props.hitInvoiceListingApi(this.pageNumber, LOAD_DATA_COUNT)
            .then((data) => {
                //adding the new data with old one available in Data Source of the List
                let arr = data.data.invoices.map((item) => ({ ...item, isExpended: false }))
                this.setState({
                    total_outstanding_amount: data.data.total_outstanding_amount,
                    invoiceList: [...this.state.invoiceList, ...arr],
                    coins_amount: data.data.coins_amount,
                    isRefreshing: false,
                    showLoading: false,
                    next: true
                })
            })
            .catch((err) => {
                this.setState({
                    isRefreshing: false,
                    showLoading: false,
                })
                console.log(err)
            })
    }
    handleClick = (url) => {
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                console.log("Don't know how to open URI: " + this.props.url);
            }
        });
    };
    listInvoiceCell = ({ item, index }) => {
        const isExpende = item.isExpended
        return (
            <View style={styles.cardStyle}>
                <View style={styles.invoiceCell} >
                    {
                        isExpende ?
                        <TouchableOpacity style={styles.cellStyle} onPress={() => this.onPressMinus(index)}>
                            <View style={styles.cellStyle}>
                                <View style={styles.invoiceCon}>
                                    <Text style={styles.invoiceExpendText}>{"Invoice Number :"}</Text>
                                    <Text style={styles.invoiceExpendNumber}
                                        numberOfLines={1}
                                        ellipsizeMode={'tail'}>
                                        {item.invoice_number ? item.invoice_number : "NA"}
                                    </Text>
                                </View>
                                <View style={styles.plusMinusIcon}>
                                    {/* <TouchableOpacity style={styles.plusMinusIcon} onPress={() => this.onPressMinus(index)}> */}
                                        <Image source={resources.images.icn_Minus} style={styles.minusIcon}
                                            resizeMode={'contain'} />
                                    {/* </TouchableOpacity> */}
                                </View>

                            </View>
                             </TouchableOpacity>
                            :
                            <TouchableOpacity style={styles.cellStyle} onPress={() => this.expendInvoiceCell(index)}>
                            <View style={styles.cellStyle}>
                                <View style={styles.invoiceCon}>
                                    <Image source={resources.images.icn_tickInvoices} style={styles.tickInvoices} />
                                    <Text style={styles.invoiceText}>{"Invoice Number :"}</Text>
                                    <Text style={styles.invoiceNumber}
                                        numberOfLines={1}
                                        ellipsizeMode={'tail'}>
                                        {item.invoice_number ? item.invoice_number : "NA"}</Text>
                                </View>

                                <View  style={styles.plusImgIcon}>
                                    {/* <TouchableOpacity style={styles.plusImgIcon} onPress={() => this.expendInvoiceCell(index)}> */}
                                    <Image source={resources.images.icn_Plus} style={styles.plusIcon}
                                        resizeMode={'contain'} />
                                    {/* </TouchableOpacity> */}
                                </View>
                            </View>
                            </TouchableOpacity>
                    }
            </View >
                {
            isExpende ?
                <View style={styles.rowDirection}>
                    <View style={styles.coloum}>
                        <Text style={styles.invoiceDetailsTitle}>{"Invoice Date :"}</Text>
                        <Text style={styles.invoiceDetails}>{item.invoice_date ? item.invoice_date : "NA"}</Text>
                    </View>
                    <View style={styles.coloum}>
                        <Text style={styles.invoiceDetailsTitle}>{"Amount :"}</Text>
                        <Text style={styles.invoiceDetails}>₹ {item.amount ? item.amount : "0"}</Text>
                    </View>
                    <View style={styles.coloum}>
                        <Text style={styles.invoiceDetailsTitle}>{"Transaction Date :"}</Text>
                        <Text style={styles.invoiceDetails}>{item.transaction_date ? item.transaction_date : "NA"}</Text>
                    </View>
                    <View style={styles.buttonCon}>
                        <TouchableOpacity
                            style={[styles.dowloadInvoce,
                            {
                                backgroundColor: item.status == "Payment Done" ?
                                    resources.colors.appColor : resources.colors.greyLight
                            }]}
                            activeOpacity={0.7}
                            disabled={item.status == "Payment Done" ? false : true}
                            onPress={() => this.handleClick(item.invoice_url)}>
                            <Text style={styles.textInvoice}>{"Download Invoice"}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={[styles.payNowBtn,
                            {
                                backgroundColor: item.status == "Payment Done" ?
                                    resources.colors.greyLight : resources.colors.appColor
                            }]}
                            onPress={() => this.onClickPayNowofInvoice(item)}
                            disabled={item.status == "Payment Done" ? true : false}
                        >
                            <Text style={styles.textInvoice}>{"Pay Now"}</Text>
                        </TouchableOpacity>
                    </View>
                </View> : <View />
        }

            </View >
        )
    }
    onClickPayNowofInvoice = (item) => {
        this.props.navigation.navigate("PayOutstandingScreen", {
            invoiceId: item.invoice_id,
            callback: this.onPaymentSuccess,
            outstandingAmount: item.amount,
            coinsAmount: this.state.coins_amount
        })
    }
    payNowAllOutStandingMoney = () => {
        this.props.navigation.navigate("PayOutstandingScreen", {
            invoiceId: "",
            callback: this.onPaymentSuccess,
            outstandingAmount: this.state.total_outstanding_amount,
            coinsAmount: this.state.coins_amount

        })
    }
    onPaymentSuccess = () => {
        this.onRefresh()
    }





    reduceCell = () => {
        const { invoiceList, isExpende } = this.state
        this.setState({ invoiceList, isExpende: !isExpende })
    }
    expendInvoiceCell = (index) => {
        const { invoiceList } = this.state;
        this.setState({ invoiceList: invoiceList.map((item, i) => ({ ...item, isExpended: i === index })) });
    }
    onPressMinus = (index) => {
        const { invoiceList } = this.state;
        const isExpended = invoiceList[index].isExpended;
        const newData = JSON.parse(JSON.stringify(invoiceList));
        newData[index].isExpended = !isExpended;
        this.setState({ invoiceList: newData });
    }

    renderHeader = () => {
        return (
            <HeaderWithProfilePic
                headerTitle={resources.strings.INVOICES}
                isBackIconVisible
                onBackClick={this.onBackClick}
                navigateProps={this.props.navigation} />
        )
    }
    onBackClick = () => {
        this.props.navigation.goBack()
    }
    renderFooter = () => {
        if (this.state.showLoading) {
            return <ActivityIndicator size="large" color={resources.colors.appColor} />;
        } else {
            return null;
        }

    };
    FlatListItemSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: resources.colors.sepratorWhite,
                }}
            />
        );
    }
    renderEmptyListView = () => {
        if (this.state.showLoading) {
            return this.ActivityIndicatorLoadingView()
        } else {
            return this.renderEmpty()
        }

    }
    renderEmpty = () => {
        return (
            <View style={{
                flex: 1,
                alignItems: 'center', justifyContent: 'center',
            }}>
                <Image source={resources.images.icn_emptyInvoice}
                    // style={{ height: 100, width: 100 }}
                    resizeMode={'contain'}
                >

                </Image>
                <Text style={{
                    fontFamily: resources.fonts.regular,
                    marginVertical: 15, color: resources.colors.labelColor
                }}>{resources.strings.No_Invoice_Found}</Text>
            </View>
        )
    }
    ActivityIndicatorLoadingView = () => {
        return (
            <View style={{
                flex: 1, alignItems: 'center', justifyContent: 'center',
            }}>
                <ActivityIndicator
                    color={resources.colors.appColor}
                    size='large'
                    style={styles.ActivityIndicatorStyle}
                />
            </View>
        )
    }
    render() {
        const { invoiceList, total_outstanding_amount } = this.state
        return (
            <View style={styles.mainContainer}>
                {this.renderHeader()}
                {/* {this.state.showLoading ? 
                this.ActivityIndicatorLoadingView()
                    :  */}
                <View style={{ flex: 1 }}>
                    {/* <View style={[styles.Container, { backgroundColor: 'pink',height:200}]}> */}
                    {
                        invoiceList.length > 0 ?
                            <FlatList
                                style={{ marginBottom: isiPhoneX ? 100 : 80, }}
                                data={invoiceList}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={this.listInvoiceCell}
                                onEndReached={this.handleLoadMore}
                                onEndReachedThreshold={0.1}
                                ListFooterComponent={this.renderFooter}
                                refreshing={this.state.isRefreshing}
                                showsVerticalScrollIndicator={false}
                                ItemSeparatorComponent={this.FlatListItemSeparator}
                            /> :
                            this.renderEmptyListView()
                    }

                    {/* </View> */}
                    <View style={styles.buttonContainer}>
                        <View style={styles.footerStyle}>
                            <Text style={styles.totalText}>{resources.strings.Total_OutStanding}</Text>
                            <Text style={styles.totalValue}>₹ {total_outstanding_amount}/-</Text>
                        </View>
                        <View style={styles.btnView}>
                            <Button
                                btnStyle={[styles.buttonStyle,
                                {
                                    backgroundColor: total_outstanding_amount > 0 ?
                                        resources.colors.appColor :
                                        resources.colors.greyLight,
                                }]}
                                touchOpacityStyle={{}}
                                rounded
                                disableTouch={
                                    total_outstanding_amount > 0 ?
                                        false :
                                        true
                                }
                                btnText={resources.strings.Pay_Now}
                                onPress={() => this.payNowAllOutStandingMoney()} />
                        </View>
                    </View>

                </View>
                {/* } */}
            </View>
        );
    }


    onChangeFormat = (text) => {
        this.setState({ formatData: text })
    }
}

const mapStateToProps = (state) => {
    return {};
};


let InvoiceScreenContainer = connect(mapStateToProps, { ...actions })(InvoiceScreen);
// let loader = APILoadingHOC(InvoiceScreenContainer)
export default InvoiceScreenContainer;

