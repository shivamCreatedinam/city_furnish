import React, { useRef, useState } from 'react';
import { View, StyleSheet, Text, Image,TouchableOpacity,ImageBackground, SafeAreaView, FlatList, ScrollView } from 'react-native';
import resources from '../../../res';
import { myWidth } from '../../utility/Utils';

const OnboardingScreen = (props) => {

    const flatListRef = useRef(FlatList);
    const [currentIndex,setCurrentIndex] = useState(1)
    const [slideData,setSlideData] = useState([1,2,3])

    return (

        <SafeAreaView style={styles.mainContainer}>

            <View style={styles.containerTop}>
                <View style={styles.left}>
                    <Text style={styles.hiText}>hi</Text>
                </View>
                <TouchableOpacity onPress={() => props.navigation.push("SigninScreen")} style={[styles.right,{justifyContent:'center'}]}>
                    <Image source={resources.images.icn_skip} style={{width:70,height:30}}  />
                </TouchableOpacity>
            </View>

            <View style={styles.headingWrap}>
                <Text style={styles.heading}>Make your picture perfect home with us</Text>
            </View>
             
              {/* Second Card Design  */}

              <FlatList 
                data={slideData}
                scrollEventThrottle={16}
                onScroll={(event) => {
                    const totalWidth = event.nativeEvent.layoutMeasurement.width
                    const xPosition = event.nativeEvent.contentOffset.x
                    const newIndex = Math.round(xPosition / totalWidth)
                    if (newIndex !== currentIndex) {
                        setCurrentIndex(newIndex)
                        console.log("newIndex ::",newIndex)
                    }
                }}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                ref={flatListRef}
                renderItem={({item,index}) => {
                    if(item == 1){
                        return(
                            <View style={{width:myWidth - 36}}>
                             <View style={styles.cardBackground}>
                             <View >
                                 <Text style={styles.cardTopText}>Choose what fits best for you from the wide-range of products</Text>
                             </View>
     
                             <View  style={{height:276}}>
                                <Image source={resources.images.icn_slideframe} style={{width:undefined,height:280}} />
                             </View>

                             <View style={styles.imageBackslot}>
                                <Image source={resources.images.splash_cardMainImage} style={styles.backgroundImage} />
                             </View>
                             </View>
                            </View>
                         )
                    }else if(item == 2){
                        return(
                            <View style={{width:myWidth - 36}}>
                             <View style={styles.cardBackground}>
                             <View style={styles.cardTextWrap}>
                                 <Text style={styles.cardTopText}>But, why should you rent with us?
                                     Here’s why...</Text>
                             </View>
     
                             <View style={styles.CardList}>
                                 <View style={styles.iconContainer}>
                                     <Image source={resources.images.splash_v6icon} style={styles.icon} />
                                 </View>
                                 <View style={styles.contentContainer}>
     
                                     <Text style={styles.description}>{`Fresh and mint new condition\n products`}</Text>
                                 </View>
     
                             </View>
     
                             <View style={styles.CardList}>
                                 <View style={styles.iconContainer}>
                                     <Image source={resources.images.splash_shippingIcon} style={styles.icon} />
                                 </View>
                                 <View style={styles.contentContainer}>
     
                                     <Text style={styles.description}>You get free shipping and free upgrades on all products</Text>
                                 </View>
     
                             </View>
     
                             <View style={styles.CardList}>
                                 <View style={styles.iconContainer}>
                                     <Image source={resources.images.splash_setting} style={styles.icon} />
                                 </View>
                                 <View style={styles.contentContainer}>
     
                                     <Text style={styles.description}>Free relocation and installation</Text>
                                 </View>
                             </View>
     
                             <View style={styles.imageBackslot}>
                             <Image source={resources.images.splash_cardMainImage} style={styles.backgroundImage} />
                             </View>
                             </View>
                            </View>
                         )
                    }else {
                        return(
                            <View style={{width:myWidth - 36}}>
                             <View style={styles.cardBackground}>
                             <View style={{paddingBottom:15}}>
                                 <Text style={styles.cardTopText}>It’s fast. It just takes 4 steps to rent a product.</Text>
                             </View>
                              
                             <View style={styles.CardList}>
                                 <View style={styles.iconContainer}>
                                     <Image source={resources.images.icn_step1} style={styles.icon1} />
                                 </View>
                                 <View style={[styles.contentContainer,{marginLeft:25}]}>
                                    <Text style={styles.stepText}>STEP 1</Text>
                                     <Text style={styles.description2}>{`Fresh and mint new condition\n products`}</Text>
                                 </View>
     
                             </View>
                             <View style={{height:15}} />
                             <View style={styles.CardList}>
                                 <View style={styles.iconContainer}>
                                     <Image source={resources.images.icn_step2} style={styles.icon1} />
                                 </View>
                                 <View style={[styles.contentContainer,{marginLeft:25}]}>
                                    <Text style={styles.stepText}>STEP 2</Text>
                                     <Text style={styles.description2}>{`Pay the amount online and complete the KYC documentation`}</Text>
                                 </View>
     
                             </View>
                             <View style={{height:15}} />
                             <View style={styles.CardList}>
                                 <View style={styles.iconContainer}>
                                     <Image source={resources.images.icn_step3} style={styles.icon1} />
                                 </View>
                                 <View style={[styles.contentContainer,{marginLeft:25}]}>
                                    <Text style={styles.stepText}>STEP 3</Text>
                                     <Text style={styles.description2}>{`Get items delivered and assembled within 72 hrs`}</Text>
                                 </View>
     
                             </View>
                             <View style={{height:15}} />
                             <View style={styles.CardList}>
                                 <View style={styles.iconContainer}>
                                     <Image source={{uri : "https://d3juy0zp6vqec8.cloudfront.net/images/interior-set.webp"}} style={styles.icon1} />
                                 </View>
                                 <View style={[styles.contentContainer,{marginLeft:25}]}>
                                    <Text style={styles.stepText}>STEP 4</Text>
                                     <Text style={styles.description2}>{`Experience the firsthand magic of furniture`}</Text>
                                 </View>
     
                             </View>
                             
     
                             <View style={styles.imageBackslot}>
                             <Image source={resources.images.splash_cardMainImage} style={styles.backgroundImage} />
                             </View>
                             </View>
                            </View>
                         )
                    }
                    
                }}
              />
                
         
         
            <View style={{position:'absolute',bottom:95,left:"48%"}}>
                {
                    currentIndex == 0  ?
                        <Image source={resources.images.icn_dot1} style={{width:42,height:22}} />
                    :
                    currentIndex == 1 ?
                        <Image source={resources.images.icn_dot2} style={{width:42,height:22}} />
                    :
                        <Image source={resources.images.icn_dot3} style={{width:42,height:22}} />
                    
                }
            </View>
          

            <View style={styles.btnSlot}> 
                   <TouchableOpacity onPress={() => {
                    if(currentIndex == 0 || currentIndex == 1 ){
                        flatListRef?.current?.scrollToIndex({
                            animated: true,
                            index: currentIndex + 1
                        });
        
                    }else if(currentIndex == 2){
                        props.navigation.push("SigninScreen")
                    }
                   }} style={styles.button}>
                    <Text style={styles.buttonText}>{currentIndex == 0 || currentIndex == 1 ? 'Next' : "Start renting"}</Text>
                      </TouchableOpacity>
                </View>

        </SafeAreaView>


    );
};

