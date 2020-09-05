import React from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';

import CalendarScreen from './src/screens/CalendarScreen.js';
import OptionsScreen from './src/screens/OptionsScreen';
import StatsScreen from './src/screens/StatsScreen';
import AddExerciseScreen from './src/screens/AddExerciseScreen.js';


import {Provider as WeatherProvider} from './src/context/weatherContext';
import {Provider as ExerciseProvider} from './src/context/exerciseContext';

const switchNavigator = createSwitchNavigator({
  mainFlow: createBottomTabNavigator({
    Calendar: CalendarScreen,
    Options: OptionsScreen,
    Stats: StatsScreen
  }),
  AddExercise : AddExerciseScreen
});

const App = createAppContainer(switchNavigator);

export default () =>{
  return (
    <ExerciseProvider>
      <WeatherProvider>
        <App />
      </WeatherProvider>
    </ExerciseProvider>
  );
}