import React, { Component } from 'react'
import { View, StatusBar, Text, Image, TouchableOpacity } from 'react-native'
import { WishListItem } from './views/WishListItem'
import styles from './styles'
import HeaderWithProfile from '../../genriccomponents/header/HeaderWithProfilePic'
import resources from '../../../res'
import { Header,Left,Right,Body,Title } from 'native-base';
import * as actions from '../../redux/actions/WishListAction'
import { connect } from 'react-redux'
import AppUser from '../../utility/AppUser'
import events from '../../utility/Events'
import { onUpdateWishlistBadgeCount } from '../../redux/actions/WishListAction'
import AsyncStorageConstants from '../../utility/AsyncStorageConstants'
import AsyncStorage from '@react-native-community/async-storage';
import AppToast from '../../genriccomponents/appToast/AppToast'
import Produce from './views/Produce'
import { MyStatusBar } from '../../genriccomponents/header/HeaderAndStatusBar'

class WishListScreen extends Component {
    static ROUTE_NAME = "WishListScreen";
    constructor(props) {
        super(props);
        this.state = {
            wishlistData: [],
            homePageData : null
        }

    }
   async componentDidMount() {
        this.props.navigation.addListener('focus', () => this.componentDidFocus())
        const value = await AsyncStorage.getItem('HomePageData');
        if (value !== null) {
            let dataSet = JSON.parse(value)
            this.setState({
                homePageData : dataSet
            })
        }

    }
    componentDidFocus = () => {
        // StatusBar.setBarStyle('dark-content');
        // StatusBar.setBackgroundColor(resources.colors.appColor);
        this.loadData()
    }
    loadData = () => {
        let appInst = AppUser.getInstance();
        this.props.getAllWishListApi(appInst.selectedCityId)
            .then((data) => {
                this.setState({ wishlistData: data.data })
            })
            .catch((err) => {
                console.log(data, "error in Wishlist screen")
            })
    }
    onBackClick = () => {
        this.props.navigation.goBack()
    }

    renderHeader = () => {
        // return (
        //     <HeaderWithProfile
        //         headerTitle={resources.strings.Wishlist}
        //         isBackIconVisible={false}
        //         navigateProps={this.props.navigation}
                
        //     />
        // )
        
            return (
                <>
                <Header style={{backgroundColor: 'white', borderBottomWidth: 0,height:60}}>
                  <Body style={{marginLeft:16}}>
                    <Title>
                    <Text style={styles.headerTitle}>Wishlist</Text></Title>
                  </Body>
                  <Right style={{marginRight:12}}>
                    <View style={styles.flexRow}>
                        <TouchableOpacity onPress={() => this.props.navigation.push("SearchScreen",{data:this.state.homePageData})} style={{marginRight:10}}>
                            <Image style={styles.headerIcon} source={resources.images.icn_searchPage} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.props.navigation.push('CartScreen')}>
                            <Image style={styles.headerIcon} source={resources.images.icn_cartPage}/>
                        </TouchableOpacity>
                    </View>
                  </Right>
                </Header>
                </>
            )
          
    }
    render() {
        return (
            <View style={styles.fullScreen}>
                <MyStatusBar
          backgroundColor={"white"}
          barStyle="dark-content"
        />
                {this.renderHeader()}
                <WishListItem
                    serverData={this.state.wishlistData}
                    // onPressItem={this.onPressItem}
                    loadMoreData={this.handleLoadMore}
                    isRefreshing={false}
                    onRefresh={this.onRefresh}
                    onPressDeleteItem={this.onPressDeleteItem}
                    navigation={this.props.navigation}
                    onPressAddToCart={this.onPressAddToCart} />
                    {/* <Produce/> */}
            </View>
        )
    }

    onPressAddToCart = (product_id, key, isComboCategory) => {
        this.props.navigation.navigate("ProductDetailScreen", { productId: product_id })
    }

    storeWishlistCountData = async (data) => {
        let obj = AppUser.getInstance()
        obj.wishlistCount = data
        this.props.onUpdateWishlistBadgeCount(data)
        try {
            await AsyncStorage.setItem(AsyncStorageConstants.wishlistBadgeCount, data.toString())
        } catch (e) {
            // saving error
            console.log("error", e)
        }
    }
    onPressDeleteItem = (product_id, index) => {
        const { wishlistData } = this.state;
        this.props.hitAddDeleteWishListApi(product_id)
            .then((data) => {
                this.storeWishlistCountData(data.data.WishlistItemsCount)
                this.setState({
                    wishlistData: wishlistData.filter(item => item.product_id != product_id),
                }, () => {
                    let event = AppUser.getInstance().emitterInst;
                    event.emit(events.UPDATE_CATEGORY_SCREEN_PRODUCT_LIST, product_id)
                })
                AppToast(data.message)
            }).catch((error) => {
                console.log(error, "error")
            });
    }

    onRefresh = () => {

    }
  
    onPressItem = (data, key) => {
    }

    handleLoadMore = () => {

    };
    renderFooter = () => {
        //it will show indicator at the bottom of the list when data is loading otherwise it returns null
        // if (!this.state.showLoading) return null;
        // return (
        //     <ActivityIndicator
        //         size="large" color="#0f57d1"
        //     />
        // );
    };
}


const mapStateToProps = (state) => {
    return {};
};
let container = connect(mapStateToProps, { ...actions, onUpdateWishlistBadgeCount})(WishListScreen);

export default container;