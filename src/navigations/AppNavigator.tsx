import {View, Text} from 'react-native';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import Splash from '../screens/Splash';
import Login from '../screens/Login';
import Home from '../screens/Home';
import ButtonTab from './ButtonTab';
import {RootNavigationProps} from '../screens/types';
import Profile from '../screens/Profile';
import Notification from '../screens/Notification';
import NotificationDetail from '../screens/NotificationDetail';
import WeeklyTimeTable from '../screens/WeeklyTimeTable';

const Stack = createStackNavigator<RootNavigationProps>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="HomeMain"
          component={ButtonTab}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Profile"
          component={Profile} // Add the Profile component as a screen
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Notification"
          component={Notification} // Add the Profile component as a screen
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="NotificationDetail"
          component={NotificationDetail} // Add the Profile component as a screen
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="WeeklyTimeTable"
          component={WeeklyTimeTable} // Add the Profile component as a screen
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
