import React, {Component} from 'react';
import {View, ActivityIndicator, Text, Linking} from 'react-native';
import HeaderWithProfilePic from '../../genriccomponents/header/HeaderWithProfilePic';
import {connect} from 'react-redux';
import * as actions from '../../redux/actions/MiscellaneousAction';
import APILoadingHOC from '../../genriccomponents/HOCS/APILoadingHOC';
// import {WebView} from 'react-native-webview';
import styles from './styles';
import resources from '../../../res';

class MiscellaneousScreen extends Component {
  static ROUTE_NAME = 'MiscellaneousScreen';

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
      .hitGetCmsDetailPageApi(this.key)
      .then(data => {
        this.setState({
          description: data.data.description,
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
        headerTitle={this.title}
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
  onShouldStartLoadWithRequest = event => {
    if (event.url == 'about:blank' || event.url.includes('data:text/html,')) {
      return true;
    }
    // this.refs['WebView'].stopLoading();
    if (event.url) {
      Linking.openURL(event.url);
      return false;
    }
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
              onNavigationStateChange={this.onShouldStartLoadWithRequest}
              onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
            /> */}
            {console.log(description)}
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
)(MiscellaneousScreen);
let loader = APILoadingHOC(container);

loader.getIntent = () => {
  return {
    routeName: MiscellaneousScreen.ROUTE_NAME,
  };
};
export default loader;
