import {Text, View, ScrollView} from 'react-native';
import React, {Component} from 'react';
import styles from '../styles';
import MaterialInput from '../../../genriccomponents/input/MaterialInput';
import Button from '../../../genriccomponents/button/Button';
import resources from '../../../../res';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export class TransferOwernershipComponent extends Component {
  handleReasonForUpgradeMultiInput = () => {};

  render() {
    const {events} = this.props;
    return (
      <KeyboardAwareScrollView
        style={{marginTop: 10, borderWidth: 0}}
        bounces={false}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.subComponentContainer}>
          <Text style={styles.txtUpgradeHeading}>
            New owner contact details
          </Text>

          <MaterialInput
            label={'Full name'}
            value={''}
            onChangeText={this.handleReasonForUpgradeMultiInput}
          />
          <MaterialInput
            label={'Mobile number'}
            value={''}
            onChangeText={this.handleReasonForUpgradeMultiInput}
          />
          <MaterialInput
            label={'Email address'}
            value={''}
            onChangeText={this.handleReasonForUpgradeMultiInput}
          />
          <MaterialInput
            label={'Flat no, building no'}
            value={''}
            onChangeText={this.handleReasonForUpgradeMultiInput}
          />
          <MaterialInput
            label={'Pincode'}
            value={''}
            onChangeText={this.handleReasonForUpgradeMultiInput}
          />

          <View
            style={{flexDirection: 'row', alignItems: 'center', width: '100%'}}>
            <View style={{flex: 1}}>
              <MaterialInput
                label={'City'}
                value={''}
                onChangeText={this.handleReasonForUpgradeMultiInput}
              />
            </View>
            <View style={{flex: 1, marginLeft: 10}}>
              <MaterialInput
                label={'State'}
                value={''}
                onChangeText={this.handleReasonForUpgradeMultiInput}
              />
            </View>
          </View>

          <Button
            rounded
            btnText={resources.strings.create_request}
            onPress={() => {
              events?.handleCloseAction();
              // events?.submitDiscription();
            }}
            btnStyle={styles.btnSubmit}
            showRightIcon={true}
            disableTouch={true}
          />
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

export default TransferOwernershipComponent;
