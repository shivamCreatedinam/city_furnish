import React, { Component } from 'react';
import { View, Text, FlatList, Image, ScrollView } from 'react-native'
import styles from './styles'
import HeaderWithProfile from '../../../genriccomponents/header/HeaderWithProfilePic'
import resources from '../../../../res'
import Accordian from '../../../genriccomponents/expandView/Accordian'


class HowReferCoinsWorksScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            howItWorks: [{
                id: '01',
                step: "Register to Cityfurnish and get your Unique Referral Code",
                img: resources.images.img_Step1_coin
            }, {
                id: '02',
                step: "Share your Referral Code with Family and Friends",
                img: resources.images.img_Step2_coin
            }, {
                id: '03',
                step: "Your Friend uses your Refferal Code while placing the Order",
                img: resources.images.img_Step3_coin
            }, {
                id: '04',
                step: "You and your Firend both get 500 CF Coins once your friend successfully pleace a qualifying order using referral code",
                img: resources.images.img_Step4_coin
            }, {
                id: '05',
                step: "Use CF coins against Future Payments or your next Orders",
                img: resources.images.img_Step5_coin

            }],

            questionAnswer: [
                {
                    "question": "Who Can Refer?",
                    "answer": "Only Cityfurnish customers can use referral program to refer their friends and family",
                    "isExpanded": false,
                    "id": "1_coin"
                },
                {
                    "question": "How Can I Refer?",
                    "answer": "You can share your referral code on any social platform such as Facebook, Twitter etc from our Referral Page or you can even mail your link to your friends and family.",
                    "isExpanded": false,
                    "id": "2_coin"
                },
                {
                    "question": "How Can I Use Referral Code?",
                    "answer": "If you have a referral code, please enter it in the Referral Code box while sign-up.",
                    "isExpanded": false,
                    "id": "3_coin"
                },
                {
                    "question": "How Can I Claim The Referral Benefit?",
                    "answer": "The referrer gets a mail notification once their referral code is used by any of their friends. Contact our customer care via email or phone on receipt of notification to get applicable discount. Amount will be adjusted against remaining rental. No cashbacks are permitted against referral benifit.",
                    "isExpanded": false,
                    "id": "4_coin"
                },
                {
                    "question": "Is There A Limit On Benefit?",
                    "answer": "- You can refer as many friends as you want. You get benefit on every successful conversion. \n- Referred customer can not club referral benefit with any other offer.",
                    "isExpanded": false,
                    "id": "5_coin"
                },
                {
                    "question": "Can I Use My Own Referral Code?",
                    "answer": "You can not use your own referral code. Cityfurnish reserves the right to revoke referral benefits availed by individuals who share a common address with the referrer",
                    "isExpanded": false,
                    "id": "6_coin"
                },
                {
                    "question": "Other Terms And Conditions",
                    "answer": "- Referral program is not appliable on fitness equipments and office furniture. \n- Referrer should place an order of min 1000 Rs monthly rental to avail benefit of referral program.\n- Cityfurnish reserves the right to revoke referral benefits if they were earned against our terms or close the referral program anytime without any prior intimation",
                    "isExpanded": false,
                    "id": "7_coin"
                }

            ]
        }
    }


    renderHeader = () => {
        return (
            <HeaderWithProfile
                headerTitle={resources.strings.HOW_IT_WORKS}
                isBackIconVisible={true}
                onBackClick={this.onBackClick}
                navigateProps={this.props.navigation}
            />
        )
    }
    renderSteps = ({ item, index }) => {
        return (
            <View style={styles.viewStep}>
                    <Image source={item.img}
                        resizeMode={'contain'}
                        style={styles.imageStep} />
                    <Text style={styles.idStep}>{item.id}</Text>
                    <Text style={styles.textStep}>{item.step}</Text>
               

            </View>
        )
    }
    referallSteps = () => {
        const { howItWorks } = this.state
        return (
            <FlatList
            columnWrapperStyle={{justifyContent:'space-evenly'}}
                // style={{ marginTop: 10 }}
                data={howItWorks}
                horizontal ={false}
                keyExtractor={(item, index) => index.toString()}
                numColumns={2}
                renderItem={this.renderSteps}
                showsVerticalScrollIndicator={false}
            />
        )
    }



    onBackClick = () => {
        this.props.navigation.goBack()
    }


    render() {
        return (
            <View style={styles.fullScreen}>
                {this.renderHeader()}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.mainContainer}>
                        <View style={styles.container}>
                            <Text style={styles.howItWorksText}>{resources.strings.HOW_IT_WORKS}</Text>
                            <Text style={styles.become_Brand}>{resources.strings.BECOME_BRAND}</Text>
                            <View style={{ marginVertical: 8 }}>
                                {this.referallSteps()}
                            </View>
                        </View>
                        <View style={styles.allYouKnow}>
                            <Text style={styles.textAllYouKnow}>{resources.strings.ALL_YOU_KNOW}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            {this.renderAnswerQuestionList()}
                        </View>
                    </View>
                </ScrollView>


            </View>
        )
    }

    renderAnswerQuestionList = () => {
        const { questionAnswer } = this.state
        if (questionAnswer.length > 0) {
            let items = [];
            questionAnswer.forEach((item, index) => {
                items.push(
                    <Accordian
                        isExpand={item.isExpanded}
                        title={item.question}
                        data={item.answer}
                        id={item.id}
                        onExpand={this.onExpandItem}
                    />
                );
            })
            return items;
        } else {
            return null
        }

    }
    onExpandItem = (itemId, expanded) => {

        const { questionAnswer } = this.state
        var result = questionAnswer.map(function (el, index) {
            var o = Object.assign({}, el);
            if (itemId == o.id) {
                o.isExpanded = expanded
            } else {
                o.isExpanded = false
            }

            return o;
        })

        this.setState({
            questionAnswer: result
        })
    }

}


export default HowReferCoinsWorksScreen;