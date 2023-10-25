import { StyleSheet } from 'react-native';
import { widthScale, heightScale } from '../../utility/Utils';
import resources from '../../../res';
const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: resources.colors.white
  },
  container: {
    flex: 1,
    marginTop: heightScale(40),
    backgroundColor: 'blue'
  },
  line: {
    backgroundColor: resources.colors.black
  }, header: {
    backgroundColor: resources.colors.white
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
    marginBottom: 25,
    marginHorizontal: 20,
  },
  flatlistContainer: {
    height: 24,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor:'white'
  },
  renderHorizontalListCon: {
    height:24,
    justifyContent: 'space-around', alignSelf: 'stretch',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  textAndCrossContainer: {
    height: 24, flexDirection: 'row',
    justifyContent: 'space-around', backgroundColor: resources.colors.appColor,
    alignSelf: 'center', alignItems: 'center', borderRadius: 11,
    paddingHorizontal: 9,
  },
  textStyle: {
    color: 'white',
    fontSize: 14,
    fontFamily: resources.fonts.regular
  }, seperatorLine: {
    height: 1,
    width: "100%",
    backgroundColor: resources.colors.inputLabel,
  }, containerLoaderStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  divider:{
    width: '100%',
    height: 1,
    marginTop:15,
    borderBottomWidth: 1,
    borderBottomColor: resources.colors.inputLabel,
}
});

export default styles;
