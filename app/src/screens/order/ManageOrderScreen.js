import React, {Component} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {Dropdown} from 'react-native-material-dropdown';
import styles from './styles';
import {
  PickerViewModal,
  DOCUMENT,
  IMAGE_PICK,
  CAMERA,
} from '../documentation/kyc/views/PickerViewModal';
import {
  renderInputError,
  checkIsImageOrPdfFileType,
  checkIsImageType,
  checkValidFileSize,
  validateMobileNumber,
  myWidth,
  enumOrderActionType,
  enumDocumentModalType,
} from '../../utility/Utils';
import ImagePicker from 'react-native-image-picker';
import HeaderWithProfile from '../../genriccomponents/header/HeaderWithProfilePic';
import resources from '../../../res';
import MaterialInput from '../../genriccomponents/input/MaterialInput';
import Button from '../../genriccomponents/button/Button';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as actions from '../../redux/actions/OrderAction';
import {connect} from 'react-redux';
import APILoadingHOC from '../../genriccomponents/HOCS/APILoadingHOC';
import DatePicker from 'react-native-datepicker';
import AppToast from '../../genriccomponents/appToast/AppToast';
import { BottomUpModal } from './components/BottomUpModal';
// Option for Image picker
const options = {
  title: 'Select Image',
  mediaType: 'photo',
  allowsEditing: false,
  quality: 0.3,
};

class ManageOrderScreen extends Component {
  constructor(props) {
    super(props);
    this.orderDetail = this.props?.route?.params?.orderData || null;
    this.orderId = this.props?.route?.params?.orderId || null;

    this.state = {
      selectedTabIndex: 0,
      description: '',
      pickOptionsVisible: null,
      attachment: [],
      selectData: null,
      selectedServiceName: '',
      selectedServiceValue: '',
      serviceRequestArr: [],
      dropdownOptionArr: [],
      isDynamicDropdownVisible: false,
      inputsArr: [],
      isDynamicInputFieldsVisible: false,
      isDynamicPickupReasonInputFieldsVisible: false,
      isDynamicPickupTypeCheckboxFieldsVisible: false,
      isDynamicCancellationReasonInputFieldsVisible: false,
      cfPickupReason: '',
      cfCancellationReason: '',
      dateFieldsArr: [],
      isDynamicDateFieldsVisible: false,
      checkboxArr: [],
      multiCheckboxArr: [],
      isDynamicCheckboxVisible: false,
      multiChekboxError: true,
      isDynamicMultiCheckboxVisible: false,
      err: [],
      myRequestedServices: [],
      actionData: {
        show: false,
        selectedIndex: 0,
        modalType: null,
        data: null,
        events: null
      }
    };
  }
  componentDidMount() {
    // this.loadData();
    if (this.orderId) {
      this.loadPostData(this.orderId);
    } else {
      this.loadData();
    }
    this.loadMyServiceRequest();
  }

  loadMyServiceRequest = () => {
    this.props
      .getMyAllSeriveRequestsApi()
      .then(data => {
        this.setState({
          myRequestedServices: data.data,
        });
      })
      .catch(error => {
        console.log(error, 'error');
      });
  };
  loadData = () => {
    this.props
      .hitManageRequestApi()
      .then(data => {
        this.setState({
          serviceRequestArr: data.data.service_request_type,
        });
      })
      .catch(error => {
        console.log(error, 'error');
      });
  };
  loadPostData = dealCodeNumber => {
    this.props
      .hitManageRequestPostApi(dealCodeNumber)
      .then(data => {
        this.setState({
          serviceRequestArr: data.data.service_request_type,
        });
      })
      .catch(error => {
        console.log(error, 'error');
      });
  };
  renderHeader = () => {
    return (
      <HeaderWithProfile
        headerTitle={resources.strings.MANAGE_ORDER}
        isBackIconVisible={true}
        onBackClick={this.onBackClick}
        navigateProps={this.props.navigation}
      />
    );
  };
  onBackClick = () => {
    this.props.navigation.goBack();
  };
  onBackClickNavigation = () => {
    this.props.navigation.navigate('MyServiceRequests');
  };
  onChangeCity = () => {
    this.setState({city: text});
  };

