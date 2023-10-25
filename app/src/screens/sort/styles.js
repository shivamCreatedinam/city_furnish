import { StyleSheet } from 'react-native';
import { widthScale, heightScale, isiPhoneX, isPlatformIOS } from '../../utility/Utils';
import resources from '../../../res';
const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: resources.colors.white
  },
  container: {
    flex: 1,
    // marginHorizontal:20,
    marginTop: 40,
    backgroundColor: 'blue'
  },
  line: {
    backgroundColor: resources.colors.black
  }, header: {
    backgroundColor: resources.colors.white
  },
  separatorStyle: {
    height: 1,
    width: "100%",
    backgroundColor: resources.colors.inputLabel,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
    marginBottom: 25,
    marginHorizontal: 20,
  }

});

export default styles;
