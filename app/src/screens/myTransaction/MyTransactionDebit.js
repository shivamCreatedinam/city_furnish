import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import resources from '../../../res';
import styles from './styles'
import { connect } from 'react-redux';

class MyTransactionDebit extends Component {
    static ROUTE_NAME = "MyTransactionDebit";
    constructor(props) {
        super(props)
        this.state = {
            debitDetail: [],
            invoiceCellHeight: "",
            isExpanded: false,
            isSelected: null
        }
    }
    componentDidMount() {
        this.setState({ debitDetail: this.props.debitDetail })
    }

    listInvoiceCell = ({ item, index }) => {
        const isExpanded = item.isExpand
        return (
            <View
                key={index + "_debitTran"}
                style={styles.cardStyle}>
                <View style={styles.invoiceCell} >
                    {
                        isExpanded ?
                            <TouchableOpacity 
                            style={styles.cellStyle}
                            onPress={() => this.onPressMinus(index)}>
                                <View style={styles.cellStyle}>
                                    <View style={styles.invoiceCon}>
                                        <Text style={styles.invoiceExpendText}>{resources.strings.INVOICE_NUMBER} :</Text>
                                        <Text style={styles.invoiceExpendNumber}>{item.invoice_number ? item.invoice_number : "NA"}</Text>
                                    </View>
                                    <View>
                                        <View style={styles.plusMinusIcon}>
                                            <Image source={resources.images.icn_Minus} style={styles.minusIcon} resizeMode={'contain'} />
                                        </View>
                                    </View>
                                </View>

                            </TouchableOpacity>
                            :
                            <TouchableOpacity
                            style={styles.cellStyle}
                                onPress={() => this.expendInvoiceCell(index)}>
                                <View style={styles.cellStyle}>
                                    <View style={styles.invoiceCon}>
                                        <Text style={styles.invoiceText}>{resources.strings.INVOICE_NUMBER} :</Text>
                                        <Text style={styles.invoiceNumber}>{item.invoice_number ? item.invoice_number : "NA"}</Text>
                                    </View>

                                    <View>
                                        <View style={styles.plusMinusIcon} >
                                            <Image source={resources.images.icn_Plus} style={styles.plusIcon} resizeMode={'contain'} />
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                    }
                </View >
                {
                    isExpanded ?
                        <View style={styles.rowDirection}>
                            <View style={styles.coloum}>
                                <Text style={styles.invoiceDetailsTitle}>{"Invoice Date :"}</Text>
                                <Text style={styles.invoiceDetails}>{item.invoice_date ? item.invoice_date : "NA"}</Text>
                            </View>
                            <View style={styles.coloum}>
                                <Text style={styles.invoiceDetailsTitle}>{"Coins Used :"}</Text>
                                <Text style={styles.invoiceDetails}>₹{item.coin_used ? item.coin_used : "0"}</Text>
                            </View>
                            <View style={styles.coloum}>
                                <Text style={styles.invoiceDetailsTitle}>{"Transaction Date :"}</Text>
                                <Text style={styles.invoiceDetails}>{item.transaction_date ? item.transaction_date : "NA"}</Text>
                            </View>
                        </View> : <View />
                }
            </View >
        )


    }


    expendInvoiceCell = (index) => {
        const { debitDetail } = this.props;
        this.setState({ debitDetail: debitDetail.map((item, i) => ({ ...item, isExpand: i === index })) });
    }
    onPressMinus = (index) => {
        const { debitDetail } = this.state;
        const isExpand = debitDetail[index].isExpand;
        const newData = JSON.parse(JSON.stringify(debitDetail));
        newData[index].isExpand = !isExpand;
        this.setState({ debitDetail: newData });
    }

    FlatListItemSeparator = () => {
        return (
            <View style={styles.seperator} />
        );
    }
    renderEmptyListView() {
        return (
            <View style={styles.emptyView}>
                <Text>{resources.strings.No_Transaction_Found}</Text>
            </View>
        )
    }
    render() {
        const { debitDetail } = this.state
        return (
            <View style={styles.mainContainer}>
                {
                    debitDetail && debitDetail.length > 0 ? <FlatList
                        data={debitDetail}
                        keyExtractor={(item, index) => { index.toString() }}
                        renderItem={this.listInvoiceCell}
                        showsVerticalScrollIndicator={false}
                        ItemSeparatorComponent={this.FlatListItemSeparator}
                    /> : this.renderEmptyListView()
                }

            </View>
        );
    }
}


function mapStateToProps(state) {
    return {
        debitDetail: state.skipLoginReducer.debitDetail
    };
}
let container = connect(mapStateToProps, null)(MyTransactionDebit);

export default container;