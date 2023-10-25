import React, { Component } from 'react'
import { View, Text, Image, SectionList, StatusBar } from 'react-native'
import styles from './styles'
import resources from '../../../res';
import Button from '../../genriccomponents/button/Button'
import HorizontalImageView from '../../genriccomponents/productView/horizontalImage/HorizontalImageView'
import * as actions from '../../redux/actions/FrpAction'
import { connect } from 'react-redux'
import HeaderAndStatusBar from '../../genriccomponents/header/HeaderAndStatusBar'
import APILoadingHOC from '../../genriccomponents/HOCS/APILoadingHOC'

class FrpProductSuggesionScreen extends Component {
    static ROUTE_NAME = "CfCoinsScreen";
    constructor(props) {
        super(props);
        this.productId = this.props.route.params && this.props.route.params.productId ? this.props.route.params.productId : null
        this.roomId = this.props.route.params && this.props.route.params.roomId ? this.props.route.params.roomId : null
        this.slotId = this.props.route.params && this.props.route.params.slotId ? this.props.route.params.slotId : null
        this.callback = this.props.route.params && this.props.route.params.callback ? this.props.route.params.callback : null

        this.state = {
            height: null,
            productData: [],
            premiumProducts: []
        }
    }
    componentDidMount() {
        this.loadData()
        this.props.navigation.addListener('focus', () => this.componentDidFocus())
    }
    componentDidFocus = () => {
        // StatusBar.setBarStyle('dark-content');
        // StatusBar.setBackgroundColor(resources.colors.white);
    }

    loadData = () => {
        if (this.productId && this.slotId && this.roomId) {
            this.props.hitGetFrpSuggestionProducts(this.productId, this.roomId, this.slotId)
                .then((resp) => {
                    let finalData = []
                    // finalData.push(...resp.data.associated_products, ...resp.data.associated_premium_products)
                    var result = resp.data.associated_products.map(function (el) {
                        var o = Object.assign({}, el);
                        o.snapIndex = 0;
                        return o;
                    })
                    if (result.length > 0) {
                        finalData.push({
                            title: "Product Options",
                            data: result
                        })
                    }
                    var result1 = resp.data.associated_premium_products.map(function (el) {
                        var o = Object.assign({}, el);
                        o.snapIndex = 0;
                        return o;
                    })
                    if (result1.length > 0) {
                        finalData.push({
                            title: "Optional Upgrades",
                            data: result1
                        })
                    }
                    this.setState({
                        productData: finalData
                    })
                })
                .catch((err) => {
                    console.log("Error while fetchinf retail details ")
                })
        }
    }
    onLayoutChange = (event) => {
        var { height } = event.nativeEvent.layout;
        this.setState({ height: height });
    };
    onActiveHorizontalItem = (index, listItemId) => {
        let { productData } = this.state
        let finalData = []
        for (let i = 0; i < productData.length; i++) {
            let label = productData[i].title
            let data = productData[i].data
            let dataNew = data.filter(item => {
                if (item.id == listItemId) {
                    item.snapIndex = index;
                }
                return item
            })
            finalData.push({
                title: label,
                data: dataNew
            })
        }
        this.setState({
            productData: finalData
        })
    }
    onBackClick = () => {
        this.props.navigation.goBack()
    }

