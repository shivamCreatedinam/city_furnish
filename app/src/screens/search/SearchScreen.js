import React, { Component } from 'react'
import { View, StatusBar, ActivityIndicator, Keyboard, Text, FlatList, Image, ScrollView, TouchableOpacity, Linking } from 'react-native'
import HeaderWithProfile from '../../genriccomponents/header/HeaderWithProfilePic'
import resources from '../../../res'
import styles from './styles'
import SearchBar from './views/SearchBar'
import * as actions from '../../redux/actions/SearchAction'
import { connect } from 'react-redux'
import { NormalCategoryList } from '../category/subCategory/normalCategory/NormalCategoryList'
import debounce from 'lodash.debounce'
import Rentfurniture from '../home/views/Rentfurniture'
import AsyncStorage from '@react-native-community/async-storage';
import AppUser from '../../utility/AppUser'
import events from '../../utility/Events'
const NORMAL_PRODUCT_TYPE = 0;
const COMBO_PRODUCT_TYPE = 1;
const FRP_PRODUCT_TYPE = 2;

class SearchScreen extends Component {
    static ROUTE_NAME = "SearchScreen";
    constructor(props) {
        super(props);
        let trendsSearch = null
        
        if(props.route.params.data.trendingSearchKeywords){
            trendsSearch = props.route.params.data.trendingSearchKeywords
        }
        this.state = {
            searchText: "",
            searchedData: [],
            isLoading: false,
            firstTimeSearch : false,
            trendingSearches : ['Single Bed','Sofa','Fridge','Table'],
            //recentSearch : ['bedroom','sofa','office chair']
            recentSearch : []
        }
        this.searchProductDebounce = debounce(this.hitSearchApi, 1000, { leading: true, trailing: false })
    }

    async componentDidMount() {
        this.props.navigation.addListener('focus', () => this.componentDidFocus())
        let value = await AsyncStorage.getItem('recentSearch');
        if (value !== null) {
            let dataSet = JSON.parse(value)
            console.log("dataSet ::",dataSet)
            this.setState({
                recentSearch : dataSet
            })
        }
    }


    componentDidFocus = async () => {
        // StatusBar.setBarStyle('dark-content');
        // StatusBar.setBackgroundColor(resources.colors.appColor);
       
    }


    renderHeader = () => {
        return (
            <HeaderWithProfile
                //headerTitle={resources.strings.SEARCH}
                headerTitle={""}
                isBackIconVisible={false}
                navigateProps={this.props.navigation}
                toRoute={"MyAccountScreen"}
            />
        )
    }
    renderSearchBar = () => {
        return (
            <SearchBar
                value={this.state.searchText}
                onSearchChangeText={this.onSearchChangeText}
                onSubmitEditing={this.onSubmitEditing}
                onClearSearch ={this.onClearSearch}
                
            />
        )
    }
    onSubmitEditing = () => {
        this.hitSearchApi();
    }

