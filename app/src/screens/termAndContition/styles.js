import { StyleSheet, Platform } from 'react-native'
import resources from '../../../res'


const styles = StyleSheet.create({
    fullScreen: {
        flex: 1,
        backgroundColor: resources.colors.white
    }, container: {
        flex: 1,
        // marginHorizontal: 20,
        marginBottom: 10
    }, voucherView: {
        // height: 260,

        flexDirection: 'column', justifyContent: 'space-around',
        paddingVertical: 20
    }, textVoucher: {
        fontFamily: resources.fonts.medium,
        fontSize: 24,
        color: resources.colors.timerColor
    }, textInstruction: {
        textAlign: 'center',
        fontFamily: resources.fonts.medium,
        fontSize: 10,
        color: resources.colors.timerColor
    },
    voucherInstruction: {
        textAlign: 'center',
        fontFamily: resources.fonts.regular,
        fontSize: 10,
        color: resources.colors.timerColor,
        marginTop: 10
    },
    allYouKnow: {
        borderBottomColor: resources.colors.sepratorWhite,
        borderBottomWidth: 1,
        borderTopColor: resources.colors.sepratorWhite,
        borderTopWidth: 1,
        height: 50,
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    textAllYouKnow: {
        fontFamily: resources.fonts.medium,
        fontSize: 18,
        color: resources.colors.timerColor,
        marginLeft: 20
    },
    textCondition: {
        fontFamily: resources.fonts.regular,
        fontSize: 12,
        color: resources.colors.timerColor,
        marginTop: 10
    },
    sepratorStyle: {
        height: 1,
        marginTop: 15,
        marginHorizontal: 58,
        // borderRadius: 1,
        borderWidth: 1,
        borderColor: resources.colors.sepratorWhite,
        borderStyle: 'dashed',
        // zIndex: 0,
    }

})
export default styles