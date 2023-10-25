import React, {Component} from 'react';
import {connect} from 'react-redux';
import HeaderWithProfile from '../../genriccomponents/header/HeaderWithProfilePic';
import * as actions from '../../redux/actions/CategoryListingAction';
import {
  hitGetFrpPlans,
  onSaveFrpProductListAction,
  getFrpFaqListApi,
  getFrpHowItsWorksListApi,
  getFrpFurnishingPlanListApi,
} from '../../redux/actions/FrpAction';
import {hitAddDeleteWishListApi} from '../../redux/actions/WishListAction';
import styles from './frpStyles';
import APILoadingHOC from '../../genriccomponents/HOCS/APILoadingHOC';
import { Body, Header, Left, Right, Title } from 'native-base';

import {
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  StatusBar,
  FlatList,
  SafeAreaView,
} from 'react-native';
import {MyStatusBar} from '../../genriccomponents/header/HeaderAndStatusBar';
import res from '../../../res';
import Modal from 'react-native-modal';
import {isIphone11orAbove, myWidth} from '../../utility/Utils';
import AppUser from '../../utility/AppUser';
import PlanViewList from './plan/PlanViewList';
import FrpTenureSlider from '../../genriccomponents/slider/FrpTenureSlider';
import SmallIntroSlider from '../../genriccomponents/introSlider/SmallIntroSlider';
import resources from '../../../res';
import events from '../../utility/Events';
import {onUpdateWishlistBadgeCount} from '../../redux/actions/WishListAction';
import AppToast from '../../genriccomponents/appToast/AppToast';
import RadioButtonRN from 'radio-buttons-react-native';

import {ScrollView} from 'react-native-gesture-handler';
import FrpAccordian from '../../genriccomponents/expandView/FrpAccordian';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Support from '../home/views/Support';

const LOAD_DATA_COUNT = 15;
const FRP_PRODUCT_TYPE = 2;

class FrpCategoryScreen extends Component {
  static ROUTE_NAME = 'FrpCategoryScreen';
  constructor(props) {
    super(props);
    this.state = {
      showLoading: true,
      selectedSliderIndex: 0,
      render: false,

      showRealApp: false,
      showSkipButton: true,

      faqData: [],
      faqDataTitle: '',
      faqFlag: false,

      howItsWorksFrp: [],
      howItsWorksFrpTitle: '',
      howItsWorksFrpFlag: false,

      furnishingPlan: [],
      furnishingPlanTitle: '',
      furnishingPlanFlag: false,
    };
    this.selectedChildIndex = 0;
    this.categoryType = FRP_PRODUCT_TYPE;
    this.subCategoryRef = React.createRef();
    this.parentCategoryRef = React.createRef();
    this.pageNumber = 0;
  }
  goToParticular = dataFromHome => {
    let value = JSON.parse(dataFromHome);
    this.selectedChildIndex = 0;
    this.categoryType = value.categoryTypeFromHome;
    this.pageNumber = 0;
    // this.getFrpProductListing(false)
  };

  onChangeCity = () => {
    this.setState({
      showLoading: true,
      selectedSliderIndex: 0,
    });
    this.selectedChildIndex = 0;
    this.categoryType = FRP_PRODUCT_TYPE;
    this.pageNumber = 0;
    this.getFrpProductListing(false);
  };

  updateProductListOnRemoveFromWishList = productId => {
    const {storeProductList} = this.props;
    let finalData = storeProductList.filter(item => {
      if (item.id == productId) {
        if (item.isFavourite == 0) {
          item.isFavourite = 1;
        } else {
          item.isFavourite = 0;
        }
      }
      return item;
    });
    this.props.onSaveProductListAction(finalData);
  };

  componentDidMount() {
    let obj = AppUser.getInstance().emitterInst;
    obj.on(events.ON_CHANGE_CITY, () => {
      this.onChangeCity();
    });
    obj.on(events.UPDATE_CATEGORY_SCREEN_PRODUCT_LIST, productID => {
      this.updateProductListOnRemoveFromWishList(productID);
    });
    obj.on(events.GOTO_PARTICULAR_FRP_CATEGORY_FROM_HOME, tab => {
      this.goToParticular(tab);
    });

    // this.initialdata()
    this.getFrpProductListing(false);

    // FAP Faq's / How its work / FurnishingPlan API
    this.loadFrpFaqData();
    this.loadFrpHowItsWorksData();
    this.loadFurnishingPlanData();
    this.props.navigation.addListener('focus', () => this.componentDidFocus());
  }

