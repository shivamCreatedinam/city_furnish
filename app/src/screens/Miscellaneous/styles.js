import { StyleSheet } from 'react-native'
import resources from '../../../res'
import { heightScale, isPlatformIOS } from '../../utility/Utils';
export default StyleSheet.create({
    fullScreen: {
        flex: 1,
        backgroundColor: resources.colors.white,
    },
    mainContainer: {
        flex: 1,
        // marginHorizontal: 20,
        // marginTop: 15
    },
    ActivityIndicatorStyle: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',

    },
    container: {
        flex: 1,
        marginHorizontal: 20,

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
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
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
        fontWeight: '600'
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
        fontWeight: '600',
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
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 20,
        flex: 1
    },
    invoiceCon: {
        justifyContent: 'center',
        flex: 1,
    },
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
        // minHeight: 49,
        // maxHeight: 300
        flex: 1
    }, unExpendHeight: {
        // height: 49
        flex: 1
    }
})