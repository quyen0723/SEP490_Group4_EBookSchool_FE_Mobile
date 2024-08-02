// import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
// import React, {useEffect} from 'react';
// import {StackNavigationProp} from '@react-navigation/stack';
// import {RootNavigationProps} from './types';
// import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
// import {colors} from '../assets/css/colors';
// import ScoreThirdYear from './ScoreThirdYear';
// import ScoreFourthYear from './ScoreFourthYear';
// import ScoreSecondYear from './ScoreSecondYear';
// import ScoreFirstYear from './ScoreFirstYear';
// import AttendanceFirstYear from './AttendanceFirstYear';

// const Tab = createMaterialTopTabNavigator();

// interface MyProps {
//   navigation: StackNavigationProp<RootNavigationProps, 'ScoreMain'>;
//   route: any;
// }

// const Attendance = ({navigation}: MyProps) => {
//   useEffect(() => {
//     navigation.setOptions({
//       title: 'Điểm danh',
//       headerLeft: () => (
//         // <Button onPress={() => navigation.goBack()} title="Go Back" />
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Image
//             style={styles.imge}
//             source={require('../assets/images/icons/Back.png')}
//           />
//         </TouchableOpacity>
//       ),
//     });
//   }, [navigation]);
//   return (
//     <View style={{flex: 1, backgroundColor: colors.whiteColor}}>
//       <View
//         style={{
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//           // padding: 10,
//         }}></View>
//       <Tab.Navigator
//         screenOptions={{
//           tabBarScrollEnabled: true,
//           tabBarItemStyle: {
//             marginHorizontal: 2, // Khoảng cách giữa các tab
//             borderRadius: 10, // Bo góc cho mỗi tab
//             width: 120,
//           },
//           tabBarStyle: {
//             backgroundColor: '#F2F2F2', // Màu nền của thanh tab
//             elevation: 0,
//           },
//           tabBarLabelStyle: {
//             fontWeight: 'bold',
//             fontSize: 15, // Kích thước chữ
//             textTransform: 'none', // Không viết hoa chữ
//           },
//           tabBarIndicatorStyle: {
//             height: 0, // Loại bỏ chỉ báo của tab được chọn
//           },
//           tabBarActiveTintColor: 'orange', // Màu của tab được chọn
//           tabBarInactiveTintColor: 'black', // Màu của tab không được chọn
//         }}>
//         <Tab.Screen
//           name="AttendanceFirstYear"
//           component={AttendanceFirstYear}
//           options={{
//             tabBarLabel: ({focused}) => (
//               <View style={[styles.tabItem, focused && styles.tabItemFocused]}>
//                 <Text style={{color: focused ? 'white' : 'black'}}>
//                   Điểm danh 1
//                 </Text>
//               </View>
//             ),
//           }}
//         />
//         <Tab.Screen
//           name="ScoreSecondYear"
//           component={ScoreSecondYear}
//           options={{
//             tabBarLabel: ({focused}) => (
//               <View style={[styles.tabItem, focused && styles.tabItemFocused]}>
//                 <Text style={{color: focused ? 'white' : 'black'}}>
//                   Second Year
//                 </Text>
//               </View>
//             ),
//           }}
//         />
//         <Tab.Screen
//           name="ScoreFourthYear"
//           component={ScoreFourthYear}
//           options={{
//             tabBarLabel: ({focused}) => (
//               <View style={[styles.tabItem, focused && styles.tabItemFocused]}>
//                 <Text style={{color: focused ? 'white' : 'black'}}>
//                   Fourth Year
//                 </Text>
//               </View>
//             ),
//           }}
//         />
//         <Tab.Screen
//           name="ScoreThirdYear"
//           component={ScoreThirdYear}
//           options={{
//             tabBarLabel: ({focused}) => (
//               <View style={[styles.tabItem, focused && styles.tabItemFocused]}>
//                 <Text style={{color: focused ? 'white' : 'black'}}>
//                   Third Year
//                 </Text>
//               </View>
//             ),
//           }}
//         />
//       </Tab.Navigator>
//     </View>
//   );
// };

// export default Attendance;

// const styles = StyleSheet.create({
//   imge: {
//     width: 27,
//     height: 27,
//     tintColor: '#FFFFFF',
//     marginLeft: 10,
//   },
//   tabItem: {
//     backgroundColor: 'white',
//     borderRadius: 10,
//     padding: 10,
//   },
//   tabItemFocused: {
//     backgroundColor: colors.primaryColor,
//   },
// });

import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootNavigationProps} from './types';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {colors} from '../assets/css/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AttendanceFirstYear from './AttendanceFirstYear';
import ScoreSecondYear from './ScoreSecondYear';
import ScoreThirdYear from './ScoreThirdYear';
import ScoreFourthYear from './ScoreFourthYear';
import DetailAttendanceFirst from './DetailAttendanceFirst';
import DetailAttendanceTeacher from './DetailAttendanceTeacher';
import Loader from '../components/Loader';
import {useFocusEffect} from '@react-navigation/native';

const Tab = createMaterialTopTabNavigator();

interface MyProps {
  navigation: StackNavigationProp<RootNavigationProps, 'ScoreMain'>;
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
            Alert.alert('Error', 'No school years or roles data found');
          }
        } catch (error) {
          console.error('Error fetching school years or roles', error);
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
    const isStudent = userRoles.includes('Student');
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
        // <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        //   <Text>Loading...</Text>
        // </View>
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
