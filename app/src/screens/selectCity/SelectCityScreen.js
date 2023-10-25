import React, { Component } from 'react'
import { View, Text, FlatList, Image, TouchableHighlight, ActivityIndicator, StatusBar } from 'react-native'
import styles from './styles'
import resources from '../../../res'
import * as actions from '../../redux/actions/SelectCityAction'
import { connect } from 'react-redux'
import AsyncStorage from '@react-native-community/async-storage';
import AsyncStorageConstants from '../../utility/AsyncStorageConstants'
import AppUser from '../../utility/AppUser'
import { CommonActions } from '@react-navigation/native';
import Header from '../../genriccomponents/header/HeaderAndStatusBar'
import events from '../../utility/Events'
import { onUpdateWishlistBadgeCount } from '../../redux/actions/WishListAction'
import { onUpdateCartBadgeCount } from '../../redux/actions/CartAction'
import { checkIfUserIsLoggedIn } from '../../utility/Utils'
import Button from '../../genriccomponents/button/Button'

class SelectCityScreen extends Component {
    static ROUTE_NAME = "SelectCityScreen";
    constructor(props) {
        super(props);
        this.fromRoute = this.props.route.params && this.props.route.params.fromRoute ? this.props.route.params.fromRoute : null
        this.callback = this.props.route.params && this.props.route.params.callback ? this.props.route.params.callback : null
        this.state = {
            isSelected: false,
            showLoader: true,
            cityList: [],
            cityIdSelected : "",
            cityData: null
        }
    }
    async componentDidMount() {
        let appUsrObj = AppUser.getInstance();
        if(appUsrObj){
            this.setState({
                cityIdSelected : appUsrObj.selectedCityId
            })
        }
        const value = await AsyncStorage.getItem('CityList');
        if (value !== null) {
            let dataSet = JSON.parse(value)
            this.setState({ cityList: dataSet, showLoader: false })
        }else{
            this.loadData();
        }
        
        this.props.navigation.addListener('focus', () => this.componentDidFocus())
    }

    componentDidFocus = () => {
        // StatusBar.setBarStyle('dark-content');
        // StatusBar.setBackgroundColor(resources.colors.white);
    }
    loadData = async () => {
        this.props.hitGetAllCitiesApi()
            .then(async (data) => {
                await AsyncStorage.setItem("CityList", JSON.stringify(data.data))
                this.setState({ cityList: data.data, showLoader: false })
            })
            .catch((error) => {
                console.log("error", error)
                this.setState({ showLoader: false })
            });
    }
    onBackClick = () => {
        this.props.navigation.goBack()
    }

    storeData = async (data) => {
        let appUsrObj = AppUser.getInstance();
        appUsrObj.selectedCityId = data.id;
        appUsrObj.selectedCityName = data.list_value;
        this.setState({
            cityIdSelected : data.id
        })
        try {
            await AsyncStorage.setItem(AsyncStorageConstants.SelectedCity, JSON.stringify(data))

            if (checkIfUserIsLoggedIn()) {
                this.props.validateCartAction().
                    then((resp) => {
                        this.storeCartAndWishlistCountData(resp.data)
                    })
                    .catch((err) => {
                        console.log("Error while updating cart and wish count")
                    })
            }
        } catch (e) {
            // saving error
            console.log("error", e)
        }
    }


    storeCartAndWishlistCountData = async (data) => {
        let countCart = data.itemsIncartCount;
        let countWishList = data.WishlistItemsCount;

        let obj = AppUser.getInstance()
        obj.wishlistCount = countWishList
        obj.itemsIncartCount = parseInt(countCart)
        this.props.onUpdateWishlistBadgeCount(countWishList)
        this.props.onUpdateCartBadgeCount(parseInt(countCart))
        try {
            const cartCount = [AsyncStorageConstants.cartBadgeCount, countCart];
            const wishCount = [AsyncStorageConstants.wishlistBadgeCount, countWishList.toString()];
            await AsyncStorage.multiSet([cartCount, wishCount])
        } catch (e) {
            // saving error
            console.log("error", e)
        }
    }


