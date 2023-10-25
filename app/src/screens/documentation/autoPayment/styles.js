import { StyleSheet } from 'react-native'
import resources from '../../../../res'
import { isiPhoneX, isPlatformIOS } from '../../../utility/Utils';


const styles = StyleSheet.create({
    fullScreen: {
        flex: 1,
        backgroundColor: resources.colors.white,
    },
    container: {
        flex: 1,
        // marginTop: 5
    },
    orderOption: {
        fontFamily: resources.fonts.medium,
        fontSize: 14,
        color: resources.colors.labelColor,
    },
    orderData: {
        fontFamily: resources.fonts.regular,
        fontSize: 12,
        color: resources.colors.timerColor,
    },
    orderSuccessData: {
        fontFamily: resources.fonts.regular,
        fontSize: 13,
        color: resources.colors.green,
    },
    viewOrder: {
        fontFamily: resources.fonts.regular,
        fontSize: 12,
        color: resources.colors.white,
        // marginHorizontal: 10,
        textAlign: 'center',
        fontWeight: '600'
    },
    viewOrderBottom: {
        fontFamily: resources.fonts.bold,
        fontSize: 15,
        color: resources.colors.white,
        // marginHorizontal: 10,
        textAlign: 'center',
        fontWeight: '600'
    },
    viewSkipBottom: {
        fontFamily: resources.fonts.bold,
        fontSize: 15,
        color: resources.colors.appColor,
        // marginHorizontal: 10,
        textAlign: 'center',
        fontWeight: '600'
    },
    cardBoxText: {
        fontFamily: resources.fonts.regular,
        fontSize: 12,
        color: resources.colors.appColor,
        // marginHorizontal: 10,
        textAlign: 'center',
        fontWeight: '600'
    },
    cardBox: {
        marginTop: 10,
    },

    statusOrder: {
        fontFamily: resources.fonts.regular,
        fontSize: 12,
        color: resources.colors.grassGreen,
    },

    stepValue: {
        fontFamily: resources.fonts.regular,
        fontSize: 10,
        color: resources.colors.timerColor,
    },
    stepLabel: {
        fontFamily: resources.fonts.regular,
        fontSize: 12,
        color: resources.colors.grassGreen,
    },
    iconStyle: {
        width: 12,
        height: 12
    },
    separatorStyle: {
        height: 1,
        width: "100%",
        backgroundColor: resources.colors.sepratorWhite,
    },
    heightView: {
        // height: 32,
        // paddingBottom: 5
    },
    stepConStyle: {
        width: '50%'
    },
    verticalSep: {
        width: 2,
        height: 40,
        marginVertical: 10
    },
    cardStyle: {
        // flex:1,
        paddingHorizontal: 20,
        marginHorizontal: 10,
        flexDirection: 'row',
        // marginTop: 10,
        borderWidth:0,
        marginVertical: 6,
        paddingBottom: 10,

        backgroundColor: resources.colors.white,
        borderRadius: 6,
        shadowColor: "rgba(0,0,0,0.3)",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowRadius: 4,
        shadowOpacity: 0.3,
        elevation: 6,
    },
    leftHalfCon: {
        // height: '60%',
        width: '60%',
        flexDirection: 'column',
        marginTop: 10,
        justifyContent: 'space-between'
    },
    subCon: {
        width: '100%',
        // justifyContent: 'space-around'
    },
    btnMoreOption: {
        // width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: resources.colors.white,
        marginTop: 5,
    },
    btnSkipOptionButton: {
        // width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: resources.colors.white,
        marginTop: 10,
    },
    btnMoreOptionButton: {
        // width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: resources.colors.white,
        marginTop: 6
    },

    btnStyle: {
        borderRadius: 6,
        borderWidth: 1,
        borderColor: resources.colors.appColor,
        backgroundColor: resources.colors.appColor,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        // flex:1
    },
    btnStyleBottom: {
        borderRadius: 6,
        borderWidth: 1,
        borderColor: resources.colors.appColor,
        backgroundColor: resources.colors.appColor,
        height: 40,
        marginHorizontal: 8,
        alignItems: 'center',
        justifyContent: 'center',
        // flex:1
    },
    skipStyleBottom: {
        borderRadius: 6,
        borderWidth: 1,
        borderColor: resources.colors.appColor,
        backgroundColor: resources.colors.white,
        height: 40,
        marginHorizontal: 12,
        alignItems: 'center',
        justifyContent: 'center',
        // flex:1
    },
    btnWidth1: {
        width: '24%',
    },
    btnWidth3: {
        width: '40%',
    },
    btnWidth2: {
        width: '26%',
        marginHorizontal: 20,
    },
    btnWidth4: {
        width: '30%',
        marginVertical: 5
    },
    btnWidth41: {
        width: '48%',
        marginVertical: 5
    },
    btnWidth42: {
        width: '50%',
        marginLeft: '25%',
        marginHorizontal: 20,
    },
    btnWidth5: {
        width: '30%',
        marginHorizontal: 20,
    },
    btnWidth51: {
        width: '48%',
        marginHorizontal: 20,
    },
    btnWidth52: {
        width: '50%',
        marginLeft: '25%',
        marginHorizontal: 20,
    },
    btnWidth01: {
        width: 125,
        marginVertical: 4,
    },
    
    orderHeading: {
        color: resources.colors.black,
        fontFamily: resources.fonts.medium,
        fontSize: 12.5,
        textAlign: 'center',
    },
    listDataStyle: {
        color: resources.colors.labelColor,
        fontFamily: resources.fonts.medium,
        fontSize: 12,
        textAlign: 'center',
        margin: 5
    },
    listDataStyle1: {
        color: resources.colors.labelColor,
        fontFamily: resources.fonts.medium,
        fontSize: 12,
        textAlign: 'center',
    },
    dateStyle: {
        color: resources.colors.labelColor,
        fontFamily: resources.fonts.regular,
        fontSize: 10,
        lineHeight:16,
        textAlign: 'center',
    },
    inputStyle: {
        // marginTop: 5,
        // paddingBottom: 5
    },
    buttonContainer: {
        marginTop: 10,
        alignItems: 'center'
    },
    mainContainer: {
        marginHorizontal: 20,
        marginTop: 40,
        marginBottom: 20
    },
    selectAutoPayText: {
        fontFamily: resources.fonts.medium,
        fontSize: 16,
        color: resources.colors.timerColor,
        borderWidth: 0,
        textAlign: 'center',
        marginTop: 10,
        marginHorizontal: 20,
        lineHeight: 18
    },
    nachContainer: {
        marginHorizontal: 20,
        // marginTop: 15,
        marginBottom: 10
    },
    btnContainer: {
        marginTop: 0,
        flexDirection: 'column',
        justifyContent: 'space-around',
        // borderBottomWidth: 1,
        width: "100%",
        // borderBottomColor: "rgba(10,36,99,0.5)",
        // backgroundColor: resources.colors.white,
        // shadowColor: "#000",
        // shadowOffset: {
        //     width: 0,
        //     height: 1,
        // },
        marginTop: 40,
        // shadowOpacity: 0.22,
        // shadowRadius: 2.22,
        paddingHorizontal:5,
        // elevation: 5,
        marginBottom: 5,
        paddingTop: 10,
        paddingHorizontal: 10
    }, 
    instructionBoldText: {
        fontFamily: resources.fonts.bold,
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 6,
        color: resources.colors.textBlack,
    }, 
    instructionText: {
        textAlign: 'left',
        color: resources.colors.charcoalGrey,
        fontSize: 12,
        marginTop: 5,
        marginVertical: 0,
        borderWidth:0

    },
    instructionNachBoldText: {
        fontFamily: resources.fonts.bold,
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
        color: resources.colors.textBlack,
    }, 
    instructionNachText: {
        textAlign: 'center',
        color: resources.colors.charcoalGrey,
        fontSize: 13,
        marginVertical: 0,
        borderWidth:0

    },
    textInstruction: {
        color: resources.colors.textBlack,
        fontFamily: resources.fonts.regular,
        fontSize: 12,
        marginBottom: 2,
        // marginTop: 5,
    },

    coloum: {
        // justifyContent: 'space-between'
        flexDirection: 'column',
        marginBottom: 8
    },
    invoiceDetailsTitle: {
        fontFamily: resources.fonts.regular,
        fontSize: 12,
        color: resources.colors.labelColor,
        fontWeight: '700',
        // flex: 1,
        // marginBottom: 8,
        // width: 100
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
    invoiceSuccessDetails: {
        color: resources.colors.green,
        fontFamily: resources.fonts.regular,
        fontSize: 14,
        flex: 1,
        alignSelf: 'flex-start',
        // marginBottom: 10
        marginTop: 1
    },
    invoiceFailDetails: {
        color: resources.colors.red,
        fontFamily: resources.fonts.regular,
        fontSize: 14,
        flex: 1,
        alignSelf: 'flex-start',
        // marginBottom: 10
        marginTop: 1
    },
    rowDirection: {
        // flexDirection: 'row',
        flex: 1,
        justifyContent: 'flex-start',
    }, 
    currentNameView: { height: 57, justifyContent: 'center', alignItems: 'center' }
    , currentNameText: {
        fontFamily: resources.fonts.bold,
        fontSize: 18,
        color: resources.colors.bluishTwo
    },
    AddSkipBtn: {
        // justifyContent: 'center',
        // alignItems: 'center',
        height: isiPhoneX ? 80 : 60,
        borderTopWidth: 1,
        borderTopColor: "rgba(10,36,99,0.1)",
        backgroundColor: resources.colors.white,
        // marginHorizontal: -20
        // marginRight: -20
    },
    AddAutoPayBtn: {
        // justifyContent: 'center',
        // alignItems: 'center',
        height: isiPhoneX ? 100 : 80,
        borderTopWidth: 1,
        borderTopColor: "rgba(10,36,99,0.1)",
        backgroundColor: resources.colors.white,
        // marginHorizontal: -20
        // marginRight: -20
    },
    buttonStyle: {
        width: 335,
        height: 48,
        marginBottom: isiPhoneX ? 15 : 0,
        justifyContent: 'center',
        alignItems: 'center'
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
    generalContainer: {
        marginTop: 10,
        // borderTopWidth: 1,
        width: "100%",
        // borderTopColor: "rgba(10,36,99,0.1)",
        // backgroundColor: resources.colors.white,
        // shadowColor: "#000000",
        // shadowOffset: {
        //     width: 0,
        //     height: 3,
        // },
        // shadowOpacity: 0.22,
        // shadowRadius: 2.22,
        // elevation: 3,
    },
    generatInformation: {
        marginHorizontal: 20,
        flexDirection: 'column',
        marginBottom: 15
    },
    nameStyle: {
        fontFamily: resources.fonts.regular,
        fontWeight: '600',
        fontSize: 20,
        color: resources.colors.bluish,
    },
    nameStatusStyle: {
        fontFamily: resources.fonts.regular,
        fontWeight: '600',
        fontSize: 18,
        color: resources.colors.bluish,
        marginTop: 20
    },
    thankYou: {
        fontFamily: resources.fonts.regular,
        fontSize: 13,
        color: resources.colors.charcoalGrey,
        lineHeight: 18,
        letterSpacing: -0.31,
    },
    orderIdStyle: {
        fontFamily: resources.fonts.medium,
        fontSize: 20,
        color: resources.colors.timerColor,
        textAlign: 'center'
    },
    orderDetails: {
        fontFamily: resources.fonts.regular,
        fontSize: 13,
        color: resources.colors.timerColor,
        textAlign: 'center',
        marginLeft: 2
    },
    summerContainer: {
        marginTop: 10,
        // marginHorizontal: 20,
        flex: 1
    },
    summerText: {
        fontFamily: resources.fonts.regular,
        fontSize: 14,
        fontWeight: '600',
        color: resources.colors.timerColor,
        marginHorizontal: 20,
        marginTop: 10
    },
    dashStyle: {
        height: 1, width: '100%', borderRadius: 1, borderWidth: 1, marginTop: 10,
        borderColor: "rgba(0,0,0,0.3)",
        borderStyle: 'dashed', zIndex: 0
    },
})
export default styles