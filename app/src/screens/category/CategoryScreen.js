import React, {Component} from 'react';
import {connect} from 'react-redux';
import CategotyCell from '../../genriccomponents/subCategory/category/CategotyCell';
import SubCategotyCell from '../../genriccomponents/subCategory/category/SubCategoryCell';
import * as actions from '../../redux/actions/CategoryListingAction';
import {
  hitGetFrpPlans,
  onSaveFrpProductListAction,
  getFrpFaqListApi,
  getFrpHowItsWorksListApi,
  getFrpFurnishingPlanListApi,
} from '../../redux/actions/FrpAction';
import {hitAddDeleteWishListApi} from '../../redux/actions/WishListAction';
import styles from './styles';
import APILoadingHOC from '../../../src/genriccomponents/HOCS/APILoadingHOC';
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
import {checkIfUserIsLoggedIn, showSigninAlert} from '../../utility/Utils';
import {NormalCategoryList} from './subCategory/normalCategory/NormalCategoryList';
import {ComboCategoryList} from './subCategory/comboCategory/ComboCategoryList';
import AppUser from '../../utility/AppUser';
import PlanViewList from '../frp/plan/PlanViewList';
import FrpTenureSlider from '../../genriccomponents/slider/FrpTenureSlider';
import SmallIntroSlider from '../../genriccomponents/introSlider/SmallIntroSlider';
import resources from '../../../res';
import events from '../../utility/Events';
import {onUpdateWishlistBadgeCount} from '../../redux/actions/WishListAction';
import AsyncStorageConstants from '../../utility/AsyncStorageConstants';
import AsyncStorage from '@react-native-community/async-storage';
import AppToast from '../../genriccomponents/appToast/AppToast';
import RadioButtonRN from 'radio-buttons-react-native';
import NetInfo from '@react-native-community/netinfo';
import {ScrollView} from 'react-native-gesture-handler';
import FrpAccordian from '../../genriccomponents/expandView/FrpAccordian';
import Icon from 'react-native-vector-icons/FontAwesome5';
import HeaderWithProfilePic from '../../genriccomponents/header/HeaderWithProfilePic';
import HeaderWithLocation from '../../genriccomponents/header/HeaderWithLocation';

const LOAD_DATA_COUNT = 15;
const NORMAL_PRODUCT_TYPE = 0;
const COMBO_PRODUCT_TYPE = 1;
const FRP_PRODUCT_TYPE = 2;

class CategoryScreen extends Component {
  static ROUTE_NAME = 'CategoryScreen';
  constructor(props) {
    super(props);
    this.state = {
      categoryList: [],
      selectedParentIndex: 0,
      selectedInitialIndex : 0,
      selectedSortType: '',
      selectedFilters: {},
      isRefreshing: false,
      showLoading: true,
      next: true,
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
      homeCategoryData : null
    };
    this.selectedChildIndex = 0;
    this.categoryType = COMBO_PRODUCT_TYPE;
    this.subCategoryRef = React.createRef();
    this.parentCategoryRef = React.createRef();
    this.pageNumber = 0;
    this.seoUrl = ""
  }
  goToParticular = dataFromHome => {

    let value = JSON.parse(dataFromHome);
    
    this.selectedChildIndex = value.categoryIndex;
    this.categoryType = value.categoryTypeFromHome;
    
    this.setState({
      selectedParentIndex : value.categoryIndex,
      selectedInitialIndex : value.categoryIndex,
      homeCategoryData : value
    })
    this.pageNumber = 0;
    this.seoUrl = value.seoUrl
    //this.preLoadData(true, value);
    setTimeout(() => {
      this.handleChangeParentTab(value.categoryIndex);
       // this.preLoadData(true, value);
       // this.preLoadDataWhenComesFromHome(true, value)
    }, 100)
  };
  preLoadData = (isFirst, value) => {
    setTimeout(
      () => {
        if (this.isCategorydataLoaded) {
          this.preLoadDataWhenComesFromHome(true, value);
        } else {
          if (isFirst) {
            this.preLoadData(false, value);
          }
        }
      },
      isFirst ? 500 : 1000,
    );
  };
  preLoadDataWhenComesFromHome = (isFromHomeScreen, value) => {
    // console.log('isFromHomeScreen => ', isFromHomeScreen, 'value=>  ', value);
    // fetching all the category listing
    // this.props.hitCategoryListingApi()
    //     .then((data) => {
    // this.compareAndGetPositionCategoryIds(value, data.data)
    
      //this.compareAndGetPositionCategoryIds(value, this.state.categoryList);
    
    
    // })
    // .catch((error) => {
    //     console.log("error", error)
    //     this.setState({
    //         showLoading: false,
    //     })
    // });
  };

