import React, { Component } from 'react'
import { View, FlatList, Text, Image, TouchableOpacity, ActivityIndicator, StatusBar } from 'react-native'
import styles from './styles'
import Header from '../../genriccomponents/header/HeaderAndStatusBar'
import resources from '../../../res'
import Button from '../../genriccomponents/button/Button'
import FilterCell from '../../genriccomponents/filter/filterCell';
import * as actions from '../../redux/actions/FilterAction'
import { connect } from 'react-redux';

class FilterScreen extends Component {
    static ROUTE_NAME = "FilterScreen";
    constructor(props) {
        super(props);
        this.callback = this.props.route.params && this.props.route.params.callback ? this.props.route.params.callback : null
        this.parentCategoryId = this.props.route.params.parentCategoryId ? this.props.route.params.parentCategoryId : null
        this.childCategoryId = this.props.route.params.childCategoryId ? this.props.route.params.childCategoryId : null
        this.state = {
            selectedIds: this.props.route.params.selectedfilters ? this.props.route.params.selectedfilters : {},
            filterListData: [],
            showLoader: true,
        }
    }

    loadData = () => {
        this.props.hitFilterApi(this.parentCategoryId, this.childCategoryId)
            .then((data) => {
                this.setState({
                    filterListData: data.data,
                    showLoader: false
                })
            })
            .catch((err) => {
                this.setState({
                    showLoader: false
                })
            })
    }
    componentDidMount() {
        this.loadData();
        this.props.navigation.addListener('focus', () => this.componentDidFocus())
    }
    componentDidFocus = () => {
        // StatusBar.setBarStyle('dark-content');
        // StatusBar.setBackgroundColor(resources.colors.white);
    }

    renderFilterCell = ({ item, index }) => {
        const { selectedIds } = this.state;
        return (
            <FilterCell
                key={item.id}
                filterOption={item.filter_name}
                isSelected={selectedIds[item.filter_tag]}
                onPress={() => this.checkedFilter(item, index)}
            />

        )
    }
    renderHorizontalList = ({ item }) => {
        return (
            <View style={styles.renderHorizontalListCon}>
                <View style={styles.textAndCrossContainer}>
                    <Text ellipsizeMode={'tail'} numberOfLines={1} style={styles.textStyle}>{item.filter_name}</Text>
                    <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => this.checkedFilter(item)}>
                        <Image source={resources.images.close_white_icn} resizeMode={'contain'} />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    checkedFilter = (item, index) => {
        const { selectedIds } = this.state;
        this.setState({
            selectedIds: {
                ...selectedIds,
                [item.filter_tag]: !selectedIds[item.filter_tag]
            },
        })
    }

    renderSeparator = () => {
        return (
            <View style={styles.seperatorLine} />
        );
    };
    renderHeader = () => {
        return (
            <Header
                statusBarColor={resources.colors.appColor}
                headerTitle={resources.strings.FILTER}
                isCrossIconVisible
                onResetPress={this.onResetPress}
                isResetVisible
                onBackClick={this.onPressBack}
            />
        )
    }

    onPressBack = () => {
        this.props.navigation.goBack()
    }
    onResetPress = () => {
        const { selectedIds } = this.state
        for (var filter_name in selectedIds) {
            delete selectedIds[filter_name];
        }
        this.setState({
            selectedIds: selectedIds
        })
    }
    onApplyButton = () => {
        const { selectedIds } = this.state
        if (this.callback) {
            this.callback(selectedIds);
            this.onPressBack()
        }
    }

    getSelectedList = () => {
        const { selectedIds, filterListData } = this.state;
        let finalArr = []
        let selectedList = Object.keys(selectedIds).filter(item => selectedIds[item])
        filterListData.filter(item => {
            if (selectedList.indexOf(item.filter_tag) != -1) {
                finalArr.push(item)
            }
        })
        return finalArr
    }
    render() {
        const { filterListData } = this.state;
        let selectedList = this.getSelectedList()
        const visibleArea = selectedList.length != 0
        return (
            <View style={styles.fullScreen}>
                {this.renderHeader()}
                {visibleArea ? <View style={styles.flatlistContainer}>
                    <FlatList
                        data={selectedList}
                        horizontal={true}
                        keyExtractor={index => index.toString()}
                        renderItem={this.renderHorizontalList}
                        showsHorizontalScrollIndicator={false}
                    />
                </View> : <View />}

                <View style={styles.divider} />
                {filterListData.length > 0 ? <FlatList
                    data={filterListData}
                    keyExtractor={index => index.toString()}
                    renderItem={this.renderFilterCell}
                    ItemSeparatorComponent={this.renderSeparator}

                /> :
                    this.showEmptyFilterUI()}
                <View style={styles.buttonContainer}>
                    <Button rounded btnText={resources.strings.APPLY}
                        onPress={() => { this.onApplyButton() }} />
                </View>

            </View>
        )
    }
    showEmptyFilterUI = () => {
        if (this.state.showLoader) {
            return (
                this.showLoader()
            )
        } else {
            return (
                <View style={styles.containerLoaderStyle}>
                    <Text>No Data found</Text>
                </View>
            )
        }

    }
    showLoader = () => {
        return (
            <View style={styles.containerLoaderStyle}>
                <ActivityIndicator size="large" color={resources.colors.appColor} />
            </View>
        )
    }

}
const mapStateToProps = (state) => {
    return {};
};
let container = connect(mapStateToProps, { ...actions })(FilterScreen);

export default container;

