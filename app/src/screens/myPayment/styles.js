import { StyleSheet } from 'react-native';
import { statusBarHeight, isiPhoneX, isPlatformIOS, myWidth } from '../../utility/Utils';
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
        height: 48,
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
        fontSize: 16,
        color: resources.colors.textBlack,
        fontWeight: '600',
        // marginLeft: 8
    },
    invoiceExpendNumber: {
        fontFamily: resources.fonts.regular,
        fontSize: 12,
        color: resources.colors.textBlack,
        marginLeft: 17,
        marginTop: 2,
        width: myWidth/2-20,
        borderWidth:0,
    },
    invoiceText: {
        fontFamily: resources.fonts.medium,
        fontSize: 16,
        color: resources.colors.textBlack,
        // marginLeft: 8,
        fontWeight: '600'
    },
    invoiceNumber: {
        fontFamily: resources.fonts.regular,
        fontSize: 12,
        color: resources.colors.textBlack,
        marginLeft: 17,
        marginTop: 2,
        borderWidth:0,
        width: myWidth/2-20
    },
    invoiceDetails: {
        color: resources.colors.labelColor,
        fontFamily: resources.fonts.regular,
        fontSize: 12,
        flex: 1,
        alignSelf: 'flex-start',
        // marginBottom: 10
        marginTop: 1
    },
    invoiceDetailsTitle: {
        fontFamily: resources.fonts.regular,
        fontSize: 14,
        color: resources.colors.labelColor,
        fontWeight: '600',
        // flex: 1,
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
        // flexDirection: 'row',
        flex: 1,
        justifyContent: 'flex-start',
    },
    coloum: {
        // justifyContent: 'space-between'
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
    },
    btnContainer: {
        justifyContent: 'center',
        borderTopWidth: 1,
        borderTopColor: "rgba(10,36,99,0.1)",
        alignItems: 'center',
        height: isiPhoneX ? 100 : 80,
        backgroundColor: resources.colors.white,
    },
    btnStyle: {
        width: "90%",
        marginBottom: isiPhoneX ? 10 : 0
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
    input: {
        height: 40,
        justifyContent: 'flex-end',
        backgroundColor: resources.colors.white,
        marginBottom: 10,
    },
    lableStyle: {
        color: resources.colors.labelColor,
        fontFamily: resources.fonts.bold,
        fontSize: 16,
        marginTop: 15
    },
    seperator1: {
        borderBottomColor: resources.colors.sepratorWhite,
        borderBottomWidth: 0.5,
    },
    content: {
        backgroundColor: resources.colors.white,
        paddingHorizontal: 20,
        justifyContent: 'center',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    statementText: {
        fontFamily: resources.fonts.regular,
        fontSize: 18,
        color: resources.colors.timerColor,
        textAlign: 'center',
    },
    view: {
        justifyContent: 'flex-end',
        margin: 0,
    },
});

export default styles;
