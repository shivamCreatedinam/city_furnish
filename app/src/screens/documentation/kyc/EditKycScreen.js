import React, { Component } from 'react'
import { View, Text, TouchableOpacity, FlatList, Image, ImageBackground, Alert, BackHandler } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Dropdown } from 'react-native-material-dropdown';
import DocumentPicker from 'react-native-document-picker';
import { connect } from 'react-redux'
import StepIndicator from 'react-native-step-indicator';
import styles from './styles'
import Button from '../../../genriccomponents/button/Button'
import resources from '../../../../res'
import * as actions from '../../../redux/actions/DocumentAction'
import MaterialInput from '../../../genriccomponents/input/MaterialInput'
import Modal from 'react-native-modal';
import HeaderWithProfile from '../../../genriccomponents/header/HeaderWithProfilePic'
import { PickerViewModal, DOCUMENT, IMAGE_PICK, CAMERA } from './views/PickerViewModal'
import { renderInputError, checkIsImageOrPdfFileType, checkIsImageType, checkValidFileSize, validateMobileNumber, isPlatformIOS } from '../../../utility/Utils'
import ImagePicker from 'react-native-image-picker';
import kycModal from './modal/kycModal'
import Icon from 'react-native-vector-icons/FontAwesome';
import APILoadingHOC from "../../../genriccomponents/HOCS/APILoadingHOC"
import AppToast from '../../../genriccomponents/appToast/AppToast'
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
import { customStyles } from '../../../utility/Utils'
// Option for Image picker
const options = {
    title: 'Select Image',
    mediaType: 'photo',
    allowsEditing: false,
    quality: 0.3,
}

class EditKycScreen extends Component {
    static ROUTE_NAME = "EditKycScreen";
    constructor(props) {
        super(props);
        this.creditScore = this.props.route.params && this.props.route.params.creditScore ? this.props.route.params.creditScore : "0";
        this.orderId = this.props.route.params && this.props.route.params.orderId ? this.props.route.params.orderId : "1360681880";
        this.isUpfrontPayment = this.props.route.params && this.props.route.params.isUpfrontPayment ? this.props.route.params.isUpfrontPayment : false;
        this.isComingFromPaymentSucess = this.props.route.params && this.props.route.params.isComingFromPaymentSucess ? this.props.route.params.isComingFromPaymentSucess : false;
        this.state = {
            stepPosition: 2,
            pickOptionsVisible: null,
            render: false,
            isSubmitBtnPressed: false,
            isModalVisible: false,
            urlToBeView: '',

            kycDocumentsDetailObjState: [],
            kycDocumentsTypeObject: {},
            documentTypeError: false,
            documentError: false
        }
    }
    handleBackButton() {
        AppToast("Please upload required documents first")
        return true;
    }

    componentWillUnmount() {
        this.props.onSaveKycDocumentDetailAction(null);
        if (this.isComingFromPaymentSucess) {
            BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        }
    }
    componentDidMount() {
        if (this.isComingFromPaymentSucess) {
            BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        }
        this.forceUpdate();
        this.props.hitGetCbilDocumentApi(this.creditScore)
            .then((resp) => {
                console.log("resp",JSON.stringify(resp))
                this.setState({
                    kycDocumentsDetailObjState : resp.data
                })
                let obj = new kycModal(resp)
                this.props.onSaveKycDocumentDetailAction(obj)

                this.state.kycDocumentsDetailObjState.forEach((kycDocumentsDetailObjStateValue, index, kycDocumentsDetailObjStateArr) => {
                    let item = kycDocumentsDetailObjStateArr[index].document_type[0];
                    if(item.attribute.length == 1) {
                        let tempArr = kycDocumentsDetailObjStateArr;
                        tempArr[index].document_type[0].dynamicValue = item.attribute[0];

                        const { kycDocumentsDetailObj } = this.props
                        const { currentSelectedPos } = kycDocumentsDetailObj
                        let document = kycDocumentsDetailObj.documents[currentSelectedPos];
                        let data = {
                            name: item.attribute[0],
                        }
                        document.documentArr.push(data);
                        this.props.onSaveKycDocumentDetailAction(kycDocumentsDetailObj);

                        this.setState({
                            kycDocumentsDetailObjState : tempArr,
                            render: !this.state.render
                        })
                    }
                })
            }).catch((error) => {
                console.log("error inside cbil", error)
            })
    }


