import React, { Component } from 'react';
import { View, Image, Text, ScrollView, Alert, ActivityIndicator, SectionList, StatusBar, TouchableOpacity } from 'react-native'
import HeaderWithProfile from '../../genriccomponents/header/HeaderWithProfilePic'
import HorizontalFRPImageView from '../../genriccomponents/productView/horizontalFRPImage/HorizontalFRPImageView'
import res from '../../../res'
import { CartViewModal } from '../modal/CartViewModal'
import { SlotMissingModal } from '../modal/SlotMissingModal'
import { LoginShowAlertModal } from '../modal/LoginShowAlertModal'
import FrpProductHolder from '../../genriccomponents/frpCard/FrpProductHolder'
import HeaderAndStatusBarForFRP from '../../genriccomponents/header/HeaderAndStatusBarForFRP'
import styles from '../../genriccomponents/frpCard/styles';
import * as actions from '../../redux/actions/FrpAction'
import { connect } from 'react-redux'
import FrpTenureSlider from '../../genriccomponents/slider/FrpTenureSlider';
import Button from '../../genriccomponents/button/Button';
import resources from '../../../res';
import Frp from './modals/Frp'
import Modal from 'react-native-modal';
import AppUser from "../../utility/AppUser"
import { checkIfUserIsLoggedIn, showSigninAlert, redirectToSign, isIphone11orAbove } from '../../utility/Utils'
import APILoadingHOC from '../../genriccomponents/HOCS/APILoadingHOC'
import events from '../../utility/Events'
import { onUpdateCartBadgeCount, getCartDetailApi, deleteProductFromCartApi } from '../../redux/actions/CartAction'
import AsyncStorageConstants from '../../utility/AsyncStorageConstants'
import AsyncStorage from '@react-native-community/async-storage';
import AppToast from '../../genriccomponents/appToast/AppToast'
import RadioButtonRN from 'radio-buttons-react-native';
import Icon from 'react-native-vector-icons/FontAwesome';


class FixedRentalScreen extends Component {
    static ROUTE_NAME = "FixedRentalScreen";
    constructor(props) {
        super(props);
        this.title = this.props.route.params && this.props.route.params.title ? this.props.route.params.title : ""
        this.description = this.props.route.params && this.props.route.params.description ? this.props.route.params.description : ""
        this.productId = this.props.route.params && this.props.route.params.productId ? this.props.route.params.productId : null
        this.pid = this.props.route.params && this.props.route.params.pid ? this.props.route.params.pid : null
        this.tenure = this.props.route.params && this.props.route.params.tenure ? this.props.route.params.tenure : null
        this.callback = this.props.route.params && this.props.route.params.callback ? this.props.route.params.callback : null
        this.routeTo = this.props.route.params && this.props.route.params.routeTo ? this.props.route.params.routeTo : null
        this.self = null

        this.state = {
            selectedSliderIndex: this.props.route.params && this.props.route.params.selectedSliderIndex ? this.props.route.params.selectedSliderIndex : 0,
            render: false,
            showLoader: true,
            cartLoader: true,
            showProductLoader: false,
            isModalVisible: false,

            height: null,
            productData: [],
            premiumProducts: [],

            pickOptionsVisible: null,
            pickCheckoutPopupWithoutSelectedOptionsVisible: null,
            loginShowAlert: null,
            is_frp: false,
            cartIdArray: [],
            is_cart_data: false,
            pickCheckoutRooms: null,

            cart_after: true,
        }

        this.roomId = null
        this.slotId = null

    }

    // componentWillUnmount() {
    //     this.props.onSaveFrpProductDetailAction(null)
    // }
    async componentDidMount() {
        //check asyncStorage Data for FRP
        await this.cartAsyncStorageData();
        this.loadRentalDetails()
        this.props.navigation.addListener('focus', () => this.componentDidFocus())
    }

    cartAsyncStorageData = async () => {
        let citymaxProductIndex = await AsyncStorage.getItem(AsyncStorageConstants.citymaxProduct);
        if( this.routeTo == 'cart' && citymaxProductIndex !== null && citymaxProductIndex != "") {
            let citymaxProductGet = JSON.parse(citymaxProductIndex);
            this.setState({
                cartLoader: true
            })
            this.title = citymaxProductGet && citymaxProductGet.title ? citymaxProductGet.title : ""
            this.description = citymaxProductGet.FrpProductDetailObj && citymaxProductGet.FrpProductDetailObj.productDescription ? citymaxProductGet.FrpProductDetailObj.productDescription : ""
            this.productId = citymaxProductGet && citymaxProductGet.productId ? citymaxProductGet.productId : null
            this.pid = citymaxProductGet && citymaxProductGet.pid ? citymaxProductGet.pid : null
            this.tenure = citymaxProductGet && citymaxProductGet.tenure ? citymaxProductGet.tenure : null
            this.callback = citymaxProductGet && citymaxProductGet.callback ? citymaxProductGet.callback : null
            this.self = citymaxProductGet ? citymaxProductGet : null,
            this.rooms = citymaxProductGet && citymaxProductGet.rooms ? citymaxProductGet.rooms : null
            this.selctedSlots = citymaxProductGet && citymaxProductGet.selctedSlots ? citymaxProductGet.selctedSlots : null


            this.setState({
                selectedSliderIndex: citymaxProductGet && citymaxProductGet.selectedSliderIndex ? citymaxProductGet.selectedSliderIndex : 0,
                cartLoader: false
            })
            console.log("this.self",this.self)
        }
    }