    renderCityCell = ({ item, index }) => {
        let stylesBorder = this.state.cityIdSelected == item.id ? styles.activeBorder : styles.inActiveBorder
        return (
            <View style={[styles.cellStyle,{marginTop:index >= 3 ? item.list_value == "Ghaziabad/Noida" ? 39 : 20 : 20}]}>
                <TouchableHighlight style={[styles.imageThumbnail]} onPress={() => this.onSelectCity(index)}
                    underlayColor='#ffffff'
                    activeOpacity={0.9}
                >
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <View style={stylesBorder}>
                        <Image style={[styles.cityImageStyle]} source={{ uri: item.image }} resizeMode={'contain'} />
                        </View>
                        <Text numberOfLines={2} style={styles.cityTextStyle}>{item.list_value}</Text>
                    </View>
                </TouchableHighlight>
            </View>
        )
    }
    onSelectCity = (index) => {
        const { cityList } = this.state;
        let data = cityList[index];
        this.storeData(data)
        this.setState({
            cityData : data
        })
        
    }

    onSelectCityProcessed = () => {
        let data = this.state.cityData
        if (this.fromRoute) {
            // go back to My accout screen
            if (this.callback) {
                this.callback(data.list_value)
                let event = AppUser.getInstance().emitterInst;
                //this.props.navigation.goBack();
                this.onBackClick()
                event.emit(events.ON_CHANGE_CITY, 'trigger')
            }

        } else {
            // intial selection of screen and go to dashboard
            const resetAction = CommonActions.reset({
                index: 0,
                routes: [{ name: 'DashboardScreen' }],
            });
            this.props.navigation.dispatch(resetAction);
        }
    }

    renderHeader = () => {
        return (
            <Header
                headerTitle={resources.strings.Beforeweproceed}
                navigationVisible={false}
                isBackIconVisible={this.fromRoute ? true : false}
                customStyle={styles.headerTextStyle}
                onBackClick={this.onBackClick}
            />
        )
    }

    render() {
        const { cityList } = this.state;
        return (
            <View style={styles.MainContainer}>

                {this.renderHeader()}

                <View style={styles.cityContainer}>
                    <View style={[styles.chooseCity, { borderWidth: 0, marginBottom: 3 }]}>
                        <Text style={styles.textChooseCity}>{resources.strings.selectCityText}</Text>
                    </View>

                    {cityList.length > 0 ? <FlatList
                        //style={{ borderWidth: 0, paddingTop: 7 }}
                        data={cityList}
                        renderItem={this.renderCityCell}
                        keyExtractor={(item, index) => index.toString()}
                        numColumns={3}
                        showsVerticalScrollIndicator={false}
                        
                    /> :
                        this.showEmptyFilterUI()
                    }
                    
                </View>

                <View style={{left:"6%",bottom:50,justifyContent:'center',alignItems:'center',width:"87%",alignContent:'center'}}>
                                <Button
                                    btnStyle={[
                                        styles.checkotBtnStyle,
                                        {
                                        marginTop: 20,
                                        marginBottom: 0,
                                        width: '100%',
                                            
                                
                                        padding:16,
                                        },
                                    ]}
                                    rounded
                                    btnText={'Select and proceed'}
                                    textStyle={{color: resources.colors.white,textAlign:'center',fontSize:16,fontWeight:"500",fontFamily:resources.fonts.medium}}
                                    onPress={() => this.onSelectCityProcessed()}
                                    />
                                </View>
                    
                

            </View>
        );
    }
    showEmptyFilterUI = () => {
        if (this.state.showLoader) {
            return (
                this.showLoader()
            )
        } else {
            return (
                <View style={styles.containerLoaderStyle}>
                    <Text>No Data found</Text>
                </View>
            )
        }

    }
    showLoader = () => {
        return (
            <View style={styles.containerLoaderStyle}>
                <ActivityIndicator size="large" color={resources.colors.appColor} />
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {};
};
let container = connect(mapStateToProps, {
    ...actions, onUpdateWishlistBadgeCount,
    onUpdateCartBadgeCount
})(SelectCityScreen);


export default container;

