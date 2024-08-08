import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  Button,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootNavigationProps} from './types';
import {colors} from '../assets/css/colors';
import {ItemType} from '../components/Data';
import {useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface MyProps {
  navigation: StackNavigationProp<RootNavigationProps, 'Notification'>;
}
type Notes = {
  title: string;
  content: string;
  id: string;
  createAt: string;
  createBy: string;
  updateAt: string;
  thumbnail: string;
};
const Notification = ({navigation}: MyProps) => {
  const [notifications, setNotifications] = useState<Notes[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notes[]>(
    [],
  );
  const [keyword, setKeyword] = useState<string>('');
  const isFocused = useIsFocused();
  const [data, setData] = useState<ItemType[]>([]);
  useEffect(() => {
    getNotes();
  }, [isFocused]);

  useEffect(() => {
    navigation.setOptions({
      title: 'Thông báo',
      headerLeft: () => (
        // <Button onPress={() => navigation.goBack()} title="Go Back" />
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={styles.imge}
            source={require('../assets/images/icons/Back.png')}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const getNotes = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');

      if (!accessToken) {
        console.error('Access token not found in AsyncStorage');
        return;
      }

      const headers = new Headers();
      headers.append('Authorization', `Bearer ${accessToken}`);
      headers.append('Content-Type', 'application/json');

      const response = await fetch('https://orbapi.click/api/Notifications', {
        headers,
        method: 'GET',
      });

      const data = await response.json();

      if (data) {
        const notificationsData = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          content: item.content,
          thumbnail: item.thumbnail,
          createBy: item.createBy,
          createAt: item.createAt,
          updateAt: item.updateAt,
        }));
        setNotifications(notificationsData);
        setFilteredNotifications(notificationsData);
      } else {
        console.error('Error fetching notifications:', data.message);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const filterItemName = (text: string) => {
    setKeyword(text);
    if (text.trim() === '') {
      setFilteredNotifications(notifications);
    } else {
      const filtered = notifications.filter(item =>
        item.title.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredNotifications(filtered);
    }
  };

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
        }}>
        <TextInput
          onChangeText={filterItemName}
          style={{
            borderWidth: 1,
            borderColor: colors.primaryColor,
            height: 40,
            borderRadius: 15,
            paddingLeft: 10,
            backgroundColor: 'white',
            flex: 1,
          }}
          placeholder="Tìm kiếm..."
        />
        {/* <TouchableOpacity
          onPress={filterItemName}
          style={{
            backgroundColor: colors.primaryColor,
            borderRadius: 15,
            width: 40,
            height: 40,
            marginLeft: 10,
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 5,
          }}>
          <Image
            source={require('../assets/images/icons/Search.png')}
            style={{height: 20, width: 20}}
          />
        </TouchableOpacity> */}
      </View>
      {filteredNotifications.length > 0 ? (
        <FlatList
          data={filteredNotifications}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('NotificationDetail', {
                    notification: item,
                  })
                }>
                <View style={styles.notesItem}>
                  <View>
                    <Text style={styles.notificationTitle}>{item.title}</Text>
                    <Text style={styles.notificationsDate}>
                      Ngày: {item.createAt}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      ) : (
        <View style={styles.noDataView}>
          <Text style={styles.title}>Không có thông báo nào tương tự</Text>
        </View>
      )}
    </View>
  );
};

export default Notification;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    width: '100%',
    height: 60,
    backgroundColor: 'white',
    elevation: 5,
    justifyContent: 'center',
    paddingLeft: 20,
  },
  title: {
    color: 'black',
    fontSize: 18,
    fontWeight: '600',
  },
  imge: {
    width: 27,
    height: 27,
    tintColor: '#FFFFFF',
    marginLeft: 10,
  },
  btn: {
    width: 200,
    height: 50,
    borderRadius: 30,
    position: 'absolute',
    right: 20,
    bottom: 20,
    // top: 700,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  notesItem: {
    width: '90%',
    height: 100,
    borderRadius: 15,
    alignSelf: 'center',
    marginBottom: 18,
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    elevation: 5,
  },
  noDataView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationTitle: {
    color: 'black',
    fontWeight: '500',
    paddingBottom: 10,
  },
  notificationsDate: {color: 'black'},
});