  onSelectServiceRequest = (value, index) => {
    const actionData = JSON.parse(JSON.stringify(this.state.actionData))
    actionData.show = true;
    actionData.selectedIndex = index;
    actionData.modalType = value.value;
    
    // this.setState({actionData});

    let dropdownArr = [];
    let inputFieldArr = [];
    let dateFieldsArr = [];
    let checkboxArr = [];
    let multiCheckboxArr = [];

    switch (value.value) {
      case enumOrderActionType.cancellation: {
        actionData.data = value.attribute;
        actionData.events = {
          upateDynamicDropdownState: (value) => this.upateDynamicDropdownState(value, index),
          handleCancellationReasonMultiInput: (text) => this.handleCancellationReasonMultiInput(text),
          submitDiscription: () => this.submitDiscription(),
          handleCloseAction: () => this.handleCloseAction()
        }
        break;
      }
      case enumOrderActionType.upgrade: {
        actionData.data = value.attribute;
        actionData.events = {
          onPressMultiCheckbox: (value, i) => this.onPressMultiCheckbox(value, i),
          handleMultiInput: (text, i) => this.handleMultiInput(text, i),
          submitDiscription: () => this.submitDiscription(),
          handleCloseAction: () => this.handleCloseAction()
        }
        break;
      }
      case enumOrderActionType.transfer_ownership: {
        actionData.data = [];
        actionData.events = {
          submitDiscription: () => null,
          handleCloseAction: () => this.handleCloseAction()
        }
        break;
      }
      case enumOrderActionType.full_extension: {
        break;
      }
      case enumOrderActionType.request_pickup: {
        break;
      }
      case enumOrderActionType.repair: {
        break;
      }
      case enumOrderActionType.installation: {
        break;
      }
      case enumOrderActionType.relocation: {
        break;
      }
      case enumOrderActionType.buy: {
        break;
      }
      case enumOrderActionType.change_bill_cycle: {
        break;
      }
      case enumOrderActionType.cancel_mandate: {
        break;
      }
    }

    if (value.datatype == 'listvalues' && value.attribute.length > 0) {
      value.attribute.forEach((element, index) => {
        
        if (element.datatype == 'listvalues') {
          element.dynamicValue = 'Select';
          dropdownArr.push(element);
        }
        if (element.datatype == 'date') {
          element.dynamicValue = '';
          dateFieldsArr.push(element);
        }
        if (element.datatype == 'text') {
          element.dynamicValue = '';
          inputFieldArr.push(element);
        }
        if (element.datatype == 'checkbox') {
          element.dynamicValue = false;
          checkboxArr.push(element);
        }
        if (element.datatype == 'multicheckbox') {
          let checkboxResult = value.attribute[0].attribute;
          if (checkboxResult.length > 0) {
            checkboxResult.forEach(element => {
              element.dynamicValue = false;
              multiCheckboxArr.push(element);
            });
          }
        }
      });
    }


    this.setState({
      selectedServiceName: value,
      selectedServiceValue: value.value,
      dropdownOptionArr: dropdownArr,
      isDynamicDropdownVisible: dropdownArr.length > 0 ? true : false,
      inputsArr: inputFieldArr,
      isDynamicInputFieldsVisible: inputFieldArr.length > 0 ? true : false,
      dateFieldsArr: dateFieldsArr,
      isDynamicDateFieldsVisible: dateFieldsArr.length > 0 ? true : false,
      checkboxArr: checkboxArr,
      multiCheckboxArr: multiCheckboxArr,
      multiChekboxError: multiCheckboxArr.length > 0 ? true : false,
      isDynamicCheckboxVisible: checkboxArr.length > 0 ? true : false,
      isDynamicMultiCheckboxVisible: multiCheckboxArr.length > 0 ? true : false,
      isDynamicPickupReasonInputFieldsVisible: false,
      isDynamicPickupTypeCheckboxFieldsVisible:
        value.value == 'request_pickup' && multiCheckboxArr.length > 0
          ? false
          : multiCheckboxArr.length > 0
          ? true
          : false,
      isDynamicCancellationReasonInputFieldsVisible: false,
      actionData
    });
  };
  renderSeprater = () => {
    return (
      <View
        style={{
          height: 0.5,
          backgroundColor: resources.colors.labelColor,
          width: '100%',
        }}
      />
    );
  };
  renderServiceRequestList = () => {
    return (
      <View>
        {this.renderSeprater()}
        {this.state.myRequestedServices &&
        this.state.myRequestedServices.length > 0 ? (
          <FlatList
            data={this.state.myRequestedServices}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this.renderList}
            ListHeaderComponent={this.renderHeaderList}
            ItemSeparatorComponent={this.renderSeprater}
          />
        ) : (
          this.renderEmptyListView()
        )}
      </View>
    );
  };
  renderEmptyListView = () => {
    return (
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <Text>No service request</Text>
      </View>
    );
  };
  renderList = ({item, index}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          height: 50,
          alignItems: 'center',
        }}>
        <View style={{width: 90, flex: 1}}>
          <Text style={styles.listDataStyle}>{item.order_id}</Text>
        </View>
        <View style={{width: 90, flex: 1}}>
          <Text style={styles.listDataStyle}>{item.ticket_id}</Text>
        </View>
        <View style={{width: 90, flex: 1}}>
          <Text style={styles.listDataStyle}>{item.request_type}</Text>
        </View>
        {/* <View style={{ width: 90, flex: 1 }}>
                    <Text style={styles.listDataStyle}>{item.pickup_type ? item.pickup_type : 'NA'}</Text>
                </View> */}
        <View style={{width: 90, flex: 1}}>
          <Text style={styles.listDataStyle}>
            {item.status == '' ? 'Pending' : item.status}
          </Text>
        </View>
      </View>
    );
  };
  renderHeaderList = () => {
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            height: 50,
            alignItems: 'center',
          }}>
          <Text style={styles.orderHeading}>Order Id</Text>
          <Text style={styles.orderHeading}>Ticket Id</Text>
          <Text style={styles.orderHeading}>Request Type</Text>
          {/* <Text style={styles.orderHeading}>Pickup Type</Text> */}
          <Text style={styles.orderHeading}>Status</Text>
        </View>
        {this.renderSeprater()}
      </View>
    );
  };
  upateDynamicDropdownState = (value, arrIndex) => {
    const {dropdownOptionArr} = this.state;
    let tempArr = dropdownOptionArr;
    tempArr[arrIndex].dynamicValue = value;
    this.setState({
      dropdownOptionArr: tempArr,
    });
    if (this.state.selectedServiceValue == 'request_pickup') {
      if (value == 'Partial' && arrIndex == 0) {
        this.setState({
          isDynamicPickupTypeCheckboxFieldsVisible: true,
        });
      } else if (value == 'Other' && arrIndex == 1) {
        this.setState({
          isDynamicPickupReasonInputFieldsVisible: true,
        });
      } else {
        this.setState({
          isDynamicPickupTypeCheckboxFieldsVisible: false,
          isDynamicPickupReasonInputFieldsVisible: false,
        });
      }
    } else if (this.state.selectedServiceValue == 'cancellation') {
      if (value === 'Other') {
        this.setState({
          isDynamicCancellationReasonInputFieldsVisible: true,
        });
      } else {
        this.setState({
          isDynamicCancellationReasonInputFieldsVisible: false,
        });
      }
    }
  };
  renderDynamicDropDown = arr => {
    let views = [];
    for (let i = 0; i < arr.length; i++) {
      let item = arr[i];
      views.push(
        <Dropdown
          key={i + 'dynamicDrop'}
          animationDuration={1}
          rippleDuration={1}
          onChangeText={(value, index) => {
            this.upateDynamicDropdownState(value, i);
          }}
          data={item.attribute.map(val => {
            return {value: val.toString()};
          })}
          value={item.name || 'Select'}
          dropdownPosition={item.attribute.length <= 2 ? -2 : -4}
          renderBase={props => (
            <MaterialInput
              isDropDownImageVisible={true}
              label={item.name}
              value={item.dynamicValue}
              inputProps={{
                editable: false,
              }}
            />
          )}
        />,
      );
    }
    return views;
  };
  onPressMultiCheckbox = (value, arrIndex) => {
    const {multiCheckboxArr} = this.state;
    let multiChekboxFlag = true;
    let tempArr = multiCheckboxArr;
    tempArr[arrIndex].dynamicValue = value;

    for (let element = 0; element < multiCheckboxArr.length; element++) {
      if (multiCheckboxArr[element].dynamicValue) multiChekboxFlag = false;
    }
    
    this.setState({
      multiCheckboxArr: tempArr,
      multiChekboxError: multiChekboxFlag,
    });
  };
  renderMultiCheckboxField = arr => {
    let views = [];
    for (let i = 0; i < arr.length; i++) {
      let item = arr[i];
      views.push(
        <View
          key={`check_${i}`}
          style={{flexDirection: 'row', marginVertical: 7}}>
          <TouchableOpacity
            onPress={() => this.onPressMultiCheckbox(!item.dynamicValue, i)}>
            {item.dynamicValue ? (
              <Image
                source={resources.images.icn_selectedsaqure}
                style={{
                  width: 16,
                  height: 16,
                  paddingVertical: 2,
                  marginTop: 4,
                }}
              />
            ) : (
              <Image
                source={resources.images.icn_unSelectedSqure}
                style={{
                  width: 16,
                  height: 16,
                  paddingVertical: 2,
                  marginTop: 4,
                }}
              />
            )}
          </TouchableOpacity>
          <Text
            style={{fontFamily: resources.fonts.regular, marginHorizontal: 5}}>
            {item.name}
          </Text>
        </View>,
      );
    }

    return (
      <React.Fragment>
        <Text style={styles.multiCheckboxLableStyle}>
          {this.state.selectedServiceName != ''
            ? `Select Products For ${this.state.selectedServiceName}`
            : 'Select Products'}
        </Text>
        {views}
      </React.Fragment>
    );
  };
  onPressCheckbox = (value, arrIndex) => {
    const {checkboxArr} = this.state;
    let tempArr = checkboxArr;
    tempArr[arrIndex].dynamicValue = value;
    this.setState({
      checkboxArr: tempArr,
    });
  };
  renderCheckboxField = arr => {
    let views = [];
    for (let i = 0; i < arr.length; i++) {
      let item = arr[i];
      views.push(
        <View
          key={`check_${i}`}
          style={{flexDirection: 'row', marginVertical: 7}}>
          <TouchableOpacity
            onPress={() => this.onPressCheckbox(!item.dynamicValue, i)}>
            {item.dynamicValue ? (
              <Image
                source={resources.images.icn_selectedsaqure}
                style={{width: 20, height: 20, paddingVertical: 2}}
              />
            ) : (
              <Image
                source={resources.images.icn_unSelectedSqure}
                style={{width: 20, height: 20, paddingVertical: 2}}
              />
            )}
          </TouchableOpacity>
          <Text
            style={{fontFamily: resources.fonts.regular, marginHorizontal: 5}}>
            {item.name}
          </Text>
        </View>,
      );
    }

    return views;
  };
  handleMultiInput = (text, arrIndex) => {
    const {inputsArr} = this.state;
    let tempArr = inputsArr;
    tempArr[arrIndex].dynamicValue = text;
    this.setState({
      inputsArr: tempArr,
    });
  };
  renderInputField = arr => {
    let views = [];
    for (let i = 0; i < arr.length; i++) {
      let item = arr[i];
      views.push(
        <MaterialInput
          label={item.name}
          value={item.dynamicValue}
          onChangeText={text => this.handleMultiInput(text, i)}
          inputProps={{
            multiline: true,
          }}
        />,
      );
    }
    return views;
  };
  handleCancellationReasonMultiInput = text => {
    this.setState({
      cfCancellationReason: text,
    });
  };
  renderCancellationReasonInputField = () => {
    let views = [];
    views.push(
      <View>
        <MaterialInput
          label={'Type your reason'}
          value={this.state.cfCancellationReason}
          onChangeText={text => this.handleCancellationReasonMultiInput(text)}
          inputProps={{
            maxLength: 50,
            multiline: true,
          }}
        />
        <Text style={styles.minimuLabel}>Maximum 50 Characters</Text>
      </View>,
    );
    return views;
  };
  handlePickupReasonMultiInput = text => {
    this.setState({
      cfPickupReason: text,
    });
  };
  renderPickupReasonInputField = () => {
    let views = [];
    views.push(
      <View>
        <MaterialInput
          label={'Type your reason'}
          value={this.state.cfPickupReason}
          onChangeText={text => this.handlePickupReasonMultiInput(text)}
          inputProps={{
            maxLength: 50,
            multiline: true,
          }}
        />
        <Text style={styles.minimuLabel}>Maximum 50 Characters</Text>
      </View>,
    );
    return views;
  };
  handleDateSelect = (date, arrIndex) => {
    const {dateFieldsArr} = this.state;
    let tempArr = dateFieldsArr;
    tempArr[arrIndex].dynamicValue = date;
    this.setState({
      dateFieldsArr: tempArr,
    });
  };
  renderDatePickerField = arr => {
    let views = [];
    for (let i = 0; i < arr.length; i++) {
      let item = arr[i];
      views.push(
        <View>
          <Text style={styles.lableStyle}>{item.name}</Text>
          <DatePicker
            style={{width: '100%'}}
            date={item.dynamicValue}
            mode="date"
            placeholder={'DD-MM-YYYY'}
            // maxDate={new Date()}
            // minDate={c}
            format="DD-MM-YYYY"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            showIcon={false}
            customStyles={{
              dateInput: {
                height: 40,
                justifyContent: 'center',
                alignItems: 'flex-start',
                backgroundColor: resources.colors.white,
                borderWidth: 0,
                borderBottomWidth: 1,
                borderBottomColor: resources.colors.labelColor,
              },
            }}
            onDateChange={dob => {
              this.handleDateSelect(dob, i);
            }}
          />
        </View>,
      );
    }
    return views;
  };
  renderSubmitButton = () => {
    return (
      <Button
        touchOpacityStyle={styles.submitBtn}
        rounded
        btnText={resources.strings.SUBMIT}
        onPress={this.submitDiscription}
      />
    );
  };
  onChangeDescription = text => {
    this.setState({
      description: text,
    });
  };
  renderDescriptionField = () => {
    return (
      <View>
        <MaterialInput
          label={resources.strings.DESCRIPTION}
          value={this.state.description}
          onChangeText={this.onChangeDescription}
          inputProps={{
            maxLength: 300,
            multiline: true,
          }}
        />
        <Text style={styles.minimuLabel}>Maximum 300 Characters</Text>
      </View>
    );
  };
  onClickPickType = type => {
    this.setState({
      pickOptionsVisible: null,
    });
    setTimeout(() => {
      switch (type) {
        case DOCUMENT:
          // Open File picker
          this.openDocument();
          break;
        case IMAGE_PICK:
          // Open Image Library:
          ImagePicker.launchImageLibrary(options, this.onResultFromImagePicker);
          break;
        case CAMERA:
          // Launch Camera:
          ImagePicker.launchCamera(options, this.onResultFromImagePicker);
          break;
        default:
          break;
      }
    }, 500);
  };
  onResultFromImagePicker = response => {
    if (response.didCancel) {
      this.setState({
        pickOptionsVisible: null,
      });
    } else if (response.error) {
      this.setState({
        pickOptionsVisible: null,
      });
    } else {
      if (response != null && response.uri) {
        this.onResultFromPicker(response);
      }
    }
  };
  onResultFromPicker = response => {
    if (!response) {
      AppToast('Please try again');
      return;
    }
    this.setState({
      pickOptionsVisible: null,
    });
    if (checkIsImageOrPdfFileType(response.type)) {
      if (this.state.attachment.length < 4) {
        if (
          checkValidFileSize(response.size ? response.size : response.fileSize)
        ) {
          let uriArr = [];
          let data = {
            url: response.uri,
            fileType: response.type,
            fileName: response.fileName,
          };
          uriArr.push(data);
          this.setState({
            attachment: [...this.state.attachment, ...uriArr],
          });
        } else {
          AppToast('Size can not exceeds 10 MB');
        }
      } else {
        AppToast("Attachment Count can't be more then 4 Files");
      }
    } else {
      AppToast('Please select pdf,jpg,jpeg,png format documents only');
    }
  };
  openDocument = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      this.onResultFromPicker(res);
    } catch (err) {
      this.setState({
        pickOptionsVisible: null,
      });
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };
  showPickerOptions = () => {
    this.setState({
      pickOptionsVisible: 'bottom',
    });
  };
  onPressBackDrop = () => {
    this.setState({
      pickOptionsVisible: null,
    });
  };
  renderAttachmentField = () => {
    const {attachment} = this.state;
    return (
      <View>
        <Text style={styles.attachmentLabel}>Attachment</Text>
        <View style={styles.uploadAreaView}>
          <ImageBackground
            imageStyle={{borderRadius: 6}}
            style={styles.backGroundImage}
            source={resources.images.icn_pdf}
            resizeMode={'contain'}>
            <View
              style={[
                styles.docView,
                {
                  backgroundColor: resources.colors.white,
                },
              ]}>
              <TouchableOpacity
                style={styles.chooseFile}
                onPress={() => this.showPickerOptions()}>
                <Image source={resources.images.img_upload} />
                <Text style={styles.chooseFileText}>
                  {resources.strings.CHOOSE_FILE}
                </Text>
                <Text style={styles.max10MbText}>
                  {resources.strings.MAX10MB4FILES}
                </Text>
                {attachment.length > 0 && (
                  <Text style={styles.max10MbText}>
                    {attachment.length == 1
                      ? attachment.length + ' File'
                      : attachment.length + ' Files'}{' '}
                    Upload Successfully
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
      </View>
    );
  };
  submitDiscription = () => {
    const {
      selectedServiceName,
      selectedServiceValue,
      description,
      attachment,
      dropdownOptionArr,
      inputsArr,
      cfPickupReason,
      cfCancellationReason,
      dateFieldsArr,
      err,
      checkboxArr,
      multiCheckboxArr,
      multiChekboxError,
      isDynamicPickupTypeCheckboxFieldsVisible,
    } = this.state;
    while (err.length != 0) {
      err.pop();
    }
    if (!this.orderId) {
      AppToast('Unable to fetch Order Id');
      err.push('orderID');
      return;
    }
    if (selectedServiceName == '') {
      AppToast('Please select service type');
      err.push('servicetype');
      return;
    }
   
    if (dropdownOptionArr.length > 0) {
      try { 
        for (let element of dropdownOptionArr) {
        if (element.dynamicValue == 'Select') {
          AppToast('Please select drop down options');
          err.push('dropDown');
          return;
        }
      }
      } catch (error) {
        console.log(error)
      }
     
    }
    if (
      this.state.isDynamicPickupReasonInputFieldsVisible &&
      this.state.selectedServiceValue == 'request_pickup'
    ) {
      if (cfPickupReason == '' || cfPickupReason.length > 50) {
        AppToast('Pickup Reason not be empty and not more then 50 character');
        err.push('inputfields');
        return;
      }
    }
    if (
      this.state.isDynamicCancellationReasonInputFieldsVisible &&
      this.state.selectedServiceValue == 'cancellation'
    ) {
      if (cfCancellationReason == '' || cfCancellationReason.length > 50) {
        AppToast(
          'Cancellation Reason not be empty and not more then 50 character',
        );
        err.push('inputfields');
        return;
      }
    }
    if (inputsArr.length > 0) {
      for (let element of inputsArr) {
        if (element.dynamicValue == '') {
          AppToast('Please fill the fields');
          err.push('inputfields');
          return;
        }
      }
    }
    if (dateFieldsArr.length > 0) {
      for (let element of dateFieldsArr) {
        if (element.dynamicValue == '') {
          AppToast('Please select date options');
          err.push('dateFields');
          return;
        }
      }
    }
    if (
      multiCheckboxArr.length > 0 &&
      isDynamicPickupTypeCheckboxFieldsVisible
    ) {
      if (multiChekboxError) {
        AppToast('Please select checkbox options');
        return;
      }
    }
    console.log('err', err)
    if (err.length == 0) {
      let finalPickupReason = 'Other - ' + cfPickupReason;
      let finalCancellationReason = 'Other - ' + cfCancellationReason;
      this.props
        .sendSeriveRequestApi(
          this.orderId,
          selectedServiceValue,
          description,
          attachment,
          dropdownOptionArr,
          inputsArr,
          finalPickupReason,
          finalCancellationReason,
          dateFieldsArr,
          checkboxArr,
          multiCheckboxArr,
        )
        .then(resp => {
          console.log('resp', resp)
          AppToast(resp.message);
          this.onBackClickNavigation();
        })
        .catch(error => {
          AppToast(error);
          this.onBackClick();
        });
    }
  };
  handleCloseAction = () => {
    const actionData = JSON.parse(JSON.stringify(this.state.actionData))
    actionData.show = false;
    actionData.selectedIndex = 0;
    actionData.modalType = null;
    actionData.data = null;
    actionData.events = null
    this.setState({actionData});
  }
  renderAttribute = ({item, index}) => {
    let imgURL = resources.images.cancel;

    switch (item.value) {
      case enumOrderActionType.cancellation: {
        imgURL = resources.images.cancel;
        break;
      }
      case enumOrderActionType.full_extension: {
        imgURL = resources.images.extend_tenure;
        break;
      }
      case enumOrderActionType.request_pickup: {
        imgURL = resources.images.order_pickup;
        break;
      }
      case enumOrderActionType.repair: {
        imgURL = resources.images.repair;
        break;
      }
      case enumOrderActionType.upgrade: {
        imgURL = resources.images.upgrade;
        break;
      }
      case enumOrderActionType.installation: {
        imgURL = resources.images.installation;
        break;
      }
      case enumOrderActionType.relocation: {
        imgURL = resources.images.relocation;
        break;
      }
      case enumOrderActionType.buy: {
        imgURL = resources.images.buy;
        break;
      }
      case enumOrderActionType.change_bill_cycle: {
        imgURL = resources.images.cancel;
        break;
      }
      case enumOrderActionType.cancel_mandate: {
        imgURL = resources.images.cancel;
        break;
      }
    }

    return (
      <TouchableOpacity style={styles.actionView} onPress={() => this.onSelectServiceRequest(item, index)}
      >
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image source={imgURL} style={styles.leftIcon} />
          <Text style={styles.txtAction}>{item?.name}</Text>
        </View>
        <Image
          source={resources.images.splash_right}
          style={styles.rightIcon}
        />
      </TouchableOpacity>
    );
  };

  render() {
    const {
      serviceRequestArr,
      selectedServiceName,
      isDynamicDropdownVisible,
      isDynamicInputFieldsVisible,
      isDynamicPickupReasonInputFieldsVisible,
      isDynamicPickupTypeCheckboxFieldsVisible,
      isDynamicCancellationReasonInputFieldsVisible,
      isDynamicDateFieldsVisible,
      isDynamicCheckboxVisible,
      isDynamicMultiCheckboxVisible,
      myRequestedServices,
      actionData
    } = this.state;

    return (
      <View style={styles.fullScreen}>
        {this.renderHeader()}
        <KeyboardAwareScrollView
          style={{marginTop: 10, borderWidth: 0}}
          bounces={false}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <Text style={styles.txtHeading}>
              {resources.strings.how_can_i_help_you}
            </Text>
            <View style={styles.orderContainer}>
              <Text style={styles.txtOrderNo}>
                {resources.strings.order_id + ': #' + this.orderId}
              </Text>
              <FlatList
                horizontal
                data={[1, 2, 3, 4, 5, 6]}
                keyExtractor={(_, index) => 'product_img_' + index}
                showsHorizontalScrollIndicator={false}
                renderItem={({item, index}) => {
                  return (
                    <View style={styles.productView}>
                      <Image
                        source={resources.images.sample_product}
                        style={styles.imgProduct}
                      />
                      <Text style={styles.txtProductNumber} numberOfLines={2}>
                        {`${index + 1}x`}
                        <Text style={styles.txtProductName}>{` Product ${index +
                          1}`}</Text>
                      </Text>
                    </View>
                  );
                }}
              />
            </View>
            <View style={styles.actionContainer}>
              <Text style={[styles.txtHeading, {fontSize: 16}]}>
                {resources.strings.need_help}
              </Text>

              <FlatList
                data={serviceRequestArr}
                keyExtractor={(_, index) => 'action_item_' + index}
                renderItem={this.renderAttribute}
                ItemSeparatorComponent={() => <View style={styles.divider} />}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
        {
          actionData.show &&
          <BottomUpModal 
          visibleModal={actionData.show}
          modalType={actionData.modalType}
          onPressBackDrop={this.handleCloseAction}
          data={actionData.data}
          events={actionData.events}
        />
        }
        
      </View>
    );
    return (
      <View style={styles.fullScreen}>
        {this.renderHeader()}
        <KeyboardAwareScrollView
          style={{marginTop: 10, borderWidth: 0}}
          bounces={false}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <Text style={styles.txtHeading}>
              {resources.strings.how_can_i_help_you}
            </Text>
            <Dropdown
              animationDuration={1}
              rippleDuration={1}
              onChangeText={(value, index) => {
                this.onSelectServiceRequest(value, index);
              }}
              data={serviceRequestArr.map(item => {
                return {value: item.name};
              })}
              value={selectedServiceName}
              dropdownPosition={-4}
              renderBase={props => (
                <MaterialInput
                  isDropDownImageVisible={true}
                  label={resources.strings.SERVICES_REQUEST_TYPE}
                  value={selectedServiceName}
                  inputProps={{
                    editable: false,
                  }}
                />
              )}
            />

            {isDynamicDropdownVisible &&
              this.renderDynamicDropDown(this.state.dropdownOptionArr)}
            {isDynamicCheckboxVisible &&
              this.renderCheckboxField(this.state.checkboxArr)}
            {isDynamicMultiCheckboxVisible &&
              isDynamicPickupTypeCheckboxFieldsVisible &&
              this.renderMultiCheckboxField(this.state.multiCheckboxArr)}
            {isDynamicInputFieldsVisible &&
              this.renderInputField(this.state.inputsArr)}
            {isDynamicPickupReasonInputFieldsVisible &&
              this.renderPickupReasonInputField()}
            {isDynamicCancellationReasonInputFieldsVisible &&
              this.renderCancellationReasonInputField()}
            {isDynamicDateFieldsVisible &&
              this.renderDatePickerField(this.state.dateFieldsArr)}
            {this.renderDescriptionField()}
            {this.renderAttachmentField()}
          </View>
          {this.renderSubmitButton()}
          <Text
            style={{
              marginVertical: 10,
              marginHorizontal: 10,
              fontSize: 14,
              fontFamily: resources.fonts.bold,
            }}>
            My Service Requests
          </Text>
          {this.renderServiceRequestList()}
        </KeyboardAwareScrollView>
        {this.state.pickOptionsVisible ? (
          <PickerViewModal
            onClickPickType={this.onClickPickType}
            visibleModal={this.state.pickOptionsVisible}
            onPressBackDrop={this.onPressBackDrop}
          />
        ) : (
          <View />
        )}
      </View>
    );
  }
}
const mapStateToProps = state => {
  return {};
};
let container = connect(
  mapStateToProps,
  {...actions},
)(ManageOrderScreen);
let loader = APILoadingHOC(container);
export default loader;
