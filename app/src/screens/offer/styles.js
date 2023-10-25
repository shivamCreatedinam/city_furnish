import { StyleSheet } from 'react-native'
import resources from '../../../res'
import { isiPhoneX } from '../../utility/Utils';


const styles = StyleSheet.create({
    fullScreen: {
        flex: 1,
        backgroundColor: resources.colors.white
    }, container: {
        flex: 1,
        // marginHorizontal: 20,
        // marginTop: 1,
        // backgroundColor:'red'
    },
    findAnswerText: {
        fontFamily: resources.fonts.regular,
        fontWeight: '600',
        fontSize: 18,
        color: resources.colors.timerColor
    },
    imageThumbnail: {
        flex: 1,
        // backgroundColor: 'red',
        justifyContent: 'center',
        // marginVertical: 10,
        marginTop: 15,
        borderRadius: 15,
        // height: 131,
        marginHorizontal: 20,
        backgroundColor: "white",
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    }, cell: {
        flexDirection: 'row',
        justifyContent: 'space-between',

    },
    flatOffer: {
        fontFamily: resources.fonts.bold,
        fontSize: 16,
        color: resources.colors.bluish,
        marginTop: 10
    }, offerCode: {
        marginRight: 5,
        height: 36,
        width: 30,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    }, copy: {
        width: 20,
        height: 24
    },
    couponCode: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }, couponDiscription: {
        fontFamily: resources.fonts.regular,
        fontSize: 10,
        color: resources.colors.timerColor,
        marginHorizontal: 20,
        marginTop: 5
    },
    belowText: {
        fontFamily: resources.fonts.regular,
        fontSize: 11,
        color: resources.colors.timerColor,
    }, couponText: {
        fontFamily: resources.fonts.bold,
        fontSize: 11,
        color: resources.colors.timerColor,
        // marginHorizontal: 20,
        marginTop: 5
    },
    dashedBorder: {
        width: 140,
        height: 36,
        flexDirection: 'row',
        borderColor: resources.colors.borderDashed,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderRadius: 6,
        marginTop: 10,
        alignItems: 'center',
    },
    offerThumbnail: {
        marginTop: 20,
        flex: 1,
        shadowColor: "#000000",
        shadowOffset: {
            width: 1,
            height: 1,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    couponCodeText: {
        fontFamily: resources.fonts.bold,
        fontSize: 16,
        borderWidth: 0,
        color: resources.colors.bluish,

    }, rewardAmount: {
        fontSize: 48,
        fontWeight: "500",
        fontStyle: "italic",
        letterSpacing: 0.78,
        // marginRight: 15,
        color: resources.colors.white,
        textShadowColor: "rgba(0, 0, 0, 0.5)",
        textShadowOffset: {
            width: 1,
            height: 1
        },
        textShadowRadius: 1
    }, rewardTitle: {
        fontSize: 17.3,
        fontWeight: "500",
        fontStyle: "italic",
        marginRight: 15,
        alignSelf: 'flex-end',
        lineHeight: 24,
        letterSpacing: 0.78,
        color: resources.colors.white,
        textShadowColor: "rgba(0, 0, 0, 0.5)",
        textShadowOffset: {
            width: 1,
            height: 1
        },
        textShadowRadius: 1
    }, knowMore: {
        fontSize: 12,
        fontWeight: "500",
        fontStyle: "italic",
        lineHeight: 24,
        textDecorationLine: 'underline',
        letterSpacing: 0.54,
        textAlign: "center",
        color: resources.colors.brightYellow,
        textShadowColor: "rgba(0, 0, 0, 0.5)",
        textShadowOffset: {
            width: 1,
            height: 1
        },
        textShadowRadius: 1

    },
    voucharLabel: {
        fontSize: 12,
        fontWeight: "500",
        fontStyle: "italic",
        lineHeight: 24,
        letterSpacing: 0.54,
        textAlign: "center",
        color: resources.colors.white,
        textShadowColor: "rgba(0, 0, 0, 0.5)",
        textShadowOffset: {
            width: 1,
            height: 1
        },
        textShadowRadius: 1


        // fontStyle:'italic'
    },
    offerTextView: {
        width: '50%',
        alignItems: 'flex-start',
        marginTop: 10,
        marginBottom: 10
    },
    imageBackView: {
        borderRadius: 6,
        flex: 1,
        marginTop: 20,
        marginHorizontal: 20,
        marginBottom: isiPhoneX ? 25 : 15
    }

})

export default styles;