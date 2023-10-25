import { StyleSheet } from 'react-native'
import resources from '../../../res'
import { isiPhoneX } from '../../utility/Utils'

const styles = StyleSheet.create({
    fullScreen: {
        flex: 1,
        backgroundColor: resources.colors.white
    }, container: {
        flex: 1,
        marginHorizontal: 20,
        marginTop: 5
    }, submitBtn: {
        justifyContent: 'center',
        height: 70,
    }, buttonStyle: {
        // width: 335,
        height: 48,
        // marginHorizontal: 20
    }, corporateOrdersText: {
        // marginVertical: 10,
        marginBottom: 10,
        marginHorizontal: 20,
        alignItems: 'center'
    }, textCorporate: {
        fontFamily: resources.fonts.medium,
        fontSize: 18,
        color: resources.colors.timerColor
    }, corporateDiscription: {
        // marginHorizontal: 20,
        // alignItems: 'center',
        // justifyContent: 'center'
    }, discriptionText: {
        fontFamily: resources.fonts.regular,
        fontSize: 12,
        color: resources.colors.charcoalGrey,
        textAlign: 'center',
        lineHeight: 18,
        letterSpacing: -0.31,
    }, customProduct: {
        borderRadius: 6,
        borderTopWidth: 1,
        borderTopColor: "rgba(10,36,99,0.1)",
        height: 190,
        backgroundColor: resources.colors.white,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        // marginHorizontal: 20,
        marginVertical: 10
    }, customMadeText: {
        marginVertical: 10,
        fontFamily: resources.fonts.medium,
        fontSize: 18,
        marginHorizontal: 10

    }, customMadeDiscription: {
        fontFamily: resources.fonts.regular,
        fontSize: 12,
        lineHeight: 18,
        color: resources.colors.charcoalGrey,
        marginHorizontal: 10,
        // position:'absolute',
        // top:50
        zIndex: 1

    }, imgHelpLine: {
        width: 201,
        height: 113,
        position: 'absolute',
        bottom: 0, right: 0, zIndex: 0
    }, helplineDiscription: {
        flexDirection: 'column'
    }, helpLineText: {
        flexDirection: 'row',
        marginHorizontal: 10,
        marginVertical: 20
    }, callStyle: {
        fontFamily: resources.fonts.bold,
        fontSize: 14,
        color: resources.colors.timerColor
    }, helpLineNo: {
        fontFamily: resources.fonts.bold,
        fontSize: 14,
        color: resources.colors.appColor,
        marginLeft: 5
    }, ourProject: {
        fontFamily: resources.fonts.medium,
        fontSize: 18,
        marginVertical: 5
    },
    productImages: {
        width: 100,
        height: 100,
        // alignItems: 'center',
        // justifyContent: 'center',
        // marginHorizontal: isiPhoneX ? 15 : 5,
        // marginVertical: isiPhoneX ? 15 : 9,
        borderRadius: 6,

    }, viewAllText: {
        fontFamily: resources.fonts.bold,
        color: resources.colors.white,
        fontSize: 12,
        marginTop: 5
    }, enquiry: {
        fontFamily: resources.fonts.medium,
        fontSize: 18,
        color: resources.colors.timerColor,
        marginVertical: 5,
        marginTop: 5
    }, enquiryRequrement: {
        fontFamily: resources.fonts.regular,
        fontSize: 12,
        lineHeight: 18,
        color: resources.colors.charcoalGrey,
        marginVertical: 5
    },
    flatlistStyle: {
        justifyContent: 'center',
        marginTop: 5,
        marginBottom: isiPhoneX ? 25 : 10
    },
    ActivityIndicatorStyle: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }
})
export default styles;