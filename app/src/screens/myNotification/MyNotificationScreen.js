import React, { Component } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Linking } from 'react-native'
import styles from './styles'
import HeaderWithProfile from '../../genriccomponents/header/HeaderWithProfilePic'
import resources from '../../../res'
import { connect } from 'react-redux'
import * as actions from '../../redux/actions/NotificationAction'
import APILoadingHOC from "../../genriccomponents/HOCS/APILoadingHOC"
import { checkIfUserIsLoggedIn, showSigninAlert, myHeight } from '../../utility/Utils'
import NetInfo from '@react-native-community/netinfo'
import { NotificationsScreen } from '../../utility/FCMServices'
import Icon from 'react-native-vector-icons/FontAwesome';
import AppToast from '../../genriccomponents/appToast/AppToast'
import SimpleToast from 'react-native-simple-toast'

class MyNotificationScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notificationData: [
                // {
                //     token: "919643116558",
                //     title: 'App Update',
                //     body: 'Cityfurnish recommends you to update application to latest version. Update Now!!',
                //     image: "",
                //     notified_on: '02 June 2021 - 4:13 pm'
                //     screen_name: "MyOrder"
                // }
            ]
        }
    }

    componentDidMount() {
        this.loadMyNotification()
    }

    loadMyNotification = () => {
        this.props.getMyAllNotificationApi()
            .then((data) => {
                console.log("NotificationResponse",JSON.stringify(data.data))
                this.setState({
                    notificationData: [...this.state.notificationData, ...data.data]
                })
            })
            .catch((error) => {
                console.log(error, "error")
            });
    }
    onBackClick = () => {
        this.props.navigation.goBack()
    }
    renderHeader = () => {
        return (
            <HeaderWithProfile
                headerTitle={resources.strings.NOTIFICATION}
                isBackIconVisible={true}
                onBackClick={this.onBackClick}
                navigateProps={this.props.navigation}
            />
        )
    }
    navigateToScreen = (screenName) => {
        if(screenName == "" || screenName == null) {
            // AppToast("Oh, there is no screen for this Notification.")
            SimpleToast.show("Oh, there is no screen for this Notification.", SimpleToast.LONG)
            return
        } 
        this.checkInternetAndGotoScreen(screenName)
    };

    checkInternetAndGotoScreen = (screen) => {
        if (checkIfUserIsLoggedIn() && NotificationsScreen.includes(screen)) {
            NetInfo.fetch().then(state => {
                if (!state.isConnected) {
                    // SimpleToast.show("Please check your internet")
                    return
                } else {
                    this.props.navigation.navigate(screen)
                }
            });
        } else {
            showSigninAlert("MyNotificationScreen")
        }
    }

    notificationList = ({ item, index }) => {
        return (

            <TouchableOpacity
                style={styles.imageThumbnail}
                onPress={() => this.navigateToScreen(item.screen_name)} >
                <View style={styles.cell}>
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                        {/* <View style={styles.imageStyle}>
                            <Icon name="bell" size={36} color={resources.colors.appColor} />
                        </View> */}
                        <View style={{ justifyContent: 'center', flex: 1, marginRight: 3, marginHorizontal: 15 }}>
                            <Text style={styles.mainText}>{item.title}</Text>
                            <Text style={styles.dataText}>{item.body}</Text>
                            <Text style={styles.timeText}>{item.notified_on}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
    render() {
        return (
            <View style={styles.fullScreen}>
                {this.renderHeader()}
                {/* <View style={{ marginHorizontal: 20, marginTop: 5 }}>
                    <Text style={styles.findAnswerText}>{resources.strings.NOTIFICATION_TITLE}</Text>
                    <Text style={styles.proposalText}>{resources.strings.NOTIFICATION_SUB_TITLE}</Text>
                </View> */}
                <View style={styles.container}>
                {
                    this.state.notificationData && this.state.notificationData.length > 0 ?
                    <FlatList
                        data={this.state.notificationData}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={this.notificationList}
                        showsVerticalScrollIndicator={false}
                    />
                    :
                        this.renderEmptyListView()
                }
                </View>
            </View>
        )
    }


    renderEmptyListView = () => {
        return (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                {/* <Image style={{ marginTop: myHeight/4 }} source ={resources.images.img_no_service_found}/> */}
                <Text style={{ textAlign: 'center', fontSize: 14 , fontFamily: resources.fonts.regular}}>No notifications to show</Text>
            </View>
        )
    }


}
const mapStateToProps = (state) => {
    return {};
};
let container = connect(mapStateToProps, { ...actions })(MyNotificationScreen);
let loader = APILoadingHOC(container);

loader.getIntent = () => {
    return {
        routeName: MyNotificationScreen.ROUTE_NAME,
    };
};
export default loader;
