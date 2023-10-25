import { StyleSheet } from 'react-native'
import resources from '../../../res';

const styles = StyleSheet.create({
    fullScreen: {
        flex: 1,
        backgroundColor:'white'
    },
    font:{
      fontFamily:resources.fonts.regular,
      color:"#45454A",
      fontWeight:'400'
    },
    productThumb:{
      width:64,
      height:64,
      borderRadius:10
    },
    containerLoaderStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position:'absolute',
        top:0,
        bottom:0,
        left:0,
        right:0
      },
      borderButtonView:{
        borderColor:'#DDDDDF',
        borderWidth : 1,
        padding:8,
        borderRadius : 20,
        flexDirection:'row'
      },
      row:{
        flexDirection:'row'
      },
      leftClass : {
        marginLeft : 10
      },
      marginLeft:{
        marginLeft:15,
        marginTop : 15
      }
});

export default styles;
