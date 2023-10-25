import React, {Component, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Modal from 'react-native-modal';
import resources from '../../../../res';
import {
  enumCartActionType,
  enumOrderActionType,
  myHeight,
  wp,
} from '../../../utility/Utils';
import CancelOrderComponent from './CancelOrderComponent';
import UpgradeOrderComponent from './UpgradeOrderComponent';
import TransferOwernershipComponent from './TransferOwernershipComponent';
import AddressListComponent from '../../cart/components/AddressListComponent';
import AddAddressComponent from '../../cart/components/AddAddressComponent';
import CityShieldConfirmComponent from '../../cart/components/cityShieldConfirmComponent';
import ConfirmAddressComponent from '../../cart/components/ConfirmAddressComponent';

function BottomUpModal(props) {
  const {
    visibleModal,
    onPressBackDrop,
    modalType,
    data,
    events
  } = props;

  let renderView = null;
  let headerTitle = null
  let showCustomHeader = false
  switch (modalType) {
    case enumOrderActionType.cancellation: {
      renderView = <CancelOrderComponent {...{data, events}}/>;
      headerTitle = "Cancel order request"
      break;
    }
    case enumOrderActionType.upgrade: {
      renderView = <UpgradeOrderComponent {...{data, events}} />;
      headerTitle = "Upgrade order request"
      break;
    }
    case enumOrderActionType.transfer_ownership: {
      renderView = <TransferOwernershipComponent {...{data, events}} />;
      headerTitle = "Upgrade order request"
      break;
    }
    case enumCartActionType.address_list: {
      renderView = <AddressListComponent {...{data, events}}/>
      headerTitle = "Choose a delivery address"
      break
    }
    case enumCartActionType.add_address: {
      renderView = <AddAddressComponent {...{data, events}}/>
      headerTitle = "Add new address"
      break
    }
    case enumCartActionType.cityshield: {
      renderView = <CityShieldConfirmComponent {...{data, events}}/>
      headerTitle = ""
      showCustomHeader = true
      break
    }
    case enumCartActionType.confirm_address: {
      renderView = <ConfirmAddressComponent {...{data, events}}/>
      headerTitle = "Confirm address"
      break
    }
  }

  const renderHeader = () => {
    return (
      <>
        <TouchableOpacity
          onPress={() => {
            onPressBackDrop();
          }}
          style={styles.closeButton}>
          <Image
            source={require('../../../../res/images/productDetail/close.png')}
          />
        </TouchableOpacity>
        {
          !showCustomHeader &&
        <View style={styles.boxLayout}>
          <Text style={styles.headingText}>{headerTitle}</Text>
        </View>
        }
      </>
    );
  };

  return (
    <Modal
      avoidKeyboard
      animationOutTiming={0}
      onBackdropPress={() => onPressBackDrop()}
      onRequestClose={() => onPressBackDrop()}
      isVisible={visibleModal}
      style={styles.bottomModal}
      >
      <View
        style={{
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          alignItems: 'flex-start',
          marginHorizontal: 0,
          bottom: 0,
          backgroundColor: 'white',
          maxHeight: myHeight - 100
        }}>
        {renderHeader()}
        {renderView}
      </View>
    </Modal>
  );
}

export {BottomUpModal};

const styles = StyleSheet.create({
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  closeButton: {
    backgroundColor: 'white',
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -40,
    right: 16,
  },
  featureLabel: {
    fontFamily: 'Gill Sans',
    fontSize: 15,
    height: 25,
    marginHorizontal: 10,
    marginTop: 4,
    color: resources.colors.BLACK_TEXT,
    fontWeight: '500',
  },
  categoryLabel: {
    fontFamily: 'Gill Sans',
    fontSize: 15,
    alignSelf: 'center',
    color: resources.colors.BLACK_TEXT,
    fontWeight: '500',
  },
  boxLayout: {
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 5,
    marginHorizontal: wp(16),
    marginVertical: 15
  },
  boxBottom: {
    height: 2,
    width: '100%',
    backgroundColor: resources.colors.inputLabel,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 4,
  },
  productBox: {
    // flex: 1,
    height: 400,
    // marginHorizontal: 20,
    // marginBottom: 20,
  },
  subTitleText: {
    color: resources.colors.textBlack,
    fontFamily: resources.fonts.regular,
    fontSize: 14,
  },
  divider1: {
    height: 1,
    backgroundColor: '#EDEDEE',
    marginRight: 20,
  },
  headingText: {
    color: resources.colors.headingBlack,
    fontSize: wp(18),
    fontFamily: resources.fonts.bold,
    fontWeight: '600'
  },
});
