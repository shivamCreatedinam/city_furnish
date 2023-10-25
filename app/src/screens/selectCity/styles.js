import {StyleSheet} from 'react-native';
import {widthScale, heightScale, isPlatformIOS} from '../../utility/Utils';
import resources from '../../../res';
const styles = StyleSheet.create({
  MainContainer: {
    justifyContent: 'center',
    flex: 1,
    backgroundColor: resources.colors.white,
    
  },

  imageThumbnail: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    //height: isPlatformIOS ? 150 : 130,
    width: widthScale(120),
    backgroundColor: 'white',
    // shadowColor: '#000000',
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.3,
    // shadowRadius: 3,
    // elevation: 5,
    // borderWidth:1,
    marginBottom: 0,
  },
  cityTextStyle: {
    textAlign: 'center',
    marginTop: 8,
    color: "#302F30",
    fontFamily: resources.fonts.regular,
    fontSize:14
  },
  cityImageStyle: {
    height: 100,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:3,
    borderColor:'black'
  },

  textChooseCity: {
    // fontFamily: 'Nunito-Regular',
    fontSize: 20,
    color: '#302F30',
    fontWeight:'500',
    fontFamily:resources.fonts.medium
  },
  cellStyle: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  activeBorder:{
    borderWidth:2,
    borderColor:"black",
    borderRadius:12
  },
  inActiveBorder:{

  },
  chooseCity: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 33,
  },
  headerTextStyle: {
    color: '#71717A',
    fontSize: 14,
    fontFamily: resources.fonts.regular,
    fontWeight: '600',
  },
  cityContainer: {
    marginHorizontal: 15,
    marginTop:-18,
    flex: 1,
  },
  selectCityText: {
    fontFamily: resources.fonts.medium,
    fontSize: 18,
    color: resources.colors.bluish,
    marginLeft: 9,
  },
  headerView: {
    height: 44,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerLoaderStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
