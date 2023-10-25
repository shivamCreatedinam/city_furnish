import { StyleSheet } from 'react-native';
import resources from '../../../../res';
import { isiPhoneX  } from '../../../utility/Utils'
const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: resources.colors.white,
        // marginTop:10
    },
    flex1: {
        flex: 1
    },
    rowDirection: {
        flexDirection: 'row',
    },
    columnDirection: {
        flexDirection: 'column',
    },
    subContainer: {
        flex: 1, marginHorizontal: 20,

    },
    scoreText: {
        fontFamily: resources.fonts.bold,
        fontSize: 14,
        color: resources.colors.charcoalGrey,
        // borderWidth: 1,
        width: 300
    },
    coinsValue: {
        fontFamily: resources.fonts.bold,
        fontSize: 24,
        lineHeight: 26,
        letterSpacing: -0.36,
        color: resources.colors.frbCardBlue,
        marginLeft: 5
    },
    seperator: {
        borderBottomColor: resources.colors.black,
        borderBottomWidth: 1,
        marginHorizontal: 10
    },
    boxStyle: {
        flexDirection: 'row',
        minHeight: 90,
        alignItems: 'center',
        marginTop: 15,
        borderRadius: 6,
        shadowColor: "rgba(0,0,0,0.8)",
        backgroundColor: resources.colors.white,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowRadius: 4,
        shadowOpacity: 0.2,
        elevation: 6,
        paddingHorizontal: 14
    },
    textCon: {
        flexDirection: 'column', marginLeft: 10
    },
    descriptionText: {
        fontSize: 10,
        lineHeight: 18,
        fontFamily: resources.fonts.regular,
        color: resources.colors.textBlack
    },
    getCreditText: {
        fontFamily: resources.fonts.regular,
        fontSize: 16,
        fontWeight: "600",
        color: resources.colors.textBlack
    },
    lableStyle: {
        color: resources.colors.labelColor,
        fontFamily: resources.fonts.regular,
        fontWeight: '600',
    },
    errorStyle: {
        color: "red", height: 20
    }, currentNameView: { height: 57, justifyContent: 'center', alignItems: 'center' }
    , currentNameText: {
        fontFamily: resources.fonts.bold,
        fontSize: 18,
        color: resources.colors.bluishTwo
    },
    btnCon: {
        marginBottom: isiPhoneX ? 45 : 20,
        marginTop: 10,
        marginHorizontal: 20
    }, iconStyle: {
        height: 16,
        width: 16
    },
    isDropDown: {
        justifyContent: 'center',
        borderBottomWidth: 1,
        alignItems: 'center',
        borderColor: resources.colors.labelColor,

    },
    imgDropDown: {
        width: 9,
        height: 8,
        marginRight: 10
    },

}
)
export default styles;