  compareAndGetPositionCategoryIds = (category, categoryList) => {
    
    if(categoryList){
      let id = category.categoryId;
      let type = category.categoryTypeFromHome;
      
      this.categoryType = type;
      let index = categoryList.findIndex(item => item.id == id);
      
      this.setState(
        {
          // categoryList: categoryList,
          selectedFilters: {},
          selectedSortType: '',
          selectedParentIndex: index,
          showLoading: false,
          isRefreshing: false,
          next: true,
        },
        () => {
          // saving all the categories in the props
          // this.props.onSaveAllCategoriesAction(categoryList);
          // do not hit product api for CITYMAX type
          if (this.categoryType != FRP_PRODUCT_TYPE) {
            this.getProductListing(false);
          } else {
            this.getFrpProductListing(false);
          }
          console.log('\n', 'this.state.selectedParentIndex=>  ', index);
          setTimeout(() => {
            this.handleChangeParentTab(index);
          }, 100);
        },
      );
    }
    
  };

  handleChangeParentTab = parentTabPosition => {
    if (
      this.parentCategoryRef &&
      this.parentCategoryRef.current &&
      parentTabPosition != -1
    ) {
      this.parentCategoryRef.current.goToPage(parentTabPosition);
    }
  };

  onChangeCity = () => {
    this.setState({
      categoryList: [],
      selectedParentIndex: 0,
      selectedSortType: '',
      selectedFilters: {},
      isRefreshing: false,
      showLoading: true,
      next: true,
      selectedSliderIndex: 0,
    });
    this.selectedChildIndex = 0;
    this.categoryType = COMBO_PRODUCT_TYPE;
    this.pageNumber = 0;
    this.initialdata();
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
    obj.on(events.GOTO_PARTICULAR_CATEGORY_FROM_HOME, tab => {
      // console.log("tab.categoryIndex 123 ::",tab)
      // this.setState({
      //   homeCategoryData : tab
      // })
      this.goToParticular(tab);
    });

    this.initialdata();

    // FAP Faq's / How its work / FurnishingPlan API
    this.loadFrpFaqData();
    this.loadFrpHowItsWorksData();
    this.loadFurnishingPlanData();
    this.props.navigation.addListener('focus', () => this.componentDidFocus());
  }

  componentDidFocus = () => {
    let city = AppUser.getInstance().selectedCityName;
    this.setState({
      currentSeletcedCity: city,
    });
    // StatusBar.setBarStyle('dark-content');
    // StatusBar.setBackgroundColor(resources.colors.white);
  };

  initialdata = async () => {
    // fetching all the category listing
    const value = await AsyncStorage.getItem('HomePageData');
    if (value !== null) {
      let dataSet = JSON.parse(value)
      this.setState(
        {
          categoryList: dataSet.categories,
          selectedFilters: {},
          selectedSortType: '',
        },
        () => {
          // saving all the categories in the props
          // this.props.onSaveAllCategoriesAction(dataSet.categories);
          // do not hit product api for CITYMAX type
          if (this.categoryType != FRP_PRODUCT_TYPE) {
            this.getProductListing(false);
          } else {
            this.getFrpProductListing(true);
          }
        },
      );
    }


    
    // this.props
    //   .hitCategoryListingApi()
    //   .then(data => {
    //     console.log("data.data category 12345 :::",JSON.stringify(data.data))
    //     this.setState(
    //       {
    //         categoryList: data.data,
    //         selectedFilters: {},
    //         selectedSortType: '',
    //       },
    //       () => {
    //         // saving all the categories in the props
    //         this.props.onSaveAllCategoriesAction(data.data);
    //         // do not hit product api for CITYMAX type
    //         if (this.categoryType != FRP_PRODUCT_TYPE) {
    //           this.getProductListing(false);
    //         } else {
    //           this.getFrpProductListing(true);
    //         }
    //       },
    //     );
    //     this.isCategorydataLoaded = true;
    //   })
    //   .catch(error => {
    //     console.log('error', error);
    //     this.setState({
    //       showLoading: false,
    //     });
    //   });
  };

