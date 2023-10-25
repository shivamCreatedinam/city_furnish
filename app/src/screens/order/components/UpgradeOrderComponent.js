import {Text, View, FlatList, Image, TouchableOpacity, ScrollView} from 'react-native';
import React, {Component} from 'react';
import {myWidth} from '../../../utility/Utils';
import Button from '../../../genriccomponents/button/Button';
import resources from '../../../../res';
import styles from '../styles';
import CheckBox from '@react-native-community/checkbox';
import MaterialInput from '../../../genriccomponents/input/MaterialInput';

export class UpgradeOrderComponent extends Component {
  constructor(props) {
    super(props);

    let multiSelectData= []
    let reasonForUpgrade = null;
    this.multiSelectIndex = null;
    this.reasonForUpgradeIndex = null;

    props.data.find((item, index) => {
      if(item.datatype == "multicheckbox") {
        multiSelectData = item
        this.multiSelectIndex = index
      }else if (item.datatype == "text") {
        reasonForUpgrade = item
        this.reasonForUpgradeIndex = index
      }
    })

    this.state = {
      multiSelectData,
      reasonForUpgrade
    };
  }

  handleCheckboxPress = (item, index) => {
    const multiSelectData = JSON.parse(
      JSON.stringify(this.state.multiSelectData),
    );

    multiSelectData.attribute[index].dynamicValue = !item.dynamicValue;

    this.setState({multiSelectData});

    this.props.events.onPressMultiCheckbox(!item.dynamicValue, index);
  };

  handleReasonForUpgradeMultiInput = (text) => {
    const reasonForUpgrade = JSON.parse(
      JSON.stringify(this.state.reasonForUpgrade),
    );
    reasonForUpgrade.dynamicValue = text
    this.setState({
      reasonForUpgrade
    })

    this.props.events.handleMultiInput(text, 0)
  }

  renderUpgradeItems = ({item, index}) => {
    return (
      <TouchableOpacity
        style={styles.upgradeItem}
        onPress={() => this.handleCheckboxPress(item, index)}>
        <Image
          source={
            item.dynamicValue
              ? resources.images.check
              : resources.images.uncheck
          }
          style={styles.imgCheckbox}
        />
        <View style={[styles.flexRowAlignCenter, styles.checkBoxTextContaner]}>
          <Image
            source={resources.images.sample_product}
            style={styles.imgUpgradeProduct}
          />
          <Text numberOfLines={1} style={styles.txtUpgradeCheckboxName}>
            {item?.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  render() {
    const {events, data} = this.props;
    const {multiSelectData, reasonForUpgrade} = this.state;
    const enableButton = multiSelectData?.attribute?.filter(
      item => item.dynamicValue === true,
    );

    return (
      <View style={styles.subComponentContainer}>
        <FlatList
          scrollEnabled={false}
          data={multiSelectData?.attribute}
          keyExtractor={(_, index) => 'multi_select_' + index}
          renderItem={this.renderUpgradeItems}
          ListHeaderComponent={() => (
            <Text style={styles.txtUpgradeHeading}>
              Select products to upgrade
            </Text>
          )}
        />

        {Boolean(reasonForUpgrade) && (
          <View>
            <Text style={[styles.txtUpgradeHeading, {marginBottom: 0, marginTop: 10}]}>
              {reasonForUpgrade.name}
            </Text>
            <MaterialInput
              label={'Type your reason'}
              value={reasonForUpgrade?.dynamicValue}
              onChangeText={this.handleReasonForUpgradeMultiInput}
              inputProps={{
                maxLength: 50,
                multiline: true,
              }}
            />
            <Text style={styles.minimuLabel}>Maximum 50 Characters</Text>
          </View>
        )}

        <Button
          rounded
          btnText={resources.strings.create_request}
          onPress={() => {
            events?.handleCloseAction();
            events?.submitDiscription();
          }}
          btnStyle={styles.btnSubmit}
          showRightIcon={true}
          disableTouch={!(enableButton?.length > 0 && Boolean(reasonForUpgrade?.dynamicValue))}
        />
      </View>
    );
  }
}

export default UpgradeOrderComponent;
