import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import { PermissionsAndroid } from 'react-native';


import Calendar from './screens/CalendarScreen';
import Stats from './screens/StatsScreen';

const Tabs = createBottomTabNavigator();

function App() {

  return (
    <NavigationContainer>
      <Tabs.Navigator initialRouteName="Calendar" 
        screenOptions={{
          headerShown: false,
      }}
      tabBarOptions={{
        showLabel: false,
        activeTintColor: '#a944ab',
        activeBackgroundColor: '#ffffff',
        inactiveTintColor: '#a8bfe6',
        inactiveBackgroundColor: '#ffffff',
        border: 'none',
        style: {
          backgroundColor: 'white',
          shadowColor: 'transparent',
          elevation: 0,
        },
      }}
      
      >
        <Tabs.Screen name="Calendar" options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="calendar-alt" color={color} size={size} />
          ),
        }}
        component={Calendar} />
        <Tabs.Screen name="Stats" options={{
          showLabel: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="chart-bar" color={color} size={size} />
          ),
        }}
        component={Stats} />
      </Tabs.Navigator>
    </NavigationContainer>
  );
}

export default App;