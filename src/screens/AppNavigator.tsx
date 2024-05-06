import {View, Text} from 'react-native';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import Splash from './Splash';
import Login from './Login';
import Home from './Home';
import ButtonTab from '../navigations/ButtonTab';
import {RootNavigationProps} from './types';
import Profile from './Profile';
import Notification from './Notification';
import NotificationDetail from './NotificationDetail';

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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
