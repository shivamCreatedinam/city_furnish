import React, { Component } from 'react';
import { View, Text, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import styles from './styles'
import HeaderWithProfile from '../../genriccomponents/header/HeaderWithProfilePic'
import Button from '../../genriccomponents/button/Button'
import MaterialInput from '../../genriccomponents/input/MaterialInput'
import resources from '../../../res';
import { validateEmail, renderInputError } from '../../utility/Utils'
import { hitFeedbackApi, getFeedbackUrlApi } from '../../redux/actions/FeedbackAction'
import APILoadingHOC from "../../genriccomponents/HOCS/APILoadingHOC";
import { connect } from 'react-redux';
import AppToast from '../../genriccomponents/appToast/AppToast'
import { Rating, AirbnbRating } from 'react-native-ratings';
import { ScrollView } from 'react-native-gesture-handler';

class FeedbackScreen extends Component {
    static ROUTE_NAME = "FeedbackScreen";
    constructor(props) {
        super(props)
        this.feedback_url= this.props.route.params && this.props.route.params.feedbackURL ? this.props.route.params.feedbackURL : 'https://cityfurnish.com/fb/TTaH672',
        this.state = {
            isLoading: true,
            error: {},
            feedback_response_url: "",
            customer_contact_no: "",
            rating: 0,
            comment: "",
            commentPlaceholder: 'Let us know how we can improve ourselves?'
        }
    }

    componentDidMount() {
        this.feedbackURL()
    }

    feedbackURL = () => {
        this.props.getFeedbackUrlApi(this.feedback_url)
            .then((data) => {
                console.log("res",data)
                this.setState({
                    customer_contact_no: data.data.customer_contact_no,
                    feedback_response_url: data.data.feedback_url ? data.data.feedback_url : this.feedback_url,
                    rating: data.data.rating ? data.data.rating : 0,
                    comment: data.data.comment ? data.data.comment : "",
                    isLoading: false
                })
            })
            .catch((error) => {
                this.setState({
                    isLoading: false
                })
                console.log("error", error)
            });
    }

    renderHeader = () => {
        return (
            <HeaderWithProfile
                headerTitle={resources.strings.FEEDBACK}
                isBackIconVisible={true}
                isProfileIconVisible={false}
                isLogoutVisible={false}
                onBackClick={this.onBackClick}
                navigateProps={this.props.navigation}
            />
        )
    }

    ratingCompleted = (rating) => {
        this.setState({
            rating: rating
        })
        if(rating == 5) {
            this.setState({
                commentPlaceholder : 'Let us know what you like most about us?'
            })
        } else {
            this.setState({
                commentPlaceholder : 'Let us know how we can improve ourselves?'
            })
        }
    }

    ActivityIndicatorLoadingView() {
        return (
            <ActivityIndicator
                color={resources.colors.appColor}
                size='large'
                style={styles.ActivityIndicatorStyle}
            />
        );
    }

    render() {
        const { rating, comment, commentPlaceholder, error } = this.state
        return (
            <View style={styles.fullScreen}>
                {this.renderHeader()}
                {this.state.isLoading ? this.ActivityIndicatorLoadingView() : <ScrollView>
                    <KeyboardAvoidingView>
                        <View style={{ marginHorizontal: 20, marginTop: 20 }}>
                            <View style={styles.textContainer}>
                                <Text style={styles.text}>{resources.strings.FEEDBACK_INFO_TEXT}</Text>
                            </View>
                            <Rating
                                ratingCount={5}
                                showRating={false}
                                startingValue={rating}
                                onFinishRating={this.ratingCompleted}
                                style={{ paddingVertical: 10 }}
                            />
                            <MaterialInput
                                label={commentPlaceholder}
                                inputProps={{
                                    autoCaptialize: 'none',
                                    maxLength: 1000,
                                    returnKeyType: 'done',
                                    multiline: true,
                                }}
                                inputStyles={{ paddingVertical: 10, }}
                                value={comment}
                                onChangeText={this.onChangeCommentText}
                                error={renderInputError("comment", error)}
                                errorKey={"comment"}
                                
                                callbackToRemoveError={this.callbackToRemoveError} >

                            </MaterialInput>
                            <Text style={styles.minimuLabel}>Max 1000 characters allowed.</Text>
                            <View style={styles.buttonContainer}>
                                <Button rounded btnText={resources.strings.SUBMIT}
                                    onPress={() => { this.onFeedbackPressed() }} />
                            </View>
                        </View>

                    </KeyboardAvoidingView>
                </ScrollView>}
            </View>
        );
    }
    callbackToRemoveError = (key) => {
        let { error } = this.state
        if (error.hasOwnProperty(key)) {
            error[key] = ""
            this.setState({
                error : error
            })
        }
    }
    onFeedbackPressed = () => {
        const isValid = this.validate();
        if (!isValid) { return; }
        const { feedback_response_url,
            customer_contact_no,
            rating,
            comment
        } = this.state;
        this.props.hitFeedbackApi(feedback_response_url, customer_contact_no, rating, comment)
            .then((resp) => {
                AppToast(resp.message)
                this.onBackClick()
            })
            .catch((error) => {
                AppToast("Something goes wrong. Please try later.")
            })
    }
    onBackClick = () => {
        this.props.navigation.goBack()
    }
    onChangeCommentText = (text) => {
        this.setState({ comment: text })
    }
    validate = () => {
        const { comment , rating } = this.state
        if (rating == 0) {
            AppToast('Rating Field is Required')
            return false;
        } else if (comment.trim() == "") {
            AppToast(resources.strings.commentRequired)
            return false;
        } else if (comment && comment.trim().length > 1000) {
            AppToast(resources.strings.comment1000length)
            return false;
        }
        return true;
    }
}

const mapStateToProps = (state) => {
    return {};
};
let container = connect(mapStateToProps, { hitFeedbackApi, getFeedbackUrlApi })(FeedbackScreen);
let loader = APILoadingHOC(container);

loader.getIntent = () => {
    return {
        routeName: FeedbackScreen.ROUTE_NAME,
    };
};

export default loader;


