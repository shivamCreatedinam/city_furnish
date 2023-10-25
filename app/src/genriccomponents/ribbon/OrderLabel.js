import React, {Component} from 'react'
import PropTypes from 'prop-types';
import {
    StyleSheet,
    View,
    Text,
} from 'react-native'
import res from '../../../res'

const styles = StyleSheet.create({
    container: {
        // position: 'absolute',
        //transform: [{rotate: '45deg'}],
        justifyContent: 'flex-end',
    },
    label: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#fff',
        fontSize: 9,
        paddingHorizontal:0,
        textAlign:'center',
        fontFamily:res.fonts.regular
    },
})

export default class OrderLabel extends Component {

    static defaultProps = {
        alignment: 'left',
    }

    static propTypes = {
        // style: PropTypes.style,
        // textStyle: PropTypes.style,
        cornerRadius: PropTypes.number.isRequired,
        alignment: PropTypes.oneOf([
            'left',
            'right',
        ])
    }

    constructor (props) {
        super(props)
        this.state = {}

        this._labelHeight = Math.sqrt(Math.pow(props.cornerRadius, 2) / 2)
        this._labelWidth = this._labelHeight * 2
        let originOffset = Math.sqrt(Math.pow(this._labelHeight / 2, 2) / 2)
        let labelHorizontalPosition = -this._labelWidth / 2 + originOffset
        let labelVerticalPosition = - this._labelHeight / 2 +  originOffset
        if(props.alignment == 'left') {
            this._labelPosition = {left : labelHorizontalPosition, top: labelVerticalPosition}
            this._labelTransform = {transform: [{rotate: '0deg'}]}
        }
        else {
            this._labelPosition = {right : labelHorizontalPosition, top: labelVerticalPosition}
            this._labelTransform = {transform: [{rotate: '0deg'}]}
        }

    }

    render () {
        return (
            <View style={[styles.container,
                      this._labelPosition,
                      this._labelTransform,
                      {width: this._labelWidth, height: this._labelHeight, },
                       ]}>
                <View style={[styles.label,
                        {height: this._labelHeight},
                        this.props.style,
                        ]}>
                    {this._renderChildren()}
                </View>
            </View>
        )
    }

    _renderChildren () {
        return React.Children.map(this.props.children, (child) => {
            if (!React.isValidElement(child)) {
                return <Text style={[styles.text, this.props.textStyle]}>{child}</Text>
            }
            return child
        })
    }

}