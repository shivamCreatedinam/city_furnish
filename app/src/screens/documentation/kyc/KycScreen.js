import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ImageBackground,
  Alert,
  BackHandler,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Dropdown} from 'react-native-material-dropdown';
import DocumentPicker from 'react-native-document-picker';
import {connect} from 'react-redux';
import StepIndicator from 'react-native-step-indicator';
import styles from './styles';
import Button from '../../../genriccomponents/button/Button';
import resources from '../../../../res';
import * as actions from '../../../redux/actions/DocumentAction';
import MaterialInput from '../../../genriccomponents/input/MaterialInput';
import Modal from 'react-native-modal';
import HeaderWithProfile from '../../../genriccomponents/header/HeaderWithProfilePic';
import {
  PickerViewModal,
  DOCUMENT,
  IMAGE_PICK,
  CAMERA,
} from './views/PickerViewModal';
import {
  renderInputError,
  checkIsImageOrPdfFileType,
  checkIsImageType,
  checkValidFileSize,
  validateMobileNumber,
  isPlatformIOS,
  enumDocumentModalType,
} from '../../../utility/Utils';
import ImagePicker from 'react-native-image-picker';
import kycModal from './modal/kycModal';
import Icon from 'react-native-vector-icons/FontAwesome';
import APILoadingHOC from '../../../genriccomponents/HOCS/APILoadingHOC';
import AppToast from '../../../genriccomponents/appToast/AppToast';
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
import {customStyles} from '../../../utility/Utils';
import {CheckBox} from 'native-base';
import {DoneReceiveOtpModal} from '../../signin/DontReceiveOtpModal';
import { DocumentViewModal } from './views/DocumentViewModal';
// Option for Image picker
const options = {
  title: 'Select Image',
  mediaType: 'photo',
  allowsEditing: false,
  quality: 0.3,
};

class KycScreen extends Component {
  static ROUTE_NAME = 'KycScreen';
  constructor(props) {
    super(props);
    this.creditScore =
      this.props.route.params && this.props.route.params.creditScore
        ? this.props.route.params.creditScore
        : '0';
    this.orderId =
      this.props.route.params && this.props.route.params.orderId
        ? this.props.route.params.orderId
        : '1360681880';
    this.isUpfrontPayment =
      this.props.route.params && this.props.route.params.isUpfrontPayment
        ? this.props.route.params.isUpfrontPayment
        : false;
    this.isComingFromPaymentSucess =
      this.props.route.params &&
      this.props.route.params.isComingFromPaymentSucess
        ? this.props.route.params.isComingFromPaymentSucess
        : false;
    this.state = {
      userType: [
        {
          value: 'Owner',
        },
        {
          value: 'Tenant',
        },
      ],
      selectUserType: '',
      error: {},
      linkedInUrl: '',
      specialRemark: '',
      userTypeValue: '',
      stepPosition: 2,
      pickOptionsVisible: null,
      render: false,
      isSubmitBtnPressed: false,
      ownerPhoneNumber: '',
      ownerName: '',
      isModalVisible: false,
      duration: '',
      urlToBeView: '',
      documentID: '',
      
      kycDocumentsDetailObjState: [],
      kycDocumentsTypeObject: {},
      isTermsAndCondition: false,
      dontHaveDocument: {
        show: false,
        selectedIndex: 0,
        modalType: enumDocumentModalType.document,
        data: [
          {heading: "Don't have a PAN card?", title: 'PAN number',},
          {heading: "Don't have a Voter ID?", title: 'Voter ID'},
          {heading: "Don't have a Driving License?", title: 'Driving License'},
        ],
      },
    };
  }
  handleBackButton() {
    AppToast('Please upload required documents first');
    return true;
  }

  loadData = () => {
    this.props
      .getViewOrderDetailApi(this.orderId)
      .then(data => {
        console.log(data.data.duration, 'duration from kyc');
        this.setState({
          duration: data.data.duration,
        });
      })
      .catch(error => {
        console.log('error', error);
      });
  };