    componentDidFocus = async () => {
        await this.cartAsyncStorageData();
        // StatusBar.setBarStyle('dark-content');
        // StatusBar.setBackgroundColor(resources.colors.appColor);
    }

    loadRentalDetails = () => {
        if (this.productId && this.pid) {
            this.props.hitGetFrpPlansDetail(this.productId, this.pid)
                .then((resp) => {
                    let frpInstance = new Frp(resp.data)
                    this.props.onSaveFrpProductDetailAction(frpInstance)
                    this.setState({
                        showLoader: false
                    })
                })
                .catch((err) => {
                    console.log("Error while fetchinf retail details ")
                    this.setState({
                        showLoader: false
                    })
                })
        }
    }
    onBackClick = () => {
        this.props.navigation.goBack()
    }
    renderHeader = () => {
        return (
            <HeaderWithProfile
                // headerTitle={res.strings.CHOOSE_PRODUCT}
                headerTitle={"Your Duration"}
                isBackIconVisible={true}
                navigateProps={this.props.navigation}
                toRoute={"MyAccountScreen"}
                onBackClick={this.onBackClick}
            />
        )
    }
    onSliderCallback = (index) => {
        this.setState({
            selectedSliderIndex: index
        }, () => {
            this.pid = this.tenure ? this.tenure[this.state.selectedSliderIndex].pid : 0
        })
    }
    onSliderItemCallback = (index) => {
        this.setState({
            selectedSliderIndex: index
        }, () => {
            this.pid = this.tenure ? this.tenure[this.state.selectedSliderIndex].pid : 0
        })
    }
    getAdditionalPrice = () => {
        let FrpProductDetailObj =  this.props.FrpProductDetailObj
        if( this.routeTo == 'cart' ) {
            FrpProductDetailObj =  this.self && 'FrpProductDetailObj' in this.self ?  this.self.FrpProductDetailObj : null
        }
        if (FrpProductDetailObj) {
            let amount = 0;
            let rooms = FrpProductDetailObj.rooms;
            if (rooms && rooms.length > 0) {
                rooms.forEach(room => {
                    room.slots.forEach(slot => {
                        amount = amount + parseInt(slot.additionalAmount)
                    })
                })
                if (amount > 0) {
                    return amount
                } else {
                    return 0
                }
            } else {
                return 0
            }
        } else {
            return 0
        }
    }
    toggleModal = () => {
        this.setState({ isModalVisible: false });
    };
    
    showPickerOptions = () => {
        console.log("select images");
        this.setState({
            pickOptionsVisible: 'bottom'
        })
    }
    onPressBackDrop = () => {
        this.setState({
            pickOptionsVisible: null,
            pickCheckoutPopupWithoutSelectedOptionsVisible: null,
            loginShowAlert: null
        })
    }
    
    onClickPickType = (type) => {
        this.setState({
            pickOptionsVisible: null,
            is_cart_data: false
        })
        setTimeout(() => {
            switch (type) {
                case 'go_to_cart':
                    // Go to Cart
                    console.log("Go to Cart Click")
                    let event = AppUser.getInstance().emitterInst;
                    this.props.navigation.pop();
                    event.emit(events.MOVE_TO_CART, 'trigger')
                    break;
                case 'remove':
                    // Remove Product from cart:
                    console.log("Delete Click")
                    this.deleteProduct(this.state.cartIdArray)
                    break;
                default:
                    break;
            }
        }, 500)
    }
    
    onClickCheckoutPopupPickType = (type) => {
        let appUser = AppUser.getInstance()
        let cityID = appUser.selectedCityId;
        this.setState({
            pickCheckoutPopupWithoutSelectedOptionsVisible: null
        })
        setTimeout(() => {
            switch (type) {
                case 'yeah_proceed':
                    // Go to Cart
                    this.props.hitAddFrpProductToCart(this.state.pickCheckoutRooms, cityID, this.pid, this.productId)
                        .then((resp) => {
                            let value = resp.data.itemsIncartCount
                            this.storeCartCountData(value)

                            // show popup for asking user need to go checkout Screen or not
                            // this.showCheckoutPopup()

                            // perform Operation for Async Storage
                            this.storeCitymaxAsyncData();

                            // move to Cart Screen
                            let event = AppUser.getInstance().emitterInst;
                            this.props.navigation.pop();
                            event.emit(events.MOVE_TO_CART, 'trigger')
                        })
                        .catch((err) => {
                            AppToast(err)
                        })
                    break;
                default:
                    break;
            }
        }, 500)
    }
    
    onClickLoginShowAlerPicktType = (type) => {
        this.setState({
            loginShowAlert: null
        })
        setTimeout(() => {
            switch (type) {
                case 'ok':
                    // Go to Login Screen
                    redirectToSign("FixedRentalScreen")
                    break;
                default:
                    break;
            }
        }, 500)
    }

