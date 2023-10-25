import React, { Component } from 'react'
import { View, Text, Image, ActivityIndicator } from 'react-native'
import HeaderWithProfile from '../../genriccomponents/header/HeaderWithProfilePic'
import resource from '../../../res'
import styles from './styles'
import resources from '../../../res';
import Button from '../../genriccomponents/button/Button'
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import MyTransactionCredit from '../myTransaction/MyTransactionCredit';
import MyTransactionDebit from '../myTransaction/MyTransactionDebit';
import {
    passCreditDetail,
    passDebitDetail,
    getCfCoinsDetails
} from '../../redux/actions/CFCoinsAction'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import AppUser from '../../utility/AppUser'
import AsyncStorageConstants from '../../utility/AsyncStorageConstants'
import AsyncStorage from '@react-native-community/async-storage';

class CfCoinsScreen extends Component {
    static ROUTE_NAME = "CfCoinsScreen";
    constructor(props) {
        super(props);
        this.state = {
            selectedTabIndex: 0,
            walletDetails: [],
            isLoading: true
        }
    }
    componentDidMount() {
        this.loadData()
    }

    loadData = () => {
        this.props.getCfCoinsDetails()
            .then((data) => {
                this.props.passCreditDetail(data.data.credit_transaction_details)
                this.props.passDebitDetail(data.data.debit_transaction_details)
                this.setState({
                    walletDetails: data.data.wallets,
                    isLoading: false
                }, () => {
                    if (data.data.wallets.length > 0) {
                        const topup_amount = data.data.wallets[0].topup_amount
                        let userDetails = AppUser.getInstance().userDetails
                        userDetails.cf_coins = topup_amount;
                        this.storeAndUpdateUserData(userDetails)
                    }

                })
            })
            .catch((error) => {
                this.setState({
                    isLoading: false
                })
                console.log(error, "error")
            });
    }

    storeAndUpdateUserData = async (data) => {
        try {
            await AsyncStorage.setItem(AsyncStorageConstants.UserData, JSON.stringify(data))
        } catch (e) {
            // saving error
            console.log("error", e)
        }
    }