  componentDidFocus = () => {
    // StatusBar.setBarStyle('dark-content');
    // StatusBar.setBackgroundColor(resources.colors.white);
  };
  onAppLogoClick = () => {
    this.props.navigation.navigate('DashboardScreen');
  };

  renderHeader = () => {
    // return (
    //   <HeaderWithProfile
    //     headerTitle={resources.strings.CITYMAX}
    //     isBackIconVisible={false}
    //     appLogoVisible={true}
    //     onAppLogoClick={this.onAppLogoClick}
    //     navigateProps={this.props.navigation}
    //     toRoute={'Home'}
    //   />
    // );
    // this.onSliderItemCallback(index, e);
    return(
      
      <Header style={{backgroundColor: 'white',marginTop:30}}>
                <Left >
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Image source={resources.images.img_backicon} style={{width:25,height:25}} />
                    </TouchableOpacity>
                </Left>
                <Body>
                    
                </Body>
                <Right>
                  <View style={styles.monthView}>
                    {
                      this.state.selectedSliderIndex == 0 ? 
<TouchableOpacity onPress={() => this.onSliderItemCallback(1)}>
                        <Text >
                          <Text style={styles.activeText}>12 Month</Text>
                          <Text style={styles.deActiveText}> | 6</Text>
                        </Text>
                    </TouchableOpacity>
                      :
<TouchableOpacity onPress={() => this.onSliderItemCallback(0)}>
                        <Text >
                          <Text style={styles.deActiveText}>12 | </Text>
                          <Text style={styles.activeText}> 6 Month</Text>
                        </Text>
                    </TouchableOpacity>

                    }
                    
                  </View>
                </Right>
            </Header>
      
    )
  };
  render() {
    const {frpProductDetail} = this.props;
    return (
      <SafeAreaView style={styles.fullScreen}>
       
        {this.renderHeader()}
        {/* <View style={styles.appBackground} /> */}
        {/* <View style={styles.marginHorizontal}>
          <View
            style={
              isIphone11orAbove()
                ? {marginBottom: 10, marginTop: 20}
                : {marginBottom: 10}
            }>
            <Text
              style={{
                fontFamily: res.fonts.bold,
                color: res.colors.white,
                fontSize: 18,
                marginTop: 5,
                textAlign: 'center',
              }}>
              Rent Max, Pay Less.
            </Text>
            <Text
              style={{
                fontFamily: res.fonts.regular,
                color: res.colors.white,
                fontSize: 13,
                marginBottom: 5,
                textAlign: 'center',
              }}>
              Simple Plans for Complete Home Furnishing
            </Text>
            <RadioButtonRN
              initial={this.state.selectedSliderIndex}
              circleSize={10}
              data={
                frpProductDetail && frpProductDetail.product
                  ? frpProductDetail.product[0].tenure
                  : []
              }
              // data={[{"attr_id": "4", "attr_name": "6 Months", "attr_price": "3200", "attr_type": "Duration", "city_id": null, "dateAdded": "2020-04-25 12:24:58", "pid": "7998", "product_id": "4037"}, {"attr_id": "4", "attr_name": "12 Months", "attr_price": "2601", "attr_type": "Duration", "city_id": null, "dateAdded": "2021-09-03 12:47:44", "pid": "7992", "product_id": "4037"}]}
              activeColor={res.colors.appColor}
              deactiveColor={res.colors.white}
              boxActiveBgColor={res.colors.white}
              boxDeactiveBgColor={res.colors.appColor}
              textInActiveColor={res.colors.white}
              textColor={res.colors.appColor}
              boxStyle={{
                width: '40%',
                marginHorizontal: 5,
                borderRadius: 30,
                height: 45,
              }}
              style={{
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                alignContent: 'center',
                justifyContent: 'center',
              }}
              textStyle={{marginLeft: 10}}
              selectedBtn={(index, e) => {
                this.onSliderItemCallback(index, e);
              }}
            />
          </View>
        </View> */}
        
        <View style={styles.fullScreenGrow}>
          {this.checkLoadingAndLoading()}
        </View>
        
      </SafeAreaView>
    );
  }