    render() {
        // const { FrpProductDetailObj } = this.props
        let FrpProductDetailObj =  this.props.FrpProductDetailObj
        let additionalAmount =this.getAdditionalPrice();
        // let additionalAmount = 0
        // if( this.routeTo == 'cart' ) {
        //     FrpProductDetailObj =   this.self && 'FrpProductDetailObj' in this.self ? this.self.FrpProductDetailObj : null
        //     console.log("this.selctedSlots",this.selctedSlots)
        //     additionalAmount = (this.selctedSlots && this.selctedSlots != undefined) && this.selctedSlots.reduce(function (acc, curr) {
        //         return acc + parseInt(curr.additionalAmount);
        //     },0);
        // } else {
        //     additionalAmount = this.getAdditionalPrice();
        // }
        const { showLoader, showProductLoader } = this.state
        return (
            <View style={styles.fullScreen}>
                {this.renderHeader()}
                {/* <View style={styles.appBackground}></View> */}
                <Modal 
                    isVisible={this.state.isModalVisible} 
                    onBackButtonPress={this.toggleModal}
                    animationIn={'slideInRight'}
                    animationOut={'slideOutRight'}
                    // deviceWidth={'80%'}
                    style={styles.view}
                    onRequestClose={() => {this.toggleModal()}}
                >
                    <View style={styles.fullScreenModal}>
                        {/* <HeaderAndStatusBarForFRP
                            statusBarColor={resources.colors.appColor}
                            isBackIconVisible={false}
                            isCrossIconVisible
                            headerTitle={""}
                            onBackClick={this.toggleModal}
                        /> */}
                        {this.state.productData.length > 0 && !showProductLoader ?
                        <React.Fragment>
                            <View style={[styles.backBtnBox]}>
                                <TouchableOpacity onPress={()=>this.toggleModal()}
                                    style={[styles.backBtnCont]}
                                    hitSlop={{ top: 10, left: 20, right: 20, bottom: 10 }}>
                                    <Image style={styles.crossIconStyle} source={res.images.close_icon} resizeMode={'contain'}></Image>
                                    {/* <Icon style={[{textAlign: 'center'}]} name={'close'} size={20} color={resources.colors.appColor}  /> */}
                                </TouchableOpacity>
                            </View>
                            <SectionList
                                style={{ paddingBottom: 0, paddingTop: 10 }}
                                sections={this.state.productData}
                                stickySectionHeadersEnabled={false}
                                keyExtractor={(item, index) => item + index}
                                renderItem={this.renderProductView}
                                renderSectionFooter={this.renderFooter}
                                ItemSeparatorComponent={this.SectionSeparatorComponent}
                                renderSectionHeader={({ section: { title } }) => (
                                    <View style={{marginVertical: 0}}>
                                        <Text style={title == "Optional Upgrades" ? styles.sectionHeaderUpgrade : styles.sectionHeader}>{title}</Text>
                                        <Text style={title == "Optional Upgrades" ? styles.sectionSubHeaderUpgrade : styles.sectionSubHeader}>{title == "Optional Upgrades" ? 'Pay little bit extra and upgrade to any of following the products...' :  ''}</Text>
                                    </View>
                                )}
                            ></SectionList>
                        </React.Fragment>
                            : this.showLoader()}
                    </View>
                </Modal>
                {(this.routeTo == 'cart' && this.state.cartLoader) ?  this.showLoader() :
                  <React.Fragment>
                        
                      {/* <View style={styles.marginHorizontal}>
                        <View style={isIphone11orAbove() ? { marginBottom: 10, marginRight: 20, marginTop: 10} : { marginBottom: 10, marginRight: 20}}>
                            <Text style={{fontFamily: res.fonts.bold, color: res.colors.white, fontSize: 18, marginTop: 5, textAlign : 'center' }}>
                                Choose your Duration
                            </Text>
                            <Text style={{fontFamily: res.fonts.regular, color: res.colors.labelColor, fontSize: 13, marginBottom: 5, textAlign : 'center'}}>
                                Simple Plans for Comprehensive Home Furnishing
                            </Text>
                            <RadioButtonRN
                                initial ={this.state.selectedSliderIndex ? this.state.selectedSliderIndex : 0}
                                circleSize = {10}
                                data={this.tenure ? this.tenure : []}
                                // data={[{"attr_id": "4", "attr_name": "6 Months", "attr_price": "3200", "attr_type": "Duration", "city_id": null, "dateAdded": "2020-04-25 12:24:58", "pid": "7998", "product_id": "4037"}, {"attr_id": "4", "attr_name": "12 Months", "attr_price": "2601", "attr_type": "Duration", "city_id": null, "dateAdded": "2021-09-03 12:47:44", "pid": "7992", "product_id": "4037"}]}
                                activeColor={res.colors.appColor}
                                deactiveColor={res.colors.white}
                                boxActiveBgColor={res.colors.white}
                                boxDeactiveBgColor={res.colors.appColor}
                                textInActiveColor={res.colors.white}
                                textColor={res.colors.appColor}
                                boxStyle={{ width: '40%', marginHorizontal: 5, borderRadius: 30, height: 45}}
                                style={{ width: '100%', flexDirection: 'row',  alignItems: 'center', alignContent: 'center', justifyContent: 'center'  }}
                                textStyle={{marginLeft: 10}}
                                selectedBtn={(index, e) => {this.onSliderItemCallback(index, e)}}
                            />
                        </View>
                        <FrpTenureSlider
                            defaultItem={this.state.selectedSliderIndex}
                            onSliderCallback={this.onSliderCallback}
                            serverData={this.tenure}
                        />
                        <View style={styles.rowContent}>
                            <View style={styles.viewRentalAmount}>
                                <Text style={[styles.txtCount]} >
                                    {"Rental Amount "}
                                </Text>
                                <Text style={styles.amountTxt}>
                                    {'\u20B9'}{this.tenure ? this.tenure[this.state.selectedSliderIndex].attr_price : 'NA'}/- month
                                </Text>
                            </View>
                            {additionalAmount > 0 &&
                                <View style={styles.viewRentalAmount}>
                                    <Text style={[styles.txtCount]} >
                                        {"Additional Amount"}
                                    </Text>
                                    <Text style={styles.amountTxt}>
                                        {'\u20B9'}{additionalAmount}/- month
                                    </Text>
                                </View> 
                            }
                            {FrpProductDetailObj && FrpProductDetailObj.productRefundableDeposit ? 
                                <View style={styles.viewRentalAmount}>
                                    <Text style={[styles.txtCount]} >
                                        {"Security Deposit"}
                                    </Text>
                                    <Text style={styles.amountTxt}>
                                        {'\u20B9'}{ FrpProductDetailObj.productRefundableDeposit}
                                    </Text>
                                </View> 
                            : <View style={styles.viewRentalAmount}>
                                <Text style={[styles.txtCount]} >
                                    {"Security Deposit"}
                                </Text>
                                <Text style={styles.amountTxt}>
                                    {'\u20B9'}{ 0 }
                                </Text>
                            </View> }
                        </View>
                        {this.renderTitleAndDesc()}
                    </View> */}
                    <View style={styles.container}>
                    
                        {!showLoader ?
                            <ScrollView style={styles.verticalSlotsView}
                                showsVerticalScrollIndicator={false}>
                                    <View style={{marginTop:15}}>
                    <Text style={styles.pageTitle}>CityMax Lite</Text>
                    <Text style={styles.subTitle}>Simple plans for complete home furnishing</Text>
                    </View>
                    <View style={{backgroundColor:'white',padding:12,borderRadius:20,marginTop:20}}>
            <View>
              <Text style={styles.titleText}>Rental details</Text>
            </View>
            <View style={styles.top}>
              <View style={styles.row}>
                <View>
                    <Image source={require("../../../res/images/productDetail/duration.png")} />
                </View>
                <View style={{marginLeft : 10}}>
                  <Text style={styles.lblText}>Duration</Text>
                  <Text style={styles.lblText1}>3+ months</Text>
                </View>
              </View>
            </View>
            <View style={styles.top}>
              <View style={styles.row}>
                <View>
                    <Image source={require("../../../res/images/productDetail/price.png")} />
                </View>
                <View style={{marginLeft : 10}}>
                  <Text style={styles.lblText}>Monthly Rent</Text>
                  <Text style={styles.lblText1}>{'\u20B9'}{this.tenure ? this.tenure[this.state.selectedSliderIndex].attr_price : 'NA'}/- month</Text>
                </View>
              </View>
            </View>
            <View style={styles.top}>
              <View style={styles.row}>
                <View>
                    <Image source={require("../../../res/images/productDetail/payment.png")} />
                </View>
                <View style={{marginLeft : 10}}>
                  <Text style={styles.lblText}>Security Deposit</Text>
                  <Text style={styles.lblText1}>{'\u20B9'}{ FrpProductDetailObj?.productRefundableDeposit}</Text>
                </View>
              </View>
            </View>
            <View style={styles.top}>
              <View style={styles.row}>
                <View>
                    <Image source={require("../../../res/images/productDetail/install.png")} />
                </View>
                <View style={{marginLeft : 10}}>
                  <Text style={styles.lblText}>Refundable Security Deposit</Text>
                  <Text style={styles.lblText1}>{'\u20B9'}{ FrpProductDetailObj?.productRefundableDeposit}</Text>
                </View>
              </View>
            </View>
        </View>
                                {this.renderSelectionView()}
                            </ScrollView>
                            : this.showLoader()}
                        <Button
                            touchOpacityStyle={styles.btnStyle}
                            rounded
                            btnText={resources.strings.PROCEED}
                            onPress={this.onPressProceed} />
                    {this.state.pickOptionsVisible ?
                        <CartViewModal
                            titlemodel = {'Cityfurnish'}
                            descriptionModel = {'Only one Citymax plan can be ordered at a  time. Please remove rest of the products from cart and place their order separately. '}
                            onClickPickType={this.onClickPickType}
                            visibleModal={this.state.pickOptionsVisible}
                            onPressBackDrop={this.onPressBackDrop} /> : <View />}

                    {this.state.pickCheckoutPopupWithoutSelectedOptionsVisible ?
                        <SlotMissingModal
                            titlemodel = {'Cityfurnish'}
                            descriptionModel = {'Some slots are still empty. Do you want to proceed'}
                            onClickCheckoutPopupPickType={this.onClickCheckoutPopupPickType}
                            visibleModal={this.state.pickCheckoutPopupWithoutSelectedOptionsVisible}
                            onPressBackDrop={this.onPressBackDrop} /> : <View />}

                    {this.state.loginShowAlert ?
                        <LoginShowAlertModal
                            titlemodel = {res.strings.APP_NAME}
                            descriptionModel = {res.strings.youNeedLogin}
                            onClickLoginShowAlerPicktType={this.onClickLoginShowAlerPicktType}
                            visibleModal={this.state.loginShowAlert}
                            onPressBackDrop={this.onPressBackDrop} /> : <View />}
                    </View>
                  </React.Fragment>
                }
            </View>
        )
    }
    showLoader = () => {
        return (
            <View style={styles.containerLoaderStyle}>
                <ActivityIndicator size="large" color={resources.colors.appColor} />
            </View>
        )
    }
    showCheckoutPopup = () => {
        Alert.alert(
            "Cityfurnish",
            "Product successfully added to your shopping cart",
            [
                {
                    text: "Checkout",
                    onPress: () => {
                        let event = AppUser.getInstance().emitterInst;
                        this.props.navigation.pop();
                        event.emit(events.MOVE_TO_CART, 'trigger')
                    },
                    style: "cancel"
                },
                { text: "Continue shopping", onPress: () => this.onBackClick() }
            ],
            { cancelable: false }
        );
    }
    showCheckoutPopupWithoutSelected = (rooms, cityID) => {
        Alert.alert(
            "Cityfurnish",
            "Some slots are still empty. Do you want to proceed",
            [
                {
                    text: "Ok",
                    onPress: () => {
                        this.props.hitAddFrpProductToCart(rooms, cityID, this.pid, this.productId)
                        .then((resp) => {
                            let value = resp.data.itemsIncartCount
                            this.storeCartCountData(value)

                            // show popup for asking user need to go checkout Screen or not
                            // this.showCheckoutPopup()

                            // move to Cart Screen
                            let event = AppUser.getInstance().emitterInst;
                            this.props.navigation.pop();
                            event.emit(events.MOVE_TO_CART, 'trigger')
                        })
                        .catch((err) => {
                            AppToast(err)
                        })
                    },
                    style: "cancel"
                },
                { text: "Cancel", onPress: () => {console.log("Cancel")}, style: "cancel" }
            ],
            { cancelable: false }
        );
    }
    onPressProceed = async () => {
        if (checkIfUserIsLoggedIn()) {
            let appUser = AppUser.getInstance()
            let cityID = appUser.selectedCityId;
            if (cityID == "") {
                AppToast("Please select City")
                return
            }
            this.addToCartAction();
        } else {
            // showSigninAlert("FixedRentalScreen")
            this.setState({
                loginShowAlert: 'bottom'
            })
        }
    }
    