    hitSearchApi = () => {
        this.setState({
            isLoading: true
        })
        const { searchText } = this.state
        if (searchText != "")
            this.props.hitSearchProductFor(searchText)
            
                .then((data) => {
                    let dataSearch = []
                    dataSearch.push(searchText)
                    
                    this.setState({ recentSearch:this.state.recentSearch.concat(dataSearch) ,searchedData: data.data.product, isLoading: false,firstTimeSearch: data.data.product == "" ? true : false }, () => {
                        if (this.state.searchText == "") {
                            this.onClearSearch();
                        }
                        
                    })
                })
                .catch((err) => {
                    this.setState({
                        isLoading: false
                    })
                    console.log(err, "error in searched screen")
                })
    }
    onSearchChangeText = async (text) => {
        this.setState({
            searchText: text,
        }, async () => {
            if (text == "") {
                this.onClearSearch()
                return
            }
            if (text.trim().length > 2) {
                this.hitSearchApi();
                let dataSearch = []
                dataSearch.push(this.state.searchText)
                let searchData = this.state.recentSearch.concat(dataSearch)
                await AsyncStorage.setItem("recentSearch",JSON.stringify(searchData))
                // this.searchProductDebounce()
            }
        })
    }
    onClearSearch = () => {
        Keyboard.dismiss()
        this.setState({
            searchText: "",
            searchedData: [],
        })
    }
    render() {
        return (
            <View style={styles.fullScreen}>
                {this.renderHeader()}
                {this.renderSearchBar()}
                {this.state.isLoading && this.showLoader()}
                {
                    this.state.searchText != "" && this.state.searchedData == "" ?
                    <>

<ScrollView showsVerticalScrollIndicator={false}>
                    
                    <View style={{padding:16}}>
                        {
                            this.state.firstTimeSearch ? 
<View style={{marginTop : 12,marginBottom:12,marginLeft:10}}>
                            <Image source={resources.images.icon_nullsearch} style={{width:29,height:29}} />
                            <Text style={{fontFamily:resources.fonts.regular,fontSize:16,fontWeight:'500',marginTop:10,color:"#9A9AA2"}}>Oops! We don’t have any results for your query</Text>
                        </View>
                            : null
                        }
                        
                        {
                            this.state.recentSearch ?
<View>
                            <FlatList 
                                data={this.state.recentSearch}
                                numColumns={2}
                                ListHeaderComponent={() => {
                                    return (
                                        <>
                                        <Text style={{fontSize:18,fontWeight:'500',marginLeft:5,marginTop:10}}>{'Recent'}</Text>
                                        </>
                                    )
                                }}
                                renderItem={({item,index}) => {
                                    return(
                                        <TouchableOpacity onPress={() => this.onSearchChangeText(item)} style={styles.marginLeft}>
                                                <View style={styles.borderButtonView}>
                                                    <View style={{justifyContent:'center',marginLeft:8}}>
                                                        <Image source={require('../../../res/images/Image/icon.png')} />
                                                    </View>
                                                    <View style={styles.leftClass}>
                                                        <Text>{`${item}   `}</Text>
                                                    </View>
                                                </View>
                                        </TouchableOpacity>
                                    )
                                }}
                            />
                        </View>
                            : null
                        }
                        
                    </View>
                    <View style={{padding:16}}>
                        <Text style={{fontSize:18,fontWeight:'500',marginLeft:5,marginTop:10}}>{'Trending searches'}</Text>
                        <View>
                            <FlatList 
                                data={this.state.trendingSearches}
                                numColumns={2}
                                renderItem={({item,index}) => {
                                    return(
                                        <TouchableOpacity onPress={() => this.onSearchChangeText(item)} style={styles.marginLeft}>
                                            
                                                <View style={styles.borderButtonView}>
                                                    <View style={{justifyContent:'center',marginLeft:8}}>
                                                        <Image source={require('../../../res/images/Image/v6-icon.png')} />
                                                    </View>
                                                    <View style={styles.leftClass}>
                                                        <Text>{`${item}   `}</Text>
                                                    </View>
                                                </View>
                                        </TouchableOpacity>
                                    )
                                }}
                            />
                        </View>
                    </View>
                    <View style={{padding:6}}>
                        <Rentfurniture label={'Categories'} data={this.props.route.params.data}/>
                    </View>
                    </ScrollView>
                    </>

                    :

                    this.state.searchText != "" ?
                    <>
                        <FlatList 
                            data={this.state.searchedData}
                            //extraData={this.state}
                            renderItem={({item,index}) => {
                                
                                return(
                                    <View style={{padding:16}} key={index}>
                                        <TouchableOpacity style={{flexDirection:'row'}} onPress={() => this.onPressItem(item,item.is_frp)}>
                                            <View>
                                                <Image 
                                                    source={item.image ? { uri: item.image } : resources.images.img_placeholer_small}
                                                    style={styles.productThumb}
                                                />
                                            </View>
                                            <View style={{marginLeft:10,justifyContent:'center'}}>
                                            <Text numberOfLines={2} style={styles.font}>
                                                {item?.product_name}
                                            </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                )
                            }}
                        />
                    {/* <NormalCategoryList
                        isSearchItem={true}
                        customStyle={{ paddingVertical: 0 }}
                        serverData={this.state.searchedData}
                        onPressItem={this.onPressItem}
                        loadMoreData={this.handleLoadMore}
                        isRefreshing={false}
                        onRefresh={this.onRefresh}
                        onPressFav={this.onPressFav} />  */}
                        </>
                    : 
                    <ScrollView showsVerticalScrollIndicator={false}>
                    {
                            this.state.recentSearch != "" ?
<View>
                            <FlatList 
                                data={this.state.recentSearch}
                                numColumns={2}
                                ListHeaderComponent={() => {
                                    return (
                                        <View style={{padding:16}}>
                                        <Text style={{fontSize:18,fontWeight:'500',marginLeft:5,marginTop:10}}>{'Recent'}</Text>
                                        </View>
                                    )
                                }}
                                renderItem={({item,index}) => {
                                    return(
                                        <TouchableOpacity onPress={() => this.onSearchChangeText(item)} style={styles.marginLeft}>
                                                <View style={styles.borderButtonView}>
                                                    <View style={{justifyContent:'center',marginLeft:8}}>
                                                        <Image source={require('../../../res/images/Image/icon.png')} />
                                                    </View>
                                                    <View style={styles.leftClass}>
                                                        <Text>{`${item}   `}</Text>
                                                    </View>
                                                </View>
                                        </TouchableOpacity>
                                    )
                                }}
                            />
                        </View>
                            : null
                        }
                    <View style={{padding:16}}>
                        <Text style={{fontSize:18,fontWeight:'500',marginLeft:5,marginTop:10}}>{'Trending searches'}</Text>
                        <View>
                            <FlatList 
                                data={this.state.trendingSearches}
                                numColumns={2}
                                renderItem={({item,index}) => {
                                    return(
                                        <TouchableOpacity onPress={() => this.onSearchChangeText(item)} style={styles.marginLeft}>
                                            
                                                <View style={styles.borderButtonView}>
                                                    <View style={{justifyContent:'center',marginLeft:8}}>
                                                        <Image source={require('../../../res/images/Image/v6-icon.png')} />
                                                    </View>
                                                    <View style={styles.leftClass}>
                                                        <Text>{`${item}   `}</Text>
                                                    </View>
                                                </View>
                                        </TouchableOpacity>
                                    )
                                }}
                            />
                        </View>
                    </View>
                    <View style={{padding:0}}>
                        <Rentfurniture onPressItem={(data,index) => this.onPressCategory(data,index)} label={'Categories'} data={this.props.route.params.data}/>
                    </View>
                    </ScrollView>
                }
               
                
            </View>
        )
    }

