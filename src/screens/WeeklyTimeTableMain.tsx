// import React, {useEffect, useState, useCallback} from 'react';
// import {
//   View,
//   TouchableOpacity,
//   Image,
//   StyleSheet,
//   Text,
//   Alert,
// } from 'react-native';
// import {StackNavigationProp} from '@react-navigation/stack';
// import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {colors} from '../assets/css/colors';
// import {RootNavigationProps} from './types';
// import WeeklyTimeTable from './WeeklyTimeTable';
// import {TabProvider, useTab} from '../components/TabContext';

// const Tab = createMaterialTopTabNavigator();

// interface MyProps {
//   navigation: StackNavigationProp<RootNavigationProps, 'WeeklyTimeTableMain'>;
//   route: any;
// }

// const WeeklyTimeTableMain: React.FC<MyProps> = ({navigation, route}) => {
//   const [schoolYears, setSchoolYears] = useState<string[]>([]);
//   const {setCurrentTab, currentTab} = useTab();
//   const [initialLoad, setInitialLoad] = useState<boolean>(true);

//   const fetchSchoolYears = useCallback(async () => {
//     try {
//       const schoolYearsString = await AsyncStorage.getItem('userSchoolYears');
//       console.log('WMAIN: ' + schoolYearsString);
//       if (schoolYearsString) {
//         const schoolYearsArray = JSON.parse(schoolYearsString);
//         setSchoolYears(schoolYearsArray);
//         console.log('WMAIN: ' + schoolYearsArray);
//         if (schoolYearsArray.length > 0 && !currentTab) {
//           setCurrentTab(schoolYearsArray[0]);
//           console.log('WMAIN: ' + schoolYearsArray[0]);
//         }
//       } else {
//         Alert.alert('Error', 'No school years data found');
//       }
//     } catch (error) {
//       console.error('Error fetching school years', error);
//       Alert.alert('Error', 'An error occurred while fetching school years');
//     }
//     // }, [currentTab, setCurrentTab]);
//   }, [setCurrentTab]);

//   useEffect(() => {
//     fetchSchoolYears();

//     navigation.setOptions({
//       title: 'Thời khóa biểu',
//       headerLeft: () => (
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Image
//             style={styles.imge}
//             source={require('../assets/images/icons/Back.png')}
//           />
//         </TouchableOpacity>
//       ),
//     });
//   }, [fetchSchoolYears, navigation]);

//   useEffect(() => {
//     fetchSchoolYears();
//   }, [fetchSchoolYears]);

//   useEffect(() => {
//     if (route.name !== 'WeeklyTimeTableMain') {
//       navigation.setOptions({
//         headerShown: false, // Ẩn header khi điều hướng từ Drawer.Navigator
//       });
//     }
//   }, [navigation, route.name]);

//   const renderTabs = () => {
//     return schoolYears.map((year, index) => (
//       <Tab.Screen
//         key={index}
//         name={`Year${index}`}
//         component={WeeklyTimeTable}
//         initialParams={{year}}
//         listeners={{
//           focus: () => {
//             setCurrentTab(year);
//             if (!initialLoad) {
//               fetchSchoolYears();
//             }
//           },
//         }}
//         options={{
//           tabBarLabel: ({focused}) => (
//             <View style={[styles.tabItem, focused && styles.tabItemFocused]}>
//               <Text
//                 style={{
//                   color: focused ? 'white' : 'black',
//                   fontWeight: 'bold',
//                 }}>
//                 {year}
//               </Text>
//             </View>
//           ),
//         }}
//       />
//     ));
//   };

//   useEffect(() => {
//     setInitialLoad(false); // Set initialLoad to false after the first load
//   }, []);