    loadCartDetailsData = async () => {
        await this.props.getCartDetailApi()
            .then((data) => {
                console.log("data.data.products",data.data.products)
                if("products" in data.data && data.data.products.length > 0 ) {
                    let let_is_frp = false;
                    let cartFrpItem = data.data.products.filter((item) => {
                        // if(!item.is_frp || item.is_frp == false || item.is_frp == "false") {
                           let_is_frp = true;
                           return { "cart_id": item.cart_id }
                        // }
                    })
                        
                    this.setState({
                        is_frp: let_is_frp,
                        cartIdArray: cartFrpItem,
                        is_cart_data: true
                    })
                } else {
                    this.setState({
                        is_cart_data: false,
                        cartIdArray: [],
                    })
                }
            })
            .catch((error) => {
                console.log(error, "error")
                this.setState({
                    is_cart_data: false,
                    cartIdArray: [],
                })
            });
    }

    deleteProduct = (cartIdArray) => {
        console.log("cartIdArray",cartIdArray)
        cartIdArray.map((index)=>{
            if(index.cart_id != undefined && index.cart_id != null) {
                return this.props.deleteProductFromCartApi(index.cart_id)
                .then((data) => {
                    AppToast(data.message);
                    // this.routeTo = 'rentalScreen';
                    this.setState({cartIdArray : [], is_cart_data : false, cart_after: false})
    
                    // add item in cart
                    this.addToCartAction();
    
                }).catch((error) => {
                    console.log(error, "error")
                });
            }
        })
        
    }

