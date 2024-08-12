/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {createStackNavigator} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {ActivityIndicator, View} from 'react-native';

import AppNavigator from './src/navigations/AppNavigator';
import ExampleTable from './src/components/ExampleTable';
import DropdownComponent from './src/components/DropdownComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

export type RootStackParamsList = {
  Home: undefined;
  Settings: {
    name: string;
    email: string;
  };
};

const Stack = createStackNavigator<RootStackParamsList>();

const App = () => {
  const [loading, setLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Login');

  useEffect(() => {
    const checkLoginStatus = async () => {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const loginTimestamp = await AsyncStorage.getItem('loginTimestamp');

      if (accessToken && loginTimestamp) {
        const now = new Date().getTime();
        const loginTime = parseInt(loginTimestamp, 10);
        const twoDaysInMilliseconds = 2 * 24 * 60 * 60 * 1000;

        if (now - loginTime <= twoDaysInMilliseconds) {
          setInitialRoute('HomeMain');
        }
      }
      setLoading(false);
    };

    checkLoginStatus();
  }, []);

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  const queryClient = new QueryClient();
  return (
    // <NavigationContainer>
    //   <Stack.Navigator>
    //     <Stack.Screen name="Home" component={Home} />
    //     <Stack.Screen name="Settings" component={Settings} />
    //   </Stack.Navigator>
    // </NavigationContainer>
    <QueryClientProvider client={queryClient}>
      <View style={{flex: 1}}>
        <AppNavigator initialRouteName={initialRoute} />

        {/* <DropdownComponent /> */}
        {/* <ExampleTable /> */}
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </View>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
};

//const styles = StyleSheet.create({});

export default App;
