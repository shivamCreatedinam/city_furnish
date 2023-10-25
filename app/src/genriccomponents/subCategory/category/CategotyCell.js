import React, { Component } from 'react'
import { Text } from 'react-native'
import resources from '../../../../res'
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';

const CategotyCell = (props) => {
    const { tabBarActiveTextColor, tabBarInactiveTextColor,
         tabBarUnderlineStyle, selectedIndex, listDataItem, categoryRef,initialPageIndex } = props
         
    const returnView = listDataItem.map((item, index) => {
        return <Text
            tabLabel={item.cat_name}
            isImageVisible={props.isImageVisible}
            key={index.toString()}>
        </Text>
    })
    return (
        <ScrollableTabView
            style={{ backgroundColor: resources.colors.white }}
            ref={categoryRef}
            tabBarUnderlineStyle={tabBarUnderlineStyle}
            tabBarTextStyle={{ fontFamily: resources.fonts.regular, fontSize: 15 }}
            tabBarInactiveTextColor={tabBarInactiveTextColor}
            tabBarActiveTextColor={tabBarActiveTextColor}
            contentProps={{ height: 50 }}
            initialPage={initialPageIndex}
            renderTabBar={() => <ScrollableTabBar />}
            onChangeTab={val => { selectedIndex(val.i,initialPageIndex) }}
        >
            {returnView}
        </ScrollableTabView>
    );
};



export default CategotyCell;