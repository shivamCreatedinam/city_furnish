import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Modal from 'react-native-modal';
import resources from '../../../../../res';
import {
  enumDocumentModalType,
  isiPhoneX,
  myWidth,
} from '../../../../utility/Utils';
import Button from '../../../../genriccomponents/button/Button';
import styles1 from '../styles';

function DocumentViewModal(props) {
  const {
    visibleModal,
    onPressBackDrop,
    modalType,
    onItemPress,
    documentData,
    selectedIndex,
    headerTitle
  } = props;

  console.log(documentData)

  const renderHeader = () => {
    return (
      <>
        <TouchableOpacity
          onPress={() => {
            onPressBackDrop();
          }}
          style={styles.closeButton}>
          <Image
            source={require('../../../../../res/images/productDetail/close.png')}
          />
        </TouchableOpacity>
        <View style={styles.boxLayout}>
          <View
            style={{
              height: 1,
              width: '10%',
              backgroundColor: resources.colors.inputLabel,
            }}
          />
          <Text style={styles.headingText}>
            {headerTitle}
          </Text>
        </View>
      </>
    );
  };

  const renderDocumentView = props => {
    return (
      <View
        style={{
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          alignItems: 'flex-start',
          marginHorizontal: 0,
          bottom: 0,
          backgroundColor: 'white',
        }}>
        {renderHeader()}
        {documentData.map((item, index) => {
          return (
            <View key={'document_' + index} style={{marginHorizontal: 15}}>
              <TouchableOpacity
                onPress={() => onItemPress(index)}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: myWidth - 30,
                  marginVertical: 15,
                }}>
                <View>
                  <Text style={styles.subTitleText}>{item.title}</Text>
                </View>
                <View>
                  <Image
                    source={resources.images.splash_right}
                    style={{width: 20, height: 20}}
                  />
                </View>
              </TouchableOpacity>
              {documentData?.length - 1 !== index && (
                <View style={styles.divider1} />
              )}
            </View>
          );
        })}
        <View
          style={{height: 20, backgroundColor: resources.colors.inputLabel}}
        />
      </View>
    );
  };

  const renderTermsAndCondition = () => {

    const termsAndCondition = [
        "By continuing, you agree to allow Cityfurnish India Private Limited to fetch your credit report from CRIF High Mark for the purpose of KYC verification. This consent shall be valid for a period of 6 months.",
        "By clicking the 'Proceed' button, you agree to CRIF High Mark Credit Score Terms of Use.",
        "You understand that you shall have the option to opt out/unsubscribe from the service by clicking here. Fetching report from the credit bureau will not impact your credit score"
    ]
    return (
      <View
        style={{
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          alignItems: 'flex-start',
          marginHorizontal: 0,
          bottom: 0,
          backgroundColor: 'white',
        }}>
        {renderHeader()}
        <View>
            {
                termsAndCondition.map((item, index) => {
                    return (
                        <View style={{flexDirection: 'row', marginHorizontal: 30, marginBottom: 20}}>
                            <View style={{height: 10, width: 10, borderRadius: 5, backgroundColor: '#257B57',}} />
                            <Text style={{bottom: 5, marginLeft: 10, color: resources.colors.titleBlack, fontFamily: resources.fonts.regular, fontSize: 14, }}>{item}</Text>
                        </View>
                    )
                })
            }
        </View>
        <View style={[styles1.submitView, {width: myWidth-20, marginHorizontal: 10}]}>
          <Button
            rounded
            btnText={resources.strings.understood}
            onPress={onPressBackDrop}
            btnStyle={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20}}
            showRightIcon={true}
          />
        </View>
      </View>
    );
  };

  let renderView = null;
  switch (modalType) {
    case enumDocumentModalType.document: {
      renderView = renderDocumentView;
      break;
    }
    case enumDocumentModalType.terms_and_condition: {
      renderView = renderTermsAndCondition;
      break;
    }
  }

  return (
    <Modal
      avoidKeyboard
      animationOutTiming={0}
      onBackdropPress={() => onPressBackDrop()}
      onRequestClose={() => onPressBackDrop()}
      isVisible={visibleModal}
      style={styles.bottomModal}>
      {renderView()}
    </Modal>
  );
}

export {DocumentViewModal};

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
    margin: 16,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 5,
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
    fontSize: 24,
    fontFamily: resources.fonts.medium,
    marginBottom: 15,
  },
});
