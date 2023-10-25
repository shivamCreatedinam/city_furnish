import React, { Component } from 'react'
import { View, Text, FlatList, TouchableOpacity, ScrollView, ActivityIndicator, Image } from 'react-native'
import styles from './styles'
import HeaderWithProfile from '../../genriccomponents/header/HeaderWithProfilePic'
import resources from '../../../res'
import IncludedProductComponent from '../../genriccomponents/productView/includedProduct/IncludedProduct'
import { connect } from 'react-redux'
import * as actions from '../../redux/actions/OrderAction'
import ImageLoad from '../../genriccomponents/image/ImageLoad'
import StepIndicator from 'react-native-step-indicator'
import Support from '../home/views/Support'
import { PaymentSUmmaryModal } from './PaymentSummaryModal'
import { ShippimgAddressModal } from './ShippingAddressModal'

const customStyles = {
    stepIndicatorSize: 16,
    currentStepIndicatorSize: 16,
    separatorStrokeWidth: 3,
    currentStepStrokeWidth: 5,
    stepStrokeCurrentColor: resources.colors.grassGreen,
    separatorFinishedColor: resources.colors.grassGreen,
    separatorUnFinishedColor: 'transparent',
    stepIndicatorFinishedColor: resources.colors.grassGreen,
    stepIndicatorUnFinishedColor: '#aaaaaa',
    stepIndicatorCurrentColor: 'transparent',
    stepIndicatorLabelFontSize: 12,
    currentStepIndicatorLabelFontSize: 12,
    stepIndicatorLabelCurrentColor: resources.colors.grassGreen,
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: resources.colors.greyLight,
    labelColor: resources.colors.timerColor,
    labelSize: 15,
    labelAlign: 'flex-start',
    labelFontFamily: resources.fonts.regular,
    currentStepLabelColor: resources.colors.grassGreen,
  };

class ViewOrder extends Component {
    static ROUTE_NAME = "ViewOrder";
    constructor(props) {
        super(props);
        this.orderId = this.props.route.params && this.props.route.params.orderId ? this.props.route.params.orderId : ""
        this.state = {
            detailData: {},
            allSummery: false,
            isLoading: true,
            moreProduct: false,
            orderData: this.props.route.params && this.props.route.params.orderData ? this.props.route.params.orderData : "" ,
            paymentSUmmaryModal : false,
            shippingAddressModal : false
        }
        this.includedProductRef = React.createRef();
    }

    componentDidMount() {
        this.loadData()
    }

    loadData = () => {
        this.props.getViewOrderDetailApi(this.orderId)
            .then((data) => {
                console.log("getViewOrderDetailApi",data)
                this.setState({
                    detailData: data.data,
                    isLoading: false
                })
            })
            .catch((error) => {
                console.log("error", error)
            });
    }

    onBackClick = () => {
        this.props.navigation.goBack()
    }

    renderHeader = () => {
        return (
            <HeaderWithProfile
                headerTitle={resources.strings.VIEW_ORDER}
                isBackIconVisible={true}
                onBackClick={this.onBackClick}
                navigateProps={this.props.navigation}
                toRoute={"MyAccountScreen"}
            />
        )
    }

    renderDeleveryStatus = item => {
        return (
          <StepIndicator
            customStyles={customStyles}
            currentPosition={item.kyc_status - 1}
            direction="vertical"
            labels={item.all_zoho_status}
            renderStepIndicator={state => {
              return this.putTickIndicator(state);
            }}
            stepCount={item.all_zoho_status.length}
          />
        );
      };
      putTickIndicator = state => {
        switch (state.stepStatus) {
          case 'finished': {
            return (
              <Image
                source={resources.images.icn_done_status}
                style={styles.iconStyle}
              />
            );
          }
          case 'unfinished': {
            return (
              <Image
                source={resources.images.icn_process_status}
                style={styles.iconStyle}
              />
            );
          }
          case 'current': {
            return (
              <Image
                source={resources.images.icn_pending_status}
                style={styles.iconStyle}
              />
            );
          }
          default: {
            break;
          }
        }
        return state;
      };
    

