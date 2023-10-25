import { StyleSheet } from 'react-native';
import { widthScale, heightScale, statusBarHeight, myHeight } from '../../utility/Utils';
import resources from '../../../res';
const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: resources.colors.white
  },
  titleText:{
    color:'#222222',
    fontSize:24,
    fontFamily : resources.fonts.bold
},
paddingClass : {
    padding : 16,
    backgroundColor:'#f7f7f8'
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
    textAlign : 'center' 
  },
  tilesBox: {
    marginHorizontal: 10
  },
  tilesBoxInner: {
    paddingVertical: 10
  },
  tilesBox01: {
    color: resources.colors.appColor,
    fontSize: 30,
    lineHeight: 35,
    marginBottom: 5,
    fontFamily: resources.fonts.bold,
  },
  tilesBox02: {
    color: resources.colors.black,
    fontSize: 16,
    lineHeight: 20,
    fontFamily: resources.fonts.bold,
  },
  tilesBox03: {
    color: resources.colors.labelColor,
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
})
export default styles;
