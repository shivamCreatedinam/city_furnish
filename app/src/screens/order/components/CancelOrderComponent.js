import {TextInput, View, Image, Text} from 'react-native';
import React, {Component} from 'react';
import {Dropdown} from 'react-native-material-dropdown';
import MaterialInput from '../../../genriccomponents/input/MaterialInput';
import {myWidth} from '../../../utility/Utils';
import resources from '../../../../res';
import styles from '../styles';
import Button from '../../../genriccomponents/button/Button';

export class CancelOrderComponent extends Component {

  constructor(props) {
    super(props)

    this.state = {
      cancelReason: null,
      otherReason: ''
    }
  }

  handleDropdownSelect = (value, index) => {
    this.setState({cancelReason: value?.toLowerCase() == 'other' ? 'other' : value })
    this.props.events?.upateDynamicDropdownState(value)
  }

  handleCancellationReasonMultiInput = (otherReason) => {
    this.setState({otherReason})
    this.props.events?.handleCancellationReasonMultiInput(otherReason)
  }

  render() {
    const {data, events} = this.props
    const {cancelReason, otherReason} = this.state;

    const enableButton = Boolean(cancelReason) && Boolean(cancelReason.trim()) && (cancelReason === 'other' ? Boolean(otherReason) && Boolean(otherReason.trim) : true)

    return (
      <View
        style={styles.subComponentContainer}>
        {data.map((item, index) => {
          return (
            <Dropdown
              key={index + 'dynamicDrop'}
              animationDuration={1}
              rippleDuration={1}
              onChangeText={(value, myindex) => {
                this.handleDropdownSelect(value, index);
              }}
              data={item.attribute.map(val => {
                return {value: val.toString()};
              })}
              value={item.name || 'Select'}
                dropdownPosition={5}
              renderBase={props => (
                <View style={styles.dropDown}>
                  <TextInput value={cancelReason || item.name} editable={false} style={{color: resources.colors.grayColor}} />
                  <Image
                    source={resources.images.img_DropDown}
                    style={styles.imgDropDown}
                  />
                </View>
              )}
            />
          );
        })}

        {
          cancelReason?.toString()?.toLowerCase() === 'other' &&
          <View>
          <MaterialInput
            label={'Type your reason'}
            value={otherReason}
            onChangeText={this.handleCancellationReasonMultiInput}
            inputProps={{
              maxLength: 50,
              multiline: true,
              marginTop: 10, innerHeight:100
            }}
          />
          <Text style={styles.minimuLabel}>Maximum 50 Characters</Text>
        </View>
        }

    

        <Button
            rounded
            btnText={resources.strings.create_request}
            onPress={() => {
              this.props.events?.handleCloseAction()
              this.props.events?.submitDiscription()
            }}
            btnStyle={styles.btnSubmit}
            showRightIcon={true}
            disableTouch={!enableButton}
          />
      </View>
    );
  }
}

export default CancelOrderComponent;
