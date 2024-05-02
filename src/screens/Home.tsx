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
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import Splash from './Splash';
import {useIsFocused, useRoute} from '@react-navigation/native';
import Loader from '../components/Loader';
import {RootNavigationProps} from './AppNavigator';
import {colors} from '../assets/css/colors';

interface MyProps {
  navigation: StackNavigationProp<RootNavigationProps, 'Home'>;
}

type ItemType = {
  id: string;
  title: string;
  image: any; // Change the type to 'any'
};

type SectionType = {
  title: string;
  data: ItemType[];
};

const sections: SectionType[] = [
  {
    title: 'Thông báo',
    data: [
      {
        image: require('../assets/images/icons/Notification.png'),
        id: '1',
        title: 'Thông báo',
      },
    ],
  },
  {
    title: 'Truy cập thông tin',
    data: [
      {
        image: require('../assets/images/icons/Calendar.png'),
        id: '2',
        title: 'Thời khóa biểu',
      },
      {
        image: require('../assets/images/icons/Exam.png'),
        id: '3',
        title: 'Kiểm tra',
      },
      // Add more access items here if needed
    ],
  },
  {
    title: 'Báo cáo',
    data: [
      {
        image: require('../assets/images/icons/Attendance.png'),
        id: '4',
        title: 'Điểm danh',
      },
      {
        image: require('../assets/images/icons/Point.png'),
        id: '5',
        title: 'Điểm',
      },
      // Add more report items here if needed
    ],
  },
];
const Home = ({navigation}: MyProps): React.JSX.Element => {
  const [loading, setLoading] = useState<boolean>(false);

  const renderItem = ({item}: {item: ItemType}) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() =>
        Alert.alert(
          'Thông báo',
          'Giá của sản phẩm: $' + '\nTên của sản phẩm: ' + item.title,
        )
      }>
      <Image source={item.image} style={styles.img}></Image>
      <Text style={{marginTop: 30}}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderFlatList = ({item}: {item: SectionType}) => (
    <>
      {renderSectionHeader({section: item})}
      <FlatList
        data={item.data}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={item.data.length === 1 ? 1 : 2}
        contentContainerStyle={{
          justifyContent: item.data.length === 1 ? 'center' : 'flex-start',
          alignItems: item.data.length === 1 ? 'center' : 'flex-start',
        }}
      />
    </>
  );

  const renderSectionHeader = ({section: {title}}: {section: SectionType}) => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionHeader}>{title}</Text>
    </View>
  );
  return (
    <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
      <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
      <View style={styles.header}>
        <Text>Fullstack Notes App</Text>
      </View>
      <FlatList
        data={sections}
        renderItem={renderFlatList}
        keyExtractor={(item, index) => index.toString()}
      />
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
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
    width: 170,
    height: 220,
    alignItems: 'center',
    borderWidth: 0.5,
    color: 'black',
    margin: 10,
    borderRadius: 8,
    justifyContent: 'center',
  },
  img: {
    width: 120,
    height: 120,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
