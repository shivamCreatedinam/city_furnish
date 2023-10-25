import { StyleSheet, Platform } from 'react-native'
import resources from '../../../res'


const styles = StyleSheet.create({
    fullScreen: {
        flex: 1,
        backgroundColor: resources.colors.white
    }, container: {
        flex: 1,
        marginHorizontal: 17,
        marginTop: 15,
    },
    findAnswerText: {
        fontFamily: resources.fonts.regular,
        fontSize: 18,
        color: resources.colors.bluish
    }, proposalText: {
        fontFamily: resources.fonts.regular,
        fontSize: 12,
        lineHeight: 18,
        color: resources.colors.timerColor
    }, imageThumbnail: {
        // justifyContent: 'center',
        // marginVertical:5,
        flex: 1,
        marginHorizontal: 3,
        borderRadius: 5,
        height: 70,
        backgroundColor: "white",
        shadowColor: "#000000",
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginTop: 2,
        marginBottom: 18
    }, cell: {
        flexDirection: 'row',
        justifyContent: 'space-between'

    }, imageStyle: {
        marginHorizontal: 11,
        marginVertical: 11
    }, mainText: {
        fontFamily: resources.fonts.bold,
        fontSize: 12,
        color: resources.colors.txtGetOTP
    }, dataText: {
        fontFamily: resources.fonts.regular,
        fontSize: 10,
        color: resources.colors.timerColor
    }

})

export default styles;