
import { StyleSheet } from 'react-native'
import resources from '../../../res'
import { widthScale, heightScale } from '../../utility/Utils'


export default StyleSheet.create({
    fullScreen: { flex: 1 ,backgroundColor:resources.colors.white},
    buttonContainer: {
        marginTop: 30,
        alignItems: 'center'
    },
    textContainer: {
        marginTop: 15,
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    text: {
        fontFamily: resources.fonts.regular,
        color: resources.colors.hint,
        fontSize: widthScale(17),
        width:'100%',
        marginBottom: heightScale(30),
        textAlign: 'center'
    },input: {
        width: 47,
        height: 47,
        fontSize: 20,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: resources.fonts.regular,
        borderBottomWidth: 1,
        borderColor: resources.colors.labelColor
    },
    navbarContainer: {
        paddingBottom: 10


    },
    minimuLabel: {
        backgroundColor: 'white', 
        alignSelf: 'flex-end', 
        fontFamily: resources.fonts.regular,
        fontSize: 13, 
        color: resources.colors.labelColor,
        marginTop: 10
    },
    ActivityIndicatorStyle: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',

    }
})