//   return (
//     <View style={{flex: 1, backgroundColor: colors.whiteColor}}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Image
//             style={styles.imge}
//             source={require('../assets/images/icons/Back.png')}
//           />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Thời khóa biểu</Text>
//         <View style={{flex: 1}} />
//       </View>
//       {schoolYears.length > 0 ? (
//         <Tab.Navigator
//           initialRouteName={schoolYears.length > 0 ? `Year0` : undefined}
//           screenOptions={{
//             tabBarScrollEnabled: true,
//             tabBarItemStyle: {
//               marginHorizontal: 2,
//               borderRadius: 10,
//               width: 120,
//             },
//             tabBarStyle: {
//               backgroundColor: '#F2F2F2',
//               elevation: 0,
//             },
//             tabBarLabelStyle: {
//               fontWeight: 'bold',
//               fontSize: 15,
//               textTransform: 'none',
//             },
//             tabBarIndicatorStyle: {
//               height: 0,
//             },
//             tabBarActiveTintColor: 'orange',
//             tabBarInactiveTintColor: 'black',
//           }}>
//           {renderTabs()}
//         </Tab.Navigator>
//       ) : (
//         <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//           <Text>Loading...</Text>
//         </View>
//       )}
//     </View>
//   );
// };

// const WrappedWeeklyTimeTableMain: React.FC<MyProps> = props => {
//   return (
//     <TabProvider>
//       <WeeklyTimeTableMain {...props} />
//     </TabProvider>
//   );
// };

// export default WrappedWeeklyTimeTableMain;

// const styles = StyleSheet.create({
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginLeft: 70,
//     color: 'white',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     height: 60,
//     backgroundColor: colors.primaryColor,
//     elevation: 5,
//     paddingHorizontal: 10,
//   },
//   imge: {
//     width: 27,
//     height: 27,
//     tintColor: '#FFFFFF',
//     marginLeft: 10,
//   },
//   image: {
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

import React, {useEffect, useState, useCallback, useMemo} from 'react';
import {View, TouchableOpacity, Image, StyleSheet, Text} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {colors} from '../assets/css/colors';
import {RootNavigationProps} from './types';
import WeeklyTimeTable from './WeeklyTimeTable';
import {TabProvider, useTab} from '../components/TabContext';
import {useSchoolYears} from '../hooks/useSchoolYears';
import {RouteProp} from '@react-navigation/native';

const Tab = createMaterialTopTabNavigator();

interface MyProps {
  navigation: StackNavigationProp<RootNavigationProps, 'WeeklyTimeTableMain'>;
  // route: any;
  route: RouteProp<{params: {year: string; timetableData: any}}, 'params'>;
  // route: RouteProp<
  //   {params: {year: string; semesterId: number; timetableData?: any}},
  //   'params'
  // >;
}

const WeeklyTimeTableMain: React.FC<MyProps> = ({navigation, route}) => {
  const {setCurrentTab, currentTab} = useTab();
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const timetableData = route.params.timetableData;

  const {data: schoolYears, isLoading, isError, error} = useSchoolYears();

  useEffect(() => {
    if (schoolYears && schoolYears.length > 0 && !currentTab) {
      setCurrentTab(schoolYears[0]);
    }
  }, [schoolYears, setCurrentTab, currentTab]);

  useEffect(() => {
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
  }, [navigation]);

  useEffect(() => {
    if (route.name !== 'WeeklyTimeTableMain') {
      navigation.setOptions({
        headerShown: false,
      });
    }
  }, [navigation, route.name]);

  const renderTabs = useCallback(() => {
    return schoolYears?.map((year, index: number) => (
      <Tab.Screen
        key={index}
        name={`Year${index}`}
        component={WeeklyTimeTable}
        initialParams={{year, timetableData}}
        listeners={{
          focus: () => {
            setCurrentTab(year);
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
  }, [schoolYears, setCurrentTab, timetableData]);
  const tabScreens = useMemo(() => renderTabs(), [renderTabs]);
  console.log('MainNNNNNNNNNNNNNNNNNNNNNNNNNn', timetableData);
  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

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
          {/* {renderTabs()} */}
          {tabScreens}
        </Tab.Navigator>
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>No school years available</Text>
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
