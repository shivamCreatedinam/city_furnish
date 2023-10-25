import { StyleSheet } from 'react-native';
import { widthScale, heightScale, isiPhoneX } from '../../utility/Utils';
import resources from '../../../res';
const styles = StyleSheet.create({
    fullScreen: {
        flex: 1,
        backgroundColor: resources.colors.white
    },
    container:{
        flex:1,
        marginHorizontal:20
    },haveYour:{
        fontFamily:resources.fonts.regular,
        fontSize:24,
        color:resources.colors.timerColor,
        
    },friends:{
        fontFamily:resources.fonts.bold,
        fontSize:24,
        color:resources.colors.appColor
    },shareReferalText:{
        fontFamily:resources.fonts.regular,
        fontSize:14,
        color:resources.colors.timerColor,
        marginTop:10
    },coinText:{
        fontFamily:resources.fonts.medium,
        fontSize:22,
        color:resources.colors.blueText,
        marginHorizontal:10
    },knowMoreText:{
        fontFamily:resources.fonts.medium,
        fontSize:14,
        color:resources.colors.darkSkyBlue,
        textAlign:'center',
        textDecorationLine:'underline',
        marginTop:12

    },payFurniture:{
        fontFamily:resources.fonts.regular,
        fontSize:24,
        color:resources.colors.timerColor,
        
    }
})
export default styles
