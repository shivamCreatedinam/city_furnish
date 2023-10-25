import { StyleSheet } from 'react-native';
import { widthScale, heightScale } from '../../utility/Utils';
// import resources from '../../../res';
const styles = StyleSheet.create({
    MainContainer: {
        justifyContent: 'center',
        flex: 1,
    },
    dashboardContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: heightScale(33)
    }
});
export default styles;
