import { StyleSheet } from 'react-native';
import { statusBarHeight, isiPhoneX, isPlatformIOS } from '../../utility/Utils';
import resources from '../../../res';
const styles = StyleSheet.create({
    fullScreen: {
        flex: 1
    },
    mainContainer: {
        flex: 1,
        backgroundColor: resources.colors.white
    },
    headerContainer: {
        marginTop: isiPhoneX ? 50 : isPlatformIOS ? 35 : 25,
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
        fontFamily: resources.fonts.regular,
        fontSize: 16,
        color: resources.colors.textBlack,
        fontWeight: '600',
    },
    invoiceExpendNumber: {
        fontFamily: resources.fonts.regular,
        fontSize: 12,
        color: resources.colors.textBlack,
        marginLeft: 17
    },
    invoiceText: {
        fontFamily: resources.fonts.regular,
        fontSize: 16,
        color: resources.colors.textBlack,
        fontWeight: '600',
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
        flex: 1,
        alignSelf: 'flex-start',
        marginBottom: 10
    },
    invoiceDetailsTitle: {
        fontFamily: resources.fonts.regular,
        fontSize: 14,
        color: resources.colors.labelColor,
        fontWeight: '600',
        marginBottom: 10,
        width: 140
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
        flex: 1
    },
    invoiceCon: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    rowDirection: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    coloum: {
        flexDirection: 'row'
    },
    detailCon: {
        marginLeft: 17,
        justifyContent: 'space-between',
        flex: 1
    },
    plusMinusIcon: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        width: 48,
    },
    cardStyle: {
        flex: 1,
        marginLeft: 20,
        marginRight: 10
    }
});

export default styles;
