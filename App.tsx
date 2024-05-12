/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {createStackNavigator} from '@react-navigation/stack';
import React, {useState} from 'react';
import type {PropsWithChildren} from 'react';
import {View} from 'react-native';

import AppNavigator from './src/navigations/AppNavigator';
import ExampleTable from './src/screens/ExampleTable';

export type RootStackParamsList = {
  Home: undefined;
  Settings: {
    name: string;
    email: string;
  };
};

const Stack = createStackNavigator<RootStackParamsList>();

const App = () => {
  return (
    // <NavigationContainer>
    //   <Stack.Navigator>
    //     <Stack.Screen name="Home" component={Home} />
    //     <Stack.Screen name="Settings" component={Settings} />
    //   </Stack.Navigator>
    // </NavigationContainer>
    <View style={{flex: 1}}>
      <AppNavigator />
      {/* <ExampleTable /> */}
    </View>
  );
};

//const styles = StyleSheet.create({});

export default App;
