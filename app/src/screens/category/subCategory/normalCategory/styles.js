import { StyleSheet } from 'react-native';
import { widthScale, heightScale, isPlatformIOS, myWidth,myHeight } from '../../../../utility/Utils';
import resources from '../../../../../res';
const windowWidth = myWidth;
const windowHeight = myHeight;
const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        backgroundColor: resources.colors.white,
        // paddingTop: 15,
        padding:16
    },
    cellStyle: {
        height: !isPlatformIOS ? heightScale(187) : 180,
        minWidth: (myWidth / 2) - 25,
        maxWidth: (myWidth / 2) - 25,
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
        flexDirection: 'column',
        justifyContent: 'space-between',
        // marginBottom: 18,
        marginBottom: 18,
        borderWidth: 0,
        marginHorizontal: 10,
    },
    viewCard: {
        backgroundColor: resources.colors.white,
        height: !isPlatformIOS ? heightScale(187) : 180,
        width: '100%',
        // minWidth: (myWidth / 2) - 25,
        // maxWidth: (myWidth / 2) - 25,
        borderRadius: 8,
        alignSelf: 'center',
    },
    productImageStyle: {
        height: !isPlatformIOS ? heightScale(130) : 130,
        width: '100%',
        // backgroundColor: '#dddddd',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },

    priceStrikeTextStyle: {
        textDecorationLine: 'line-through', 
        textDecorationStyle: 'solid',
        color: resources.colors.timerColor,
        fontFamily: resources.fonts.regular,
        fontSize: 14,
        marginRight: 6
    },
    priceTextStyle: {
        color: resources.colors.timerColor,
        fontFamily: resources.fonts.bold,
        fontSize: 12,
    },
    priceFreqTextStyle: {
        color: resources.colors.textLight,
        fontFamily: resources.fonts.regular,
        fontSize: 10,
    },
    priceOffTextStyle: {
        fontFamily: resources.fonts.regular,
        fontSize: 10,
        marginTop: 0,
        // backgroundColor: resources.colors.grassGreen,
        paddingHorizontal: 6,
        marginHorizontal: 6,
        borderRadius: 2
    },
    priceOffText: {
        fontFamily: resources.fonts.bold,
        // fontStyle: 'italic',
        color: resources.colors.grassGreen,
        textAlign: 'center',
        paddingHorizontal: 10,
        marginHorizontal: 10,
        borderRadius: 2
    },

    heartImageStyle: {
        height: 25,
        width: 25,
        alignSelf: 'flex-end',
        marginRight: 0,
        marginTop: 0
    },
    textView: {
        width: '50%',
        textAlignVertical: 'center',
        padding: 10,
        color: '#000'

    },
    deliveryView : {
        flexDirection:'row'
    },

    rowDirection: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    nameTextStyle: {
        marginTop: 7,
        color: resources.colors.txtGetOTP,
        fontFamily: resources.fonts.bold,
        fontSize: 13,
        marginHorizontal: 10,
        height: !isPlatformIOS ? heightScale(22) : 20,
        borderWidth: 0,
    },
    viewPrice: {
        alignItems: 'center',
        marginHorizontal: 10,
        height: !isPlatformIOS ? heightScale(22) : 22,
        borderWidth: 0,
    },
    cornerView: {
        overflow: 'hidden', flexDirection: 'row',
        justifyContent: 'space-between', height: 60,
    },
    notifyView: {
        backgroundColor: resources.colors.blackAlpha,
        height: isPlatformIOS ? 180 : 190,
        width: widthScale(170),
        position: 'absolute',
        alignSelf: 'center',
        alignItems: 'flex-start',
        borderRadius: 8,
    },
    product:{
        margin:0,
        padding:10
    },
    explorButton:{
        width:'50%',
        borderRadius:10,
        borderColor:'#222222',
        borderWidth:2,
        borderStyle:'solid',
        height:50,
        alignItems:'center',
        justifyContent:'center',
        margin:2,
        marginTop:40,
    },
    explor:{
        color:'#222222',
        fontSize:16
    },
    texts:{
      fontSize:16,
      marginTop:10,
      color:'#9A9AA2',
    },
    text:{
      fontSize:22,
      marginTop:20,
      fontWeight:'700'
    },
    time:{
        fontSize:14,
        fontWeight:'600',
        fontFamily:resources.fonts.medium
    },
    image:{
        width:22,
        height:22,
        marginRight:5
    },
    price:{
        color:'#9A9AA2',
        fontSize:16,
        textDecorationLine:'line-through',
        fontFamily:resources.fonts.regular
    },
    buttonMain:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        width:'50%',
    },
    fontSize:{
        fontSize:20,
        fontFamily:resources.fonts.regular
    },
    flex:{
        flexDirection:'row',
        justifyContent:'space-between'
    },
    font:{
        color:'#71717A',
        fontSize:14,
        fontFamily:resources.fonts.regular
    },
    productImage:{
        padding:5,
        backgroundColor:'green',
        width:'30%',
        height:'8%',
        fontWeight:'600',
        fontSize:12,
        color:'white',
        borderRadius:5
    },
    
    imageMain:{
        width:windowWidth  - 35,
        height:250,
        flexDirection:'row'
    },
    likeMain:{
        flexDirection:'row',
        justifyContent:'space-between',
        //width:'89%',
        marginBottom:10,
        marginTop:10,
        
    },
});

export default styles;
