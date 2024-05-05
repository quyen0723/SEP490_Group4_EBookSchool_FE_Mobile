import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
import Notification from '../screens/Notification';
import Profile from '../screens/Profile';
import {colors} from '../assets/css/colors';

import IMAGES from '../assets/images';
import {Image, StyleSheet, View} from 'react-native';

const BottomTab = createBottomTabNavigator();

const ButtonTab = ({navigation}: {navigation: any}) => {
  return (
    <BottomTab.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        tabBarLabel: '',
        headerStyle: {
          backgroundColor: colors.primaryColor,
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontSize: 25,
          fontWeight: 'bold',
        },
      }}>
      <BottomTab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <Image
              source={require('../assets/images/icons/Home.png')}
              style={{
                height: 30,
                width: 30,
                tintColor: focused ? colors.primaryColor : 'black',
              }}
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="Thông báo"
        component={Notification}
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              source={require('../assets/images/icons/Chat.png')}
              style={{
                height: 30,
                width: 30,
                tintColor: focused ? colors.primaryColor : 'black',
              }}
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="Hồ sơ"
        component={Profile}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={[styles.tabBarItem, focused && styles.focusedTab]}>
              <Image
                source={require('../assets/images/icons/Profile.png')}
                style={{
                  height: 30,
                  width: 30,
                  tintColor: focused ? 'blue' : 'black',
                }}
              />
            </View>
          ),
        }}
      />
    </BottomTab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 50,
    backgroundColor: 'white', // Set your desired background color
    borderTopWidth: 1,
    borderTopColor: 'lightgray', // Set your desired border color
  },
  tabBarItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  focusedTab: {
    backgroundColor: 'red',
    borderRadius: 100, // Set a large value to make it circular
    padding: 5, // Adjust the padding according to your preference
  },
});

export default ButtonTab;
