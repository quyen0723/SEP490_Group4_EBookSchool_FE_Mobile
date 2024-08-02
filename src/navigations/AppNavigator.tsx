import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import {NavigationContainer, RouteProp} from '@react-navigation/native';
import Splash from '../screens/Splash';
import Login from '../screens/Login';
import Home from '../screens/Home';
import ButtonTab from './ButtonTab';
import {RootNavigationProps} from '../screens/types';
import Profile from '../screens/Profile';
import Notification from '../screens/Notification';
import NotificationDetail from '../screens/NotificationDetail';
import WeeklyTimeTable from '../screens/WeeklyTimeTable';
import Attendance from '../screens/Attendance';
import Score from '../screens/ScoreMain';
import Calculate from '../screens/Calculate';
// import ButtonTopTab from './ButtonTopTab';
import ScoreMain from '../screens/ScoreMain';
import DetailScoreFirstYearOne from '../screens/DetailScoreFirstYearOne';
import DetailAttendanceFirst from '../screens/DetailAttendanceFirst';
import DetailAttendanceSubject from '../screens/DetailAttendanceSubject';
import WeeklyTimeTableMain from '../screens/WeeklyTimeTableMain';
import DetailAttendanceTeacher from '../screens/DetailAttendanceTeacher';
import {colors} from '../assets/css/colors';

const Stack = createStackNavigator<RootNavigationProps>();

const CustomHeader = ({navigation, route, title}) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Image
        style={styles.image}
        source={require('../assets/images/icons/Back.png')}
      />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>{title || route.name}</Text>
    <View style={{flex: 1}} />
  </View>
);

const screenOptions = ({navigation, route}) => ({
  headerShown: true,
  header: ({options}) => (
    <CustomHeader
      navigation={navigation}
      route={route}
      title={options.title || route.name}
    />
  ),
  headerStyle: {
    backgroundColor: colors.primaryColor,
    elevation: 5,
  },
  headerTitleStyle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  headerTintColor: '#FFFFFF',
});

const AppNavigator = ({initialRouteName}: {initialRouteName: string}) => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={screenOptions}>
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
        <Stack.Screen
          name="WeeklyTimeTableMain"
          component={WeeklyTimeTableMain} // Add the Profile component as a screen
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Attendance"
          component={Attendance} // Add the Profile component as a screen
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ScoreMain"
          component={ScoreMain} // Add the Profile component as a screen
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Calculate"
          component={Calculate} // Add the Profile component as a screen
          options={{headerShown: true, title: 'Tính điểm'}}
        />
        <Stack.Screen
          name="DetailScoreFirstYearOne"
          component={DetailScoreFirstYearOne} // Add the Profile component as a screen
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DetailAttendanceFirst"
          component={DetailAttendanceFirst} // Add the Profile component as a screen
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DetailAttendanceSubject"
          component={DetailAttendanceSubject} // Add the Profile component as a screen
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DetailAttendanceTeacher"
          component={DetailAttendanceTeacher} // Add the Profile component as a screen
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    backgroundColor: colors.primaryColor,
    elevation: 5,
    paddingHorizontal: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 120,
    color: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 27,
    height: 27,
    tintColor: '#FFFFFF',
  },
});
