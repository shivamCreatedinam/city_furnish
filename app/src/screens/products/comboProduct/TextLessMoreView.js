
import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { myWidth } from '../../../utility/Utils';
import resources from '../../../../res';

const TextLessMoreView = (props) => {
  const [textShown, setTextShown] = useState(false); //To show your remaining Text
  const [lengthMore, setLengthMore] = useState(true); //to show the "Read more & Less Line"
  const [triggerTextLocation, setTriggerTextLocation] = useState({
    top: 0,
    right: 0,
    bottom: 0,
  });

  const toggleNumberOfLines = () => {
    setTextShown(!textShown);
  };

  const onTextLayout = (e) => {
    const { lines } = e.nativeEvent;
    if (lines && Array.isArray(lines) && lines.length > 0) {
      let tempTxtLocaation = {
        top: (lines.length - 1) * lines[0].height,
        right: myWidth - lines[lines.length - 1].width - 10,
      };
      setTriggerTextLocation(tempTxtLocaation);
      setLengthMore(lines.length >= props.targetLines);
    }
  };

  return (
    <View style={[styles.mainBody, props.containerStyle]}>
      <Text
        onTextLayout={onTextLayout}
        numberOfLines={textShown ? undefined : props.targetLines || 1}
        style={styles.txtStyle}
      >
        {props.text || ""}
      </Text>
      {lengthMore ? (
        <Text
          onPress={toggleNumberOfLines}
          style={[
            styles.lessMoreStyle,
            {
                position: "absolute",
                backgroundColor: resources.colors.white,
                right: 0,
                bottom: 0
            },
          ]}
        >
          {textShown ? " Less" : "...More"}
        </Text>
      ) : null}
    </View>
  );
};
const styles = StyleSheet.create({
  mainBody: {
    marginTop: 0,
    flex: 1
  },
  txtStyle: {
    color: "rgb(28,28,28)",
    fontSize: 10,
    fontFamily: resources.fonts.regular,
    flex: 1,
    lineHeight: 13
  },
  lessMoreStyle: {
    fontFamily: resources.fonts.regular,
    color: resources.colors.appColor,
    fontSize: 10,
    // width: 50,
    paddingRight: 4,
    paddingBottom: 0,
    // borderRadius: 100
  },
});
export default TextLessMoreView;