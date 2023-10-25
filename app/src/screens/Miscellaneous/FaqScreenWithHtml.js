import React, {Component} from 'react';
import {View, ActivityIndicator, Text} from 'react-native';
import HeaderWithProfilePic from '../../genriccomponents/header/HeaderWithProfilePic';
import {connect} from 'react-redux';
import * as actions from '../../redux/actions/MiscellaneousAction';
import APILoadingHOC from '../../genriccomponents/HOCS/APILoadingHOC';
// import {WebView} from 'react-native-webview';
import styles from './styles';
import resources from '../../../res';

class FaqScreenWithHtml extends Component {
  static ROUTE_NAME = 'FaqScreenWithHtml';

  constructor(props) {
    super(props);
    this.title =
      this.props.route.params && this.props.route.params.title
        ? this.props.route.params.title
        : '';
    this.key =
      this.props.route.params && this.props.route.params.key
        ? this.props.route.params.key
        : '';
    this.state = {
      description: '',
      isLoading: true,
    };
  }
  componentDidMount() {
    this.loadData();
  }
  loadData = () => {
    this.props
      .hitFaqDetailPageApi()
      .then(data => {
        console.log('data 123::',data)
        this.setState({
          description: data.data,
          isLoading: false,
        });
      })
      .catch(error => {
        console.log('error', error);
      });
  };
  renderHeader = () => {
    return (
      <HeaderWithProfilePic
        headerTitle={resources.strings.FaQ}
        isBackIconVisible={true}
        navigateProps={this.props.navigation}
        onBackClick={this.onBackClick}
      />
    );
  };
  onBackClick = () => {
    this.props.navigation.goBack();
  };
  ActivityIndicatorLoadingView() {
    return (
      <ActivityIndicator
        color={resources.colors.appColor}
        size="large"
        style={styles.ActivityIndicatorStyle}
      />
    );
  }
  renderEmptyScreen = () => {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>{'No data found.'}</Text>
      </View>
    );
  };

  render() {
    const {description} = this.state;
    return (
      <View style={styles.fullScreen}>
        {this.renderHeader()}
        {this.state.isLoading ? (
          this.ActivityIndicatorLoadingView()
        ) : (
          <View style={styles.mainContainer}>
            {/* <WebView
              ref={'WebView'}
              renderLoading={this.ActivityIndicatorLoadingView}
              startInLoadingState={true}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              showsVerticalScrollIndicator={false}
              source={{html: description ? description : ''}}
              scalesPageToFit={false}
              style={{flex: 1}}
            /> */}
          </View>
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
)(FaqScreenWithHtml);
let loader = APILoadingHOC(container);

loader.getIntent = () => {
  return {
    routeName: FaqScreenWithHtml.ROUTE_NAME,
  };
};
export default loader;
