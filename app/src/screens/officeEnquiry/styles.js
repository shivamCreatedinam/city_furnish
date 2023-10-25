import { StyleSheet } from 'react-native'
import resources from '../../../res'
import { isiPhoneX } from '../../utility/Utils';
const styles = StyleSheet.create({
    fullScreen: {
        flex: 1,
        backgroundColor: resources.colors.white
    }, container: {
        flex: 1,
        marginHorizontal: 20,
        // marginTop: 10,

    }, submitBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        height: isiPhoneX ? 90 : 70,
        borderTopWidth: 1,
        borderTopColor: "rgba(10,36,99,0.1)",
        backgroundColor: resources.colors.white,
        marginHorizontal: -20
    }, buttonStyle: {
        width: 335,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: isiPhoneX ? 15 : 0,
    },
    minimuLabel: {
        backgroundColor: 'white', alignSelf: 'flex-end', fontFamily: resources.fonts.regular,
        fontSize: 13, color: resources.colors.labelColor
    }
});

export default styles;
