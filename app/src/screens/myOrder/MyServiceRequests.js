import React, { Component } from 'react'
import { View, Text, FlatList, Image } from 'react-native'
import styles from './styles'
import { connect } from 'react-redux'
import * as actions from '../../redux/actions/OrderAction'
import APILoadingHOC from "../../genriccomponents/HOCS/APILoadingHOC"
import resources from '../../../res'
import HeaderWithProfile from '../../genriccomponents/header/HeaderWithProfilePic'
import { myHeight } from '../../utility/Utils'
import { Card } from 'native-base'

class MyServiceRequests extends Component {
    static ROUTE_NAME = "MyServiceRequests";
    constructor(props) {
        super(props);
        this.state = {
            myRequestedServices: []
        }
    }
    componentDidMount() {
        this.loadMyServiceRequest()
    }

    loadMyServiceRequest = () => {
        this.props.getMyAllSeriveRequestsApi()
            .then((data) => {
                this.setState({
                    myRequestedServices: [...this.state.myRequestedServices, ...data.data]
                })
            })
            .catch((error) => {
                console.log(error, "error")
            });
    }

    renderHeader = () => {
        return (
            <HeaderWithProfile
                headerTitle={resources.strings.SERVICES_REQUEST_TYPE}
                isBackIconVisible={true}
                onBackClick={this.onBackClick}
                navigateProps={this.props.navigation}
            />
        )
    }
    onBackClick = () => {
        this.props.navigation.goBack()
    }

    render() {
        return (
            <View style={{flex: 1}}>
                {this.renderHeader()}
                {this.renderServiceRequestList()}
            </View>

        )
    }

    renderServiceRequestList = () => {
        return (
            <View style={{flex: 1,backgroundColor:'white'}}>
                {this.renderSeprater()}
                {
                    this.state.myRequestedServices && this.state.myRequestedServices.length > 0 ?
                        <FlatList
                            data={this.state.myRequestedServices}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={this.renderList}
                            ListHeaderComponent={this.renderHeaderList}
                            //ItemSeparatorComponent={this.renderSeprater}
                        /> :
                        this.renderEmptyListView()
                }
            </View>
        )
    }
    renderSeprater = () => {
        return (
            <View style={{ height: 0.5, backgroundColor: resources.colors.labelColor, width: '100%' }}>

            </View>)
    }
    renderEmptyListView = () => {
        return (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Image style={{ marginTop: myHeight/4 }} source ={resources.images.img_no_service_found}/>
                <Text style={{ textAlign: 'center', fontSize: 14 , fontFamily: resources.fonts.regular}}>No service request found</Text>
            </View>
        )
    }
    renderList = ({ item, index }) => {
        return (
           <View style={{marginLeft:16,marginRight:16,marginTop:16}}>
            <Card style={{padding:12,borderRadius:8}}>
                <View style={styles.flexDirection}>
                    <View>
                        <Text style={styles.subText}>{`Ticket ID: #${item.ticket_id}`}</Text>    
                    </View>    
                    <View>
                        <Text style={styles.subText}>{`Order ID: #${item.order_id}`}</Text>    
                    </View>
                </View>
                <View style={{borderWidth:1,marginTop:8,borderStyle:"dashed",borderColor:"#DDDDDF",marginBottom:15}} />
                <View style={styles.flexDirection}>
                    <View style={{width:"49%"}}>
                        <Text style={styles.rType}>{item.request_type}</Text>
                        <Text style={styles.subText}>{`Ordered on: ${item.created_date}`}</Text>
                    </View>
                    <View style={{justifyContent:'center'}}>
                        {
                            item.request_type == "Cancellation" ?
                                <Image source={resources.images.icn_cancelCard} style={styles.tagView} />
                            : null
                        }
                    </View>
                </View>

            </Card>
            {/* <View style={{ flexDirection: 'row', justifyContent: 'space-around',
             alignItems: 'center',paddingVertical:5}}>
                <View style={{ width: 90, flex: 1,flexDirection:'column' }}>
                    <Text style={styles.listDataStyle1}>{item.order_id}</Text>
                    <Text style={styles.dateStyle} >{item.created_date}</Text>
                    <Text style={styles.dateStyle} >{item.created_time}</Text>
                </View>
                <View style={{ width: 90, flex: 1 }}>
                    <Text style={styles.listDataStyle}>{item.ticket_id}</Text>
                </View>
                <View style={{ width: 90, flex: 1 }}>
                    <Text style={styles.listDataStyle}>{item.request_type}</Text>
                </View>
                
                <View style={{ width: 90, flex: 1 }}>
                    <Text style={styles.listDataStyle}>{item.status == "" ? "Pending" : item.status}</Text>
                </View>

            </View> */}
           </View>
        )
    }
    renderHeaderList = () => {
        return (
            <View style={{padding:16}}>
                <View>
                    <Text style={styles.pageTitle}>My service requests</Text>
                </View>
                {/* <View style={{
                    flexDirection: 'row', justifyContent: 'space-around',
                    height: 50, alignItems: 'center',
                }}>
                    <Text style={styles.orderHeading}>Order Id</Text>
                    <Text style={styles.orderHeading}>Ticket Id</Text>
                    <Text style={styles.orderHeading}>Request Type</Text>
                    <Text style={styles.orderHeading}>Pickup Type</Text>
                    <Text style={styles.orderHeading}>Status</Text>
                </View>
                {this.renderSeprater()} */}
            </View>
        )
    }
}


const mapStateToProps = (state) => {
    return {};
};
let container = connect(mapStateToProps, { ...actions })(MyServiceRequests);
let loader = APILoadingHOC(container);

loader.getIntent = () => {
    return {
        routeName: MyServiceRequests.ROUTE_NAME,
    };
};
export default loader;
