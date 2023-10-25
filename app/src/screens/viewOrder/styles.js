import { StyleSheet } from 'react-native'
import resources from '../../../res'
import { isiPhoneX, heightScale } from '../../utility/Utils';


const styles = StyleSheet.create({
    fullScreen: {
        flex: 1,
        backgroundColor: resources.colors.white
    },
    container: {
        flex: 1,
        marginHorizontal: 20
    },
    generalContainer: {
        marginTop: 10,
        // borderTopWidth: 1,
        width: "100%",
        // borderTopColor: "rgba(10,36,99,0.1)",
        backgroundColor: resources.colors.white,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    generatInformation: {
        marginHorizontal: 20,
        flexDirection: 'column',
        marginBottom: 15
    },
    nameStyle: {
        fontFamily: resources.fonts.regular,
        fontWeight: '600',
        fontSize: 22,
        color: resources.colors.bluish,
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
        fontSize: 13,
        color: resources.colors.timerColor
    },
    orderDetails: {
        fontFamily: resources.fonts.regular,
        fontSize: 13,
        color: resources.colors.timerColor,
        marginLeft: 2
    },
    summerContainer: {
        marginTop: 10,
        // marginHorizontal: 20,
        flex: 1
    },
    summerText: {
        fontFamily: resources.fonts.medium,
        fontSize: 16,
        fontWeight: '600',
        color: "#45454A",
        marginHorizontal: 20,
        marginTop: 10
    },
    imageThumbnail: {
        justifyContent: 'center',
        marginVertical: 10,
        marginHorizontal: 20,
        borderRadius: 5,
        padding: 10,
        minHeight:heightScale(85),
        backgroundColor: resources.colors.white,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    cell: {
        flex: 1,
        justifyContent: 'space-between',
    },
    row: {
        flex: 1,
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center',

    },
    orderOption: {
        fontFamily: resources.fonts.regular,
        fontSize: 14,
        color: resources.colors.labelColor,
        fontWeight:'400'
    },
    orderOption1: {
        fontFamily: resources.fonts.regular,
        fontSize: 16,
        color: "#45454A",
        fontWeight:'400'
    },
    orderData: {
        fontFamily: resources.fonts.regular,
        fontSize: 12,
        color: resources.colors.timerColor,
        fontWeight:'400'
    },
    titleText:{
        color:"#45454A",
        fontSize:20,
        fontWeight:'500',
        fontFamily:resources.fonts.medium,
    //     textAlign: 'justify',
    // lineHeight: 30,

    },
    paddingClass:{
        padding:16
    },
    iconStyle: {
        width: 12,
        height: 12,
        
    },
    marginTop:{
        marginTop : 20
    },
    iconOrder:{
        width:30,
        height:30
    },
    row1: {
        flexDirection: "row",
        justifyContent:'space-between'
        
    },
    detailText :{ 
        color:'#45454A',
        fontSize:12,
        fontWeight:'400',
        fontFamily : resources.fonts.regular
    },
    subText:{
        color:'#222222',
        fontSize:16,
        fontWeight:'500',
        fontFamily : resources.fonts.medium
    },
    flexDirection:{
        flexDirection:'row',
    },
    borderClass:{
        borderWidth : StyleSheet.hairlineWidth,
        height : StyleSheet.hairlineWidth,
        backgroundColor:'#DDDDDF',
        borderColor : '#DDDDDF',
        marginLeft : 16,
        marginRight:16,
        marginTop:15,
        marginBottom:15
      },
    iconStyleArrow: {
        alignSelf: 'center',
        justifyContent: 'center',
        width:20,
        height : 20
    },
    leftClass:{
        marginLeft : 10
    },
    cellStyle: {
        flex: 1
    },
    userNameText: {
        fontFamily: resources.fonts.bold,
        color: resources.colors.bluish,
        fontSize: 15,
        lineHeight: 18
    },
    fontStyle: {
        fontFamily: resources.fonts.regular,
        fontSize: 12,
        marginVertical:3,
        color: resources.colors.textBlack,
        lineHeight: 18
    },
    defaultText: {
        marginLeft: 20,
        fontFamily: resources.fonts.regular,
        fontSize: 16,
        color: resources.colors.textLight
    },
    orderValuesText: {
        fontFamily: resources.fonts.regular,
        fontSize: 12,
        color: "rgb(28,28,28)",
        marginTop: 12,
        alignSelf: 'flex-end'
    },
    detailCard: {
        flex: 1,
        // height: 220,
        width: "100%",
        marginTop: 10,
        backgroundColor: resources.colors.white,
        flexDirection: 'row',
        borderRadius: 6,
        marginBottom: isiPhoneX ? 25 : 15,
        shadowColor: "rgba(0,0,0,0.3)",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowRadius: 4,
        shadowOpacity: 0.3,
        elevation: 6,
    },
    orderCardContainer: {
        // marginHorizontal: 10,
        flex: 1,
    },
    orderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 10,
    },
    seprator: {
        borderBottomColor: "rgba(54,69,79,0.5)",
        borderBottomWidth: 0.5,
        marginVertical: 10
    },
    moreSummery: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewMoreText: {
        fontFamily: resources.fonts.bold,
        fontSize: 12,
        color: resources.colors.bluish,
        textDecorationLine: 'underline',
    },
    mainText: {
        fontFamily: resources.fonts.bold,
        fontSize: 12,
        color: resources.colors.txtGetOTP,
        flexWrap: 'wrap'
    },
    orderSummeryContainer: {
        flex: 1,
    },
    orderSummeryText: {
        fontFamily: resources.fonts.regular,
        fontSize: 10,
        color: "rgb(28,28,28)",
        marginTop: 10
    },
    defaultTxt: {
        fontFamily: resources.fonts.bold,
        fontSize: 12,
        color: resources.colors.black
    },
    viewCard: {
        marginVertical: 5,
        width: "90%",
        flex: 1,
        alignSelf: 'center',
        borderRadius: 6,
        backgroundColor: resources.colors.white,
        // marginTop: 10,
        // shadowColor: "rgba(0,0,0,0.8)",
        // shadowOffset: {
        //     width: 1,
        //     height: 0,
        // },
        // shadowRadius: 4,
        // shadowOpacity: 0.3,
        // elevation: 6,
        // borderWidth:0,
        // paddingVertical:3
    },
    viewImageCard: {
        flexDirection: 'row',
    },
    frpViewCard: {
        marginVertical: 5,
        // marginHorizontal:5,
        width: "90%",
        flex: 1,
        borderRadius: 6,
        backgroundColor: resources.colors.white,
        flexDirection: 'row',
        // shadowColor: "rgba(0,0,0,0.8)",
        // shadowOffset: {
        //     width: 1,
        //     height: 0,
        // },
        // shadowRadius: 2,
        // shadowOpacity: 0.3,
        // elevation: 6,
    },
    imageStyle: {
         height: 60,
        width: 64,
        borderTopLeftRadius: 6,
        borderBottomLeftRadius: 6,
        borderRadius:10,
    },
    frpImageStyle: {
        height: 60,
        width: 64,
        borderTopLeftRadius: 6,
        borderBottomLeftRadius: 6,
        borderRadius:10,
    },
    cardContainer: {
        flexDirection: 'column',
        marginHorizontal: 10,
        // marginTop: 10,
        flex: 1,
        // backgroundColor:'white',
        paddingVertical:0
        // borderWidth:1,
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    titleName: {
        color: "#9A9AA2",
        fontSize: 14,
        fontFamily: resources.fonts.bold,
        borderWidth:0,
        marginTop:0
        // width: "80%"
    },
    titleName1: {
        color: "#45454A",
        fontSize: 14,
        fontFamily: resources.fonts.bold,
        borderWidth:0,
        marginTop:0
        // width: "80%"
    },
    valuesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // marginTop: 2,
        marginBottom: 5
    },
    subTitleName: {
        fontFamily: resources.fonts.regular,
        fontSize: 11,
        color: "#71717A",
        marginTop: 6
    },
    orderPropText: {
        fontFamily: resources.fonts.regular,
        fontSize: 12,
        color: "#71717A",
        marginTop: 12,
    },
    seprator1: {
        height: 1,
        width: "100%",
        backgroundColor: "rgba(54,69,79,0.5)",
        // marginTop: 15,
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        alignItems: 'center',
        height: 40,
        marginBottom: 5,
        marginTop:4,
        borderTopWidth:1,
        borderColor:'rgba(54,69,79,0.5)'
    },
    totalTextStyle: {
        fontFamily: resources.fonts.bold,
        fontSize: 12,
        color: "rgb(28,28,28)",
        marginTop: 10
    },
    dashStyle: {
        height: 1, width: '100%', borderRadius: 1, borderWidth: 1, marginTop: 10,
        borderColor: "rgba(0,0,0,0.3)",
        borderStyle: 'dashed', zIndex: 0
    },
    ActivityIndicatorStyle: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',

    }
})
export default styles