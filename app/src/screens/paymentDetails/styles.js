import { StyleSheet, } from 'react-native';
import resources from '../../../res';
import { isiPhoneX, isPlatformIOS } from '../../utility/Utils'
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: resources.colors.white,
    }, flex1: {
        flex: 1,
        marginHorizontal: 20
    }, detailCard: {
        flex: 1,
        height: 250,
        width: "100%",
        // marginTop: 10,
        backgroundColor: resources.colors.white,
        flexDirection: 'row',
        borderRadius: 6,
        shadowColor: "rgba(0,0,0,0.3)",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowRadius: 4,
        shadowOpacity: 0.3,
        elevation: 6,
    }, orderCardContainer: {
        // marginHorizontal: 10,
        flex: 1,
    }, subTitleName: {
        fontFamily: resources.fonts.regular,
        fontSize: 12,
        color: resources.colors.textBlack,
        marginTop: isPlatformIOS ? 3 : 2
    }, orderDetailsText: {
        fontFamily: resources.fonts.medium,
        fontSize: 18,
        color: resources.colors.textBlack,
        marginVertical: 15,


    }, orderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 10,
    }, orderPropText: {
        fontFamily: resources.fonts.regular,
        fontSize: 12,
        color: resources.colors.textBlack,
        marginTop: 15,
    }, orderValuesText: {
        fontFamily: resources.fonts.regular,
        fontSize: 12,
        color: resources.colors.textBlack,
        marginTop: 15,
        alignSelf: 'flex-end'
    }, seprator1: {
        height: 1,
        width: "100%",
        backgroundColor: "rgba(54,69,79,0.5)",
    }, totalContainer: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        paddingHorizontal: 10,
        alignItems: 'center',
        height: 40,
        marginBottom: 5,
        // flex:1
    }, totalTextStyle: {
        fontFamily: resources.fonts.bold,
        fontSize: 12,
        color: resources.colors.textBlack,
        marginTop: 10,

    }, shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        zIndex: 15,
        elevation: 24,
    }, coinView: {
        flexDirection: 'row',
        marginVertical: 20,
        alignItems: 'center'
        // justifyContent: 'space-around'
    }, cfCoinText: {
        fontFamily: resources.fonts.bold,
        fontSize: 14,
        color: resources.colors.charcoalGrey,
        marginHorizontal: 10

    }, cfCoinValue: {
        fontFamily: resources.fonts.medium,
        fontSize: 22,
        color: resources.colors.txtGetOTP,

    }, buttonStyle: {
        width: 160,
        height: 36,
        marginBottom: isiPhoneX ? 15 : 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: resources.colors.white,
        borderWidth: 1
    }, makePaymentButton: {
        width: 335,
        height: 48,
        marginBottom: isiPhoneX ? 15 : 0,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1
    }, redeemText: {
        color: resources.colors.appColor,
        fontSize: 12,
    }, redeemTextInstruction: {
        fontFamily: resources.fonts.regular,
        fontSize: 12,
        color: resources.colors.timerColor,
        lineHeight: 24
    }, whatsAppNotifText: {
        fontFamily: resources.fonts.medium,
        fontSize: 14,
        color: resources.colors.black
    }, gstText: {
        marginLeft: 10,
        fontFamily: resources.fonts.regular,
        fontSize: 12,
        color: resources.colors.labelColor,
    }, gstDetailsText: {
        fontFamily: resources.fonts.medium,
        fontSize: 18,
        color: resources.colors.textBlack,

    }, imageThumbnail: {
        flexDirection: 'row',
        justifyContent: 'space-between',
         alignItems: 'center',
        marginBottom: 10,
        marginHorizontal: 5,
        borderRadius: 5,
        minHeight: 48,
        backgroundColor: "white",
        shadowColor: "#000000",
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginTop:10,
      
       
    },instructionText:{
        fontFamily: resources.fonts.medium,
        fontSize: 12,
        color: resources.colors.textBlack,
    }
})
export default styles