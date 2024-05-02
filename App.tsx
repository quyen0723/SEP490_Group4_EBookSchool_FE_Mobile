/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {createStackNavigator} from '@react-navigation/stack';
import React, {useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
  SectionList,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import AppNavigator from './src/screens/AppNavigator';

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
    </View>
  );
};

//const styles = StyleSheet.create({});

export default App;