  componentWillUnmount() {
    this.props.onSaveKycDocumentDetailAction(null);
    if (this.isComingFromPaymentSucess) {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        this.handleBackButton,
      );
    }
  }
  componentDidMount() {
    if (this.isComingFromPaymentSucess) {
      BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }
    this.forceUpdate();
    this.loadData();
    this.props
      .hitGetCbilDocumentApi(this.creditScore)
      .then(resp => {
        console.log('resp', JSON.stringify(resp));
        this.setState({
          kycDocumentsDetailObjState: resp.data,
        });
        let obj = new kycModal(resp);
        this.props.onSaveKycDocumentDetailAction(obj);

        this.state.kycDocumentsDetailObjState.forEach(
          (
            kycDocumentsDetailObjStateValue,
            index,
            kycDocumentsDetailObjStateArr,
          ) => {
            let item = kycDocumentsDetailObjStateArr[index].document_type[0];
            if (item.attribute.length == 1) {
              let tempArr = kycDocumentsDetailObjStateArr;
              tempArr[index].document_type[0].dynamicValue = item.attribute[0];

              const {kycDocumentsDetailObj} = this.props;
              const {currentSelectedPos} = kycDocumentsDetailObj;
              let document =
                kycDocumentsDetailObj.documents[currentSelectedPos];
              let data = {
                name: item.attribute[0],
              };
              document.documentArr.push(data);
              this.props.onSaveKycDocumentDetailAction(kycDocumentsDetailObj);

              this.setState(
                {
                  kycDocumentsDetailObjState: tempArr,
                  render: !this.state.render,
                },
                () => {
                  this.callbackToRemoveError('documentTypeRef');
                },
              );
            }
          },
        );
      })
      .catch(error => {
        console.log('error inside cbil', error);
      });
  }

  onChangeOwnerNumber = text => {
    this.setState({ownerPhoneNumber: text});
  };

  onChangeDocument = text => {
    this.setState({documentID: text});
  };

  onChangeDOB = text => {
    this.setState({dob: text});
  };

  onChangeOwnerName = text => {
    this.setState({ownerName: text});
  };
  onChangeUserType = text => {
    this.setState({userTypeValue: text});
  };
  onChangeLinkedInUrl = text => {
    this.setState({linkedInUrl: text});
  };
  onChangeSpecialRemark = text => {
    this.setState({specialRemark: text});
  };
  getImageUriToBeShownOnUi = arr => {
    if (arr.length > 0) {
      let index = arr.length - 1;
      return arr[index].url;
    } else {
      return '';
    }
  };
  getDocumentTypeToBeShownOnUi = arr => {
    if (arr.length > 0) {
      let index = arr.length - 1;
      return arr[index].name;
    } else {
      return '';
    }
  };
  renderAllUrlsOnUi = (parentIndex, UrlArr) => {
    let views = [];
    for (let i = 0; i < UrlArr.length; i++) {
      let item = UrlArr[i];
      let name = item.fileName
        ? item.fileName
        : item.url.substring(UrlArr[i].url.length - 25, UrlArr[i].url.length);
      views.push(
        <View key={i.toString()} style={styles.crossView}>
          <Text style={styles.suppoer_Doc_text}>...{name}</Text>
          <TouchableOpacity
            style={{borderWidth: 0, padding: 5}}
            onPress={() => this.onRemoveImage(parentIndex, i, item.url)}>
            <Image
              style={styles.crossIcon}
              source={resources.images.icn_close}
            />
          </TouchableOpacity>
        </View>,
      );
    }
    return views;
  };
  renderAllUrlsOnUiImages = (parentIndex, UrlArr) => {
    let views = [];
    for (let i = 0; i < UrlArr.length; i++) {
      let item = UrlArr[i];
      let name = item.fileName
        ? item.fileName
        : item.url.substring(UrlArr[i].url.length - 25, UrlArr[i].url.length);
      let isImage = checkIsImageType(UrlArr[i].url);
      views.push(
        <View key={i.toString()} style={styles.crossInnerView}>
          <Text style={styles.suppoer_Doc_text}>...{name} </Text>
          {isImage && (
            <TouchableOpacity
              style={{borderWidth: 0, padding: 5}}
              onPress={() => this.onViewImage(parentIndex, i, item.url)}>
              <Icon
                name="eye"
                size={16}
                color={resources.colors.appColor}
                type="ionicon"
                style={{marginTop: isPlatformIOS ? 0 : 5}}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.crossInnerIcon}
            onPress={() => this.onRemoveImage(parentIndex, i, item.url)}>
            <Image
              style={styles.crossInnerIcon}
              source={resources.images.icn_close}
            />
          </TouchableOpacity>
        </View>,
      );
    }
    return views;
  };

  showInfomatoryMessage = data => {
    Alert.alert(
      'Description',
      data,
      [
        {
          text: 'Ok',
          onPress: () => {
            console.log('ok pressed');
          },
          style: 'cancel',
        },
      ],
      {cancelable: true},
    );
  };

  upateDynamicDropdownState = (value, arrIndex) => {
    let tempArr = this.state.kycDocumentsDetailObjState;
    tempArr[arrIndex].document_type[0].dynamicValue = value;

    const {kycDocumentsDetailObj} = this.props;
    let document = kycDocumentsDetailObj.documents[arrIndex];
    if (document.documentArr.length == 0) {
      let data = {name: value};
      document.documentArr.push(data);
    } else {
      document.documentArr.splice(0, document.documentArr.length);
      let data = {name: value};
      document.documentArr.push(data);
    }
    this.props.onSaveKycDocumentDetailAction(kycDocumentsDetailObj);

    this.setState(
      {
        kycDocumentsDetailObjState: tempArr,
        render: !this.state.render,
      },
      () => {
        this.callbackToRemoveError('documentTypeRef');
      },
    );
  };

  renderDynamicDropDown = (arr, type_index) => {
    const {error} = this.state;
    let views = [];
    for (let i = 0; i < arr.length; i++) {
      let item = arr[i];
      views.push(
        <Dropdown
          key={i + 'dynamicDrop'}
          animationDuration={1}
          rippleDuration={1}
          onChangeText={(value, index) => {
            this.upateDynamicDropdownState(value, type_index);
          }}
          data={item.attribute.map(val => {
            return {value: val.toString(), i: i};
          })}
          value={item.name || 'Select'}
          dropdownPosition={
            item.attribute.length >= 3
              ? -5
              : item.attribute.length == 2
              ? -4
              : -2
          }
          renderBase={props => (
            <MaterialInput
              isDropDownImageVisible={true}
              label={item.name}
              // value={item.name || 'Select'}
              value={
                item.attribute.length == 1
                  ? item.attribute[0]
                  : item.dynamicValue
              }
              error={renderInputError('documentTypeRef', error)}
              errorKey={'documentTypeRef'}
              callbackToRemoveError={this.callbackToRemoveError}
              inputProps={{
                editable: false,
              }}
            />
          )}
          error={renderInputError('documentTypeRef', error)}
        />,
      );
    }
    return views;
  };
  renderUploadDocument = ({item, index}) => {
    let imgUrl = this.getImageUriToBeShownOnUi(item.uriArr);
    let isImage = checkIsImageType(imgUrl);
    return (
      <View style={styles.documentSection}>
        <View style={styles.docTitleView}>
          <Text style={styles.docText}>{item.docName}</Text>
          <TouchableOpacity
            style={styles.infoView}
            onPress={() => {
              this.showInfomatoryMessage(item.description);
            }}>
            <Image
              style={styles.infoImgStyle}
              source={resources.images.icn_info}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.suppoer_Doc_text}>({item.supportedDocs})</Text>
        <View style={{marginTop: 0}}>
          {this.renderDynamicDropDown(item.documentType, index)}
        </View>
        <View key={item.id} style={styles.uploadDocumentView}>
          <View>{this.renderAllUrlsOnUi(index, item.uriArr)}</View>

          <View style={styles.uploadAreaView}>
            <ImageBackground
              imageStyle={{borderRadius: 6}}
              style={styles.backGroundImage}
              source={isImage ? {uri: imgUrl} : resources.images.icn_pdf}
              resizeMode={isImage ? 'cover' : 'contain'}>
              <View
                style={[
                  styles.docView,
                  {
                    backgroundColor: imgUrl
                      ? resources.colors.blackAlpha
                      : resources.colors.white,
                  },
                ]}>
                <TouchableOpacity
                  style={styles.chooseFile}
                  onPress={() => this.showPickerOptions(index)}>
                  <Image source={resources.images.img_upload} />
                  <Text style={styles.chooseFileText}>
                    {resources.strings.CHOOSE_FILE}
                  </Text>
                  <Text style={styles.max10MbText}>
                    {resources.strings.MAX10MB}
                  </Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>
          {!imgUrl && this.state.isSubmitBtnPressed ? (
            <Text
              style={[styles.errorText]}
              numberOfLines={1}
              ellipsizeMode={'middle'}>
              {'Please select minimum one document'}
            </Text>
          ) : null}
        </View>
      </View>
    );
  };
  renderAllUploadDocument = ({item, index}) => {
    let imgEmptyUrl = this.getImageUriToBeShownOnUi(item.uriArr);
    return (
      <View style={styles.documentSection}>
        <View style={styles.docTitleView}>
          <Text style={styles.docText}>{item.docName}</Text>
          <TouchableOpacity
            style={styles.infoView}
            onPress={() => {
              this.showInfomatoryMessage(item.description);
            }}>
            <Image
              style={styles.infoImgStyle}
              source={resources.images.icn_info}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.suppoer_Doc_text}>({item.supportedDocs})</Text>
        <View style={{marginTop: 0}}>
          {this.renderDynamicDropDown(item.documentType, index)}
        </View>
        <View key={item.id} style={styles.uploadDocumentView}>
          <View>{this.renderAllUrlsOnUi(index, item.uriArr)}</View>

          <View style={styles.uploadAreaView}>
            {item.uriArr.length > 0 ? (
              item.uriArr.map(imageUrl => {
                let imgUrl = imageUrl.url;
                let isImage = checkIsImageType(imgUrl);
                return (
                  <React.Fragment>
                    <ImageBackground
                      imageStyle={{borderRadius: 6, marginBottom: 6}}
                      style={styles.backGroundInnerImage}
                      source={
                        isImage ? {uri: imgUrl} : resources.images.icn_pdf
                      }
                      resizeMode={'cover'}>
                      <View
                        style={[
                          styles.docView,
                          {
                            backgroundColor: imgUrl
                              ? resources.colors.blackAlpha
                              : resources.colors.white,
                          },
                        ]}>
                        <TouchableOpacity
                          style={styles.chooseFile}
                          onPress={() => this.showPickerOptions(index)}>
                          <Image source={resources.images.img_upload} />
                          <Text style={styles.chooseFileText}>
                            {resources.strings.CHOOSE_FILE}
                          </Text>
                          <Text style={styles.max10MbText}>
                            {resources.strings.MAX10MB}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </ImageBackground>
                    {!imgUrl && this.state.isSubmitBtnPressed ? (
                      <Text
                        style={[styles.errorText]}
                        numberOfLines={1}
                        ellipsizeMode={'middle'}>
                        {'Please select minimum one document'}
                      </Text>
                    ) : null}
                  </React.Fragment>
                );
              })
            ) : (
              <React.Fragment>
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
                      onPress={() => this.showPickerOptions(index)}>
                      <Image source={resources.images.img_upload} />
                      <Text style={styles.chooseFileText}>
                        {resources.strings.CHOOSE_FILE}
                      </Text>
                      <Text style={styles.max10MbText}>
                        {resources.strings.MAX10MB}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ImageBackground>
              </React.Fragment>
            )}
          </View>
          {!imgEmptyUrl && this.state.isSubmitBtnPressed ? (
            <Text
              style={[styles.errorText]}
              numberOfLines={1}
              ellipsizeMode={'middle'}>
              {'Please select minimum one document'}
            </Text>
          ) : null}
        </View>
      </View>
    );
  };

  renderUploadDocumentImages = ({item, index}) => {
    let imgEmptyUrl = this.getImageUriToBeShownOnUi(item.uriArr);
    // let documentName = this.getDocumentTypeToBeShownOnUi(item.documentArr)

    return (
      <View style={styles.uploadSection} key={item.id}>
        <View style={styles.uploadView}>
          <View>
            <Text style={styles.uploadTitleText}>{item.docName}</Text>
            <Text style={styles.uploadDetailText}>
              ({item.supportedDocs})
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              this.showInfomatoryMessage(item.description);
            }}>
            <Image
              style={styles.infoImgStyle}
              source={resources.images.icn_info}
            />
          </TouchableOpacity>
        </View>
        {/* <View style={{marginTop: 0}}>
            {this.renderDynamicDropDown(item.documentType, index)}
          </View> */}
        <View style={{marginBottom: 20, marginTop: 20}}>
          {imgEmptyUrl ? (
            <Button
              rounded
              btnText={resources.strings.upload_file}
              onPress={this.submitKycDocument}
              disableTouch={false}
              btnStyle={styles.btnUpload}
              showRightIcon={false}
              renderRight={() => <Image source={resources.images.upload} />}
            />
          ) : (
            <Button
              rounded
              uploaded
              btnText={'abcfile.pdf'}
              onPress={this.submitKycDocument}
              disableTouch={true}
              btnStyle={[styles.btnUpload, styles.btnUploaded]}
              textStyle={styles.btnUploadText}
              showRightIcon={false}
              renderRight={() => (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image source={resources.images.reload} style={{height: 20, width: 20}} />
                  <Image source={resources.images.delete} style={{height: 20, width: 20, marginLeft: 5}} />
                </View>
              )}>
              <Image
                source={resources.images.success}
                style={{height: 20, width: 20}}
              />
            </Button>
          )}
        </View>
        {imgEmptyUrl ? (
          <Text
            style={[styles.errorText]}
            numberOfLines={1}
            ellipsizeMode={'middle'}>
            {'Please select minimum one document'}
          </Text>
        ) : null}
      </View>
    );
    return (
      <View style={styles.documentSection}>
        <View key={item.id} style={{}}>
          <View style={styles.docTitleView}>
            <Text style={styles.docText}>{item.docName}</Text>
            <TouchableOpacity
              style={styles.infoView}
              onPress={() => {
                this.showInfomatoryMessage(item.description);
              }}>
              <Image
                style={styles.infoImgStyle}
                source={resources.images.icn_info}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.suppoer_Doc_text}>({item.supportedDocs})</Text>
          <View style={{marginTop: 0}}>
            {this.renderDynamicDropDown(item.documentType, index)}
          </View>
          {/* {!documentName && this.state.isSubmitBtnPressed ?
                        <Text
                            style={[styles.errorDocumentText]}
                            numberOfLines={1}
                            ellipsizeMode={'middle'}>
                            {"Please select document type options"}
                        </Text> : null} */}
        </View>
        <View key={item.id} style={styles.uploadDocumentView}>
          <View>{this.renderAllUrlsOnUiImages(index, item.uriArr)}</View>

          <View style={styles.uploadAreaView}>
            <React.Fragment>
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
                    onPress={() => this.showPickerOptions(index)}>
                    <Image source={resources.images.img_upload} />
                    <Text style={styles.chooseFileText}>
                      {resources.strings.CHOOSE_FILE}
                    </Text>
                    <Text style={styles.max10MbText}>
                      {resources.strings.MAX10MB}
                    </Text>
                  </TouchableOpacity>
                </View>
              </ImageBackground>
            </React.Fragment>
          </View>
          {!imgEmptyUrl && this.state.isSubmitBtnPressed ? (
            <Text
              style={[styles.errorText]}
              numberOfLines={1}
              ellipsizeMode={'middle'}>
              {'Please select minimum one document'}
            </Text>
          ) : null}
        </View>
      </View>
    );
  };

  onViewImage = (parentIndex, index, urlToBeView) => {
    this.setState({
      isModalVisible: true,
      urlToBeView: urlToBeView,
    });
  };

  onRemoveImage = (parentIndex, index, urlToBeDelete) => {
    const {kycDocumentsDetailObj} = this.props;
    const {documents} = kycDocumentsDetailObj;
    let document = documents[parentIndex];
    let newArr = document.uriArr.filter(function(item) {
      return item.url !== urlToBeDelete;
    });
    document.uriArr = newArr;
    this.props.onSaveKycDocumentDetailAction(kycDocumentsDetailObj);
    this.setState({render: !this.state.render});
  };

  renderHeader = () => {
    return (
      <HeaderWithProfile
        headerTitle={resources.strings.Documentation}
        isBackIconVisible={true}
        isProfileIconVisible={false}
        onBackClick={this.onBackClick}
        navigateProps={this.props.navigation}
        toRoute={'MyAccountScreen'}
      />
    );
  };
  renderStatus = () => {
    return (
      <StepIndicator
        customStyles={customStyles}
        currentPosition={this.state.stepPosition}
        renderStepIndicator={state => {
          return this.putTickIndicator(state);
        }}
        stepCount={4}
      />
    );
  };

  putTickIndicator = state => {
    switch (state.stepStatus) {
      case 'finished': {
        return (
          <Image
            source={resources.images.icn_document_done}
            style={styles.iconStyle}
          />
        );
      }
      case 'unfinished': {
        return (
          <Image
            source={resources.images.icn_process_status}
            style={styles.iconStyle}
          />
        );
      }
      case 'current': {
        return (
          <Image
            source={resources.images.icn_document_pending}
            style={styles.iconStyle}
          />
        );
      }
      default:
    }
    return state;
  };
  currentScreenName = () => {
    return (
      <View style={styles.currentNameView}>
        <Text style={styles.currentNameText}>
          {resources.strings.KYC_DOCUMENTS}
        </Text>
      </View>
    );
  };
  onBackClick = () => {
    if (this.isComingFromPaymentSucess) {
      AppToast('Please document first');
    } else {
      this.props.navigation.goBack();
    }
  };
  callbackToRemoveError = key => {
    let {error} = this.state;
    if (error.hasOwnProperty(key)) {
      error[key] = '';
      this.setState({
        error: error,
      });
    }
  };
  toggleModal = () => {
    this.setState({isModalVisible: false});
  };
  handleCloseDocumentModal = () => {
    const dontHaveDocument = JSON.parse(JSON.stringify(this.state.dontHaveDocument))

    dontHaveDocument.show = false

    this.setState({dontHaveDocument})
  }

  handleOpenDocumentModal = () => {
    const dontHaveDocument = JSON.parse(JSON.stringify(this.state.dontHaveDocument))
    dontHaveDocument.show = true
    dontHaveDocument.modalType = enumDocumentModalType.document
    this.setState({dontHaveDocument})
  }

  handleDocumentSelect = (index) => {
    const dontHaveDocument = JSON.parse(JSON.stringify(this.state.dontHaveDocument))
    dontHaveDocument.selectedIndex = index
    dontHaveDocument.show = false
    this.setState({dontHaveDocument, documentID: ''})
  }

  handleOpenTermsAndCondtionModal = () => {
    const dontHaveDocument = JSON.parse(JSON.stringify(this.state.dontHaveDocument))
    dontHaveDocument.show = true
    dontHaveDocument.modalType = enumDocumentModalType.terms_and_condition
    this.setState({dontHaveDocument})
  }

  render() {
    const {
      error,
      userTypeValue,
      linkedInUrl,
      specialRemark,
      ownerPhoneNumber,
      ownerName,
      urlToBeView,
      dontHaveDocument,
      dob,
      isTermsAndCondition,
      documentID
    } = this.state;
    const {kycDocumentsDetailObj} = this.props;

    const enableButton = Boolean(dob) && Boolean(isTermsAndCondition) && Boolean(documentID)

    return (
      <View style={[styles.fullScreen]}>
        {this.renderHeader()}
        <Modal
          isVisible={this.state.isModalVisible}
          onBackButtonPress={this.toggleModal}
          animationIn={'slideInUp'}
          animationOut={'slideOutDown'}
          style={styles.view}
          onRequestClose={() => {
            this.toggleModal();
          }}>
          <View style={styles.fullScreenModal}>
            <React.Fragment>
              <View style={[styles.backBtnBox]}>
                <TouchableOpacity
                  onPress={() => this.toggleModal()}
                  style={[styles.backBtnCont]}
                  hitSlop={{top: 10, left: 20, right: 0, bottom: 10}}>
                  <Icon
                    style={[{textAlign: 'center'}]}
                    name={'close'}
                    size={20}
                    color={resources.colors.appColor}
                  />
                </TouchableOpacity>
              </View>
            </React.Fragment>
            <View style={styles.containerImage}>
              <Image
                style={styles.logoView}
                source={
                  urlToBeView ? {uri: urlToBeView} : resources.images.icn_pdf
                }
              />
            </View>
          </View>
        </Modal>
        <KeyboardAwareScrollView
          bounces={false}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.subContainer}>
            <View style={styles.paddingClass}>
              <Text style={styles.stepText}>STEP 1</Text>
              {this.currentScreenName()}
              <Text style={styles.subText}>
                We will fetch your credit score for free to verify your KYC
              </Text>
            </View>

            {/* {this.renderStatus()} */}
            <View style={styles.container}>
              {/* <Text style={styles.selectOrderText}>
                {resources.strings.KycInstruction}
              </Text> */}
              <View style={{marginTop: 10}}>
                <MaterialInput
                  label={dontHaveDocument.data[dontHaveDocument.selectedIndex].title}
                  onChangeText={this.onChangeDocument}
                  error={renderInputError('pan_card', error)}
                  errorKey={'pan_card'}
                  callbackToRemoveError={this.callbackToRemoveError}
                  isDropDownImageVisible={false}
                  value={this.state.documentID}
                  inputProps={{
                    autoCaptialize: 'none',
                    // keyboardType: 'number-pad',
                    maxLength: 10,
                  }}
                />
                <TouchableOpacity 
                onPress={this.handleOpenDocumentModal}
                >
                  <Text
                    style={styles.subText}>{`${dontHaveDocument.data[dontHaveDocument.selectedIndex].heading} >`}</Text>
                </TouchableOpacity>
                <View style={{marginTop: 15}}>
                  <MaterialInput
                    label="Date of birth"
                    onChangeText={this.onChangeDOB}
                    error={renderInputError('pan_card', error)}
                    errorKey={'pan_card'}
                    callbackToRemoveError={this.callbackToRemoveError}
                    isDropDownImageVisible={false}
                    value={this.state.dob}
                    inputProps={{
                      autoCaptialize: 'none',
                      keyboardType: 'number-pad',
                      maxLength: 10,
                    }}
                  />
                </View>

                <View style={{flexDirection: 'row'}}>
                  <View>
                    <CheckBox
                      onPress={() =>
                        this.setState({
                          isTermsAndCondition: !this.state.isTermsAndCondition,
                        })
                      }
                      color={'#45454A'}
                      checked={this.state.isTermsAndCondition}
                      value={'Hello'}
                      title={'I agree to Terms and Conditions'}
                    />
                  </View>
                  <TouchableOpacity style={{marginLeft: 20}} onPress={this.handleOpenTermsAndCondtionModal}>
                    <Text>
                      {`I agree to `}
                      <Text
                        style={{
                          color: resources.colors.appColor,
                          textDecorationLine: 'underline',
                        }}>{`Terms and Conditions`}</Text>
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* <MaterialInput
                  label="Alternate Contact"
                  onChangeText={this.onChangeAlternateNumber}
                  error={renderInputError('documentID', error)}
                  errorKey={'documentID'}
                  callbackToRemoveError={this.callbackToRemoveError}
                  isDropDownImageVisible={false}
                  value={this.state.alternateNumber}
                  inputProps={{
                    autoCaptialize: 'none',
                    keyboardType: 'number-pad',
                    maxLength: 10,
                  }}
                /> */}
                {/* <Dropdown
                  animationDuration={1}
                  rippleDuration={1}
                  onChangeText={(val, i, d) => {
                    this.setState(
                      {selectUserType: d[i], userTypeValue: val},
                      () => {
                        this.callbackToRemoveError('userTypeRef');
                      },
                    );
                  }}
                  data={this.state.userType.map(item => ({
                    value: item.value,
                    ...item,
                  }))}
                  value={userTypeValue}
                  dropdownPosition={-3}
                  renderBase={props => (
                    <MaterialInput
                      label={resources.strings.USER_TYPE}
                      onChangeText={this.onChangeUserType}
                      error={renderInputError('userTypeRef', error)}
                      errorKey={'userTypeRef'}
                      callbackToRemoveError={this.callbackToRemoveError}
                      isDropDownImageVisible={true}
                      value={userTypeValue}
                      inputProps={{
                        autoCaptialize: 'none',
                        returnKeyType: 'next',
                        editable: false,
                      }}
                    />
                  )}
                  error={renderInputError('userTypeRef', error)}
                /> */}
              </View>

              {userTypeValue == 'Tenant' && (
                <React.Fragment>
                  <View style={styles.documentSection}>
                    <View style={{}}>
                      <View style={styles.docTitleView}>
                        <Text style={styles.docText}>{'Owner Details'}</Text>
                        <TouchableOpacity
                          style={styles.infoView}
                          onPress={() => {
                            this.showInfomatoryMessage('owner information');
                          }}>
                          <Image
                            style={styles.infoImgStyle}
                            source={resources.images.icn_info}
                          />
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.suppoer_Doc_text}>
                        ({'Owner information for Tenant User Type'})
                      </Text>
                      <MaterialInput
                        label={resources.strings.Owner_Mobile}
                        onChangeText={this.onChangeOwnerNumber}
                        error={renderInputError('ownerPhoneNumberErr', error)}
                        errorKey={'ownerPhoneNumberErr'}
                        callbackToRemoveError={this.callbackToRemoveError}
                        value={ownerPhoneNumber}
                        inputProps={{
                          returnKeyType: 'next',
                          keyboardType: 'phone-pad',
                          autoCaptialize: 'none',
                          maxLength: 10,
                        }}
                      />
                      <MaterialInput
                        label={resources.strings.Owner_Name}
                        onChangeText={this.onChangeOwnerName}
                        error={renderInputError('ownerNameErr', error)}
                        errorKey={'ownerNameErr'}
                        callbackToRemoveError={this.callbackToRemoveError}
                        value={ownerName}
                        inputProps={{
                          returnKeyType: 'next',
                          autoCaptialize: 'none',
                        }}
                      />
                    </View>
                  </View>
                </React.Fragment>
              )}

              <View
                style={{
                  backgroundColor: 'white',
                  borderWidth: 0,
                  marginTop: 15,
                }}>
                {kycDocumentsDetailObj &&
                kycDocumentsDetailObj.documents.length > 0 ? (
                  <>
                    {/* <FlatList
                    style={{marginBottom: 10}}
                    data={kycDocumentsDetailObj.documents}
                    renderItem={this.renderUploadDocumentImages}
                    bounces={false}
                    extraData={this.state}
                  /> */}
                  </>
                ) : (
                  <View
                    style={{
                      height: 300,
                      backgroundColor: 'white',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    {/* <Text>
                                        Loaging....
                                    </Text> */}
                  </View>
                )}
              </View>

              {/* {(this.state.duration === '3 Months' ||
                this.state.duration === '6 Months') && (
                <MaterialInput
                  label={resources.strings.LINKEDIN_PROFILE_URL}
                  onChangeText={this.onChangeLinkedInUrl}
                  error={renderInputError('linkedInRef', error)}
                  errorKey={'linkedInRef'}
                  callbackToRemoveError={this.callbackToRemoveError}
                  value={linkedInUrl}
                  inputProps={{
                    autoCaptialize: 'none',
                    returnKeyType: 'next',
                  }}
                />
              )} */}
              {/* <MaterialInput
                label={resources.strings.SPECIAL_REMARK}
                onChangeText={this.onChangeSpecialRemark}
                error={renderInputError('specialRemarkRef', error)}
                errorKey={'specialRemarkRef'}
                callbackToRemoveError={this.callbackToRemoveError}
                value={specialRemark}
                inputProps={{
                  autoCaptialize: 'none',
                  maxLength: 30,
                  returnKeyType: 'done',
                }}
              />
              <View style={{marginVertical: 5}}>
                <Text style={styles.noteText}>{resources.strings.Note}</Text>
                <Text style={styles.kycLinkedInText}>
                  {resources.strings.KYC_NOTE_LINKEDIN}
                </Text>
                <Text style={styles.kycRatingText}>
                  {resources.strings.KYC_RATING}
                </Text>
                <Text style={styles.kycOrderFulfillmentText}>
                  {resources.strings.KYC_ORDER_FULFILLMENT}
                </Text>
              </View> */}
            </View>
          </View>
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
        <View style={styles.submitView}>
          <Button
            rounded
            btnText={resources.strings.SUBMIT}
            onPress={this.submitKycDocument}
            disableTouch={!enableButton}
            btnStyle={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20}}
            showRightIcon={true}
          />
        </View>
{dontHaveDocument.show &&
       <DocumentViewModal
          modalType={dontHaveDocument.modalType}
          visibleModal={dontHaveDocument.show}
          onPressBackDrop={this.handleCloseDocumentModal}
          headerTitle={dontHaveDocument.modalType === enumDocumentModalType.document ? dontHaveDocument.data[dontHaveDocument.selectedIndex].heading : resources.strings.Terms_and_Conditions}
          selectedIndex={dontHaveDocument.selectedIndex}
          documentData={dontHaveDocument.data}
          onItemPress={this.handleDocumentSelect}
        /> }
        {/* {
        dontHaveDocument.show &&
          <DoneReceiveOtpModal 
            visibleModal={dontHaveDocument.show}
            titlemodel={'Didn’t receive the OTP?'}
            onPressBackDrop={() => setIsModal(false)}
            onChangeMobileNumner = {() => {
              set_isOtpSent(false)
              setIsModal(false)
              set_isTimeVisible(false)
            }}
          />
      } */}
      </View>
    );
  }

  onResultFromImagePicker = response => {
    if (response.didCancel) {
      this.setState({
        pickOptionsVisible: null,
      });
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
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
      if (
        checkValidFileSize(response.size ? response.size : response.fileSize)
      ) {
        const {kycDocumentsDetailObj} = this.props;
        const {currentSelectedPos} = kycDocumentsDetailObj;
        let document = kycDocumentsDetailObj.documents[currentSelectedPos];
        let data = {
          url: response.uri,
          fileType: response.type,
          fileName: response.name,
        };
        document.uriArr.push(data);
        this.props.onSaveKycDocumentDetailAction(kycDocumentsDetailObj);
        this.setState({
          render: !this.state.render,
        });
      } else {
        AppToast('Size can not exceeds 10 MB');
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
  showPickerOptions = index => {
    const {kycDocumentsDetailObj} = this.props;
    const {documents} = kycDocumentsDetailObj;
    kycDocumentsDetailObj.currentSelectedPos = index;
    let document = documents[index];
    if (document.maxFiles == document.uriArr.length) {
      AppToast(`You can upload max ${document.maxFiles} document.`);
    } else {
      this.setState(
        {
          pickOptionsVisible: 'bottom',
        },
        () => {
          this.props.onSaveKycDocumentDetailAction(kycDocumentsDetailObj);
        },
      );
    }
  };
  onPressBackDrop = () => {
    this.setState({
      pickOptionsVisible: null,
    });
  };
  validate = () => {
    const {
      userTypeValue,
      specialRemark,
      ownerPhoneNumber,
      ownerName,
      kycDocumentsDetailObjState,
      linkedInUrl,
      documentID,
      duration,
      dontHaveDocument
    } = this.state;
    const {kycDocumentsDetailObj} = this.props;
    let errorObject = {};
    if (kycDocumentsDetailObj && kycDocumentsDetailObj.documents.length > 0) {
      let empty = kycDocumentsDetailObj.documents.filter(document => {
        if (document.uriArr.length == 0) {
          return document;
        }
      });
      if (empty.length > 0) {
        errorObject.emptyDoc = resources.strings.USER_TYPE_EMPTY;
      }
    }

    if (kycDocumentsDetailObj && kycDocumentsDetailObj.documents.length > 0) {
      let empty = kycDocumentsDetailObj.documents.filter(document => {
        if (document.documentArr.length == 0) {
          return document;
        }
      });
      if (empty.length > 0) {
        errorObject.documentTypeRef = resources.strings.DOCUMENT_TYPE_EMPTY;
      }
    }

    // if (userTypeValue.trim() == '') {
    //   errorObject.userTypeRef = resources.strings.USER_TYPE_EMPTY;
    // }

    if (userTypeValue == 'Tenant') {
      if (ownerPhoneNumber && ownerPhoneNumber.trim() == '') {
        errorObject.ownerPhoneNumberErr = resources.strings.phoneCannotBeEmpty;
      } else if (!validateMobileNumber(ownerPhoneNumber)) {
        errorObject.ownerPhoneNumberErr = resources.strings.enterValidPhone;
      }
      if (ownerName.trim() == null || ownerName.trim() == '') {
        errorObject.ownerNameErr = resources.strings.ownerNameCannotBeEmpty;
      }
    }

    // if (specialRemark.trim() == '') {
    //   errorObject.specialRemarkRef = resources.strings.SPECIAL_REMARK_EMPTY;
    // }

    if (duration == '3 Months' || duration == '6 Months') {
      if (linkedInUrl.trim() == '') {
        errorObject.linkedInRef = 'Enter a valid LinkedIn URL';
      }
    }

    if (documentID.trim() == '' || documentID.length < 10) {
      errorObject.documentID = `Enter a valid ${dontHaveDocument.data[dontHaveDocument.selectedIndex].title}`;
    }

    this.setState({error: errorObject, isSubmitBtnPressed: true});
    console.log(errorObject)

    return Object.keys(errorObject).length == 0;
  };
  submitKycDocument = () => {
    const {
      linkedInUrl,
      specialRemark,
      userTypeValue,
      ownerPhoneNumber,
      ownerName,
      kycDocumentsDetailObjState,
      documentID,
    } = this.state;
    const {kycDocumentsDetailObj} = this.props;
    const isValid = this.validate();
    alert(isValid)
    if (!isValid) {
      return;
    }
    kycDocumentsDetailObj.linkedinProfileUrl = linkedInUrl;
    kycDocumentsDetailObj.userType = userTypeValue;
    kycDocumentsDetailObj.remarks = specialRemark;

    if (kycDocumentsDetailObjState.length > 0) {
      for (
        let element = 0;
        element < kycDocumentsDetailObjState.length;
        element++
      ) {
        let elements = kycDocumentsDetailObjState[element];
        console.log('elements', elements);
        // if(elements.document_type[0].value == 'cf_pan_type') {
        //     Object.assign(this.state.kycDocumentsTypeObject, { cf_pan_type: elements.document_type[0].dynamicValue })
        // }
        if (
          elements.document_type[0].value == 'cf_delivery_address_proof_type'
        ) {
          Object.assign(this.state.kycDocumentsTypeObject, {
            cf_delivery_address_proof_type:
              elements.document_type[0].dynamicValue,
          });
        }
        if (
          elements.document_type[0].value == 'cf_permanent_address_proof_type'
        ) {
          Object.assign(this.state.kycDocumentsTypeObject, {
            cf_permanent_address_proof_type:
              elements.document_type[0].dynamicValue,
          });
        }
        if (elements.document_type[0].value == 'cf_financial_type') {
          Object.assign(this.state.kycDocumentsTypeObject, {
            cf_financial_type: elements.document_type[0].dynamicValue,
          });
        }
      }
    }

    console.log('kycDocumentsDetailObj', JSON.stringify(kycDocumentsDetailObj));
    console.log(
      'this.state.kycDocumentsTypeObject',
      this.state.kycDocumentsTypeObject,
    );
    if (this.orderId) {
      this.props
        .hitUploadKycData(
          kycDocumentsDetailObj,
          this.state.kycDocumentsTypeObject,
          this.orderId,
          ownerPhoneNumber,
          ownerName,
          documentID,
        )
        .then(data => {
          AppToast(data.message);
          this.KycDone();
        })
        .catch(error => {
          AppToast(error);
          // console.log('error inside kyc', error);
        });
    } else {
      AppToast('Unable to get order number');
    }
  };
  KycDone = () => {
    // let count = 0
    // if (this.isComingFromPaymentSucess) {
    //     count = 5
    // } else {
    //     count = 4
    // }
    // this.props.navigation.pop(count)
    // this.props.navigation.navigate("MyOrder")
    if (this.orderId) {
      if (this.isUpfrontPayment) {
        this.props.navigation.navigate('MyOrder');
        // this.props.navigation.navigate('CongratulationScreen')
      } else {
        this.props.navigation.navigate('AutoPaymentScreen', {
          orderId: this.orderId,
          isComingFromPaymentSucess: this.isComingFromPaymentSucess,
        });
      }
    } else {
      AppToast('Unable to get order number');
    }
  };
}

const mapStateToProps = state => {
  const {kycDocumentsDetailObj} = state.kycReducer;
  return {kycDocumentsDetailObj: kycDocumentsDetailObj};
};
let container = connect(
  mapStateToProps,
  {...actions},
)(KycScreen);
let loader = APILoadingHOC(container);
export default loader;
