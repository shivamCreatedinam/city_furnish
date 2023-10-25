import { StyleSheet } from 'react-native';
import { isiPhoneX } from '../../utility/Utils';
import resources from '../../../res';
const styles = StyleSheet.create({
    fullScreen: {
        flex: 1,
        backgroundColor: resources.colors.white
    },
    container: {
        flex: 1,
        marginHorizontal: 20
    }, currentNameView: { height: 57, justifyContent: 'center', alignItems: 'center' }
    , currentNameText: {
        fontFamily: resources.fonts.bold,
        fontSize: 18,
        color: resources.colors.bluishTwo
    }, iconStyle: {
        height: 16,
        width: 16
    }, orderNumberText: {
        fontFamily: resources.fonts.medium,
        fontSize: 14,
        color: resources.colors.labelColor
    }, orderData: {
        fontFamily: resources.fonts.regular,
        fontSize: 12,
        color: resources.colors.labelColor,
        marginBottom: -3

    }, 
    btnMain: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        height: 90, 
        alignItems: 'center', 
        paddingHorizontal: 20 
    },
    selectOrderView: {
        height: 48,
        borderBottomColor: resources.colors.sepratorWhite,
        borderBottomWidth: 1,
        justifyContent: 'center'
    }, selectOrderText: {
        fontFamily: resources.fonts.regular,
        fontWeight: "600",
        fontSize: 18,
        color: resources.colors.timerColor,
        marginHorizontal: 20,
        lineHeight: 18
    }, doneText: {
        fontFamily: resources.fonts.medium,
        fontSize: 14,
        color: resources.colors.grassGreen
    },
    pendingText: {
        fontFamily: resources.fonts.medium,
        fontSize: 13,
        color: resources.colors.appColor
    },
    pendingKycText: {
        fontFamily: resources.fonts.medium,
        fontSize: 14,
        color: resources.colors.blueOffer
    },
    flatlistStyle: {
        marginBottom: isiPhoneX ? 35 : 15,
        flex: 1
    },
    flex1: {
        flex: 1
    }
})
export default styles
