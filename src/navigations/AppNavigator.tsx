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
import Attendance from '../screens/Attendance';
import Score from '../screens/ScoreMain';
import Exam from '../screens/Exam';
import ButtonTopTab from './ButtonTopTab';
import ScoreMain from '../screens/ScoreMain';
import DetailScoreFirstYearOne from '../screens/DetailScoreFirstYearOne';
import DetailAttendanceFirst from '../screens/DetailAttendanceFirst';
import DetailAttendanceSubject from '../screens/DetailAttendanceSubject';
import WeeklyTimeTableMain from '../screens/WeeklyTimeTableMain';
import WeeklyTimeTableTeacher from '../screens/WeeklyTimeTableTeacher';

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
        {/* <Stack.Screen
          name="ButtonTopTab"
          component={ButtonTopTab}
          options={{headerShown: false}}
        /> */}
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
          name="WeeklyTimeTableTeacher"
          component={WeeklyTimeTableTeacher} // Add the Profile component as a screen
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
          name="Exam"
          component={Exam} // Add the Profile component as a screen
          options={{headerShown: false}}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
