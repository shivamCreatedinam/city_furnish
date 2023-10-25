import { StyleSheet } from 'react-native'
import resources from '../../../res'
import { widthScale, heightScale } from '../../utility/Utils'

export default StyleSheet.create({
    fullScreen: { flex: 1 ,
        backgroundColor:resources.colors.white
    },
    buttonContainer: {
        marginTop: heightScale(25),
        alignItems: 'center'
    },

    text: {
        fontFamily: resources.fonts.regular,
        color: resources.colors.hint,
        fontSize: widthScale(15),
        marginBottom: heightScale(30),
    },
})