    renderProductView = ({ item, index }) => {
        if (item.productDetails) {
            let data = item.productDetails && item.productDetails[0]
            if (!data) {
                return null
            }
            const { dimension, brand, material, colour } = data
            return (
                <View>
                    <View style={styles.horizontalImageContainer}>
                        <HorizontalImageView
                            data={data.image}
                            activeIndexHorizontal={item.snapIndex}
                            frpStyle={true}
                            onSnapToItem={(snapIndex) => (this.onActiveHorizontalItem(snapIndex, item.id))} />
                    </View>
                    <View style={styles.margin}>
                        <Text style={styles.titleTextStyle}>{data.product_name}</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={styles.specificationTextStyle}>{resources.strings.SPECIFICATION_TITLE}</Text>
                            {item.additional_amount &&
                                <Text style={styles.additonalAmountStyle}>+{'\u20B9'}{item.additional_amount}/month</Text>
                            }

                        </View>
                        <View style={styles.rowDirection}>
                            <View style={styles.spaceContainer}>
                                {brand && brand == "" ? <View /> : <Text style={styles.subTitleTextStyle}>{resources.strings.BRAND_TEXT}</Text>}
                                {dimension && dimension == "" ? <View /> : <Text style={styles.subTitleTextStyle}>{resources.strings.SIZE_TEXT}</Text>}
                                {material && material == "" ? <View /> : <Text style={styles.subTitleTextStyle}>{resources.strings.MATERIAL_TEXT}</Text>}
                                {colour && colour == "" ? <View /> : <Text style={styles.subTitleTextStyle}>{resources.strings.COLOR_TEXT}</Text>}
                            </View>
                            <View style={styles.spaceContainer}>
                                {brand && brand == "" ? <View /> : <Text style={styles.subTitleValueStyle} ellipsizeMode={'tail'} numberOfLines={1}>{brand}</Text>}
                                {dimension && dimension == "" ? <View /> : <Text style={styles.subTitleValueStyle} ellipsizeMode={'tail'} numberOfLines={1}>{dimension}</Text>}
                                {material && material == "" ? <View /> : <Text style={styles.subTitleValueStyle} ellipsizeMode={'tail'} numberOfLines={1}>{material}</Text>}
                                {colour && colour == "" ? <View /> : <Text style={styles.subTitleValueStyle} ellipsizeMode={'tail'} numberOfLines={1}>{colour}</Text>}
                            </View>
                        </View>
                        <View style={styles.marginTopBottom}>
                            <Button
                                rounded btnText={resources.strings.ADD}
                                onPress={() => { this.onChooseProduct(item) }} />
                        </View>
                    </View>
                </View>
            )
        }

    }

    onChooseProduct = (item) => {
        let obj = {
            type: item.additional_amount ? "premium" : "associated",
            imgUrl: item.productDetails[0].image[0],
            slotId: this.slotId,
            roomId: this.roomId,
            associatedProductId: item.associated_product_id,
            additionalAmount: item.additional_amount ? item.additional_amount : 0
        }
        if (this.callback) {
            this.callback(obj)
            this.onBackClick();
        }
    }

    onBackClick = () => {
        this.props.navigation.goBack()
    }

    render() {
        const { productData } = this.state

        return (
            <View style={styles.fullScreen}>
                <HeaderAndStatusBar
                    statusBarColor={resources.colors.appColor}
                    isBackIconVisible
                    headerTitle={"Products"}
                    onBackClick={this.onBackClick}
                />
                {productData.length > 0 ?
                    <SectionList
                        style={{ paddingBottom: 20 }}
                        sections={productData}
                        stickySectionHeadersEnabled={false}
                        keyExtractor={(item, index) => item + index}
                        renderItem={this.renderProductView}
                        renderSectionFooter={this.renderFooter}
                        ItemSeparatorComponent={this.SectionSeparatorComponent}
                        renderSectionHeader={({ section: { title } }) => (
                            <Text style={title == "Product Options" ? styles.sectionHeader : styles.sectionHeaderUpgrade}>{title}</Text>
                        )}></SectionList>
                    : <View />}
            </View>
        )
    }
    SectionSeparatorComponent = () => {
        return (
            <View>
                <Image source={resources.images.img_dash_line}
                    style={{ width: '100%', marginVertical: 13 }}
                    resizeMode={'repeat'}>
                </Image>
            </View>
        )
    }
    renderFooter = () => {
        return (
            <View style={{ height: 24 }} />
        )
    }
}


const mapStateToProps = (state) => {
    return {};
};
let container = connect(mapStateToProps, { ...actions, })(FrpProductSuggesionScreen);
let loader = APILoadingHOC(container);
export default loader;
