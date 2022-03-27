import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import color from './src/theme/colors';

import CalendarScreen from './src/screens/CalendarScreen.js';
import StatsScreen from './src/screens/StatsScreen';
import GoalsScreen from './src/screens/GoalsScreen.js';
import OptionsScreen from './src/screens/OptionsScreen';
import TimerScreen from './src/screens/TimerScreen.js';
import AddExerciseScreen from './src/screens/AddExerciseScreen.js';


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
    Calendar: {screen: CalendarScreen, name: "Calendar"},
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
export const stackNavigator = createStackNavigator({
    mainFlow: mainFlowNav,
    AddExercise : AddExerciseScreen
  }, {headerMode: 'none'});