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
        padding: widthScale(10),
        fontSize: widthScale(18),
        height: heightScale(53),
        paddingHorizontal: widthScale(20),
        justifyContent: 'center'
    },
    checkbox: {
        marginLeft: widthScale(21)
    },
    checkboxStyle: {
        height: heightScale(20),
        width: widthScale(20)
    },
    fontStyle: {
        fontSize: widthScale(16),
        fontFamily: resources.fonts.regular,
        color: "rgb(54,69,79)"
    },
    selectedFontStyle: {
        fontSize: widthScale(16),
        fontFamily: resources.fonts.bold,
        color: "rgb(54,69,79)"
    },
    cellItemStyle: {
        alignSelf: 'stretch',
        height: heightScale(50),
        justifyContent: 'center'
    }

})
export default styles;