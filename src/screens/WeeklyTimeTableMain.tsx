import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootNavigationProps} from './types';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Notification from './Notification';
import ScoreFirstYear from './ScoreFirstYear';
import ScoreSecondYear from './ScoreSecondYear';
import {colors} from '../assets/css/colors';
import ScoreThirdYear from './ScoreThirdYear';
import ScoreFourthYear from './ScoreFourthYear';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WeeklyTimeTable from './WeeklyTimeTable';

const Tab = createMaterialTopTabNavigator();

interface MyProps {
  navigation: StackNavigationProp<RootNavigationProps, 'WeeklyTimeTableMain'>;
  route: any;
}

const WeeklyTimeTableMain = ({navigation, route}: MyProps) => {
  const [schoolYears, setSchoolYears] = useState<string[]>([]);

  useEffect(() => {
    const fetchSchoolYears = async () => {
      try {
        const schoolYearsString = await AsyncStorage.getItem('userSchoolYears');
        if (schoolYearsString) {
          setSchoolYears(JSON.parse(schoolYearsString));
        } else {
          Alert.alert('Error', 'No school years data found');
        }
      } catch (error) {
        console.error('Error fetching school years', error);
        Alert.alert('Error', 'An error occurred while fetching school years');
      }
    };

    fetchSchoolYears();
  }, []);

  // useEffect(() => {
  //   navigation.setOptions({
  //     title: 'Thời khóa biểu',
  //     headerLeft: () => (
  //       <TouchableOpacity onPress={() => navigation.goBack()}>
  //         <Image
  //           style={styles.imge}
  //           source={require('../assets/images/icons/Back.png')}
  //         />
  //       </TouchableOpacity>
  //     ),
  //   });
  // }, [navigation]);

  const renderTabs = () => {
    return schoolYears.map((year, index) => (
      <Tab.Screen
        key={index}
        name={`Year${index}`}
        component={WeeklyTimeTable} // Change this to the relevant component for each year
        initialParams={{year}}
        options={{
          tabBarLabel: ({focused}) => (
            <View style={[styles.tabItem, focused && styles.tabItemFocused]}>
              <Text style={{color: focused ? 'white' : 'black'}}>{year}</Text>
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
          // padding: 10,
        }}></View>
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
          screenOptions={{
            tabBarScrollEnabled: true,
            tabBarItemStyle: {
              marginHorizontal: 2, // Khoảng cách giữa các tab
              borderRadius: 10, // Bo góc cho mỗi tab
              width: 120,
            },
            tabBarStyle: {
              backgroundColor: '#F2F2F2', // Màu nền của thanh tab
              elevation: 0,
            },
            tabBarLabelStyle: {
              fontWeight: 'bold',
              fontSize: 15, // Kích thước chữ
              textTransform: 'none', // Không viết hoa chữ
            },
            tabBarIndicatorStyle: {
              height: 0, // Loại bỏ chỉ báo của tab được chọn
            },
            tabBarActiveTintColor: 'orange', // Màu của tab được chọn
            tabBarInactiveTintColor: 'black', // Màu của tab không được chọn
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

export default WeeklyTimeTableMain;

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