    getImageUriToBeShownOnUi = (arr) => {
        if (arr.length > 0) {
            let index = (arr.length - 1);
            return arr[index].url
        } else {
            return "";
        }
    }
    getDocumentTypeToBeShownOnUi = (arr) => {
        if (arr.length > 0) {
            let index = (arr.length - 1);
            return arr[index].name
        } else {
            return "";
        }
    }
    renderAllUrlsOnUiImages = (parentIndex, UrlArr) => {
        let views = [];
        for (let i = 0; i < UrlArr.length; i++) {
            let item = UrlArr[i];
            let name = item.fileName ? item.fileName : item.url.substring(UrlArr[i].url.length - 25, UrlArr[i].url.length)
            let isImage = checkIsImageType(UrlArr[i].url);
            views.push(
                <View
                    key={i.toString()}
                    style={styles.crossInnerView}>
                    <Text style={styles.suppoer_Doc_text}>...{name} </Text>
                    {isImage && <TouchableOpacity
                        style={{ borderWidth: 0, padding: 5 }}
                        onPress={() => this.onViewImage(parentIndex, i, item.url)}>
                        <Icon name="eye" size={16} color={resources.colors.appColor} type="ionicon" style={{marginTop: isPlatformIOS ? 0 : 5}} /> 
                    </TouchableOpacity>}
                    <TouchableOpacity
                        style={styles.crossInnerIcon}
                        onPress={() => this.onRemoveImage(parentIndex, i, item.url)}>
                        <Image
                            style={styles.crossInnerIcon}
                            source={resources.images.icn_close}
                        />
                    </TouchableOpacity>
                </View>
            )
        }
        return views;

    }

    showInfomatoryMessage = (data) => {
        Alert.alert(
            "Description",
            data,
            [{ text: "Ok", onPress: () => { console.log("ok pressed") }, style: "cancel" }],
            { cancelable: true }
        );
    }

    upateDynamicDropdownState = (value, arrIndex) => {
        let tempArr = this.state.kycDocumentsDetailObjState;
        tempArr[arrIndex].document_type[0].dynamicValue = value;

        const { kycDocumentsDetailObj } = this.props
        let document = kycDocumentsDetailObj.documents[arrIndex];
        if(document.documentArr.length == 0) {
            let data = { name: value }
            document.documentArr.push(data);
        } else {
            document.documentArr.splice(0, document.documentArr.length)
            let data = { name: value }
            document.documentArr.push(data);
        }
        this.props.onSaveKycDocumentDetailAction(kycDocumentsDetailObj);

        this.setState({
            kycDocumentsDetailObjState : tempArr,
            render: !this.state.render,
            documentTypeError: false
        })
    }

    renderDynamicDropDown = (arr, type_index) => {
        let views = [];
        for (let i = 0; i < arr.length; i++) {
            let item = arr[i];
            views.push(
                <>
                <Dropdown
                    key={i + "dynamicDrop"}
                    animationDuration={1}
                    rippleDuration={1}
                    onChangeText={(value, index) => { this.upateDynamicDropdownState(value, type_index) }}
                    data={item.attribute.map(val => { return { value: val.toString(), i: i } })}
                    value={item.name || "Select"}
                    dropdownPosition={item.attribute.length >= 3 ? -5 : item.attribute.length == 2 ? -4 : -2 }
                    renderBase={(props) => (
                        <MaterialInput
                            isDropDownImageVisible={true}
                            label={item.name}
                            // value={item.name || 'Select'}
                            value={item.attribute.length == 1 ? item.attribute[0] : item.dynamicValue}
                            inputProps={{
                                editable: false
                            }}
                        >
                        </MaterialInput>
                    )}
                />
                {this.state.isSubmitBtnPressed && item.value == this.state.documentError && this.state.documentTypeError ?
                    <Text
                        style={[styles.errorText]}
                        numberOfLines={1}
                        ellipsizeMode={'middle'}>
                        {"Please select document Type"}
                    </Text> : null}
                </>
            )
        }
        return views
    }

