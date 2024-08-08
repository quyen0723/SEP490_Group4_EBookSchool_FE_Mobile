import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Attendance from '../screens/Attendance';
import Calculate from '../screens/Calculate';
import Login from '../screens/Login';
import Notification from '../screens/Notification';
import NotificationDetail from '../screens/NotificationDetail';
import Profile from '../screens/Profile';
import Splash from '../screens/Splash';
import {RootNavigationProps} from '../screens/types';
import WeeklyTimeTable from '../screens/WeeklyTimeTable';
import ButtonTab from './ButtonTab';
import {colors} from '../assets/css/colors';
import DetailAttendanceFirst from '../screens/DetailAttendanceFirst';
import DetailAttendanceSubject from '../screens/DetailAttendanceSubject';
import DetailAttendanceTeacher from '../screens/DetailAttendanceTeacher';
import DetailScoreFirstYearOne from '../screens/DetailScoreFirstYearOne';
import ScoreMain from '../screens/ScoreMain';
import WeeklyTimeTableMain from '../screens/WeeklyTimeTableMain';

const Stack = createStackNavigator<RootNavigationProps>();

const CustomHeader = ({
  navigation,
  route,
  title,
}: {
  navigation: any;
  route: any;
  title: any;
}) => (
  <View style={styles.header}>
    <TouchableOpacity
      style={styles.backButton}
      onPress={() => navigation.goBack()}>
      <Image
        style={styles.image}
        source={require('../assets/images/icons/Back.png')}
      />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>{title || route.name}</Text>
  </View>
);

const screenOptions = ({navigation, route}: {navigation: any; route: any}) => ({
  headerShown: true,
  header: ({options}: {options: any}) => (
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
  },
  headerTitleAlign: 'center',
  headerTintColor: '#FFFFFF',
});

const AppNavigator = ({initialRouteName}: {initialRouteName: string}) => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRouteName as keyof RootNavigationProps}
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
          component={WeeklyTimeTable as any} // Add the Profile component as a screen
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
          options={{headerShown: true, title: 'Điểm'}}
        />
        <Stack.Screen
          name="Calculate"
          component={Calculate as any} // Add the Profile component as a screen
          options={{headerShown: true, title: 'Tính điểm'}}
        />
        <Stack.Screen
          name="DetailScoreFirstYearOne"
          component={DetailScoreFirstYearOne as any} // Add the Profile component as a screen
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DetailAttendanceFirst"
          component={DetailAttendanceFirst as any} // Add the Profile component as a screen
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DetailAttendanceSubject"
          component={DetailAttendanceSubject as any} // Add the Profile component as a screen
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DetailAttendanceTeacher"
          component={DetailAttendanceTeacher as any} // Add the Profile component as a screen
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
    color: 'white',
    textAlign: 'center',
    // position: 'absolute',
    left: 0,
    right: 0,
  },
  backButton: {
    position: 'absolute',
    left: 10,
  },
  image: {
    width: 27,
    height: 27,
    tintColor: '#FFFFFF',
  },
});
