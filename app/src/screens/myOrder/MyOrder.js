import React, {Component} from 'react';
import {View, Text, FlatList, TouchableOpacity, Image} from 'react-native';
import styles from './styles';
import HeaderWithProfile from '../../genriccomponents/header/HeaderWithProfilePic';
import resources from '../../../res';
import StepIndicator from 'react-native-step-indicator';
import {connect} from 'react-redux';
import APILoadingHOC from '../../genriccomponents/HOCS/APILoadingHOC';
import * as actions from '../../redux/actions/DocumentAction';
import { Card } from 'native-base';

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
  labelSize: 12,
  labelAlign: 'flex-start',
  labelFontFamily: resources.fonts.regular,
  currentStepLabelColor: resources.colors.grassGreen,
};

const CREDIT_SCORE_REQUIRE = 0;
const KYC_REQUIRE = 1;
const AUTO_PAYMENT_REQUIRE = 2;

class MyOrder extends Component {
  static ROUTE_NAME = 'MyOrder';
  constructor(props) {
    super(props);
    this.state = {
      myOrderList: [],
      status: false,
      currentPosition: 1,
      orderList: [],
    };
  }

  componentDidMount() {
    this.loadAllOrders();
  }
  loadAllOrders = () => {
    this.props
      .hitAllOrderApi()
      .then(data => {
        this.setState({
          orderList: data.data,
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  onBackClick = () => {
    this.props.navigation.goBack();
  };
  renderHeader = () => {
    return (
      <HeaderWithProfile
        headerTitle={resources.strings.MY_ORDER}
        isBackIconVisible
        navigateProps={this.props.navigation}
        onBackClick={this.onBackClick}
        toRoute={'MyAccountScreen'}
      />
    );
  };
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

  renderMyOrder = ({item, index}) => {
    let imagesArray = item?.images
    let getFileName = imagesArray?.split(",")
    let imageUrl = `https://d3juy0zp6vqec8.cloudfront.net/images/product/`
    
    return (
      <>
      <Card style={styles.cardStyle}>
        <View style={styles.row1}>
          <View>
            {
              <FlatList 
                data={getFileName}
                numColumns={2}
                renderItem={({img,index}) => {
                  return (
                    <>
                      <View style={{padding:3}}>
                        <Image style={{width:38,height:38,borderRadius:8}} source={{uri: `${imageUrl}${getFileName[index].trim()}`.replace(',','')}} />
                      </View>
                    </>
                  )
                }}
              />
              
            }
          </View>
        <View style={styles.leftHalfCon}>
          <View style={styles.subCon}>
            <View style={styles.heightView}>
              <Text>
                <Text style={styles.orderOption}>{'Order Id: '}</Text>
                <Text style={styles.orderData}>#{item.dealCodeNumber}</Text>
              </Text>
              
            </View>
             <View style={styles.heightView}>
              <Text style={styles.orderOption1}>{item.current_zoho_status}</Text>
              
            </View>
            {/* <View style={styles.heightView}>
              <Text style={styles.orderOption}>{'Order Date'}</Text>
              <Text style={styles.orderData}>{item.created}</Text>
            </View> */}
            {/* <View style={styles.heightView}>
              <Text style={styles.orderOption}>{'Payment Mode'}</Text>
              <Text style={styles.orderData}>{"NA"}</Text>
              <Text style={styles.orderData}>{item.current_payment_mode}</Text>
            </View> */}
          </View>
          {/* <View style={{width: 1}}>
            <Image
              source={resources.images.img_line}
              style={styles.verticalSep}
            />
          </View> */}
          {/* <View style={[styles.stepConStyle]}>
            {this.renderDeleveryStatus(item)}
          </View> */}
        </View>
        </View>
        
        
        <View style={styles.borderView}>
          <Text style={{color:'#DDDDDF'}}>------------------------------------------------------------------------------</Text>
        </View>
        <TouchableOpacity 
        onPress={() => this.viewOrder(item.dealCodeNumber,item)} 
        style={styles.row3}>
          
          <View>  
            <Text style={styles.priceText}>{`Total price: ₹${item.amount}`}</Text>
            <Text style={styles.orderData}>{`Ordered on: ${item.created}`}</Text>
          </View>

          <View style={{justifyContent:'center'}}>
            <Image source={resources.images.icn_profile_arrow}  style={styles.iconStyleArrow} />
          </View>
        </TouchableOpacity>   
        
      </Card>
      </>
    );
  };
  viewOrder = (orderId,item) => {
    this.props.navigation.navigate('ViewOrder', {
      orderId: orderId,
      orderData : item
    });
  };
  manageOrder = (orderId, item) => {
    this.props.navigation.navigate('ManageOrderScreen', {
      orderId: orderId,
      orderData : item
    });
  };
  changePaymentMode = orderId => {
    this.props.navigation.navigate('ChangePaymentMode', {
      orderId: orderId,
    });
  };
  KYCDocumentation = item => {
    if (item.state == CREDIT_SCORE_REQUIRE) {
      this.props.navigation.navigate('CreditScore', {
        orderId: item.dealCodeNumber,
        isUpfrontPayment: item.isUpfrontPayment ? item.isUpfrontPayment : false,
      });
    } else if (item.state == KYC_REQUIRE) {
      this.props.navigation.navigate('KycScreen', {
        orderId: item.dealCodeNumber,
        creditScore: item.credit_card_score,
        isUpfrontPayment: item.isUpfrontPayment ? item.isUpfrontPayment : false,
      });
    } else if (item.state == AUTO_PAYMENT_REQUIRE) {
      if (item.isUpfrontPayment) {
        this.props.navigation.navigate('DocumentationScreen');
      } else {
        this.props.navigation.navigate('AutoPaymentScreen', {
          orderId: item.dealCodeNumber,
        });
      }
    } else {
      this.props.navigation.navigate('KycScreen', {
        orderId: item.dealCodeNumber,
        creditScore: item.credit_card_score,
        isUpfrontPayment: item.isUpfrontPayment ? item.isUpfrontPayment : false,
      });
    }
  };
  FlatListItemSeparator = () => {
    return <View style={styles.separatorStyle} />;
  };
  renderEmptyScreen = () => {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Image source={resources.images.img_no_order_found} />
        <Text
          style={{
            textAlign: 'center',
            fontSize: 14,
            fontFamily: resources.fonts.regular,
          }}>
          {'No Order found'}
        </Text>
      </View>
    );
  };
  render() {
    const {orderList} = this.state;
    return (
      <View style={styles.fullScreen}>
        {this.renderHeader()}
        {orderList.length > 0 ? (
          <View style={styles.container}>
            <FlatList
              data={orderList}
              renderItem={this.renderMyOrder}
              //ItemSeparatorComponent={this.FlatListItemSeparator}
              renderSectionFooter={this.renderFooter}
            />
          </View>
        ) : (
          this.renderEmptyScreen()
        )}
      </View>
    );
  }
  renderFooter = () => {
    return <View style={{height: 35}} />;
  };
}

const mapStateToProps = state => {
  return {};
};
let container = connect(
  mapStateToProps,
  {...actions},
)(MyOrder);
let loader = APILoadingHOC(container);

loader.getIntent = () => {
  return {
    routeName: MyOrder.ROUTE_NAME,
  };
};
export default loader;
