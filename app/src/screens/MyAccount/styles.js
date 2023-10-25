import { StyleSheet, } from 'react-native';
import resources from '../../../res';
import {isiPhoneX} from '../../utility/Utils'
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: resources.colors.white,
    },
    flex1: {
        flex: 1,
        backgroundColor: resources.colors.white,
    },
    paddingView:{
        padding : 16
    },
    title : {
        color:'#71717A',
        fontSize : 12
    },
    directionRow:{
        justifyContent:'space-between',
        flexDirection:'row'
    },
    mainTitle:{
        color:'#45454A',
        fontSize : 16,
        fontWeight : "500",
        fontFamily:resources.fonts.medium
    },
    rowDirection: {
        flexDirection: 'row'
    },
    columnDirection: {
        flexDirection: 'column'
    },
    marginHorizontal: {
        position: 'absolute',
        top: isiPhoneX ? 100 : 80,
        left: 0,
        right: 0,
        bottom:0,
        marginHorizontal:20,
        flex:1,
        // marginTop:100,flexGrow:1
    },
    appBackground: {
        // flex:1,
        backgroundColor: resources.colors.appColor,
        height: 230,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
     
        // marginTop: 90,

    },
    cardStyle: {
        height: 55,
        borderRadius: 6,
        flexDirection: 'row',
        backgroundColor: resources.colors.white,
        // marginTop: 15,
        marginVertical: 7,
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 9999,
    },
    arrowStyle: {
        marginRight: 14
    },
    textStyle: {
        marginLeft: 21,
        alignSelf: 'center',
        fontSize: 14,
        fontWeight: '500',
        justifyContent: 'center',
        color: "rgb(106,106,106)"
    },
    textCityStyle: {
        alignSelf: 'center',
        fontSize: 14,
        fontFamily:resources.fonts.bold,
        justifyContent: 'center',
        color: "rgb(106,106,106)",
        marginRight:10,
    },
    iconStyle: {
        alignSelf: 'center',
        justifyContent: 'center',
        width:32,
        height : 32
    },
    iconStyleArrow: {
        alignSelf: 'center',
        justifyContent: 'center',
        width:20,
        height : 20
    },
    borderClass:{
        borderWidth : StyleSheet.hairlineWidth,
        height : StyleSheet.hairlineWidth,
        backgroundColor:'#DDDDDF',
        borderColor : '#DDDDDF',
        marginLeft : 16,
        marginRight:16
      },
    iconBackCon: {
        height: 36,
        width: 36,
        borderWidth: 0.5,
        alignSelf: 'center',
        marginLeft: 8,
        borderRadius: 6,
        justifyContent: 'center',
        borderColor: "rgb(221,221,221)",
        backgroundColor: resources.colors.white,
    }
})
export default styles;