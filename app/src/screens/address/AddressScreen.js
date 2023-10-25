import React, { Component } from 'react'
import { View, Text, Platform, TouchableOpacity } from 'react-native'
import styles from './styles'
import HeaderWithProfile from '../../genriccomponents/header/HeaderWithProfilePic'
import resources from '../../../res'
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import AddAddressScreen from './AddAddressScreen'
import ListAddress from './ListAddress'
import { changeAddressIndex } from '../../redux/actions/AddressAction'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";

class AddressScreen extends Component {
    static ROUTE_NAME = "AddressScreen";
    constructor(props) {
        super(props);

        this.isProceedBtnVisible = this.props.route.params ? this.props.route.params.isProceedBtnVisible : false
        this.isProfileIconVisible = this.props.route.params ? this.props.route.params.isProfileIconVisible : true
        this.checkoutOrderDetails = this.props.route.params && this.props.route.params.checkoutOrderDetails ? this.props.route.params.checkoutOrderDetails : null
        this.isComingFromBuyNow = this.props.route.params && this.props.route.params.isComingFromBuyNow ? this.props.route.params.isComingFromBuyNow : false,
        this.oldSelectedTabIndex = 0;
        this.tabRef = React.createRef();
        this.isCalled = false;
    }
    componentDidMount() {
        this.props.changeAddressIndex(0)
    }
    onPressBack = () => {
        this.props.changeAddressIndex(0)
        this.props.navigation.goBack()
    }
    renderHeader = () => {
        return (
            <HeaderWithProfile
                headerTitle={resources.strings.Address}
                isBackIconVisible={true}
                onBackClick={this.onPressBack}
                navigateProps={this.props.navigation}
                isProfileIconVisible={this.isProfileIconVisible}
                toRoute={"MyAccountScreen"}
            />
        )
    }

    moveToFirstPage = () => {
        if (this.tabRef && this.tabRef.current && this.oldSelectedTabIndex != -1) {
            this.tabRef.current.goToPage(0)
        }
    }
    moveToSecondPage = () => {
        if (this.tabRef && this.tabRef.current && this.oldSelectedTabIndex != -1) {
            this.isCalled= true
            this.tabRef.current.goToPage(1)
        }
    }
    moveToCartPage = () => {
        this.props.navigation.navigate("Cart");
    }


    selectedIndex = (index) => {
        const { currentTabPosition } = this.props
        this.oldSelectedTabIndex = currentTabPosition
        this.props.changeAddressIndex(index)
    }
    renderTabView = () => {
        return (
            <ScrollableTabView
                ref={this.tabRef}
                renderTabBar={() => <DefaultTabBar
                    style={{ height: 40 }}
                />}

                tabBarTextStyle={styles.tabBarTextStyle}
                tabBarInactiveTextColor={resources.colors.blueGrey}
                tabBarActiveTextColor={resources.colors.bluish}
                tabBarUnderlineStyle={styles.underlineStyle}
                onChangeTab={val => { this.selectedIndex(val.i) }}
                initialPage={this.props.currentTabPosition}
            >
                <Text key={'1'} style={{ flex: 1 }} tabLabel={'Choose Address'} />
                <Text key={'2'} tabLabel={'Add New Address'} style={{ flex: 1 }} />

            </ScrollableTabView>
        )

    }

    render() {
        return (

            <View style={styles.fullScreen}>
                {this.renderHeader()}
                {/* <View style={{ height: 40, marginTop: Platform.OS == 'android' ? 5 : 10 }}>
                    {this.renderTabView()}
                </View> */}

                <View style={styles.container}>
                    {
                        this.props.currentTabPosition == 0 ?
                            <ListAddress
                                navigation={this.props}
                                btnVisible={this.isProceedBtnVisible}
                                checkoutOrderDetails={this.checkoutOrderDetails}
                                isComingFromBuyNow={this.isComingFromBuyNow}
                                moveToSecondPage={this.moveToSecondPage} 
                                moveToCartPage={this.moveToCartPage} 
                                isCalled= {this.isCalled}/>

                            : <AddAddressScreen
                                callback={this.moveToFirstPage}
                            />
                    }

                   

                </View>
                {
                     this.props.currentTabPosition == 0 ?
                        <TouchableOpacity onPress={() => this.props.changeAddressIndex(1)} style={{position:'absolute',bottom:90,left:20}}>
                            <Text style={{color:resources.colors.appColor,fontWeight:'600',fontSize:16}}>{`Add New Address >`}</Text>
                        </TouchableOpacity>     
                     : null
                }
                
                
            </View>

        )
    }


}
const mapStateToProps = (state) => {
    const { currentTabPosition } = state.addressReducer
    return { currentTabPosition: currentTabPosition };
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        changeAddressIndex
    }, dispatch);
}
let AddressScreenContainer = connect(mapStateToProps, mapDispatchToProps)(AddressScreen);
export default AddressScreenContainer;

