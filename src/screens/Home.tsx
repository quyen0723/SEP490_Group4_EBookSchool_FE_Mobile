import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  SafeAreaView,
  Alert,
  TextInput,
  Button,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import Splash from './Splash';
import {
  NavigationContainer,
  useIsFocused,
  useRoute,
} from '@react-navigation/native';
import Loader from '../components/Loader';
import {colors} from '../assets/css/colors';
import {
  DrawerNavigationProp,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import {ItemType, SectionType, sections} from '../components/Data';
import {handleLogout} from '../components/Handle';
import ButtonTab from '../navigations/ButtonTab';
import {RootNavigationProps} from './types';
import Profile from './Profile';
import Notification from './Notification';
import {useNavigation} from '@react-navigation/native';
import WeeklyTimeTable from './WeeklyTimeTable';
import Attendance from './Attendance';
import Score from './ScoreMain';
import Exam from './Exam';
// interface MyProps {
//   navigation: StackNavigationProp<RootNavigationProps, 'Home'>;
// }

interface MyProps {
  navigation: DrawerNavigationProp<RootNavigationProps, 'Home'>; // Sử dụng DrawerNavigationProp thay vì StackNavigationProp
}

const renderFlatList = ({
  item,
  navigation,
}: {
  item: SectionType;
  navigation?: MyProps;
}) => (
  <>
    {renderSectionHeader({section: item})}
    <FlatList
      data={item.data}
      renderItem={({item}) => renderItem({item, navigation: navigation!})}
      keyExtractor={item => item.id.toString()}
      numColumns={item.data.length === 1 ? 1 : 2}
      contentContainerStyle={styles.contentContainerStyle}
    />
  </>
);

const handleItemClickAction = ({
  item,
  navigation,
}: {
  item: ItemType;
  navigation?: MyProps;
}) => {
  if (navigation) {
    const itemId = item.id.toString();

    if (itemId === '1') {
      console.log('Item IDĐ:', item.id);
      navigation.navigate('Notification');
    } else if (itemId === '2') {
      navigation.navigate('WeeklyTimeTable');
    } else if (itemId === '3') {
      navigation.navigate('Exam');
    } else if (itemId === '4') {
      navigation.navigate('Attendance');
    } else if (itemId === '5') {
      navigation.navigate('Score');
    } else {
      // Handle other item IDs or show an alert
      console.log('Item ID:', item.id);
    }
  } else {
    console.error('Navigation prop is undefined');
  }
};

const renderSectionHeader = ({section: {title}}: {section: SectionType}) => (
  <View style={styles.sectionContainer}>
    <Text style={styles.sectionHeader}>{title}</Text>
  </View>
);
const renderItem = ({
  item,
  navigation,
}: {
  item: ItemType;
  navigation: MyProps;
}) => {
  const handleItemClick = () => {
    handleItemClickAction({item, navigation});
  };

  return (
    <TouchableOpacity style={styles.item} onPress={handleItemClick}>
      <Image source={item.image} style={styles.img}></Image>
      <Text style={styles.textItem}>{item.title}</Text>
    </TouchableOpacity>
  );
};
function HomeScreen({navigation}: MyProps) {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      {/* <Button onPress={() => navigation.navigate('Login')} title="Logout" /> */}
      <FlatList
        data={sections}
        renderItem={({item}) => renderFlatList({item, navigation})}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

function LogoutScreen({navigation}: MyProps) {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Button onPress={() => handleLogout(navigation)} title="Logout" />
    </View>
  );
}

const Drawer = createDrawerNavigator();

const HomeMain = ({navigation}: MyProps): React.JSX.Element => {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
      {/* <View style={styles.header}> */}
      <Drawer.Navigator
        initialRouteName="E-School"
        screenOptions={{
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: colors.primaryColor,
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontSize: 25,
            fontWeight: 'bold',
          },
        }}>
        <Drawer.Screen
          name="E-School"
          component={HomeScreen}
          initialParams={{navigation}}
        />
        <Drawer.Screen name="Logout" component={LogoutScreen} />
        <Drawer.Screen
          name="Profile"
          component={Profile}
          // initialParams={{user}}
        />
        <Drawer.Screen name="Notification" component={Notification} />
        <Drawer.Screen name="WeeklyTimeTable" component={WeeklyTimeTable} />
        <Drawer.Screen name="Attendance" component={Attendance} />
        <Drawer.Screen name="Score" component={Score} />
        <Drawer.Screen name="Exam" component={Exam} />
      </Drawer.Navigator>
      {/* <ButtonTab navigation={navigation} /> */}
    </SafeAreaView>
  );
};

export default HomeMain;

const styles = StyleSheet.create({
  safeAreaView: {backgroundColor: 'white', flex: 1},
  container: {
    flex: 1,
  },
  header: {
    width: '100%',
    height: 60,
    backgroundColor: colors.primaryColor,
    elevation: 5,
    justifyContent: 'center',
    paddingLeft: 20,
  },
  item: {
    backgroundColor: '#fff',
    padding: 20,
    width: 160,
    height: 140,
    alignItems: 'center',
    // borderWidth: 0.5,
    color: 'black',
    margin: 10,
    borderRadius: 20,
    justifyContent: 'center',
    elevation: 5,
  },
  img: {
    width: 70,
    height: 70,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  sectionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textItem: {
    marginTop: 15,
    color: colors.primaryColor,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

// const renderFlatList = ({item}: {item: SectionType}) => (
//   <>
//     {renderSectionHeader({section: item})}
//     <FlatList
//       data={item.data}
//       renderItem={renderItem}
//       keyExtractor={item => item.id.toString()}
//       numColumns={item.data.length === 1 ? 1 : 2}
//       contentContainerStyle={styles.contentContainerStyle}
//     />
//   </>
// );

// function handleLogout(
//   navigation: StackNavigationProp<RootNavigationProps, 'Home'>,
// ) {
//   Alert.alert(
//     'Xác nhận',
//     'Bạn muốn đăng xuất phải không?',
//     [
//       {
//         text: 'Không',
//         onPress: () => console.log('Không'),
//         style: 'cancel',
//       },
//       {
//         text: 'Có',
//         onPress: () => navigation.navigate('Login'), // Điều hướng đến màn hình đăng nhập
//       },
//     ],
//     {cancelable: false},
//   );
// }

// const renderSectionHeader = ({section: {title}}: {section: SectionType}) => (
//   <View style={styles.sectionContainer}>
//     <Text style={styles.sectionHeader}>{title}</Text>
//   </View>
// );
