import {StyleSheet} from 'react-native';
import {heightScale, isiPhoneX} from '../../utility/Utils';
import resources from '../../../res';
const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: '#ee534e',
  },
  container: {
    marginHorizontal: 30,
    marginTop: heightScale(280),
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
  },
  haveYourFriendText: {
    fontFamily: resources.fonts.regular,
    fontSize: 24,
    textAlign: 'center',
    color: resources.colors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: 3, height: 3},
    textShadowRadius: 4,
  },
  shareYourReferral: {
    fontFamily: resources.fonts.regular,
    fontSize: 16,
    lineHeight: 20,
    textAlign: 'center',
    color: resources.colors.white,
    marginTop: heightScale(11),
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 4,
  },
  coinsIconStyle: {
    width: 33,
    height: 33,
    marginTop: 20,
  },
  coinsPriceText: {
    fontFamily: resources.fonts.bold,
    fontSize: 24,
    color: resources.colors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: 3, height: 3},
    textShadowRadius: 4,
  },
  yourRefeCodeText: {
    fontFamily: resources.fonts.regular,
    fontSize: 16,
    color: resources.colors.white,
    marginTop: 33,
  },
  buttonStyle: {
    width: 180,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(36,132,198)',
    borderColor: 'rgb(36,132,198)',
    alignSelf: 'center',
    // marginBottom: 20,
  },
  buttonLaterStyle: {
    width: 180,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: resources.colors.greyLightAlpha,
    borderColor: resources.colors.greyLightAlpha,
    alignSelf: 'center',
    // marginBottom: 20,
  },
  copyCodeContainer: {
    flexDirection: 'row',
    marginTop: heightScale(15),
    justifyContent: 'center',
    alignItems: 'center',
  },
  referralCodeStyle: {
    height: 44,
    width: 200,
    borderColor: resources.colors.white,
    borderStyle: 'dashed',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 7,
    borderBottomLeftRadius: 7,
  },
  copyTextStyle: {
    height: 44,
    width: 85,
    backgroundColor: resources.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: resources.colors.white,
    borderTopRightRadius: 7,
    borderBottomRightRadius: 7,
    marginLeft: -2,
  },
  copyTextColor: {
    color: 'rgb(36,132,198)',
    fontSize: 16,
    fontFamily: resources.fonts.bold,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cuponTextStyle: {
    color: resources.colors.white,
    fontSize: 12,
    fontFamily: resources.fonts.bold,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerColor: {
    backgroundColor: '#E24E4A',
    zIndex: 9999,
  },
  btnTouchStyle: {
    height: 48,
    width: 130,
    marginTop: 19,
  },
  btnView: {
    marginBottom: isiPhoneX ? 35 : 25,
    marginTop: 60,
  },
});
export default styles;
