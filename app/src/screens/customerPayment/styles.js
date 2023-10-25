import { StyleSheet } from 'react-native'
import resources from '../../../res'
import { widthScale } from '../../utility/Utils';
const styles = StyleSheet.create({
    fullScreen: {
        flex: 1,
        backgroundColor: resources.colors.white,
        // marginTop: 5,
    }, container: {
        flex: 1,
       
        // marginTop: 10,
        //  marginBottom: 100
    }, listAddressContainer: {
        flex: 1,
        marginHorizontal: 5,
    },
    scrollStyle: {
        backgroundColor: 'white',
    },

    tabBarTextStyle: {
        fontSize: 12,
        fontFamily: resources.fonts.regular,
    },
    underlineStyle: {
        height: 3,
        backgroundColor: resources.colors.bluish,
        borderRadius: 3,
    }, inActiveTextcolor: {
        fontSize: 12,
        fontFamily: resources.fonts.medium,
        color: resources.colors.blueGrey
    }, activeTextColor: {
        fontSize: 12,
        fontFamily: resources.fonts.regular,
        color: resources.colors.bluish
    }, separatorStyle: {
        height: 1,
        width: "100%",
        backgroundColor: resources.colors.inputLabel,
    }, cell: {
        flex: 1, justifyContent: 'space-between', alignItems: 'center',

    }, row: {
        flex: 1,
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center',

    }, fontStyleSelected: {
        fontFamily: resources.fonts.bold,
        color: resources.colors.textLight,
        fontSize: 16,
    }, fontStyle: {
        fontFamily: resources.fonts.regular,
        fontSize: 10,
        color: resources.colors.textBlack,
        lineHeight: 18

    }, chechbox: {
        // marginLeft: widthScale(21)
        marginRight: 20,
        justifyContent: 'center'

    }, defaultAddress: {
        flexDirection: 'row',
        marginTop: 5,
        alignItems: 'center',
        marginBottom: 15

    }, defaultAddressimg: {
        height: 20,
        width: 20
    }, defaultText: {
        marginLeft: 20,
        fontFamily: resources.fonts.regular,
        fontSize: 16,
        color: resources.colors.textLight
    }, cellStyle: {
        flex: 1, marginLeft: 10
    }, imageThumbnail: {
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        marginHorizontal: 5,
        borderRadius: 5,
        height: 85,
        backgroundColor: "white",
        shadowColor: "#000000",
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    }, userNameText: {
        fontFamily: resources.fonts.bold,
        color: resources.colors.bluish,
        fontSize: 14,
    },
    defaultTxt: {
        fontFamily: resources.fonts.bold,
        fontSize: 10
    }, AddAddreesBtn: {

        justifyContent: 'center',
        alignItems: 'center',
        height: 70,

    }, buttonStyle: {
        // width: 150,
        paddingHorizontal:7,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center'
    }, cityLabel: {
        marginTop: 10,
        fontSize: widthScale(15),
        color: resources.colors.labelColor,
        fontFamily: resources.fonts.bold
    }, buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: "100%",
        borderTopColor: "rgba(10,36,99,0.1)",
        alignItems: 'center',
        borderWidth:0
        // marginTop: 10
    },
    footerStyle: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    }, btnContainer: {
        marginTop: 5,
        flexDirection: 'column',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        width: "100%",
        borderTopColor: "rgba(10,36,99,0.1)",
        alignItems: 'center',
        height: 120,
        backgroundColor: resources.colors.white,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        paddingHorizontal:25,

        elevation: 3,
    }, totalOutStandingText: {
        fontFamily: resources.fonts.bold,
        fontSize: 13,
        color: resources.colors.textBlack,

    }, instructionText: {
        textAlign: 'center',
        color: resources.colors.charcoalGrey,
        fontSize: 12,
        marginVertical: 0,
        borderWidth:0

    }
});

export default styles;
