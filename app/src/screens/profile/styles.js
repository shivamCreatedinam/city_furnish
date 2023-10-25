import { StyleSheet } from 'react-native'
import resources from '../../../res'
import { widthScale, heightScale } from '../../utility/Utils'

export default StyleSheet.create({
    fullScreen: {
        flex: 1,
        backgroundColor: resources.colors.white
    },
    inputStyle: {
        // marginTop: 5,
        // paddingBottom: 5
    },
    buttonContainer: {
        marginTop: 10,
        alignItems: 'center'
    },
    mainContainer: {
        marginHorizontal: 20,
        marginTop: 15
    }
})