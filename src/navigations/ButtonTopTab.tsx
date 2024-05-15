// import React from 'react';
// import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// import HomeMain from '../screens/Home';
// import Notification from '../screens/Notification';
// import Profile from '../screens/Profile';
// import {colors} from '../assets/css/colors';

// import IMAGES from '../assets/images';
// import {Image, StyleSheet, View} from 'react-native';
// import {User} from '../screens/types';
// import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

// const Tab = createMaterialTopTabNavigator();

// const ButtonTopTab = ({navigation, route}: {navigation: any; route: any}) => {
//   const user = route.params?.user;
//   return (
//     <Tab.Navigator
//       screenOptions={{
//         tabBarStyle: {
//           backgroundColor: colors.primaryColor,
//           borderTopRightRadius: 20,
//           borderTopLeftRadius: 20,
//           justifyContent: 'center',
//           alignItems: 'center',
//           flex: 1,
//         },
//         tabBarLabel: () => null,
//       }}>
//       <Tab.Screen
//         name="Home"
//         component={HomeMain}
//         // options={{
//         //   tabBarIcon: ({focused}) => (
//         //     <View style={[styles.tabBarItem, focused && styles.focusedTab]}>
//         //       <Image
//         //         source={require('../assets/images/icons/Home.png')}
//         //         style={{
//         //           height: 27,
//         //           width: 27,
//         //           tintColor: focused ? colors.primaryColor : 'white',
//         //         }}
//         //       />
//         //     </View>
//         //   ),
//         // }}
//       />
//       <Tab.Screen
//         name="Thông báo"
//         component={Notification}
//         // options={{
//         //   tabBarIcon: ({focused}) => (
//         //     <View style={[styles.tabBarItem, focused && styles.focusedTab]}>
//         //       <Image
//         //         source={require('../assets/images/icons/Chat.png')}
//         //         style={{
//         //           height: 27,
//         //           width: 27,
//         //           tintColor: focused ? colors.primaryColor : 'white',
//         //         }}
//         //       />
//         //     </View>
//         //   ),
//         // }}
//       />
//       <Tab.Screen
//         name="Thông tin cá nhân"
//         component={Profile}
//         initialParams={{userId: route.params?.userId}}
//         // options={{
//         //   tabBarIcon: ({focused}) => (
//         //     <View style={[styles.tabBarItem, focused && styles.focusedTab]}>
//         //       <Image
//         //         source={require('../assets/images/icons/Profile.png')}
//         //         style={{
//         //           height: 27,
//         //           width: 27,
//         //           tintColor: focused ? colors.primaryColor : 'white',
//         //         }}
//         //       />
//         //     </View>
//         //   ),
//         // }}
//       />
//     </Tab.Navigator>
//   );
// };

// const styles = StyleSheet.create({
//   tabBar: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     height: 50,
//     backgroundColor: 'white', // Set your desired background color
//     borderTopWidth: 1,
//     borderTopColor: 'lightgray', // Set your desired border color
//   },
//   tabBarItem: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   focusedTab: {
//     backgroundColor: 'white',
//     borderRadius: 100, // Set a large value to make it circular
//     padding: 7, // Adjust the padding according to your preference
//   },
// });

// export default ButtonTopTab;
