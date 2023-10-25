import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import resources from '../../../res';
import styles from './styles'
import { connect } from 'react-redux';

class MyTransactionCredit extends Component {
    static ROUTE_NAME = "MyTransactionCredit";
    constructor(props) {
        super(props)
        this.state = {
            creditDetail: [],
            invoiceCellHeight: "",
            isExpanded: false,
            isSelected: null

        }
    }
    componentDidMount() {
        this.setState({ creditDetail: this.props.creditDetail })
    }

    listInvoiceCell = ({ item, index }) => {
        const isExpanded = item.isExpand
        return (
            <View
                key={index + "_creditTran"}
                style={styles.cardStyle}>
                <View style={styles.invoiceCell} >
                    {
                        isExpanded ?
                            <TouchableOpacity onPress={() => this.onPressMinus(index)}
                            style={styles.cellStyle}>

                                <View style={styles.cellStyle}>
                                    <View style={styles.invoiceCon}>
                                        <Text style={styles.invoiceExpendText}>{resources.strings.TRANSACTION_ID} :</Text>
                                        <Text style={styles.invoiceExpendNumber}>{item.transaction_id ? item.transaction_id : "NA"}</Text>
                                    </View>
                                    <View>
                                        <View style={styles.plusMinusIcon}>
                                            <Image source={resources.images.icn_Minus} style={styles.minusIcon} resizeMode={'contain'} />
                                        </View>
                                    </View>

                                </View>

                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={() => this.expendInvoiceCell(index)}
                            style={styles.cellStyle}>
                                <View style={styles.cellStyle}>
                                    <View style={styles.invoiceCon}>
                                        <Text style={styles.invoiceText}>{resources.strings.TRANSACTION_ID} :</Text>
                                        <Text style={styles.invoiceNumber}>{item.transaction_id ? item.transaction_id : "NA"}</Text>
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
                                <Text style={styles.invoiceDetailsTitle}>{"Credit Mode :"}</Text>
                                <Text style={styles.invoiceDetails}>{item.credit_mode ? item.credit_mode : "NA"}</Text>
                            </View>
                            <View style={styles.coloum}>
                                <Text style={styles.invoiceDetailsTitle}>{"Coins Added :"}</Text>
                                <Text style={styles.invoiceDetails}>₹{item.coins_added ? item.coins_added : "0"}</Text>
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
        const { creditDetail } = this.state;
        this.setState({ creditDetail: creditDetail.map((item, i) => ({ ...item, isExpand: i === index })) });
    }
    onPressMinus = (index) => {
        const { creditDetail } = this.state;
        const isExpand = creditDetail[index].isExpand;
        const newData = JSON.parse(JSON.stringify(creditDetail));
        newData[index].isExpand = !isExpand;
        this.setState({ creditDetail: newData });
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
        const { creditDetail } = this.state
        return (
            <View style={styles.mainContainer}>
                {
                    creditDetail && creditDetail.length > 0 ? <FlatList
                        data={creditDetail}
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
        creditDetail: state.skipLoginReducer.creditDetail
    };
}
let container = connect(mapStateToProps, null)(MyTransactionCredit);

export default container;