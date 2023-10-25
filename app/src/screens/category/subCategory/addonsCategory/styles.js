import { StyleSheet } from 'react-native';
import { widthScale, heightScale, isPlatformIOS, myWidth } from '../../../../utility/Utils';
import resources from '../../../../../res';
const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        // marginTop: 15,
    },
    cellStyle: {
        height: !isPlatformIOS ? heightScale(187) : 190,
        minWidth: (myWidth / 2) - 35,
        maxWidth: (myWidth / 2) - 35,
        shadowColor: "rgba(0, 0, 0, 0.2)",
        shadowOffset: {
            width: 1,
            height: 2,
        },
        shadowOpacity: 1,
        shadowRadius: 2,
        elevation: 5,
        borderRadius: 8,
        backgroundColor: resources.colors.white,
        flexDirection: 'column',
        justifyContent: 'space-between',
        // marginBottom: 18,
        marginBottom: 10,
        borderWidth: 0,
        marginHorizontal: 10
    },
    viewCard: {
        backgroundColor: resources.colors.white,
        height: !isPlatformIOS ? heightScale(187) : 180,
        width: '100%',
        // minWidth: (myWidth / 2) - 25,
        // maxWidth: (myWidth / 2) - 25,
        borderRadius: 8,
        alignSelf: 'center',
    },
    productImageStyle: {
        height: !isPlatformIOS ? heightScale(120) : 120,
        width: '100%',
        // backgroundColor: '#dddddd',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },

    priceTextStyle: {
        color: resources.colors.timerColor,
        fontFamily: resources.fonts.bold,
        fontSize: 12,
    },
    priceFreqTextStyle: {
        color: resources.colors.textLight,
        fontFamily: resources.fonts.regular,
        fontSize: 10,
    },

    heartImageStyle: {
        height: 15,
        width: 15,
        alignSelf: 'flex-end',
        marginRight: 10,
        marginTop: 10
    },
    textView: {
        width: '50%',
        textAlignVertical: 'center',
        padding: 10,
        color: '#000'

    },

    rowDirection: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    nameTextStyle: {
        marginTop: 7,
        color: resources.colors.txtGetOTP,
        fontFamily: resources.fonts.bold,
        fontSize: 13,
        marginHorizontal: 10,
        height: !isPlatformIOS ? heightScale(22) : 20,
        borderWidth: 0,
    },
    viewPrice: {
        alignItems: 'center',
        marginHorizontal: 10,
        height: !isPlatformIOS ? heightScale(22) : 22,
        borderWidth: 0,
    },
    cornerView: {
        overflow: 'hidden', flexDirection: 'row',
        justifyContent: 'space-between', height: 60,
    },
    notifyView: {
        backgroundColor: resources.colors.blackAlpha,
        height: isPlatformIOS ? 180 : 190,
        width: widthScale(170),
        position: 'absolute',
        alignSelf: 'center',
        alignItems: 'flex-start',
        borderRadius: 8,
    },
    buttonStyleAddToCart: {
        height: heightScale(25),
        width: 60,
        justifyContent: "center",
        alignItems: "center",
        borderColor: resources.colors.appColor,
        color: resources.colors.appColor,
        alignSelf: "stretch",
        marginBottom: 8,
        borderRadius: 2,
        marginRight: 10
    },
    addTocart: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'flex-end'
    }
});

export default styles;
