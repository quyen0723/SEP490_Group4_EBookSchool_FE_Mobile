import {View, TouchableOpacity, Image, StyleSheet, Text} from 'react-native';
import React, {useEffect} from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootNavigationProps} from './types';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Notification from './Notification';
import ScoreFirstYear from './ScoreFirstYear';
import ScoreSecondYear from './ScoreSecondYear';
import {colors} from '../assets/css/colors';
import ScoreThirdYear from './ScoreThirdYear';
import ScoreFourthYear from './ScoreFourthYear';

const Tab = createMaterialTopTabNavigator();

interface MyProps {
  navigation: StackNavigationProp<RootNavigationProps, 'ScoreMain'>;
  route: any;
}

const ScoreMain = ({navigation, route}: MyProps) => {
  useEffect(() => {
    navigation.setOptions({
      title: 'Điểm',
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

  return (
    <View style={{flex: 1, backgroundColor: colors.whiteColor}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          // padding: 10,
        }}></View>
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
        <Tab.Screen
          name="ScoreFirstYear"
          component={ScoreFirstYear}
          options={{
            tabBarLabel: ({focused}) => (
              <View style={[styles.tabItem, focused && styles.tabItemFocused]}>
                <Text style={{color: focused ? 'white' : 'black'}}>
                  2023 - 2024
                </Text>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="ScoreSecondYear"
          component={ScoreSecondYear}
          options={{
            tabBarLabel: ({focused}) => (
              <View style={[styles.tabItem, focused && styles.tabItemFocused]}>
                <Text style={{color: focused ? 'white' : 'black'}}>
                  Second Year
                </Text>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="ScoreFourthYear"
          component={ScoreFourthYear}
          options={{
            tabBarLabel: ({focused}) => (
              <View style={[styles.tabItem, focused && styles.tabItemFocused]}>
                <Text style={{color: focused ? 'white' : 'black'}}>
                  Fourth Year
                </Text>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="ScoreThirdYear"
          component={ScoreThirdYear}
          options={{
            tabBarLabel: ({focused}) => (
              <View style={[styles.tabItem, focused && styles.tabItemFocused]}>
                <Text style={{color: focused ? 'white' : 'black'}}>
                  Third Year
                </Text>
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

export default ScoreMain;

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
