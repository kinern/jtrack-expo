import React from 'react';
import {createAppContainer} from 'react-navigation';
import {stackNavigator} from './src/navigation/navigator';
import { store } from './src/store';
import { Provider } from 'react-redux';

import { useFonts, Roboto_400Regular,  Roboto_700Bold} from '@expo-google-fonts/roboto';
import { Lato_400Regular } from '@expo-google-fonts/lato';


const App = createAppContainer(stackNavigator);


export default () =>{

  let [fontsLoaded] = useFonts({
    Roboto_400Regular,  
    Roboto_700Bold, 
    Lato_400Regular
  });

  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}