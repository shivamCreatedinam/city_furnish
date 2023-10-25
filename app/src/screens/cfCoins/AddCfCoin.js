import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity, FlatList} from 'react-native';
import HeaderWithProfile from '../../genriccomponents/header/HeaderWithProfilePic';
import resource from '../../../res';
import styles from './styles';
import MaterialInput from '../../genriccomponents/input/MaterialInput';
import {renderInputError} from '../../utility/Utils';
import Button from '../../genriccomponents/button/Button';
import PaymentService from '../../utility/PaymentService';
import {addCfCoinsApi} from '../../redux/actions/CFCoinsAction';
import {getHashForPayment} from '../../redux/actions/PaymentAction';

// import PayUBizSdk from 'payu-non-seam-less-react';
import {connect} from 'react-redux';
import AppUser from '../../utility/AppUser';
import APILoadingHOC from '../../genriccomponents/HOCS/APILoadingHOC';
import AppToast from '../../genriccomponents/appToast/AppToast';

const FAILURE = 'failed';
class AddCfCoins extends Component {
  static ROUTE_NAME = 'AddCfCoins';
  constructor(props) {
    super(props);
    this.callback =
      this.props.route.params && this.props.route.params.callback
        ? this.props.route.params.callback
        : null;
    this.state = {
      enteredAmount: '',
      error: {},
      selected: false,
      isSelected: -1,
      cardDetail: [
        {
          id: 0,
          cardIcon: resource.images.icn_card,
          cartTitle: resource.strings.CREDIT_CARD,
          isSelected: false,
          type: 'SI on CC',
        },
        {
          id: 1,
          cardIcon: resource.images.icn_netbanking,
          cartTitle: resource.strings.DEBIT_CARD,
          isSelected: false,
          type: 'SI on CC',
        },
        {
          id: 2,
          cardIcon: resource.images.icn_wallet,
          cartTitle: resource.strings.OTHER,
          isSelected: false,
          type: 'Online',
        },
      ],
    };
  }

  onBackClick = () => {
    this.props.navigation.goBack();
  };
  renderHeader = () => {
    return (
      <HeaderWithProfile
        headerTitle={resource.strings.cityfunishCoins}
        isBackIconVisible={true}
        navigateProps={this.props.navigation}
        onBackClick={this.onBackClick}
      />
    );
  };
  onChangeAmount = text => {
    this.setState({
      enteredAmount: text,
    });
  };

  addCoins = () => {
    const isValid = this.validate();
    if (!isValid) {
      return;
    }
    const {enteredAmount, cardDetail, isSelected} = this.state;
    let card = cardDetail[isSelected];
    this.props
      .addCfCoinsApi(enteredAmount, card.type)
      .then(resp => {
        this.getHashesFromServerAndConnectPayu(resp.data);
      })
      .catch(err => {
        console.log('Error while adding CF coins', err);
      });
  };

  checkedOrNot = index => {
    const {cardDetail} = this.state;
    let arr = cardDetail.filter(card => {
      if (card.id == index) {
        card.isSelected = true;
      } else {
        card.isSelected = false;
      }
      return card;
    });

    this.setState({
      isSelected: index,
      cardDetail: arr,
    });
  };

