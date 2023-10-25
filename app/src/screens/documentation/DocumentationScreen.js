import React, {Component} from 'react';
import {View, Text, TouchableOpacity, FlatList, Image} from 'react-native';
import styles from './styles';
import HeaderWithProfile from '../../genriccomponents/header/HeaderWithProfilePic';
import resources from '../../../res';
import {KycViewModal} from '../modal/KycViewModal';
import StepIndicator from 'react-native-step-indicator';
import {connect} from 'react-redux';
import APILoadingHOC from '../../genriccomponents/HOCS/APILoadingHOC';
import {hitAllOrderApi} from '../../redux/actions/DocumentAction';
import {bindActionCreators} from 'redux';
import {customStyles} from '../../utility/Utils';
import {Icon} from 'native-base';
import Icons from 'react-native-vector-icons/MaterialIcons';

const CREDIT_SCORE_REQUIRE = 0;
const KYC_REQUIRE = 1;
const AUTO_PAYMENT_REQUIRE = 2;

//kyc status
const KYC_IN_PROGRESS = 1;
const KYC_COMPLETE = 2;
const DELIVERY_SECHUDULE = 3;
const DELIVERED = 4;

//kyc state
const CREDIT_SCORE_STATE = 0;
const KYC_STATE = 1;
const AUTO_PAYMENT_STATE = 2;
const KYC_DOCS_UNDER_REVIEW_STATE = 3;

class DocumentationScreen extends Component {
  static ROUTE_NAME = 'DocumentationScreen';
  constructor(props) {
    super(props);
    this.state = {
      currentPosition: 0,
      orderList: [],
      status: 0,

      kycOptionsVisible: null,
      selectedOrderItem: null,
    };
  }
  loadAllOrders = () => {
    this.props
      .hitAllOrderApi()
      .then(data => {
        let fetchOrder = data.data;
        this.setState({
          orderList: data.data,
        });
        if (fetchOrder.length == 1) {
          this.checkCredit(fetchOrder[0]);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  componentDidMount() {
    this.loadAllOrders();
  }
  onBackClick = () => {
    this.props.navigation.goBack();
  };
  renderHeader = () => {
    return (
      <HeaderWithProfile
        headerTitle={resources.strings.Documentation}
        isBackIconVisible={true}
        onBackClick={this.onBackClick}
        navigateProps={this.props.navigation}
        toRoute={'MyAccountScreen'}
      />
    );
  };
  renderStatus = () => {
    return (
      <StepIndicator
        customStyles={customStyles}
        currentPosition={this.state.currentPosition}
        renderStepIndicator={state => {
          return this.putTickIndicator(state);
        }}
        stepCount={4}
      />
    );
  };

  putTickIndicator = state => {
    switch (state.stepStatus) {
      case 'finished': {
        return (
          <Image
            source={resources.images.icn_document_done}
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
            source={resources.images.icn_document_pending}
            style={styles.iconStyle}
          />
        );
      }
      default:
    }
    return state;
  };
  currentScreenName = () => {
    return (
      <View style={styles.currentNameView}>
        <Text style={styles.currentNameText}>Select Your Order</Text>
      </View>
    );
  };
  checkCredit = item => {
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
        this.props.navigation.navigate('MyOrder');
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
  renderOrder = ({item, index}) => {
    return (
      <TouchableOpacity
        // disabled={item.kyc_status != 1 ? true : item.state > 2 ? true : false }
        // style={[styles.btnMain, (item.kyc_status != 1 ? {backgroundColor: 'rgba(239, 239, 239, 0.3)'} : item.state > 2 ? {backgroundColor: 'rgba(239, 239, 239, 0.3)'} : null)]}
        // onPress={() => this.checkCredit(item)}
        style={[styles.btnMain]}
        onPress={() => this.checkSelectedKycCredit(item)}>
        <View
          style={{flexDirection: 'column', justifyContent: 'space-between'}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.orderNumberText}>
              {resources.strings.ORDER_NO} :
            </Text>
            <Text style={styles.orderData}> {item.dealCodeNumber}</Text>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.orderNumberText}>
              {resources.strings.ORDER_DATE} :
            </Text>
            <Text style={styles.orderData}> {item.created}</Text>
          </View>
          {this.statusText(item)}
        </View>
        {item.kyc_status == 1 && item.state < 3 ? (
          <View>
            {/* <Image source={resources.images.inc_right_arrow} /> */}
            <Icons
              name="keyboard-arrow-right"
              size={18}
              color={resources.colors.labelColor}
            />
          </View>
        ) : (
          <View />
        )}
      </TouchableOpacity>
    );
  };
  statusText = item => {
    if (item.kyc_status == KYC_IN_PROGRESS) {
      if (item.state == CREDIT_SCORE_STATE) {
        return (
          <React.Fragment>
            <Text style={styles.pendingKycText}>
              {resources.strings.KYC_IN_PROGRESS}
            </Text>
            <Text style={styles.pendingText}>
              {resources.strings.CREDIT_SCORE_STATE}
            </Text>
          </React.Fragment>
        );
      } else if (item.state == KYC_STATE) {
        return (
          <React.Fragment>
            <Text style={styles.pendingKycText}>
              {resources.strings.KYC_IN_PROGRESS}
            </Text>
            <Text style={styles.pendingText}>
              {resources.strings.KYC_STATE}
            </Text>
          </React.Fragment>
        );
      } else if (item.state == AUTO_PAYMENT_STATE) {
        return (
          <React.Fragment>
            <Text style={styles.pendingKycText}>
              {resources.strings.KYC_IN_PROGRESS}
            </Text>
            <Text style={styles.pendingText}>
              {resources.strings.AUTO_PAYMENT_STATE}
            </Text>
          </React.Fragment>
        );
      } else if (item.state == KYC_DOCS_UNDER_REVIEW_STATE) {
        return (
          <React.Fragment>
            <Text style={styles.pendingKycText}>
              {resources.strings.KYC_IN_PROGRESS}
            </Text>
            <Text style={styles.pendingText}>
              {resources.strings.KYC_DOCS_UNDER_REVIEW_STATE}
            </Text>
          </React.Fragment>
        );
      } else {
        return (
          <React.Fragment>
            <Text style={styles.pendingKycText}>
              {resources.strings.KYC_IN_PROGRESS}
            </Text>
            <Text style={styles.pendingText}>
              {resources.strings.KYC_STATE}
            </Text>
          </React.Fragment>
        );
      }
    }
    if (item.kyc_status == KYC_COMPLETE) {
      return (
        <Text style={styles.doneText}>{resources.strings.KYC_COMPLETE}</Text>
      );
    }
    if (item.kyc_status == DELIVERY_SECHUDULE) {
      return (
        <Text style={styles.doneText}>
          {resources.strings.DELIVERY_SECHUDULE}
        </Text>
      );
    }
    if (item.kyc_status == DELIVERED) {
      return <Text style={styles.doneText}>{resources.strings.DELIVERED}</Text>;
    }
  };
  FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: resources.colors.sepratorWhite,
        }}
      />
    );
  };
  checkSelectedKycCredit = item => {
    if (item.state == CREDIT_SCORE_REQUIRE) {
      this.props.navigation.navigate('CreditScore', {
        orderId: item.dealCodeNumber,
        isUpfrontPayment: item.isUpfrontPayment ? item.isUpfrontPayment : false,
      });
    } else {
      this.setState({
        kycOptionsVisible: 'bottom',
        selectedOrderItem: item,
      });
    }
  };
  onPressBackDrop = () => {
    this.setState({
      kycOptionsVisible: null,
      selectedOrderItem: null,
    });
  };
  onClickPickType = type => {
    this.setState({
      kycOptionsVisible: null,
    });
    const {selectedOrderItem} = this.state;
    setTimeout(() => {
      switch (type) {
        case 'add_documents':
          // Go to Add Document
          console.log('add_documents', type);
          this.props.navigation.navigate('KycScreen', {
            orderId: selectedOrderItem.dealCodeNumber,
            creditScore: selectedOrderItem.credit_card_score,
            isUpfrontPayment: selectedOrderItem.isUpfrontPayment
              ? selectedOrderItem.isUpfrontPayment
              : false,
          });
          break;
        case 'edit_documents':
          // Go to Edit Document
          console.log('edit_documents', type);
          this.props.navigation.navigate('EditKycScreen', {
            orderId: selectedOrderItem.dealCodeNumber,
            creditScore: selectedOrderItem.credit_card_score,
            isUpfrontPayment: selectedOrderItem.isUpfrontPayment
              ? selectedOrderItem.isUpfrontPayment
              : false,
          });
          break;
        case 'autopay':
          // Go to Autopay:
          console.log('autopay', type);
          this.props.navigation.navigate('AutoPaymentScreen', {
            orderId: selectedOrderItem.dealCodeNumber,
          });
          break;
        default:
          break;
      }
    }, 500);
  };