    generalInforamtion = () => {
        const { detailData } = this.state;
        const { full_name, gst_number, order_date, order_id, company_name } = detailData
        return (
            <>
            <View style={[styles.row1,styles.paddingClass]}>
                <View>
                    <Text style={styles.titleText}>{`Thanks for choosing\nCityfurnish`}</Text>
                    <Text>
                        <Text style={styles.orderOption}>{'Order Id: '}</Text>
                        <Text style={styles.orderData}>#{this.orderId}</Text>
                    </Text>
                </View>
                <View>
                    <Image  source={resources.images.icn_profile_verified} style={{width:80,height:80}} />
                </View>
            </View>
            <View style={styles.paddingClass}>
                {this.renderDeleveryStatus(this.state.orderData)}
            </View>
            {/* this.orderId <View style={styles.generalContainer}>
                <View style={styles.generatInformation}>
                    <Text style={styles.nameStyle}>{full_name ? full_name : ""}</Text>
                    <Text style={styles.thankYou}>{"Thank you for your order."}</Text>
                    <View style={styles.dashStyle} />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 13 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.orderIdStyle}>{"Order Id :"}</Text>
                            <Text style={styles.orderDetails}>{order_id ? order_id : ""}</Text>
                        </View>
                        <View>
                            <Text style={styles.orderDetails}>{order_date ? order_date : ""}</Text>
                        </View>
                    </View>

                    {this.renderGSTnumber(gst_number)}
                    {this.renderGSTCompanyName(company_name)}
                </View>
            </View> */}
            </>
        )
    }

    renderGSTnumber = (gst_number) => {
        if (gst_number) {
            return (
                <View style={{ flexDirection: 'row', marginTop: 8 }}>
                    <Text style={styles.orderIdStyle}>{"GST Number :"}</Text>
                    <Text style={styles.orderDetails}>{gst_number ? gst_number : "NA"}</Text>
                </View>
            )
        } else {
            return <View />
        }

    }
    renderGSTCompanyName = (company_name) => {
        if (company_name) {
            return (
                <View style={{ flexDirection: 'row', marginTop: 8 }}>
                    <Text style={styles.orderIdStyle}>{"Company Name :"}</Text>
                    <Text style={styles.orderDetails}>{company_name ? company_name : "NA"}</Text>
                </View>
            )
        } else {
            return <View />
        }

    }

