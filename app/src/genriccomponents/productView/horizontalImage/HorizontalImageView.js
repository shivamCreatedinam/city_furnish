import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import styles from './styles';
import resources from '../../../../res';
import ImageLoad from '../../../genriccomponents/image/ImageLoad';
import {myWidth} from '../../../utility/Utils';

function HorizontalImageView(props) {
  const {
    onSnapToItem,
    data,
    onPressBack,
    onPressHorizontalImageView,
    frpStyle,
    reference,
  } = props;
  
  return (
    <View style={{alignItems: 'center'}}>
      <Carousel
        ref={reference}
        data={data}
        sliderWidth={myWidth}
        itemWidth={myWidth + 200}
        layout={'default'}
        containerCustomStyle={{backgroundColor: 'white',borderRadius:10}}
        renderItem={({item, index}) => (
          <RenderItem
            data={item}
            itemKey={index}
            onPressBack={onPressBack}
            onPressHorizontalImageView={onPressHorizontalImageView}
            frpStyle={frpStyle}
          />
        )}
        onSnapToItem={index => onSnapToItem(index)}
      />
      <View style={[frpStyle ? styles.frpDotContainer : styles.dotContainer]}>
        {pagination(props)}
      </View>
    </View>
  );
}

function pagination(props) {
  const {data, activeIndexHorizontal} = props;
  return (
    <Pagination
      dotsLength={data.length}
      activeDotIndex={activeIndexHorizontal}
      containerStyle={styles.transparentColor}
      dotStyle={styles.activeDotStyle}
      inactiveDotStyle={styles.whiteColor}
      //#C0C0C6 inactiveDotColor={resources.colors.white}
      inactiveDotColor={"#C0C0C6"}
      //dotColor={resources.colors.newYellow}
      dotColor={"#71717A"}
      inactiveDotOpacity={1}
      inactiveDotScale={1}
      dotContainerStyle={styles.marginHoriDotStyle}
    />
  );
}
function RenderItem(props) {
  const {data, frpStyle, onPressHorizontalImageView} = props;
  return (
    <View>
      <TouchableOpacity onPress={onPressHorizontalImageView}>
        <ImageLoad
          source={data ? {uri: data} : resources.images.img_placeholer_large}
          style={[frpStyle ? styles.frpImageStyle : styles.imageStyle]}
          resizeMode={'contain'}
        />
      </TouchableOpacity>
    </View>
  );
}

export default HorizontalImageView;
