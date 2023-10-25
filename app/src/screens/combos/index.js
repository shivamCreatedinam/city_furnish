import React,{Component} from 'react'
import {connect} from 'react-redux';
import {
    TouchableOpacity,
    StyleSheet,
    View,
    TextInput,
    Image,
    Text
} from 'react-native'
import resources from '../../../res'
import HeaderWithProfilePic from '../../genriccomponents/header/HeaderWithProfilePic'
import { ComboCategoryList } from '../category/subCategory/comboCategory/ComboCategoryList'
import * as actions from '../../redux/actions/CategoryListingAction';
import {
  hitGetFrpPlans,
  onSaveFrpProductListAction,
  getFrpFaqListApi,
  getFrpHowItsWorksListApi,
  getFrpFurnishingPlanListApi,
} from '../../redux/actions/FrpAction';


const COMBO_PRODUCT_TYPE = 1;
const LOAD_DATA_COUNT = 15;

class ExplorerCombos extends Component {
    

    constructor(props) {
        super(props);
        this.state = {
          categoryList: [],
          selectedParentIndex: 0,
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
        };
        this.selectedChildIndex = 0;
        this.categoryType = COMBO_PRODUCT_TYPE;
        this.subCategoryRef = React.createRef();
        this.parentCategoryRef = React.createRef();
        this.pageNumber = 0;
      }


      componentDidMount(){
        this.getProductListing(false)
      }

      getProductListing = isLoadMore => {
        
        const {
          categoryList,
          selectedParentIndex,
          selectedSortType,
          selectedFilters,
        } = this.state;
        if (categoryList && categoryList.length > 0) {
         
          
            let appUser = AppUser.getInstance();
            let cityID = appUser.selectedCityId;
            if (cityID == '') {
              AppToast('Please select City');
              return;
            }
            if (!isLoadMore) {
                console.log('mood')
              this.props
                .hitGetProductListingApi(
                  
                  cityID,
                  this.pageNumber,
                  LOAD_DATA_COUNT,
                  selectedSortType,
                  selectedFilters,
                )
                .then(res => {
                  
                  this.setState({
                    productsList: res.data,
                    isRefreshing: false,
                    showLoading: false,
                    next: true,
                  });
                })
                .catch(err => {
                  
                  this.setState({
                    isRefreshing: false,
                    showLoading: false,
                  });
                  console.log('Error while fetching product list', err);
                });
            } else {
                console.log('mood12')
              this.props
                .hitGetProductListingApi(
                  
                  cityID,
                  this.pageNumber,
                  LOAD_DATA_COUNT,
                  selectedSortType,
                  selectedFilters,
                )
                .then(
                  res => {
                    let allData = [...res.data];
                    
                    this.setState({
                       productsList: allData,
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
          
    
         
        } else {
          this.setState(
            {
              showLoading: false,
            },
            () => {
              
            },
          );
        }
      };  
    onPressBack = () => {
        props.navigation.goBack()
    }
    renderHeader = () => {
        return (
            <>
                <HeaderWithProfilePic 
                    isBackIconVisible={true}
                    onBackClick={this.onPressBack}
                />
            </>
        )
    }
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
   render(){
    return (
        <View style={[styles.container]}>
            {this.renderHeader()}
            

            <View style={styles.paddingClass}>
                <Text style={styles.titleText}>Combos</Text>
                {/* <ComboCategoryList
                    serverData={this.state.productsList}
                    onPressItem={this.onPressComboItem}
                    loadMoreData={this.handleLoadMore}
                    isRefreshing={this.state.isRefreshing}
                    onRefresh={this.onRefresh}
                /> */}
            </View>
        </View>

    )
   }
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
      
      hitGetFrpPlans,
      onSaveFrpProductListAction,
      
      getFrpFaqListApi,
      getFrpHowItsWorksListApi,
      getFrpFurnishingPlanListApi,
    },
  )(ExplorerCombos);

  
  export default ExplorerCombos;
  //export default ExplorerCombos

const styles = StyleSheet.create({
    container : {
        flex:1,

    },
    titleText:{
        color:'#222222',
        fontSize:24,
        fontFamily : resources.fonts.bold
    },
    paddingClass : {
        padding : 16
    }
})