const styles = StyleSheet.create({

    mainContainer: {
        padding: 16
    },
    cardContainerTop: {
        width: '100%',
        borderRadius: 10,

    },
    heading: {
        fontSize: 24,
        color: '#222222',
        fontFamily:resources.fonts.medium
    },
    imageBackslot:{
      position:'absolute' ,
      bottom:0    
    },
    skipBtn: {
        color: '#71717A',
        fontWeight: '600',
        fontSize: 14,
        paddingLeft: 6,
        paddingBottom: 6,
        paddingRight: 12,
        paddingTop: 8,
        backgroundColor: '#F6F2EE',
        borderWidth: 1,
        borderColor: '#F6F2EE',
        borderRadius: 22,

    },
    hiText: {
        backgroundColor: '#000',
        width: 52,
        height: 52,
        textAlign: 'center',
        color: '#fff',
        borderRadius: 10,
        lineHeight: 52,
        fontSize: 22,
        fontWeight: '600',
        fontFamily:resources.fonts.bold


    },

    backgrounsImage:{
        resizeMode: "center",
        alignSelf: "flex-end"  ,
       
        
    },

    cardBackground: {
        width: '100%',
        borderRadius: 10,
        borderColor: '#EDEDEE',
        borderWidth: 4,
        minHeight: 400,
        paddingTop: 30,
        paddingBottom: 0,
        paddingLeft: 20,
        paddingRight: 20,
        position:'relative'
    },
    cardTextWrap: {
       paddingBottom:40
    },
    cardTopText: {
        color: '#71717A',
        fontSize: 14,
        fontWeight: '400',
        fontFamily:resources.fonts.regular
    },


    headingWrap:{
    paddingBottom:40,
    padding:8
    },


    containerTop: {
        flexDirection: 'row', // Arrange items horizontally
        justifyContent: 'space-between', // Align items at the ends of the container
        padding: 12,
        marginTop:40
    },
    left: {
        // Add styles for the left element
    },
    right: {
        // Add styles for the right element
    },


    CardList: {
        flex: 1,
        flexDirection: 'row',

    },

    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,

        justifyContent: 'center',
        alignItems: 'center',
    },
    
    iconContainer1: {
        width: 75,
        height: 75,
        borderRadius: 25,

        justifyContent: 'center',
        alignItems: 'center',
    },

    icon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },

    icon1: {
        width: 75,
        height: 75,
        resizeMode: 'contain',
    },
    contentContainer: {
        flex: 1,
        marginLeft: 16,

    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#48678B',
        paddingBottom:5
      },
    description: {
        fontSize: 14,
        color: '#222222',
        lineHeight: 20,
        fontWeight: '500',
        fontFamily:resources.fonts.medium
    },
    stepText:{
        color:"#48678B",fontFamily:resources.fonts.medium,fontWeight:'500',fontSize:14
    },
    description2: {
        fontSize: 12,
        color: '#71717A',
        lineHeight: 15,
        fontWeight: '400',
        fontFamily:resources.fonts.regular,
        marginTop:10
    },
    description1: {
        fontSize: 14,
        color: '#71717A',
        lineHeight: 20,
        fontWeight: '400'
    },
    btnSlot:{
     paddingTop:40,
      
     
     
    },
    button: {
        backgroundColor: '#000000',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
        textAlign:'center',
        width:'100%'
       
      },
      buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '500',
        textAlign:'center',
        fontFamily:resources.fonts.medium
      },
      divider:{
        width:'100%',
        height:2,
        backgroundColor:'#EDEDEE'
      }

});

export default OnboardingScreen;
