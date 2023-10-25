import { StyleSheet } from 'react-native'
import resources from '../../../res'
import res from '../../../res'
import { myWidth, isiPhoneX , statusBarHeight, isPlatformIOS, myHeight} from '../../utility/Utils'

const styles = StyleSheet.create({
    cardView: {
        // width: widthScale(161),
        minWidth: myWidth - 30,
        alignSelf: "center",
        height: 200,
        backgroundColor: res.colors.white,
        borderRadius: 20,
        shadowColor: "rgba(0, 0, 0, 0.2)",
        shadowOffset: {
            width: 1,
            height: 2,
        },
        shadowOpacity: 1,
        shadowRadius: 2,
        elevation: 5,
        paddingVertical: 17,
        justifyContent: 'space-between',
        margin: 5
    },
    labelBold: { 
        fontFamily: res.fonts.bold, 
        fontSize: 16, 
        color: "#302F30",
        
    },
    labelBold1:{
        fontSize: 12, 
        color: "#71717A",
        marginBottom: 10 
    },
    textPrice: {
        fontFamily: res.fonts.regular,
        fontSize: 14,
        color: res.colors.textBlack,
        marginVertical: 4,
        marginBottom : 16
    },
    image: { 
        width: '100%',
        marginVertical: 5
    },
    centerView: { 
        //alignItems: 'center' 
        marginLeft : 30
    },
    noOfItems: {
        fontFamily: res.fonts.regular, fontSize: 14,
        color: res.colors.textBlack
    },
    itemCount: {
        fontFamily: res.fonts.bold, fontSize: 13,
        color: '#71717A',
        marginTop: 3,
        marginBottom: 0
    },
    btnInStock: {
        height: 40, marginHorizontal: 0, backgroundColor: res.colors.appColor,
        borderColor: res.colors.appColor,
        width:'90%'
    },
    btnOutStock: {
        height: 40, marginHorizontal: 0, backgroundColor: res.colors.lightGreyTxt,
        borderColor: res.colors.lightGreyTxt,
        width:'90%'
    },
    fullScreen: {
        flex: 1,
        // backgroundColor: res.colors.white
    },
    viewProductHolder: {
        backgroundColor: res.colors.greyLightAlpha,
        borderWidth: 1,
        borderColor: res.colors.borderDashed,
        borderStyle: 'dashed',
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        width: '29.5%',
        marginLeft: '2%',
        marginBottom: 7,
        height: 160
    },
    textProduct: {
        color: res.colors.lightGreyTxt,
        fontFamily: res.fonts.regular,
        fontWeight: '600',
        fontSize: 10,
        borderWidth: 0,
        paddingHorizontal: 3,
        top: 10
    },
    container: {
        marginHorizontal: 20,
        marginVertical: 10,
        flex: 1,
    },
    titleText :{
        fontSize : 18,
        fontWeight : '500',
        fontFamily: resources.fonts.bold,
      },
      lblText1 : {
        fontSize : 18,
        fontWeight : '500',
        fontFamily: resources.fonts.bold,
      },
      lblText:{
        fontSize : 14,
        fontWeight : '400',
        fontFamily: resources.fonts.bold,
      },
      top:{
        marginTop : 10
      },
      row:{
        flexDirection:'row'
      },
    subTitle:{
        color:"#71717A",
        fontSize:14,
        fontWeight:'400',
        marginTop : 5
      },
      pageTitle:{
        color:'#222222',
        fontSize : 20,
        fontWeight:'500'
      },
    titleView: {
        flexDirection: 'row',
        marginBottom: 3,
        marginTop: 6,
        alignItems: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
    }
    ,
    textPlan: {
        fontFamily: res.fonts.bold,
        fontWeight: '500',
        fontSize: 25,
        color: res.colors.white,
        textAlign:'center'

    },
    txtCount: {
        fontFamily: res.fonts.regular,
        fontSize: 15,
        fontWeight: '500',
        color: res.colors.white,
        textAlign: 'center'
    },
    txtDescrip: {
        color: res.colors.white,
        fontFamily: res.fonts.regular,
        fontSize: 12,
        marginVertical: 3,
        textAlign: 'center'
    },
    txtSelection: {
        fontSize: res.fonts.bold,
        fontWeight: '600',
        color: res.colors.labelColor,
        fontSize: 17
    },
    txtSelectionCount: {
        fontSize: res.fonts.regular,
        color: res.colors.labelColor,
        fontSize: 12,
        marginVertical: 2,
    },
    verticalSlotsView: { 
        // backgroundColor: 'white', 
        borderWidth: 0, 
        marginBottom: 
        isiPhoneX ? 73 : 63 
    }
    , slotsContainer: {
        flexDirection: 'row', alignItems: 'center',
        flexWrap: 'wrap',
        flex: 1,
        justifyContent: 'flex-start',
        borderWidth: 0,
    },
    amountTxt: {
        color: res.colors.white,
        fontFamily: res.fonts.regular,
        fontSize: 14,
        marginTop: -2,
        // marginHorizontal: 10,
        textAlign: 'center',
        // flex: 1
    },
    btnStyle: {
        position: 'absolute', bottom: isiPhoneX ? 15 : 0,
        left: 0, right: 0
    },
    imgCover: {
        borderRadius: 6,
        width: '100%',
        height: '100%',
    },
    viewHolder: {
        flex: 1, alignItems: 'center', justifyContent: 'center'
    },
    containerLoaderStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewAddon: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
    viewRentalAmount: { 
        // flexDirection: 'row', 
        alignItems: 'center', 
        marginTop: 5, 
        paddingTop: 10,
        marginVertical: 5,
        flex: 1,
        // width: 200,
        height: 80,
        textAlign: 'center',
        paddingLeft:10,

        borderRadius : 1,
        width: '100%',
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: 'rgba(161,155,183,1)'
    },

    view: {
        justifyContent: 'flex-end',
        margin: 0,
        
        //marginLeft: '25%',
        // position: 'absolute',
        // right: 0,
        width: '100%',
        // backgroundColor: res.colors.white
        zIndex: isPlatformIOS ? 999 : 999,
        

    },
    fullScreenModal: {
        flex: 1,
        backgroundColor: res.colors.white,
        margin: 0,
        width: '100%',
        paddingTop: isPlatformIOS ? 20 : 0,
        //marginTop:'40%',
        marginTop:150
        
    },
    flex1: {
        flex: 1
    },
    rowDirection: {
        flexDirection: 'row',
    },
    specificationTextStyle: {
        fontFamily: res.fonts.bold,
        color: res.colors.textBlack,
        fontSize: 15,
        marginTop: 10
    },
    additonalAmountStyle: {
        fontFamily: res.fonts.bold,
        color: res.colors.txtGetOTP,
        fontSize: 15,
        marginTop: 10
    },
    titleTextStyle: {
        fontFamily: res.fonts.regular,
        color: "#222222",
        fontSize: 16,
        fontWeight: "600"
    },
    subTitleTextStyle: {
        fontFamily: res.fonts.bold,
        color: res.colors.textBlack,
        fontSize: 14,
        marginTop: 8
    },
    subTitleValueStyle: {
        color: res.colors.textBlack,
        fontSize: 10,
        marginTop: 5,
        fontFamily: res.fonts.regular,
        marginLeft: 0,
    },
    shareContainer: {
        flexDirection: 'row',
        marginRight: 30
    },
    headerContainer: {
        paddingTop: isiPhoneX ? 50 : isPlatformIOS ? 35 : 25,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    headerStyle: {
        position: 'absolute',
        left: 0, right: 0,
        top: 0, height: statusBarHeight + (isPlatformIOS ? 50 : 40),
        zIndex: 9999
    },
    iconStyleHeader: {
        height: 20,
        width: 20,
    },
    space: {
        width: 15
    },
    horizontalImageContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    backIconStyle: {
        height: 18,
        width: 22,
        marginLeft: 20
    },
    stretch: {
        flex: 1,
        alignSelf: "stretch"
    },
    marginTopBottom: {
        marginTop: 15,
    },
    margin: {
        marginTop: 5,
        marginHorizontal: 20
    },
    sectionHeader:{
        fontSize:20,
        fontFamily: res.fonts.bold,
        color:res.colors.textBlack,
        marginBottom:0,
        marginLeft:20,
        marginTop:0,
    },
    sectionSubHeader:{
        fontSize:14,
        fontFamily: res.fonts.regular,
        color:res.colors.labelColor,
        marginBottom:12,
        marginLeft:20,
        marginTop:0,
    },
    sectionHeaderUpgrade:{
        fontSize:20,
        fontFamily: res.fonts.bold,
        color:res.colors.textBlack,
        marginBottom:0,
        marginLeft:20,
        marginTop:10,
    },
    sectionSubHeaderUpgrade:{
        fontSize:14,
        fontFamily: res.fonts.regular,
        color:res.colors.labelColor,
        marginBottom:12,
        marginLeft:20,
        marginTop:0,
    },
    rowContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    appBackground: {
        // flex:1,
        backgroundColor: resources.colors.appColor,
        height: 250,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
     
        // marginTop: 90,

    },
    marginHorizontal: {
        position: 'absolute',
        top: isiPhoneX ? 80 : 70,
        left: 0,
        right: 0,
        bottom:0,
        marginHorizontal:20,
        marginVertical: 10,
        flex:1,
        // marginTop:100,flexGrow:1
    },

    backBtnBox: {
        backgroundColor: res.colors.white,
        paddingVertical: 6,
        paddingLeft: 4,
        width: 40,
        height: 40,
        borderTopLeftRadius: 6,
        borderBottomLeftRadius: 6,
        position: 'absolute',
        top: isPlatformIOS ? 20 : 0,
        right: isPlatformIOS ? 0 : 10,
        zIndex: 9999,
    },
    backBtnCont: {
        // borderColor: res.colors.appColor,
        // borderWidth: 5,
        // borderRadius: 100,
        width: 32,
        height: 32,
        // position:'absolute',
        // top:-40
    },
    crossIconStyle: {
        // justifyContent: 'center',
        // alignItems: 'center',
        // alignContent: 'center',
        marginTop: 3,
        marginLeft: 3,
        width: 30,
        height: 30
    },
})

export default styles