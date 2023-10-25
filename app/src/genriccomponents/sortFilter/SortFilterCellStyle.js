import { StyleSheet } from 'react-native';
import { widthScale, heightScale } from '../../utility/Utils';
import resources from '../../../res';
const styles = StyleSheet.create({
    line: {
        backgroundColor: resources.colors.maring
    },
    row: {
        flexDirection: "row",
        justifyContent: 'space-between',
    },
    cell: {
        padding: 10,
        fontSize: 18,
        height: 53,
        backgroundColor:'white',
        paddingLeft: 21,
        paddingRight: 21,
        justifyContent: 'center'
    },
    chechbox: {
        marginLeft: widthScale(21)
    },
    fontStyle: {
        fontFamily: resources.fonts.regular,
        fontSize: 16,
        color: resources.colors.textLight

    }, fontStyleSelected: {
        fontFamily: resources.fonts.bold,
        color: resources.colors.textLight,
        fontSize: 16,
    }

})
export default styles;