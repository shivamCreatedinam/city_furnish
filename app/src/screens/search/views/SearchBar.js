import React from 'react'
import { shadow } from '../../../utility/Utils'
import {
    TouchableOpacity,
    StyleSheet,
    View,
    TextInput,
    Image,

} from 'react-native'
import res from '../../../../res'


function SearchBar(props) {
    const { styleSearch, value, onSubmitEditing, onSearchChangeText, searchHint, onClearSearch } = props
    const styleCustom = styleSearch ? styleSearch : {}
    return (
        <View style={[styleCustom, styles.margins, styles.Container, styles.defaultStyle,]}>
            <Image style={styles.imageStyle} source={res.images.icn_search_items} />
            <TextInput
                style={styles.textInputStyle}
                placeholder={searchHint ? searchHint : res.strings.searchHint}
                placeholderTextColor={res.colors.BLACK_TEXT}
                autoCaptialize={'none'}
                autoCorrect={false}
                autoFocus={false}
                value={value}
                underlineColorAndroid={"transparent"}
                returnKeyType={'done'}
                onChangeText={onSearchChangeText ? onSearchChangeText : () => { }}
                onSubmitEditing={onSubmitEditing ? onSubmitEditing : () => { }} />
              {
                value ?
<TouchableOpacity onPress={onClearSearch}>
                <Image style={styles.imageCrossStyle} source={res.images.inc_small_cross} />
            </TouchableOpacity>
                : null
              }  
            

        </View>

    )
}

const styles = StyleSheet.create({
    defaultStyle: {
        ...shadow(2),
        height: 50,
        flexDirection: 'row',
        justifyContent: "flex-start",
        marginHorizontal: 20,
        alignItems: "center",
        alignSelf: "stretch",
    },
    textInputStyle: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        fontFamily: res.fonts.regular,
        color: res.colors.labelColor,
        padding: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingVertical: 0,
    },
    imageStyle: {
        width: 24,
        marginRight: 10,
        height: 24,
        
    },
    imageCrossStyle: {
        width: 24,
        // marginRight: 10,
        // borderWidth:1,
        marginLeft: 6,
        height: 24,
        // tintColor: res.colors.bluish
    }, headerShadow: {
        backgroundColor: res.colors.white,
        elevation: 10,
        zIndex: 1,
        shadowColor: "rgb(234,236,251)",
        shadowOffset: {
            height: 5,
            width: 0
        },
        shadowOpacity: 0.8,
        shadowRadius: 5,
        marginBottom: 3,
    },
    margins: {
        margin: 16,
        paddingHorizontal: 19,
    },
    Container: {
        borderColor: "red",
        backgroundColor: "white",
        borderRadius: 6,
        flexDirection: "column",
        alignItems: "stretch",
    
    },
})
export default SearchBar