import { StyleSheet } from 'react-native';
import resources from '../../../res';
import { widthScale } from '../../utility/Utils';
export default StyleSheet.create({
    fullScreen: { flex: 1,
    backgroundColor:resources.colors.white },
    input: {
        width: 47,
        height: 47,
        fontSize: 20,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: resources.fonts.regular,
        borderBottomWidth: 1,
        color:resources.colors.labelColor,
        borderColor: resources.colors.labelColor
    },
    navbarContainer: {
        paddingBottom: 10


    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    buttonContainer: {
        marginTop: 44,
        alignItems: 'center'
    },
    forgetText: {
        fontSize: 14,
        color: resources.colors.txtGetOTP,
        marginRight: 28
    },
    textContainer: {
        marginVertical: 18,
        width: '100%',
        flexDirection: 'column',
    },
    text: {
        fontSize: widthScale(16),
        fontFamily: resources.fonts.regular,
        color: resources.colors.hint,
        alignSelf: 'center',
        marginVertical: 10,
        marginHorizontal: 15,
    },
    notRecievedContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    notRecText: {
        color: resources.colors.labelColor,
        fontSize: widthScale(16),
        fontFamily: resources.fonts.regular,
    },

    resendContainer: {
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    resend: {
        color: resources.colors.txtGetOTP,
        fontSize: widthScale(16),
        fontFamily: resources.fonts.bold,
        borderBottomWidth:2,
        borderColor:resources.colors.txtGetOTP,
    },
    number: {
        fontSize: widthScale(17),
        fontFamily: resources.fonts.bold,
        color: resources.colors.hint,
        marginVertical: 10,
        alignSelf: 'center',
    },
    enterOtpText: {
        fontSize: widthScale(16),
        alignSelf: 'center',
        fontFamily: resources.fonts.regular,
        color: resources.colors.hint
    },
    parentView: {
        marginHorizontal: 20
    },
    timerStyles:{ 
        fontSize: widthScale(24),
        fontFamily: resources.fonts.bold,
        color: resources.colors.timerColor,
        alignSelf:'center',
        marginVertical:23
     },
     otpBox: {
        width: '80%', 
        height: 80
    },
     borderStyleBase: {
        width: 36,
        height: 45,
    },
    borderStyleHighLighted: {
        borderColor: resources.colors.labelColor
    },
    underlineStyleBase: {
        width: 36,
        height: 45,
        borderWidth: 0,
        borderBottomWidth: 4,
        fontSize: 20,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: resources.fonts.regular,
        color:resources.colors.labelColor,
        borderColor: resources.colors.labelColor
    },
     
    underlineStyleHighLighted: {
        borderColor: resources.colors.labelColor
    },
})