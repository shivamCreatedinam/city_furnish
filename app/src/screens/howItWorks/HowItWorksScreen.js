import React, {Component} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import styles from './styles';
import HeaderWithProfile from '../../genriccomponents/header/HeaderWithProfilePic';
import resources from '../../../res';
import {connect} from 'react-redux';
import * as actions from '../../redux/actions/MiscellaneousAction';
import APILoadingHOC from '../../genriccomponents/HOCS/APILoadingHOC';
import Accordian from '../../genriccomponents/expandView/Accordian';
import YoutubeIframe from 'react-native-youtube-iframe';
import IconText from '../../genriccomponents/iconsWithText/IconText';
import images from '../../../res/images';
// import WebView from 'react-native-webview';

const SubComps = ({id, title, body}) => {
  return (
    <View key={id} style={{marginLeft: 10, marginVertical: 5}}>
      <Text style={{fontSize: 15, fontWeight: 'bold', color: '#36454f'}}>
        {title}
      </Text>
      <Text style={{fontSize: 12, color: 'black'}}>{body}</Text>
    </View>
  );
};

class HowItWorksScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: false,
      serverData: [],
      howItWorks: [
        {
          id: '01',
          step: 'Choose the Products you need',
          img: resources.images.img_Step1,
        },
        {
          id: '02',
          step: 'Fill in the Delivery Address and Checkout',
          img: resources.images.img_Step2,
        },
        {
          id: '03',
          step: 'Pay 1 month rent and Refundable Security Deposit',
          img: resources.images.img_Step3,
        },
        {
          id: '04',
          step: 'Opt for Standing Instructions for Future Payments',
          img: resources.images.img_Step4,
        },
        {
          id: '05',
          step: 'You will receive an order with delivery progress & tracking',
          img: resources.images.img_Step5,
        },
        {
          id: '06',
          step: 'Submit required information for KYC purpose',
          img: resources.images.img_Step6,
        },
      ],
      whyRentData: [
        {
          id: 1,
          title: 'No Hassle of Disposing',
          body:
            'Cityfurnish upgrades your Furniture and Appliances without the hassle of disposing the old ones.',
        },
        {
          id: 2,
          title: 'No One Time Burden of Capital Expenditure',
          body:
            'Cityfurnish assures that monthly subscription of Furniture and Appliances on long term basis is more economical than capital you invest while buying furniture and appliances.',
        },
        {
          id: 3,
          title: 'Refurnish your Home every year',
          body:
            'Got bored with the same furniture and appliances from years! Subscribing with cityfurnish is ease and affordable moreover you can also refurnish your home every year by switching to renting.',
        },
      ],
    };
  }

  componentDidMount() {
    this.loadData();
  }
  loadData = () => {
    this.props
      .getHowItWorksListApi()
      .then(data => {
        var result = data.data.content.map(function(el, index) {
          var o = Object.assign({}, el);
          o.id = index + '_hw';
          o.isExpanded = false;
          return o;
        });

        this.setState({
          serverData: result,
        });
      })
      .catch(error => {
        console.log('error', error);
      });
  };

  googleReviews = () => {
    return `<html>
    <body>
    <script src="https://apps.elfsight.com/p/platform.js" defer></script>
    <h1>My First Heading</h1>
    <div class="elfsight-app-05771ac4-936d-4279-bac5-c350ab1854f5"></div>
    </body>
    </html>
    `;
  };

  renderHeader = () => {
    return (
      <HeaderWithProfile
        headerTitle={resources.strings.HOW_IT_WORKS}
        isBackIconVisible={true}
        onBackClick={this.onBackClick}
        navigateProps={this.props.navigation}
        toRoute={'MyAccountScreen'}
      />
    );
  };
  //   renderSteps = ({item, index}) => {
  //     return (
  //       <View style={styles.viewStep}>
  //         <Image
  //           source={item.img}
  //           resizeMode={'contain'}
  //           style={styles.imageStep}
  //         />
  //         <Text style={styles.idStep}>{item.id}</Text>
  //         <Text style={styles.textStep}>{item.step}</Text>
  //       </View>
  //     );
  //   };

  referallSteps = () => {
    const {howItWorks} = this.state;
    return (
      <FlatList
        // style={{ marginTop: 10 }}
        data={howItWorks}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        renderItem={this.renderSteps}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  benefits = () => {
    return (
      <View style={{marginBottom: 20}}>
        {/* <View style={styles.borders} /> */}
        <Text
          style={[styles.howItWorksText, {marginLeft: 10, marginVertical: 10}]}>
          Benefits
        </Text>
        <View style={styles.borders} />

        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-around',
            marginVertical: 10,
          }}>
          <IconText text={'Free Delivery'} url={images.img_profit01} />
          <IconText text={'Free Upgrade'} url={images.img_profit06} />
          <IconText text={'Free Relocation'} url={images.img_profit05} />
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-around',
          }}>
          <IconText text={'Damage Waiver'} url={images.img_profit03} />
          <IconText text={'Free Installation'} url={images.img_profit02} />
          <IconText text={'Mint Condition'} url={images.img_profit04} />
        </View>
      </View>
    );
  };

  whyToRent = () => {
    return (
      <View style={{marginBottom: 20}}>
        {/* <View style={styles.borders} /> */}
        <Text
          style={[styles.howItWorksText, {marginLeft: 10, marginVertical: 10}]}>
          Why to Rent
        </Text>
        <View style={styles.borders} />
        <FlatList
          data={this.state.whyRentData}
          renderItem={({index, item}) => (
            <SubComps id={item.id} title={item.title} body={item.body} />
          )}
        />
      </View>
    );
  };

  onBackClick = () => {
    this.props.navigation.goBack();
  };

  render() {
    return (
      <View style={styles.fullScreen}>
        {this.renderHeader()}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.mainContainer}>
            <View style={styles.container}>
              <Text style={styles.howItWorksText}>
                {resources.strings.HOW_IT_WORKS}
              </Text>
              <Text style={styles.become_Brand}>
                {resources.strings.Follow_steps}
              </Text>

              {/* Youtube player */}
              <YoutubeIframe
                height={210}
                play={this.state.playing}
                videoId={'Tx50ddNJk9c'}
                webViewStyle={{marginVertical: 20}}
              />

              {/* <View style={{marginVertical: 8}}>{this.renderSteps()}</View> */}
            </View>
            {this.benefits()}
            {this.whyToRent()}
            <View style={styles.allYouKnow}>
              <Text style={styles.textAllYouKnow}>
                {resources.strings.QUES_AND_ANS}
              </Text>
            </View>
            <View style={{flex: 1}}>{this.renderAnswerQuestionList()}</View>
            {/* <WebView
              ref={'WebView'}
              startInLoadingState={true}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              showsVerticalScrollIndicator={false}
              source={{html: this.googleReviews()}}
              scalesPageToFit={false}
              style={{
                flex: 1,
                height: Dimensions.get('screen').height,
                width: Dimensions.get('screen').width,
              }}
            /> */}
          </View>
        </ScrollView>
      </View>
    );
  }

  renderAnswerQuestionList = () => {
    const {serverData} = this.state;
    if (serverData.length > 0) {
      let items = [];
      serverData.forEach((item, index) => {
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
    const {serverData} = this.state;
    var result = serverData.map(function(el, index) {
      var o = Object.assign({}, el);
      if (itemId == o.id) {
        o.isExpanded = expanded;
      } else {
        o.isExpanded = false;
      }

      return o;
    });

    this.setState({
      serverData: result,
    });
  };
}

const mapStateToProps = state => {
  return {};
};
let container = connect(
  mapStateToProps,
  {...actions},
)(HowItWorksScreen);
let loader = APILoadingHOC(container);

export default loader;