  checkLoadingAndLoading = () => {
    if (this.state.showLoading && this.pageNumber === 0) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size="large" color={res.colors.appColor} />
        </View>
      );
    } else {
      return this.renderFrpProductList();
    }
  };

  onClickFrpPlan = (data, selectedSliderIndex, index) => {
    const {frpProductDetail} = this.props;
    this.props.navigation.navigate('FixedRentalScreen', {
      title: data.product_name,
      description: '',
      frp_refundable_deposit: 0,
      productId: data.id,
      pid: data.tenure[selectedSliderIndex].pid,
      selectedSliderIndex: selectedSliderIndex,
      tenure: frpProductDetail ? frpProductDetail.product[index].tenure : [],
    });
  };
  onSliderItemCallback = (index) => {
  
    this.setState({
      selectedSliderIndex: index,
    });
  };

  onSliderCallback = (index, lastIndex) => {
    let localDefaultItem;
    if (index > lastIndex) {
      localDefaultItem = lastIndex;
    } else {
      localDefaultItem = index;
    }
    this.setState({
      selectedSliderIndex: localDefaultItem,
    });
  };
  onDoneCallback = () => {
    // User finished the introduction. Show real app through
    // navigation or simply by controlling state
    this.setState({showRealApp: false});
  };
  onSkipCallback = () => {
    // User finished the introduction. Show real app through
    // navigation or simply by controlling state
    this.setState({showRealApp: false});
  };
  toggleOverflowModal = () => {
    this.setState({showRealApp: false});
  };

  loadFrpFaqData = () => {
    this.props
      .getFrpFaqListApi()
      .then(data => {
        var result = data.data.content.map(function(el, index) {
          var o = Object.assign({}, el);
          o.id = index + '_hw';
          o.isExpanded = false;
          return o;
        });

        this.setState({
          faqDataTitle: data.data.page_name,
          faqData: result,
          faqFlag: true,
        });
      })
      .catch(error => {
        console.log('error', error);
      });
  };
  loadFrpHowItsWorksData = () => {
    this.props
      .getFrpHowItsWorksListApi()
      .then(data => {
        this.setState({
          howItsWorksFrp: data.data.content,
          howItsWorksFrpTitle: data.data.page_name,
          howItsWorksFrpFlag: true,
        });
      })
      .catch(error => {
        console.log('error', error);
      });
  };
  loadFurnishingPlanData = () => {
    this.props
      .getFrpFurnishingPlanListApi()
      .then(data => {
        this.setState({
          furnishingPlan: data.data.content,
          furnishingPlanTitle: data.data.page_name,
          furnishingPlanFlag: true,
        });
      })
      .catch(error => {
        console.log('error', error);
      });
  };
  renderFrpFaqList = () => {
    const {faqData} = this.state;
    if (faqData.length > 0) {
      let items = [];
      faqData.forEach((item, index) => {
        items.push(
          <FrpAccordian
            isExpand={item.isExpanded}
            title={item.question}
            data={item.answer}
            id={item.id}
            onExpand={this.onExpandItem}
          />,
        );
      });
      return items;
    } else {
      return null;
    }
  };
  onExpandItem = (itemId, expanded) => {
    const {faqData} = this.state;
    var result = faqData.map(function(el, index) {
      var o = Object.assign({}, el);
      if (itemId == o.id) {
        o.isExpanded = expanded;
      } else {
        o.isExpanded = false;
      }

      return o;
    });

    this.setState({
      faqData: result,
    });
  };
  howItsWorksFrpView = () => {
    return (
      <React.Fragment>
        {this.state.howItsWorksFrp.length > 0 && (
          <React.Fragment>
            {this.state.howItsWorksFrp.map(item => {
              return (
                <View style={styles.tilesBox} key={item.index}>
                  <View style={styles.tilesBoxInner}>
                    <Text style={styles.tilesBox01}>{item.index}</Text>
                    <Text style={styles.tilesBox02}>{item.title}</Text>
                    <Text style={styles.tilesBox03}>{item.body}</Text>
                  </View>
                </View>
              );
            })}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  };
  furnishingPlanView = () => {
    return (
      <React.Fragment>
        {this.state.furnishingPlan.length > 0 && (
          <React.Fragment>
            {this.state.furnishingPlan.map((item,index) => {
              return (
                <View
                  style={
                    ([styles.tilesBox],
                    {
                      alignContent: 'center',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginVertical: 6,
                    })
                  }
                  key={item.id}>
                  <View style={[styles.tilesBoxInner,styles.row]}>
                    <View>
                        <View style={styles.roundBtn}>
                          <Text style={{fontWeight:'bold'}}>{index + 1}</Text>
                        </View>
                    </View>
                    <View>
                    <Text style={[styles.tilesBox02, {textAlign: 'left',marginLeft:10}]}>
                      
                      {/* <Icon
                        style={[{}]}
                        name={item.icon}
                        size={20}
                        color={resources.colors.appColor}
                      />{' '} */}
                      {item.title}
                    </Text>
                    <Text
                      style={[
                        styles.tilesBox03,
                        {
                          textAlign: 'left',
                          marginTop: 6,
                          marginLeft:14
                        },
                      ]}>
                      {item.body}
                    </Text>
                    </View>
                    
                  </View>
                </View>
              );
            })}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  };
  renderSteps = ({item, index}) => {
    // return (
    //   <View style={styles.viewStep}>
    //     <View style={styles.tilesBox} key={item.index}>
    //       <View style={styles.tilesBoxInner}>
    //         <Text style={styles.tilesBox01}>{item.index}</Text>
    //         <Text style={styles.tilesBox02}>{item.title}</Text>
    //         <Text style={styles.tilesBox03}>{item.body}</Text>
    //       </View>
    //     </View>
    //   </View>
    // );
    return(
      <>
      <View style={{backgroundColor:'#222222',borderRadius:12,padding:16,width:myWidth/2,margin:5}}>
                <Image style={{marginTop:10,height:40,width:40}} source={require('../../../res/images/Image/freeShoping.png')}/>
                <Text style={{color:'white',fontSize:17,marginTop:10,width:'60%',fontWeight:'bold'}}>{item.title}</Text>
                <Text style={{color:'#C0C0C6',fontSize:14,marginTop:10,width:'100%',marginBottom:10}}>{item.body}</Text>
            </View>
      </>
    )
  };
  howItsWorksallSteps = () => {
    const {howItsWorksFrp} = this.state;
    return (
      <FlatList
        // style={{ marginTop: 10 }}
        data={howItsWorksFrp}
        keyExtractor={(item, index) => index.toString()}
        //numColumns={2}
        horizontal={true}
        renderItem={this.renderSteps}
        showsHorizontalScrollIndicator={false}
      />
    );
  };
  renderFrpProductList = () => {
    const {frpProductDetail} = this.props;
    return (
      <View style={{flex: 1}}>
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
          <View style={{marginHorizontal: 20}}>
          <View style={{marginTop:15}}>
          <Text style={styles.pageTitle}>CityMax</Text>
          <Text style={styles.subTitle}>Simple plans for complete home furnishing</Text>
        </View>
            <Modal
              isVisible={this.state.showRealApp}
              onBackButtonPress={this.toggleOverflowModal}
              // deviceWidth={'80%'}
              style={styles.view}
              onRequestClose={() => {
                this.toggleOverflowModal();
              }}>
              {/* <View style={styles.fullScreenModal}>
                <SmallIntroSlider
                  showRealApp={this.state.showRealApp}
                  onDoneCallback={this.onDoneCallback}
                  showSkipButton={this.state.showSkipButton}
                  onSkipCallback={this.onSkipCallback}
                />
              </View> */}
            </Modal>

            <React.Fragment>
              {/* <FrpTenureSlider
                                defaultItem={this.state.selectedSliderIndex}
                                onSliderCallback={this.onSliderCallback}
                                serverData={frpProductDetail && frpProductDetail.product ? frpProductDetail.product[0].tenure : []} /> */}
              <PlanViewList
                customStyle={{marginTop: 8}}
                serverData={
                  frpProductDetail && frpProductDetail.product
                    ? frpProductDetail.product
                    : []
                }
                onPressItem={this.onClickFrpPlan}
                selectedSliderIndex={this.state.selectedSliderIndex}
              />
            </React.Fragment>
          </View>
          <React.Fragment>
              {/* FRP How Its Works Item */}
              {this.state.howItsWorksFrpFlag ? (
                <View
                  style={{
                    marginVertical: 20,
                    paddingHorizontal: 20,
                    paddingTop: 15,
                    backgroundColor: '#f5f5f5',
                  }}>
                  <Text style={styles.headingTitle}>
                    {this.state.howItsWorksFrpTitle
                      ? this.state.howItsWorksFrpTitle
                      : 'How Citymax works'}
                  </Text>
                  
                  <View style={{marginVertical: 10}}>
                    {this.howItsWorksallSteps()}
                  </View>
                  {/* <View style={{ flex: 1 }}>
                                    {this.howItsWorksFrpView()}
                                </View> */}
                </View>
              ) : (
                <View />
              )}
            </React.Fragment>
          <View style={{marginHorizontal: 0}}>
            <React.Fragment>
              {/* FRP A Complete Furnishing Plan for Your Home Item */}
              {this.state.furnishingPlanFlag ? (
                <View
                  style={{
                    marginVertical: 20,
                    paddingHorizontal: 20,
                    paddingTop: 15,
                  }}>
                  <Text style={[styles.headingTitle, {paddingHorizontal: 0}]}>
                    {this.state.furnishingPlanTitle
                      ? this.state.furnishingPlanTitle
                      : 'How it works'}
                  </Text>
                  
                  <View style={{flex: 1}}>{this.furnishingPlanView()}</View>
                </View>
              ) : (
                <View />
              )}
            </React.Fragment>
            
            <React.Fragment>
              {/* FRP Faq's Item */}
              {/* {this.state.faqFlag ? (
                <View
                  style={{
                    marginBottom: 10,
                    paddingHorizontal: 20,
                    paddingVertical: 6,
                  }}>
                  <Text style={styles.headingTitle}>
                    {this.state.faqDataTitle
                      ? this.state.faqDataTitle
                      : 'Frequently asked questions'}
                  </Text>
                  <View style={styles.lineStyle} />
                  <View style={{flex: 1, marginTop: 10}}>
                    {this.renderFrpFaqList()}
                  </View>
                </View>
              ) : (
                <View />
              )} */}
<View style={styles.paddingClass}>
            <Support />
            </View>
            </React.Fragment>
            
          </View>
        </ScrollView>
      </View>
    );
  };

  getFrpProductListing = isInitial => {
    let frpCatId = '323';
    let appUser = AppUser.getInstance();
    let cityID = appUser.selectedCityId;
    if (cityID == '') {
      AppToast('Please select City');
      return;
    }
    this.props
      .hitGetFrpPlans(cityID, frpCatId)
      .then(resp => {
        this.props.onSaveFrpProductListAction(resp.data[0]);
        this.setState({
          showLoading: false,
          selectedSliderIndex: isInitial
            ? resp.data[0].product[0].tenure.length - 1
            : this.state.selectedSliderIndex,
          showRealApp: resp.data.showRealApp ? resp.data.showRealApp : false,
        });
      })
      .catch(err => {
        console.log('error while fetching CITYMAX plans', err);
        this.setState({
          showLoading: false,
        });
      });
  };
}

const mapStateToProps = state => {
  const {
    allCategories,
    subCategoryIndex,
    storeProductList,
    frpProductDetail,
  } = state.categoryReducer;
  return {
    allCategories: allCategories,
    subCategoryIndex: subCategoryIndex,
    storeProductList: storeProductList,
    frpProductDetail: frpProductDetail,
  };
};

let container = connect(
  mapStateToProps,
  {
    ...actions,
    hitAddDeleteWishListApi,
    hitGetFrpPlans,
    onSaveFrpProductListAction,
    onUpdateWishlistBadgeCount,
    getFrpFaqListApi,
    getFrpHowItsWorksListApi,
    getFrpFurnishingPlanListApi,
  },
)(FrpCategoryScreen);
let loader = APILoadingHOC(container, [
  'CATEGORY_LISTING_API',
  'GET_PRODUCT_LISTING_API',
  'ADD_DELETE_WISHLIST_API',
]);

loader.getIntent = () => {
  return {
    routeName: FrpCategoryScreen.ROUTE_NAME,
  };
};

export default loader;