  render() {
    const {orderList} = this.state;

    return (
      <View style={styles.fullScreen}>
        {this.renderHeader()}
        {this.currentScreenName()}
        <View>{this.renderStatus()}</View>
        {orderList.length != 0 ? (
          <View style={{flex: 1}}>
            <View style={styles.selectOrderView}>
              <Text style={styles.selectOrderText}>
                {resources.strings.Select_Order}
              </Text>
            </View>
            <FlatList
              data={orderList}
              renderItem={this.renderOrder}
              ItemSeparatorComponent={this.FlatListItemSeparator}
              bounces={false}
              // ListFooterComponent={this.renderFooter}
            />
            {this.state.kycOptionsVisible ? (
              <KycViewModal
                titlemodel={'Documentation'}
                descriptionModel={'Please select an option'}
                onClickPickType={this.onClickPickType}
                visibleModal={this.state.kycOptionsVisible}
                orderItem={this.state.selectedOrderItem}
                onPressBackDrop={this.onPressBackDrop}
              />
            ) : (
              <View />
            )}
          </View>
        ) : (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text>No data found</Text>
          </View>
        )}
      </View>
    );
  }
  // renderFooter = () => {
  //     return (
  //         <View style={{ height: 240 }} />
  //     )
  // }
}
const mapStateToProps = state => {
  return {};
};
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      hitAllOrderApi,
    },
    dispatch,
  );
}
let DocumentationContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DocumentationScreen);
let loader = APILoadingHOC(DocumentationContainer);
export default loader;
