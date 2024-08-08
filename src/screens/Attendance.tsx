import AsyncStorage from '@react-native-async-storage/async-storage';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useFocusEffect} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {colors} from '../assets/css/colors';
import Loader from '../components/Loader';
import DetailAttendanceFirst from './DetailAttendanceFirst';
import DetailAttendanceTeacher from './DetailAttendanceTeacher';
import {RootNavigationProps} from './types';

const Tab = createMaterialTopTabNavigator();

interface MyProps {
  navigation: StackNavigationProp<RootNavigationProps, 'Attendance'>;
  route: any;
}

const Attendance = ({navigation}: MyProps) => {
  const [schoolYears, setSchoolYears] = useState<string[]>([]);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      const fetchSchoolYearsAndRoles = async () => {
        setLoading(true);
        try {
          const schoolYearsString = await AsyncStorage.getItem(
            'userSchoolYears',
          );
          const rolesString = await AsyncStorage.getItem('userRoles');
          if (schoolYearsString && rolesString) {
            setSchoolYears(JSON.parse(schoolYearsString));
            setUserRoles(JSON.parse(rolesString));
          } else {
            // Alert.alert('Error', 'No school years or roles data found');
          }
        } catch (error) {
          console.log('Error fetching school years or roles', error);
          // Alert.alert('Error', 'An error occurred while fetching data');
        } finally {
          setLoading(false);
        }
      };

      fetchSchoolYearsAndRoles();
    }, [navigation]),
  );
  useEffect(() => {
    navigation.setOptions({
      title: 'Điểm danh',
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={styles.image}
            source={require('../assets/images/icons/Back.png')}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const renderTabs = () => {
    const isStudent =
      userRoles.includes('Student') || userRoles.includes('Parent');
    return schoolYears.map((year, index) => (
      <Tab.Screen
        key={index}
        name={`Year${index}`}
        component={isStudent ? DetailAttendanceFirst : DetailAttendanceTeacher}
        initialParams={{year}}
        options={{
          tabBarLabel: ({focused}) => (
            <View style={[styles.tabItem, focused && styles.tabItemFocused]}>
              <Text
                style={{
                  color: focused ? 'white' : 'black',
                  fontWeight: 'bold',
                }}>
                {year}
              </Text>
            </View>
          ),
        }}
      />
    ));
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.whiteColor}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      />
      {schoolYears.length > 0 ? (
        <Tab.Navigator
          screenOptions={{
            tabBarScrollEnabled: true,
            tabBarItemStyle: {
              marginHorizontal: 2,
              borderRadius: 10,
              width: 120,
            },
            tabBarStyle: {
              backgroundColor: '#F2F2F2',
              elevation: 0,
            },
            tabBarLabelStyle: {
              fontWeight: 'bold',
              fontSize: 15,
              textTransform: 'none',
            },
            tabBarIndicatorStyle: {
              height: 0,
            },
            tabBarActiveTintColor: 'orange',
            tabBarInactiveTintColor: 'black',
          }}>
          {renderTabs()}
        </Tab.Navigator>
      ) : (
        <Loader visible={loading} />
      )}
    </View>
  );
};

export default Attendance;

const styles = StyleSheet.create({
  image: {
    width: 27,
    height: 27,
    tintColor: '#FFFFFF',
    marginLeft: 10,
  },
  tabItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
  },
  tabItemFocused: {
    backgroundColor: colors.primaryColor,
  },
});
