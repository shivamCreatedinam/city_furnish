import { StyleSheet } from 'react-native'
import resources from '../../../../res'
import { statusBarHeight, isiPhoneX, isPlatformIOS } from '../../../utility/Utils';
import { heightScale } from '../../../utility/Utils';
const styles = StyleSheet.create({
    fullScreen: {
        flex: 1,
        backgroundColor: resources.colors.white
    }, container: {
        flex: 1,
        marginHorizontal: 10,
        // marginBottom:100

    }, howItWorksText: {
        marginTop: 10,
        fontFamily: resources.fonts.medium,
        fontSize: 18,
        color: resources.colors.timerColor
    },
    become_Brand: {
        marginTop: 10,
        fontFamily: resources.fonts.regular,
        fontSize: 14,
        color: resources.colors.timerColor
    }, headerContainer: {
        // marginTop: isiPhoneX ? 50 : isPlatformIOS ? 35 : 25,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    headerStyle: {
        position: 'absolute',
        left: 0, right: 0,
        top: 0, height: statusBarHeight + (isPlatformIOS ? 50 : 40),
        zIndex: 9999
    },
    invoiceCell: {
        height: 49,
        justifyContent: 'center'

    },
    tickInvoices: {
        width: 20,
        height: 20,
    },
    plusIcon: {
        width: 15,
        height: 15
    },
    minusIcon: {
        width: 15,
        height: 15,
    },
    invoiceExpendText: {
        fontFamily: resources.fonts.medium,
        fontSize: 14,
        color: resources.colors.timerColor,
        fontWeight: '600',
        // marginLeft: 8
    },
    invoiceText: {
        fontFamily: resources.fonts.medium,
        fontSize: 16,
        color: resources.colors.textBlack,
        marginLeft: 8,
        fontWeight: '600'
    },
    invoiceNumber: {
        fontFamily: resources.fonts.regular,
        fontSize: 12,
        color: resources.colors.textBlack,
        marginLeft: 17
    },
    invoiceDetails: {
        color: resources.colors.labelColor,
        fontFamily: resources.fonts.regular,
        fontSize: 12,
        marginTop: 8,
        alignSelf: 'flex-start',
        justifyContent: 'center'
    },
    invoiceDetailsTitle: {
        fontFamily: resources.fonts.medium,
        fontSize: 14,
        color: resources.colors.labelColor,
        // marginTop: 6,
        fontWeight: '600',
        // marginHorizontal: 5
    },
    seperator: {
        height: 1,
        width: "100%",
        backgroundColor: resources.colors.sepratorWhite,
    },
    emptyView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    cellStyle: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
    },
    invoiceCon: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    rowDirection: {
        // flexDirection: 'row',
        // marginHorizontal: 9,
        // alignItems: 'center',
        // justifyContent: 'flex-start'
    },
    // coloum: {
    //     justifyContent: 'space-between'
    // },
    detailCon: {
        marginLeft: 17,
        justifyContent: 'space-between',
        flex: 1
    }, allYouKnow: {
        borderBottomColor: resources.colors.sepratorWhite,
        borderBottomWidth: 1,
        borderTopColor: resources.colors.sepratorWhite,
        borderTopWidth: 1,
        height: 50,
        justifyContent: 'center'
    }, textAllYouKnow: {
        fontFamily: resources.fonts.medium,
        fontSize: 18,
        color: resources.colors.timerColor,
        marginLeft: 20
    }, imageThumnail: {

        // justifyContent: 'center',
        // marginVertical: 10,
        marginBottom: 10,
        marginHorizontal: 20,
        padding: 5,
        borderRadius: 5,
        minHeight: 50,
        backgroundColor: "white",
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        maxHeight: 400
    }, expendView: {
        minHeight: 49,
        maxHeight: 300
    }, unExpendHeight: {
        height: 49
    },
    mainContainer: {
        flex: 1,
        marginBottom: isiPhoneX ? 25 : 10
    },
    viewStep: {
        flex: 0.5,
        borderWidth: 0,
        margin: 8,
        // height: !isPlatformIOS ? heightScale(160) : 160,
        // width: (myWidth / 2) - 25,
        // maxWidth: (myWidth / 2) - 25,
        paddingHorizontal: 10,
        shadowColor: "rgba(0, 0, 0, 0.2)",
        shadowOffset: {
            width: 1,
            height: 2,
        },
        shadowOpacity: 1,
        shadowRadius: 2,
        elevation: 5,
        borderRadius: 8,
        backgroundColor: resources.colors.white,
        paddingVertical:10,
        justifyContent: 'center',
        // alignSelf:'center'
    },
    imageStep: {
        width: 65,
         height: 65,
        marginBottom: 8,
        marginTop: 14,

        alignSelf: 'center'
    },
    idStep: {
        color: resources.colors.appColor,
        fontSize: 12,
        fontFamily: resources.fonts.bold
    },
    textStep: {
        color: resources.colors.charcoalGrey,
        fontSize: isPlatformIOS ? 13 : heightScale(13),
        fontFamily: resources.fonts.regular,
    }

})
export default styles