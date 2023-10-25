import {StyleSheet} from 'react-native';
import {
  widthScale,
  heightScale,
  statusBarHeight,
  isiPhoneX,
  myWidth,
  isPlatformIOS,
} from '../../../utility/Utils';
import resources from '../../../../res';
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#F7F7F8",
  },
  flex1: {
    flex: 1,
  },
  titleTextStyle: {
    fontFamily: resources.fonts.medium,
    color: '#222222',
    fontSize: 18,
    marginTop: 15,
    fontWeight: '500',
    marginLeft : 12
  },
  titleTextStyle1: {
    fontFamily: resources.fonts.medium,
    color: '#3a3a3a',
    fontSize: 16,
    fontWeight: '500',
  },
  subTitleTextStyle1: {
    fontFamily: resources.fonts.regular,
    color: '#45454A',
    fontSize: 12,
    fontWeight: '400',
  },
  description:{
    fontFamily: resources.fonts.bold,
    color: '#45454A',
    fontSize: 12,
    fontWeight: '700',
    padding : 16,
    marginBottom : 15
  },
  marginTop : {
    marginTop : 15
  },
  leftClass : {
    marginLeft : 15
  },
  specificationTextStyle: {
    fontFamily: resources.fonts.bold,
    color: '#3a3a3a',
    fontSize: 14,
    marginTop: 10,
    fontWeight: '400',
  },
  includeTitleTextStyle: {
    fontFamily: resources.fonts.regular,
    color: '#000',
    fontSize: 15,
    fontWeight: 'bold',
  },
  priceTextStyle: {
    fontFamily: resources.fonts.regular,
    color: '#45454A',
    fontSize: 15,
    marginTop:0
  },
  buttonLabelStyle : {
    fontFamily: resources.fonts.regular,
    color: '#48678B',
    fontSize: 14,
    marginTop:8,
    textDecorationLine:"underline"
  },
  rowDirection: {
    flexDirection: 'row',
  },
  imageIcon : {
    width:30,
    height : 30
  },
  centerClass : {
    justifyContent : "center"
  },
  subTitleTextStyle: {
    fontFamily: resources.fonts.bold,
    color: 'rgb(28,28,28)',
    fontSize: 11,
    marginTop: 3,
    width: 80,
  },
  subTitleValueStyle: {
    color: 'rgb(28,28,28)',
    fontSize: 10.5,
    marginTop: 3,
    fontFamily: resources.fonts.regular,
    flex: 1,
  },
  subTitleValueText: {
    color: 'rgb(28,28,28)',
    fontSize: 10,
    marginTop: 8,
    fontFamily: resources.fonts.regular,
    flex: 1,
  },
  subTitleValueTextForAC: {
    color: 'rgb(28,28,28)',
    fontSize: 10,
    lineHeight: 14,
    marginTop: 8,
    fontFamily: resources.fonts.regular,
    flex: 1,
  },
  spaceContainer1: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flex: 1,
    marginLeft: 30,
  },
  spaceContainer: {},
  proSubTitle: {
    fontFamily: resources.fonts.bold,
    color: 'rgb(28,28,28)',
    fontSize: 10,
    marginTop: 8,
    width: 70,
  },
  proSubValue: {
    color: 'rgb(28,28,28)',
    fontSize: 10,
    // marginTop: 8,
    fontFamily: resources.fonts.regular,
    height: 30,
  },
  proSpaceCon: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flex: 1,
    marginLeft: 40,
  },
  priceBoxContainer: {
    marginHorizontal: widthScale(20),
    justifyContent: 'center',
    marginTop: 21,
    alignItems: 'center',
    flexDirection: 'row',
  },
  monthlyRentBoxContainer: {
    paddingHorizontal: 10,
    marginTop: 5,
    flexDirection: 'row',
  },
  priceInnerBox: {
    flexDirection: 'row',
  },
  priceInnerBoxWithoutDesign: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  priceContainer: {
    height: 81,
    // width: 102,
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: resources.colors.white,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 5,
  },
  priceContainerWithoutDesign: {
    height: 81,
    width: 190,
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: resources.colors.white,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 5,
  },
  priceRefundableContainer: {
    height: 81,
    width: 102,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: resources.colors.white,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 5,
  },
  priceInstallationContainer: {
    height: 81,
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: resources.colors.white,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 5,
  },
  spaceView: {
    width: 20,
  },
  installationBox: {
    marginTop: 15,
  },
  freeDeliveryText: {
    textAlign: 'center',
    color: 'rgb(54,69,79)',
    marginTop: 6,
    fontSize: 12,
  },
  installationTextPrice: {
    fontFamily: resources.fonts.bold,
    color: 'rgb(54,69,79)',
    fontSize: 14,
  },
  installationText: {
    fontFamily: resources.fonts.bold,
    textAlign: 'center',
    color: 'rgb(54,69,79)',
    fontSize: 12,
  },
  priceText: {
    color: 'rgb(36,132,198)',
    textAlign: 'center',
    fontFamily: resources.fonts.bold,
    fontSize: 12,
  },
  upfrontPriceText: {
    color: 'rgb(36,132,198)',
    // textAlign: 'center',
    fontFamily: resources.fonts.bold,
    fontSize: 13,
  },
  upfrontPriceStrikeOutText: {
    color: 'rgb(28,28,28)',
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    fontFamily: resources.fonts.regular,
    fontSize: 13,
    marginTop: 2,
    paddingHorizontal: 6,
  },
  OffTextStyle: {
    fontFamily: resources.fonts.bold,
    fontSize: 13,
    backgroundColor: '#83b31d',
    color: resources.colors.white,
    textAlign: 'center',
    paddingHorizontal: 5,
    paddingVertical: 4,
    borderRadius: 16,
  },
  emiBox: {
    flex: 1,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    backgroundColor: resources.colors.appColor,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  monthlyUpfrontRentText: {
    color: 'rgb(28,28,28)',
    // textAlign: 'center',
    flex: 1,
    fontFamily: resources.fonts.bold,
    fontSize: 12,
    // marginTop:5
  },
  monthlyRentText: {
    color: 'rgb(28,28,28)',
    textAlign: 'center',
    fontFamily: resources.fonts.regular,
    fontSize: 12,
    marginTop: 5,
  },
  monthlyRentEMIDesc: {
    color: resources.colors.white,
    textAlign: 'center',
    fontFamily: resources.fonts.regular,
    fontSize: 12,
  },
  monthlyRentUpfrontDesc: {
    color: 'rgb(28,28,28)',
    // textAlign: 'center',
    fontFamily: resources.fonts.regular,
    fontSize: 12,
    paddingHorizontal: 10,
    marginTop: 2,
  },
  monthlyRentTextDesc: {
    color: 'rgb(28,28,28)',
    textAlign: 'center',
    fontFamily: resources.fonts.regular,
    fontSize: 10,
    marginTop: 5,
  },
  offerTextStyle: {
    color: 'rgb(36,132,198)',
    textAlign: 'center',
    fontSize: 10,
    fontFamily: resources.fonts.regular,
    fontWeight: '500',
    marginTop: 5,
  },
  discountText: {
    fontFamily: resources.fonts.regular,
    fontSize: 11,
    color: 'rgb(28,28,28)',
    textAlign: 'center',
  },
  cuponCodeText: {
    color: 'rgb(239,83,78)',
    fontFamily: resources.fonts.regular,
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    marginLeft: 2,
  },
  offerBoxContainer: {
    // height: 90,
    marginHorizontal: 15,
    marginTop: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: resources.colors.white,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 5,
  },
  wrapCoupanText: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 3,
  },
  viewOfferText: {
    borderBottomColor: 'rgb(36,132,198)',
    borderBottomWidth: 0.2,
    marginTop: 4,
  },
  instructionText: {
    fontFamily: resources.fonts.regular,
    fontSize: 11.5,
    color: 'rgb(28,28,28)',
    marginLeft: 10,
  },
  iconStyle: {
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 5,
  },
  instructionContainer: {
    marginHorizontal: widthScale(20),
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  itemListCountStyle: {
    fontSize: 18,
    color: 'rgb(28,28,28)',
    fontFamily: resources.fonts.bold,
    marginHorizontal: widthScale(20),
    marginVertical: 10,
    fontWeight : "500"
  },
  horizontalImageContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  horizontalModalTopImageContainer: {
    flex: 1,
    marginHorizontal: widthScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  horizontalModalImageContainer: {
    flexDirection: 'row',
  },
  reviewContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 106,
  },
  marginHor: {
    marginHorizontal: widthScale(20),
  },
  marginModalHor: {
    marginHorizontal: widthScale(20),
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  columnDirection: {
    flexDirection: 'column',
  },
  productImage: {
    height: '100%',
    width: '100%',
    // marginLeft: 10,
    // marginRight: 9,
    borderRadius: 6,
  },
  seperator: {
    borderBottomColor: 'rgba(10,36,99,0.1)',
    borderBottomWidth: 1,
    marginVertical: 8,
  },
  moreProductImages: {
    height: heightScale(75),
    width: widthScale(75),
    // marginLeft: 12,
    marginRight: 12,
    borderRadius: 6,
    borderColor: '#dddddd',
    borderWidth: 0.5,
    marginTop: 16,
  },
  moreModalProductImages: {
    height: heightScale(60),
    width: widthScale(60),
    // marginLeft: 12,
    marginRight: 12,
    borderRadius: 6,
    borderColor: '#dddddd',
    borderWidth: 0.5,
    marginTop: 16,
  },
  buttonStyle: {
    // height: heightScale(48),
    width: myWidth - 60,
    marginTop: 15,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'rgb(36,132,198)',
    alignSelf: 'stretch',
    marginBottom: isiPhoneX ? 25 : 20,
  },
  buttonStyleAddToCart: {
    // height: heightScale(48),
    width: 120,
    // width: myWidth/2 - 20,
    marginTop: 10,
    height: 48,
    // marginRight: 10,
    // justifyContent: 'center',
    // alignItems: 'center',
    borderColor: resources.colors.buttonCBackgroundColor,
    color: resources.colors.buttonCBackgroundColor,
    alignSelf: 'stretch',
    marginBottom: isiPhoneX ? 15 : 10,
    borderRadius: 4,
    backgroundColor:resources.colors.buttonCBackgroundColor
  },
  buttonStyleAddonsAddToCart: {
    // height: heightScale(48),
    // width: myWidth - 30,
    width: myWidth / 2 - 20,
    marginTop: 10,
    height: 48,
    // marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: resources.colors.buttonCBackgroundColor,
    color: resources.colors.buttonCBackgroundColor,
    alignSelf: 'stretch',
    marginBottom: isiPhoneX ? 15 : 10,
    borderRadius: 4,
  },
  footerText : {
    fontSize : 18,
    fontWeight : 'bold'
  },
  footerText1:{
    color:'#45454A'
  },
  buttonStyleAddons: {
    // height: heightScale(48),
    // width: myWidth/2 - 20,
    marginTop: 10,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: resources.colors.appColor,
    color: resources.colors.appColor,
    alignSelf: 'stretch',
    marginBottom: isiPhoneX ? 15 : 10,
    borderRadius: 4,
    marginRight: 20,
  },
  buttonStyleBuyNow: {
    // height: heightScale(48),
    // width: myWidth/2 - 20,
    marginTop: 10,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: resources.colors.appColor,
    color: resources.colors.white,
    alignSelf: 'stretch',
    marginBottom: isiPhoneX ? 15 : 10,
    borderRadius: 4,
  },
  grayBtnStyle: {
    width: 130,
    marginTop: 20,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: 'gray',
    marginBottom: isiPhoneX ? 35 : 20,
  },
  cartButtonContainer: {
    flex: 1,
     flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    width: '100%',
    borderTopColor: 'rgba(10,36,99,0.1)',
    alignItems: 'center',
    height: isiPhoneX ? 85 : 65,
    backgroundColor: resources.colors.white,
    position: 'absolute',
    bottom: 0,
    zIndex: 9999,
    paddingHorizontal: 20,
  },
  chooseDuration: {
    textAlign: 'center',
    fontSize: 13,
    color: resources.colors.textBlack,
    fontFamily: resources.fonts.bold,
  },
  truckIconStyle: {
    width: 14,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 2,
  },
  dropDownContainer: {
    width: 110,
    height: 15,
    justifyContent: 'center',
    // alignSelf: 'center',
    borderRadius: 4,
    flex: 1,
    backgroundColor: resources.colors.white,
    paddingBottom: 15,
    paddingLeft: 5,
  },
  footerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: isiPhoneX ? 25 : 10,
  },
  flatlistMargin: {
    flex: 1,
  },
  flatlistModalMargin: {
    // flex: 1,
    height: 75,
    paddingHorizontal: widthScale(20),
    backgroundColor: '#FAF9F6',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    height: heightScale(44),
    position: 'absolute',
    flex: 1,
    zIndex: 9999,
  },
  space: {
    width: 15,
  },

  iconStyleHeader: {
    height: 20,
    width: 20,
  },

  iconCartHeader: {
    tintColor: resources.colors.white,
    height: 25,
    width: 25,
  },
  badgeCart: {
    color: 'white',
    fontSize: 12,
    fontFamily: resources.fonts.bold,
    borderWidth: 0,
  },
  backIconStyle: {
    height: 18,
    width: 22,
    marginLeft: widthScale(20),
  },
  marginHoriDotStyle: {
    marginHorizontal: widthScale(4),
  },
  shareContainer: {
    flexDirection: 'row',
    marginRight: 20,
  },
  headerContainer: {
    // marginTop: isiPhoneX ? 50 : isPlatformIOS ? 35 : 25,
    marginTop: statusBarHeight + 4,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 0,
  },
  headerStyle: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: statusBarHeight + 50,
    zIndex: 9999,
  },
  dropDownView: {
    height: 40,
    borderColor: '#ced0da',
    borderWidth: 1,
    borderRadius: 4,
    marginTop: 10,
  },
  viewCartBadge: {
    // On React Native < 0.57 overflow outside of parent will not work on Android, see https://git.io/fhLJ8
    position: 'absolute',
    right: -8,
    top: -4,
    backgroundColor: resources.colors.red,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tenureSliderBoxContainer: {
    marginLeft: widthScale(40),
    marginRight: widthScale(20),
    justifyContent: 'center',
    textAlign: 'center',
    marginVertical: 10,
    // alignItems: 'center',
    // backgroundColor: resources.colors.white,
    // shadowColor: "#000000",
    // shadowOffset: {
    //     width: 0,
    //     height: 0,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 5,
    // borderRadius: 5
  },

  view: {
    justifyContent: 'center',
    margin: 0,
    width: '100%',
    // backgroundColor: resources.colors.white
  },
  fullScreenModal: {
    flex: 1,
    backgroundColor: resources.colors.white,
    // margin: 0,
    width: '100%',
  },
  backBtnBox: {
    // backgroundColor: resources.colors.white,
    paddingVertical: 6,
    paddingLeft: 4,
    width: 40,
    height: 40,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    position: 'absolute',
    top: isPlatformIOS ? 20 : 0,
    right: isPlatformIOS ? 0 : 0,
    zIndex: 9999,
  },
  containerLoaderStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtnCont: {
    borderColor: resources.colors.appColor,
    // borderWidth: 5,
    paddingRight: 5,
    borderRadius: 100,
    width: 32,
    height: 32,
  },
  crossIconStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: 3,
    marginLeft: 3,
    width: 15,
    height: 15,
  },
  listUpFrontContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  imageThumbnail: {
    justifyContent: 'space-between',
    // alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 5,
    borderRadius: 5,
    // minHeight: 85,
    marginVertical: 5,
    backgroundColor: resources.colors.white,
    shadowColor: '#000000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 5,
    borderWidth: 0,
    // backgroundColor: '#dddddd'
  },
  chechbox: {
    // backgroundColor: 'pink',
    // flex:1,
    width: '8%',
    alignItems: 'center',
    marginHorizontal: 8,
    // marginTop: 10,
    textAlign: 'center',
    textAlignVertical: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    alignContent: 'center',
  },
  chechboxImage: {
    width: 20,
    height: 20,
  },
  cellStyle: {
    flex: 1,
    marginTop: 6,
  },
  userNameText: {
    fontFamily: resources.fonts.bold,
    color: resources.colors.appColor,
    fontSize: 14,
  },
  fontStyle: {
    fontFamily: resources.fonts.bold,
    fontSize: 12,
    color: resources.colors.bluish,
    lineHeight: 18,
  },
  defaultTxt: {
    fontFamily: resources.fonts.bold,
    fontSize: 11,
  },
  viewEdit: {
    width: '12%',
    // marginTop: 7,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editTouchView: {
    flex: 1,
    alignItems: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    alignContent: 'center',
  },
  divider: {backgroundColor: resources.colors.labelColor, width: 1, height: 27},
  divider1 : {
    height : StyleSheet.hairlineWidth,
    backgroundColor:'#DDDDDF',
    marginTop : 15,
    marginBottom:15
  },
  flexRow : {
    flexDirection:'row',
    justifyContent:'space-between'
  }
});

export default styles;