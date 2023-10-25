import { StyleSheet } from 'react-native'
import resources from '../../../../res'
const styles = StyleSheet.create({
    fullScreen: {
        flex: 1,
        backgroundColor: resources.colors.white,
    }, container: {
        flex: 1,
        paddingHorizontal: 12,
    }, cfCoinsStyle: {
        marginTop: 5,
        marginBottom: 15,
        flexDirection: 'column'

    }, proceedBtn: {
        marginHorizontal: 10,
        marginVertical: 20,

    }, cfCoinText: {
        fontFamily: resources.fonts.bold,
        fontSize: 14,
        color: resources.colors.charcoalGrey,
        marginLeft: 10
    }, cfCoinBalance: {
        fontFamily: resources.fonts.medium,
        fontSize: 22,
        color: resources.colors.bluish
    }, RedeemBtn: {

        borderColor: resources.colors.bluish,
        borderRadius: 6,
        alignItems: 'center',
        height: 36,
        justifyContent: 'center',
        borderWidth: 1
    }, redeemText: {
        color: resources.colors.bluish,
        fontFamily: resources.fonts.bold,
        fontSize: 12
    },
    checkCoinsText: {
        fontFamily: resources.fonts.medium,
        fontSize: 16,
        marginLeft:5,
        color: resources.colors.labelColor
    },
    containerLoaderStyle: {
        flex: 1,
        position:'absolute',
        justifyContent:'center',
        backgroundColor: "rgba(0,0,0,0.0)",
        top:0,
        bottom:0,
        left:0,right:0
       
        
      },
      viewPaymentMethods: { marginVertical: 5 },
      textGstDetails: {
          fontFamily: resources.fonts.regular,
          fontSize: 19,
          fontWeight: '600',
          color: resources.colors.textBlack,
          borderWidth: 0,
          marginVertical: 4
      },
      textChoosePaymentMethod: {
          color: resources.colors.labelColor,
          fontFamily: resources.fonts.regular,
          fontSize: 14,
      },
      rowDirection: { flexDirection: 'row'},
      whatappToggleText: {
          color: resources.colors.labelColor,
          fontFamily: resources.fonts.bold,
          fontSize: 16,
      },
      textInstruction: {
          color: resources.colors.textBlack,
          fontFamily: resources.fonts.regular,
          fontSize: 13,
          marginBottom: 4,
          marginTop: 5,
      },
      creditCardView: {
          alignItems: 'center',
          justifyContent: 'space-between',
          flex: 1,
          paddingHorizontal: 20
      },
      iconStyle: {
          height: 38,
          width: 38
      },
      cardNameStyle: {
          marginLeft: 21,
          fontFamily: resources.fonts.regular,
          fontWeight: '600',
          color: resources.colors.labelColor,
          fontSize: 15,
          alignSelf: 'center'
      },
      containerHeight: {
          paddingVertical: 6,
          marginTop: 15,
          backgroundColor: resources.colors.white,
          shadowColor: "#000000",
          shadowOffset: {
              width: 1,
              height: 1
          },
          shadowOpacity: 0.2,
          shadowRadius: 5,
          elevation: 5,
          borderRadius: 6
      },
});

export default styles;
