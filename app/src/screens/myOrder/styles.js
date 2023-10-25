import { StyleSheet } from 'react-native'
import resources from '../../../res'


const styles = StyleSheet.create({
    fullScreen: {
        flex: 1,
        backgroundColor: resources.colors.white,
    },
    container: {
        flex: 1,
        marginTop: 5
    },
    orderOption: {
        fontFamily: resources.fonts.regular,
        fontSize: 14,
        color: resources.colors.labelColor,
        fontWeight:'400'
    },
    orderOption1: {
        fontFamily: resources.fonts.regular,
        fontSize: 16,
        color: "#45454A",
        fontWeight:'400'
    },
    orderData: {
        fontFamily: resources.fonts.regular,
        fontSize: 12,
        color: resources.colors.timerColor,
        fontWeight:'400'
    },
    iconStyleArrow: {
        alignSelf: 'center',
        justifyContent: 'center',
        width:18,
        height : 18
    },
    viewOrder: {
        fontFamily: resources.fonts.regular,
        fontSize: 12,
        color: resources.colors.appColor,
        // marginHorizontal: 10,
        textAlign: 'center',
        fontWeight: '600'
    },

    statusOrder: {
        fontFamily: resources.fonts.regular,
        fontSize: 12,
        color: resources.colors.grassGreen,
    },

    stepValue: {
        fontFamily: resources.fonts.regular,
        fontSize: 10,
        color: resources.colors.timerColor,
    },
    stepLabel: {
        fontFamily: resources.fonts.regular,
        fontSize: 12,
        color: resources.colors.grassGreen,
    },
    iconStyle: {
        width: 12,
        height: 12
    },
    separatorStyle: {
        height: 1,
        width: "100%",
        backgroundColor: resources.colors.sepratorWhite,
    },
    heightView: {
        height: 25
    },
    stepConStyle: {
        width: '50%',
        marginLeft: 25,
        height:"100%"
    },
    verticalSep: {
        width: 2,
        height: 140,
        marginVertical: 10
    },
    flexDirection:{
        flexDirection:'row',
        justifyContent:'space-between'
    },
    tagView:{
        width:100,
        height:28
    },
    rType:{
        color:'#45454A',
        fontFamily : resources.fonts.regular,
        fontSize:16,
        fontWeight:'500'
    },
    subText:{
        fontFamily:resources.fonts.regular,
        fontSize:12,
        color:'#71717A',

    },
    pageTitle:{color:'#45454A',fontSize:24,fontWeight:'500',fontFamily:resources.fonts.regular},
    cardStyle: {
        flex:1,
        padding: 20,
        
        marginTop: 10,
        borderWidth:0,
        marginLeft:16,
        marginRight:16
    },
    priceText:{
        color:"#45454A",
        fontWeight:'400',
        fontFamily:resources.fonts.regular,
        fontSize:14
    },
    row1:{
        flexDirection: 'row',
    },
    row3 :{
        flexDirection: 'row',
        justifyContent:'space-between'
    },
    borderView :{
        marginTop:10,
        marginBottom:10
    },
    leftHalfCon: {
        height: '70%',
        width: '100%',
        marginLeft:10
    },
    subCon: {
        width: '50%',
        justifyContent: 'space-around'
    },
    btnMoreOption: {
        // width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: resources.colors.white,
        marginTop: 17
    },

    btnStyle: {
        borderRadius: 6,
        borderWidth: 1,
        borderColor: resources.colors.appColor,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        // flex:1
    },
    btnWidth1: {
        width: '24%',
    },
    btnWidth3: {
        width: '40%',
    },
    btnWidth2: {
        width: '26%',
        marginHorizontal: 20,
    },
    orderHeading: {
        color: resources.colors.black,
        fontFamily: resources.fonts.medium,
        fontSize: 12.5,
        textAlign: 'center',
    },
    listDataStyle: {
        color: resources.colors.labelColor,
        fontFamily: resources.fonts.medium,
        fontSize: 12,
        textAlign: 'center',
        margin: 5
    },
    listDataStyle1: {
        color: resources.colors.labelColor,
        fontFamily: resources.fonts.medium,
        fontSize: 12,
        textAlign: 'center',
    },
    dateStyle: {
        color: resources.colors.labelColor,
        fontFamily: resources.fonts.regular,
        fontSize: 10,
        lineHeight:16,
        textAlign: 'center',
    }
})
export default styles