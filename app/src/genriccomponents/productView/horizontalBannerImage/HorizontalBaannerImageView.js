import React, {Component} from 'react';
import Carousel, { ParallaxImage } from 'react-native-snap-carousel';
import { Dimensions, Platform, StyleSheet,View,Text } from 'react-native';
import { heightScale, isIphone11orAbove, myWidth } from '../../../utility/Utils';


const { width: screenWidth } = Dimensions.get('window')

export default class HorizontalBaannerImageView extends Component {

    _renderItem ({item, index}, parallaxProps) {
        return (
            <View style={styles.item}>
                <ParallaxImage
                    source={{ uri: item }}
                    containerStyle={styles.imageContainer}
                    style={styles.image}
                    parallaxFactor={0.0}
                    {...parallaxProps}
                />
                <Text style={styles.title} numberOfLines={2}>
                    
                </Text>
            </View>
        );
    }

    render () {
        return (
            <Carousel
                sliderWidth={screenWidth}
                sliderHeight={screenWidth}
                itemWidth={screenWidth - 60}
                data={this.props.data}
                renderItem={this._renderItem}
                hasParallaxImages={true}
                firstItem={1}
                loop={true}
            />
        );
    }
}

const styles = StyleSheet.create({
  item: {
    // width: screenWidth - 60,
    // height: screenWidth - 60,
    width: myWidth - 60 ,
    height: isIphone11orAbove() ? heightScale(190) : heightScale(190),
    
    
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
    backgroundColor: 'white',
    borderRadius: 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'contain',
  },
})


// import React from 'react';
// import {FlatList, Image, View,StyleSheet,Platform} from 'react-native';
// import Carousel, {Pagination,ParallaxImage} from 'react-native-snap-carousel';
// import styles from './styles';
// import resources from '../../../../res';
// import ImageLoad from '../../image/ImageLoad';
// import {myWidth, isIphone11orAbove} from '../../../utility/Utils';
// import {TouchableOpacity} from 'react-native';

// function HorizontalBaannerImageView(props) {
//   const {
//     onSnapToItem,
//     data,
//     onPressBack,
//     onPressSliderAction,
//     frpStyle,
//     reference,
//   } = props;
  
//   return (
//     <View style={{alignItems: 'center'}}>
// <Carousel
//                 sliderWidth={screenWidth}
//                 sliderHeight={screenWidth}
//                 itemWidth={screenWidth - 60}
//                 data={data}
//                 renderItem={this._renderItem}
//                 hasParallaxImages={true}
//             />
//     {/* <FlatList
//       horizontal
//       pagingEnabled={true}
//       showsHorizontalScrollIndicator={false}
//       legacyImplementation={false}
//       data={data}
//       renderItem={item => renderPhoto(item)}
//       keyExtractor={photo => photo.id}
//       style={{width: myWidth - 30, height:'70%'}}
//     /> */}
//       {/* <Carousel
//         ref={reference}
//         data={data}
//         sliderWidth={myWidth}
//         itemWidth={myWidth}
//         layout={'default'}
//         containerCustomStyle={{backgroundColor: 'white'}}
//         //hasParallaxImages={true}
//         renderItem={({item, index}) => (
//           <RenderItem
//             data={item}
//             itemKey={index}
//             onPressBack={onPressBack}
//             onPressSliderAction={onPressSliderAction}
//             frpStyle={frpStyle}
//           />
//         )}
//         onSnapToItem={index => onSnapToItem(index)}
//       /> */}
//       {/* <View style={[frpStyle ? styles.frpDotContainer : styles.dotContainer]}>
//         {pagination(props)}
//       </View> */}
//     </View>
//   );
// }

// function _renderItem ({item, index}, parallaxProps) {
//   console.log('data ::',data)
//   // return (
//   //     <View style={styles.item}>
//   //         <ParallaxImage
//   //             source={{ uri: item.thumbnail }}
//   //             containerStyle={styles.imageContainer}
//   //             style={styles.image}
//   //             parallaxFactor={0.4}
//   //             {...parallaxProps}
//   //         />
//   //         <Text style={styles.title} numberOfLines={2}>
//   //             { item.title }
//   //         </Text>
//   //     </View>
//   // );
// }
// function renderPhoto ({ item, index }){
//   return (
//       <View style = {{ width: myWidth + 5, height: 'auto', 
//         flexDirection:'row'}}>
//         <Image 
//           style={[styles.frpImageStyle]}
//           resizeMode ={'contain'}
//           source = {{ uri: item }}
//         /> 
        
//       </View>
//   )}

    
// function pagination(props) {
//   const {data, activeIndexHorizontal} = props;
//   return (
//     <Pagination
//       dotsLength={data.length}
//       activeDotIndex={activeIndexHorizontal}
//       containerStyle={styles.transparentColor}
//       dotStyle={styles.activeDotStyle}
//       inactiveDotStyle={styles.whiteColor}
//       inactiveDotColor={resources.colors.white}
//       dotColor={resources.colors.appColor}
//       inactiveDotOpacity={1}
//       inactiveDotScale={1}
//       dotContainerStyle={styles.marginHoriDotStyle}
//     />
//   );
// }
// function RenderItem(props) {
//   const {data, frpStyle, onPressSliderAction, itemKey} = props;
//   console.log('data ::',data)
//   return (
//     <View>
//       <TouchableOpacity onPress={onPressSliderAction}>
//         <ImageLoad
//           source={data ? {uri: data} : resources.images.img_placeholer_large}
//           //style={[frpStyle ? styles.frpImageStyle : styles.imageStyle]}
//           style={[styles.imageStyle]}
//           resizeMode={isIphone11orAbove() ? 'stretch' : 'cover'}
//         />
//         {/* <ParallaxImage
//                     source={data ? {uri: data} : resources.images.img_placeholer_large}
//                     containerStyle={styles.imageContainer}
//                     style={styles.image}
//                     parallaxFactor={0.4}
                    
//                 /> */}
//       </TouchableOpacity>
//     </View>
//   );
// }

// export default HorizontalBaannerImageView;


// const styles = StyleSheet.create({
//   item: {
//     width: myWidth - 60,
//     height: myWidth - 60,
//   },
//   imageContainer: {
//     flex: 1,
//     marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
//     backgroundColor: 'white',
//     borderRadius: 8,
//   },
//   image: {
//     ...StyleSheet.absoluteFillObject,
//     resizeMode: 'cover',
//   },
// })
