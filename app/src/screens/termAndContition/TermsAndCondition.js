import React, { Component } from 'react';
import { View, Text, FlatList, ScrollView } from 'react-native'
import styles from './styles'
import HeaderWithProfile from '../../genriccomponents/header/HeaderWithProfilePic'
import resources from '../../../res'



class TermsAndCondition extends Component {
    constructor(props) {
        super(props);
        this.state = {

            termAndConditionList: [{
                condition: "-Only one offer can be availed per order"
            }, {
                condition: "-Offers cannot be used more than once by a customer or on the same delivery address."
            }, {
                condition: "-These offers are not applicable in case of early closure of the order."
            }, {
                condition: "-Offers are applicable on furniture and appliances only."
            }, {
                condition: "-Offers are not applicable on fitness and add- on products"
            }, {
                condition: "-These offers cannot be clubbed with referral program benefits."
            }, {
                condition: "-It takes us 15 days to process cash back (wherever applicable)."
            }, {
                condition: "-You can avail these offers by simply applying the respective coupon code while checkout."
            }, {
                condition: "-For more detail about availing these offers, get in touch with our customer care team."
            }]
        }
    }

    renderHeader = () => {
        return (
            <HeaderWithProfile
                headerTitle={resources.strings.TERMS_AND_CONDITIONS}
                isBackIconVisible={true}
                onBackClick={this.onBackClick}
                navigateProps={this.props.navigation}
                toRoute={"MyAccountScreen"}
            />
        )
    }
    onBackClick = () => {
        this.props.navigation.goBack()
    }
    voucherView = () => {
        return (
            <View style={styles.voucherView}>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={styles.textVoucher}>{"₹2500 VOUCHER"}</Text>
                    <Text style={styles.textInstruction}>{"For All New Orders on Registering for Standing Instructions*"}</Text>
                </View>
                <View style={styles.sepratorStyle} />
                <View style={{ marginHorizontal: 12, marginTop: 5 }}>
                    <Text style={styles.voucherInstruction}>{"* This will be irrespective of any other coupon code used in order."}</Text>
                    <Text style={styles.voucherInstruction}>{"1.You will receive an email on successful order placement with link to redeem vouchers"}</Text>
                    <Text style={styles.voucherInstruction}>{"2.You can opt for multiple voucher up-to cumulative total amount specified above"}</Text>
                    <Text style={styles.voucherInstruction}>{"3.Voucher link will be active for 60 days from sent date"}</Text>
                </View>
            </View>
        )
    }
    renderTermAndCondition = ({ item, index }) => {
        return (
            <View>
                <Text style={styles.textCondition}>{item.condition}</Text>
            </View>
        )

    }

    termAndCondition = () => {
        const { termAndConditionList } = this.state
        return (
            <FlatList
                style={{ marginHorizontal: 20 }}
                data={termAndConditionList}
                keyExtractor={(item, index) => index.toString()}
                renderItem={this.renderTermAndCondition}
                bounces={false}

            />
        )

    }
    render() {
        return (
            <View style={styles.fullScreen}>
                {this.renderHeader()}
                <ScrollView style={styles.container}>
                    {this.voucherView()}
                    <View style={styles.allYouKnow}>
                        <Text style={styles.textAllYouKnow}>{resources.strings.Terms_and_Conditions}</Text>
                    </View>
                    {this.termAndCondition()}
                    <View>
                    </View>
                </ScrollView>
            </View>
        )
    }
}
export default TermsAndCondition;