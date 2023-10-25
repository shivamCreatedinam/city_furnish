import { StyleSheet } from 'react-native';
import { myWidth, widthScale } from '../../../../utility/Utils';
import resources from '../../../../../res';
const styles = StyleSheet.create({
    MainContainer: {
        justifyContent: 'center',
        flex: 1,
        backgroundColor:'#f7f7f8'
    },
    titleText:{
        color:'#222222',
        fontSize:24,
        fontFamily : resources.fonts.bold
    },
    paddingClass : {
        padding : 12,
        backgroundColor:'#f7f7f8'
    },
    rowDirection: {
        flexDirection: 'row',
    },
    viewParent: {
        //flexDirection: 'row',
        marginVertical: 15,
        paddingHorizontal: 12,
    },
    titleTextStyle: {
        fontFamily: resources.fonts.regular,
        fontWeight: '500',
        color: "#71717A",
        fontSize: 14,

    },
    productImage: {
        height: 190,
        width: myWidth - 40,
        alignSelf: 'center',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        
        // borderWidth: 0.5,
        // borderColor: '#dddddd',
        // backgroundColor: '#dddddd',
    },
    border: {

        borderWidth: 0.5,
        borderColor: '#dddddd'
    },
    columnDirection: {
        flexDirection: 'column'
    },
    spaceContainer: {
        justifyContent: 'space-between',
    },
    subTitleTextStyle: {
        fontFamily: resources.fonts.bold,
        color: "rgb(28,28,28)",
        fontSize: widthScale(12),
        marginTop: widthScale(10)
    },
    seperator: {
        borderBottomColor: "rgba(10,36,99,0.1)",
        borderBottomWidth: 1,
        marginVertical: 5
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
        color: "#222222",
        fontFamily: resources.fonts.bold,
        fontSize: 18,
        fontWeight:'500'
    },
    priceFreqTextStyle: {
        color: resources.colors.textLight,
        fontFamily: resources.fonts.regular,
        fontSize: 18,
        fontWeight:'500'
    },
    priceOffTextStyle: {
        fontFamily: resources.fonts.regular,
        fontSize: 12,
        marginTop: 0,
        backgroundColor: resources.colors.grassGreen,
        paddingHorizontal: 6,
        marginHorizontal: 6,
        borderRadius: 2,
        marginLeft:10
    },
    deliveryView : {
        flexDirection:'row',
        marginTop:10
    },
    image:{
        width:25,
        height:25,
        marginRight:5
    },
    priceOffText: {
        fontFamily: resources.fonts.bold,
        // fontStyle: 'italic',
        color: resources.colors.white,
        textAlign: 'center',
        paddingHorizontal: 10,
        marginHorizontal: 10,
        borderRadius: 2,
        marginLeft:10
    },
    includedText: {
        color: resources.colors.timerColor,
        fontSize: 12,
        fontFamily: resources.fonts.bold,
        marginTop: 1
    },
    priceContainer: {
        flexDirection: 'row',
        marginTop: 0,
        marginLeft:10
    },
    moreImageStyle: {
        height: 55,
        width: 55,
        // width:50,
        // aspectRatio:1,
        maxHeight: 55,
        marginRight: 6,
        borderWidth: 1,
        borderColor: '#dddddd',
        borderRadius: 6,
        backgroundColor: '#dddddd'
    },
    plusImageStyle: {
        height: '100%',
        maxHeight: 55,
        width: 55,
        marginRight: 6,
        borderWidth: 1,
        borderColor: '#dddddd',
        borderRadius: 6,
        backgroundColor: '#dddddd'
    },
    plusViewStyle: {
        height: '100%',
        width: 55,
        maxHeight: 55,
        marginRight: 6,
        borderColor: '#dddddd',
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: resources.colors.blackAlpha
    },
    subContainer: {
        flexDirection: 'column',
        flex: 1,
        marginLeft: 0,
        backgroundColor:'white',
        borderBottomLeftRadius:10,
        borderBottomRightRadius:10,
        
    },
    divider: {
        height: 0.5,
        width: "100%",
        backgroundColor: "#EDEDEE",
    },

    spaceBtw: {
        justifyContent: 'space-between'
    },
    heartStyle: {
        width: 25,
        height: 25,
    },
    heartContainer: {
        // alignItems: 'center'
    },
    titleContainer: {
        borderWidth: 0,
        width: '90%',
        
    },
    subImageView: {
        //flexDirection: 'row', 
        //flex: 1,
        width: '100%', 
        //alignSelf: 'flex-start',
        marginTop: 10,
        alignItems: 'flex-start', 
        borderWidth: 0,
        backgroundColor:'white',
    },
    cornerView: {
        overflow: 'hidden', flexDirection: 'row',
        justifyContent: 'space-between', height: 60,
    }
});
export default styles;