    addToCartAction = async () => {
        // const { FrpProductDetailObj } = this.props
        let FrpProductDetailObj =  this.props.FrpProductDetailObj
        if( this.routeTo == 'cart' ) {
            FrpProductDetailObj =   this.self && 'FrpProductDetailObj' in this.self ? this.self.FrpProductDetailObj : null
        }
        let appUser = AppUser.getInstance()
        let cityID = appUser.selectedCityId;
        if (cityID == "") {
            AppToast("Please select City")
            return
        }
        if (FrpProductDetailObj) {
            let rooms = FrpProductDetailObj.rooms;
            let selctedSlots = []
            rooms.forEach(room => {
                room.slots.filter(slot => {
                    if (slot.associatedProductId != null) {
                        selctedSlots.push(slot)
                    }
                });
            });

            
            if(selctedSlots.length == 0) {
                AppToast("Please choose atleast one product")
            } else {
                if(this.routeTo == 'cart' && this.state.cart_after) {
                    await this.loadCartDetailsData();
                    await this.deleteProduct(this.state.cartIdArray)
                } else {
                    await this.loadCartDetailsData();
                }
                // if(this.state.is_cart_data && this.state.is_frp) {
                    
                if(this.state.is_cart_data && this.state.cart_after && this.routeTo != 'cart') {
                    this.setState({
                        pickOptionsVisible: 'bottom',
                        is_cart_data: false
                    })
                } else {
                    if (selctedSlots.length != 0 && selctedSlots.length <= 6) {
                        // this.showCheckoutPopupWithoutSelected(rooms, cityID);
                        this.setState({
                            pickCheckoutPopupWithoutSelectedOptionsVisible: 'bottom',
                            pickCheckoutRooms: rooms
                        })
                    } else if (selctedSlots.length >= 7) {
                        this.props.hitAddFrpProductToCart(rooms, cityID, this.pid, this.productId)
                        .then((resp) => {
                            let value = resp.data.itemsIncartCount
                            this.storeCartCountData(value)

                            // show popup for asking user need to go checkout Screen or not
                            // this.showCheckoutPopup()
                            
                            // perform Operation for Async Storage
                            this.storeCitymaxAsyncData();

                            // move to Cart Screen
                            let event = AppUser.getInstance().emitterInst;
                            this.props.navigation.pop();
                            event.emit(events.MOVE_TO_CART, 'trigger')
                        })
                        .catch((err) => {
                            AppToast(err)
                        })
                    }
                }
            }
        }
    }

