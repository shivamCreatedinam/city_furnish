import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const GooglePlacesInput = (props) => {
    return null
//   return (
//     <GooglePlacesAutocomplete
//                       currentLocation={true}
//                       enableHighAccuracyLocation={true}
//                       ref={c => (this.searchText = c)}
//                       placeholder="Search for your location..."
//                       minLength={2} // minimum length of text to search
//                       autoFocus={false}
//                       returnKeyType={'search'}
//                       listViewDisplayed={this.state.listViewDisplayed}
//                       fetchDetails={true}
//                       renderDescription={row => row.description}
//                       enablePoweredByContainer={false}
//                       listUnderlayColor="lightgrey"
//                       onPress={(data, details) => {
//                         // this.setState({
//                         //   listViewDisplayed: false,
//                         //   address: data.description,
//                         //   currentLat: details.geometry.location.lat,
//                         //   currentLng: details.geometry.location.lng,
//                         //   region: {
//                         //     latitudeDelta,
//                         //     longitudeDelta,
//                         //     latitude: details.geometry.location.lat,
//                         //     longitude: details.geometry.location.lng,
//                         //   },
//                         // });
//                         // this.searchText.setAddressText('');
//                         // this.goToInitialLocation(this.state.region);
//                       }}
//                       renderRow={rowData => {
//                         const title = rowData.structured_formatting.main_text;
//                         const address =
//                           rowData.structured_formatting.secondary_text;
//                         return (
//                           <View>
//                             <Text style={{fontSize: 14}}>{title}</Text>
//                             <Text style={{fontSize: 14}}>{address}</Text>
//                           </View>
//                         );
//                       }}
//                       renderLeftButton={() => (
//                         <View style={{ padding: 12, 
//                           borderRightColor: resources.colors.appColor, }}>
//                           <Icon
//                             name="search"
//                             size={20}
//                             color={resources.colors.appColor}
//                             type="ionicon"
//                           />
//                         </View>
//                       )}
//                       textInputProps={{
//                         onChangeText: text => {
//                           // this.setState({listViewDisplayed: true});
//                         },
//                         paddingTop: 15,
//                         placeholderTextColor: resources.colors.labelColor,
//                       }}
//                       getDefaultValue={() => {
//                         return ''; // text input default value
//                       }}
//                       query={{
//                         key: MapAPIKey,
//                         language: 'en', // language of the results
//                         components: 'country:ind',
//                       }}
//                       styles={{
//                         textInputContainer: {
//                           backgroundColor: '#fff',
//                           height: 52,
//                           // borderColor: resources.colors.appColor,
//                           // borderWidth: 1,
//                           borderRadius: 4,
//                           // marginHorizontal: 15,
//                           paddingTop: 2,
//                           shadowColor: 'gba(0, 0, 0, 0.8)', // IOS
//                           shadowOffset: {height: 1, width: 1}, // IOS
//                           shadowOpacity: 0.6, // IOS
//                           shadowRadius: 2, //IOS
//                           elevation: 6, // Android
//                         },
//                         textInput: {
//                           borderRadius: 20,
//                           height: 38,
//                           color: '#5d5d5d',
//                           fontSize: 16,
//                         },
//                         description: {
//                           color: 'black',
//                           fontSize: 12,
//                         },
//                         predefinedPlacesDescription: {
//                           color: 'black',
//                         },
//                         listView: {
//                           zIndex: 999,
//                           flex: 1,
//                           position: isPlatformIOS ? '' : 'absolute',
//                           marginTop: isPlatformIOS ? 0 : 48,
//                           marginHorizontal: 2,
//                           borderColor: resources.colors.appColor,
//                           borderBottomWidth: isPlatformIOS ? 1 : 2,
//                           backgroundColor: resources.colors.white,
//                           borderBottomLeftRadius: 8,
//                           borderBottomRightRadius: 8,
//                           shadowColor: 'rgba(0,0,0, .9)', // IOS
//                           shadowOffset: {height: 1, width: 1}, // IOS
//                           shadowOpacity: 1, // IOS
//                           // shadowRadius: 1, //IOS
//                           elevation: 2, // Android
//                           paddingRight: 15,
//                         },
//                       }}
//                       nearbyPlacesAPI="GooglePlacesSearch"
//                       GooglePlacesSearchQuery={{
//                         rankby: 'distance',
//                         types: 'building',
//                       }}
//                       filterReverseGeocodingByTypes={[
//                         'locality',
//                         'administrative_area_level_3',
//                       ]}
//                       debounce={200}
//                     />
//   );
};

export default GooglePlacesInput;