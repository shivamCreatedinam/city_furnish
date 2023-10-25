import React, { Component } from 'react'
import { View, Text } from 'react-native'
import styles from './styles'
import HeaderWithProfile from '../../genriccomponents/header/HeaderWithProfilePic'
import resources from '../../../res'
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import Button from '../../genriccomponents/button/Button'
import OneTimePayment from './onTimePayments/OneTimePayment'
import SiOnCredit from './siOnCredit/SiOnCredit'
import {checkIfUserIsLoggedIn, showSigninAlert} from '../../utility/Utils'

class CustomerPayment extends Component {
    static ROUTE_NAME = "CustomerPayment";
    constructor(props) {
        super(props);
        this.fromRoute = this.props.route.params && this.props.route.params.fromRoute ? this.props.route.params.fromRoute : null
        this.state = {
            selectedTabIndex: 0
        }
    }
    onPressBack = () => {
        this.props.navigation.goBack()
    }
    renderHeader = () => {
        return (
            <HeaderWithProfile
                headerTitle={resources.strings.Customer_Payment}
                isBackIconVisible={true}
                onBackClick={this.onPressBack}
                navigateProps={this.props.navigation}
            />
        )
    }

    renderTabView = () => {
        return (
            <ScrollableTabView
                initialPage={1}
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
                <Text key={'1'} style={{ flex: 1 }} tabLabel={'One Time Payment'} />
                <Text key={'2'} tabLabel={'SI on Credit / Debit Card'} style={{ flex: 1 }} />

            </ScrollableTabView>
        )

    }
    onClickCheckDetails = () => {
        if(checkIfUserIsLoggedIn()){
            this.props.navigation.navigate("InvoiceScreen")
        }else{
            showSigninAlert("InvoiceScreen")
        }

    }
    render() {
        const { selectedTabIndex } = this.state
        return (

            <View style={styles.fullScreen}>
                {this.renderHeader()}
                <View style={styles.btnContainer}>
                    <View style={styles.buttonContainer}>
                        <Text style={styles.totalOutStandingText}
                        numberOfLines={2}
                        ellipsizeMode='tail'>
                            
                            {resources.strings.CHECK_TOTAL_OUTSTANDING}</Text>
                        <Button
                            btnStyle={styles.buttonStyle}
                            touchOpacityStyle={{}}
                            rounded btnText={resources.strings.Check_Details}
                            onPress={this.onClickCheckDetails} />
                    </View>

                    <Text style={styles.instructionText}>{resources.strings.INSTRUCTION}</Text>



                </View>
                <View style={{ marginTop: 5 }}></View>
                {/* <View style={{ height: 50, marginTop: 5 }}>
                    {this.renderTabView()}
                </View> */}

                <View style={styles.container}>
                    {
                        selectedTabIndex == 0 ? <OneTimePayment fromRoute={this.fromRoute}  /> : <SiOnCredit />
                    }

                </View>
            </View>

        )
    }


}

export default CustomerPayment;