    storeCitymaxAsyncData = async () => {
        // const { FrpProductDetailObj } = this.props
        let FrpProductDetailObj =  this.props.FrpProductDetailObj
        if( this.routeTo == 'cart' ) {
            FrpProductDetailObj =   this.self && 'FrpProductDetailObj' in this.self ? this.self.FrpProductDetailObj : null
        }
        let appUser = AppUser.getInstance()
        let cityID = appUser.selectedCityId;

        if (FrpProductDetailObj) {
            let rooms = FrpProductDetailObj.rooms;
            let selctedSlots = []
            rooms.forEach(room => {
                room.slots.filter(slot => {
                    if (slot.associatedProductId != null) {
                        selctedSlots.push(slot)
                    }
                });
            });

            let source = { 
                title: this.title,
                description: this.description,
                productId: this.productId,
                pid: this.pid,
                tenure: this.tenure,
                cityID: cityID,
                selectedSliderIndex: this.state.selectedSliderIndex,
                selctedSlots: selctedSlots,
                callback: this.callback,
                rooms: rooms
            };
            let targetObject = Object.assign(source, { FrpProductDetailObj: FrpProductDetailObj });
            console.log("targetObject",targetObject)
            await AsyncStorage.setItem(AsyncStorageConstants.citymaxProduct, JSON.stringify(targetObject))
        } else {
            console.log("Store data in async Storage")
        }
    }

    storeCartCountData = async (data) => {
        let obj = AppUser.getInstance()
        obj.itemsIncartCount = parseInt(data)
        this.props.onUpdateCartBadgeCount(parseInt(data))
        try {
            await AsyncStorage.setItem(AsyncStorageConstants.cartBadgeCount, data)
        } catch (e) {
            // saving error
            console.log("error", e)
        }
    }
    renderSelectionView = () => {
        // const { FrpProductDetailObj } = this.props
        let FrpProductDetailObj =  this.props.FrpProductDetailObj
        if( this.routeTo == 'cart' ) {
            FrpProductDetailObj =   this.self && 'FrpProductDetailObj' in this.self ? this.self.FrpProductDetailObj : null
        }
        if (FrpProductDetailObj && FrpProductDetailObj.rooms && FrpProductDetailObj.rooms.length > 0) {
            let views = []
            FrpProductDetailObj.rooms.forEach(room => {
                views.push(
                    <View
                        key={room.id}
                        style={{ marginTop: 4, justifyContent: 'center' }}>
                        {this.renderSelectionData(room)}
                        <View style={styles.slotsContainer}>
                            {this.renderSlots(room.slots, room.id)}
                        </View>
                    </View>
                )
            });
            return views;
        } else {
            return (<View />)
        }
    }

    renderSlots = (slots, roomId) => {
        if (slots.length > 0) {
            let views = []
            for (let index = 0; index < slots.length; index++) {
                const slot = slots[index];
                views.push(
                    <FrpProductHolder
                        key={slot.id}
                        data={slot}
                        onPressItem={() => { this.onPressItem(slot.id, roomId) }}
                        onRemoveItem={() => { this.onRemoveItem(slot.id, roomId) }}
                    />
                )

            }
            return views
        } else {
            return (<View />)
        }
    }
    renderTitleAndDesc = () => {
        // const { FrpProductDetailObj } = this.props
        let FrpProductDetailObj =  this.props.FrpProductDetailObj
        if( this.routeTo == 'cart' ) {
            FrpProductDetailObj =   this.self && 'FrpProductDetailObj' in this.self ? this.self.FrpProductDetailObj : null
        }
        return (
            <View style={{ borderWidth: 0 }}>
                <View style={[styles.titleView, { borderWidth: 0 }]}>
                    <Text style={[styles.textPlan,]}>
                        {this.title ? this.title : ''}
                    </Text>
                    <Text style={[styles.textPlan, { fontSize: 20, marginBottom: 4 }]}>
                        {FrpProductDetailObj ? " ( " + FrpProductDetailObj.totalCount + " Items )" : ""}
                    </Text>
                </View>
                <Text style={styles.txtDescrip}>
                    {FrpProductDetailObj && FrpProductDetailObj.productDescription ? FrpProductDetailObj.productDescription : this.description}
                </Text>
            </View>
        )
    }

