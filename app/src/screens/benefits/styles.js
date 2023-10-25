import { StyleSheet } from 'react-native'
import resources from '../../../res'
import { heightScale, isPlatformIOS } from '../../utility/Utils';


const styles = StyleSheet.create({
    fullScreen: {
        flex: 1,
        backgroundColor: resources.colors.white
    }, container: {
        flex: 1,
        marginHorizontal: 20,
        marginTop: 10,
    }, imageThumbnail: {
        justifyContent: 'center',
        marginVertical:10,
        marginHorizontal:3,
        borderRadius: 5,
        height: 100,
        backgroundColor: "white",
        shadowColor: "#000000",
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    } ,cell: {
        flexDirection: 'row',
        justifyContent: 'space-between',
       
    },imageStyle: {
        // marginHorizontal:11,
        // marginVertical:11
    }, mainText: {
        fontFamily: resources.fonts.bold,
        fontSize: 12,
        color: resources.colors.txtGetOTP,
        flexWrap: 'wrap'
    }, dataText: {
        fontFamily: resources.fonts.regular,
        fontSize: isPlatformIOS ? 11 : heightScale(12),
        color: resources.colors.timerColor,
        // textAlign:'left',
        flexWrap: 'wrap',
        flex:1
        
        
    }
})
export default styles;