  onSelectedParentCategory = (index,type) => {
    
    
    this.pageNumber = 0;
    this.selectedChildIndex = index;
    this.categoryType = this.state.categoryList[index].categoryType;
    
    this.handleChangeScreen();
    if (this.categoryType == FRP_PRODUCT_TYPE) {
      this.setState(
        {
          selectedParentIndex: index,
          selectedInitialIndex : index
        },
        () => {
          console.log("list 1 ::",this.state.selectedInitialIndex)
          this.getFrpProductListing(false);
        },
      );
    } else {
      this.setState(
        {
          selectedParentIndex: index,
          showLoading: true,
          selectedFilters: {},
          selectedSortType: '',
          selectedInitialIndex : index
        },
        () => {
          console.log("list 2 ::",this.state.selectedInitialIndex)
          this.getProductListing(false);
        },
      );
    }
  };

  onSelectedChildCategory = index => {
    this.pageNumber = 0;
    this.selectedChildIndex = index;
    //this.props.saveSubTabToRedux(index);
    // if (this.categoryType == FRP_PRODUCT_TYPE) {
    //   this.getFrpProductListing(false);
    // } else {
      this.setState(
        {
          showLoading: true,
          selectedFilters: {},
          selectedSortType: '',
        },
        () => {
          this.getProductListing(false);
        },
      );
    //}
  };
  componentWillReceiveProps(nextProps) {
    const {subCategoryIndex} = nextProps;
    if (subCategoryIndex !== this.selectedChildIndex) {
      this.handleChangeScreen();
    }
  }