  renderListView = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.checkedOrNot(index);
        }}>
        <View style={[styles.rowFirection, styles.containerHeight]}>
          <View style={[styles.flex1, styles.rowFirection]}>
            <Image
              source={item.cardIcon}
              style={styles.iconStyle}
              resizeMode={'contain'}
            />
            <Text style={styles.cardNameStyle}>{item.cartTitle}</Text>
          </View>
          <View style={styles.imgContainer}>
            {this.state.isSelected != index ? (
              <Image
                source={resource.images.icn_roundCheck}
                style={styles.checkBox}
                resizeMode={'contain'}
              />
            ) : (
              <Image
                source={resource.images.icn_roundchecked}
                style={styles.checkBox}
                resizeMode={'contain'}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  callbackToRemoveError = key => {
    let {error} = this.state;
    if (error.hasOwnProperty(key)) {
      error[key] = '';
      this.setState({
        error: error,
      });
    }
  };
  render() {
    const {enteredAmount, error} = this.state;
    return (
      <View style={styles.fullScreen}>
        {this.renderHeader()}
        <View style={styles.mainContainer}>
          <MaterialInput
            label={resource.strings.enterAmount}
            value={enteredAmount}
            onChangeText={this.onChangeAmount}
            error={renderInputError('amount', error)}
            errorKey={'amount'}
            callbackToRemoveError={this.callbackToRemoveError}
            inputProps={{
              keyboardType: 'phone-pad',
              autoCaptialize: 'none',
              returnKeyType: 'done',
            }}
          />
          <FlatList
            style={{paddingHorizontal: 2}}
            showsVerticalScrollIndicator={false}
            data={this.state.cardDetail}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this.renderListView}
            bounces={false}
          />

          <View style={styles.buttonView}>
            <Button
              rounded
              btnText={resource.strings.ADD_COIN}
              onPress={() => this.addCoins()}
            />
          </View>
        </View>
      </View>
    );
  }

  getHashesFromServerAndConnectPayu = checkoutResp => {
    let finalAmount = checkoutResp.amount;
    let couponCodeToBeApplied = '';
    let appUser = AppUser.getInstance();
    let fullname = appUser.userDetails.full_name;
    let email = appUser.userDetails.email;
    this.props
      .getHashForPayment(
        finalAmount,
        fullname,
        email,
        checkoutResp.txnid,
        couponCodeToBeApplied,
      )
      .then(resp => {
        let data = {
          amount: finalAmount,
          txnId: checkoutResp.txnid,
          hashKey: resp.data.payment_source,
          merchantKey: resp.data.MERCHANT_KEY,
          address1: '',
          address2: '',
          city: '',
          offerKey: couponCodeToBeApplied,
          surl: checkoutResp.surl,
          furl: checkoutResp.furl,
        };
        let obj = new PaymentService(data);
        let parmas = obj.getParamsForPayu();
        let hashParams = obj.getAllHashesAsParam(resp.data);
        PayUBizSdk.makePayment(hashParams, parmas)
          .then(map => {
            this.onPayemntResponse(JSON.parse(map.payu_response));
          })
          .catch(error => {
            console.log('PayUBizSdk response', error.message);

            // go to cart screen if failure
            this.onPaymentFailure();
          });
      })
      .catch(err => {
        console.log('error while fetching hash from server', err);
      });
  };

  onPayemntResponse = payu_response => {
    if (payu_response.unmappedstatus == FAILURE) {
      this.onPaymentFailure();
    } else {
      // payment success
      this.onPaymentSuccess();
    }
  };
  onPaymentSuccess = () => {
    if (this.callback) {
      this.callback(true);
    }
    this.onBackClick();
  };

  onPaymentFailure = () => {
    AppToast('Error while payment');
    if (this.callback) {
      this.callback(false);
    }
    this.onBackClick();
  };

  validate = () => {
    const {enteredAmount, isSelected} = this.state;
    let errorObject = {};
    if (enteredAmount.trim() == '') {
      errorObject.amount = resource.strings.amountCannotBeEmpty;
    } else if (enteredAmount.trim() == 0) {
      errorObject.amount = resource.strings.conis1length;
    }
    if (isSelected == -1) {
      AppToast('Please select a card option');
    }

    this.setState({error: errorObject});
    return Object.keys(errorObject).length == 0;
  };
}

function mapStateToProps(state) {
  return {};
}
let container = connect(
  mapStateToProps,
  {
    addCfCoinsApi,
    getHashForPayment,
  },
)(AddCfCoins);

let loader = APILoadingHOC(container);
export default loader;
