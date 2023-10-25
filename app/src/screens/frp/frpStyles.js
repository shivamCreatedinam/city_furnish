import { StyleSheet } from 'react-native';
import { widthScale, heightScale, statusBarHeight, myHeight, isiPhoneX} from '../../utility/Utils';
import resources from '../../../res';
const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    // backgroundColor: resources.colors.white
  },
  fullScreenGrow: {
    flex: 1,
    // paddingBottom: isiPhoneX ? 100 : 80,
  },
  activeText:{
    color:'#222222',
    fontWeight:'bold',

  },
  deActiveText:{
    color:"#71717A",
    fontWeight:'bold',
  },
  monthView:{
    backgroundColor:'#EFECE6',
    borderRadius:20,
    padding:10
  },
  paddingClass : {
    padding:16
  },
  subTitle:{
    color:"#71717A",
    fontSize:14,
    fontWeight:'400',
    marginTop : 5
  },
  pageTitle:{
    color:'#222222',
    fontSize : 20,
    fontWeight:'500'
  },
  container: {
    flex: 1,
    marginHorizontal: 20,
  },
  statusBar: {
    height: statusBarHeight,
  }, textCategory: {
    paddingLeft: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  veiwBottomFilter: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
    alignSelf: 'center',
    width:180,

    // maxWidth: 180,
    height: 45, backgroundColor:
      resources.colors.blueText, borderRadius: 25,
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    paddingHorizontal:10
  },
  filterText: {
    marginLeft: 5,
    color: resources.colors.white,
    fontFamily: resources.fonts.regular
  },
  divider: {
    backgroundColor: resources.colors.white,
    width: 1,
    height: 45
  },
  roundBtn:{
    width:24,
    height:24,
    borderWidth:2,
    borderRadius:24/2,
    justifyContent:'center',
    alignItems:'center'
  },
  row:{
    flexDirection:'row'
  },
  horizontal: { flexDirection: 'row',paddingHorizontal:10 },
  view: {
    // margin: 30,
    justifyContent: 'flex-end',
    marginLeft: '25%',
    position: 'absolute',
    left: 0,
    right: 10,
    bottom: 25,
    width: '100%',
    height: '100%',
    // backgroundColor: resources.colors.white
  },
  fullScreenModal: {
    // flex: 1,
    // backgroundColor: resources.colors.white,
    margin: 0,
    borderRadius: 10,
    width: '75%',
    height: '75%',
  },
  headingTitle: {
    fontFamily: resources.fonts.bold, 
    color: resources.colors.labelColor, 
    fontSize: 18, 
    marginBottom: 5, 
    textAlign : 'left' 
  },
  tilesBox: {
    marginHorizontal: 10
  },

  tilesBoxInner: {
    padding: 16
  },
  tilesBox01: {
    color: resources.colors.appColor,
    fontSize: 30,
    lineHeight: 35,
    marginBottom: 5,
    fontFamily: resources.fonts.bold,
  },
  tilesBox02: {
    color: "#222222",
    fontSize: 16,
    lineHeight: 20,
    fontFamily: resources.fonts.bold,
  },
  tilesBox03: {
    color: "#45454A",
    fontSize: 13,
    lineHeight: 18,
    fontFamily: resources.fonts.bold,
  },
  lineStyle:{
    borderWidth: 1,
    borderColor:resources.colors.appColor,
    margin:0,
    width: 50,
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center'
 },
 viewStep: {
     flex: 0.5,
     borderWidth: 0,
     margin: 6,
     // height: !isPlatformIOS ? heightScale(160) : 160,
     // width: (myWidth / 2) - 25,
     // maxWidth: (myWidth / 2) - 25,
     paddingHorizontal: 2,
     shadowColor: "rgba(0, 0, 0, 0.2)",
     shadowOffset: {
         width: 1,
         height: 2,
     },
     shadowOpacity: 1,
     shadowRadius: 2,
     elevation: 5,
     borderRadius: 8,
     backgroundColor: resources.colors.white,
     paddingVertical:10,
    //  justifyContent: 'center',
     // alignSelf:'center'
 },
 imageStep: {
     width: 65,
      height: 65,
     marginBottom: 8,
     marginTop: 14,

     alignSelf: 'center'
 },
 marginHorizontal: {
     position: 'absolute',
     top: isiPhoneX ? 75 : 70,
     left: 0,
     right: 0,
     bottom:0,
     marginHorizontal:0,
     marginVertical: 10,
     flex:1,
     // marginTop:100,flexGrow:1
 },
 appBackground: {
     // flex:1,
     backgroundColor: resources.colors.appColor,
     height: 150,
     borderBottomLeftRadius: 30,
     borderBottomRightRadius: 30,
     // marginTop: 90,
 },
})
export default styles;
