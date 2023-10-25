import {StyleSheet} from 'react-native';
import resources from '../../../res';
import {myWidth, wp} from '../../utility/Utils';

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: resources.colors.white,
  },
  container: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 10,
  },
  submitBtn: {
    marginHorizontal: 20,
    marginVertical: 30,
  },
  minimuLabel: {
    backgroundColor: 'white',
    alignSelf: 'flex-end',
    fontFamily: resources.fonts.regular,
    fontSize: 13,
    color: resources.colors.labelColor,
  },
  attachmentLabel: {
    backgroundColor: 'white',
    alignSelf: 'flex-start',
    fontFamily: resources.fonts.regular,
    fontSize: 16,
    color: resources.colors.labelColor,
    fontFamily: resources.fonts.bold,
  },
  textStyle: {
    color: resources.colors.blueText,
    fontFamily: resources.fonts.regular,
  },
  lableStyle: {
    color: resources.colors.labelColor,
    fontFamily: resources.fonts.regular,
    fontFamily: resources.fonts.bold,
  },
  multiCheckboxLableStyle: {
    color: resources.colors.labelColor,
    fontFamily: resources.fonts.regular,
    // fontFamily: resources.fonts.bold,
    marginBottom: 2,
  },
  orderHeading: {
    color: resources.colors.black,
    fontFamily: resources.fonts.medium,
    fontSize: 12.5,
    textAlign: 'center',
  },
  listDataStyle: {
    color: resources.colors.labelColor,
    fontFamily: resources.fonts.medium,
    fontSize: 12,
    textAlign: 'center',
    margin: 5,
  },
  uploadAreaView: {
    borderColor: resources.colors.labelColor,
    borderStyle: 'dashed',
    borderWidth: 1,
    height: 121,
    borderRadius: 6,
    marginTop: 7,

    // flex:1,

    // backgroundColor:'red',
    //  width:335
  },
  backGroundImage: {
    height: 119,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    borderRadius: 10,
  },
  docView: {
    flex: 1,
    width: '100%',
    borderRadius: 6,
  },
  chooseFileText: {
    fontFamily: resources.fonts.bold,
    fontSize: 16,
    color: resources.colors.darkSkyBlue,
  },
  max10MbText: {
    fontFamily: resources.fonts.bold,
    fontSize: 10,
    color: resources.colors.warmGrey,
  },
  chooseFile: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  txtHeading: {
    fontSize: 24,
    fontFamily: resources.fonts.medium,
    color: resources.colors.titleBlack,
  },
  orderContainer: {
    borderWidth: 1,
    borderColor: resources.colors.gray,
    backgroundColor: resources.colors.white,
    borderRadius: 12,
    marginTop: 20,
    paddingBottom: 20,
  },
  txtOrderNo: {
    margin: 20,
    color: resources.colors.labelColor,
    fontFamily: resources.fonts.regular,
    fontSize: 14,
  },
  productView: {
    marginLeft: 15,
  },
  imgProduct: {
    height: 100,
    width: 100,
    borderRadius: 10,
  },
  txtProductName: {
    fontSize: 12,
    fontFamily: resources.fonts.medium,
    color: resources.colors.labelColor,
  },
  txtProductNumber: {
    marginTop: 5,
    fontSize: 12,
    fontFamily: resources.fonts.medium,
    color: resources.colors.gray_9A9AA2,
    flex: 1,
  },
  actionContainer: {
    marginTop: 20,
  },
  actionView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  leftIcon: {
    height: 30,
    width: 30,
    marginRight: 10,
    tintColor: resources.colors.black,
  },
  rightIcon: {
    height: 20,
    width: 20,
    marginRight: 10,
    tintColor: resources.colors.black,
  },
  divider: {
    height: 1,
    width: myWidth - 40,
    backgroundColor: resources.colors.gray,
  },
  txtAction: {
    fontFamily: resources.fonts.medium,
    fontSize: 14,
    color: resources.colors.titleBlack,
    fontWeight: '600',
    bottom: 1,
  },
  dropDown: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderColor: resources.colors.borderDot,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imgDropDown: {
    height: 10,
    width: 10,
  },
  subComponentContainer: {
    width: myWidth - 40,
    marginHorizontal: 20,
    paddingBottom: 20,
    marginBottom: 20,
  },
  btnSubmit: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  upgradeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkBoxTextContaner: {
    marginLeft: 12,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imgCheckbox: {
    height: 25,
    width: 25,
  },
  imgUpgradeProduct: {
    height: 40,
    width: 40,
    borderRadius: 4,
  },
  txtUpgradeCheckboxName: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    fontFamily: resources.fonts.medium,
    color: resources.colors.labelColor,
  },
  txtUpgradeHeading: {
    fontSize: 14,
    fontFamily: resources.fonts.medium,
    color: resources.colors.labelColor,
    marginBottom: 15,
  },
  orderCompleteContainer: {
    flex: 1,
    backgroundColor: resources.colors.white,
    justifyContent: 'center'
  },
  ocActionButtonContianer:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    width: '100%',
    borderTopColor: 'rgba(10,36,99,0.1)',
    alignItems: 'center',
    height: 80,
    backgroundColor: resources.colors.white,
    position: 'absolute',
    bottom: 0,
    zIndex: 9999,
  },
  btnOCActionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    width: myWidth - 32,
    marginHorizontal: wp(16)
  },
  imgSuccessOC: {
      height: wp(120),
      width: wp(120),
  },
  txtOCtitle: {
    fontFamily: resources.fonts.medium,
    fontWeight: '600',
    fontSize: wp(24),
    color: resources.colors.titleBlack,
    marginTop: wp(12)
  },
  ocDetailContainer: {
    marginTop: wp(25),
  },
  txtNextStepForYou: {
    fontFamily: resources.fonts.medium,
    fontSize: wp(16),
    fontWeight: '500',
    color: resources.colors.grayColor,
    marginBottom: wp(5)
  },
  dotView: {
    height: 12, width: 12, borderRadius: 6, backgroundColor: resources.colors.uploadedText, top: wp(5)
  },
  kycPendingDetailTxt: {
    flex: 1, fontFamily: resources.fonts.regular, fontWeight: '400', fontSize: wp(16), color: resources.colors.grayColor, marginLeft: wp(12)
  },
  txtPaymentFailDetail: {
    fontFamily: resources.fonts.regular,
    fontSize: wp(14),
    fontWeight: '400',
    color: resources.colors.grayColor,
  }
});
export default styles;
