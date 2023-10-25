import { StyleSheet } from 'react-native'
import resources from '../../../res'
import { isiPhoneX, isPlatformIOS, myWidth } from '../../utility/Utils';
const styles = StyleSheet.create({
    fullScreen: {
        flex: 1,
        backgroundColor: resources.colors.white,
        // marginTop: -5

    }, container: {
        flex: 1,
        marginHorizontal: 10,
        // marginTop: 5,
        // backgroundColor: 'red'

    }, editContainer: {
        flex: 1,
        marginHorizontal: 20,
        marginTop: 5,
        // backgroundColor: 'red'
    }, listAddressContainer: {
        flex: 1,
        marginHorizontal: 5
    },

    tabStyle: {},
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
        marginVertical: 5,
        borderWidth:0
        // backgroundColor: '#dddddd'

    }, fontStyleSelected: {
        fontFamily: resources.fonts.bold,
        color: resources.colors.textLight,
        fontSize: 16,
    }, fontStyle: {
        fontFamily: resources.fonts.regular,
        fontSize: 14,
        color: "#71717A",
        lineHeight: 18,
        marginTop:10

    }, chechbox: {
        // backgroundColor: 'pink',
        width: '10%', alignItems: 'center', marginTop: 7 

    }, defaultAddress: {
        flexDirection: 'row',
        marginTop: 8,
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
        flex: 1,
    },
    imageThumbnail: {
        justifyContent: 'space-between',
        // alignItems: 'center',
        marginTop: 20,
        marginHorizontal: 5,
        borderRadius: 5,
        minHeight: 85,
        // backgroundColor: resources.colors.white,
        // shadowColor: "#000000",
        // shadowOffset: {
        //     width: 2,
        //     height: 2,
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 3.84,
        // elevation: 5,
    }, userNameText: {
        fontFamily: resources.fonts.bold,
        color: "#71717A",
        fontSize: 16,
        fontWeight:'500'
    },
    defaultTxt: {
        fontFamily: resources.fonts.bold,
        fontSize: 11
    },
    AddAddreesBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        height: isiPhoneX ? 90 : 70,
        borderTopWidth: 1,
        borderTopColor: "rgba(10,36,99,0.1)",
        backgroundColor: resources.colors.white,
        marginHorizontal: -20
    },
    buttonStyle: {
        width: 335,
        height: 48,
        marginBottom: isiPhoneX ? 15 : 0,
        justifyContent: 'center',
        alignItems: 'center'
    }, cityLabel: {
        marginTop: 10,
        // width: '85%',
        fontSize: 15,
        color: resources.colors.labelColor,
        fontFamily: resources.fonts.bold
    }, AddAddreesContainer: {
        height: isiPhoneX ? 100 : 80,
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: 'red',
        justifyContent: 'center',
        // paddingHorizontal: 20,
        // backgroundColor: "white",
        shadowColor: "#000000",
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginHorizontal: -20
    },
    viewEdit: {
        width: '20%',
        marginTop: 7,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    editTouchView:{ flex: 1, alignItems: 'center' },
    chechboxImage:{ width: 20, height: 20 },
    divider:{ backgroundColor: resources.colors.labelColor, width: 1, height: 27 },
    mapBox:{
        flex:1,
        marginVertical: 5
    },
    panelHeader: {
    //add custom header
    },
    panelFill: {
        // position: "absolute",
        // top: 0,
        alignSelf: "stretch",
        // right: 0,
        // left: 0,
    },
    panel: {
        // position: "absolute",
        // top: 0,
        alignSelf: "stretch",
        // right: 0,
        // left: 0,
        flex: 1
    },
    panelBtnHeader: {
        //add custom header
        zIndex: isPlatformIOS ? 9999 : 9999,
        // flex: 1,
        position: 'absolute',
        // width:'100%',
        marginTop: 0,
        bottom: 0,
        top:0,
        right: 0
    },
    panelMapButton: {
      width: 120,
      height: 40,
      alignSelf: "center",
      alignItems: "center",
      backgroundColor: resources.colors.white,
    //   borderColor: resources.colors.appColor,
    //   borderWidth: 1,
      borderRadius: 4,
      shadowColor: "rgba(0,0,0, .4)", // IOS
      shadowOffset: { height: 1, width: 1 }, // IOS
    //   shadowOpacity: 1, // IOS
      shadowRadius: 1, //IOS
      elevation: 2, // Android 
    },
    mapBtnText: {
      color: resources.colors.appColor,
      fontSize: 16,
      paddingVertical: 8,
    },
    iconSearchStyle: {
        padding: 10,  
        borderRightColor: resources.colors.appColor, 
        borderRightWidth: 1
    },
    errorText: {
        color: 'red',
        height: 20,
        // fontFamily:res.fonts.regular
    },
    labelText: {
        color: resources.colors.labelColor,
        fontFamily: resources.fonts.regular,
        height: 20,
        fontSize: 14
        // fontFamily:res.fonts.regular
    },
    panelFillOuter: {
        // position: "absolute",
        // top: 0,
        alignSelf: "stretch",
        // right: 0,
        // left: 0,
    },
    panelUpperOuter: {
        // position: "absolute",
        // top: 0,
        alignSelf: "stretch",
        // right: 0,
        // left: 0,
        flex: 1,
        marginTop: 10
    },
    panelOuter: {
        // position: "absolute",
        // top: 0,
        alignSelf: "stretch",
        // right: 0,
        // left: 0,
        flex: 1
    },
    panelHeaderOuter: {
      //add custom header
    },
    dashedBorder:{
        borderWidth:StyleSheet.hairlineWidth,
        borderStyle: 'dashed',
        borderColor:'#DDDDDF',
        marginTop:15,
        marginBottom:20
       
    },
    panelBtnHeaderOuter: {
      //add custom header
      zIndex: isPlatformIOS ? -1 : 99,
      // flex: 1,
      // position: 'absolute',
      // width:'100%',
      marginTop: 20,
      // bottom: 0,
      // top:0
    //   shadowColor: "rgba(255,255,255, 1)", // IOS
    //   shadowOffset: { height: 1, width: 1 }, // IOS
    //   shadowOpacity: 1, // IOS
    //   shadowRadius: 2, //IOS
    //   elevation: 6, // Android
    },
    panelORHeaderOuter: {
      //add custom header
      zIndex: isPlatformIOS ? -1 : 99,
      // flex: 1,
      // position: 'absolute',
      // width:'100%',
      // bottom: 0,
      marginTop: 10
      // top:0
    },
    panelMapButtonOuter: {
        width: "60%",
        height: 40,
        alignSelf: "center",
        alignItems: "center",
        backgroundColor: resources.colors.white,
        // borderColor: resources.colors.appColor,
        // borderWidth: 1,
        borderRadius: 8,
        shadowColor: "rgba(0,0,0, .4)", // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
        elevation: 2, // Android 
    },
    panelMapButtonOuter1: {
        width: "60%",
        height: 40,
        alignSelf: "flex-start",
        //alignItems: "center",
        //backgroundColor: resources.colors.white,
        // borderColor: resources.colors.appColor,
        // borderWidth: 1,
        // borderRadius: 8,
        // shadowColor: "rgba(0,0,0, .4)", // IOS
        // shadowOffset: { height: 1, width: 1 }, // IOS
        // shadowOpacity: 1, // IOS
        // shadowRadius: 1, //IOS
        // elevation: 2, // Android 
    },
    mapInputOuter: {
        marginBottom: 5,
        width: "90%",
        minHeight: 60,
        alignSelf: "center",
        borderColor: "lightgrey",
        borderWidth: 1.5,
        fontSize: 15,
        borderRadius: 5,
        flex: 0.5,
        alignContent: "flex-start",
        textAlignVertical: "top",
        color: resources.colors.white,
        paddingLeft: 15
    },
    mapButtonOuter: {
        width: "40%",
        height: 40,
        alignSelf: "center",
        alignItems: "center",
        backgroundColor: resources.colors.white,
        borderRadius: 8,
        shadowColor: "rgba(0,0,0, .4)", // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
        elevation: 2, // Android 
    },
    mapBtnTextOuter: {
        color: resources.colors.appColor,
        fontSize: 16,
        paddingVertical: 8,
    },
    mapBtnTextOuter1: {
        color: "#257B57",
        fontSize: 16,
        //paddingVertical: 8,
    },
    
    mapORTextOuter: {
        color: resources.colors.appColor,
        fontSize: 16,
        textAlign: 'center'
    },
    searchIconOuter: {
        padding: 12, 
        borderRightColor: resources.colors.appColor, 
        // borderRightWidth: 1
    },
    addressButtonContainer: {
        flex: 1,
        // flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        width: "100%",
        borderTopColor: "rgba(10,36,99,0.1)",
        alignItems: 'center',
        height: isPlatformIOS ? 75 : 65,
        backgroundColor: resources.colors.white,
        position: "absolute",
        bottom: 0,
        zIndex: 9999,
        paddingHorizontal: 20
    },
    addressFooterStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    stylePriceSection: {
        // height: heightScale(48),
        width: myWidth/2 - 20,
        marginTop: 10,
        height: 48,
        marginRight: 10,
        justifyContent: "center",
        alignItems: "center",
        borderColor: resources.colors.appColor,
        color: resources.colors.appColor,
        alignSelf: "stretch",
        marginBottom: isPlatformIOS ? 15 : 10,
        borderRadius: 4

    },
    proceedSection: {
        // width: 140,
        width: myWidth - 30,
        marginTop: 10,
        height: 45,
        justifyContent: "center",
        alignItems: "center",
        borderColor: resources.colors.appColor,
        color: resources.colors.white,
        alignSelf: "stretch",
        marginBottom: isPlatformIOS ? 5 : 10,
        borderRadius: 4
    },
    footerStyleColumn: {
        flex: 1,
        alignContent: 'center', 
        alignItems: 'center', 
        alignSelf: 'center',
        flexDirection: 'row',
        marginTop: 30,
        marginLeft: 0
    },
    footerStyle: {
        flex: 1,
        // alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        marginRight: 10,
        marginLeft: 10
    },
    chooseDuration: {
        textAlign: 'center',
        fontSize: 18,
        // justifyContent: 'center',
        // alignItems: 'center',
        color: "rgb(28,28,28)",
        fontFamily: resources.fonts.regular,
        fontWeight: "600"
    },
    totalStyle: {
        color: "rgb(45,109,154)",
        fontSize: 20,
        fontFamily: resources.fonts.bold,
        fontWeight: "600",
        textAlign: 'left',
        // justifyContent: 'center',
        // alignItems: 'center',
        marginTop: isPlatformIOS ? 10: 0,
        flex: 1,
    },
    descStyle: {
        color: "rgb(45,109,154)",
        fontSize: 13,
        fontFamily: resources.fonts.regular,
        textAlign: 'left',
        flex: 1,
        marginLeft: 10,
        marginTop: 0
    },
});

export default styles;
