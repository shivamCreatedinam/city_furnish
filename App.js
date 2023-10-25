import React, {Component, useEffect, useRef} from 'react';
import AppNavigation from './app/src/appnavigation/AppNavigation';
import {Provider} from 'react-redux';
import Store from './app/src/redux/store/Store';
import FlashMessage from 'react-native-flash-message';
import messaging from '@react-native-firebase/messaging';
console.disableYellowBox = true

const App = () => {
  const myLocalFlashMessage = useRef();

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    const enabled = await messaging().requestPermission();
    if (enabled) {
    } else {
      try {
        await messaging().requestPermission();
      } catch (error) {}
    }
  };

  return (
    <Provider store={Store}>
      <AppNavigation />
      <FlashMessage position="top" ref={myLocalFlashMessage} />
    </Provider>
  );
};

export default App;
