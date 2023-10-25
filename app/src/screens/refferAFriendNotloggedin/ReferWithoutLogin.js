import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity} from 'react-native'
import styles from './styles'
import Button from '../../genriccomponents/button/Button'
import resources from '../../../res'
import { showSigninAlert } from '../../utility/Utils'
import  Header  from '../../genriccomponents/header/HeaderAndStatusBar'

class ReferWithoutLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    renderHeader = () => {
        return (
            <Header
                headerTitle={resources.strings.REFER_AND_EARN}
                isBackIconVisible
                customStyle={styles.headerTextStyle}
                onBackClick={this.onBackClick}
            />
        )
    }
    onBackClick = () => {
        this.props.navigation.goBack()
    }


    render() {
        return (
            <View style={styles.fullScreen}>
                {this.renderHeader()}
                <Image source={resources.images.img_refer_a_friend} style={{ width: '100%', height: 232 }}></Image>
                <View style={styles.container}>
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>

                        <Text style={styles.haveYour}>Have your</Text>
                        <Text style={styles.friends}> Friends</Text>
                        <Text style={styles.payFurniture}> pay for your</Text>
                    </View>
                    <Text style={styles.payFurniture}>Furniture</Text>
                    <Text style={styles.shareReferalText}>{resources.strings.SHARE_REFERAL_CODE}</Text>
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <Image source={resources.images.cf_coins} style={{ width: 33, height: 30 }} />
                        <Text style={styles.coinText}>500 CF COINS</Text>
                    </View>
                    <Text style={styles.shareReferalText} >{resources.strings.REFER_AND_GET_CODE}</Text>
                    <View style={{ marginTop: 20 }}>
                        <Button rounded btnText={resources.strings.REGISTERED} onPress={() => this.registerReferal()} />
                    </View>

                    <TouchableOpacity onPress={this.goToHowCoinsWork}>
                        <Text style={styles.knowMoreText}>{resources.strings.KNOW_MORE}</Text>
                    </TouchableOpacity>

                </View>
            </View>
        )
    }
    goToHowCoinsWork=()=>{
       this.props.navigation.navigate("HowReferCoinsWorksScreen")
    }
    registerReferal = () => {
        showSigninAlert("MyAccountScreen")
    }
}
export default ReferWithoutLogin