import React from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';

//Main Navigation Flow Screens
import CalendarScreen from './src/screens/CalendarScreen.js';
import StatsScreen from './src/screens/StatsScreen';
import GoalsScreen from './src/screens/GoalsScreen.js';
import OptionsScreen from './src/screens/OptionsScreen';
import TimerScreen from './src/screens/TimerScreen.js';

//Other Screens
import AddExerciseScreen from './src/screens/AddExerciseScreen.js';

import {Provider as WeatherProvider} from './src/context/weatherContext';
import {Provider as ExerciseProvider} from './src/context/exerciseContext';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import color from './src/theme/colors';


//Keys are routeNames, values are MCIcon names.
const tabIconNames = {
  'Calendar': 'calendar-month',
  'Options': 'cogs',
  'Stats': 'chart-line',
  'Goals': 'bullseye-arrow',
  'Timer': 'timer'
}

/*
Main bottom tab navigator.
Loads the CalendarScreen, OptionsScreen and StatsScreen components.
*/
const mainFlowNav = createBottomTabNavigator({
  Calendar: CalendarScreen,
  Stats: StatsScreen,
  Timer: TimerScreen,
  Goals: GoalsScreen,
  Options: OptionsScreen
}, {
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarIcon: ({focused, horizontal, tintColor})=>{
      const {routeName} = navigation.state;
      const name = (routeName)? tabIconNames[routeName]: 'calendar';
      return (
        <Icon name={name} size={30} color={tintColor} />
      );
    }
  }),
  tabBarOptions: {
    showLabel: false,
    activeTintColor: color.medium,
    inactiveTintColor: color.inactiveLight,
    labelStyle: {
      fontSize: 18,
      marginBottom: 10,
    },
    style: {
      borderColor: color.inactiveLight,
      backgroundColor: color.highlight,
    }
  }
});


//Adds the AddExerciseScreen component to the navigation flow.
const switchNavigator = createSwitchNavigator({
  mainFlow: mainFlowNav,
  AddExercise : AddExerciseScreen
});


const App = createAppContainer(switchNavigator);


/*
Providers made with createDataContext() are parent components of App.
This way, the related state object and reducer action functions can be called
from any child component by calling useContext().
*/
export default () =>{
  return (
    <ExerciseProvider>
      <WeatherProvider>
        <App />
      </WeatherProvider>
    </ExerciseProvider>
  );
}