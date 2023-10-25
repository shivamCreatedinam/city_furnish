import { StyleSheet } from 'react-native';
// import { widthScale, heightScale } from '../../../../..utility/Utils';
import { widthScale, heightScale } from '../../../../../utility/Utils';
import resources from '../../../../../../res';
const styles = StyleSheet.create({

    imageThumbnail: {
        borderRadius: widthScale(10),
        height: heightScale(195),
        width: widthScale(155),
        backgroundColor: resources.colors.white,
        shadowColor: "rgba(0,0,0,0.08)",
        shadowOffset: {
            width: widthScale(1),
            height: heightScale(4),
        },
        shadowRadius: 1,
        shadowOpacity: 1,
        elevation: 1,

    },
    nameTextStyle: {
        marginTop: heightScale(7),
        color: "rgb(45,109,154)",
        fontFamily: resources.fonts.bold,
        fontSize: widthScale(12),
        marginHorizontal: widthScale(10),
    },
    priceTextStyle: {
        color: "rgb(28,28,28)",
        marginTop: heightScale(4),
        fontFamily: resources.fonts.bold,
        fontSize: widthScale(10),
        marginHorizontal: widthScale(10),
    },
    priceCrossTextStyle: {
        color: "rgb(151,151,151)",
        marginTop: heightScale(6),
        fontSize: widthScale(8),
    },
    productImageStyle: {
        height: heightScale(130),
        width: widthScale(155),
        borderTopLeftRadius: widthScale(15),
        borderTopRightRadius: widthScale(15),
    },
    heartImageStyle: {
        height: heightScale(12),
        width: widthScale(13),
        alignSelf: 'flex-end',
        marginRight: widthScale(10),
        marginTop: widthScale(10)
    },
    cellStyle: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: heightScale(20),
    },
    rowDirection: {
        flexDirection: 'row'
    }


});

export default styles;