    onBackClick = () => {
        this.props.navigation.goBack()
    }
    renderHeader = () => {
        return (
            <HeaderWithProfile
                headerTitle={resource.strings.cityfunishCoins}
                isBackIconVisible={true}
                navigateProps={this.props.navigation}
                onBackClick={this.onBackClick}
            />
        )
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
    renderTabView = () => {

        return (
            <ScrollableTabView
                renderTabBar={() => <DefaultTabBar />}
                tabBarTextStyle={styles.tabBarTextStyle}
                tabBarInactiveTextColor={resources.colors.blueGrey}
                tabBarActiveTextColor={resources.colors.bluish}
                tabBarUnderlineStyle={styles.underlineStyle}
                initialPage={0}
                onChangeTab={val => {
                    this.setState({
                        selectedTabIndex: val.i
                    })
                }}
            >
                <Text key={'1'} style={{ flex: 1 }} tabLabel={'My Transactions (Debit)'} />
                <Text key={'2'} tabLabel={'My Transactions (Credit)'} style={{ flex: 1 }} />

            </ScrollableTabView>
        )

    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={styles.fullScreen}>
                    {this.renderHeader()}
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        {this.ActivityIndicatorLoadingView()}
                    </View>
                </View>
            )
        }
        const { selectedTabIndex, walletDetails } = this.state
        const topup_amount = walletDetails.map((item) => { return item.topup_amount })
        // console.log("topup_amount",topup_amount)
        return (
            <View style={styles.fullScreen}>
                {this.renderHeader()}

                <View style={[styles.marginHorizontal,{padding:16}]}>
                    <View style={styles.rowFirection}>
                        <View style={styles.footerStyle}>
                            <Image source={resources.images.inc_coin} style={styles.coinIcon} resizeMode={'contain'} />
                            
                        </View>
                        <View style={[{marginLeft:10}]}>
                                <Text style={styles.grayText}>Current balance</Text>
                                <Text style={styles.amountText}>₹{topup_amount.length > 0 ? topup_amount : "0"}</Text>
                            
                        </View>
                    </View>
                    
                    {/* <View style={styles.cartButtonContainer}>
                        <View style={styles.footerStyle}>
                            <Image source={resources.images.inc_coin} style={styles.coinIcon} resizeMode={'contain'} />
                            <Text style={styles.yourBalance}>{resource.strings.YOUR_COINS_BALANCE} -</Text>
                        </View>
                        <View style={styles.footerStyle}>
                            <Text style={styles.currentBalance}>{resource.strings.CURRENT_BALANCE}</Text>
                            <Text style={styles.totalStyle}> ₹{topup_amount.length > 0 ? topup_amount : "0"} / -</Text>
                        </View> */}
                          {/* Uncommnent when you want to include it */}
                        {/* <View style={{ marginTop: 15 }}>
                            <Button
                                rounded btnText={resources.strings.ADD_COIN}
                                onPress={this.goToAddCfCoinScreen} />
                        </View> */}
                    {/* </View> */}
                    <View style={{ marginVertical: 10 }}>
                        
                        <Text style={styles.worthText}>{resource.strings.REDEEM_DESCRIPTION}</Text>
                    </View>
                    <View style={styles.borderClass} />
                        <View style={{ flexDirection: 'row', justifyContent:'space-between' }}>
                            <View>
                                <Text style={styles.worthText}>{resource.strings.TOTAL_COIN_WORTH}</Text>
                                <Text style={[styles.worthText, { fontFamily: resources.fonts.bold,fontSize:18,marginTop:10 }]}>₹{topup_amount.length > 0 ? topup_amount : "0"} </Text>
                            </View>    
                            <View>
                                <Image source={resource.images.inc_coin1} style={{width:100,height:40}} />
                            </View>
                            
                        </View>
                        <View style={styles.borderClass} />
                    <View style={styles.priceBoxContainer}>
                        <View style={styles.priceContainer}>
                            <Image source={resources.images.icn_checkout} style={{width:50,height:50}} />
                            <Text style={styles.boldText} ellipsizeMode={'tail'} numberOfLines={1}>{resource.strings.INSTANCE_CHECKOUT}</Text>
                            <Text style={styles.boxText} ellipsizeMode={'tail'} numberOfLines={2}>{resource.strings.ONE_CLICK}</Text>
                        </View>
                        <View style={styles.spaceView} />
                        <View style={styles.priceContainer}>
                            <Image source={resources.images.icn_benefits} style={{width:50,height:50}}/>
                            <Text style={styles.boldText} ellipsizeMode={'tail'} numberOfLines={1}>{resource.strings.MORE_BENEFITS}</Text>
                            <Text style={styles.boxText} ellipsizeMode={'tail'} numberOfLines={2}>{resource.strings.USING_CF_COINS}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ height: 50, marginTop: Platform.OS == 'android' ? 5 : 10 }}>
                    {this.renderTabView()}
                </View>

                <View style={styles.container}>
                    {
                        selectedTabIndex == 0 ?
                            <MyTransactionDebit navigation={this.props} />
                            : <MyTransactionCredit />
                    }

                </View>
            </View>
        )
    }
    goToAddCfCoinScreen = () => {
        this.props.navigation.navigate("AddCfCoins", {
            callback: this.onPaymentCallback
        })
    }

    onPaymentCallback = (isSuccess) => {
        if (isSuccess) {
            this.loadData();
        }
    }

}
const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            passCreditDetail,
            passDebitDetail,
            getCfCoinsDetails
        },
        dispatch,
    );
};
function mapStateToProps(state) {
    return {};
}
let container = connect(mapStateToProps, mapDispatchToProps)(CfCoinsScreen);

export default container;