import React, {Component} from 'react';
import {View, FlatList, StatusBar} from 'react-native';
import styles from './styles';
import Header from '../../genriccomponents/header/HeaderAndStatusBar';
import resources from '../../../res';
import SortFilterCell from '../../genriccomponents/sortFilter/SortFilerCell';
import Button from '../../genriccomponents/button/Button';

class SortScreen extends Component {
  constructor(props) {
    super(props);
    this.callback = this.props.route.params.callback
      ? this.props.route.params.callback
      : null;
    this.sortType = this.props.route.params.sortType
      ? this.props.route.params.sortType
      : '';
    this.state = {
      selectedType: '',
      DATA: [
        {key: 0, label: 'Whats New', isSelected: false, type: 'new'},
        {key: 1, label: 'All', isSelected: false, type: 'all'},
        {
          key: 2,
          label: 'Price: High to Low',
          isSelected: false,
          type: 'high_low',
        },
        {
          key: 3,
          label: 'Price: Low to High',
          isSelected: false,
          type: 'low_high',
        },
        {key: 4, label: ' ', isSelected: false, type: 'is_blank'},
      ],
    };
  }

  componentDidMount() {
    this.previousType();
    this.props.navigation.addListener('focus', () => this.componentDidFocus());
  }
  componentDidFocus = () => {
    // StatusBar.setBarStyle('dark-content');
    // StatusBar.setBackgroundColor(resources.colors.white);
  };
  previousType = () => {
    const {DATA} = this.state;
    let filterArr = DATA.filter(item => {
      item.type == this.sortType
        ? (item.isSelected = true)
        : (item.isSelected = false);
      return item;
    });
    this.setState({
      DATA: filterArr,
      selectedType: this.sortType,
    });
  };

  onBackClick = () => {
    this.props.navigation.goBack();
  };
  renderSortFilterCell = ({item, index}) => {
    if (item.type != 'is_blank') {
      return (
        <SortFilterCell
          filterOption={item.label}
          isSelected={item.isSelected}
          onPress={() => this.checkedFilter(index)}
        />
      );
    }
  };
  checkedFilter = index => {
    const {DATA} = this.state;
    let filterArr = DATA.filter(item => {
      item.key == index ? (item.isSelected = true) : (item.isSelected = false);
      return item;
    });
    this.setState({
      DATA: filterArr,
      selectedType: DATA[index].type,
    });
  };

  renderSeparator = () => {
    return <View style={styles.separatorStyle} />;
  };
  renderHeader = () => {
    return (
      <Header
        statusBarColor={resources.colors.appColor}
        headerTitle={resources.strings.SORT}
        onBackClick={this.onBackClick}
        isResetVisible
        isCrossIconVisible={true}
        onResetPress={this.onResetPress}
      />
    );
  };

  onResetPress = () => {
    const {DATA} = this.state;
    let filterArr = DATA.filter(item => {
      item.isSelected = false;
      return item;
    });
    this.setState({
      DATA: filterArr,
      selectedType: '',
    });
  };

  render() {
    return (
      <View style={styles.fullScreen}>
        {this.renderHeader()}
        <View style={styles.separatorStyle} />
        <FlatList
          style={{backgroundColor: 'white'}}
          data={this.state.DATA}
          keyExtractor={(item, index) => index.toString()}
          renderItem={this.renderSortFilterCell}
          ItemSeparatorComponent={this.renderSeparator}
        />
        {/* <View style={[styles.separatorStyle,{height:4}]} /> */}
        {/* <View style={{flex:1}}>

                </View> */}
        <View style={[styles.buttonContainer]}>
          <Button
            rounded
            btnStyle={{backgroundColor: resources.colors.appColor}}
            btnText={resources.strings.APPLY}
            textStyle={{color: '#3a3a3a'}}
            onPress={() => {
              this.onApplyButtonPressed();
            }}
          />
        </View>
      </View>
    );
  }
  onApplyButtonPressed = () => {
    const {selectedType} = this.state;
    if (this.callback) {
      this.callback(selectedType);
      this.onBackClick();
    }
  };
}

export default SortScreen;
