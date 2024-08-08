import AsyncStorage from '@react-native-async-storage/async-storage';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../assets/css/colors';
import {TabProvider, useTab} from '../components/TabContext';
import {RootNavigationProps, TimeTableData} from './types';
import WeeklyTimeTable from './WeeklyTimeTable';

const Tab = createMaterialTopTabNavigator();

interface MyProps {
  navigation: StackNavigationProp<RootNavigationProps, 'WeeklyTimeTableMain'>;
  // route: any;
  route: RouteProp<RootNavigationProps, 'WeeklyTimeTableMain'>;
}

const WeeklyTimeTableMain: React.FC<MyProps> = ({navigation, route}) => {
  const [schoolYears, setSchoolYears] = useState<string[]>([]);
  const {setCurrentTab, currentTab} = useTab();
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const timeTableData: TimeTableData = route.params?.timeTableData;

  console.log('LLLLLLLLL', timeTableData);
  const fetchSchoolYears = useCallback(async () => {
    try {
      const schoolYearsString = await AsyncStorage.getItem('userSchoolYears');
      console.log('WMAIN: ' + schoolYearsString);
      if (schoolYearsString) {
        const schoolYearsArray = JSON.parse(schoolYearsString);
        setSchoolYears(schoolYearsArray);
        console.log('WMAIN: ' + schoolYearsArray);
        if (schoolYearsArray.length > 0 && !currentTab) {
          setCurrentTab(schoolYearsArray[0]);
          console.log('WMAIN: ' + schoolYearsArray[0]);
        }
      } else {
        Alert.alert('Error', 'No school years data found');
      }
    } catch (error) {
      console.error('Error fetching school years', error);
      Alert.alert('Error', 'An error occurred while fetching school years');
    }
    // }, [currentTab, setCurrentTab]);
  }, [setCurrentTab]);

  useEffect(() => {
    fetchSchoolYears();

    navigation.setOptions({
      title: 'Thời khóa biểu',
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={styles.imge}
            source={require('../assets/images/icons/Back.png')}
          />
        </TouchableOpacity>
      ),
    });
  }, [fetchSchoolYears, navigation]);

  useEffect(() => {
    fetchSchoolYears();
  }, [fetchSchoolYears]);

  useEffect(() => {
    if (route.name !== 'WeeklyTimeTableMain') {
      navigation.setOptions({
        headerShown: false, // Ẩn header khi điều hướng từ Drawer.Navigator
      });
    }
  }, [navigation, route.name]);

  const renderTabs = () => {
    return schoolYears.map((year, index) => (
      <Tab.Screen
        key={index}
        name={`Year${index}`}
        component={WeeklyTimeTable}
        initialParams={{year, timeTableData}}
        listeners={{
          focus: () => {
            setCurrentTab(year);
            if (!initialLoad) {
              fetchSchoolYears();
            }
          },
        }}
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

  useEffect(() => {
    setInitialLoad(false); // Set initialLoad to false after the first load
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: colors.whiteColor}}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={styles.imge}
            source={require('../assets/images/icons/Back.png')}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thời khóa biểu</Text>
        <View style={{flex: 1}} />
      </View>
      {schoolYears.length > 0 ? (
        <Tab.Navigator
          initialRouteName={schoolYears.length > 0 ? `Year0` : undefined}
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
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>Loading...</Text>
        </View>
      )}
    </View>
  );
};

const WrappedWeeklyTimeTableMain: React.FC<MyProps> = props => {
  return (
    <TabProvider>
      <WeeklyTimeTableMain {...props} />
    </TabProvider>
  );
};

export default WrappedWeeklyTimeTableMain;

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 70,
    color: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    backgroundColor: colors.primaryColor,
    elevation: 5,
    paddingHorizontal: 10,
  },
  imge: {
    width: 27,
    height: 27,
    tintColor: '#FFFFFF',
    marginLeft: 10,
  },
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