  handleChangeScreen = () => {
    if (
      this.subCategoryRef &&
      this.subCategoryRef.current &&
      this.selectedChildIndex != -1
    ) {
      this.subCategoryRef.current.goToPage(this.selectedChildIndex);
    }
  };
  checkInternetAndGotoScreenWithParams = (screen, params) => {
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        return;
      } else {
        this.props.navigation.navigate(screen, params);
      }
    });
  };
  onClickLocation = () => {
    this.checkInternetAndGotoScreenWithParams('SelectCityScreen', {
      fromRoute: 'HomeScreen',
      callback: this.onChangeCity,
    });
  };


  onChangeCity = city => {
    this.setState({
      currentSeletcedCity: city,
    });
  };

  renderHeader = () => {
    return (
      <HeaderWithLocation
        headerTitle={this.state.currentSeletcedCity}
        appLogoVisible={true}
        isBackIconVisible={false}
        isLogoutVisible={false}
        navigateProps={this.props.navigation}
        onClickLocation={this.onClickLocation}
      />
    );
  };
  render() {
    const {categoryList, selectedParentIndex} = this.state;
    return (
      <SafeAreaView style={styles.fullScreen}>
        {this.renderHeader()}
        {
           this.props?.route?.params?.isShowCategory != false ?
           <MyStatusBar
              backgroundColor={"white"}
              barStyle="dark-content"
            />
          :
          null
        }
        {/* {
              this.props?.route?.params?.isShowCategory == false ?
              <>
                <HeaderWithProfilePic 
                    isBackIconVisible={true}
                    onBackClick={() => {this.props.navigation.goBack()}}
                />
                <View style={styles.paddingClass}>
                  <Text style={styles.titleText}>Combos</Text>
              </View>
              </>
              :
              null
        } */}
        
        {
          this.props?.route?.params?.isShowCategory != false ?
          categoryList && categoryList.length > 0 ? 
            <View style={{height: 50}}>
              <CategotyCell
                categoryRef={this.parentCategoryRef}
                selectedIndex={this.onSelectedParentCategory}
                tabBarUnderlineStyle={{
                  backgroundColor: res.colors.blueText,
                  borderStyle: 'solid',
                  height: 2,
                }}
                tabBarInactiveTextColor={res.colors.labelColor}
                tabBarActiveTextColor={res.colors.blueText}
                listDataItem={categoryList}
                isImageVisible={false}
                initialPageIndex ={this.state.selectedInitialIndex}
              />
            </View>
            : <View />
           : 
            <View />
          
          
        }
        
        
        
        {/* {this.props?.route?.params?.isShowCategory != false ? 
        this.categoryType != FRP_PRODUCT_TYPE ? (
          <React.Fragment>
            {categoryList &&
            categoryList.length > 0 &&
            categoryList[selectedParentIndex].hasOwnProperty(
              'sub_categories',
            ) &&
            categoryList[selectedParentIndex].sub_categories &&
            categoryList[selectedParentIndex].sub_categories.length > 0 ? (
              <View style={{height: 40}}>
                <SubCategotyCell
                  subCategoryRef={this.subCategoryRef}
                  listDataItem={
                    categoryList[selectedParentIndex].sub_categories
                  }
                  tabBarUnderlineStyle={{
                    backgroundColor: res.colors.appColor,
                    borderStyle: 'solid',
                  }}
                  tabBarInactiveTextColor={res.colors.black}
                  tabBarActiveTextColor={res.colors.appColor}
                  selectedIndexSub={this.onSelectedChildCategory}
                  isImageVisible={true}
                />
              </View>
            ) : (
              <View />
            )}
          </React.Fragment>
        ) : null : null} */}
        {/* {
          this.props?.route?.params?.isShowCategory == false? 
          null
          :
          <View style={{height: 40}}>
                <SubCategotyCell
                  subCategoryRef={this.subCategoryRef}
                  listDataItem={this.state.categoryList}
                  tabBarUnderlineStyle={{
                    backgroundColor: res.colors.appColor,
                    borderStyle: 'solid',
                  }}
                  tabBarInactiveTextColor={res.colors.black}
                  tabBarActiveTextColor={res.colors.appColor}
                  selectedIndexSub={this.onSelectedChildCategory}
                  isImageVisible={true}
                />
              </View>
        } */}
        
        <View style={styles.fullScreen}>
          {
            this.props?.route?.params?.isShowCategory == false?
          this.renderComboProductList()
          :
          this.checkLoadingAndLoadLiting()}
        </View>

        {this.props?.route?.params?.isShowCategory != false  ?
        this.categoryType != FRP_PRODUCT_TYPE
          ? this.renderBottomFilterView()
          : null : null}
      </SafeAreaView>
    );
  }

  checkLoadingAndLoadLiting = () => {
    if (this.state.showLoading && this.pageNumber === 0) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size="large" color={res.colors.appColor} />
        </View>
      );
    } else {
      return this.getLayoutToBeRendereInBottomView();
    }
  };

  getLayoutToBeRendereInBottomView = () => {
    switch (this.categoryType) {
      case NORMAL_PRODUCT_TYPE:
        return this.renderNormalProductList();
      case COMBO_PRODUCT_TYPE:
        return this.renderComboProductList();
      case FRP_PRODUCT_TYPE:
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
  onSliderItemCallback = (index, event) => {
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
            {this.state.furnishingPlan.map(item => {
              return (
                <View
                  style={[
                    styles.tilesBox,
                    {
                      alignContent: 'center',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginVertical: 6,
                    },
                  ]}
                  key={item.id}>
                  <View style={styles.tilesBoxInner}>
                    <Text style={[styles.tilesBox02, {textAlign: 'center'}]}>
                      {' '}
                      <Icon
                        style={[{}]}
                        name={item.icon}
                        size={20}
                        color={resources.colors.appColor}
                      />{' '}
                      {item.title}
                    </Text>
                    <Text
                      style={[
                        styles.tilesBox03,
                        {textAlign: 'center', marginTop: 6},
                      ]}>
                      {item.body}
                    </Text>
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
    return (
      <View style={styles.viewStep}>
        <View style={styles.tilesBox} key={item.index}>
          <View style={styles.tilesBoxInner}>
            <Text style={styles.tilesBox01}>{item.index}</Text>
            <Text style={styles.tilesBox02}>{item.title}</Text>
            <Text style={styles.tilesBox03}>{item.body}</Text>
          </View>
        </View>
      </View>
    );
  };
  howItsWorksallSteps = () => {
    const {howItsWorksFrp} = this.state;
    return (
      <FlatList
        // style={{ marginTop: 10 }}
        data={howItsWorksFrp}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        renderItem={this.renderSteps}
        showsVerticalScrollIndicator={false}
      />
    );
  };
  renderFrpProductList = () => {
    const {frpProductDetail} = this.props;
    return (
      <View style={{flex: 1}}>
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
          <View style={{marginHorizontal: 20}}>
            <Modal
              isVisible={this.state.showRealApp}
              onBackButtonPress={this.toggleOverflowModal}
              // deviceWidth={'80%'}
              style={styles.view}
              onRequestClose={() => {
                this.toggleOverflowModal();
              }}>
              <View style={styles.fullScreenModal}>
                <SmallIntroSlider
                  showRealApp={this.state.showRealApp}
                  onDoneCallback={this.onDoneCallback}
                  showSkipButton={this.state.showSkipButton}
                  onSkipCallback={this.onSkipCallback}
                />
              </View>
            </Modal>
            <React.Fragment>
              <View style={{marginBottom: 10}}>
                <Text
                  style={{
                    fontFamily: res.fonts.bold,
                    color: res.colors.labelColor,
                    fontSize: 18,
                    marginTop: 5,
                    textAlign: 'center',
                  }}>
                  Rent Max, Pay Less.
                </Text>
                <Text
                  style={{
                    fontFamily: res.fonts.regular,
                    color: res.colors.labelColor,
                    fontSize: 13,
                    marginBottom: 5,
                    textAlign: 'center',
                  }}>
                  Simple Plans for Complete Home Furnishing
                </Text>
                {console.log(
                  frpProductDetail.product[0].tenure[
                    this.state.selectedSliderIndex
                  ].attr_name,
                  'frp prd details',
                )}
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
                  // deactiveColor={res.colors.white}
                  // boxActiveBgColor={res.colors.appColor}
                  // boxDeactiveBgColor={'#C4C1C1'}
                  textColor={res.colors.appColor}
                  textInActiveColor={res.colors.black}
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
                  <Text style={[styles.headingTitle, {paddingHorizontal: 20}]}>
                    {this.state.furnishingPlanTitle
                      ? this.state.furnishingPlanTitle
                      : 'A Complete Furnishing Plan for Your Home'}
                  </Text>
                  <View style={styles.lineStyle} />
                  <View style={{flex: 1}}>{this.furnishingPlanView()}</View>
                </View>
              ) : (
                <View />
              )}
            </React.Fragment>
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
                  <View style={styles.lineStyle} />
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
            <React.Fragment>
              {/* FRP Faq's Item */}
              {this.state.faqFlag ? (
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
              )}
            </React.Fragment>
          </View>
        </ScrollView>
      </View>
    );
  };
  renderComboProductList = () => {
    return (
      <ComboCategoryList
        serverData={this.props.storeProductList}
        onPressItem={this.onPressComboItem}
        onPressFav={this.onPressFav}
        loadMoreData={this.handleLoadMore}
        isRefreshing={this.state.isRefreshing}
        onRefresh={this.onRefresh}
      />
    );
  };
  renderNormalProductList = () => {
    return (
      
      <NormalCategoryList
        serverData={this.props.storeProductList}
        onPressItem={this.onPressItem}
        loadMoreData={this.handleLoadMore}
        isRefreshing={this.state.isRefreshing}
        onRefresh={this.onRefresh}
        onPressFav={this.onPressFav}
      />
      
    );
  };
  storeWishlistCountData = async data => {
    let obj = AppUser.getInstance();
    obj.wishlistCount = data;
    this.props.onUpdateWishlistBadgeCount(data);
    try {
      await AsyncStorage.setItem(
        AsyncStorageConstants.wishlistBadgeCount,
        data.toString(),
      );
    } catch (e) {
      // saving error
      console.log('error', e);
    }
  };

  onPressFav = (productId, key) => {
    if (checkIfUserIsLoggedIn()) {
      this.props
        .hitAddDeleteWishListApi(productId)
        .then(data => {
          const {storeProductList} = this.props;
          let finalData = storeProductList.filter(item => {
            if (item.id == productId) {
              if (item.isFavourite == 0) {
                item.isFavourite = 1;
                AppToast(resources.strings.addedToWishList);
              } else {
                item.isFavourite = 0;
                AppToast(resources.strings.removedFromWishList);
              }
            }
            return item;
          });
          this.props.onSaveProductListAction(finalData);
          this.storeWishlistCountData(data.data.WishlistItemsCount);
        })
        .catch(error => {
          console.log('Error while adding product to wishlist');
        });
    } else {
      showSigninAlert('DashboardScreen');
    }
  };
  onRefresh = () => {
    this.pageNumber = 0;
    this.setState({
      showLoading: true,
    });
    this.getProductListing(false);
  };
  onPressComboItem = (id, key) => {
    this.props.navigation.navigate('ProductDetailScreen', {
      productId: id,
    });
  };
  onPressItem = (data, key) => {
    this.props.navigation.navigate('ProductDetailScreen', {
      productId: data.id,
      refresh: () => this.onRefresh(),
    });
  };

  handleLoadMore = () => {
    if (!this.state.showLoading && this.state.next) {
      this.pageNumber = this.pageNumber + 1; // increase page by 1
      this.loadMoreData(); // method for API call
    }
  };
  loadMoreData = () => {
    this.setState({
      showLoading: true,
    });

    this.getProductListing(true);
  };
  renderFooter = () => {
    // it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (!this.state.showLoading) return null;
    return (
      <View style={{height: 24}}>
        <ActivityIndicator size="large" color={res.colors.appColor} />
      </View>
    );
  };

  renderBottomFilterView = () => {
    return (
      <View style={styles.veiwBottomFilter}>
        {/* Uncomment when you want to use filter */}
        <TouchableOpacity onPress={this.onPressFilter}>
          <View style={styles.horizontal}>
            <Image source={res.images.icn_filter} />
            <Text style={styles.filterText}>{res.strings.Filter}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity onPress={this.onPressSort}>
          <View style={styles.horizontal}>
            <Image source={res.images.icn_sort} />
            <Text style={styles.filterText}>{res.strings.Sort}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  getFrpProductListing = isInitial => {
    const {categoryList, selectedParentIndex} = this.state;
    if (categoryList && categoryList.length > 0) {
      //let subArr = categoryList[selectedParentIndex].sub_categories;
      let subArr = categoryList;
      if (subArr) {
        let subCatId = subArr[this.selectedChildIndex].id;
        //let subCatId = 270
        let appUser = AppUser.getInstance();
        let cityID = appUser.selectedCityId;
        if (cityID == '') {
          AppToast('Please select City');
          return;
        }
        this.props
          .hitGetFrpPlans(cityID, subCatId)
          .then(resp => {
            this.props.onSaveFrpProductListAction(resp.data[0]);
            this.setState({
              showLoading: false,
              selectedSliderIndex: isInitial
                ? resp.data[0].product[0].tenure.length - 1
                : this.state.selectedSliderIndex,
              showRealApp: resp.data.showRealApp
                ? resp.data.showRealApp
                : false,
            });
          })
          .catch(err => {
            console.log('error while fetching CITYMAX plans', err);
            this.setState({
              showLoading: false,
            });
          });
      }
    }
  };

  getProductListing = isLoadMore => {
    
    const {
      categoryList,
      selectedParentIndex,
      selectedSortType,
      selectedFilters,
    } = this.state;
    if (categoryList && categoryList.length > 0) {
      //let subArr = categoryList[this.selectedChildIndex].sub_categories;
      let subArr = categoryList;
      // if (subArr) {
        // this.seoUrl
      let seoUrl = this.props?.route?.params?.isShowCategory == false ? "rental-packages" : categoryList[this.state.selectedInitialIndex].seourl;
      if (subArr && seoUrl) {
        if(this.props?.route?.params?.isShowCategory == false){
          seoUrl = "rental-packages";
        }else{
          seoUrl = seoUrl //subArr[this.selectedChildIndex].seourl;
        }
        
      } else {
        //seoUrl = categoryList[selectedParentIndex].seourl;
        if(this.props?.route?.params?.isShowCategory == false){
          seoUrl = "rental-packages";
        }else{
          seoUrl =  seoUrl //subArr[this.selectedChildIndex].seourl;
        }
      }
      console.log("home page daata :::",this.state.homeCategoryData)
      console.log(seoUrl, ':: seo url url');

      if (seoUrl) {
        let appUser = AppUser.getInstance();
        let cityID = appUser.selectedCityId;
        if (cityID == '') {
          AppToast('Please select City');
          return;
        }
        if (!isLoadMore) {
          
          this.props
            .hitGetProductListingApi(
              seoUrl,
              cityID,
              this.pageNumber,
              LOAD_DATA_COUNT,
              selectedSortType,
              selectedFilters,
            )
            .then(res => {
              this.props.onSaveProductListAction(res.data);
              this.setState({
                // productsList: res.data,
                isRefreshing: false,
                showLoading: false,
                next: true,
              });
            })
            .catch(err => {
              this.props.onSaveProductListAction([]);
              this.setState({
                isRefreshing: false,
                showLoading: false,
              });
              
            });
        } else {
          this.props
            .hitGetProductListingApi(
              seoUrl,
              cityID,
              this.pageNumber,
              LOAD_DATA_COUNT,
              selectedSortType,
              selectedFilters,
            )
            .then(
              res => {
                let allData = [...this.props.storeProductList, ...res.data];
                this.props.onSaveProductListAction(allData);
                this.setState({
                  // productsList: [...this.state.productsList, ...res.data],
                  showLoading: false,
                  next: res.data.length == LOAD_DATA_COUNT ? true : false,
                });
              },
              () => {},
            )
            .catch(err => {
              this.setState({
                showLoading: false,
              });
              console.log('Error while fetching product list', err);
            });
        }
      }

     
    } else {
      this.setState(
        {
          showLoading: false,
        },
        () => {
          this.props.onSaveProductListAction([]);
        },
      );
    }
  };

  isChildCategoryListEmpty = () => {
    const {storeProductList} = this.props;
    if (storeProductList.length > 0) return false;
    return true;
  };
  onPressSort = () => {
    if (this.isChildCategoryListEmpty()) {
      AppToast('No data found for sorting');
      return;
    }
    const {selectedSortType} = this.state;
    this.props.navigation.navigate('SortScreen', {
      sortType: selectedSortType,
      callback: this.onSelectedSortOption,
    });
  };
  getCurrentParentAndChildCategoryId = () => {
    var idArr = [];
    const {categoryList, selectedParentIndex} = this.state;
    if (categoryList && categoryList.length > 0) {
      idArr.push(categoryList[selectedParentIndex].id);
      let subArr = categoryList[selectedParentIndex].sub_categories;
      if (subArr) {
        idArr.push(subArr[this.selectedChildIndex].id);
      } else {
        idArr.push(null);
      }
    }
    return idArr;
  };
  onPressFilter = () => {
    if (this.isChildCategoryListEmpty()) {
      AppToast('No data found for filter');
      return;
    }
    let currId = this.getCurrentParentAndChildCategoryId();
    if (currId && currId.length == 2) {
      const {selectedFilters} = this.state;
      this.props.navigation.navigate('FilterScreen', {
        selectedfilters: selectedFilters,
        callback: this.onSelectedFilterOption,
        parentCategoryId: currId[0],
        childCategoryId: currId[1],
      });
    }
  };
  onSelectedFilterOption = filterObj => {
    this.setState(
      {
        selectedFilters: filterObj,
      },
      () => {
        this.pageNumber = 0;
        this.setState({
          showLoading: true,
        });
        this.getProductListing(false);
      },
    );
  };
  onSelectedSortOption = sortType => {
    this.setState(
      {
        selectedSortType: sortType,
      },
      () => {
        this.pageNumber = 0;
        this.setState({
          showLoading: true,
        });
        this.getProductListing(false);
      },
    );
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
)(CategoryScreen);
let loader = APILoadingHOC(container, [
  'CATEGORY_LISTING_API',
  'GET_PRODUCT_LISTING_API',
  'ADD_DELETE_WISHLIST_API',
]);

loader.getIntent = () => {
  return {
    routeName: CategoryScreen.ROUTE_NAME,
  };
};

export default loader;