    renderSelectionData = (room) => {
        return (
            <View style={{ marginTop: 18, marginBottom: 8, borderWidth: 0 }}>
                <View style={{ flexDirection: 'column' }}>
                    <Text style={styles.txtSelection}>
                        {room.productName} <Text style={styles.txtSelectionCount}>
                                                ({room.slots.length} Items)
                                            </Text>
                    </Text>
                    {/* <Text style={styles.txtSelectionCount}>
                        ({room.slots.length} Items)
                    </Text> */}
                </View>
            </View>
        )
    }


    onPressItem = (slotId, roomId) => {
        this.setState({ showProductLoader: true })
        if (checkIfUserIsLoggedIn()) {
            this.roomId = roomId;
            this.slotId = slotId
            this.loadData()
            // this.props.navigation.navigate("FrpProductSuggesionScreen", {
            //     productId: this.productId,
            //     roomId: roomId,
            //     slotId: slotId,
            //     callback: this.onChooseProduct
            // })
            this.setState({
                isModalVisible: true
            })
        }
        else {
            // showSigninAlert("FixedRentalScreen")
            this.setState({
                loginShowAlert: 'bottom'
            })
        }
    }


    loadData = () => {
        let appUser = AppUser.getInstance()
        let cityID = appUser.selectedCityId;
        if (this.productId && this.slotId && this.roomId && cityID) {
            this.props.hitGetFrpSuggestionProducts(this.productId, this.roomId, this.slotId, cityID)
                .then((resp) => {
                    let finalData = []
                    // finalData.push(...resp.data.associated_products, ...resp.data.associated_premium_products)
                    var result = resp.data.associated_products.map(function (el) {
                        var o = Object.assign({}, el);
                        o.snapIndex = 0;
                        return o;
                    })
                    if (result.length > 0) {
                        finalData.push({
                            title: "Product Options",
                            // title: "",
                            data: result
                        })
                    }
                    var result1 = resp.data.associated_premium_products.map(function (el) {
                        var o = Object.assign({}, el);
                        o.snapIndex = 0;
                        return o;
                    })
                    if (result1.length > 0) {
                        finalData.push({
                            title: "Optional Upgrades",
                            data: result1
                        })
                    }
                    this.setState({
                        productData: finalData,
                        showProductLoader: false
                    })
                })
                .catch((err) => {
                    this.setState({
                        showProductLoader: false
                    })
                    console.log("Error while fetchinf retail details ")
                })
        }
    }
    onLayoutChange = (event) => {
        var { height } = event.nativeEvent.layout;
        this.setState({ height: height });
    };
    onActiveHorizontalItem = (index, listItemId) => {
        let { productData } = this.state
        let finalData = []
        for (let i = 0; i < productData.length; i++) {
            let label = productData[i].title
            let data = productData[i].data
            let dataNew = data.filter(item => {
                if (item.id == listItemId) {
                    item.snapIndex = index;
                }
                return item
            })
            finalData.push({
                title: label,
                data: dataNew
            })
        }
        this.setState({
            productData: finalData
        })
    }