    onPressCategory = (item,index) => {
        
        if (item.url) { 
          Linking.openURL(item.url)
            .then(data => {
              console.log('url open');
            })
            .catch(() => {
              console.log('Error while opening url');
            });
        } else {
          //    id = 27 home furniture
          let val = item.categoryType;
          let type =
            val == NORMAL_PRODUCT_TYPE
              ? NORMAL_PRODUCT_TYPE
              : val == COMBO_PRODUCT_TYPE
              ? COMBO_PRODUCT_TYPE
              : null;
          if (type == null) {
            AppToast('Something went wrong');
            return;
          }
          
          let event = AppUser.getInstance().emitterInst;
          let data = {
            categoryId: item.id,
            categoryTypeFromHome: type,
            categoryIndex : index,
            seoUrl : item.seourl,
            homePageIndex : 'home'
          };
          
          this.props.navigation.navigate('CategoryScreen');
          setTimeout(() => {
            event.emit(
              events.GOTO_PARTICULAR_CATEGORY_FROM_HOME,
              JSON.stringify(data),
            );
          }, 400);
        }
      };
    showLoader = () => {
        return (
            <View style={styles.containerLoaderStyle}>
                <ActivityIndicator size="large" color={resources.colors.appColor} />
            </View>
        )

    }

    handleLoadMore = () => { }
    onRefresh = () => { }
    onPressFav = (productId, key) => {

    }
    onPressItem = (data, is_frp) => {
        if (is_frp) {
            let intialSliderIndex = (data.tenure).length - 1
            this.props.navigation.navigate("FixedRentalScreen", {
                title: data.product_name,
                description: data.description ? data.description : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard",
                productId: data.id,
                pid: data.tenure[intialSliderIndex].pid,
                selectedSliderIndex: intialSliderIndex,
                tenure: data.tenure,
            })
        }
        else {
            this.props.navigation.navigate("ProductDetailScreen", { productId: data.id })
        }
    }
}

const mapStateToProps = (state) => {
    return {};
};
let container = connect(mapStateToProps, { ...actions, })(SearchScreen);

export default container;