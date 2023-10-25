import { StyleSheet, Platform } from 'react-native'
import resources from '../../../res'


const styles = StyleSheet.create({
    fullScreen: {
        flex: 1,
        backgroundColor: resources.colors.white
    }, container: {
        flex: 1,
        marginHorizontal: 20,
        marginTop: 16
    }, submitBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 70,
        marginVertical: 24
    }, buttonStyle: {
        width: 335,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
export default styles;