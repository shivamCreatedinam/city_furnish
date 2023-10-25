import { StyleSheet } from 'react-native';
import resources from '../../../res';
import { isiPhoneX } from '../../utility/Utils';
const styles = StyleSheet.create({
    fullScreen: {
        flex: 1,
        backgroundColor: resources.colors.white,
    },
    flex1: {
        flex: 1
    },
    borderClass:{
        borderWidth : StyleSheet.hairlineWidth,
        height : StyleSheet.hairlineWidth,
        backgroundColor:'#DDDDDF',
        borderColor : '#DDDDDF',
        marginTop:15,
        marginBottom : 15
      },
    grayText:{
        color:"#71717A"
    },
    amountText:{
        color:"#222222",
        fontSize:20
    },
    rowFirection: {
        flexDirection: 'row',
    },
    containerHeight: {
        paddingVertical: 10,
        marginTop: 15,
        backgroundColor: resources.colors.white,
        shadowColor: "#000000",
        shadowOffset: {
            width: 1,
            height: 1
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
        borderRadius: 6,
        marginHorizontal: 3,
        marginVertical: 2,
    },
    mainContainer: {
        marginHorizontal: 20,
        marginTop: 16,
        flex: 1
    },
    imgContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    seperator: {
        borderBottomColor: resources.colors.blackAlpha,
        borderBottomWidth: 0.2
    },
    cardNameStyle: {
        textAlign: 'center',
        justifyContent: 'center',
        alignSelf: "center",
        marginLeft: 21,
        fontFamily: resources.fonts.regular,
        fontWeight: '600',
        color: resources.colors.labelColor,
        fontSize: 14
    },
    checkBox: {
        alignSelf: 'center',
        marginRight: 20,
        height: 18,
        width: 18
    },
    iconStyle: {
        marginLeft: 12,
        alignSelf: 'center',
    },
    cartButtonContainer: {
        marginTop: 20
    },
    footerStyle: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row'
    },
    yourBalance: {
        fontFamily: resources.fonts.bold,
        fontSize: 14,
        lineHeight: 18,
        letterSpacing: -0.36,
        marginLeft: 10,
        color: resources.colors.textLight,
    },
    currentBalance: {
        fontFamily: resources.fonts.regular,
        fontSize: 14,
        lineHeight: 18,
        marginLeft: 45,
        color: resources.colors.timerColor,
    },
    totalStyle: {
        color: resources.colors.txtGetOTP,
        fontSize: 22,
        fontFamily: resources.fonts.regular,
        fontWeight: "600"
    },
    worthText: {
        fontFamily: resources.fonts.regular,
        fontSize: 13,
        lineHeight: 18,
        color: resources.colors.textLight,
        marginRight: 10
    },
    priceBoxContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 12
    },
    priceContainer: {
        height: 180,
        width: 162,
        padding:10,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: '#222222',
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderRadius: 6
    },
    spaceView: {
        width: 13
    },
    boxText: {
        fontFamily: resources.fonts.regular,
        fontSize: 12,
        lineHeight: 18,
        letterSpacing: -0.31,
        color: "#C0C0C6",
       // marginHorizontal: 10
       marginTop:10
    },
    boldText: {
        fontFamily: resources.fonts.bold,
        fontSize: 16,
        color: resources.colors.white,
        marginTop: 6,
        fontWeight:'600',
        marginTop:10
    },
    coinIcon: {
        height: 50, width: 50
    },
    marginHorizontal: {
        marginHorizontal: 20

    },
    tabBarTextStyle: {
        fontSize: 12,
        fontFamily: resources.fonts.regular,
    },
    container: {
        flex: 1
    },
    underlineStyle: {
        height: 3,
        backgroundColor: resources.colors.bluish,
        borderRadius: 3,
    },
    buttonView: {
        marginBottom: isiPhoneX ? 25 : 15
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
export default styles;