    renderProductCell = ({ item, index }) => {
        return (
            <React.Fragment>
                <View style={[styles.viewCard]}>
                    <View style={[styles.viewImageCard]}>
                        <ImageLoad
                            style={[styles.imageStyle]}
                            topLeftBorderRadius={6}
                            resizeMode="cover"
                            borderBottomLeftRadius={6}
                            customImagePlaceholderDefaultStyle={{ borderTopLeftRadius: 6, borderBottomLeftRadius: 6 }}
                            source={item.image ? { uri: item.image } : resources.images.img_placeholer_small}
                        />
                        <View style={styles.cardContainer}>
                            <View style={styles.titleContainer}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.titleName} ellipsizeMode={'tail'} numberOfLines={1}>{item.product_name ? item.product_name : ""}</Text>
                                </View>
                            </View>
                            <View style={styles.valuesContainer}>
                                <View>
                                    {/* <Text style={styles.subTitleName}>{"Quantity"}</Text>
                                    <Text style={styles.subTitleName}>{item.rental_freq ? item.rental_freq + " Rental" : ""}</Text> */}
                                    <Text style={styles.subTitleName}>{"Refundable Deposit"}</Text>
                                    {/* {item.is_frp ? <Text style={styles.subTitleName}>{item.rental_freq ? "Net " + item.rental_freq + " Rental" : ""}</Text> : <View />}
                                    {item.is_frp ? <Text style={styles.subTitleName}>{"Additional Rental"}</Text> : <View />} */}
                                    {item.is_frp ? <Text style={styles.subTitleName}>{"Included Items"}</Text> : <View />}
                                </View>
                                <View>
                                    {/* <Text style={styles.subTitleName}>{":"}</Text> */}
                                    <Text style={styles.subTitleName}>{":"}</Text>
                                    <Text style={styles.subTitleName}>{":"}</Text>
                                    {/* {item.is_frp ? <Text style={styles.subTitleName}>{":"}</Text> : <View />}
                                    {item.is_frp ? <Text style={styles.subTitleName}>{":"}</Text> : <View />} */}
                                    {item.is_frp ? <Text style={styles.subTitleName}>{":"}</Text> : <View />}
                                </View>
                                <View style={{ marginRight: 0 }}>
                                    {/* <Text style={styles.subTitleName}>{item.quantity ? item.quantity : "0"} {"item"}</Text> */}
                                    <Text style={styles.subTitleName}>₹ {item.price ? item.price : "0"}</Text>
                                    <Text style={styles.subTitleName}>₹ {item.product_shipping_cost ? item.product_shipping_cost : "0"}</Text>
                                    {/* {item.is_frp ? <Text style={styles.subTitleName}>₹ {item.net_rent ? item.net_rent : ""}</Text> : <View />}
                                    {item.is_frp ? <Text style={styles.subTitleName}>₹ {item.upgrades_rent ? item.upgrades_rent : ""}</Text> : <View />} */}
                                    {item.is_frp ? <Text style={styles.subTitleName}>{item.included_items.length ? item.included_items.length : ""}</Text> : <View />}
                                </View>
                            </View>
                        </View>
                    </View>
                    {item.is_frp && "included_items" in item && item.included_items.length > 0 && <View style={[styles.includedItemsBox]}>  
                        <Text style={styles.summerText}>{item.included_items.length} Item(s) Included</Text>
                        <IncludedProductComponent
                            reference={this.includedProductRef}
                            data={item.included_items}
                            startingPosition={1}
                        />
                    </View>}
                </View>
            </React.Fragment>
        )
    }

    render3ProductCell = ({ item, index }) => {
        
        if (index <= 2)
            return (
                <React.Fragment>
                    <View style={[styles.viewCard]}>
                        <View style={[styles.viewImageCard]}>
                            <ImageLoad
                                style={item.is_frp ? styles.frpImageStyle : styles.imageStyle}
                                topLeftBorderRadius={6}
                                resizeMode="cover"
                                borderBottomLeftRadius={6}
                                customImagePlaceholderDefaultStyle={{ borderTopLeftRadius: 6, borderBottomLeftRadius: 6 }}
                                source={item.image ? { uri: item.image } : resources.images.img_placeholer_small}
                            />
                            <View style={styles.cardContainer}>
                                <View style={styles.titleContainer}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.titleName1} ellipsizeMode={'tail'} numberOfLines={1}>
                                            <Text style={styles.titleName}>{item.quantity ? item.quantity : "NA"}{" x "}</Text>
                                            {`${item.product_name}`}
                                        </Text>
                                    </View>
                                </View>
                                <View>
                                    <Text>
                                        <Text style={styles.subTitleName}>{item.rental_freq ? item.rental_freq + " Rental" : ""}</Text>
                                        <Text style={styles.subTitleName}>{": "}</Text>
                                        <Text style={styles.subTitleName}>₹ {item.price ? item.price : "0"}</Text>
                                    </Text>
                                    <Text>
                                        <Text style={styles.subTitleName}>{"Refundable Deposit"}</Text>
                                        <Text style={styles.subTitleName}>{": "}</Text>
                                        <Text style={styles.subTitleName}>₹ {item.net_rent ? item.net_rent : "0"}</Text>
                                    </Text>
                                </View>
                                {/* <View style={styles.valuesContainer}>
                                    <View>
                                        <Text style={styles.subTitleName}>{"Quantity"}</Text>
                                        <Text style={styles.subTitleName}>{item.rental_freq ? item.rental_freq + " Rental" : ""}</Text>
                                        <Text style={styles.subTitleName}>{"Refundable Deposit"}</Text>
                                        {item.is_frp ? <Text style={styles.subTitleName}>{item.rental_freq ? "Net " + item.rental_freq + " Rental" : ""}</Text> : <View />}
                                        {item.is_frp ? <Text style={styles.subTitleName}>{"Additional Rental"}</Text> : <View />}
                                        {item.is_frp ? <Text style={styles.subTitleName}>{"Included Items"}</Text> : <View />}
                                    </View>
                                    <View style={{marginRight:40}}>
                                        <Text style={styles.subTitleName}>{":"}</Text>
                                        <Text style={styles.subTitleName}>{":"}</Text>
                                        <Text style={styles.subTitleName}>{":"}</Text>
                                        {item.is_frp ? <Text style={styles.subTitleName}>{":"}</Text> : <View />}
                                        {item.is_frp ? <Text style={styles.subTitleName}>{":"}</Text> : <View />}
                                        {item.is_frp ? <Text style={styles.subTitleName}>{":"}</Text> : <View />}
                                    </View>
                                    <View style={{ marginRight: 150 }}>
                                        <Text style={styles.subTitleName}>{item.quantity ? item.quantity : "NA"} {"item"}</Text>
                                        <Text style={styles.subTitleName}>₹ {item.price ? item.price : "0"}</Text>
                                        <Text style={styles.subTitleName}>₹ {item.product_shipping_cost ? item.product_shipping_cost : "0"}</Text>
                                        {item.is_frp ? <Text style={styles.subTitleName}>₹ {item.net_rent ? item.net_rent : ""}</Text> : <View />}
                                        {item.is_frp ? <Text style={styles.subTitleName}>₹ {item.upgrades_rent ? item.upgrades_rent : ""}</Text> : <View />}
                                        {item.is_frp ? <Text style={styles.subTitleName}>{item.included_items.length ? item.included_items.length : ""}</Text> : <View />}
                                    </View>
                                </View> */}
                            </View>
                        </View>
                        {item.is_frp && "included_items" in item && item.included_items.length > 0 && <View style={[styles.includedItemsBox]}>  
                            <Text style={styles.summerText}>{item.included_items.length} Item(s) Included</Text>
                            <IncludedProductComponent
                                reference={this.includedProductRef}
                                data={item.included_items}
                                startingPosition={1}
                            />
                        </View>}
                    </View>
                </React.Fragment>
            )
    }
    orderSummery = () => {
        const { allSummery, detailData, moreProduct } = this.state
        const { products } = detailData
        return (
            <View style={styles.summerContainer}>
                <FlatList
                    data={products}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={allSummery ? this.renderProductCell : this.render3ProductCell}
                    showsVerticalScrollIndicator={false}
                />
                {
                    products && products.length > 3 ?
                        <TouchableOpacity style={styles.moreSummery} onPress={() => this.allSummery()}>
                            {
                                moreProduct ? <View /> : <Text style={styles.viewMoreText}>View {products.length - 3} More</Text>
                            }
                        </TouchableOpacity> : <View />
                }
            </View>
        )
    }
    allSummery = () => {
        this.setState({
            allSummery: true,
            moreProduct: true

        })
    }
    shoppingDetails = () => {
        const { detailData } = this.state;
        const { full_name, shipping_address } = detailData
        return (
            <View style={styles.imageThumbnail}>
                <View style={styles.cell}>
                    <View style={styles.cellStyle}>
                        <Text style={styles.userNameText}>{full_name}</Text>
                        <Text style={styles.fontStyle}>{shipping_address}</Text>
                        <Text style={styles.defaultTxt}>{"Default"}</Text>
                    </View>
                </View>
            </View>
        )
    }
    orderDetails = () => {
        const { detailData } = this.state;
        const { duration, delivery, grand_total, total_deposite, total_gst, discount_amount, total_renntal, coins_redeemed, products,
            is_upfront, savings, saving_percent, monthly_renntal, advance_renntal,shipping_address,order_date } = detailData

          
        return (
            <>

            <TouchableOpacity onPress={() => this.setState({
                            paymentSUmmaryModal : true
                        })} style={[styles.row1,styles.marginTop]}>
               <View style={styles.flexDirection}>
                    <View>
                        <Image source={resources.images.icn_amountPaid} style={styles.iconOrder} />
                    </View>
                    <View style={styles.leftClass}>
                        <Text style={styles.detailText}>Amount Paid</Text>
                        <Text style={styles.subText}>₹{grand_total}</Text>
                    </View>
                
                </View>
                
                <View style={{justifyContent:'center'}}>
                            <Image source={resources.images.icn_profile_arrow}  style={styles.iconStyleArrow} />
                        </View>
            </TouchableOpacity> 
            <View style={styles.borderClass} />   
            <TouchableOpacity 
            onPress={() => this.setState({
                shippingAddressModal : true
            })}
            style={[styles.row1]}>
               <View style={styles.flexDirection}>
                    <View>
                        <Image source={resources.images.icn_shipping} style={styles.iconOrder} />
                    </View>
                    <View style={styles.leftClass}>
                        <Text style={styles.detailText}>Shipping address</Text>
                        <Text numberOfLines={1} style={[styles.subText,{width:250}]}>{shipping_address}</Text>
                    </View>
                
                </View>
                
                <View style={{justifyContent:'center'}}>
                            <Image source={resources.images.icn_profile_arrow}  style={styles.iconStyleArrow} />
                        </View>
            </TouchableOpacity> 
            <View style={styles.borderClass} />  
            <View style={[styles.row1]}>
               <View style={styles.flexDirection}>
                    <View>
                        <Image source={resources.images.icn_rent} style={styles.iconOrder} />
                    </View>
                    <View style={styles.leftClass}>
                        <Text style={styles.detailText}>Rental duration</Text>
                        <Text numberOfLines={1} style={[styles.subText,{width:250}]}>{duration}</Text>
                    </View>
                
                </View>
                
                <View style={{justifyContent:'center'}}>
                            <Image source={resources.images.icn_profile_arrow}  style={styles.iconStyleArrow} />
                        </View>
            </View> 
            <View style={styles.borderClass} />  
            <View style={[styles.row1]}>
               <View style={styles.flexDirection}>
                    <View>
                        <Image source={resources.images.icn_order} style={styles.iconOrder} />
                    </View>
                    <View style={styles.leftClass}>
                        <Text style={styles.detailText}>Ordered on</Text>
                        <Text numberOfLines={1} style={[styles.subText,{width:250}]}>{order_date}</Text>
                    </View>
                
                </View>
                
                <View style={{justifyContent:'center'}}>
                            <Image source={resources.images.icn_profile_arrow}  style={styles.iconStyleArrow} />
                        </View>
            </View> 
            <View style={styles.borderClass} />   
            {/* <View style={styles.detailCard}>
                {is_upfront ? <View style={styles.orderCardContainer}>
                    <View style={[styles.orderContainer, { flex: 1, borderWidth: 0 }]}>
                        <View>
                            <Text style={styles.orderPropText}>{"Duration"}</Text>
                            <Text style={styles.orderPropText}>{"Total Rental (₹"}{monthly_renntal}{'*'}{`${duration.replace(" Months","")})`}</Text>
                            <Text style={[styles.orderPropText, { color: resources.colors.green }]}>{"Savings"} <Text style={styles.orderPropOffText}>{` (${saving_percent} OFF) `}</Text></Text>
                            <Text style={styles.orderPropText}>{products.length > 0 ? products[0].rental_freq + " Rental" : ""}</Text>
                            <Text style={styles.orderPropText}>{"Refundable Deposit"}</Text>
                            <Text style={styles.orderPropText}>{"GST (18%)"}</Text>
                            <Text style={styles.orderPropText}>{"Coin Redeemed"}</Text>
                            <Text style={styles.orderPropText}>{"Delivery"}</Text>
                        </View>
                        <View>
                            <Text style={styles.orderValuesText}>{":"}</Text>
                            <Text style={styles.orderValuesText}>{":"}</Text>
                            <Text style={styles.orderValuesText}>{":"}</Text>
                            <Text style={styles.orderValuesText}>{":"}</Text>
                            <Text style={styles.orderValuesText}>{":"}</Text>
                            <Text style={styles.orderValuesText}>{":"}</Text>
                            <Text style={styles.orderValuesText}>{":"}</Text>
                        </View>
                        <View>
                            <Text style={styles.orderValuesText}>{duration ? duration : "NA"}</Text>
                            <Text style={styles.orderValuesText}>₹ {total_renntal ? total_renntal : "NA"} /-</Text>
                            <Text style={styles.orderValuesText}>₹ {savings ? savings : "NA"} /-</Text>
                            <Text style={styles.orderValuesText}>₹ {advance_renntal ? advance_renntal : total_renntal} /-</Text>
                            <Text style={styles.orderValuesText}>₹ {total_deposite ? total_deposite : "NA"} /-</Text>
                            <Text style={styles.orderValuesText}>₹ {total_gst ? total_gst : "0"} /-</Text>
                            <Text style={styles.orderValuesText}>{coins_redeemed && parseInt(coins_redeemed) == 0 ? " " : "( - )"} ₹ {coins_redeemed ? coins_redeemed : "0"} /-</Text>
                            <Text style={styles.orderValuesText}>{delivery ? delivery : "NA"}</Text>
                        </View>

                    </View>
                    
                    <View style={styles.totalContainer}>
                        <Text style={[styles.totalTextStyle, { width: '56%' }]}>{"Total"}</Text>
                        <Text style={[styles.totalTextStyle, { width: '3%' }]}>{":"}</Text>
                        <Text style={[styles.totalTextStyle, { fontSize: 14, width: '41%', textAlign: 'right' }]}>₹ {grand_total ? grand_total : "0"}</Text>
                    </View>
                    

                    </View> : 
                    <View style={styles.orderCardContainer}>
                        <View style={[styles.orderContainer, { flex: 1, borderWidth: 0 }]}>
                            <View>
                                <Text style={styles.orderPropText}>{"Duration"}</Text>
                                <Text style={styles.orderPropText}>{products.length > 0 ? products[0].rental_freq + " Rental" : ""}</Text>
                                <Text style={styles.orderPropText}>{"Refundable Amount"}</Text>
                                {'savings' in detailData && <Text style={[styles.orderPropText, { color: resources.colors.green }]}>{"Savings"} <Text style={styles.orderPropOffText}>{` (${saving_percent} OFF) `}</Text></Text>}
                                <Text style={styles.orderPropText}>{"GST (18%)"}</Text>
                                <Text style={styles.orderPropText}>{"Coin Redeemed"}</Text>
                                <Text style={styles.orderPropText}>{"Discount"}</Text>
                                <Text style={styles.orderPropText}>{"Delivery"}</Text>
                            </View>
                            <View>
                                <Text style={styles.orderValuesText}>{":"}</Text>
                                <Text style={styles.orderValuesText}>{":"}</Text>
                                <Text style={styles.orderValuesText}>{":"}</Text>
                                {'savings' in detailData && <Text style={styles.orderValuesText}>{":"}</Text>}
                                <Text style={styles.orderValuesText}>{":"}</Text>
                                <Text style={styles.orderValuesText}>{":"}</Text>
                                <Text style={styles.orderValuesText}>{":"}</Text>
                                <Text style={styles.orderValuesText}>{":"}</Text>
                            </View>
                            <View>
                                <Text style={styles.orderValuesText}>{duration ? duration : "NA"}</Text>
                                <Text style={styles.orderValuesText}>₹ {total_renntal ? total_renntal : "NA"} /-</Text>
                                <Text style={styles.orderValuesText}>₹ {total_deposite ? total_deposite : "NA"} /-</Text>
                                {'savings' in detailData && <Text style={[styles.orderValuesText, {color: 'green'}]}>- ₹ {savings ? savings : "0"} /-</Text>}
                                <Text style={styles.orderValuesText}>₹ {total_gst ? total_gst : "0"} /-</Text>
                                <Text style={styles.orderValuesText}>{coins_redeemed && parseInt(coins_redeemed) == 0 ? " " : "( - )"} - ₹ {coins_redeemed ? coins_redeemed : "0"} /-</Text>
                                <Text style={styles.orderValuesText}>{discount_amount && parseInt(discount_amount) == 0 ? " " : "( - )"} - ₹ {discount_amount ? discount_amount : "0"} /-</Text>
                                <Text style={styles.orderValuesText}>{delivery ? delivery : "NA"}</Text>
                            </View>

                        </View>
                        
                        <View style={styles.totalContainer}>
                            <Text style={[styles.totalTextStyle, { width: '56%' }]}>{"Total"}</Text>
                            <Text style={[styles.totalTextStyle, { width: '3%' }]}>{":"}</Text>
                            <Text style={[styles.totalTextStyle, { fontSize: 14, width: '41%', textAlign: 'right' }]}>₹ {grand_total ? grand_total : "0"}</Text>
                        </View>
                        

                    </View>
                }
            </View> */}
            </>
        )
    }
    ActivityIndicatorLoadingView() {
        return (
            <ActivityIndicator
                color={resources.colors.appColor}
                size='large'
                style={styles.ActivityIndicatorStyle}
            />
        );
    }

    manageOrder = () => {
        console.log(this.orderId, JSON.stringify(this.state.detailData))
        this.props.navigation.navigate('ManageOrderScreen', {
          orderId: this.orderId,
          orderData : this.state.detailData
        });
    };

    render() {
        return (
            <View style={styles.fullScreen}>
                {this.renderHeader()}
                {this.state.isLoading ? this.ActivityIndicatorLoadingView() : <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    {this.generalInforamtion()}
                    <Text style={styles.summerText}>{resources.strings.ORDER_SUMMERY}</Text>
                    {this.orderSummery()}
                    {/* <Text style={styles.summerText}>{resources.strings.SHOPPING_DETAILS}</Text> */}
                    {/* {this.shoppingDetails()} */}
                    <Text style={styles.summerText}>{resources.strings.ORDER_DETAIL}</Text>
                    <View style={styles.container}>
                        {this.orderDetails()}
                    </View>

                    <View style={styles.marginTop}>
                        <Support handleOnPress={this.manageOrder}/>
                    </View>
                </ScrollView>}
                {
                    this.state.paymentSUmmaryModal ?
                    <PaymentSUmmaryModal 
                        visibleModal={this.state.paymentSUmmaryModal}
                        titlemodel={'Payment Summary'}
                        onPressBackDrop={() => this.setState({
                            paymentSUmmaryModal : false
                        })}
                       data={this.state.detailData}
                    />
                    : null
                }
                {
                    this.state.shippingAddressModal ?
                    <ShippimgAddressModal 
                        visibleModal={this.state.shippingAddressModal}
                        titlemodel={'Shipping address'}
                        onPressBackDrop={() => this.setState({
                            shippingAddressModal : false
                        })}
                       data={this.state.detailData}
                       orderData={this.state.orderData}
                    />
                    : null
                }
            </View>
        )
    }
}
const mapStateToProps = (state) => {
    return {};
};
let container = connect(mapStateToProps, { ...actions })(ViewOrder);
export default container;