    renderProductView = ({ item, index }) => {
        if (item.productDetails) {
            let data = item.productDetails && item.productDetails[0]
            if (!data) {
                return null
            }
            const { dimension, brand, material, colour, city_quantity } = data
            return (
                <View>
                    <View style={styles.horizontalImageContainer}>
                        <HorizontalFRPImageView
                            data={data.image}
                            activeIndexHorizontal={item.snapIndex}
                            frpStyle={true}
                            onSnapToItem={(snapIndex) => (this.onActiveHorizontalItem(snapIndex, item.id))} />
                    </View>
                    <View style={styles.margin}>
                        <Text style={styles.titleTextStyle}>{data.product_name}</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            {/* <Text style={styles.specificationTextStyle}>{resources.strings.SPECIFICATION_TITLE}</Text> */}
                            {item.additional_amount &&
                                <Text style={styles.additonalAmountStyle}>+{'\u20B9'}{item.additional_amount}/month</Text>
                            }

                        </View>
                        <View style={styles.rowDirection}>
                            <View style={[styles.spaceContainer,{justifyContent:"center"}]}>
                                <Image source={resources.images.size_icon} style={{width:30,height:30,marginTop:14}} />
                                {/* {brand && brand == "" ? <View /> : <Text style={styles.subTitleTextStyle}>{resources.strings.BRAND_TEXT}</Text>} */}
                                {/* {dimension == "" || dimension == null ? <View /> : <Text style={styles.subTitleTextStyle}>{resources.strings.SIZE_TEXT}</Text>} */}
                                {/* {material && material == "" ? <View /> : <Text style={styles.subTitleTextStyle}>{resources.strings.MATERIAL_TEXT}</Text>} */}
                                {/* {colour && colour == "" ? <View /> : <Text style={styles.subTitleTextStyle}>{resources.strings.COLOR_TEXT}</Text>} */}
                            </View>
                            <View style={[styles.spaceContainer,{justifyContent:"center",marginLeft:10}]}>
                                {/* {brand && brand == "" ? <View /> : <Text style={styles.subTitleValueStyle} ellipsizeMode={'tail'} numberOfLines={1}>{brand}</Text>} */}
                                {dimension == "" || dimension == null ? <View /> : <Text style={styles.subTitleTextStyle}>{resources.strings.SIZE_TEXT}</Text>}
                                {dimension == "" || dimension == null ? <View /> : <Text style={styles.subTitleValueStyle} ellipsizeMode={'tail'} numberOfLines={1}>{dimension}</Text>}
                                {/* {material && material == "" ? <View /> : <Text style={styles.subTitleValueStyle} ellipsizeMode={'tail'} numberOfLines={1}>{material}</Text>} */}
                                {/* {colour && colour == "" ? <View /> : <Text style={styles.subTitleValueStyle} ellipsizeMode={'tail'} numberOfLines={1}>{colour}</Text>} */}
                            </View>
                        </View>
                        <View style={styles.marginTopBottom}>
                            <Button
                                rounded 
                                btnStyle={{height: 38, backgroundColor: (city_quantity && parseInt(city_quantity) > 0)  ? resources.colors.appColor : resources.colors.greyLight}}
                                btnText={(city_quantity && parseInt(city_quantity) > 0) ? resources.strings.ADD : resources.strings.OUT_OF_STOCK}
                                disableTouch={(city_quantity && parseInt(city_quantity) > 0)  ? false : true}
                                onPress={() => { this.onChooseFRPSubProduct(item) }} />
                        </View>
                    </View>
                </View>
            )
        }

    }

    onChooseFRPSubProduct = (item) => {
        let obj = {
            type: item.additional_amount ? "premium" : "associated",
            imgUrl: item.productDetails[0].image[0],
            slotId: this.slotId,
            roomId: this.roomId,
            associatedProductId: item.associated_product_id,
            additionalAmount: item.additional_amount ? item.additional_amount : 0
        }
        this.onChooseProduct(obj)
        this.toggleModal();
        // if (this.callback) {
        //     this.callback(obj)
        //     this.onBackClick();
        // }
    }
    SectionSeparatorComponent = () => {
        return (
            <View>
                <Image source={resources.images.img_dash_line}
                    style={{ width: '100%', marginVertical: 13 }}
                    resizeMode={'cover'}>
                </Image>
            </View>
        )
    }
    renderFooter = () => {
        return (
            <View style={{ height: 15 }} />
        )
    }

    onRemoveItem = (slotId, selectedRoomId) => {
        // const { FrpProductDetailObj } = this.props
        let FrpProductDetailObj =  this.props.FrpProductDetailObj
        if( this.routeTo == 'cart' ) {
            FrpProductDetailObj =   this.self && 'FrpProductDetailObj' in this.self ? this.self.FrpProductDetailObj : null
        }
        if (FrpProductDetailObj) {
            FrpProductDetailObj.rooms.forEach(room => {
                let roomId = room.id;
                if (roomId == selectedRoomId) {
                    room.slots.forEach(slot => {
                        let id = slot.id;
                        if (slotId == id) {
                            slot.selectedImgUrl = "";
                            slot.associatedProductId = null;
                            slot.productType = null;
                            slot.additionalAmount = 0;
                            this.props.onSaveFrpProductDetailAction(FrpProductDetailObj);
                            this.setState({
                                render: !this.state.render
                            })
                        }
                    });
                }

            });
        }
    }
    onChooseProduct = (data) => {
        // const { FrpProductDetailObj } = this.props
        let FrpProductDetailObj =  this.props.FrpProductDetailObj
        if( this.routeTo == 'cart' ) {
            FrpProductDetailObj =   this.self && 'FrpProductDetailObj' in this.self ? this.self.FrpProductDetailObj : null
        }
        if (FrpProductDetailObj) {
            FrpProductDetailObj.rooms.forEach(room => {
                let roomId = room.id;
                room.slots.forEach(slot => {
                    let slotId = slot.id;
                    if (roomId == data.roomId && slotId == data.slotId) {
                        slot.selectedImgUrl = data.imgUrl
                        slot.associatedProductId = data.associatedProductId
                        slot.productType = data.type
                        slot.additionalAmount = data.additionalAmount
                        this.props.onSaveFrpProductDetailAction(FrpProductDetailObj);
                        this.setState({
                            render: !this.state.render
                        })
                    }
                });
            });
        }
        // console.log("onChooseProduct=> ", JSON.stringify(data))
    }
}



const mapStateToProps = (state) => {
    const { FrpProductDetailObj } = state.frpReducer
    return { FrpProductDetailObj: FrpProductDetailObj };
};

let container = connect(mapStateToProps, { ...actions, onUpdateCartBadgeCount, getCartDetailApi, deleteProductFromCartApi })(FixedRentalScreen);
let loader = APILoadingHOC(container);

export default loader;