    renderUploadDocumentImages = ({ item, index }) => {
        let imgEmptyUrl = this.getImageUriToBeShownOnUi(item.uriArr)
        // let documentName = this.getDocumentTypeToBeShownOnUi(item.documentArr)
        return (
            <View style={styles.documentSection}>
                <View 
                    key={item.id} style={{}}>
                    <View style={styles.docTitleView}>
                        <Text style={styles.docText}>{item.docName}</Text>
                        <TouchableOpacity style={styles.infoView}
                            onPress={() => { this.showInfomatoryMessage(item.description) }}>
                            <Image style={styles.infoImgStyle} source={resources.images.icn_info} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.suppoer_Doc_text}>({item.supportedDocs})</Text>
                    <View style={{marginTop: 0}}>
                        {this.renderDynamicDropDown(item.documentType, index)}
                    </View>
                </View>
                <View
                    key={item.id}
                    style={styles.uploadDocumentView}>
                    <View>
                        {this.renderAllUrlsOnUiImages(index, item.uriArr)}
                    </View>

                    <View style={styles.uploadAreaView}>
                        <React.Fragment>
                            <ImageBackground
                                imageStyle={{ borderRadius: 6 }}
                                style={styles.backGroundImage}
                                source={resources.images.icn_pdf}
                                resizeMode={'contain'}>
                                <View style={[styles.docView, {
                                    backgroundColor: resources.colors.white
                                }]}>
                                    <TouchableOpacity style={styles.chooseFile}
                                        onPress={() => this.showPickerOptions(index)}>
                                        <Image source={resources.images.img_upload} />
                                        <Text style={styles.chooseFileText}>{resources.strings.CHOOSE_FILE}</Text>
                                        <Text style={styles.max10MbText}>{resources.strings.MAX10MB}</Text>
                                    </TouchableOpacity>
                                </View>
                            </ImageBackground>
                        </React.Fragment>
                    </View>
                    {!imgEmptyUrl && this.state.isSubmitBtnPressed && item.documentType[0].value == this.state.documentError ?
                        <Text
                            style={[styles.errorText]}
                            numberOfLines={1}
                            ellipsizeMode={'middle'}>
                            {"Please select minimum one document"}
                        </Text> : null}
                </View>
                <View style={styles.submitView}>
                    <Button
                        rounded
                        btnText={resources.strings.REUPLOAD}
                        onPress={()=>this.submitKycDocument(item.documentType[0].value)} />
                </View>
            </View>
        )
    }

    onViewImage = (parentIndex, index, urlToBeView) => {
        this.setState({
            isModalVisible: true,
            urlToBeView: urlToBeView
        })

    }

    onRemoveImage = (parentIndex, index, urlToBeDelete) => {
        const { kycDocumentsDetailObj } = this.props;
        const { documents } = kycDocumentsDetailObj;
        let document = documents[parentIndex];
        let newArr = document.uriArr.filter(function (item) {
            return item.url !== urlToBeDelete
        })
        document.uriArr = newArr;
        this.props.onSaveKycDocumentDetailAction(kycDocumentsDetailObj);
        this.setState({ render: !this.state.render })

    }

    renderHeader = () => {
        return (
            <HeaderWithProfile
                headerTitle={resources.strings.Documentation}
                isBackIconVisible={true}
                isProfileIconVisible={false}
                onBackClick={this.onBackClick}
                navigateProps={this.props.navigation}
                toRoute={"MyAccountScreen"}
            />
        )
    }
    renderStatus = () => {
        return (
            <StepIndicator
                customStyles={customStyles}
                currentPosition={this.state.stepPosition}
                renderStepIndicator={(state) => { return this.putTickIndicator(state) }}
                stepCount={4}
            />
        )
    }

    putTickIndicator = (state) => {
        switch (state.stepStatus) {
            case 'finished': {
                return <Image source={resources.images.icn_document_done} style={styles.iconStyle} />
            }
            case 'unfinished': {
                return <Image source={resources.images.icn_process_status} style={styles.iconStyle} />

            }
            case 'current': {
                return <Image source={resources.images.icn_document_pending} style={styles.iconStyle} />
            }
            default:
        }
        return state
    }
    currentScreenName = () => {

        return <View style={styles.currentNameView}>
            <Text style={styles.currentNameText}>{resources.strings.EDIT_KYC_DOCUMENTS}</Text>
        </View>


    }
    onBackClick = () => {
        if (this.isComingFromPaymentSucess) {
            AppToast("Please document first")
        } else {
            this.props.navigation.goBack()
        }
    }
    toggleModal = () => {
        this.setState({ isModalVisible: false });
    };
    render() {
        const { urlToBeView } = this.state
        const { kycDocumentsDetailObj } = this.props


        return (
            <View style={[styles.fullScreen]}>
                {this.renderHeader()}
                <Modal 
                    isVisible={this.state.isModalVisible} 
                    onBackButtonPress={this.toggleModal}
                    animationIn={'slideInUp'}
                    animationOut={'slideOutDown'}
                    style={styles.view}
                    onRequestClose={() => {this.toggleModal()}}
                >
                    <View style={styles.fullScreenModal}>
                        <React.Fragment>
                            <View style={[styles.backBtnBox]}>
                                <TouchableOpacity onPress={()=>this.toggleModal()}
                                    style={[styles.backBtnCont]}
                                    hitSlop={{ top: 10, left: 20, right: 0, bottom: 10 }}>
                                    <Icon style={[{textAlign: 'center'}]} name={'close'} size={20} color={resources.colors.appColor}  />
                                </TouchableOpacity>
                            </View>
                        </React.Fragment>
                        <View style={styles.containerImage} >
                            <Image style={styles.logoView} source={urlToBeView ? { uri: urlToBeView } : resources.images.icn_pdf} />
                        </View>
                    </View>
                </Modal>
                <KeyboardAwareScrollView
                    bounces={false}
                    keyboardShouldPersistTaps='handled'
                    showsVerticalScrollIndicator={false}>
                    <View style={styles.subContainer}>
                        {this.currentScreenName()}
                        {this.renderStatus()}
                        <View style={styles.container}>
                            <Text style={styles.selectOrderText}>{resources.strings.KycReUploadInstruction}</Text>

                            <View style={{ backgroundColor: 'white', borderWidth: 0, marginTop: 25 }}>
                                {kycDocumentsDetailObj && kycDocumentsDetailObj.documents.length > 0 ?
                                    <FlatList
                                        style={{ marginBottom: 10 }}
                                        data={kycDocumentsDetailObj.documents}
                                        renderItem={this.renderUploadDocumentImages}
                                        bounces={false}
                                        extraData={this.state}
                                    /> :
                                    <View style={{
                                        height: 300, backgroundColor: 'white',
                                        alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        {/* <Text>
                                        Loaging....
                                    </Text> */}
                                    </View>
                                }
                            </View>
                        </View>

                    </View>
                </KeyboardAwareScrollView>
                {this.state.pickOptionsVisible ?
                    <PickerViewModal
                        onClickPickType={this.onClickPickType}
                        visibleModal={this.state.pickOptionsVisible}
                        onPressBackDrop={this.onPressBackDrop} /> : <View />}
            </View>
        )
    }


    onResultFromImagePicker = (response) => {
        if (response.didCancel) {
            this.setState({
                pickOptionsVisible: null
            })
        } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
            this.setState({
                pickOptionsVisible: null
            })
        } else {
            if (response != null && response.uri) {
                this.onResultFromPicker(response);
            }
        }
    }
    onResultFromPicker = (response) => {
        if (!response) {
            AppToast("Please try again")
            return
        }
        this.setState({
            pickOptionsVisible: null
        })
        if (checkIsImageOrPdfFileType(response.type)) {
            if (checkValidFileSize(response.size ? response.size : response.fileSize)) {
                const { kycDocumentsDetailObj } = this.props
                const { currentSelectedPos } = kycDocumentsDetailObj
                let document = kycDocumentsDetailObj.documents[currentSelectedPos];
                let data = {
                    url: response.uri,
                    fileType: response.type,
                    fileName: response.name
                }
                document.uriArr.push(data);
                this.props.onSaveKycDocumentDetailAction(kycDocumentsDetailObj);
                this.setState({
                    render: !this.state.render
                })

            } else {
                AppToast("Size can not exceeds 10 MB")
            }
        } else {
            AppToast("Please select pdf,jpg,jpeg,png format documents only")
        }

    }

    openDocument = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf],
            });
            this.onResultFromPicker(res);
        } catch (err) {
            this.setState({
                pickOptionsVisible: null
            })
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                throw err;
            }
        }

    }
    onClickPickType = (type) => {
        this.setState({
            pickOptionsVisible: null
        })
        setTimeout(() => {
            switch (type) {
                case DOCUMENT:
                    // Open File picker
                    this.openDocument()
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
        }, 500)



    }
    showPickerOptions = (index) => {
        const { kycDocumentsDetailObj } = this.props;
        const { documents } = kycDocumentsDetailObj
        kycDocumentsDetailObj.currentSelectedPos = index;
        let document = documents[index];
        if (document.maxFiles == document.uriArr.length) {
            AppToast(`You can upload max ${document.maxFiles} document.`)
        } else {
            this.setState({
                pickOptionsVisible: 'bottom'
            }, () => {
                this.props.onSaveKycDocumentDetailAction(kycDocumentsDetailObj);
            })
        }
    }
    onPressBackDrop = () => {
        this.setState({
            pickOptionsVisible: null
        })
    }
    validate = (documentTypeValue) => {
        const { kycDocumentsDetailObj } = this.props;
        let errorObject = true;

        if (kycDocumentsDetailObj && kycDocumentsDetailObj.documents.length > 0) {
            kycDocumentsDetailObj.documents.map(document => {
                if(document.documentType[0].value == documentTypeValue && document.uriArr.length == 0) {
                    // AppToast(documentTypeValue)
                    this.setState({ documentError: documentTypeValue, documentTypeError : true, isSubmitBtnPressed: true });
                    errorObject = false;
                    return;
                }
            })
        }

        return errorObject;
    };
    submitKycDocument = (documentTypeValue) => {

        const { kycDocumentsDetailObjState } = this.state
        const { kycDocumentsDetailObj } = this.props;
        const isValid = this.validate(documentTypeValue);
        if (!isValid) {
            return;
        }


        if (kycDocumentsDetailObjState.length > 0) {
            for (let element = 0; element < kycDocumentsDetailObjState.length; element++) {
                let elements = kycDocumentsDetailObjState[element]
                console.log("elements",elements)
                if(elements.document_type[0].value == 'cf_delivery_address_proof_type' && 'dynamicValue' in elements.document_type[0] && elements.document_type[0].dynamicValue != null) {
                    Object.assign(this.state.kycDocumentsTypeObject, { 
                        cf_delivery_address_proof_type: elements.document_type[0].dynamicValue,
                    })
                }
                if(elements.document_type[0].value == 'cf_permanent_address_proof_type' && 'dynamicValue' in elements.document_type[0] && elements.document_type[0].dynamicValue != null) {
                    Object.assign(this.state.kycDocumentsTypeObject, { 
                        cf_permanent_address_proof_type: elements.document_type[0].dynamicValue 
                    })
                }
                if(elements.document_type[0].value == 'cf_financial_type' && 'dynamicValue' in elements.document_type[0] && elements.document_type[0].dynamicValue != null) {
                    Object.assign(this.state.kycDocumentsTypeObject, { 
                        cf_financial_type: elements.document_type[0].dynamicValue 
                    })
                }
            }
        }

        console.log("kycDocumentsDetailObj",JSON.stringify(kycDocumentsDetailObj))
        console.log("this.state.kycDocumentsTypeObject",this.state.kycDocumentsTypeObject)
        if (this.orderId) {
            this.props.hitReUploadKycData(kycDocumentsDetailObj, this.state.kycDocumentsTypeObject, this.orderId)
                .then((data) => {
                    AppToast(data.message)
                    this.KycDone()

                }).catch((error) => {
                    console.log("error inside kyc", error)
                })
        } else {
            AppToast("Unable to get order number")
        }
    }
    KycDone = () => {
        if (this.orderId) {
            if(this.isUpfrontPayment) {
                this.props.navigation.navigate("MyOrder")
            } else {
                this.props.navigation.navigate("AutoPaymentScreen", {
                    orderId: this.orderId,
                    isComingFromPaymentSucess: this.isComingFromPaymentSucess
                })
            }
        } else {
            AppToast("Unable to get order number")
        }
    }

}

const mapStateToProps = (state) => {
    const { kycDocumentsDetailObj } = state.kycReducer;
    return { kycDocumentsDetailObj: kycDocumentsDetailObj };
};
let container = connect(mapStateToProps, { ...actions, })(EditKycScreen);
let loader = APILoadingHOC(container);
export default loader;

