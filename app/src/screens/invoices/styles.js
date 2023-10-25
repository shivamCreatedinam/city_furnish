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

    }, Container: {
        flex: 1,
        backgroundColor: resources.colors.white,
        marginBottom: isiPhoneX ? 100 : 80,
    },
    buttonStyle: {

        borderColor: "rgb(36,132,198)",
        alignSelf: "stretch",
        marginRight: 20,
        height: 48,
        width: 150,
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
    }, buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        width: "100%",
        borderTopColor: "rgba(10,36,99,0.1)",
        alignItems: 'center',
        height: isiPhoneX ? 100 : 80,
        backgroundColor: resources.colors.white,
        position: "absolute",
        bottom: 0,
        zIndex: 9999
    },
    footerStyle: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 25,
        marginBottom: isiPhoneX ? 24 : 0
    }, invoiceCell: {
        height: 48,
        justifyContent: 'center'

    }, tickInvoices: {
        width: 20,
        height: 20,
    }, plusIcon: {
        width: 15,
        height: 15
    }, minusIcon: {
        width: 15,
        height: 15,
        

    },
    invoiceExpendText: {
        fontFamily: resources.fonts.medium,
        fontSize: 16,
        color: resources.colors.textBlack,

    }, invoiceExpendNumber: {
        fontFamily: resources.fonts.regular,
        fontSize: 12,
        color: resources.colors.textBlack,
        // marginLeft: -100
        width: '45%',
        borderWidth: 0,
        marginTop: 2,
        marginLeft: 17
    },
    invoiceText: {
        fontFamily: resources.fonts.medium,
        fontSize: 16,
        color: resources.colors.textBlack,
        marginLeft: 8,
    }, invoiceNumber: {
        fontFamily: resources.fonts.regular,
        fontSize: 12,
        color: resources.colors.textBlack,
        marginLeft: 17,
        alignSelf: 'center',
        width: '40%',
        borderWidth: 0,
        marginTop: 2
    }, dowloadInvoce: {
        width: 140,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        marginRight: 10,

    }, textInvoice: {
        color: resources.colors.white,
        fontFamily: resources.fonts.bold,
        fontSize: 12,
        borderWidth: 0,
        lineHeight: 24,
        marginBottom: isPlatformIOS ? 0 : 3,
        // alignSelf:'center',
        // textAlignVertical:'center'
    }, payNowBtn: {
        width: 140,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,

    },
    invoiceDetailsTitle: {
        fontFamily: resources.fonts.regular,
        fontSize: 14,
        color: resources.colors.labelColor,
        fontWeight: '600',
        marginBottom: 10,
        width: 140
    },
    invoiceDetails: {
        color: resources.colors.labelColor,
        fontFamily: resources.fonts.regular,
        fontSize: 12,
        flex: 1,
        alignSelf: 'flex-start',
        marginTop: 1
        // marginBottom: 10
    },
    totalText: {
        fontFamily: resources.fonts.medium,
        fontSize: 18,
        color: resources.colors.black
    }, totalValue: {
        color: resources.colors.bluish,
        fontFamily: resources.fonts.medium,
        fontSize: 22
    },
    cellStyle: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        flex: 1,
    },
    lableStyle: {
        color: resources.colors.labelColor,
        fontFamily: resources.fonts.bold,
        fontSize: 16,
        marginTop: 15
    },
    content: {
        backgroundColor: resources.colors.white,
        paddingHorizontal: 20,
        justifyContent: 'center',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    contentTitle: {
        fontSize: 20,
        marginBottom: 12,
    },
    view: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    statementText: {
        fontFamily: resources.fonts.regular,
        fontSize: 18,
        color: resources.colors.timerColor,
        textAlign: 'center',
    },
    seperator: {
        borderBottomColor: resources.colors.sepratorWhite,
        borderBottomWidth: 0.5,
    },
    input: {
        height: 40,
        justifyContent: 'flex-end',
        backgroundColor: resources.colors.white,
        marginBottom: 10,
    },
    rowDirection: {
        flex: 1,
        justifyContent: 'flex-start'
    },
    coloum: {
        flexDirection: 'row'
    },
    invoiceCon: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    plusMinusIcon: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        width: 48,
        borderWidth: 0
    }, 
    plusImgIcon: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        width: 48,
        borderWidth:0,
        // marginLeft: -10
        // marginRight:40
    },
    buttonCon: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 15
    },
    cardStyle: {
        flex: 1,
        marginLeft: 20,
        marginRight: 10
    },
    btnView: {
        marginBottom: isiPhoneX ? 15 : 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ActivityIndicatorStyle: {
        // position: 'absolute',
        // left: 0,
        // right: 0,
        // top: 0,
        // bottom: 0,
        // alignItems: 'center',
        // justifyContent: 'center',

    },
    outStandingLabel: {
        fontFamily: resources.fonts.regular,
        fontSize: 17,
        color: resources.colors.hint
    },
    coinsInputStyle: {
        borderBottomWidth: 1,
        fontSize: 18,
        width: 150,
        color: resources.colors.labelColor,
        marginHorizontal: 3,
        borderBottomColor: resources.colors.labelColor
    },
    coinImage: { width: 19, height: 19, marginHorizontal: 3 },
    rowDirectionCenter: { flexDirection: 'row', alignItems: 'center', },
    outstandingMoney: {
        fontFamily: resources.fonts.bold,
        fontSize: 16,
        color: resources.colors.textBlack
    },
    totalCoins: {
        fontFamily: resources.fonts.bold,
        fontSize: 22,
        color: resources.colors.txtGetOTP
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
});

export default styles;
