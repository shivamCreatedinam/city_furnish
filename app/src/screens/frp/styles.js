import { StyleSheet } from 'react-native';
import resources from '../../../res';
import { statusBarHeight, isiPhoneX, isPlatformIOS } from '../../utility/Utils';
const styles = StyleSheet.create({
    fullScreen: {
        flex: 1,
        backgroundColor: resources.colors.white,
    },
    flex1: {
        flex: 1
    },
    rowDirection: {
        flexDirection: 'row',
    },
    specificationTextStyle: {
        fontFamily: resources.fonts.bold,
        color: resources.colors.textBlack,
        fontSize: 15,
        marginTop: 10
    },
    additonalAmountStyle: {
        fontFamily: resources.fonts.bold,
        color: resources.colors.txtGetOTP,
        fontSize: 15,
        marginTop: 10
    },
    titleTextStyle: {
        fontFamily: resources.fonts.regular,
        color: resources.colors.txtGetOTP,
        fontSize: 14,
        fontWeight: "600"
    },
    subTitleTextStyle: {
        fontFamily: resources.fonts.bold,
        color: resources.colors.textBlack,
        fontSize: 10,
        marginTop: 8
    },
    subTitleValueStyle: {
        color: resources.colors.textBlack,
        fontSize: 10,
        marginTop: 8,
        fontFamily: resources.fonts.regular,
        marginLeft: 32,
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
        marginTop: 15,
        marginHorizontal: 20
    },
    sectionHeader:{
        fontSize:20,
        fontFamily: resources.fonts.bold,
        color:resources.colors.textBlack,
        marginBottom:4,
        marginLeft:10,
    },
    sectionHeaderUpgrade:{
        fontSize:20,
        fontFamily: resources.fonts.bold,
        color:resources.colors.textBlack,
        marginBottom:4,
        marginLeft:10,
        marginTop:20,
    }
})
export default styles;