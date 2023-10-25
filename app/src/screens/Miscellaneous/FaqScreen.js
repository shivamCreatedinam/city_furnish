import React, {Component} from 'react';
import {View, ActivityIndicator, Text, ScrollView} from 'react-native';
import HeaderWithProfilePic from '../../genriccomponents/header/HeaderWithProfilePic';
import {connect} from 'react-redux';
import * as actions from '../../redux/actions/MiscellaneousAction';
import APILoadingHOC from '../../genriccomponents/HOCS/APILoadingHOC';
import styles from './styles';
import resources from '../../../res';
import ScrollableTabView, {
  ScrollableTabBar,
} from 'react-native-scrollable-tab-view';
import Accordian from '../../genriccomponents/expandView/Accordian';

class FaqScreen extends Component {
  static ROUTE_NAME = 'FaqScreen';

  constructor(props) {
    super(props);
    this.state = {
      isExpend: false,
      isLoading: true,
      faqDetails: [],
      selectedTabIndex: 0,
      expandData: [],
    };
  }
  componentDidMount() {
    this.loadData();
  }
  loadData = () => {
    this.props
      .hitFaqDetailPageApi()
      .then(data => {
        
        let finalData = [];
        let tabs = data.data.content.tabs;

        tabs.forEach((item, index) => {
          var result = item.value.map(function(el, inde) {
            var o = Object.assign({}, el);
            o.id = inde + '_fq_' + index;
            o.isExpanded = false;
            return o;
          });
          let obj = {
            name: item.name,
            value: result,
          };
          finalData.push(obj);
        });

        this.setState({
          faqDetails: finalData,
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
  renderTabView = () => {
    const {faqDetails} = this.state;
    const tabName = faqDetails.map((item, index) => {
      return (
        <Text
          tabLabel={item.name}
          isImageVisible={false}
          key={index.toString()}
        />
      );
    });
    return (
      <ScrollableTabView
        style={{backgroundColor: resources.colors.white}}
        tabBarUnderlineStyle={{
          backgroundColor: resources.colors.appColor,
          borderStyle: 'solid',
        }}
        tabBarInactiveTextColor={resources.colors.black}
        tabBarActiveTextColor={resources.colors.appColor}
        tabBarTextStyle={{fontFamily: resources.fonts.regular, fontSize: 15}}
        contentProps={{height: 50}}
        initialPage={0}
        renderTabBar={() => <ScrollableTabBar />}
        onChangeTab={val => {
          this.setState({
            selectedTabIndex: val.i,
            isExpend: false,
          });
        }}>
        {tabName}
      </ScrollableTabView>
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

  renderAnswerQuestionList = () => {
    const {faqDetails, selectedTabIndex} = this.state;
    if (faqDetails.length > 0) {
      let list = faqDetails[selectedTabIndex].value;
      let items = [];
      list.forEach(item => {
        items.push(
          <Accordian
            isExpand={item.isExpanded}
            title={item.question}
            data={item.answer}
            id={item.id}
            onExpand={this.onExpandItem}
          />,
        );
      });
      return items;
    } else {
      return null;
    }
  };
  onExpandItem = (itemId, expanded) => {
    //  console.log("onExpandItem => ", itemId)
    const {faqDetails} = this.state;
    let finalData = [];
    faqDetails.forEach((item, index) => {
      var result = item.value.map(function(el, inde) {
        var o = Object.assign({}, el);
        if (itemId == o.id) {
          o.isExpanded = expanded;
        } else {
          o.isExpanded = false;
        }
        return o;
      });
      let obj = {
        name: item.name,
        value: result,
      };
      finalData.push(obj);
    });
    this.setState({
      faqDetails: finalData,
    });
  };

  render() {
    return (
      <View style={styles.fullScreen}>
        {this.renderHeader()}
        {this.state.isLoading ? (
          this.ActivityIndicatorLoadingView()
        ) : (
          <View style={styles.mainContainer}>
            <View style={{height: 50}}>{this.renderTabView()}</View>
            <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
              {this.renderAnswerQuestionList()}
            </ScrollView>
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
)(FaqScreen);
let loader = APILoadingHOC(container);

loader.getIntent = () => {
  return {
    routeName: FaqScreen.ROUTE_NAME,
  };
};
export default loader;
