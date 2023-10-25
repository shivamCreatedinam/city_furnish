import { StyleSheet } from 'react-native';
import { isiPhoneX , isPlatformIOS, myHeight, myWidth } from '../../../utility/Utils';
import resources from '../../../../res';
const styles = StyleSheet.create({
    fullScreen: {
        flex: 1,
        backgroundColor: resources.colors.white,
        // marginTop: 10
    },
    container: {
        flex: 1,
        marginHorizontal: 20,

    },
    subContainer: {
        flex: 1,
        marginBottom: isiPhoneX ? 25 : 10,
    },
    orderNumberText: {
        fontFamily: resources.fonts.medium,
        fontSize: 14,
        color: resources.colors.labelColor
    }, orderData: {
        fontFamily: resources.fonts.regular,
        fontSize: 12,
        color: resources.colors.labelColor
    },
    selectOrderView: {
        height: 48,
        borderBottomColor: resources.colors.sepratorWhite,
        borderBottomWidth: 1,
        justifyContent: 'center'
    }, selectOrderText: {
        fontFamily: resources.fonts.medium,
        fontSize: 16,
        color: resources.colors.timerColor,
        borderWidth: 0,
        textAlign: 'center',
        marginTop: 10,
        lineHeight: 18
    }, noteText: {
        fontFamily: resources.fonts.bold,
        fontSize: 12,
        color: resources.colors.timerColor
    }, kycLinkedInText: {
        marginTop: 8,
        fontFamily: resources.fonts.regular,
        fontSize: 10,
        color: resources.colors.timerColor,
        lineHeight: 18
    }, kycRatingText: {
        marginTop: 8,
        fontFamily: resources.fonts.regular,
        fontSize: 10,
        color: resources.colors.timerColor,
        lineHeight: 18
    }, kycOrderFulfillmentText: {
        marginTop: 8,
        fontFamily: resources.fonts.regular,
        fontSize: 10,
        color: resources.colors.timerColor,
        lineHeight: 18
    }, uploadDocumentView: {
        minHeight: 140,
        marginBottom: 10,
        // maxHeight: 240
        // height:240
    }, uploadAreaView: {
        borderColor: resources.colors.labelColor,
        borderStyle: 'dashed',
        borderWidth: 1,
        // height: 121,
        borderRadius: 6,
        marginTop: 7,

        // flex:1,

        // backgroundColor:'red',
        //  width:335
    },  uploadInnerAreaView: {
        borderColor: resources.colors.labelColor,
        borderStyle: 'dashed',
        borderWidth: 1,
        // height: 121,
        borderRadius: 6,
        marginTop: 7,
        // flex: 1,
        // flexDirection: 'row'
    }, docText: {
        fontFamily: resources.fonts.bold,
        fontSize: 16,
        color: resources.colors.labelColor,
        marginTop: 2
    }, suppoer_Doc_text: {
        fontFamily: resources.fonts.regular,
        fontSize: 12,
        color: resources.colors.labelColor,
        marginRight: 8
    }, chooseFileText: {
        fontFamily: resources.fonts.bold,
        fontSize: 16,
        color: resources.colors.darkSkyBlue
    }, max10MbText: {
        fontFamily: resources.fonts.bold,
        fontSize: 10,
        color: resources.colors.warmGrey
    }, chooseFile: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    }, 
    paddingClass:{
        padding:16
    },
    buttonStyle: {
        width: 335,
        height: 48
    },
    stepText:{
        color:"#9A9AA2"
    },
    subText:{
        color:"#9A9AA2",
        fontSize:14,
        fontFamily:resources.fonts.regular
    },
    submitView: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 5,
        padding:16
    }, errorText: {
        color: 'red',
        height: 20
    }, currentNameView: { height: 25 }
    , currentNameText: {
        fontFamily: resources.fonts.bold,
        fontSize: 18,
        color: "#45454A"
    }, crossView: {
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'space-between',
        borderWidth: 0,
        height: 25,


    }, crossIcon: { width: 15, height: 15, alignSelf: 'center' }, 
    crossInnerView: {
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'space-between',
        borderWidth: 0,
        height: 25,
    }, 
    crossInnerIcon: { 
        width: 15, 
        height: 15, 
        alignSelf: 'flex-end',
        position: 'absolute',
        right: 4 
    },
    backGroundImage: {
        height: 119,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        borderRadius: 10
    },
    backGroundInnerImage: {
        height: 119,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        borderRadius: 10,
        marginBottom: 10
    },
    infoView: {
        alignSelf: 'flex-end', padding: 4,
        alignItems: 'center', justifyContent: 'center',
        height: 20, width: 20,
        backgroundColor: 'white'
    },
    docTitleView: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between', borderWidth: 0
    },
    infoImgStyle: { width: 18, height: 18, },
    docView: {
        flex: 1,
        width: '100%',
        borderRadius: 6,
    },
    errorText: {
        color: 'red',
        fontFamily: resources.fonts.regular
    },
    errorDocumentText: {
        color: 'red',
        fontFamily: resources.fonts.regular,
        height: 20,
        marginTop: -15
    },
    documentSection: {
        paddingHorizontal: 12,
        marginBottom:20,
        marginHorizontal: 1,
        borderRadius: 10,
        backgroundColor: resources.colors.white,
        shadowColor: "rgba(0,0,0,0.9)",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowRadius: isPlatformIOS ? 3 : 6,
        shadowOpacity: isPlatformIOS ? 0.5 : 1,
        elevation: isPlatformIOS ? 3 : 6,
    },

    view: {
        justifyContent: 'center',
        margin: 0,
        // position: 'absolute',
        // right: 0,
        width: '100%',
        // backgroundColor: res.colors.white
        zIndex: isPlatformIOS ? 999 : 999
    },
    fullScreenModal: {
        flex: 1,
        backgroundColor: resources.colors.white,
        margin: 0,
        width: '100%',
        paddingTop: isPlatformIOS ? 20 : 0
    },
    backBtnBox: {
        backgroundColor: resources.colors.white,
        paddingVertical: 6,
        paddingLeft: 4,
        width: 40,
        height: 40,
        borderTopLeftRadius: 6,
        borderBottomLeftRadius: 6,
        position: 'absolute',
        top: isPlatformIOS ? 20 : 0,
        right: isPlatformIOS ? 0 : 0,
        zIndex: 9999,
    },
    backBtnCont: {
        borderColor: resources.colors.appColor,
        borderWidth: 5,
        borderRadius: 100,
        width: 32,
        height: 32,
    },
    crossIconStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        marginTop: 3,
        marginLeft: 3,
        width: 15,
        height: 15
    },
    containerImage: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoView: {
        width: myWidth,
        height: myHeight - 40,
        marginVertical: 25,
        // marginTop: myHeight/ 2 - 100,
        resizeMode: 'contain'
    },
    uploadSection: {
        borderColor: resources.colors.borderDot,
        borderStyle: 'dashed',
        borderWidth: 2,
        borderRadius: 6,
        backgroundColor: resources.colors.viewGray,
        padding: 20, marginBottom: 25
    },
    uploadView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-between',
    },
    uploadTitleText: {
        fontSize: resources.fonts.medium,
        fontSize: 16,
        color: resources.colors.headingBlack,
        fontWeight: '500'
    },
    uploadDetailText: {
        fontSize: resources.fonts.regular,
        fontSize: 12,
        color: resources.colors.grayColor,
        fontWeight: '400'
    },
    btnUpload: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: resources.colors.titleBlack,
    },
    btnUploaded: {
        backgroundColor: resources.colors.uploadedGreen,
    },
    btnUploadText: {
        color: resources.colors.uploadedText, fontSize: 12, fontWeight: '500', textAlign: 'left'
    }
})
export default styles
