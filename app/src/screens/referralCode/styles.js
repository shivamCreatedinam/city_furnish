import { StyleSheet } from 'react-native';
import { heightScale, isiPhoneX, myWidth } from '../../utility/Utils';
import resources from '../../../res';
const styles = StyleSheet.create({
    fullScreen: {
        flex: 1,
        backgroundColor: resources.colors.white,
    },
    paddingClass:{
        padding:16
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
      pageTitle1:{
        color:'#222222',
        fontSize : 20,
        fontWeight:'500',
        marginTop:5
      },
    container: {
        width:200,
        marginTop: heightScale(20),
        // alignItems: 'center'
    },
    backgroundImage: {
        width:myWidth - 30,
        height:myWidth -30,
        
    },
    haveYourFriendText: {
        fontFamily: resources.fonts.regular,
        fontSize: 16,
        textAlign: "left",
        color: resources.colors.white,
        marginLeft:30,
        fontWeight:'400'
        // textShadowColor: 'rgba(0, 0, 0, 0.5)',
        // textShadowOffset: { width: 3, height: 3 },
        // textShadowRadius: 4
    },
    shareYourReferral: {
        fontFamily: resources.fonts.regular,
        fontSize: 12,
        textAlign: "left",
        color: "#DDDDDF",
        marginTop: heightScale(11),
        marginLeft:30,
        // textShadowColor: 'rgba(0, 0, 0, 0.5)',
        // textShadowOffset: { width: 2, height: 2 },
        // textShadowRadius: 4
    },
    coinsIconStyle: {
        width: 33,
        height: 33,
        marginTop: 30
    },
    coinsPriceText: {
        fontFamily: resources.fonts.bold,
        fontSize: 24,
        color: resources.colors.white,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 3, height: 3 },
        textShadowRadius: 4
    },
    yourRefeCodeText: {
        fontFamily: resources.fonts.regular,
        fontSize: 16,
        color: "#71717A",
        marginTop: 42,
        marginLeft : 25
    },
    buttonStyle: {
        width: 100,
        borderWidth: 3,
        borderRadius:100,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
        borderColor: "black",
        alignSelf: 'center',
        // marginBottom: 20,
    },
    copyCodeContainer: {
        flexDirection: 'row',
        marginTop: heightScale(15),
        justifyContent: 'center',
        alignItems: 'center'
    },
    referralCodeStyle: {
        height: 44,
        width: 150,
        marginTop:16,
        marginLeft : 13
        // borderColor: resources.colors.white,
        // borderStyle: 'dashed',
        // borderWidth: 2,
        // alignItems: 'center',
        // justifyContent: 'center',
        // borderTopLeftRadius: 7,
        // borderBottomLeftRadius: 7
    },
    copyTextStyle: {
        height: 44,
        width: 85,
        backgroundColor: resources.colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: resources.colors.white,
        borderTopRightRadius: 7,
        borderBottomRightRadius: 7,
        marginLeft: -2,
        position:'absolute',
        right:35,
        top:193
    },
    copyTextColor: {
        color: "rgb(36,132,198)",
        fontSize: 16,
        fontFamily: resources.fonts.bold,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center'

    },
    cuponTextStyle: {
        color: "#222222",
        fontSize: 16,
        fontFamily: resources.fonts.bold,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight:'500'

    },
    headerColor: {
        backgroundColor: "white",
        zIndex: 9999
    },
    btnTouchStyle: {
        height: 48,
        width: 130,
        marginTop: 19,
    },
    btnView: {
       // marginBottom: isiPhoneX ? 35 : 20
       position:'absolute',
       bottom:20,
       right:15
    },
    viewTitle:{
        marginTop:35,
        marginLeft : 25
    }
})
export default styles;
